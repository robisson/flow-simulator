import Task from "./Task";
import moment from "moment";

describe("Task", () => {
  it("Task should to be instantied with all props", () => {
    let mockTask = [1, "testName", 10, 10, moment([2019, 1, 1]), 12];

    let task = new Task(...mockTask);

    expect(task.getId()).toBe(mockTask[0]);
    expect(task.getName()).toBe(mockTask[1]);
    expect(task.getCostOfDelay()).toBe(mockTask[2]);
    expect(task.getEstimation()).toBe(mockTask[3]);
    expect(task.getEstimationDate()).toEqual(mockTask[4]);
    expect(task.getResources()).toBe(mockTask[5]);
  });

  it("Test an task that is late", () => {
    let task = new Task(1, "testName", 10, 10, moment([2019, 1, 1]), 12);

    expect(task.isLate(moment())).toBe(true);
  });

  it("Test an task that is not late", () => {
    let date = moment();
    date.add(5, "days");

    let task = new Task(1, "testName", 10, 10, moment(), 12);
    let task2 = new Task(1, "testName", 10, 10, date, 12);

    expect(task.isLate(moment())).toBe(false);
    expect(task2.isLate(date)).toBe(false);
  });
});
