import ITool from './itool';
import * as PIXI from 'pixi.js';
export default class RoadTool extends ITool {
    
    constructor(stage) {
        super(stage);

        this.graphics = new PIXI.Graphics();
    }

    activate() {
        super.activate();
    }

    mouseMove(mouseInput) {


    }
    mouseDown() {}
    mouseUp() {}
    keyDown(event) {}
    keyUp(event) {}
    deactivate() {
        super.deactivate();
    }
}