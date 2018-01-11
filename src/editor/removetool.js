import * as PIXI from 'pixi.js';
import {length,distance} from '../game/helpers';
import ITool from './itool';
import Log from '../game/log';
import LogDeposit from '../game/logdeposit';
import {nodeHasAnomalyTo} from './anomalytool';
import Settings from '../game/settings';


export default class RemoveTool extends ITool {
  constructor(stage, level) {
    super(stage);

    this.level = level;
    this.snappedToSegment = null;
    this.segmentSnappingDistance = 35;

    this.anomaly_settings = new Settings().anomalies;

    var pointer = new PIXI.Graphics();
    pointer.lineStyle(2, 0xff0000);
    pointer.moveTo(-10, -10);
    pointer.lineTo(10, 10);
    pointer.moveTo(-10, 10);
    pointer.lineTo(10, -10);


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
    this.targetNode = null;

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

    /* TODO:

    // Do nearest neightbor search and snap to that
    for (var node of this.level.getRouteNodes()) {
      // find closest
      // move pointer to that if close enough and target it
    }

    */

    this.calculateSnappedSegment(epos);


    if(this.snappedToSegment !== null) {
      var segment = this.snappedToSegment;
      // getting all available anomaly info from the nodes
      var snode = nodeHasAnomalyTo(segment.startNode,segment.endNode);
      var enode = nodeHasAnomalyTo(segment.endNode,segment.startNode);
      var node_data = snode.node ? snode : enode;

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
      } else if (this.targetNode) [
        // TODO: this.level.removeRouteNode(this.targetNode);
      ]

    // if we are snapped to a segment we try to remove its anomalies
    if(this.snappedToSegment) {
      this.snappedToSegment.removeAnomalies();
      this.level.refreshRoutes();
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

      if (distance(mousePos, segment_pos) < this.segmentSnappingDistance) {
        this.pointerContainer.position.set(segment_pos.x, segment_pos.y);
        this.snappedToSegment = segment;
        break;
      }
    }

    return this.snappedToSegment;
  }
}
