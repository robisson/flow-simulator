import React from "react";
import Task from "./Task";

export default function Column({ name, tasks }) {
  return (
    <div className="list">
      <header>{name}</header>
      <ul>
        {tasks && tasks.map(task => <Task key={task.id} name={task.name} />)}
      </ul>
      <footer>{tasks && tasks.length} atividades</footer>
    </div>
  );
}
