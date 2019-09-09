import React from 'react';
import { mount } from 'enzyme';
import TagGroup from '../TagGroup';

describe('TagGroup', () => {
  it('editable should work correctly', () => {
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(<TagGroup data={data} />);
    expect(
      wrapper
        .find('.tag-group')
        .at(1)
        .text(),
    ).toBe('test');
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
    wrapper
      .find('.tag-group')
      .at(1)
      .simulate('doubleclick');
    expect(wrapper.find('TagGroup').props().data).toEqual({
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
    expect(wrapper.find('TagGroup').props().data).toEqual({
      tag: {
        editable: true,
        input: 'test1',
      },
    });
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={{
          tag: {
            editable: false,
            input: 'test',
          },
        }}
      />,
    );
    wrapper
      .find('Draggable')
      .props()
      .onDrag({ x: 0, y: 0 }, 'test');
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

  it('onContextMenu', () => {
    const onContextMenu = jest.fn();
    const wrapper = mount(
      <TagGroup
        onContextMenu={onContextMenu}
        data={{
          tag: {
            editable: false,
            input: 'test',
          },
        }}
      />,
    );
    wrapper
      .find('.tag-group')
      .at(1)
      .props()
      .onContextMenu();
    expect(onContextMenu).toHaveBeenCalled();
  });

  it('Draggable.onStart', () => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const wrapper = mount(
      <TagGroup
        data={{
          tag: {
            editable: false,
            input: 'test',
          },
        }}
      />,
    );
    wrapper
      .find('Draggable')
      .props()
      .onStart({ preventDefault, stopPropagation });
    expect(preventDefault).toHaveBeenCalled();
  });
});
