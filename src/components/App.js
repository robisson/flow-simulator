import React from "react";
import Column from "./Column";
import "./main.scss";
import data from "../data";
import moment from "moment";
import { getRandomIntInclusive } from "../lib";
import Panel from "./Panel";

class App extends React.Component {
  state = {
    ...data,
    date: moment(),
    timer: true
  };

  constructor(props) {
    super(props);

    this.dateFormat = "DD/MM/YYYY";
    this.curretnDate = moment();
    this.initialDate = this.curretnDate.format(this.dateFormat);
    this.costOfDelay = 0;
    this.investiment = 0;
    this.dias = 0;
    this.hoursDelivery = 0;
    this.interval = null;
  }

  timer(state) {
    this.setState({ date: this.state.date.add(1, "days") });
    this.dias++;

    let skippingWeekends =
      this.curretnDate.day() === 6 ? 2 : this.curretnDate.day() === 7 ? 2 : 0;

    if (skippingWeekends) {
      this.setState({ date: this.state.date.add(skippingWeekends, "days") });
      this.dias += skippingWeekends;
    }

    let todoColumn = data.board[0];
    let tasksTodo = todoColumn.tasks;
    let doingColumn = data.board[1];
    let tasksDoing = doingColumn.tasks;
    let doneColumn = data.board[2];
    let tasksDone = doneColumn.tasks;

    this.moveTasks(tasksDoing, tasksTodo, tasksDone, this.curretnDate, state);
  }

  getTaskThatCanToBeToExecute(tasksTodo, state, currentDate) {
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
          newDate.day() === 6 ? 2 : newDate.day() === 0 ? 1 : 0;

        if (daysToAdd + skippingWeekends > 0) {
          newDate.add(daysToAdd + skippingWeekends, "days");
        }

        newTask.estimatedDate = newDate;
        newTask.name += ` - previsto para (${currentDate.format(
          this.dateFormat
        )} - ${newDate.format(this.dateFormat)}) - ${newTask.resources}`;

        return newTask;
      });
  }

  moveTasksDone(tasks, currentDate) {
    return tasks.filter(task => {
      return currentDate.diff(task.estimatedDate);
    });
  }

  moveTasks(tasksDoing, tasksTodo, tasksDone, currentDate) {
    let data = this.state;
    //verify resources needed
    if (tasksDoing.length) {
      let tasksDone = this.moveTasksDone(tasksDoing, currentDate);

      data.board[1].tasks = tasksDoing.filter(
        item => ![...tasksDone.map(itemDone => itemDone.id)].includes(item.id)
      );

      data.board[2].tasks = [...tasksDone, ...data.board[2].tasks];

      tasksDone.forEach(item => {
        this.costOfDelay += item.costOfDelay;
        data.useResources -= item.resources;
      });
    }

    if (!tasksDoing.length) {
      data.useResources = 0;
    }

    if (tasksTodo.length) {
      //tasks doing
      let tasksToExecute = [
        ...this.getTaskThatCanToBeToExecute(tasksTodo, data, currentDate)
      ];

      //empty todo
      let idTaskToRemove = tasksToExecute.map(item => item.id);

      data.board[0].tasks = data.board[0].tasks.filter(
        item => !idTaskToRemove.includes(item.id)
      );

      tasksToExecute.forEach(item => {
        this.investiment += data.costByHour * item.estimation;
        this.hoursDelivery += item.estimation;
      });

      data.board[1].tasks = tasksToExecute;
    } else if (!tasksTodo.length && !tasksDoing.length) {
      clearInterval(this.interval);
    }
  }

  componentDidMount() {
    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      this.timer(this.state);
    }, this.state.timeUpdate);
  }

  stop() {
    clearInterval(this.interval);
  }

  clickStop() {
    if (this.state.timer) {
      console.log(this);
      this.stop();
    } else {
      this.start();
    }
    this.setState({ timer: !this.state.timer });
    return false;
  }

  render() {
    let { date } = this.state;

    return (
      <div className="ui">
        <nav className="navbar app">
          <h3>
            FlowSimulator - data: {date.format(this.dateFormat)} -
            
            <small>
              <a
                href="javascript:void(0)"
                onClick={() => {
                  this.clickStop();
                }}
              >
                {this.state.timer ? "Stop" : "Start"}
              </a>
            </small>
          </h3>
        </nav>
        <nav className="navbar board">Tasks</nav>
        <div className="lists">
          {this.state.board.map(({ id, name, tasks }) => (
            <Column key={id} name={name} tasks={tasks} />
          ))}
        </div>
        <Panel
          dias={this.dias}
          hoursDelivery={this.hoursDelivery}
          investiment={this.investiment}
          costOfDelay={this.costOfDelay}
          resources={this.state.resources}
          useResources={this.state.useResources}
        />
      </div>
    );
  }
}

export default App;
