import Queue from "./Queue";
import Task from "./Task";
import moment from "moment";

describe("Queue", () => {
  let task, name;

  beforeEach(() => {
    name = "To do";
    task = new Task(1, name, 10, 10, moment([2019, 1, 1]), 12);
  });

  it("Queue should to be instantied with prop name and empty elements", () => {
    let queue = new Queue(name);

    expect(queue.getName()).toBe(name);
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });

  it("instantiating queue with elements in its constructor", () => {
    let queue = new Queue(name, task);

    expect(queue.getName()).toBe(name);
    expect(queue.getSize()).toBe(1);
    expect(queue.isEmpty()).toBe(false);
  });

  it("Add tasks to queue with add method using one or more elements", () => {
    let queue = new Queue(name);

    queue.add(task);
    queue.add([task, task]);

    expect(queue.getSize()).toBe(3);
    expect(queue.isEmpty()).toBe(false);
  });

  it("Search an task by prop name in the queue", () => {
    let queue = new Queue(name, task);
    let prop = "name";
    let propInvalid = "propInvalid";

    expect(queue.searchTaskByPropName(prop, name)).toEqual([task]);
    expect(queue.searchTaskByPropName(propInvalid, name)).toEqual([]);
    expect(queue.searchTaskByPropName(prop, "")).toEqual([]);
  });

  it("Remove elements ni the queue", () => {
    let queue = new Queue(name, task);
    let task2 = new Task(1, "task 2", 10, 10, moment([2019, 1, 1]), 12);

    queue.add(task2);

    expect(queue.getSize()).toBe(2);

    queue.removeByProp("name", task2.getName());
    expect(queue.getSize()).toBe(1);

    queue.removeByProp("name", task.getName());
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });
});
