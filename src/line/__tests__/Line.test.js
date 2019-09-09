import React from 'react';
import { mount } from 'enzyme';
import Line from '../Line';

const from = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
};

const to = {
  width: 0,
  height: 0,
  left: 100,
  top: 0,
};

describe('Line', () => {
  it('Line renders correctly', () => {
    const wrapper = mount(<Line />);
    expect(wrapper).toMatchSnapshot();
  });
});
