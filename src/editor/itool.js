// abstract base class for tools to inherit and override

export class ITool {
    constructor(){
    }

    activate() {}
    mouseMove(mouseInput) {}
    mouseDown() {}
    mouseUp() {}
    keyDown(event) {}
    keyUp(event) {}
    deactivate() {}
}