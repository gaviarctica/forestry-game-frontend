import * as PIXI from 'pixi.js';

var Width = 50;
var Height = 5;
var LogColorByType = [
  0xD85040,
  0x5286EC,
  0x58A55C,
  0xBC8E56,
  0xAD8BFF,
  0xFF72BE
];

export default class Log {
	constructor(position, type, stage) {
    this.type = type;
		this.stage = stage;

    this._isMarkedForPickUp = false;
		this._canBePickedUp = false;
    this._isHighlighted = false;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(LogColorByType[type], 1);
    // draw the log centered
    graphics.drawRect(-Width/2.0, -Height/2, Width, Height);

    graphics.interactive = true;
    // make hit area bigger rectangle than the log itself, easier to hit
    graphics.hitArea = new PIXI.Rectangle(-Width/2.0, -Width/2.0, Width, Width);

    graphics.position = new PIXI.Point(position.x, position.y);
    
    graphics.owner = this;
    graphics.pointerdown = function() {
      // check if truck is in pickup range (flag managed by truck)
      if (this.owner.canBePickedUp()) {
        this.owner.setMarkedForPickUp(true);
      } else {
        this.owner.setMarkedForPickUp(false);
      }
    };
    graphics.pointerup = function() {
      this.owner.setMarkedForPickUp(false);
    }

    graphics.pointerover = function() {
      this.owner.setHighlighted(true);
    }

    graphics.pointerout = function() {
      this.owner.setHighlighted(false);
    }

    this.stage.addChild(graphics);
    this.graphics = graphics;
	}

  removeFromParent() {
    this.graphics.parent.removeChild(this.graphics);
  }

	canBePickedUp() {
		return this._canBePickedUp;
	}

  setCanBePickedUp(value) {
    this._canBePickedUp = value;

    // alter color if log can be picked up
    if (this._canBePickedUp) {
      this.graphics.tint = 0x444444;
    } else {
      this.graphics.tint = 0xFFFFFF;
    }
  }

  isMarkedForPickUp() {
    return this._isMarkedForPickUp;
  }

  setMarkedForPickUp(value) {
    this._isMarkedForPickUp = value;
  }

  isHighlighted() {
    return this._isHighlighted;
  }

  setHighlighted(value) {
    this._isHighlighted = value;
  }

  getPosition() {
    return this.graphics.position;
  }
}
