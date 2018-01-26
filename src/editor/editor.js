import * as PIXI from 'pixi.js';
import UserInterface from './ui';
import RoadTool from './roadtool';
import AnomalyTool from './anomalytool';
import Level from '../game/level';
import LogTool from './logtool';
import DepositTool from './deposittool';
import TruckTool from './trucktool';
import RemoveTool from './removetool';
import {AnomalyType} from './anomalytool';

export default class EditorCanvas {
  constructor(updateUI) {
    var pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x438b38, antialias: true});
    this.pixiApp = pixiApp;

    this.tools = [];
    this.update = this.update.bind(this);
    pixiApp.ticker.add(this.update);

    document.getElementById('canvas-editor').appendChild(pixiApp.view);
    pixiApp.view.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.ui = new UserInterface(updateUI);
    this.level = new Level();

    // sprite which is shown on the map
    this.truckSprite = PIXI.Sprite.fromImage('/static/truck.svg');
    this.truckSprite.anchor.set(0.5, 0.5);
    this.truckSprite.scale.set(0.1);
    this.truckSprite.rotation += Math.PI / 2;

    this.currentTool = null;
    this.tools = [];

    this.createTools();

    this.organizeDraws();

    this.setupCameraControl();
    pixiApp.stage.addChild(this.level.getStage());

    this.currentKeyBoardFunctionDown = null;
    this.currentKeyBoardFunctionUp = null;
  }

  buildGrid() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xffd900, 1);

    var numLines = 100;
    var gridSpacing = 100;
    // offset for centering
    var offset = -(numLines * gridSpacing) / 2;
    for (var j = 0; j < numLines; j++) {
      graphics.beginFill(0xFF3300);
      graphics.moveTo(offset, (gridSpacing * j) + offset);
      graphics.lineTo((gridSpacing * numLines) + offset, (gridSpacing * j) + offset);
      graphics.endFill();

      graphics.beginFill(0xFF3300);
      graphics.moveTo((gridSpacing * j) + offset, offset);
      graphics.lineTo((gridSpacing * j) + offset, (gridSpacing * numLines) + offset);
      graphics.endFill();
    }

    return graphics;

  }

  createTools() {
    this.tools['road'] = new RoadTool(this.pixiApp.stage, this.level);
    this.tools['anomalies'] = {
      weightlimit : new AnomalyTool(this.pixiApp.stage, this.level, AnomalyType[0].type),
      dying : new AnomalyTool(this.pixiApp.stage, this.level, AnomalyType[1].type),
      oneway : new AnomalyTool(this.pixiApp.stage, this.level, AnomalyType[2].type)
    };

    for (var i = 0; i < 6; ++i) {
      this.tools['deposit_' + i] = new DepositTool(this.pixiApp.stage, this.level, i);
      this.tools['log_'+ i] = new LogTool(this.pixiApp.stage, this.level, i);
    }
    this.tools['deposit_free'] = new DepositTool(this.pixiApp.stage, this.level, undefined);
    this.tools['truck'] = new TruckTool(this.pixiApp.stage, this.level, this.truckSprite);
    this.tools['remove'] = new RemoveTool(this.pixiApp.stage, this.level, this.truckSprite);
  }

  organizeDraws() {
    // cleaning
    this.pixiApp.stage.removeChildren();

    // building grid
    this.pixiApp.stage.addChild(this.buildGrid());

    // adding containers
    // this.pixiApp.stage.addChild(this.tools['road'].getRoadContainer());
    // this.pixiApp.stage.addChild(this.tools['anomalies'].weightlimit.getAnomalyContainer());
    this.pixiApp.stage.addChild(this.tools['road'].getDrawContainer());
  }

  setupCameraControl() {
    var interaction = this.pixiApp.renderer.plugins.interaction;
    var mouseInput = {
      position: {
        x: 0,
        y: 0
      },
      absDeltaDuringMouseDown: {
        x: 0,
        y: 0
      }
    };

    var self = this;

    this.pixiApp.stage.hitArea = new PIXI.Rectangle(-1000000, -1000000, 1000000000, 1000000000);

    this.pixiApp.stage.interactive = true;
    this.pixiApp.stage.pointerdown = function() {
      mouseInput.isDown = true;
      mouseInput.pointerId = interaction.mouse.pointerId;
      if (self.currentTool)
        self.currentTool.mouseDown(mouseInput);
    };
    this.pixiApp.stage.pointerup = function(e) {
      // storing the event for recognition
      mouseInput.event = e;
      mouseInput.isDown = false;
      mouseInput.pointerId = interaction.mouse.pointerId;
      if (self.currentTool)
        self.currentTool.mouseUp(mouseInput);
    };
    this.pixiApp.stage.pointerupoutside = function() {
      mouseInput.pointerId = interaction.mouse.pointerId;
      mouseInput.isDown = false;
    };

    this.pixiApp.stage.pointermove = function() {
      mouseInput.pointerId = interaction.mouse.pointerId;
      mouseInput.lastPosition = {x: mouseInput.position.x, y: mouseInput.position.y};
      mouseInput.position = {x: interaction.mouse.global.x, y: interaction.mouse.global.y};
      mouseInput.delta = {x: mouseInput.lastPosition.x - mouseInput.position.x, y: mouseInput.lastPosition.y - mouseInput.position.y};
      mouseInput.worldPosition = interaction.mouse.getLocalPosition(self.pixiApp.stage);
      if (mouseInput.isDown === true) {
        self.pixiApp.stage.pivot.x +=  mouseInput.delta.x / self.pixiApp.stage.scale.x
        self.pixiApp.stage.pivot.y +=  mouseInput.delta.y / self.pixiApp.stage.scale.y
        mouseInput.absDeltaDuringMouseDown.x += Math.abs(mouseInput.delta.x);
        mouseInput.absDeltaDuringMouseDown.y += Math.abs(mouseInput.delta.y);
      } else {
        mouseInput.absDeltaDuringMouseDown = {x:0, y:0};
      }

      if (self.currentTool)
        self.currentTool.mouseMove(mouseInput);
    }

    var mouseWheelEvent = function(event) {
      if(!self.currentTool.mouseWheelEvent(event)) {
        if ((event.wheelDelta < -1 || event.deltaY > 1) && self.pixiApp.stage.scale.x > 0.5) {
          self.pixiApp.stage.scale.x -=  0.05;
          self.pixiApp.stage.scale.y -=   0.05;
        } else if ((event.wheelDelta > 1 || event.deltaY < -1) && self.pixiApp.stage.scale.x < 3.0) {
          self.pixiApp.stage.scale.x +=  0.05;
          self.pixiApp.stage.scale.y +=  0.05;
        }
      }
    }
    document.getElementById('canvas-editor').addEventListener("wheel", mouseWheelEvent, false);
    this.pixiApp.stage.position.x += this.pixiApp.renderer.width / 2;
    this.pixiApp.stage.position.y += this.pixiApp.renderer.height / 2;
  }

  selectTool(name, placeType) {
    var self = this;
    if (this.currentTool) {
      if(this.currentKeyBoardFunctionDown) {
        window.removeEventListener(
          "keydown", this.currentKeyBoardFunctionDown, false
        );
        this.currentKeyBoardFunctionDown = null;
      }
      if(this.currentKeyBoardFunctionUp) {
        window.removeEventListener(
          "keyup", this.currentKeyBoardFunctionUp, false
        );
        this.currentKeyBoardFunctionUp = null;
      }

      this.currentTool.deactivate();
    }

    if(name === 'anomalies') {
      this.currentTool = this.tools[name][placeType];
    } else {
      this.currentTool = this.tools[name];
    }

    if (this.currentTool !== null && this.currentTool !== undefined) {
      self.currentKeyBoardFunctionDown = self.currentTool.keyDown.bind(self.currentTool);
      self.currentKeyBoardFunctionUp = self.currentTool.keyUp.bind(self.currentTool);

      window.addEventListener(
        "keydown", self.currentKeyBoardFunctionDown, false
      );
      window.addEventListener(
        "keyup", self.currentKeyBoardFunctionUp, false
      );

      this.currentTool.activate();
    }
  }

  serializeLevel(fog) {
    return this.level.serialize(fog);
  }

  levelInfo(fog) {
    return this.level.getInfo(fog);
  }

  update(delta)
  {

  }

  isValidLevel()
  {
    // no truck position set
    if (!this.level.hasCustomStartingPosition()) {
      return false;
    }

    // no logs
    if (this.level.getLogs().length === 0) {
      return false;
    }

    // logs have their place
    if (!this.level.hasEnoughLogDeposits()) {
      return false;
    }

    return true;
  }

  destroy()
  {
    var self = this;
    setTimeout(function() {
      self.pixiApp.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
