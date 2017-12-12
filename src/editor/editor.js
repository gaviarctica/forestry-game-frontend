import * as PIXI from 'pixi.js';
import UserInterface from './ui';

export default class EditorCanvas {
  constructor(updateUI) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e, antialias: true});
    this.game = game;

    this.tools = [];
    this.update = this.update.bind(this);
    game.ticker.add(this.update);

    document.getElementById('canvas-editor').appendChild(game.view);

    this.ui = new UserInterface(updateUI);

    this.currentTool = null;

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

    this.game.stage.addChild(graphics);
  }

  createTools() {
     // tools['road'] = new RoadTool();
  }

  setupCameraControl() {
    var interaction = new PIXI.interaction.InteractionManager(this.game.renderer);
    var mouseInput = {
      position: {
        x: 0,
        y: 0
      }
    };

    var self = this;

    this.game.stage.hitArea = new PIXI.Rectangle(-1000000, -1000000, 1000000000, 1000000000);

    this.game.stage.interactive = true;
    this.game.stage.pointerdown = function() {
      mouseInput.isDown = true;
      if (self.currentTool)
        self.currentTool.mouseDown();
    };
    this.game.stage.pointerup = function() {
      mouseInput.isDown = false;
      if (self.currentTool)
        self.currentTool.mouseUp();
    };
    this.game.stage.pointerupoutside = function() {
      mouseInput.isDown = false;
    };

    this.game.stage.pointermove = function() {

      mouseInput.lastPosition = {x: mouseInput.position.x, y: mouseInput.position.y};
      mouseInput.position = {x: interaction.mouse.global.x, y: interaction.mouse.global.y};
      mouseInput.delta = {x: mouseInput.lastPosition.x - mouseInput.position.x, y: mouseInput.lastPosition.y - mouseInput.position.y};

      if (mouseInput.isDown === true) {
        self.game.stage.pivot.x +=  mouseInput.delta.x / self.game.stage.scale.x
        self.game.stage.pivot.y +=  mouseInput.delta.y / self.game.stage.scale.y
      }
      
      if (self.currentTool)
        self.currentTool.mouseMove(mouseInput);
    }

    var mouseWheelEvent = function(event) {
      if ((event.wheelDelta < -1 || event.deltaY > 1) && self.game.stage.scale.x > 0.5) {
        self.game.stage.scale.x -=  0.05;
        self.game.stage.scale.y -=   0.05;
      } else if ((event.wheelDelta > 1 || event.deltaY < -1) && self.game.stage.scale.x < 3.0) {
        self.game.stage.scale.x +=  0.05;
        self.game.stage.scale.y +=  0.05;
      }
    }
    document.getElementById('canvas-editor').addEventListener("wheel", mouseWheelEvent, false);
    this.game.stage.position.x += this.game.renderer.width / 2;
    this.game.stage.position.y += this.game.renderer.height / 2;
  }

  selectTool(name) {
    // TODO: remove add event listener

    //this.currentTool = tools[name];
      
    var self = this;
    window.addEventListener(
      "keydown", self.currentTool.keyDown, false
    );
    window.addEventListener(
      "keyup", self.currentTool.keyUp, false
    );
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
      self.game.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
