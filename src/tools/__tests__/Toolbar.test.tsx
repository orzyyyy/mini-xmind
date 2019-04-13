import React from 'react';
import { mount } from 'enzyme';
let Toolbar: any;
switch (process.env.LIB_DIR) {
  case 'lib':
    Toolbar = require('../../../lib/tools').default;
    break;
  case 'dist':
    Toolbar = require('../../../dist/lib/toolbar').default;
    break;
  default:
    Toolbar = require('..').default;
    break;
}
import { tools } from '../../options/tools';
import 'nino-cli/scripts/setup';

describe('Toolbar', () => {
  it('toolbar render correctly', () => {
    const wrapper = mount(<Toolbar />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.anticon').length).toBe(tools.length);
  });

  it('onDragStart', () => {
    const wrapper: any = mount(<Toolbar />).instance();
    const onChange = jest.fn();
    const setData = function() {
      onChange();
    };
    const event = { dataTransfer: { effectAllowed: '', setData } };
    wrapper.onDragStart(event, '{test:1}');
    expect(onChange).toBeCalled();
    expect(event.dataTransfer.effectAllowed).toBe('copy');
  });
});
