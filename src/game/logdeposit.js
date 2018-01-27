import * as PIXI from 'pixi.js';
import Settings from './settings'

const depositSpriteByType = {
  0: '/static/deposit_0.svg',
  1: '/static/deposit_1.svg',
  2: '/static/deposit_2.svg',
  3: '/static/deposit_3.svg',
  4: '/static/deposit_4.svg',
  5: '/static/deposit_5.svg'
}

export function createLogDepositGraphics(types = []) {

  var depositSprite;

  if (types.length > 0) {
    depositSprite = PIXI.Sprite.fromImage(depositSpriteByType[types[0]]);
  } else {
    depositSprite = PIXI.Sprite.fromImage('/static/deposit_empty.svg');
  }
  depositSprite.scale.set(0.1);
  depositSprite.anchor.set(0.5);
  depositSprite.alpha = 0.75;

  return depositSprite;
}

export function generateLogDepositBackgrounds() {
  var depositInRangeBackgrounds = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()];

  var settings = (new Settings()).log_deposit;

  depositInRangeBackgrounds[0].beginFill(0x000000, 1);
  depositInRangeBackgrounds[1].beginFill(0x000000, 1);
  depositInRangeBackgrounds[2].beginFill(0xFF1111, 1);

  // draw centered
  depositInRangeBackgrounds[0].drawRect(-settings.Width/2.0, -settings.Height/2, settings.Width, settings.Height);
  depositInRangeBackgrounds[1].drawRect(-settings.Width/2.0, -settings.Height/2, settings.Width, settings.Height);
  depositInRangeBackgrounds[2].drawRect(-settings.Width/2.0, -settings.Height/2, settings.Width, settings.Height);

  depositInRangeBackgrounds[0].alpha = 0;
  depositInRangeBackgrounds[1].alpha = 0.25;
  depositInRangeBackgrounds[2].alpha = 0.75;

  return depositInRangeBackgrounds;
}

export default class LogDeposit {
  constructor(position, rotation, types, stage, max_types = 1) {
    this.settings = (new Settings()).log_deposit;

    // type is defined when first log is unloaded
    this.types = [];
    this.stage = stage;
    this.max_types = max_types;

    if (!rotation) {
      rotation = 0;
    }

    // legacy support for single value
    if (types !== undefined) {
      this.types.push(types); // no type predefined
    }

    this._isMarkedForPickUp = false;
    this._canBeUnloadedTo = false;
    this._isHighlighted = false;

    this.container = new PIXI.Container();
    this.container.x = position.x;
    this.container.y = position.y;
    this.container.owner = this;
    this.container.rotation = rotation;
    this.container.interactive = true;

    this.numOfLogs = 0;

    this.container.pointerdown = function(e) {
      // check if truck is in unload range (flag managed by truck)
      if (this.owner.canBeUnloadedTo() && e && e.data.originalEvent && e.data.originalEvent.which === 1) {
        this.owner.setMarkedForUnload(true);
      } else {
        this.owner.setMarkedForUnload(false);
      }
    };

    this.container.pointerup = function() {
      this.owner.setMarkedForUnload(false);
    }

    this.container.pointerover = function() {
      this.owner.setHighlighted(true);
    }

    this.container.pointerout = function() {
      this.owner.setHighlighted(false);
    }

    var inRangeBackground = new PIXI.Container();

    var graphics = createLogDepositGraphics(this.types);

    this.container.addChild(inRangeBackground);
    this.container.addChild(graphics);
    this.stage.addChild(this.container);

    this.graphics = graphics;

    var backgrounds = generateLogDepositBackgrounds();
    this.inRangeBackground = inRangeBackground;
    this.inRangeBackground.addChild(backgrounds[0]);
    this.inRangeBackground.addChild(backgrounds[1]);
    this.inRangeBackground.addChild(backgrounds[2]);
    this.inRangeBackground.children[0].visible = true;
    this.inRangeBackground.children[1].visible = false;
    this.inRangeBackground.children[2].visible = false;
    this.inRangeBackgroundState = 0;
  }

  setMaxTypes(max_types) {
    this.max_types = max_types;
  }

  addLog(log, levelHasType, check_only = false) {

    if(!levelHasType && check_only) return true;

    // if we have no type, we assign type and mark it with appropriate texture
    if( !levelHasType && this.types.length < this.max_types && !check_only) {
      this.types.push(log.type);
      this.graphics.texture = PIXI.Texture.fromImage(depositSpriteByType[log.type]);
    }

    // checking if wanted type is included
    var can_add = false;

    for(var i = 0; i < this.types.length; ++i) {
      if(this.types[i] === log.type) {
        can_add = true;
        break;
      }
    }

    if(can_add && check_only) {
      return true;
    }
    else if(check_only) return false;

    if(can_add && !check_only) {
      // reset the state for clicking
      this.setMarkedForUnload(false);
      // in this case parent is truck
      log.removeFromParent();
      // add it to deposit container
      this.container.addChild(log.logSprite);
      log.logSprite.position = new PIXI.Point(-this.settings.Width/2 + ((this.numOfLogs * 5.5) + 2.5) % this.settings.Width, 0);
      log.logSprite.scale.set(this.settings.LOG_SPRITE_SCALE);
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
    // alter bg color if log can be picked up
    // can add
    if (this._canBeUnloadedTo === 1 && this.inRangeBackgroundState !== 1) {
      this.inRangeBackground.children[0].visible = false;
      this.inRangeBackground.children[1].visible = true;
      this.inRangeBackground.children[2].visible = false;
      this.inRangeBackgroundState = 1;
    }
    // can't add or empty
    else if (this._canBeUnloadedTo === 2 && this.inRangeBackgroundState !== 2) {
      this.inRangeBackground.children[0].visible = false;
      this.inRangeBackground.children[1].visible = false;
      this.inRangeBackground.children[2].visible = true;
      this.inRangeBackgroundState = 2;
    }
    // default
    else if(!this._canBeUnloadedTo) {
      this.inRangeBackground.children[0].visible = true;
      this.inRangeBackground.children[1].visible = false;
      this.inRangeBackground.children[2].visible = false;
      this.inRangeBackgroundState = 0;
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
    return this.container.position;
  }

  getRotation() {
    return this.container.rotation;
  }

  removeFromStage() {
    if (this.graphics.parent) {
      this.graphics.parent.removeChild(this.graphics);
    }
    if (this.container.parent) {
      this.container.parent.removeChild(this.container);
    }
  }
}
