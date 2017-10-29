import * as PIXI from 'pixi.js';

var Width = 50;
var Height = 5;
var WineRedColor = 0x722F37;
var LogColorByType = [WineRedColor, WineRedColor, WineRedColor, WineRedColor];

export default class Log {
	constructor(position, type, stage) {
    this.type = type;
		this.stage = stage;

    this._isMarkedForPickUp = false;
		this._canBePickedUp = false;

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

    this.stage.addChild(graphics);
    this.graphics = graphics;
	}

  removeFromStage() {
    this.stage.removeChild(this.graphics);
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

  getPosition() {
    return this.graphics.position;
  }
}
