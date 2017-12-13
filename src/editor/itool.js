// abstract base class for tools to inherit and override

export default class ITool {
    constructor(stage){
        this.stage = stage;
    }

    activate() {}
    mouseMove(mouseInput) {}
    mouseDown() {}
    mouseUp() {}
    keyDown(event) {}
    keyUp(event) {}
    deactivate() {}
}