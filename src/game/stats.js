import {distance} from './helpers';
import Settings from './settings';

export default class Stats {
  constructor(updateUI) {
    this.updateUI = updateUI;
    this.time = 0;
    this.distanceMoved = 0;
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
    //console.log(this.time);
    this.time += 1;
    var newdate = new Date(null);
    newdate.setSeconds(this.time);
    var workingtime = newdate.toISOString().substr(11,8);
    this.updateUI({
      timestring: workingtime,
      time: this.time
    });
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
    this.fuelUsed = ((this.settings.BASE_MILEAGE + logsOnBoard * this.settings.LOG_FACTOR) * this.time) / this.settings.HOUR;
  }

  getFuelUsed() {
    return this.fuelUsed.toFixed(this.settings.FUEL_USED_DECIMALS);
  }

  calculateDistance(point) {
    if(this.previousPoint === null) {
      this.previousPoint = point;
    }

    if((point.x !== this.previousPoint.x) || (point.y !== this.previousPoint.y)) {
      this.distanceMoved += distance(this.previousPoint, point)/this.map_settings.PIXELS_TO_METERS;
      this.previousPoint = point;
    }
  }

  getDistanceMoved() {
    return this.distanceMoved;
  }

  getCost() {
    return(this.settings.SALARY/this.settings.HOUR*this.time + this.fuelUsed*this.settings.DIESEL_PRICE);
  }

}
