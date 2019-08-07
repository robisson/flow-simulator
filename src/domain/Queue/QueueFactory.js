import Queue from "./Queue";
import Task from "./Task";

export default class QueuesFactory {
  static createQueuesFrom(queues) {
    return queues.map(
      ({ name, tasks }) =>
        new Queue(
          name,
          tasks.map(
            ({ id, name, costOfDelay, estimation, estimatedDate, resources }) =>
              new Task(
                id,
                name,
                costOfDelay,
                estimation,
                estimatedDate,
                resources
              )
          )
        )
    );
  }
}
