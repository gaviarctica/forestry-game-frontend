import {distance} from './helpers';

const BASE_MILEAGE = 5;
const LOG_FACTOR = 0.5;
const SALARY = 20;
const HOUR = 3600;
const DIESEL_PRICE = 1.2;

export default class Stats {
  constructor(updateUI) {
    this.updateUI = updateUI;
    this.time = 0;
    this.distanceMoved = 0;
    this.fuelUsed = 0;
    this.previousPoint = null;
    var self = this;
    this.timer = setInterval(function(){self.counterUp()}, 1000);
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
    this.fuelUsed = ((BASE_MILEAGE + logsOnBoard * LOG_FACTOR) * this.time) / HOUR;
  }

  getFuelUsed() {
    return this.fuelUsed.toFixed(2);
  }

  calculateDistance(point) {
    if(this.previousPoint === null) {
      this.previousPoint = point;
    }

    if((point.x !== this.previousPoint.x) || (point.y !== this.previousPoint.y)) {
      this.distanceMoved += distance(this.previousPoint, point)/10;
      this.previousPoint = point;
    }
  }

  getDistanceMoved() {
    return this.distanceMoved;
  }

  getCost() {
    return(SALARY/HOUR*this.time + this.fuelUsed*DIESEL_PRICE);
  }

}
