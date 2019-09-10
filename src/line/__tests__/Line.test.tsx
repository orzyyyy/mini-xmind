import React from 'react';
import { mount } from 'enzyme';
import Line from '../Line';

describe('Line', () => {
  it('Line renders correctly', () => {
    const wrapper = mount(<Line x0={0} x1={0} y0={0} y1={0} />);
    expect(wrapper).toMatchSnapshot();
  });
});
