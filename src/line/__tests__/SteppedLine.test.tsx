import React from 'react';
import { mount } from 'enzyme';
import SteppedLine from '../SteppedLine';

describe('SteppedLine', () => {
  const to = {
    x: 65,
    y: 348,
    width: 100,
    height: 80,
    top: 348,
    right: 165,
    bottom: 428,
    left: 65,
  };
  const from = {
    x: 361,
    y: 536,
    width: 100,
    height: 80,
    top: 536,
    right: 461,
    bottom: 616,
    left: 361,
  };

  it('render horizonal correctly', () => {
    const wrapper = mount(<SteppedLine from={from} to={to} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('render vertical correctly', () => {
    const wrapper = mount(<SteppedLine from={from} to={to} orientation="vertical" />);
    expect(wrapper).toMatchSnapshot();
  });
});
