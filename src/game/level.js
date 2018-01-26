import * as PIXI from 'pixi.js';
import RouteNode from './routenode';
import RouteSegment from './routesegment';
import Log from './log';
import LogDeposit from './logdeposit';
import { endpointByStartPointDistanceAndAngle, distance, distanceToSegment } from './helpers';
import {LogType} from './logtypes';
import {Key} from './controls';
import Settings from './settings';

export default class Level {
  constructor(map, updateUI = null, controls = null) {
    this.settings = (new Settings()).map;
    this.map = map;
    this.stage = new PIXI.Container();
    this.routeContainer = new PIXI.Container();
    this.stage.addChild(this.routeContainer);
    this.routeNodes = new Map();
    this.routeNodesNextId = -1; // used for editor
    this.routeSegments = [];
    this.logs = [];
    this.logDeposits = [];
    this.controls = controls;

    this.updateUI = updateUI;
    this.log_toggle_visibility = [0,1,2,3,4,5];

    this.routeTexture = PIXI.Texture.fromImage('/static/road.png');
    this.dyingRouteTexture = PIXI.Texture.fromImage('/static/road_water.png');
    this.weightlimitedRouteTexture = PIXI.Texture.fromImage('/static/road_mud.png');
    this.onewayRouteTexture = PIXI.Texture.fromImage('/static/road_oneway.png');
    this.onewayRouteTextureReverse = PIXI.Texture.fromImage('/static/road_oneway2.png');
    this.routeTransitionTexture = PIXI.Texture.fromImage('/static/road_transition.png');
    this.startingPosition = {x: -1, y: -1, dir: 1};
    if (map) {
      this.parseRouteNodes();
      this.parseLogs();
      this.parseLogDeposits();

      this.generateRouteSegments();
      this.drawRoutes();

      if (map.startpoint) {
        this.startingPosition = map.startpoint;
        this.setStartingSegmentAndInterpFromPosition(map.startpoint);
      } else {
        this.startingSegment = this.routeSegments[0];
        this.startingInterpolation = 0;
      }
    }
  }

  // private method
  setStartingSegmentAndInterpFromPosition(pos) {
    var closestDistance = 1000000;
    var closestRouteSegment = null;
    for (var routeSegment of this.routeSegments) {
      var d = distanceToSegment(pos, routeSegment.startNode.getPos(), routeSegment.endNode.getPos());
      if (d < closestDistance) {
        closestRouteSegment = routeSegment;
        closestDistance = d;
      }
    }
    var routeStart = closestRouteSegment.startNode.getPos();
    this.startingInterpolation = distance(routeStart, pos) / closestRouteSegment.getLength();
    this.startingSegment = closestRouteSegment;

    // manually setting truck direction
    this.startingPosition.dir = pos.dir;
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
    this.routeNodesNextId = this.routeNodesNextId + 1;
    return this.routeNodesNextId;
  }

  drawRoutes() {
    let segmentTexture;
    let anomalyText;
    let transitionTexture;
    let oneway;

    for(var j = 0; j < this.routeSegments.length; ++j) {
      var spos = this.routeSegments[j].startNode.getPos();
      var epos = this.routeSegments[j].endNode.getPos();
      oneway = false;

      // calculating anomalies
      if(this.routeSegments[j].anomalies.length > 0) {
        for(var i = 0; i < this.routeSegments[j].anomalies.length; ++i) {
          if(typeof this.routeSegments[j].anomalies[i]['dying_road'] !== 'undefined') {
            segmentTexture = this.dyingRouteTexture;
            anomalyText = this.routeSegments[j].getDyingRoadText();
          }
          if(typeof this.routeSegments[j].anomalies[i]['weight_limit'] !== 'undefined') {
            segmentTexture = this.weightlimitedRouteTexture;
            anomalyText = this.routeSegments[j].getWeightLimitText();
          }
          if(typeof this.routeSegments[j].anomalies[i]['one_way_road'] !== 'undefined') {
            oneway = true;
            segmentTexture = this.onewayRouteTexture;
            // Use reversed texture if neccessary
            if (this.routeSegments[j].anomalies[i].to === this.routeSegments[j].getPreviousNode().id) {
              segmentTexture = this.onewayRouteTextureReverse;
            }
            anomalyText = this.routeSegments[j].getOneWayRoadSprite();
          }
        }
      } else {
        segmentTexture = this.routeTexture;
      }

      var angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
      var currentPos = {x: spos.x, y: spos.y};
      var tilingSprite = new PIXI.extras.TilingSprite(
        segmentTexture,
        this.settings.ROAD_SPRITE_LENGTH,
        distance(spos, epos)
      );
      tilingSprite.anchor.set(this.settings.TILING_SPRITE_ANCHOR[0], this.settings.TILING_SPRITE_ANCHOR[1]);
      tilingSprite.tileScale.set(this.settings.TILING_SPRITE_SCALE);
      tilingSprite.rotation = angle + Math.PI;
      tilingSprite.x = currentPos.x;
      tilingSprite.y = currentPos.y;
      this.routeContainer.addChild(tilingSprite);

      // If anomalies, add text and transition textures
      if(this.routeSegments[j].anomalies.length > 0) {

        transitionTexture = new PIXI.Sprite.from(this.routeTransitionTexture);
        transitionTexture.anchor.set(0.5, 0);
        transitionTexture.scale.set(0.1);
        transitionTexture.x = spos.x;
        transitionTexture.y = spos.y;
        transitionTexture.rotation = angle + Math.PI;
        this.routeContainer.addChild(transitionTexture);

        transitionTexture = new PIXI.Sprite.from(this.routeTransitionTexture);
        transitionTexture.anchor.set(0.5, 0);
        transitionTexture.scale.set(0.1);
        transitionTexture.x = epos.x;
        transitionTexture.y = epos.y;
        transitionTexture.rotation = angle;
        this.routeContainer.addChild(transitionTexture);

        if (!oneway) {
          this.routeContainer.addChild(anomalyText);
        }
      }
    }

    // Draw nodes
    for(let [id, routeNode] of this.routeNodes) {
      var intersectionSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
      intersectionSprite.anchor.set(this.settings.INTERSECTION_SPRITE_ANCHOR, this.settings.INTERSECTION_SPRITE_ANCHOR);
      intersectionSprite.scale.set(this.settings.INTERSECTION_SPRITE_SCALE);
      intersectionSprite.x = routeNode.getPos().x;
      intersectionSprite.y = routeNode.getPos().y;
      this.routeContainer.addChild(intersectionSprite);
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
    var maxId = 0;
    for (var i = 0; i < this.map.routes.length; ++i) {
      var routeNodeData = this.map.routes[i];
      var id = routeNodeData.route_node;
      if (id > maxId)
        maxId = id;
      var pos = {x: routeNodeData.x, y: routeNodeData.y };
      var to = routeNodeData.to;
      if(typeof routeNodeData['anomalies'] !== 'undefined') {
        var anomalies = routeNodeData.anomalies;
        this.addRouteNode(id, pos, to, anomalies);
      } else {
        this.addRouteNode(id, pos, to);
      }
    }
    // editor needs to know which is the id that should be added next
    this.routeNodesNextId = maxId;
  }

  // used by editor
  addRouteNode(id, pos, to, anomalies = null) {
    this.routeNodes.set(id, new RouteNode(id, pos, to, anomalies));
  }

  // used by editor
  removeRouteNode(removeId) {
    // remove connections if exists
    for (let [id, node] of this.routeNodes) {
      var index = node.to.indexOf(removeId);
      if (index > -1) {
        node.to.splice(index, 1);
      }
    }

    this.routeNodes.delete(removeId);
  }

  // used by editor
  removeRouteSegment(idFrom, idTo) {
    var fromNode = this.routeNodes.get(idFrom);
    var toNode = this.routeNodes.get(idTo);

    var index = fromNode.to.indexOf(idTo);
    if (index > -1) {
      fromNode.to.splice(index, 1);
    }

    if (fromNode.to.length === 0) {
      this.removeRouteNode(idFrom);
    }

    index = toNode.to.indexOf(idFrom);
    if (index > -1) {
      toNode.to.splice(index, 1);
    }

    if (toNode.to.length === 0) {
      this.removeRouteNode(idTo);
    }
  }

  // used by map editor
  refreshRoutes() {
    this.routeSegments = [];
    this.routeContainer.removeChildren();

    // reset, mainly to remove segments from them
    for (let [id, node] of this.routeNodes) {
      node.reset(id, node.point, node.to, node.anomalies);
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

  setStartingPosition(pos) {
    this.startingPosition.x = pos.x;
    this.startingPosition.y = pos.y;
  }

  setTruckDirection(dir) {
    this.startingPosition.dir = dir;
  }

  getStartingSegment() {
    return this.startingSegment;
  }

  getStartingPosition() {
    return this.startingPosition;
  }

  hasCustomStartingPosition() {
    // if starting position has changed from default inited value,
    // then assume we have custom starting position
    return this.startingPosition.x != -1;
  }

  getStaringInterpolation() {
    return this.startingInterpolation;
  }

  clearStartingPosition() {
    this.startingPosition = {x: -1, y: -1, dir: 1};
  }

  getLogs() {
    return this.logs;
  }

  getLogDeposits() {
    return this.logDeposits;
  }

  hasEnoughLogDeposits() {
    // find free deposits
    var numOfFreeDeposits = 0;
    var depositTypes = new Set();
    for (var depo of this.logDeposits) {
      if (depo.types.length === 0)
        numOfFreeDeposits++;
      else if (!depositTypes.has(depo.types[0]))
        depositTypes.add(depo.types[0]);
    }

    // find all pile types
    var pileTypes = new Set();
    for (var log of this.logs) {
      if (!pileTypes.has(log.type)) {
          pileTypes.add(log.type);
      }
    }

    for (var pileType of pileTypes) {
      // has deposit for that pile type
      if (depositTypes.has(pileType))
        continue;

      numOfFreeDeposits = numOfFreeDeposits - 1;
      // not enough free deposits either
      if (numOfFreeDeposits >= 0)
        continue;
      // not enough deposits
      return false;
    }

    // deposits found
    return true;
  }

  // some general updates in the level level
  update(type = false, state = false) {

    // update of logs is done only after key presses
    for (var i = 0; i < 6; ++i) {
      var iStr = (i + 1).toString();
      if(this.controls.wasKeyPressed(Key[iStr])) {
        this.updateLogVisibilityArray(i);
        this.updateLogs();
        break;
      }
    }

    // TODO: Might want to use state check at later date to make sure toggle
    // doesn't break. (Shouldn't be possible break it though.
    // As it reconstructs the state after every toggle)
    if(type !== false) {
      this.updateLogVisibilityArray(parseInt(type));
      this.updateLogs();
    }

  }

  updateLogs() {
    for( let log of this.getLogs() ) {
      log.update(false);
      for(let type of this.log_toggle_visibility) {
        if(log.update(type)) break;
      }
    }
  }

  updateLogVisibilityArray(type) {
    var has_type = false;

    // finding if we already have typein our array
    for(var i = 0; i < this.log_toggle_visibility.length; ++i) {
      if(this.log_toggle_visibility[i] === type) {
        has_type = i;
        break;
      }
    }

    // comparing if we toggle type off or on
    if(has_type !== false) {
      this.log_toggle_visibility.splice(has_type, 1);
    } else {
      this.log_toggle_visibility.push(type);
    }

    // updating the UI
    var uiUpdate = { '0': false, '1': false, '2': false, '3': false, '4': false, '5': false };

    for(let prop in uiUpdate) {
      uiUpdate[[prop]] = true;
      for(let logvis of this.log_toggle_visibility) {
        uiUpdate[[prop]] = true;

        if(logvis === parseInt(prop)) {
          uiUpdate[[prop]] = false;
          break;
        }
      }
    }

    this.updateUI( {
      hideLogType: uiUpdate
    })
  }

  serialize(fog) {
    var routes = [];
    for (let [id, node] of this.routeNodes) {
      var pos = node.getPos();

      if(node.anomalies && node.anomalies.length === 1) {
        routes.push({route_node: id, x: pos.x, y: pos.y, to: node.to, anomalies: node.anomalies});

      } else {
        routes.push({route_node: id, x: pos.x, y: pos.y, to: node.to});
      }
    }

    var logs = []
    for (var log of this.logs) {
      pos = log.getPosition();
      logs.push({x: pos.x, y: pos.y, rot: log.getRotation(), type: log.type});
    }

    var deposits = [];
    for (var deposit of this.logDeposits) {
      pos = deposit.getPosition();
      deposits.push({x: pos.x, y: pos.y, rot: deposit.getRotation(), type: deposit.types[0]});
    }

    var startingSegmentIdx = 0;
    for (var i = 0; i < this.routeSegments.length; ++i) {
      if (this.routeSegments[i] === this.startingSegment) {
        startingSegmentIdx = i;
        break;
      }
    }

    var weather = {}
    if (fog.enabled) {
      weather.type = 'fog';
      weather.density = fog.density;
      weather.visibility = fog.visibility;
    }

    return {
      startpoint: this.startingPosition,
      routes: routes,
      logs: logs,
      logdeposits: deposits,
      weather: weather
    };
  }

  getInfo(fog) {

    var pileTypes = {'0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0};
    for (var log of this.logs) {
      pileTypes[log.type] += 1;
    }

    var totalRouteLength = 0;
    for (var segment of this.routeSegments) {
      totalRouteLength += segment.getLength();
    }

    var anomalies = false;
    for (let [id, node] of this.routeNodes) {
      if(node.anomalies && node.anomalies.length === 1) {
        anomalies = true;
      }
    }

    var weather = {}
    if (fog.enabled) {
      weather.type = 'fog';
      weather.density = fog.density;
      weather.visibility = fog.visibility;
    }

    return {
      pileTypes: pileTypes,
      routeLength: Math.round(totalRouteLength / this.settings.PIXELS_TO_METERS),
      storageAreas: this.logDeposits.length,
      anomalies: anomalies,
      weather: weather
    };

  }
}
