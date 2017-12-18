export default class Stats {
  constructor(updateUI) {
    this.updateUI = updateUI;
    this.time = 0;
    var self = this;
    this.timer = setInterval(function(){self.counterUp()}, 1000);
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
}
