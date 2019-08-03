import moment from "moment";

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//resources
let totalResources = data.resources;
let useResources = 0;

export function timer(setInitialDate, state, setState) {
  setTimeout(function() {
    curretnDate.add(1, "days");
    dias++;

    let skippingWeekends =
      curretnDate.day() == 6 ? 2 : curretnDate.day() == 7 ? 2 : 0;

    if (skippingWeekends) {
      curretnDate.add(skippingWeekends, "days");
      dias += skippingWeekends;
    }

    setInitialDate(curretnDate.format(dateFormat));

    let todoColumn = data.board[0];
    let tasksTodo = todoColumn.tasks;
    let doingColumn = data.board[1];
    let tasksDoing = doingColumn.tasks;
    let doneColumn = data.board[2];
    let tasksDone = doneColumn.tasks;

    moveTasks(tasksDoing, tasksTodo, tasksDone, curretnDate, setState, state);
  }, state.timeUpdate);
}

export function getTaskThatCanToBeToExecute(
  tasksTodo,
  resourcesAvaiable,
  currentDate
) {
  let resources = resourcesAvaiable;
  return tasksTodo
    .filter(task => {
      let isResourceAvaiable = resources - task.resources >= 0;
      resources -= task.resources;

      return isResourceAvaiable;
    })
    .map(task => {
      let newTask = { ...task };
      let { estimation, resources } = newTask;
      let errorMargin = getRandomIntInclusive(0, (estimation / 100) * 30);
      let daysToAdd = Math.ceil(
        (estimation + errorMargin) / resources / data.hourByDay
      );
      let newDate = moment(
        new Date(
          currentDate.format("YYYY"),
          currentDate.format("MM"),
          currentDate.format("DD")
        )
      );

      let skippingWeekends =
        newDate.day() == 6 ? 2 : newDate.day() == 7 ? 2 : 0;

      newDate.add(daysToAdd + skippingWeekends, "days");

      newTask.estimatedDate = newDate;
      newTask.name += " - previsto para " + newDate.format(dateFormat);

      return newTask;
    });
}

export function moveTasksDone(tasks, currentDate) {
  return tasks.filter(task => {
    return currentDate.diff(task.estimatedDate, "days");
  });
}

export function moveTasks(
  tasksDoing,
  tasksTodo,
  tasksDone,
  currentDate,
  setState,
  data
) {
  //verify resources needed
  if (tasksDoing.length) {
    let tasksDone = moveTasksDone(tasksDoing, currentDate);

    data.board[1].tasks = tasksDoing.filter(item =>
      [tasksDone.map(itemDone => itemDone.id)].includes(item.id)
    );

    data.board[2].tasks = [...tasksDone, ...data.board[2].tasks];

    tasksDone.forEach(item => {
      costOfDelay += item.costOfDelay;
    });
  } else {
    //tasks doing
    let tasksToExecute = [
      ...getTaskThatCanToBeToExecute(
        tasksTodo,
        totalResources - useResources,
        currentDate
      )
    ];

    //empty todo
    let idTaskToRemove = tasksToExecute.map(item => item.id);

    data.board[0].tasks = data.board[0].tasks.filter(
      item => !idTaskToRemove.includes(item.id)
    );

    tasksToExecute.forEach(item => {
      investiment += data.costByHour * item.estimation;
      hoursDelivery += item.estimation;
    });

    data.board[1].tasks = tasksToExecute;
  }
}