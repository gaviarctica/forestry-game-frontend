import * as PIXI from 'pixi.js';
import {length, distance, distanceToSegment} from '../game/helpers';
import PlaceTool from './placetool';

export default class LogTool extends PlaceTool {
  constructor(stage, level, type) {
    super(stage, level);
    var pointerSprite = PIXI.Sprite.fromImage('/static/log' + type + '.png');
    pointerSprite.anchor.set(0.5, 0.5);
    pointerSprite.scale.set(0.1);

    this.pointerContainer.addChild(pointerSprite);

    this.minDistanceFromRoad = 70;
    this.maxDistanceFromRoad = 25;

    this.type = type;
  }

  activate() {
    super.activate();
  }

  mouseMove(mouseInput) {
    super.mouseMove(mouseInput);

  }
  mouseDown(mouseInput) {

  }
  mouseUp(mouseInput) {
    super.mouseUp(mouseInput);
  }

  placeItem(position, angle) {
    this.level.addLog(position, angle, this.type)
  }

  // TODO: change sprite
  setType(type) {
    this.type = type;
  }

  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }
}