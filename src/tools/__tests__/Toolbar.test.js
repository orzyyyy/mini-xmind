import React from 'react';
import { mount } from 'enzyme';
let Toolbar;
switch (process.env.LIB_DIR) {
  case 'lib':
    Toolbar = require('../../../lib/tools').default;
    break;
  default:
    Toolbar = require('../..').Toolbar;
    break;
}

describe('Toolbar', () => {
  it('toolbar render correctly', () => {
    const wrapper = mount(<Toolbar />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.anticon').length).toBe(3);
  });

  it('onDragStart', () => {
    const wrapper = mount(<Toolbar />);
    const onChange = jest.fn();
    const setData = function() {
      onChange();
    };
    const event = { dataTransfer: { effectAllowed: '', setData } };
    wrapper
      .find('li')
      .first()
      .props()
      .onDragStart(event, '{ test: 1 }');
    expect(onChange).toBeCalled();
    expect(event.dataTransfer.effectAllowed).toBe('copy');
  });
});
