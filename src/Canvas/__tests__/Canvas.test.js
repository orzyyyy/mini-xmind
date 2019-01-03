import React from 'react';
import { render, mount, shallow } from 'enzyme';
import Canvas from '..';

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

describe('Canvas', () => {
  it('Canvas renders correctly', () => {
    const wrapper = mount(<Canvas style={{ width: '100%', height: '100%' }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Block renders correctly', () => {
    const wrapper = mount(<Canvas style={{ width: '100%', height: '100%' }} />);
    wrapper.setState({ blockProps });

    expect(wrapper.find('.Block').length).toBe(3);
    expect(wrapper).toMatchSnapshot();
  });

  it('when Block is clicked, Line renders correctly', () => {
    const wrapper = mount(<Canvas style={{ width: '100%', height: '100%' }} />);
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
    const wrapper = mount(<Canvas style={{ width: '100%', height: '100%' }} />);
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
