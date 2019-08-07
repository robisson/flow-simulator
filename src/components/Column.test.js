import React from "react";
import { mount } from "enzyme";
import Column from "./Column";
import "../../setupTests";

describe("<Column /> component", () => {
  it("should render component correctly with name property and tasks", () => {
    let tasks = [{ id: 1, name: "task" }, { id: 2, name: "task" }];

    let wrapper = mount(<Column name="columnTest" tasks={tasks} />);

    expect(wrapper.props().name).toEqual("columnTest");
    expect(wrapper.props().tasks).toEqual(tasks);

    expect(wrapper).toMatchSnapshot();
  });
});
