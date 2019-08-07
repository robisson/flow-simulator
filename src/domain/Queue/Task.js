export default class Task {
  constructor(id, name, costOfDelay, estimation, estimationDate, resources) {
    this.id = id;
    this.name = name;
    this.costOfDelay = costOfDelay;
    this.estimation = estimation;
    this.estimationDate = estimationDate;
    this.resources = resources;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCostOfDelay() {
    return this.costOfDelay;
  }

  getEstimation() {
    return this.estimation;
  }

  setEstimationDate(estimationDate) {
    this.estimationDate = estimationDate;
  }

  getEstimationDate() {
    return this.estimationDate;
  }

  setResources(resources) {
    this.resources = resources;
  }

  getResources() {
    return this.resources;
  }

  isLate(dateToCompare) {
    return this.estimationDate.diff(dateToCompare, "days") < 0;
  }
}
