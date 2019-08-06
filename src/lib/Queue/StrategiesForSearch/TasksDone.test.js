import TasksDone from "./TasksDone";
import moment from "moment";
import Task from "../Task";

describe("TasksDone", () => {
  it("shoud to return only done tasks of the list", () => {
    let task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 2);
    let task1 = new Task(2, "dashboar user", 10, 240, moment([2019, 8, 5]), 6);
    let task2 = new Task(3, "user report", 10, 140, moment([2019, 8, 10]), 4);

    let tasks = [task, task1, task2];

    let tasksDone = new TasksDone(tasks, moment([2019, 8, 1]));

    expect(tasksDone.getTasks()).toEqual([task]);
  });
});
