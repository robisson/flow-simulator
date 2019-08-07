import Queue from "./Queue/Queue";
import Task from "./Queue/Task";
import moment from "moment";
import TaskManager from "./TaskManager";

describe("TaskManager", () => {
  let task, task2, task3, todoQueue, doingQueue, doneQueue, taskManager;

  beforeEach(() => {
    task = new Task(1, "add a new user", 10, 80, moment([2019, 8, 1]), 2);
    task2 = new Task(2, "dashboar user", 10, 240, moment([2019, 8, 5]), 6);
    task3 = new Task(3, "user report", 10, 140, moment([2019, 8, 10]), 4);
    todoQueue = new Queue("To do", [task, task2, task3]);
    doingQueue = new Queue("Doing");
    doneQueue = new Queue("Done");
    taskManager = TaskManager.create(moment(), 14, 6);
    taskManager.setQueues(todoQueue, doingQueue, doneQueue);
  });

  it("Add queues to Task Manager and define its order flow", () => {
    let [testTodo, testDoing, testDone] = taskManager.getQueues();

    expect(testTodo).toEqual(todoQueue);
    expect(testDoing).toEqual(doingQueue);
    expect(testDone).toEqual(doneQueue);
  });

  it("If the day change, tasks must to start in the queue doing", () => {
    taskManager.updateTasksStatus(moment([2019, 7, 1]));
    let [todoUpdated, doingUpdated, done] = taskManager.getQueues();

    expect(todoUpdated.getSize()).toBe(0);
    expect(doingUpdated.getSize()).toBe(3);
    expect(done.getSize()).toBe(0);
  });

  it("If the day change, tasks must to start in the queue doing 2", () => {
    taskManager.updateTasksStatus(moment([2019, 7, 5]));
    let [todoUpdated, doingUpdated, done] = taskManager.getQueues();

    expect(todoUpdated.getSize()).toBe(0);
    expect(doingUpdated.getSize()).toBe(3);
    expect(done.getSize()).toBe(0);
  });

  it("If to do and doing queue is empty, should return empty queues ", () => {
    let todoQueue = new Queue("To do");
    let doingQueue = new Queue("Doing");
    let doneQueue = new Queue("Done");
    taskManager = TaskManager.create(moment(), 14, 6);
    taskManager.setQueues(todoQueue, doingQueue, doneQueue);

    taskManager.updateTasksStatus(moment([2019, 7, 5]));

    let [todoUpdated, doingUpdated, done] = taskManager.getQueues();

    expect(todoUpdated.getSize()).toBe(0);
    expect(doingUpdated.getSize()).toBe(0);
    expect(done.getSize()).toBe(0);
  });
});