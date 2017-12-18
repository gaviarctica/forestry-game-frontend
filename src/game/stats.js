export default class Stats {
  constructor(updateUI) {
    this.updateUI = updateUI;
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
