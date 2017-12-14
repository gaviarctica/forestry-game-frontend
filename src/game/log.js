import * as PIXI from 'pixi.js';

var Width = 50;
var Height = 5;
var Outline = 4;

var LogSpriteByType = [
  '/static/log0.png',
  '/static/log1.png',
  '/static/log2.png',
  '/static/log3.png',
  '/static/log4.png',
  '/static/log5.png'
];

export default class Log {

	constructor(position, rotation, type, stage) {
    Log.LogColorByType = [
      0xa28569,
      0xe4d73d,
      0xf27f1a,
      0xd85040,
      0x946fed,
      0x2c57c3
    ];
    this.type = type;
		this.stage = stage;

    if (!rotation) {
      rotation = 0;
    }

    this._isMarkedForPickUp = false;
		this._canBePickedUp = false;
    this._isHighlighted = false;

    this.container = new PIXI.Container();
    this.container.rotation = rotation;
    this.container.x = position.x;
    this.container.y = position.y;
    
    stage.addChild(this.container);
    // Log color code outline when log can be picked up
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000, 1);
    graphics.drawRoundedRect(-(Width+Outline)/2.0, -(Height+Outline)/2, Width+Outline, Height+Outline, 3);
    graphics.alpha = 0.0;

    // Apply log sprite
    var logSprite = PIXI.Sprite.fromImage(LogSpriteByType[type]);
    logSprite.anchor.set(0.5, 0.5);
    logSprite.scale.set(0.1);

    graphics.interactive = true;
    // make hit area bigger rectangle than the log itself, easier to hit
    graphics.hitArea = new PIXI.Rectangle(-Width/2.0, -(Height+20)/2.0, Width, Height+20);

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

    this.container.addChild(graphics);
    this.container.addChild(logSprite);
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
    return this.container.position;
  }
  getRotation() {
    return this.container.rotation;
  }
}
