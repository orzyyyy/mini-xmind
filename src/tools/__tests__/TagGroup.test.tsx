import React from 'react';
import { mount } from 'enzyme';
import TagGroup from '../TagGroup';

describe('TagGroup', () => {
  it('editable should work correctly', () => {
    const onWheel = jest.fn();
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(
      <TagGroup data={data as any} onChange={jest.fn()} onContextMenu={jest.fn()} lineData={{}} onWheel={onWheel} />,
    );
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
    const onWheel = jest.fn();
    const data = {
      tag: {
        editable: false,
        input: 'test',
      },
    };
    const wrapper = mount(
      <TagGroup data={data as any} onChange={jest.fn()} onContextMenu={jest.fn()} lineData={{}} onWheel={onWheel} />,
    );
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
    const onWheel = jest.fn();
    const data = {
      tag: {
        editable: true,
        input: 'test',
      },
    };
    const wrapper = mount(
      <TagGroup data={data as any} onChange={jest.fn()} onContextMenu={jest.fn()} lineData={{}} onWheel={onWheel} />,
    );
    wrapper.find('TextArea').simulate('change', { target: { value: 'test1' } });
    expect(wrapper.find('TagGroup').props().data).toEqual({
      tag: {
        editable: true,
        input: 'test1',
      },
    });
  });

  it('when dragging, onChange should be called', () => {
    const onWheel = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        onContextMenu={jest.fn()}
        lineData={{}}
        data={
          {
            tag: {
              editable: false,
              input: 'test',
            },
          } as any
        }
        onWheel={onWheel}
      />,
    );
    (wrapper.find('Draggable').props() as any).onDrag({ x: 0, y: 0 }, 'test');
    expect(onChange).toBeCalled();
  });

  it('when typing in Input, onChange should be called', () => {
    const onWheel = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={
          {
            tag: {
              editable: true,
              input: 'test',
            },
          } as any
        }
        onContextMenu={jest.fn()}
        lineData={{}}
        onWheel={onWheel}
      />,
    );
    wrapper.find('TextArea').simulate('change', { target: { value: '1' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('when blur, onChange should be called', () => {
    const onWheel = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <TagGroup
        onChange={onChange}
        data={
          {
            tag: {
              editable: true,
              input: 'test',
            },
          } as any
        }
        onContextMenu={jest.fn()}
        lineData={{}}
        onWheel={onWheel}
      />,
    );
    wrapper.find('TextArea').simulate('blur');
    expect(onChange).toHaveBeenCalled();
  });

  it('onContextMenu', () => {
    const onContextMenu = jest.fn();
    const onWheel = jest.fn();
    const wrapper = mount(
      <TagGroup
        onContextMenu={onContextMenu}
        data={
          {
            tag: {
              editable: false,
              input: 'test',
            },
          } as any
        }
        onChange={jest.fn()}
        onWheel={onWheel}
        lineData={{}}
      />,
    );
    (wrapper
      .find('.tag-group')
      .at(1)
      .props() as any).onContextMenu();
    expect(onContextMenu).toHaveBeenCalled();
  });

  it('Draggable.onStart', () => {
    const onWheel = jest.fn();
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const wrapper = mount(
      <TagGroup
        data={
          {
            tag: {
              editable: false,
              input: 'test',
            },
          } as any
        }
        onChange={jest.fn()}
        onContextMenu={jest.fn()}
        lineData={{}}
        onWheel={onWheel}
      />,
    );
    (wrapper.find('Draggable').props() as any).onStart({
      preventDefault,
      stopPropagation,
    });
    expect(preventDefault).toHaveBeenCalled();
  });
});
