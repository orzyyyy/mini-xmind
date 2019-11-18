import React from 'react';
import { mount } from 'enzyme';
import Canvas from '../core';
import { mapping } from '../../demo';

describe('Canvas', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('Canvas renders correctly', () => {
    const onChange = jest.fn();
    let wrapper = mount(<Canvas data={mapping} onChange={onChange} />);
    expect(wrapper).toMatchSnapshot();
    wrapper = mount(<Canvas data={{ ...mapping, current: 'tag-491320' }} onChange={onChange} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('onDrop should return when dragItem is null', () => {
    const onChange = jest.fn();
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    const event: any = {};
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
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    const event: any = {};
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
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    const event: any = {};
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
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('Draggable')
      .first()
      .props()
      .onDrag(null, { x: 1, y: 1 });
    expect(onChange).toHaveBeenCalled();
  });

  it('right click should work', () => {
    const onChange = jest.fn();
    const wrapper: any = mount(
      <Canvas data={{ ...mapping, block: { 'block-623187': { x: 100, y: 100 } } }} onChange={onChange} />,
    );
    const preventDefault = jest.fn();
    const event = { preventDefault };
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onContextMenu({ group: '', event, key: 'tag-416176' });
    expect(onChange).toHaveBeenCalled();
    wrapper
      .find('BlockGroup')
      .first()
      .props()
      .onContextMenu({ group: 'block-group', event, key: 'block-623187' });
    expect(onChange).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onContextMenu({ group: 'tag-group', event, key: 'tag-416176' });
    expect(onChange).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('handleTagChange', () => {
    const onChange = jest.fn();
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('TagGroup')
      .props()
      .onChange();
    expect(onChange).toHaveBeenCalled();
  });

  it('handleDragStart', () => {
    const stopPropagation = jest.fn();
    const onChange = jest.fn();
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('Draggable')
      .first()
      .props()
      .onStart({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('handleBlockChange', () => {
    const onChange = jest.fn();
    const data = { ...mapping, block: { 'block-623187': { x: 100, y: 100 } } };
    const wrapper: any = mount(<Canvas data={data} onChange={onChange} />);
    wrapper
      .find('BlockGroup')
      .props()
      .onChange();
    wrapper.update();
    expect(onChange).toHaveBeenCalled();
  });

  it('handleElementWheel and handleCanvasWheel', () => {
    const onChange = jest.fn();
    const wrapper: any = mount(<Canvas data={mapping} onChange={onChange} />);
    wrapper
      .find('TagGroup')
      .first()
      .props()
      .onWheel({ children: ['tag-491320'] });
    expect(onChange).toHaveBeenCalled();

    wrapper
      .find('.Canvas')
      .props()
      .onWheel({ deltaY: 1 });
    expect(onChange).toHaveBeenCalled();
  });
});
