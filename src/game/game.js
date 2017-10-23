import * as PIXI from 'pixi.js';
import Truck from './truck';
import Level from './level';
import Stats from './stats';

const MAP = {
  "id": 1,
  "startpoint" : {"x": 200, "y": 500},
  "routes": [
    [
      {"x": 200, "y": 500},
      {"x": 400, "y": 700},
      {"x": 800, "y": 300},
      {"x": 1000, "y": 500},
    ]
  ],
  "logs": [

  ]
}

export default class GameCanvas {
  constructor(updateTime, updateDistance, updateScore) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e});
    this.game = game;

    this.update = this.update.bind(this);
    game.ticker.add(this.update);
    
    document.getElementById('canvas-game').appendChild(game.view);
    
    this.map = new Level(MAP, game.stage);
    this.truck = new Truck(MAP.startpoint.x, MAP.startpoint.y, game.stage, this.map.getStartingSegment());

    this.stats = new Stats(updateTime, updateDistance, updateScore);

    this.setupCameraControl();
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
    };
    this.game.stage.pointerup = function() {
      mouseInput.isDown = false;
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
    document.getElementById('canvas-game').addEventListener("mousewheel", mouseWheelEvent, false);

    this.game.stage.pivot.set( MAP.startpoint.x,  MAP.startpoint.y);
    this.game.stage.position.x += this.game.renderer.width / 2;
    this.game.stage.position.y += this.game.renderer.height / 2;
  }

  update(delta)
  {
    this.truck.update(delta)
  }

  destroy()
  {
    var self = this;
    setTimeout(function() {
      self.game.destroy(true);
    }, 350); // Wait for game view exit animation to finish    
  }
}
