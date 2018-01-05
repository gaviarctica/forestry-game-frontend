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

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    this.pointerContainer.position = epos;

    // do a search for nearest node in snapping distance
    this.snappedToSegment = null;
    this.level.refreshRoutes();

    var segment_amount = this.level.getRouteSegments().length;

    for (var i = 0; i < segment_amount; ++i) {
      var segment = this.level.getRouteSegments()[i];
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
  }

  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if(this.snappedToSegment !== null) {
      this.snappedToSegment.weight_limit = 2;
      this.snappedToSegment.weight_limit_text.text = this.snappedToSegment.weight_limit + 'kg';
      //this.anomaly_container.removeChildren();
      this.anomaly_container.addChild(this.snappedToSegment.weight_limit_text);
      console.log("Segment: " + this.snappedToSegment.weight_limit);
      console.log("Pos: " + this.snappedToSegment.weight_limit_text.position.x + ", " + this.snappedToSegment.weight_limit_text.position.y);
      console.log(this.stage.children);
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
