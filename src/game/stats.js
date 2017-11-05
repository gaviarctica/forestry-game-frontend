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

    logUpdate.forEach((column, i) => {
      column.forEach((slot, j) => {
        if (slot !== null) {
          formattedLogUpdate.logs[i][j] = slot.type;
        }
      });
    });

    this.updateUI(formattedLogUpdate);
  }
}