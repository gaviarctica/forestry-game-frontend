import * as PIXI from 'pixi.js';
import PlaceTool from './placetool';
import {createLogDepositGraphics} from '../game/logdeposit';

export default class DepositTool extends PlaceTool {
  constructor(stage, level) {
    super(stage, level);
    var pointerGraphics = createLogDepositGraphics();

    this.pointerContainer.addChild(pointerGraphics);

    this.minDistanceFromRoad = 70;
    this.maxDistanceFromRoad = 50;

    this.type = -1;
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
    this.level.addDeposit(position, angle, this.type)
  }

  setType(type) {
      this.type = type;
  }

  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }
}