import TasksToStart from "./TasksToStart";
import Task from "../Task";
import moment from "moment";

describe("TasksToStart", () => {
  it("if there are resources, shoud to do all tasks", () => {
    let task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 7);
    let task1 = new Task(2, "dashboar user", 10, 240, moment([2019, 8, 5]), 7);
    let task2 = new Task(3, "user report", 10, 140, moment([2019, 8, 10]), 4);

    let tasks = [task, task1, task2];

    let tasksToStart = new TasksToStart(tasks, 18, moment(), 6);
    expect(tasksToStart.getTasks()).toEqual([task, task1, task2]);
  });

  it("if there no are resources, shoud to do only one task at time", () => {
    let task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 7);
    let task1 = new Task(2, "dashboar user", 10, 240, moment([2019, 8, 5]), 7);
    let task2 = new Task(3, "user report", 10, 140, moment([2019, 8, 10]), 4);

    let tasks = [task, task1, task2];

    let tasksToStart = new TasksToStart(tasks, 7, moment(), 6);
    expect(tasksToStart.getTasks()).toEqual([task]);
    expect(tasksToStart.getResourcesAvaiables()).toEqual(0);
  });

  it("if there no are resources, shoud to do only two tasks at time", () => {
    let task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 7);
    let task1 = new Task(2, "dashboar user", 10, 240, moment([2019, 8, 5]), 12);
    let task2 = new Task(3, "user report", 10, 140, moment([2019, 8, 10]), 4);

    let tasks = [task, task1, task2];

    let tasksToStart = new TasksToStart(tasks, 19, moment(), 6);
    expect(tasksToStart.getTasks()).toEqual([task, task1]);
  });
  
  it("When resources avaiables is minor that task resources, shoud do a task too", () => {
    let task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 7);
    let tasks = [task];

    let tasksToStart = new TasksToStart(tasks, 5, moment(), 6);
    expect(tasksToStart.getTasks()).toEqual([task]);
  });
});
