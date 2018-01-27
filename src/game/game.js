import * as PIXI from 'pixi.js';
import Truck from './truck';
import Level from './level';
import Stats from './stats';
import Forest from './forest';
import Settings from './settings';
import {Key} from './controls';
import {LogType} from './logtypes';
import Controls from './controls';
import Weather from './weather';
import {secondsToDateFormat,calculateMinMax} from './helpers';

export default class GameCanvas {
  constructor(mapData, updateUI) {
    var game = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor: 0x438b38, antialias: false});
    this.game = game;

    this.settings = new Settings();

    this.mapData = mapData;
    this.min_max = calculateMinMax(mapData);
    this.forest = new Forest(this.game.stage, mapData, this.min_max);
    this.game.stage.addChild(this.forest.getGroundContainer());
    this.game.stage.addChild(this.forest.getTreeContainer());
    this.forest.buildGround();
    this.forest.buildTrees();

    document.getElementById('canvas-game').appendChild(game.view);
    game.view.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.controls = new Controls();

    this.stats = new Stats(updateUI, this.controls);
    this.gameEnded = false;

    this.map = new Level(this.mapData, updateUI, this.controls);
    this.game.stage.addChild(this.map.getStage());

    // counting different log types
    var logs_amount = this.map.getLogs().length;
    var log_types = [];

    // Logs remaining data for UI
    this.logsRemaining = {
      '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0
    }

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

      this.logsRemaining[this.map.getLogs()[i].type] += 1;
    }

    this.stats.updateUI({
      logsRemainingOnGround: this.logsRemaining
    });

    var deposit_amount = this.map.getLogDeposits().length;
    for(i = 0; i < deposit_amount; ++i) {
      if(log_types.length === deposit_amount)
        this.map.getLogDeposits()[i].setMaxTypes(1);
      else
        this.map.getLogDeposits()[i].setMaxTypes(Math.ceil(log_types.length/deposit_amount));
    }

    this.truck = new Truck(this.game.stage,
                           this.controls,
                           this.map.getStartingSegment(),
                           this.map.getStaringInterpolation(),
                           this.map.getLogs(),
                           this.map.getLogDeposits(),
                           this.stats,
                           this.logsRemaining,
                           this.map.getStartingPosition().dir);

    this.game.stage.addChild(this.truck.getContainer());

    this.weather = new Weather(this.game.stage, this.forest, this.map.getStage(), this.truck, game, this.mapData.weather,this.min_max);

    this.setupCameraControl(this.truck);
    this.update = this.update.bind(this);
    game.ticker.add(this.update);

    // Framerate counter
    if (this.settings.debug.FRAMERATE_COUNTER) {
      this.frames = 0;
      // Report framerate and reset counter each second
      this.framerateCounter = setInterval(function() {
        console.log('Framerate: ' + this.frames + ' fps');
        this.frames = 0;
      }.bind(this), 1000);
    }
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

    var map_size = {
      width: this.min_max.xMax-this.min_max.xMin,
      height: this.min_max.yMax-this.min_max.yMin
    };

    this.game.stage.hitArea = new PIXI.Rectangle(
      -(map_size.width + this.settings.map.HITAREA_PADDING[0]),
      -(map_size.height + this.settings.map.HITAREA_PADDING[1]),
      map_size.width + 2*this.settings.map.HITAREA_PADDING[0],
      map_size.height + 2*this.settings.map.HITAREA_PADDING[1]);

    this.game.stage.interactive = true;
    this.game.stage.pointerdown = function(e) {
      var loc_pos = e.data.getLocalPosition(this);

      if (e.data.originalEvent.which === 2 || e.data.originalEvent.which === 3) {
        mouseInput.isRightDown = true;
      }

      if(Math.abs(loc_pos.x) > (map_size.width/2 + self.settings.map.MAX_CAMERA_DISTANCE[0]) ||
        Math.abs(loc_pos.y) > (map_size.height/2 + self.settings.map.MAX_CAMERA_DISTANCE[1])) {
        mouseInput.isRightDown = false;
        mouseInput.forceBack = true;
        return;
      }

      // stopping camera updates when we want to control the camera manually
      truck.update(0,true);
      mouseInput.forceBack = false;
      // mouseInput.isDown = true;
    };
    this.game.stage.pointerup = function() {
      mouseInput.isRightDown = false;
      mouseInput.forceBack = false;
    };
    this.game.stage.pointerupoutside = function() {
      mouseInput.isRightDown = false;
      mouseInput.forceBack = false;
    };

    this.game.stage.pointermove = function(e) {

      mouseInput.lastPosition = {x: mouseInput.position.x, y: mouseInput.position.y};
      mouseInput.position = {x: interaction.mouse.global.x, y: interaction.mouse.global.y};
      mouseInput.delta = {x: mouseInput.lastPosition.x - mouseInput.position.x, y: mouseInput.lastPosition.y - mouseInput.position.y};

      if (mouseInput.isRightDown === true && mouseInput.forceBack !== true) {
        self.game.stage.pivot.x +=  mouseInput.delta.x / self.game.stage.scale.x;
        self.game.stage.pivot.y +=  mouseInput.delta.y / self.game.stage.scale.y;
      }

      if(mouseInput.forceBack === true) {
        var loc_pos = e.data.getLocalPosition(this);
        if(Math.abs(loc_pos.x) < (map_size.width/2 + self.settings.map.MAX_CAMERA_DISTANCE[0]) &&
          Math.abs(loc_pos.y) < (map_size.height/2 + self.settings.map.MAX_CAMERA_DISTANCE[1])) {
          mouseInput.forceBack = false;
        }

        var vec = {
          x: self.game.stage.pivot.x,
          y: self.game.stage.pivot.y
        };
        var norm = Math.sqrt(vec.x*vec.x + vec.y*vec.y);
        var norm_vec = {x: vec.x/norm, y: vec.y / norm};
        self.game.stage.pivot.x -=  5 * norm_vec.x / self.game.stage.scale.x;
        self.game.stage.pivot.y -=  5 * norm_vec.y / self.game.stage.scale.y;
      }


    }

    var mouseWheelEvent = function(event) {
      var settings = self.settings.map;
      if ((event.wheelDelta < -1 || event.deltaY > 1) && self.game.stage.scale.x > 0.5) {
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
    // Add new frame to framerate counter
    if (this.settings.debug.FRAMERATE_COUNTER) {
      this.frames += 1;
    }

    if (this.isInEndGameState() && !this.gameEnded) {
      this.stats.updateUI({
        gameEnd: true
      });
      this.stats.stopCounter();
      this.gameEnded = true;
    }

    this.truck.update(delta);
    this.map.update();

    this.controls.update();
    this.weather.update(delta);

    var report = this.stats.getReport();
    this.stats.updateUI({
      time: secondsToDateFormat(report.time),
      rawtime: report.time,
      distance: report.distanceMoved.toFixed(this.stats.settings.DISTANCE_MOVED_DECIMALS),
      fuel: report.fuelUsed.toFixed(this.stats.settings.FUEL_USED_DECIMALS),
      cost: report.total_cost.toFixed(this.stats.settings.TOTAL_COST_DECIMALS),
      driving_unloaded_time: secondsToDateFormat(Math.round(report.driving_unloaded_time)),
      driving_loaded_time: secondsToDateFormat(Math.round(report.driving_loaded_time)),
      loading_and_unloading: secondsToDateFormat(report.loading_and_unloading),
      idling: secondsToDateFormat(report.idling),
      driving_forward: report.driving_forward.toFixed(this.stats.settings.DISTANCE_MOVED_DECIMALS),
      reverse: report.reverse.toFixed(this.stats.settings.DISTANCE_MOVED_DECIMALS),
      driving_unloaded_distance: report.driving_unloaded_distance.toFixed(this.stats.settings.DISTANCE_MOVED_DECIMALS),
      driving_loaded_distance: report.driving_loaded_distance.toFixed(this.stats.settings.DISTANCE_MOVED_DECIMALS),
      fuel_cost: report.fuel_cost.toFixed(this.stats.settings.FUEL_COST_DECIMALS),
      worker_salary: report.worker_salary.toFixed(this.stats.settings.WORKER_SALARY_DECIMALS),
      loads_transported: report.loads_transported,
      logs_deposited: report.logs_deposited,
      total_volume: report.total_volume.toFixed(this.stats.settings.VOLUME_DECIMALS),
      productivity: report.productivity.toFixed(this.stats.settings.VOLUME_DECIMALS)
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
    // Stop in game time counter
    this.stats.stopCounter();
    // Stop framerate counter
    if (this.settings.debug.FRAMERATE_COUNTER) {
      clearInterval(this.framerateCounter);
    }

    var self = this;
    setTimeout(function() {

      self.game.destroy(true);
    }, 350); // Wait for game view exit animation to finish
  }
}
