import * as PIXI from 'pixi.js';
import UserInterface from './ui';
import RoadTool from './roadtool';

export default class EditorCanvas {
  constructor(updateUI) {
    var pixiApp = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e, antialias: true});
    this.pixiApp = pixiApp;

    this.tools = [];
    this.update = this.update.bind(this);
    pixiApp.ticker.add(this.update);

    document.getElementById('canvas-editor').appendChild(pixiApp.view);

    this.ui = new UserInterface(updateUI);

    this.currentTool = null;
    this.tools = [];

    this.buildGrid();
    this.createTools();
    this.setupCameraControl();
  }
  
  buildGrid() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xffd900, 1);
    
    for (var j = 0; j < 100; j++) {
      graphics.beginFill(0xFF3300);
      graphics.moveTo(0, 100 * j);
      graphics.lineTo(100 * 100, 100 * j);
      graphics.endFill();
      
      graphics.beginFill(0xFF3300);
      graphics.moveTo(100 * j, 0);
      graphics.lineTo(100 * j, 100 * 100);
      graphics.endFill();
    }

    this.pixiApp.stage.addChild(graphics);
  }

  createTools() {
    this.tools['road'] = new RoadTool(this.pixiApp.stage);
  }

  setupCameraControl() {
    var interaction = new PIXI.interaction.InteractionManager(this.pixiApp.renderer);
    var mouseInput = {
      position: {
        x: 0,
        y: 0
      }
    };

    var self = this;

    this.pixiApp.stage.hitArea = new PIXI.Rectangle(-1000000, -1000000, 1000000000, 1000000000);

    this.pixiApp.stage.interactive = true;
    this.pixiApp.stage.pointerdown = function() {
      mouseInput.isDown = true;
      if (self.currentTool)
        self.currentTool.mouseDown();
    };
    this.pixiApp.stage.pointerup = function() {
      mouseInput.isDown = false;
      if (self.currentTool)
        self.currentTool.mouseUp();
    };
    this.pixiApp.stage.pointerupoutside = function() {
      mouseInput.isDown = false;
    };

    this.pixiApp.stage.pointermove = function() {

      mouseInput.lastPosition = {x: mouseInput.position.x, y: mouseInput.position.y};
      mouseInput.position = {x: interaction.mouse.global.x, y: interaction.mouse.global.y};
      mouseInput.delta = {x: mouseInput.lastPosition.x - mouseInput.position.x, y: mouseInput.lastPosition.y - mouseInput.position.y};

      if (mouseInput.isDown === true) {
        self.pixiApp.stage.pivot.x +=  mouseInput.delta.x / self.pixiApp.stage.scale.x
        self.pixiApp.stage.pivot.y +=  mouseInput.delta.y / self.pixiApp.stage.scale.y
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

  selectTool(name) {
    var self = this;
    if (this.currentTool) {
      window.removeEventListener(
        "keydown", self.currentTool.keyDown, false
      );
      window.removeEventListener(
        "keyup", self.currentTool.keyUp, false
      );
      this.currentTool.deactivate();
    }
    
    this.currentTool = this.tools[name];
    
    if (this.currentTool !== null && this.currentTool !== undefined) {
      window.addEventListener(
        "keydown", self.currentTool.keyDown, false
      );
      window.addEventListener(
        "keyup", self.currentTool.keyUp, false
      ); 
      this.currentTool.activate();
    }
  }

  update(delta)
  {
    this.ui.updateUI({
    });
  }

  destroy()
  {
    var self = this;
    setTimeout(function() {
      self.pixiApp.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
