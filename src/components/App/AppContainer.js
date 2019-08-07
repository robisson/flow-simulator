import React from "react";
import "./main.scss";
import moment from "moment";
import Queue from "../../lib/Queue/Queue";
import TaskManager from "../../lib/TaskManager";
import App from "./App";
import Task from "../../lib/Queue/Task";

class AppContainer extends React.Component {
  taskManager = null;

  constructor(props) {
    super(props);

    this.state = {
      queues: [],
      date: moment(),
      timer: true,
      days: 0,
      hourByResource: props.data.hourByResource,
      costByHour: props.data.costByHour,
      hourByDay: props.data.hourByDay,
      timeUpdate: props.data.timeUpdate,
      resources: props.data.resources,
      useResources: props.data.useResources
    };

    this.dateFormat = "DD/MM/YYYY";
    this.costOfDelay = 0;
    this.investiment = 0;
    this.days = 0;
    this.hoursDelivery = 0;
    this.interval = null;
  }

  componentDidMount() {
    this.startTasks();
  }

  getNextDay(date) {
    let skippingWeekends = date.day() === 5 ? 2 : date.day() === 0 ? 1 : 0;
    let days = 1 + skippingWeekends;

    date.add(days, "days");

    return [date, days];
  }

  timer() {
    setInterval(() => {
      let [date, days] = this.getNextDay(this.state.date);

      this.taskManager.updateDate(date);
      let filas = this.taskManager.getQueues();

      this.setState({
        queues: this.taskManager.getQueues(filas),
        days: this.state.days + days
      });
    }, 1000);
  }

  startTasks() {
    let {
      data: { board: queues }
    } = this.props;

    let [todoQueue, doingQueue, doneQueue] = queues.map(
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

    this.taskManager = new TaskManager(
      this.state.date,
      this.state.resources,
      this.state.hourByDay
    );

    this.taskManager.setQueues(todoQueue, doingQueue, doneQueue);

    this.setState({ queues: this.taskManager.getQueues() });

    this.timer();
  }

  render() {
    return (
      <App
        date={this.state.date}
        queues={this.state.queues}
        dateFormat={this.dateFormat}
        days={this.state.days}
        hoursDelivery={this.hoursDelivery}
        investiment={this.investiment}
        costOfDelay={this.costOfDelay}
        resources={this.state.resources}
        useResources={this.state.useResources}
        timer={1}
      />
    );
  }
}

export default AppContainer;
