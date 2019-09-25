import React from 'react';
import { mount } from 'enzyme';
import Canvas from '../core';
import { mapping } from '../../mock/mapping';

describe('Canvas', () => {
  it('Canvas renders correctly', () => {
    const wrapper = mount(<Canvas data={mapping} />);
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
      return '{"key":"border","type":"","style":{"width":100,"height":80}}';
    };
    wrapper
      .find('.react-draggable')
      .first()
      .props()
      .onDrop(event);
    expect(onChange).toHaveBeenCalled();
  });

  it('onDrop should update blockProps when droping a Block', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","type":"block","style":{"width":100,"height":80}}';
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
      return '{"key":"border","type":"tag","style":{"width":100,"height":80}}';
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
    const onChange = jest.fn();
    const wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    const preventDefault = jest.fn();
    const event = { preventDefault };
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onContextMenu({ group: '', event, key: 'tag-491320' });
    expect(onChange).toHaveBeenCalled();
    wrapper
      .find('BlockGroup')
      .first()
      .props()
      .onContextMenu({ group: 'block-group', event, key: 'block-623187' });
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
      .onContextMenu({ group: 'tag-group', event, key: 'tag-491320' });
    expect(onChange).toHaveBeenCalledWith(
      Object.assign({}, mapping, {
        TagGroup: mapping.TagGroup,
      }),
    );
    expect(preventDefault).toHaveBeenCalled();
  });

  it('handleTagChange', () => {
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

  it('handleBlockChange', () => {
    const onChange = jest.fn();
    const data = { ...mapping, block: { x: 100, y: 100 } };
    const wrapper = mount(<Canvas data={data} onChange={onChange} />);
    wrapper
      .find('BlockGroup')
      .props()
      .onChange();
    expect(onChange).toHaveBeenCalledWith(data);
  });
});
