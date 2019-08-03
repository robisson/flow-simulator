import React, { useState } from "react";
import Column from "./components/Column";
import "./App.scss";
import data from "./data";
import moment from "moment";

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dateFormat = "DD/MM/YYYY";
const curretnDate = moment();
const initialDate = curretnDate.format(dateFormat);
let costOfDelay = 0;
let investiment = 0;
let dias = 0;
let stop = false;
let hoursDelivery = 0;

function timer(setInitialDate, state, setState) {
  setTimeout(function() {
    curretnDate.add(1, "days");
    dias++;

    let skippingWeekends =
      curretnDate.day() === 6 ? 2 : curretnDate.day() === 7 ? 2 : 0;

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

function getTaskThatCanToBeToExecute(tasksTodo, state, currentDate) {
  return tasksTodo
    .filter(task => {
      let resourceAvaiable = state.resources - state.useResources;
      let isResourceAvaiable = resourceAvaiable > 0;

      if (isResourceAvaiable) {
        state.useResources +=
          task.resources <= resourceAvaiable
            ? task.resources
            : resourceAvaiable;

        if (task.resources > resourceAvaiable) {
          task.resources = resourceAvaiable;
        }
      }

      return isResourceAvaiable;
    })
    .map(task => {
      let newTask = { ...task };
      let { estimation, resources } = newTask;
      let errorMargin = getRandomIntInclusive(0, (estimation / 100) * 30);
      let daysToAdd = Math.ceil(
        (estimation + errorMargin) / resources / state.hourByDay
      );

      let newDate = moment(
        new Date(
          currentDate.format("YYYY"),
          parseInt(currentDate.format("MM")) - 1,
          currentDate.format("DD")
        )
      );

      let skippingWeekends =
        newDate.day() === 6 ? 2 : newDate.day() === 0 ? 2 : 0;

      if (daysToAdd + skippingWeekends > 0) {
        newDate.add(daysToAdd + skippingWeekends, "days");
      }

      newTask.estimatedDate = newDate;
      newTask.name += ` - previsto para (${currentDate.format(
        dateFormat
      )} - ${newDate.format(dateFormat)}) - ${newTask.resources}`;

      return newTask;
    });
}

function moveTasksDone(tasks, currentDate) {
  return tasks.filter(task => {
    return currentDate.diff(task.estimatedDate);
  });
}

function moveTasks(
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

    data.board[1].tasks = tasksDoing.filter(
      item => ![...tasksDone.map(itemDone => itemDone.id)].includes(item.id)
    );

    data.board[2].tasks = [...tasksDone, ...data.board[2].tasks];

    tasksDone.forEach(item => {
      costOfDelay += item.costOfDelay;
      data.useResources -= item.resources;
    });
  }

  if (!tasksDoing.length) {
    data.useResources = 0;
  }

  if (tasksTodo.length) {
    //tasks doing
    let tasksToExecute = [
      ...getTaskThatCanToBeToExecute(tasksTodo, data, currentDate)
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

function App() {
  const [state, setState] = useState(data);
  const [date, setInitialDate] = useState(initialDate);

  if (state.board[1].tasks.length || stop === false) {
    timer(setInitialDate, state, setState);

    if (!state.board[0].tasks.length) {
      stop = true;
    }
  }

  return (
    <div className="ui">
      <nav className="navbar app">
        <h3>FlowSimulator - data: {date}</h3>
      </nav>
      <nav className="navbar board">
        <h3>Dias corridos - {dias}</h3>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h3>
          Desenvolvedores alocados: {state.useResources}/{state.resources}
        </h3>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h3>
          Investimento: R${new String(investiment.toFixed(2)).replace(".", ",")}
        </h3>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h3>
          CA recuperado: R$
          {new String(costOfDelay.toFixed(2)).replace(".", ",")}
        </h3>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <h3>Horas trabalhadas: {hoursDelivery}</h3>
      </nav>
      <div className="lists">
        {state.board.map(({ id, name, tasks }) => (
          <Column key={id} name={name} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}

export default App;
