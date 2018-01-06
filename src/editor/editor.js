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
    var pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e, antialias: true});
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

    this.currentTool = null;
    this.tools = [];

    this.createTools();

    this.organizeDraws();

    this.setupCameraControl();
    pixiApp.stage.addChild(this.level.getStage());
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
      weightlimit : new AnomalyTool(this.pixiApp.stage, this.level, AnomalyType[0].type)
    };
    this.tools['log'] = new LogTool(this.pixiApp.stage, this.level);
    this.tools['deposit'] = new DepositTool(this.pixiApp.stage, this.level);
    this.tools['truck'] = new TruckTool(this.pixiApp.stage, this.level);
    this.tools['remove'] = new RemoveTool(this.pixiApp.stage, this.level);
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
    this.pixiApp.stage.mousedown = function() {
      mouseInput.isDown = true;
      mouseInput.pointerId = interaction.mouse.pointerId;
      if (self.currentTool)
        self.currentTool.mouseDown(mouseInput);
    };
    this.pixiApp.stage.mouseup = function() {
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
      if ((event.wheelDelta < -1 || event.deltaY > 1) && self.pixiApp.stage.scale.x > 0.5) {
        self.pixiApp.stage.scale.x -=  0.05;
        self.pixiApp.stage.scale.y -=   0.05;
      } else if ((event.wheelDelta > 1 || event.deltaY < -1) && self.pixiApp.stage.scale.x < 3.0) {
        self.pixiApp.stage.scale.x +=  0.05;
        self.pixiApp.stage.scale.y +=  0.05;
      }
    }
    document.getElementById('canvas-editor').addEventListener("wheel", mouseWheelEvent, false);
    this.pixiApp.stage.position.x += this.pixiApp.renderer.width / 2;
    this.pixiApp.stage.position.y += this.pixiApp.renderer.height / 2;
  }

  selectTool(name, placeType) {
    var self = this;
    if (this.currentTool) {
      window.removeEventListener(
        "keydown", self.currentTool.keyDown.bind(self.currentTool), false
      );
      window.removeEventListener(
        "keyup", self.currentTool.keyUp.bind(self.currentTool), false
      );

      this.currentTool.deactivate();
    }

    if(name === 'anomalies') {
      this.currentTool = this.tools[name][placeType];
    } else {
      this.currentTool = this.tools[name];
    }

    if (this.currentTool !== null && this.currentTool !== undefined) {
      window.addEventListener(
        "keydown", self.currentTool.keyDown.bind(self.currentTool), false
      );
      window.addEventListener(
        "keyup", self.currentTool.keyUp.bind(self.currentTool), false
      );
      this.currentTool.activate();
    }
  }

  serializeLevel() {
    return this.level.serialize();
  }

  levelInfo() {
    return this.level.getInfo();
  }

  update(delta)
  {
    // Commented this out because it sends empty updates constantly regards gaviarctica
    // this.ui.updateUI({
    // });
  }

  destroy()
  {
    var self = this;
    setTimeout(function() {
      self.pixiApp.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
