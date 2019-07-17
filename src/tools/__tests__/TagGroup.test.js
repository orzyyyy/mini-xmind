import React from 'react';
import { mount } from 'enzyme';
let TagGroup;
switch (process.env.LIB_DIR) {
  case 'lib':
    TagGroup = require('../../../lib/tools').TagGroup;
    break;
  default:
    TagGroup = require('..').TagGroup;
    break;
}

describe('TagGroup', () => {
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
    expect(wrapper.find('.tag-group').text()).toBe('test');
    wrapper.setProps({
      data: {
        tag: {
          editable: true,
          input: 'test1',
        },
      },
    });
    expect(wrapper.find('TextArea').prop('value')).toBe('test1');
  });

  it('double click should work correctly', () => {
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(<TagGroup data={data} />);
    wrapper.find('.tag-group').simulate('doubleclick');
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
    wrapper.find('TextArea').simulate('change', { target: { value: 'test1' } });
    expect(wrapper.state('data')).toEqual({
      tag: {
        editable: true,
        input: 'test1',
      },
    });
  });

  it('when drag stopped, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={{
          tag: {
            editable: true,
            input: 'test',
          },
        }}
      />,
    ).instance();
    wrapper.handleStop({ x: 0, y: 0, key: 'test' });
    expect(onChange).toBeCalled();
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={{
          tag: {
            editable: true,
            input: 'test',
          },
        }}
      />,
    ).instance();
    wrapper.handleDrag();
    expect(onChange).toBeCalled();
  });

  it('when typing in Input, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={{
          tag: {
            editable: true,
            input: 'test',
          },
        }}
      />,
    );
    wrapper.find('TextArea').simulate('change', { target: { value: '1' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('stopPropagation should work', () => {
    const stopPropagation = jest.fn();
    const wrapper = mount(
      <TagGroup
        data={{
          tag: {
            editable: true,
            input: 'test',
          },
        }}
      />,
    ).instance();
    wrapper.handleDragStart({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('when blur, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={{
          tag: {
            editable: true,
            input: 'test',
          },
        }}
      />,
    );
    wrapper.find('TextArea').simulate('blur');
    expect(onChange).toHaveBeenCalled();
  });
});
