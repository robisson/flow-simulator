export default class TasksDone {
  _tasks = null;
  _date = null;

  constructor(tasks, date) {
    this._tasks = tasks;
    this._date = date;
  }

  getTasks() {
    return [...this._tasks.filter(task => {
      return this._date.diff(task.getEstimationDate()) > 0;
    })];
  }
}
