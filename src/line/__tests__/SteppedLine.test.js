import React from 'react';
import { mount } from 'enzyme';
import SteppedLine from '../SteppedLine';

describe('SteppedLine', () => {
  const getTargetIndexProps = (wrapper, name, index) =>
    wrapper
      .find(name)
      .at(index)
      .props();

  it('renderVertical should work well', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={0} y1={0} orientation="vertical" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.line-core').length).toBe(3);
    expect(getTargetIndexProps(wrapper, 'Line', 0).orientation).toBe(
      'vertical',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.left).toBe(
      '1px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.top).toBe('1px');
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.width).toBe(
      '0.5px',
    );

    expect(getTargetIndexProps(wrapper, 'Line', 1).orientation).toBe(
      'vertical',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.left).toBe(
      '0px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.top).toBe('0px');
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.width).toBe(
      '0.5px',
    );

    expect(getTargetIndexProps(wrapper, 'Line', 2).orientation).toBe(
      'vertical',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.left).toBe(
      '0px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.top).toBe(
      '0.5px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.width).toBe(
      '1px',
    );
  });

  it('renderHorizontal should work well', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={0} y1={0} orientation="horizonal" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.line-core').length).toBe(3);

    expect(getTargetIndexProps(wrapper, 'Line', 0).orientation).toBe(
      'horizonal',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.left).toBe(
      '1px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.top).toBe('1px');
    expect(getTargetIndexProps(wrapper, '.line-core', 0).style.width).toBe(
      '0.5px',
    );

    expect(getTargetIndexProps(wrapper, 'Line', 1).orientation).toBe(
      'horizonal',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.left).toBe(
      '0px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.top).toBe('0px');
    expect(getTargetIndexProps(wrapper, '.line-core', 1).style.width).toBe(
      '0.5px',
    );

    expect(getTargetIndexProps(wrapper, 'Line', 2).orientation).toBe(
      'horizonal',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.left).toBe(
      '0.5px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.top).toBe(
      '-1px',
    );
    expect(getTargetIndexProps(wrapper, '.line-core', 2).style.width).toBe(
      '2px',
    );
  });

  it('orientation should work', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={0} y1={0} orientation="test" />,
    );
    expect(wrapper).toEqual({});
  });

  it('return one Line if x1 === x0', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={1} y1={0} orientation="v" />,
    );
    expect(wrapper.find('Line').length).toBe(1);
  });
});
