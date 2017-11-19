import * as PIXI from 'pixi.js';
import Truck from './truck';
import Level from './level';
import Stats from './stats';

const MAP = {
  "id": 1,
  "startpoint" : {"x": 0, "y": 0},
  "routes": [
    {"x": 0, "y": 0, "route_node": 1, "to": [2]},
    {"x": 0, "y": 500, "route_node": 2, "to": [3]},
    {"x": 400, "y": 500, "route_node": 3, "to": [4]},
    {"x": 800, "y": 300, "route_node": 4, "to": []},
    {"x": 400, "y": 800, "route_node": 5, "to": [3]},
    {"x": -300, "y": 1000, "route_node": 6, "to": [5]},
    {"x": -700, "y": 400, "route_node": 7, "to": [6,2]},
    {"x": -700, "y": 0, "route_node": 8, "to": [7,1]}
  ],
  "logs": [
     {"x": 100, "y": 450, "type": 0},
     {"x": 200, "y": 450, "type": 1},
     {"x": 300, "y": 450, "type": 2},
     {"x": 400, "y": 450, "type": 3},
     {"x": -100, "y": 440, "type": 0},
     {"x": -200, "y": 420, "type": 1},
     {"x": -300, "y": 400, "type": 2},
     {"x": -400, "y": 380, "type": 3},
     {"x": -200, "y": -50, "type": 4},
     {"x": -100, "y": -50, "type": 5},
     {"x": -200, "y": -50, "type": 4},
     {"x": -300, "y": -50, "type": 5},
     {"x": -400, "y": -50, "type": 4},
     {"x": -500, "y": -50, "type": 5},
     {"x": -600, "y": -50, "type": 4},
     {"x": -700, "y": -50, "type": 5},
     {"x": 460, "y": 550, "type": 1},
     {"x": 460, "y": 570, "type": 3},
     {"x": 460, "y": 590, "type": 5}
  ],
  "logdeposits" : [
     {"x": 700, "y": 240}
  ]
}

export default class GameCanvas {
  constructor(updateUI) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e});
    this.game = game;

    this.update = this.update.bind(this);
    game.ticker.add(this.update);

    document.getElementById('canvas-game').appendChild(game.view);

    this.stats = new Stats(updateUI);

    this.map = new Level(MAP, game.stage);
    this.truck = new Truck(MAP.startpoint.x,
                           MAP.startpoint.y,
                           game.stage,
                           this.map.getStartingSegment(),
                           this.map.getLogs(),
                           this.map.getLogDeposits(),
                           this.stats);

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
    if (this.isInEndGameState()) {
      this.stats.updateUI({
        gameEnd: true
      });
    }

    var totalDistance = this.truck.getDistanceMoved()
    var totalfuelBurned = this.truck.getFuelBurned()
    var score = totalDistance * totalfuelBurned;

    this.truck.update(delta);
    this.stats.updateUI({
      distance: totalDistance,
      fuel: totalfuelBurned,
      score: score.toFixed(0)
    });
  }

  isInEndGameState() {
    // no logs in the map anymore
    if (this.map.getLogs().length !== 0) {
      return false;
    }

    // no logs in truck
    if (this.truck.logCount() > 0) {
      return false;
    }

    // logs are now in deposits, game is over
    return true;
  }

  destroy()
  {
    var self = this;
    setTimeout(function() {
      self.game.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
