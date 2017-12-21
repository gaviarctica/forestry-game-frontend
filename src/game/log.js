import * as PIXI from 'pixi.js';

import {LogType} from './logtypes';
import Settings from './settings';

export default class Log {

	constructor(position, rotation, type, stage) {
		this.settings = (new Settings()).log;

    this.type = type;
		this.stage = stage;

    if (!rotation) {
      rotation = 0;
    }

    this._isMarkedForPickUp = false;
		this._canBePickedUp = false;
    this._isHighlighted = false;

    // Log color code outline when log can be picked up
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000, 1);
    graphics.drawRoundedRect(-(this.settings.Width+this.settings.Outline)/2.0,
			-(this.settings.Height+this.settings.Outline)/2,
			this.settings.Width+this.settings.Outline, this.settings.Height+this.settings.Outline, 3);
    graphics.alpha = 0.0;

    // Apply log sprite
    var logSprite = PIXI.Sprite.fromImage(LogType[this.type].sprite);
    logSprite.anchor.set(this.settings.SPRITE_ANCHOR, this.settings.SPRITE_ANCHOR);
    logSprite.scale.set(this.settings.SPRITE_SCALE);

    this.container = new PIXI.Container();
    this.container.rotation = rotation;
    this.container.x = position.x;
    this.container.y = position.y;

    stage.addChild(this.container);

    this.container.interactive = true;
    // make hit area bigger rectangle than the log itself, easier to hit
    this.container.hitArea = new PIXI.Rectangle(-this.settings.Width/2.0,
			-(this.settings.Height+20)/2.0, this.settings.Width, this.settings.Height+20);

    this.container.owner = this;
    this.container.pointerdown = function() {
      // check if truck is in pickup range (flag managed by truck)
      if (this.owner.canBePickedUp()) {
        this.owner.setMarkedForPickUp(true);
      } else {
        this.owner.setMarkedForPickUp(false);
      }
    };
    this.container.pointerup = function() {
      this.owner.setMarkedForPickUp(false);
    }

    this.container.pointerover = function() {
      this.owner.setHighlighted(true);
    }

    this.container.pointerout = function() {
      this.owner.setHighlighted(false);
    }

    this.container.addChild(graphics);
    this.container.addChild(logSprite);
    this.graphics = graphics;
    this.logSprite = logSprite;
	}

  removeFromStage() {
    this.removeFromParent();
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
