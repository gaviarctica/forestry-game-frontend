import PlaceTool from './placetool';
import {createLogDepositGraphics} from '../game/logdeposit';

export default class DepositTool extends PlaceTool {
  constructor(stage, level, type) {
    super(stage, level);
    var pointerGraphics;
    if (type !== undefined) {
      pointerGraphics = createLogDepositGraphics([type]);
    } else {
      pointerGraphics = createLogDepositGraphics();      
    }

    this.pointerContainer.addChild(pointerGraphics);

    this.minDistanceFromRoad = 70;
    this.maxDistanceFromRoad = 50;

    this.type = type;
  }

  activate() {
    super.activate();
  }

  mouseMove(mouseInput) {
    super.mouseMove(mouseInput);

    // dont allow placement if mouse over another deposit
    for (var deposit of this.level.getLogDeposits()) {
      if (deposit.isHighlighted()) {
        this.allowPlacement = false;
        this.pointerContainer.alpha = 0.5;
        return;
      }
    }
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