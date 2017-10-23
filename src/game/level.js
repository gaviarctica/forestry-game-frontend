import * as PIXI from 'pixi.js';
import RouteSegment from './routesegment';

export default class Level {
  constructor(map, stage) {
    this.map = map;
    this.stage = stage;
    this.routeSegments = [];
    this.logs = [];

    this.drawRoutes();
    this.parseRouteSegments();
    this.parseLogs();
    this.drawLogs();
  }

  drawRoutes() {
    var routeGraphics = new PIXI.Graphics();
      routeGraphics.lineStyle(50, 0xa57d4c, 1);

      for (var i = 0; i < this.map.routes.length; i++) {
        for (var j = 0; j < this.map.routes[i].length; j++) {
          var pos = this.map.routes[i][j];
          if (j === 0) {
            routeGraphics.moveTo(pos.x, pos.y);
          } else {
            routeGraphics.lineTo(pos.x, pos.y);
          }
        }
      }

      routeGraphics.endFill();
      this.stage.addChild(routeGraphics);
  }

  parseRouteSegments() {
    var previousSegment = null;
    for (var i = 0; i < this.map.routes.length; i++) {
      for (var j = 0; j < this.map.routes[i].length - 1; j++) {
        var startPos = this.map.routes[i][j];
        var endPos = this.map.routes[i][j + 1];

        var segment = new RouteSegment(startPos, endPos, null, previousSegment);
        this.routeSegments.push(segment);
        if (previousSegment !== null) {
          previousSegment.setNext(segment);
        }

        previousSegment = segment;
        
      }
    }    
  }

  parseLogs() {

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

  drawLogs() {

  }
} 