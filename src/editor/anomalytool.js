import ITool from './itool';
import * as PIXI from 'pixi.js';
import {length, distance} from '../game/helpers';
import Settings from '../game/settings';

export default class AnomalyTool extends ITool {
  constructor(stage, level) {
    super(stage);

    this.level = level;

    this.settings = new Settings().anomalies;

    this.weight_limit_pointer_sprite = null;

    this.current_pointer_sprite = this.getWeightLimitPointerSprite();
    this.pointerContainer.addChild(this.current_pointer_sprite);

    this.anomaly_container = new PIXI.Container();

    this.snappedToSegment = null;
    this.snappingDistance = 35;
  }

  getWeightLimitPointerSprite() {
    if(this.weight_limit_pointer_sprite === null) {
      this.weight_limit_pointer_sprite = new PIXI.Text( 0 + 'kg',this.settings.WEIGHT_LIMIT_TEXT_FONT);

      this.weight_limit_pointer_sprite.anchor.set(0.5, 0.5);
      this.weight_limit_pointer_sprite.scale.set(this.settings.WEIGHT_LIMIT_TEXT_SCALE);
    }

    return this.weight_limit_pointer_sprite;
  }

  // created function for this to have it manually get when necessary
  getSnappedSegment(force_calc = false) {
    if(!force_calc && typeof this.snappedToSegment != 'undefined' && this.snappedToSegment !== null)
        return this.snappedToSegment;

    this.snappedToSegment = null;

  }

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    this.pointerContainer.position = epos;

    // do a search for nearest node in snapping distance
    this.snappedToSegment = null;
    this.level.refreshRoutes();

    var segments = this.level.getRouteSegments();
    var segment_amount =  segments.length;

    for (var i = 0; i < segment_amount; ++i) {
      var segment = segments[i];
      var segment_pos = {
        x: (segment.endNode.getPos().x + segment.startNode.getPos().x) / 2,
        y: (segment.endNode.getPos().y + segment.startNode.getPos().y) / 2
      };

      if (distance(mouseInput.worldPosition, segment_pos) < this.snappingDistance) {
        this.pointerContainer.position.set(segment_pos.x, segment_pos.y);
        this.snappedToSegment = segment;
        epos = segment_pos;
        break;
      }
    }

    //toggling visibility of pointer if we have snapped and there is anomaly
    if(this.snappedToSegment !== null && this.snappedToSegment.startNode.anomalies.length !== 0) {
      this.snappedToSegment.weight_limit_text.style.fill = 0x00FF00;
      this.pointerContainer.visible = false;
    } else {
      this.pointerContainer.visible = true;
    }

  }

  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if(this.snappedToSegment !== null) {
      if (this.snappedToSegment.startNode.anomalies.length === 0 && this.snappedToSegment.endNode.anomalies.length === 0) {
        this.snappedToSegment.startNode.anomalies = [{to:this.snappedToSegment.endNode.getId(), weight_limit:1}];
        this.snappedToSegment.weight_limit = 1;
      } else {
        this.snappedToSegment.startNode.anomalies[0].weight_limit++;
      }

      this.snappedToSegment.weight_limit_text.text = this.snappedToSegment.startNode.anomalies[0].weight_limit + 'kg';

    }
  }

  keyDown(event) {}

  keyUp(event) {
    var self = this;
    if(self.snappedToSegment) {
      // with other anomalies it'll probably be necessary to check both directions
      // weight limit is updated with number keys
      if(self.snappedToSegment.startNode.anomalies.length !== 0)
        var number = parseInt(event.key);
        // console.log(event.key);
        if(number || number === 0) {
          if (self.snappedToSegment.startNode.anomalies.length === 0 && self.snappedToSegment.endNode.anomalies.length === 0) {
            self.snappedToSegment.startNode.anomalies = [{to:self.snappedToSegment.endNode.getId(), weight_limit:1}];
            self.snappedToSegment.weight_limit = number;
          } else {
            self.snappedToSegment.startNode.anomalies[0].weight_limit =
            self.snappedToSegment.startNode.anomalies[0].weight_limit * 10 + number;
          }
        } else if(event.key === 'Backspace') {
          if(!(self.snappedToSegment.startNode.anomalies.length === 0 && self.snappedToSegment.endNode.anomalies.length === 0)) {
            self.snappedToSegment.startNode.anomalies[0].weight_limit =
            Math.floor(self.snappedToSegment.startNode.anomalies[0].weight_limit / 10);
          }
        }

        // refreshing routes to keep ui look responsive
        self.level.refreshRoutes();
    }
  }

  // for drawing purposes
  getAnomalyContainer() {
    return this.anomaly_container;
  }

  activate() {
    super.activate();
    this.stage.addChildAt(this.anomaly_container,2);
  }

  deactivate() {
    super.deactivate();
    this.stage.removeChild(this.anomaly_container);
  }
}
