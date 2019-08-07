import React from "react";
import "./main.scss";
import moment from "moment";
import QueuesFactory from "../../domain/Queue/QueueFactory";
import TaskManager from "../../domain/TaskManager";
import App from "./App";

class AppContainer extends React.Component {
  taskManager = null;
  dateFormat = "DD/MM/YYYY";
  interval = null;

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
      useResources: props.data.useResources,
      investiment: 0,
      costOfDelay: 0
    };
  }

  componentDidMount() {
    this.startFlow();
  }

  getNextDay(date) {
    let skippingWeekends = date.day() === 5 ? 2 : date.day() === 0 ? 1 : 0;
    let days = 1 + skippingWeekends;

    date.add(days, "days");

    return [date, days];
  }

  updateDays() {
    this.interval = setInterval(() => {
      let [date, days] = this.getNextDay(this.state.date);

      this.taskManager.updateTasksStatus(date);

      this.setState({
        queues: this.taskManager.getQueues(),
        days: this.state.days + days
      });

      if (this.taskManager.allTasksDone()) {
        clearInterval(this.interval);
      }
    }, this.state.timeUpdate);
  }

  startFlow() {
    let {
      data: { board: queues }
    } = this.props;

    this.taskManager = TaskManager.create(
      this.state.date,
      this.state.resources,
      this.state.hourByDay
    );

    this.taskManager.setQueues(...QueuesFactory.createQueuesFrom(queues));

    this.setState({ queues: this.taskManager.getQueues() });

    this.updateDays();
  }

  render() {
    return (
      <App
        date={this.state.date}
        queues={this.state.queues}
        dateFormat={this.dateFormat}
        days={this.state.days}
        hoursDelivery={this.state.hoursDelivery}
        investiment={this.state.investiment}
        costOfDelay={this.state.costOfDelay}
        resources={this.state.resources}
        useResources={this.state.useResources}
        timer={this.state.timer}
      />
    );
  }
}

export default AppContainer;
