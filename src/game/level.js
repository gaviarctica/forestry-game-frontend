import * as PIXI from 'pixi.js';
import RouteNode from './routenode';
import RouteSegment from './routesegment';
import Log from './log';
import LogDeposit from './logdeposit';
import { endpointByStartPointDistanceAndAngle, distance } from './helpers';
import {LogType} from './logtypes'

export default class Level {
  constructor(map) {
    this.map = map;
    this.stage = new PIXI.Container();
    this.routeContainer = new PIXI.Container();
    this.stage.addChild(this.routeContainer);
    this.routeNodes = new Map();
    this.routeSegments = [];
    this.logs = [];
    this.logDeposits = [];
    this.routeTexture = PIXI.Texture.fromImage('/static/road.png');
    
    if (map) {
      this.parseRouteNodes();
      this.parseLogs();
      this.parseLogDeposits();

      this.generateRouteSegments();
      this.drawRoutes();

      if (map.startseg) {
        this.startingSegment = this.routeSegments[map.startseg]; 
      } else {
        this.startingSegment = this.routeSegments[0];
      }

      if (map.startinterp) {
        this.startingInterpolation = map.startinterp;
      } else {
        this.startingInterpolation = 0;
      }
    }

  }

  getStage() {
    return this.stage;
  }

  // used by map editor
  getRouteNodes() {
    return this.routeNodes;
  }

  // used by map editor
  getNextRouteNodeId() {
    return this.routeNodes.size + 1;
  }

  drawRoutes() {
    const roadSpriteLength = 50;

    for(var j = 0; j < this.routeSegments.length; ++j) {
      var spos = this.routeSegments[j].startNode.getPos();
      var epos = this.routeSegments[j].endNode.getPos();

      var angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
      var currentPos = {x: spos.x, y: spos.y};
      var roadSprite;
      var distanceToEnd = 0;
      var tilingSprite = new PIXI.extras.TilingSprite(
        this.routeTexture, 
        roadSpriteLength,
        distance(spos, epos)
      );
      tilingSprite.anchor.set(0.5, 0.0);
      tilingSprite.tileScale.set(0.1);
      tilingSprite.rotation = angle + Math.PI;
      tilingSprite.x = currentPos.x;
      tilingSprite.y = currentPos.y;
      this.stage.addChild(tilingSprite);
    }

    for(let [id, routeNode] of this.routeNodes) {
      var intersectionSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
      intersectionSprite.anchor.set(0.5, 0.5);
      intersectionSprite.scale.set(0.1);
      intersectionSprite.x = routeNode.getPos().x;
      intersectionSprite.y = routeNode.getPos().y;
      this.stage.addChild(intersectionSprite);
    }
  }

  pastEndPosition(spos, epos, cpos) {
    if ((spos.x < epos.x && cpos.x > epos.x) ||
        (spos.x > epos.x && cpos.x < epos.x) ||
        (spos.y < epos.y && cpos.y > epos.y) ||
        (spos.y > epos.y && cpos.y < epos.y)) {
      return true;
    }
    return false;
  }

  parseRouteNodes() {
    for (var i = 0; i < this.map.routes.length; ++i) {
      var routeNodeData = this.map.routes[i];
      var id = routeNodeData.route_node;
      var pos = {x: routeNodeData.x, y: routeNodeData.y };
      var to = routeNodeData.to;
      this.addRouteNode(id, pos, to);
    }
  }

  addRouteNode(id, pos, to) {
    this.routeNodes.set(id, new RouteNode(id, pos, to));
  }

  // used by map editor
  refreshRoutes() {
    this.routeSegments = [];
    this.routeContainer.removeChildren();

    // reset, mainly to remove segments from them
    for (let [id, node] of this.routeNodes) {
      node.reset(id, node.point, node.to);
    }

    this.generateRouteSegments();
    this.drawRoutes();
  }

  generateRouteSegments() {

    for (let [id, startNode] of this.routeNodes) {
      var endNode = null;
      var segment = null;
      // checking if there is multiple routes from this node
      // if not we just use default settings

      /** REMOVED SUPPORT FOR AUTOMATIC NEXT NODE **/
      /** It was removed because there were some interesting problems with dublicate segments **/
      // if(!startNode.getPos().to && i < this.routeNodes.length-1) {
      //   endNode = this.routeNodes[i+1];
      //   segment = new RouteSegment(startNode, endNode);
      //   this.routeNodes[i].addSegment(segment);
      //   this.routeSegments.push(segment);
      //
      // } else

      // check if node has any waypoints and create segments between them
      if(Array.isArray(startNode.getTo())) {
        for(var j = 0; j < startNode.getTo().length; ++j) {
          var toNodeId = startNode.getTo()[j];
          endNode = this.routeNodes.get(toNodeId);
          
          // don't add segment twice if already connected
          if (startNode.hasSegmentWithNodes(endNode, startNode))
            continue;

          segment = new RouteSegment(startNode, endNode);
          startNode.addSegment(segment);
          endNode.addSegment(segment);
          this.routeSegments.push(segment);
        }
      }
    }

    // calculating segments for nodes
    // for(i = 0; i < this.routeNodes.length; ++i) {
    //   for(j = 0; j < this.routeSegments.length; ++j) {
    //     if(this.routeNodes[i] === this.routeSegments[j].getPreviousNode() || this.routeNodes[i] === this.routeSegments[j].getNextNode())
    //       this.routeNodes[i].addSegment(this.routeSegments[j]);
    //   }
    // }

    // var previousSegment = null;
    // for (var i = 0; i < this.map.routes.length; i++) {
    //   for (var j = 0; j < this.map.routes[i].length - 1; j++) {
    //     var startPos = this.map.routes[i][j];
    //     var endPos = this.map.routes[i][j + 1];
    //
    //     var segment = new RouteSegment(startPos, endPos, null, previousSegment);
    //     this.routeSegments.push(segment);
    //     if (previousSegment !== null) {
    //       previousSegment.setNext(segment);
    //     }
    //
    //     previousSegment = segment;
    //
    //   }
    // }
  }

  addLog(position, rotation, type) {
    var log = new Log(position, rotation, type, this.stage);
    this.logs.push(log);
  }

  removeLog(log) {
    log.removeFromStage();
    var index = this.logs.indexOf(log);
    if (index !== -1) {
      this.logs.splice(index, 1);
    }
  }

  parseLogs() {
    for (var i = 0; i < this.map.logs.length; ++i) {
      var logData = this.map.logs[i];
      this.addLog({x: logData.x, y: logData.y}, logData.rot, logData.type);
    }
  }

  addDeposit(position, rotation, type) {
    var logDeposit = new LogDeposit(position, rotation, type, this.stage);
    this.logDeposits.push(logDeposit);
  }

  removeDeposit(deposit) {
    deposit.removeFromStage();
    var index = this.logDeposits.indexOf(deposit);
    if (index !== -1) {
      this.logDeposits.splice(index, 1);
    }
  }

  parseLogDeposits() {
    for (var i = 0; i < this.map.logdeposits.length; ++i) {
      var depoData = this.map.logdeposits[i];
      this.addDeposit({x: depoData.x, y: depoData.y}, depoData.rot, depoData.type);
    }
  }

  getRouteSegments() {
    return this.routeSegments;
  }

  setStartingSegment(segment, interp) {
    this.startingSegment = segment;
    this.startingInterpolation = interp;
  }

  getStartingSegment() {
    return this.startingSegment;
  }

  getStaringInterpolation() {
    return this.startingInterpolation;
  }

  getLogs() {
    return this.logs;
  }

  getLogDeposits() {
    return this.logDeposits;
  }

  serialize() {
    var routes = [];
    for (let [id, node] of this.routeNodes) {
      var pos = node.getPos();
      routes.push({route_node: id, x: pos.x, y: pos.y, to: node.to});
    }

    var logs = []
    for (var log of this.logs) {
      var pos = log.getPosition();
      logs.push({x: pos.x, y: pos.y, rot: log.getRotation(), type: log.type});
    }

    var deposits = [];
    for (var deposit of this.logDeposits) {
      var pos = deposit.getPosition();
      deposits.push({x: pos.x, y: pos.y, rot: deposit.getRotation(), type: deposit.type});
    }

    var startingSegmentIdx = 0;
    for (var i = 0; i < this.routeSegments.length; ++i) {
      if (this.routeSegments[i] === this.startingSegment) {
        startingSegmentIdx = i;
        break;
      }
    }

    return {
      startpoint: this.getStartingSegment().getPositionAt(this.startingInterpolation),
      startseg: startingSegmentIdx,
      startinterp: this.startingInterpolation,
      routes: routes, 
      logs: logs, 
      logdeposits: deposits
    };
  }

  getInfo() {

    var pileTypes = [];
    for (var log of this.logs) {
      for (var pileType of pileTypes) {
        if (pileTypes.type === log.type) {
          pileTypes.amount += 1;
          break;
        }
      }

      pileTypes.push({name: LogType[log.type].name, type: log.type, amount: 1});
    }

    var totalRouteLength = 0;
    for (var segment of this.routeSegments) {
      totalRouteLength += segment.getLength();
    }

    return {
      pileTypes: pileTypes, 
      routeLength: Math.round(totalRouteLength), 
      storageAreas: this.logDeposits.length,
      passingLimit: false
    };

  }
}
