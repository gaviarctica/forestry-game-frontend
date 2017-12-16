import * as PIXI from 'pixi.js';
import {length} from '../game/helpers';
import ITool from './itool';
import Log from '../game/log';
import LogDeposit from '../game/logdeposit';


export default class RemoveTool extends ITool {
  constructor(stage, level) {
    super(stage);

    this.level = level;
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
  }


  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }
}