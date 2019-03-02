import React from 'react';
import { mount } from 'enzyme';
import SteppedLine from '../SteppedLine';
import 'nino-cli/scripts/setup';

describe('SteppedLine', () => {
  it('renderVertical should work well', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={0} y1={0} orientation="vertical" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.line-placeholder-item').length).toBe(3);
    const getTargetIndexProps = (wrapper, index) =>
      wrapper
        .find('.line-placeholder-item')
        .at(index)
        .props();
    expect(getTargetIndexProps(wrapper, 0)['orientation']).toBe('vertical');
    expect(getTargetIndexProps(wrapper, 0)['style'].left).toBe('1px');
    expect(getTargetIndexProps(wrapper, 0)['style'].top).toBe('1px');
    expect(getTargetIndexProps(wrapper, 0)['style'].width).toBe('0.5px');

    expect(getTargetIndexProps(wrapper, 1)['orientation']).toBe('vertical');
    expect(getTargetIndexProps(wrapper, 1)['style'].left).toBe('0px');
    expect(getTargetIndexProps(wrapper, 1)['style'].top).toBe('0px');
    expect(getTargetIndexProps(wrapper, 1)['style'].width).toBe('0.5px');

    expect(getTargetIndexProps(wrapper, 2)['orientation']).toBe('vertical');
    expect(getTargetIndexProps(wrapper, 2)['style'].left).toBe('0px');
    expect(getTargetIndexProps(wrapper, 2)['style'].top).toBe('0.5px');
    expect(getTargetIndexProps(wrapper, 2)['style'].width).toBe('1px');
  });

  it('renderHorizontal should work well', () => {
    const wrapper = mount(
      <SteppedLine x0={1} y0={1} x1={0} y1={0} orientation="horizonal" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.line-placeholder-item').length).toBe(3);
    const getTargetIndexProps = (wrapper, index) =>
      wrapper
        .find('.line-placeholder-item')
        .at(index)
        .props();
    expect(getTargetIndexProps(wrapper, 0)['orientation']).toBe('horizonal');
    expect(getTargetIndexProps(wrapper, 0)['style'].left).toBe('1px');
    expect(getTargetIndexProps(wrapper, 0)['style'].top).toBe('1px');
    expect(getTargetIndexProps(wrapper, 0)['style'].width).toBe('0.5px');

    expect(getTargetIndexProps(wrapper, 1)['orientation']).toBe('horizonal');
    expect(getTargetIndexProps(wrapper, 1)['style'].left).toBe('0px');
    expect(getTargetIndexProps(wrapper, 1)['style'].top).toBe('0px');
    expect(getTargetIndexProps(wrapper, 1)['style'].width).toBe('0.5px');

    expect(getTargetIndexProps(wrapper, 2)['orientation']).toBe('horizonal');
    expect(getTargetIndexProps(wrapper, 2)['style'].left).toBe('0.5px');
    expect(getTargetIndexProps(wrapper, 2)['style'].top).toBe('-1px');
    expect(getTargetIndexProps(wrapper, 2)['style'].width).toBe('2px');
  });
});
