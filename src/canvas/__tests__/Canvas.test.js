import React from 'react';
import { mount } from 'enzyme';
let Canvas;
switch (process.env.LIB_DIR) {
  case 'lib':
    Canvas = require('../../../lib/core').default;
    break;
  case 'dist':
    Canvas = require('../../../dist/lib/canvas').default;
    break;
  default:
    Canvas = require('../..').Canvas;
    break;
}
import { mapping } from '../../mock/mapping';

describe('Canvas', () => {
  it('Canvas renders correctly', () => {
    const wrapper = mount(<Canvas data={mapping} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Block renders correctly', () => {
    const wrapper = mount(<Canvas data={mapping} />);
    expect(wrapper.find('.block-group').length).toBe(6);
  });

  it('render mapping correctly when passing data', () => {
    const wrapper = mount(<Canvas data={mapping} />);

    expect(wrapper.find('.block-group').length).toBe(6);
    expect(wrapper.find('.tag-group').length).toBe(6);
  });

  it('render correctly when data is null', () => {
    const wrapper = mount(<Canvas data={null} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ data: undefined });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ data: {} });
    expect(wrapper).toMatchSnapshot();
  });

  it('onDrop should return when dragItem is null', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const event = {};
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return false;
    };
    expect(
      wrapper
        .find('.react-draggable')
        .first()
        .props()
        .onDrop(event),
    ).toBe(false);
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"","style":{"width":100,"height":80}}';
    };
    wrapper
      .find('.react-draggable')
      .first()
      .props()
      .onDrop(event);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('onDrop should update blockProps when droping a Block', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"block","style":{"width":100,"height":80}}';
    };
    wrapper
      .find('.react-draggable')
      .first()
      .props()
      .onDrop(event);
    expect(onChange).toHaveBeenCalled();
  });

  it('onDrop should update tagProps when droping a Tag', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"input","style":{"width":100,"height":80}}';
    };
    wrapper
      .find('.react-draggable')
      .first()
      .props()
      .onDrop(event);
    expect(onChange).toHaveBeenCalled();
  });

  it('handleDrag should work correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('Draggable')
      .first()
      .props()
      .onDrag(null, { x: 1, y: 1 });
    expect(onChange).toHaveBeenCalled();
  });

  it('right click should work', () => {
    if (process.env.LIB_DIR === 'dist') {
      return;
    }
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const preventDefault = jest.fn();
    const event = { preventDefault };
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onContextMenu({ group: '', event, key: 'tag-626505' });
    expect(onChange).toHaveBeenCalled();
    wrapper
      .find('BlockGroup')
      .first()
      .props()
      .onContextMenu({ group: 'BlockGroup', event, key: 'block-623187' });
    expect(onChange).toHaveBeenCalledWith(
      Object.assign({}, mapping, {
        BlockGroup: mapping.BlockGroup,
      }),
    );
    expect(preventDefault).toHaveBeenCalled();
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onContextMenu({ group: 'TagGroup', event, key: 'tag-626505' });
    expect(onChange).toHaveBeenCalledWith(
      Object.assign({}, mapping, {
        TagGroup: mapping.TagGroup,
      }),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('onWheel should work', () => {
    const onWheel = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onWheel={onWheel} />);
    wrapper
      .find('.Canvas')
      .props()
      .onWheel(null);
    expect(onWheel).toHaveBeenCalledWith(mapping, null);
  });

  it('onChange', () => {
    if (process.env.LIB_DIR === 'dist') {
      return;
    }
    const wrapper = mount(<Canvas data={mapping} />);
    const onChange = jest.fn();
    wrapper.setProps({ data: mapping, onChange });
    wrapper
      .find('BlockGroup')
      .props()
      .onChange(null);
    expect(onChange).toHaveBeenCalled();
  });

  it('handleTagChange', () => {
    if (process.env.LIB_DIR === 'dist') {
      return;
    }
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('TagGroup')
      .props()
      .onChange();
    expect(onChange).toHaveBeenCalledWith(mapping);
  });

  it('handleDragStart', () => {
    const stopPropagation = jest.fn();
    const wrapper = mount(<Canvas data={mapping} />);
    wrapper
      .find('Draggable')
      .first()
      .props()
      .onStart({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });
});
