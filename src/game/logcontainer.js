import * as PIXI from 'pixi.js';
import Log from './log';
import {LogType} from './logtypes'

export default class LogContainer {
  constructor() {
    this.log_rows = [ new LogRow(ROWTYPE.SHORT),
      new LogRow(ROWTYPE.SHORT),
      new LogRow(ROWTYPE.NORMAL),
      new LogRow(ROWTYPE.NORMAL),
      new LogRow(ROWTYPE.NORMAL)];
  }

  getLogCount() {
    var logCount = 0;
    this.log_rows.forEach(x => {logCount += x.getLogCount()});
    return logCount;
  }

  // tries to add log to container: false if cannot
  addLog(log, sprite) {
    for (var i = 0; i < this.log_rows.length; ++i) {
      if(this.log_rows[i].addLog(log,sprite)) {
        return true;
      }
    }

    return false;
  }

  unloadLogTo(deposit, deposits) {
    for( var i = this.log_rows.length-1; i >= 0; --i) {
      if(this.log_rows[i].unloadLogsTo(deposit, deposits)) return true;
    }

    return false;
  }

  getFormattedLogUpdate() {
    //  fill priority order for log array matrix
    /*
        x/i 0  1  2  3
    y/j  ______________
      0  |  14 16 15 13
      1  |  10 12 11 9
      2  |  6  8  7  5
      3  |  x  4  3  x
      4  |  x  2  1  x
    */

    // 4x5 array matrix for logs in truck
    var logsInTruck = [];
    for (var i = 0; i < 4; ++i) {
      logsInTruck[i] = [];
      for (var j = 0; j < 5; ++j) {
        logsInTruck[i][j] = null;
      }
    }

    for (var i = 0; i < 5; ++i) {
      var row = this.log_rows[i].asArray();
      for (var j = 0; j < 4; ++j) {
        logsInTruck[j][i] = row[j];
      }
    }

    return logsInTruck;

  }
}

var ROWTYPE = {
  NORMAL: {"log_amount":4, "traverse_order": [3,0,2,1], "nts_index":[1,3]},
  SHORT: {"log_amount":2, "traverse_order": [1,0], "stn_index":[1,3]}
}

class LogRow {
  constructor(type) {
    this.type = type;
    this.logs = Array(type.log_amount);
    for (var i = 0; i < this.logs.length; ++i) {
      this.logs[i] = null;
    }
  }

  // adds log to row: true if successful
  addLog(log,sprite) {
    for (var i = 0; i < this.logs.length; ++i) {
      if(this.logs[this.type.traverse_order[i]] === null) {
        this.logs[this.type.traverse_order[i]] = log;
        // clear state
        log.setCanBePickedUp(false);

        // setup graphics for truck visuals
        log.removeFromParent();
        sprite.addChild(log.logSprite);
        // setting index to be correct even in short case
        var point_index = this.type.log_amount == 4 ? this.type.traverse_order[i] : this.type.traverse_order[i]+1;
        log.logSprite.position = new PIXI.Point((point_index * 60) - 90, 250);
        log.logSprite.rotation = Math.PI/2;
        log.logSprite.scale.set(1.0);
        return true;
      }
    }

    return false;
  }

  getLogCount() {
    var logCount = 0;
    this.logs.forEach(x => {if(x !== null) logCount += 1});
    return logCount;
  }

  // tries to unload all possible logs from this deposit
  unloadLogsTo(deposit, deposits) {
    var all_null = true;
    for (var x = 0; x < this.type.log_amount; ++x) {

      // using reverse traverse order
      var log = this.logs[this.type.traverse_order[this.type.log_amount-x-1]];
      all_null = all_null && !log;
      if (!log) continue;
      // checking if level already has current log type
      var levelHasType = this.depositTypeExists(log.type, deposits);

      if (deposit.addLog(log, levelHasType)) {
        this.logs[this.type.traverse_order[this.type.log_amount-x-1]] = null;
        return true;
      }
    }

    // only when all logs are null we return false (termination condition)
    if(all_null) return false;

    return true;
  }

  depositTypeExists(type, deposits) {
    for (var i = 0; i < deposits.length; ++i) {
      var deposit = deposits[i];
      if(type === deposit.type) return true;
    }

    return false;
  }

  asArray() {
    if(this.type.log_amount == 2) {
      return [null,this.logs[0],this.logs[1],null];
    }

    return this.logs;
  }


}
