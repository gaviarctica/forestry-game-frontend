import * as PIXI from 'pixi.js';
import Truck from './truck';
import Level from './level';
import Stats from './stats';

export default class GameCanvas {
  constructor(mapData, updateUI) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e, antialias: true});
    this.game = game;

    this.mapData = mapData;
    

    document.getElementById('canvas-game').appendChild(game.view);

    this.stats = new Stats(updateUI);

    this.map = new Level(this.mapData, this.game.stage);
    this.truck = new Truck(this.mapData.startpoint.x,
                           this.mapData.startpoint.y,
                           this.game.stage,
                           this.map.getStartingSegment(),
                           this.map.getLogs(),
                           this.map.getLogDeposits(),
                           this.stats);

    this.setupCameraControl();
    this.update = this.update.bind(this);
    game.ticker.add(this.update);
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
        self.game.stage.scale.y -=  0.05;
      } else if ((event.wheelDelta > 1 || event.deltaY < -1) && self.game.stage.scale.x < 3.0) {
        self.game.stage.scale.x +=  0.05;
        self.game.stage.scale.y +=  0.05;
      }
    }
    document.getElementById('canvas-game').addEventListener("mousewheel", mouseWheelEvent, false);

    this.game.stage.pivot.set( this.mapData.startpoint.x,  this.mapData.startpoint.y);
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
