import {distance, hasMoved} from './helpers';
import Settings from './settings';
import Controls from './controls';
import {Key} from './controls';

export default class Stats {
  constructor(updateUI, controls) {
    this.updateUI = updateUI;
    this.startTime = 0;
    this.stopTime = 0;
    this.previousTime = 0;
    this.moved = false;
    this.previousPoint = null;
    this.actionDone = false;
    this.report = {
      'time': 0,
      'distanceMoved': 0,
      'fuelUsed': 0,

      //detailed report
      'driving_unloaded_time': 0,
      'driving_loaded_time': 0,
      'loading_and_unloading': 0,
      'idling': 0,
      'driving_forward': 0,
      'reverse': 0,
      'driving_unloaded_distance': 0,
      'driving_loaded_distance': 0,
      'fuel_cost': 0,
      'worker_salary': 0,
      'loads_transported': 0,
      'logs_deposited': 0,
      'total_volume': 0,
      'productivity': 0,

      'total_cost': 0
    };
    var self = this;
    this.timer = setInterval(function(){self.counterUp()}, 1000);
    this.settings = (new Settings()).stats;
    this.map_settings = (new Settings()).map;
    this.prod_settings = (new Settings()).productivity;
    this.controls = controls;
  }

  stopCounter() {
    clearInterval(this.timer);
  }

  counterUp() {

    this.actionDone = false;

    this.report.time += 1;
    this.updateUI({
      time: this.report.time
    });
  }

  // Each time log is picked up increase time by 15 seconds
  addLogDelay() {
    this.actionDone = true;
    this.report.time += this.settings.LOG_DELAY;
    this.report.loading_and_unloading += this.settings.LOG_DELAY;
  }

  updateLogs(logUpdate, logCount, action) {
    var formattedLogUpdate = {
      logs: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
      ]
    };

    var logUpdateX = logUpdate.getFormattedLogUpdate();
    logUpdateX.forEach((column, i) => {
      column.forEach((slot, j) => {
        if (slot !== null) {
          formattedLogUpdate.logs[i][4-j] = slot.type;
        }
      });
    });

    if (action === "unload") {
      this.report.logs_deposited += 1;
      if (logCount === 0) {
        this.report.loads_transported += 1;
      }
    }

    this.updateUI(formattedLogUpdate);
  }

  calculateFuel(logsOnBoard) {
    this.report.fuelUsed = this.report.fuelUsed + (((this.settings.BASE_MILEAGE + logsOnBoard * this.settings.LOG_FACTOR) * this.timeDelta(this.report.time)) / this.settings.HOUR);
    this.report.fuel_cost = this.report.fuelUsed * this.settings.DIESEL_PRICE;
  }

  timeDelta(time) {
    let timePassed = this.report.time - this.previousTime;
    this.previousTime = time;
    return timePassed;
  }

  calculateMovement(point, logCount) {
    if(this.previousPoint === null) {
      this.previousPoint = point;
    }

    if( hasMoved(point, this.previousPoint) ) {
      this.actionDone = true;
      // Add 3 seconds to time if truck starts moving
      let movedOld = this.moved;
      this.moved = true;
      if(this.moved != movedOld) {
        this.startTime = this.time;
        if( this.stopTime === 0 || Math.abs(this.startTime - this.stopTime) >= 5 ) {
          this.report.time += this.settings.FULL_START_STOP_TIME;
        } else {
          this.report.time += this.settings.SHORT_START_STOP_TIME;
        }
      }

      // Calculate time according to truck speed and distance moved
      this.report.time = this.report.time + (distance(this.previousPoint, point)/this.map_settings.PIXELS_TO_METERS)/this.settings.AVG_VELOCITY;
      
      // Update the distance moved
      var dist = distance(this.previousPoint, point)/this.map_settings.PIXELS_TO_METERS;
      this.report.distanceMoved += dist;

      // Update the distance moved forward or backward
      if (this.controls.isKeyDown(Key.Up)) {
        this.report.driving_forward += dist;
      } else if (this.controls.isKeyDown(Key.Down)) {
        this.report.reverse += dist;
      }

      // Update distance moved with empty or loaded truck
      if ((this.controls.isKeyDown(Key.Up) || this.controls.isKeyDown(Key.Down)) && logCount > 0) {
        this.report.driving_loaded_distance += dist;
        this.report.driving_loaded_time += this.timeDelta(this.report.time);
      } else if ((this.controls.isKeyDown(Key.Up) || this.controls.isKeyDown(Key.Down)) && logCount === 0) {
        this.report.driving_unloaded_distance += dist;
        this.report.driving_unloaded_time += this.timeDelta(this.report.time);
      }

      this.previousPoint = point;
    } else {
      // Add 3 seconds to time if truck stops moving
      let movedOld = this.moved;
      this.moved = false;
      if(this.moved != movedOld) {
        this.stopTime = this.time;
        if( Math.abs(this.startTime - this.stopTime) >= 5 ) {
          this.report.time += this.settings.FULL_START_STOP_TIME;
        } else {
          this.report.time += this.settings.SHORT_START_STOP_TIME;
        }
      }
    }
  }

  getReport() {
    this.report.total_volume = this.report.logs_deposited*this.prod_settings.Volume;
    this.report.productivity = this.report.total_volume/(this.report.time/this.settings.HOUR);
    this.report.worker_salary = this.settings.SALARY/this.settings.HOUR*this.report.time;
    this.report.total_cost = this.report.worker_salary + this.report.fuel_cost;
    return this.report;
  }
}
