import * as PIXI from 'pixi.js';
import Log from './log';
import {LogType} from './logtypes'

var Width = 150;
var Height = 50;
var Outline = 4;
var Color = 0xAAAAAA;

export function createLogDepositGraphics() {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(Color, 1);
  // draw centered
  graphics.drawRect(-Width/2.0, -Height/2, Width, Height);

  graphics.interactive = true;
  graphics.hitArea = new PIXI.Rectangle(-Width/2.0, -Height/2, Width, Height);
  return graphics;
}

export default class LogDeposit {
  constructor(position, rotation, type, stage) {
    // type is defined when first log is unloaded
    this.type = type;
    this.stage = stage;

    if (!rotation) {
      rotation = 0;
    }

    if (!type) {
      this.type = -1; // no type predefined
    }

    this._isMarkedForPickUp = false;
    this._canBeUnloadedTo = false;
    this._isHighlighted = false;

    var graphics = createLogDepositGraphics();
    graphics.position = new PIXI.Point(position.x, position.y);
    graphics.owner = this;
    graphics.rotation = rotation;

    this.numOfLogs = 0;

    graphics.pointerdown = function() {
      // check if truck is in unload range (flag managed by truck)
      if (this.owner.canBeUnloadedTo()) {
        this.owner.setMarkedForUnload(true);
      } else {
        this.owner.setMarkedForUnload(false);
      }
    };

    graphics.pointerup = function() {
      this.owner.setMarkedForUnload(false);
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

  addLog(log, levelHasType) {

    // if we have no type, we assign type and mark it with appropriate color
    if( !levelHasType && this.type === -1 ) {
      this.type = log.type;

      this.graphics.beginFill(LogType[this.type].color, 1);
      this.graphics.drawRoundedRect(-(Width+Outline)/2.0, -(Height+Outline)/2, Width+Outline, Height+Outline, 3);
      this.graphics.beginFill(Color, 1);
      this.graphics.drawRect(-Width/2.0, -Height/2, Width, Height);
    }

    if(this.type === log.type) {
      // reset the state for clicking
      this.setMarkedForUnload(false);
      // in this case parent is truck
      log.removeFromParent();
      // add it to deposit container
      this.graphics.addChild(log.logSprite);
      log.logSprite.position = new PIXI.Point(-Width/2 + (this.numOfLogs * 5.5) + 2.5, 0);
      log.logSprite.scale.set(0.1);
      ++this.numOfLogs;

      return true;
    }

    return false;
  }

  canBeUnloadedTo() {
    return this._canBeUnloadedTo;
  }

  setCanBeUnloadedTo(value) {
    this._canBeUnloadedTo = value;
    // alter color if log can be picked up
    if (this._canBeUnloadedTo) {
      this.graphics.tint = 0xCCCCCC;
    } else {
      this.graphics.tint = 0xFFFFFF;
    }
  }

  isMarkedForUnload() {
    return this._isMarkedForPickUp;
  }

  setMarkedForUnload(value) {
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

  getRotation() {
    return this.graphics.rotation;
  }

  removeFromStage() {
    if (this.graphics.parent) {
      this.graphics.parent.removeChild(this.graphics);
    }
  }
}
