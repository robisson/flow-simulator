import TasksToStart from "./Queue/StrategiesForSearch/TasksToStart";
import TasksDone from "./Queue/StrategiesForSearch/TasksDone";

export default class TaskManager {
  _currentDate = null;
  _queues = [];
  _totalResources = 0;
  _usedResources = 0;
  _limitSize = 3;
  _hoursByDay = null;

  constructor(currentDate, totalResources, hoursByDay) {
    this._currentDate = currentDate;
    this._totalResources = totalResources;
    this._hoursByDay = hoursByDay;
  }

  updateDate(date) {
    let [todoQueue, doingQueue, doneQueue] = this.getQueues();

    if (todoQueue.isEmpty() && doingQueue.isEmpty()) {
      return;
    }

    //defining tasks that yet start to put in the doing queue
    if (doingQueue.isEmpty() || this.isResourcesAvaiables()) {
      this.moveTodoTasksToDoingQueue(date);
    }

    //defining tasks that was done to put in the done queue
    if (!doingQueue.isEmpty()) {
      let criteriaDoneTasks = new TasksDone(doingQueue.getTasks(), date);
      let doneTasks = criteriaDoneTasks.getTasks();

      doneQueue.add(doneTasks);

      let newDoingQueue = doingQueue
        .getTasks()
        .filter(item => ![...doneTasks.map(task => task.id)].includes(item.id));

      doingQueue.setTasks(newDoingQueue);
    }
  }

  moveTodoTasksToDoingQueue(date) {
    let [todoQueue, doingQueue] = this.getQueues();

    let criteriaTasksToSTart = new TasksToStart(
      todoQueue.getTasks(),
      this.resourcesAvaiables(),
      date,
      this._hoursByDay
    );

    let tasks = criteriaTasksToSTart.getTasks();

    let newTodoTasks = todoQueue
      .getTasks()
      .filter(item => ![...tasks.map(task => task.id)].includes(item.id));

    todoQueue.setTasks(newTodoTasks);
    doingQueue.add(tasks);
  }

  resourcesAvaiables() {
    return this._totalResources - this._usedResources;
  }

  isResourcesAvaiables() {
    return this.resourcesAvaiables() > 0;
  }

  setQueues(...queues) {
    if (queues.length > this._limitSize) {
      throw new Error(
        `The max number of the queues in the TaskManager is ${this._limitSize}`
      );
    }

    this._queues = queues;
  }

  getQueues() {
    return [...this._queues];
  }

  getCurrentDate() {
    return this._currentDate;
  }
}
