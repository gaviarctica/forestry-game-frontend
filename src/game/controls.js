
export const Key = {
 Left: 37,
 Up: 38,
 Right: 39,
 Down: 40,
 Space: 32,
 Q: 81,
 E: 69
} 

export default class Controls {
  constructor() {
    this.keys = [];
    for (var i = 0; i < 255; ++i) {
      this.keys[i] = {isDown: false, justPressed: false, justReleased: false };
    }

    window.addEventListener(
      "keydown", this.handleKeyDown.bind(this), false
    );
    window.addEventListener(
      "keyup", this.handleKeyUp.bind(this), false
    );
  }

  handleKeyUp(event) {
    var key = this.keys[event.keyCode];
    key.justPressed = false;
    key.justReleased = true;
    key.isDown = false;
  }

  handleKeyDown(event) {
    var key = this.keys[event.keyCode];
    if (!key.isDown)
      key.justPressed = true;
    key.justReleased = false;
    key.isDown = true;
  }

  isKeyUp(keycode) {
    return !this.keys[keycode].isDown;
  }

  isKeyDown(keycode) {
    return this.keys[keycode].isDown;
  }

  wasKeyPressed(keycode) {
    return this.keys[keycode].justPressed;
  }

  wasKeyReleased(keycode) {
    return this.keys[keycode].justReleased;
  }

  update() {
    for (var i = 0; i < 255; ++i) {
      var key = this.keys[i];
      key.justPressed = false;
      key.justReleased = false;
    }
  }
}