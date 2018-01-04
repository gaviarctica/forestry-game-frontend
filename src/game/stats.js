import {distance, hasMoved} from './helpers';
import Settings from './settings';

export default class Stats {
  constructor(updateUI) {
    this.updateUI = updateUI;
    this.time = 0;
    this.startTime = 0;
    this.stopTime = 0;
    this.previousTime = 0;
    this.distanceMoved = 0;
    this.moved = false;
    this.fuelUsed = 0;
    this.previousPoint = null;
    var self = this;
    this.timer = setInterval(function(){self.counterUp()}, 1000);

    this.settings = (new Settings()).stats;
    this.map_settings = (new Settings()).map;
  }

  stopCounter() {
    clearInterval(this.timer);
  }

  counterUp() {
    this.time += 1;
    var newdate = new Date(null);
    newdate.setSeconds(this.time);
    var workingtime = newdate.toISOString().substr(11,8);
    this.updateUI({
      timestring: workingtime,
      time: this.time
    });
  }

  // Each time log is picked up increase time by 15 seconds
  addLogDelay() {
    this.time += this.settings.LOG_DELAY
  }

  updateLogs(logUpdate) {
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

    this.updateUI(formattedLogUpdate);
  }

  calculateFuel(logsOnBoard) {
    this.fuelUsed = this.fuelUsed + (((this.settings.BASE_MILEAGE + logsOnBoard * this.settings.LOG_FACTOR) * this.timeDelta(this.time)) / this.settings.HOUR);
  }

  getFuelUsed() {
    return this.fuelUsed.toFixed(this.settings.FUEL_USED_DECIMALS);
  }

  timeDelta(time) {
    let timePassed = this.time - this.previousTime;
    this.previousTime = time;
    return timePassed;
  }

  calculateMovement(point) {
    if(this.previousPoint === null) {
      this.previousPoint = point;
    }

    if( hasMoved(point, this.previousPoint) ) {

      // Add 3 seconds to time if truck starts moving
      let movedOld = this.moved;
      this.moved = true;
      if(this.moved != movedOld) {
        this.startTime = this.time;
        if( this.stopTime === 0 || Math.abs(this.startTime - this.stopTime) >= 5 ) {
          this.time += this.settings.FULL_START_STOP_TIME; 
        } else {
          this.time += this.settings.SHORT_START_STOP_TIME;
        }
      }

      // Calculate time according to truck speed and distance moved
      this.time = this.time + (distance(this.previousPoint, point)/this.map_settings.PIXELS_TO_METERS)/this.settings.AVG_VELOCITY;
      
      // Update the distance moved
      this.distanceMoved += distance(this.previousPoint, point)/this.map_settings.PIXELS_TO_METERS;
      this.previousPoint = point;
    } else {
      // Add 3 seconds to time if truck stops moving
      let movedOld = this.moved;
      this.moved = false;
      if(this.moved != movedOld) {
        this.stopTime = this.time;
        if( Math.abs(this.startTime - this.stopTime) >= 5 ) {
          this.time += this.settings.FULL_START_STOP_TIME;
        } else {
          this.time += this.settings.SHORT_START_STOP_TIME;          
        }
      }
    }
  }

  getDistanceMoved() {
    return this.distanceMoved;
  }

  getCost() {
    return(this.settings.SALARY/this.settings.HOUR*this.time + this.fuelUsed*this.settings.DIESEL_PRICE);
  }
}
