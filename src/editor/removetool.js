import * as PIXI from 'pixi.js';
import {length,distance,distanceToSegment} from '../game/helpers';
import ITool from './itool';
import Settings from '../game/settings';


export default class RemoveTool extends ITool {
  constructor(stage, level, truckSprite) {
    super(stage);

    this.level = level;
    this.snappedToSegment = null;
    this.snappingDistance = 35;

    this.anomaly_settings = new Settings().anomalies;

    var pointer = new PIXI.Graphics();
    pointer.lineStyle(2, 0xff0000);
    pointer.moveTo(-10, -10);
    pointer.lineTo(10, 10);
    pointer.moveTo(-10, 10);
    pointer.lineTo(10, -10);

    // truck sprite reference, so we can remove it from the
    // scene graph if we remove road where the truck lays
    this.truckSprite = truckSprite;

    this.pointerContainer.addChild(pointer);

  }

  activate() {
    super.activate();
  }

  mouseMove(mouseInput) {
    super.mouseMove(mouseInput);

    var epos = mouseInput.worldPosition;
    this.pointerContainer.position.set(epos.x, epos.y);
    this.pointerContainer.alpha = 0.2;

    this.targetLog = null;
    this.targetDeposit = null;
    this.targetNodeId = null;

    for (var log of this.level.getLogs()) {
      if (log.isHighlighted()) {
        this.pointerContainer.alpha = 1.0
        this.targetLog = log;
        return;
      }
    }

    for (var deposit of this.level.getLogDeposits()) {
      if (deposit.isHighlighted()) {
        this.pointerContainer.alpha = 1.0
        this.targetDeposit = deposit;
        return;
      }
    }

    // Do linear search and snap to that
    for (let [id, node] of this.level.getRouteNodes()) {
      // find closest
      // move pointer to that if close enough and target it
      if (distance(node.getPos(), epos) < this.snappingDistance) {
        this.pointerContainer.alpha = 1.0
        this.pointerContainer.position.set(node.getPos().x, node.getPos().y);
        this.targetNodeId = id;
        return;
      }
    }

    this.calculateSnappedSegment(epos);


    if(this.snappedToSegment !== null) {
      var segment = this.snappedToSegment;
      // getting all available anomaly info from the nodesconfi

      segment.weight_limit_text.style.fill = this.anomaly_settings.SNAPPED_HIGHLIGHT_COLOR;
      segment.dying_road_text.style.fill = this.anomaly_settings.SNAPPED_HIGHLIGHT_COLOR;

      this.snappedToSegment.weight_limit_text.style.fill = this.anomaly_settings.SNAPPED_HIGHLIGHT_COLOR;
      this.snappedToSegment.dying_road_text.style.fill = this.anomaly_settings.SNAPPED_HIGHLIGHT_COLOR;
    }
  }
  mouseDown(mouseInput) {

  }
  mouseUp(mouseInput) {
    super.mouseUp(mouseInput);

    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if (this.targetLog) {
      this.level.removeLog(this.targetLog);
    } else if (this.targetDeposit) {
      this.level.removeDeposit(this.targetDeposit);
    } else if (this.targetNodeId !== null) {
      this.level.removeRouteNode(this.targetNodeId);
      this.level.refreshRoutes();
      this.validateRoadSegmentNearTruck();
    } else if(this.snappedToSegment) {
      // if we are snapped to a segment we try to remove its anomalies
      // if there was not anomalies to remove then remove the segment itself
      if (!this.snappedToSegment.removeAnomalies()) {
        this.level.removeRouteSegment(this.snappedToSegment.startNode.id,
                                      this.snappedToSegment.endNode.id);
      }
      this.level.refreshRoutes();
      this.validateRoadSegmentNearTruck();
    }
  }


  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }

  calculateSnappedSegment(mousePos) {
    // do a search for nearest node in snapping distance
    this.snappedToSegment = null;
    this.level.refreshRoutes();

    var segments = this.level.getRouteSegments();
    var segment_amount = segments.length;

    for (var i = 0; i < segment_amount; ++i) {
      var segment = segments[i];
      var segment_pos = {
        x: (segment.endNode.getPos().x + segment.startNode.getPos().x) / 2,
        y: (segment.endNode.getPos().y + segment.startNode.getPos().y) / 2
      };

      if (distance(mousePos, segment_pos) < this.snappingDistance) {
        this.pointerContainer.alpha = 1.0
        this.pointerContainer.position.set(segment_pos.x, segment_pos.y);
        this.snappedToSegment = segment;
        break;
      }
    }

    return this.snappedToSegment;
  }

  validateRoadSegmentNearTruck()
  {
    var pos = { x: this.truckSprite.x, y: this.truckSprite.y };
    // do a search for nearest node in snapping distance
    var closestDistance = 10000;
    for (var routeSegment of this.level.getRouteSegments()) {
      var d = distanceToSegment(pos, routeSegment.startNode.getPos(), routeSegment.endNode.getPos());

      if (d < closestDistance) {
        closestDistance = d;
      }
    }

    if (closestDistance > 2) {
      this.stage.removeChild(this.truckSprite);
      this.level.clearStartingPosition();
    }
  }
}
