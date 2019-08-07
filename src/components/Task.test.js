import React from "react";
import { mount } from "enzyme";
import Task from "./Task";
import "../../setupTests";

describe("<Task /> component", () => {
  it("should render component correctly with name property", () => {
    let wrapper = mount(<Task name="test" />);

    expect(wrapper.props().name).toEqual('test');

    expect(wrapper).toMatchSnapshot();
  });
});
