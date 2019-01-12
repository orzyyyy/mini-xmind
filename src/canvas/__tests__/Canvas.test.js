import React from 'react';
import { mount } from 'enzyme';
import Canvas from '..';
import 'nino-cli/scripts/setup';

const style = {
  width: 100,
  height: 80,
  background: '#F96',
  borderRadius: '10px',
  border: '1px solid #aaa',
};
const blockProps = {
  test1: {
    x: 90,
    y: 50,
    style,
  },
  test2: {
    x: 20,
    y: 150,
    style,
  },
  test3: {
    x: 100,
    y: 100,
    style,
  },
};

const createWrapper = () =>
  mount(<Canvas style={{ width: '100%', height: '100%' }} />);

describe('Canvas', () => {
  it('Canvas renders correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('Block renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setState({ blockProps });

    expect(wrapper.find('.Block').length).toBe(3);
    expect(wrapper).toMatchSnapshot();
  });

  it('when Block is clicked, Line renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setState({ blockProps });

    const blocks = wrapper.find('.Block');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');

    blocks.at(1).simulate('click');
    blocks.at(2).simulate('click');

    blocks.at(0).simulate('click');
    blocks.at(2).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(3);
  });

  it('should not render redundant Line', () => {
    const wrapper = createWrapper();
    wrapper.setState({ blockProps });

    const blocks = wrapper.find('.Block');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(1);

    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(1);
  });
});
