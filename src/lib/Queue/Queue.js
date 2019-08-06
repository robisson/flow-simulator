export default class Queue {
  _tasks = [];

  constructor(name, elements = []) {
    this.name = name;
    this.add(elements);
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  add(tasks) {
    if (Array.isArray(tasks)) {
      [...tasks].forEach(task => (this._tasks = this._tasks.concat(task)));
    } else {
      this._tasks = this._tasks.concat(tasks);
    }
  }

  getSize() {
    return this._tasks.length;
  }

  isEmpty() {
    return !this._tasks.length;
  }

  removeByProp(prop, value) {
    this._tasks = this._tasks.filter(task => task[prop] !== value);
  }

  searchTaskByPropName(prop, value) {
    return [...this._tasks.filter(element => {
      return element[prop] === value;
    })];
  }

  getTasks() {
    return [...this._tasks];
  }

  setTasks(tasks) {
    this._tasks = tasks;
  }
}
