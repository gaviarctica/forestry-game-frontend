//  base class for tools to inherit and override
import * as PIXI from 'pixi.js';

export default class ITool {
  constructor(stage){
    this.stage = stage;
    this.pointerContainer = new PIXI.Container();
    
  }

  activate() {
    this.stage.addChild(this.pointerContainer);
  }
  mouseMove(mouseInput) {}
  mouseDown(mouseInput) {}
  mouseUp(mouseInput) {}
  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    this.stage.removeChild(this.pointerContainer);
  }
}