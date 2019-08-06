import { getRandomIntInclusive } from "../util";
import moment from "moment";

export default class Estimator {
  _effort = null;
  _resources = null;
  _currentDate = null;
  _hourByDay = null;

  constructor(currentDate, effort, resources, hourByDay) {
    this._effort = effort;
    this._resources = resources;
    this._currentDate = currentDate;
    this._hourByDay = hourByDay;
  }

  getEstimation() {
    let errorMargin = getRandomIntInclusive(0, (this._effort / 100) * 30);
    let daysToAdd = Math.ceil(
      (this._effort + errorMargin) / this._resources / this._hourByDay
    );

    let newDate = moment(
      new Date(
        this._currentDate.format("YYYY"),
        parseInt(this._currentDate.format("MM")) - 1,
        this._currentDate.format("DD")
      )
    );

    let skippingWeekends =
      newDate.weekday() === 6 ? 2 : newDate.weekday() === 0 ? 1 : 0;

    if (daysToAdd + skippingWeekends > 0) {
      newDate.add(5, "days");
    }

    return newDate;
  }
}
