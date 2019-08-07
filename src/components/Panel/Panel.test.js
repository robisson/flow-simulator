import React from "react";
import { mount } from "enzyme";
import Panel from "./Panel";
import "../../../setupTests";

describe("<Panel /> component", () => {
  it("should render component correctly with name property and tasks", () => {
    let props = {
      dias: 1,
      investiment: 12,
      costOfDelay: 21,
      resources: 12,
      useResources: 1,
      hoursDelivery: 6
    };

    let wrapper = mount(<Panel {...props} />);

    expect(wrapper.props()).toEqual(props);
    expect(wrapper).toMatchSnapshot();
  });
});
