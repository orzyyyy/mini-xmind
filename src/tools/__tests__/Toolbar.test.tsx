import React from 'react';
import { mount } from 'enzyme';
import Toolbar from '../Toolbar';

describe('Toolbar', () => {
  it('toolbar render correctly', () => {
    const wrapper = mount(<Toolbar />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.icon-minus')).toBeTruthy();
    expect(wrapper.find('.icon-branches')).toBeTruthy();
    expect(wrapper.find('.icon-border')).toBeTruthy();
    expect(wrapper.find('.icon-tag')).toBeTruthy();
  });

  it('onDragStart', () => {
    const wrapper = mount(<Toolbar />);
    const onChange = jest.fn();
    const setData = function() {
      onChange();
    };
    const event = { dataTransfer: { effectAllowed: '', setData } };
    (wrapper
      .find('li')
      .at(2)
      .props() as any).onDragStart(event, '{ test: 1 }');
    expect(onChange).toBeCalled();
    expect(event.dataTransfer.effectAllowed).toBe('copy');
  });
});
