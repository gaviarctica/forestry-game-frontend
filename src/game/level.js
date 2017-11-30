import * as PIXI from 'pixi.js';
import RouteNode from './routenode';
import RouteSegment from './routesegment';
import Log from './log';
import LogDeposit from './logdeposit';
import { endpointByStartPointDistanceAndAngle, distance } from './helpers';

export default class Level {
  constructor(map, stage) {
    this.map = map;
    this.stage = stage;
    this.routeNodes = [];
    this.routeSegments = [];
    this.logs = [];
    this.logDeposits = [];

    this.parseNodes();
    this.parseRouteSegments();
    this.drawRoutes();
    this.parseLogs();
    this.parseLogDeposits();
  }

  drawRoutes() {
    const roadSpriteLength = 50;

    for(var i = 0; i < this.routeNodes.length; ++i) {
      var segments = this.routeNodes[i].getSegments();
      for(var j = 0; j < segments.length; ++j) {
        var spos = segments[j].startNode.getPos();
        var epos = segments[j].endNode.getPos();

        var angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
        var currentPos = {x: spos.x, y: spos.y};
        var roadSprite;
        var distanceToEnd = 0;

        while (!this.pastEndPosition(spos, epos, currentPos)) {
          roadSprite = new PIXI.Sprite.fromImage('/static/road.png');
          roadSprite.anchor.set(0.5, 0.0);
          roadSprite.scale.set(0.1);
          roadSprite.rotation = angle + Math.PI;
          roadSprite.x = currentPos.x;
          roadSprite.y = currentPos.y;

          // Make last texture chunk shorter if needed
          distanceToEnd = distance(currentPos, epos);
          if (distanceToEnd < roadSpriteLength) {
            roadSprite.height = distanceToEnd;
          }

          this.stage.addChild(roadSprite);

          // Calculate starting point for next texture chunk
          currentPos = endpointByStartPointDistanceAndAngle(currentPos, roadSpriteLength, angle - Math.PI / 2);
        }
      }
    }

    for(i = 0; i < this.routeNodes.length; ++i) {
      var intersectionSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
      intersectionSprite.anchor.set(0.5, 0.5);
      intersectionSprite.scale.set(0.1);
      intersectionSprite.x = this.routeNodes[i].getPos().x;
      intersectionSprite.y = this.routeNodes[i].getPos().y;
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

  parseNodes() {
    for (var i = 0; i < this.map.routes.length; ++i) {
      this.routeNodes.push(new RouteNode(this.map.routes[i], []));
    }
  }

  parseRouteSegments() {

    for (var i = 0; i < this.routeNodes.length; ++i) {
      var startNode = this.routeNodes[i];
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

      if(Array.isArray(this.routeNodes[i].getPos().to)) {
        for(var j = 0; j < this.routeNodes[i].getPos().to.length; ++j) {
          var the_k = -1;
          for (var k = 0; k < this.routeNodes.length; ++k) {
            if(this.routeNodes[k].getPos().route_node === this.routeNodes[i].getPos().to[j]) {
              endNode = this.routeNodes[k];
              the_k = k;
            }
          }

          segment = new RouteSegment(startNode, endNode);
          this.routeNodes[i].addSegment(segment);
          this.routeNodes[the_k].addSegment(segment);
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


  parseLogs() {
    for (var i = 0; i < this.map.logs.length; ++i) {
      var logData = this.map.logs[i];
      var log = new Log({x: logData.x, y: logData.y}, logData.type, this.stage);
      this.logs.push(log);
    }
  }

  parseLogDeposits() {
    for (var i = 0; i < this.map.logdeposits.length; ++i) {
      var depoData = this.map.logdeposits[i];
      var logDeposit = new LogDeposit({x: depoData.x, y: depoData.y}, depoData.type, this.stage);
      this.logDeposits.push(logDeposit);
    }
  }

  getRouteSegments() {
    return this.routeSegments;
  }

  getStartingSegment() {
    return this.routeSegments[0];
  }

  getLogs() {
    return this.logs;
  }

  getLogDeposits() {
    return this.logDeposits;
  }
}
