import React from 'react';
import { mount } from 'enzyme';
let TagGroup: any;
switch (process.env.LIB_DIR) {
  case 'dist':
    TagGroup = require('../../../dist/lib/toolbar').default;
    break;
  case 'lib':
    TagGroup = require('../../../lib/tools').TagGroup;
    break;
  default:
    TagGroup = require('..').TagGroup;
    break;
}
import Listener from '../../utils/GlobalListener';
import 'nino-cli/scripts/setup';

describe('TagGroup', () => {
  beforeEach(() => {
    (window as any).DataCollector = new Listener();
  });

  afterEach(() => {
    (window as any).DataCollector = null;
  });

  it('when data is null, render correctly', () => {
    const wrapper = mount(<TagGroup />);
    expect(wrapper).toMatchSnapshot();
  });

  it('editable should work correctly', () => {
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(<TagGroup data={data} />);
    expect(wrapper.find('.TagGroup').text()).toBe('test');
    wrapper.setProps({
      data: {
        tag: {
          editable: true,
          input: 'test1',
        },
      },
    });
    expect(wrapper.find('input').prop('value')).toBe('test1');
  });

  it('double click should work correctly', () => {
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(<TagGroup data={data} />);
    wrapper.find('.TagGroup').simulate('doubleclick');
    expect(wrapper.state('data')).toEqual({
      tag: {
        editable: true,
        input: 'test',
      },
    });
  });

  it('when input changed, state should update', () => {
    const data = {
      tag: {
        editable: true,
        input: 'test',
      },
    };
    const wrapper = mount(<TagGroup data={data} />);
    wrapper.find('input').simulate('change', { target: { value: 'test1' } });
    expect(wrapper.state('data')).toEqual({
      tag: {
        editable: true,
        input: 'test1',
      },
    });
  });
});
