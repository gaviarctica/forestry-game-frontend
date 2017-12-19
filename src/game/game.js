import * as PIXI from 'pixi.js';
import Truck from './truck';
import Level from './level';
import Stats from './stats';
import Forest from './forest';
import Settings from './settings'

export default class GameCanvas {
  constructor(mapData, updateUI) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x7da66e, antialias: true});
    this.game = game;

    this.mapData = mapData;

    this.forest = new Forest(this.game.stage, mapData);
    this.forest.buildGround();

    document.getElementById('canvas-game').appendChild(game.view);

    this.stats = new Stats(updateUI);
    this.gameEnded = false;

    this.map = new Level(this.mapData);
    this.game.stage.addChild(this.map.getStage());

    // counting different log types
    var logtype_amount = 0;
    var logs_amount = this.map.getLogs().length;
    var log_types = [];

    for(var i = 0; i < logs_amount; ++i) {
      var has_type = false;

      for(var j = 0; j < log_types.length; ++j) {
        if(log_types[j].type === this.map.getLogs()[i].type) {
          log_types[j].amount++;
          has_type = true;
        }
      }

      if(!has_type) {
        log_types.push({"type": this.map.getLogs()[i].type, "amount":1});
      }
    }

    var deposit_amount = this.map.getLogDeposits().length;
    for(var i = 0; i < deposit_amount; ++i) {
      if(log_types.length === deposit_amount)
        this.map.getLogDeposits()[i].setMaxTypes(1);
      else
        this.map.getLogDeposits()[i].setMaxTypes(Math.ceil(log_types.length/deposit_amount));
    }

    this.truck = new Truck(this.game.stage,
                           this.map.getStartingSegment(),
                           this.map.getStaringInterpolation(),
                           this.map.getLogs(),
                           this.map.getLogDeposits(),
                           this.stats);

    this.forest.buildTrees();

    this.setupCameraControl(this.truck);
    this.update = this.update.bind(this);
    game.ticker.add(this.update);
  }

  setupCameraControl(truck) {
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
      // stopping camera updates when we want to control the camera manually
      truck.update(0,true);
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
        self.game.stage.pivot.x +=  mouseInput.delta.x / self.game.stage.scale.x;
        self.game.stage.pivot.y +=  mouseInput.delta.y / self.game.stage.scale.y;
      }


    }

    var mouseWheelEvent = function(event) {
      var settings = (new Settings).map;
      if ((event.wheelDelta < -1 || event.deltaY > 1) && self.game.stage.scale.x > 0.5) {
        console.log(this.settings);
        self.game.stage.scale.x -=  settings.MOUSE_WHEEL_SCALE[0];
        self.game.stage.scale.y -=  settings.MOUSE_WHEEL_SCALE[1];
      } else if ((event.wheelDelta > 1 || event.deltaY < -1) && self.game.stage.scale.x < 3.0) {
        self.game.stage.scale.x +=  settings.MOUSE_WHEEL_SCALE[0];
        self.game.stage.scale.y +=  settings.MOUSE_WHEEL_SCALE[1];
      }
    }
    document.getElementById('canvas-game').addEventListener("wheel", mouseWheelEvent, false);

    this.game.stage.pivot.set( this.mapData.startpoint.x,  this.mapData.startpoint.y);
    this.game.stage.position.x += this.game.renderer.width / 2;
    this.game.stage.position.y += this.game.renderer.height / 2;
  }

  update(delta)
  {
    if (this.isInEndGameState() && !this.gameEnded) {
      this.stats.updateUI({
        gameEnd: true
      });
      this.stats.stopCounter();
      this.gameEnded = true;
    }

    var totalDistance = this.stats.getDistanceMoved()
    var totalfuelBurned = this.stats.getFuelUsed()
    var cost = this.stats.getCost();

    this.truck.update(delta);
    this.stats.updateUI({
      distance: Math.round(totalDistance),
      fuel: totalfuelBurned,
      cost: cost.toFixed(2)
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
