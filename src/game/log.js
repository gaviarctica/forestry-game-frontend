import * as PIXI from 'pixi.js';

var Width = 50;
var Height = 5;
var Outline = 4;
var LogColorByType = [
  0xD85040,
  0x5286EC,
  0x58A55C,
  0xBC8E56,
  0xAD8BFF,
  0xFF72BE
];
var LogSpriteByType = [
  '/static/log_placeholder.png',
  '/static/log_placeholder.png',
  '/static/log_placeholder.png',
  '/static/log_placeholder.jpg',
  '/static/log_placeholder.jpg',
  '/static/log_placeholder.jpg'
];

export default class Log {
	constructor(position, type, stage) {
    this.type = type;
		this.stage = stage;

    this._isMarkedForPickUp = false;
		this._canBePickedUp = false;
    this._isHighlighted = false;

    // Log color code outline when log can be picked up
    var graphics = new PIXI.Graphics();
    graphics.beginFill(LogColorByType[type], 1);
    graphics.drawRoundedRect(-(Width+Outline)/2.0, -(Height+Outline)/2, Width+Outline, Height+Outline, 3);
    graphics.alpha = 0.0;

    // Apply log sprite
    var logSprite = PIXI.Sprite.fromImage(LogSpriteByType[type]);
    logSprite.anchor.set(0.5, 0.5);
    logSprite.scale.set(0.1);
    logSprite.x = position.x;
    logSprite.y = position.y;

    graphics.interactive = true;
    // make hit area bigger rectangle than the log itself, easier to hit
    graphics.hitArea = new PIXI.Rectangle(-Width/2.0, -(Height+20)/2.0, Width, Height+20);

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
    this.stage.addChild(logSprite);
    this.graphics = graphics;
    this.logSprite = logSprite;
	}

  removeFromParent() {
    if (this.graphics.parent) {
      this.graphics.parent.removeChild(this.graphics);
    }    
    this.logSprite.parent.removeChild(this.logSprite);
  }

	canBePickedUp() {
		return this._canBePickedUp;
	}

  setCanBePickedUp(value) {
    this._canBePickedUp = value;

    // alter color if log can be picked up
    if (this._canBePickedUp) {
      this.graphics.alpha = 1.0;
    } else {
      this.graphics.alpha = 0.0;
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
