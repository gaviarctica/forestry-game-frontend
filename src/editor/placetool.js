import ITool from './itool';
import * as PIXI from 'pixi.js';
import {length, distance, distanceToSegment} from '../game/helpers';

// base class for log, deposit, truck tools
export default class PlaceTool extends ITool {
  constructor(stage, level) {
    super(stage);
    this.level = level;
    this.minDistanceFromRoad = 70;
    this.maxDistanceFromRoad = 25;
    this.angle = 0;
  }

  activate() {
    super.activate();
  }

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    
    // do a search for nearest node in snapping distance
    this.closestDistance = 10000;
    this.closestRouteSeg = null;
    for (var routeSegment of this.level.getRouteSegments()) {
      var d = distanceToSegment(epos, routeSegment.startNode.getPos(), routeSegment.endNode.getPos());

      if (d < this.closestDistance) {
        this.closestRouteSeg = routeSegment;
        this.closestDistance = d;
      }
    }

    if (this.closestDistance < this.minDistanceFromRoad 
     && this.closestDistance > this.maxDistanceFromRoad) {
      this.allowPlacement = true;
      this.pointerContainer.alpha = 1;
    } else {
      this.allowPlacement = false;
      this.pointerContainer.alpha = 0.5;
    }

    if (this.closestRouteSeg) {
      var routeStart = this.closestRouteSeg.startNode.getPos();
      var routeEnd = this.closestRouteSeg.endNode.getPos();
      this.angle = Math.atan2(routeStart.y - routeEnd.y, routeStart.x - routeEnd.x) + Math.PI;
      
      this.pointerContainer.rotation = this.angle;
    }

    this.pointerContainer.position.set(epos.x, epos.y);
    this.pointerPos = epos;

  }
  mouseDown(mouseInput) {

  }
  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if (this.allowPlacement) {
      this.placeItem(this.pointerPos, this.angle);
    }
  }

  placeItem() {
    console.error("Please implement placeItem() in derived class");
  }

  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }
}