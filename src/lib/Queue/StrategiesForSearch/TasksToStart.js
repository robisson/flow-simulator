import Estimator from "../Estimator";

export default class TasksToStart {
  _tasks = null;
  _resourcesAvaiables = 0;
  _currentDate = null;
  _usedResources = 0;
  _hoursByDay = null;

  constructor(tasks, resourcesAvaiables, currentDate, hoursByDay) {
    this._tasks = tasks;
    this._resourcesAvaiables = resourcesAvaiables;
    this._currentDate = currentDate;
    this._hoursByDay = hoursByDay;
  }

  getTasks() {
    return [...this._tasks.filter(task => {
      const estimator = new Estimator(
        this._currentDate,
        task.getEstimation(),
        task.getResources(),
        this._hoursByDay
      );

      if (this._resourcesAvaiables >= task.resources) {
        this._resourcesAvaiables -= task.resources;

        task.setEstimationDate(estimator.getEstimation());

        return true;
      } else if (this._resourcesAvaiables > 0) {
        task.setResources(this._resourcesAvaiables);

        this._resourcesAvaiables = 0;

        task.setEstimationDate(estimator.getEstimation());

        return true;
      }

      return false;
    })];
  }

  getResourcesAvaiables() {
    return this._resourcesAvaiables;
  }
}
