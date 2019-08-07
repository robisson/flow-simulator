import React from "react";
import Panel from "../Panel";
import Column from "../Column";

export default function App({
  date,
  queues,
  dateFormat,
  dias,
  hoursDelivery,
  investiment,
  costOfDelay,
  resources,
  useResources,
  timer
}) {
  return (
    <div className="ui">
      <nav className="navbar app">
        <h3>
          FlowSimulator - data: {date.format(dateFormat)} -
          <small>
            <a href="/">{timer ? "Stop" : "Start"}</a>
          </small>
        </h3>
      </nav>
      <nav className="navbar board">Tasks</nav>
      <div className="lists">
        {queues.map(queue => (
          <Column key={queue.id} name={queue.name} tasks={queue.getTasks()} />
        ))}
      </div>
      <Panel
        dias={dias}
        hoursDelivery={hoursDelivery}
        investiment={investiment}
        costOfDelay={costOfDelay}
        resources={resources}
        useResources={useResources}
      />
    </div>
  );
}
