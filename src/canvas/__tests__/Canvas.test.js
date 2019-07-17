import React from 'react';
import { mount } from 'enzyme';
let Canvas;
switch (process.env.LIB_DIR) {
  case 'lib':
    Canvas = require('../../../lib/canvas').default;
    break;
  case 'dist':
    Canvas = require('../../../dist/lib/canvas').default;
    break;
  default:
    Canvas = require('../..').Canvas;
    break;
}
import { mapping } from '../../mock/mapping';

const createWrapper = (...props) =>
  mount(<Canvas style={{ width: '100%', height: '100%' }} {...props} />);

describe('Canvas', () => {
  it('Canvas renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });
    expect(wrapper).toMatchSnapshot();
  });

  it('Block renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });
    expect(wrapper.find('.block-group').length).toBe(3);
  });

  it('when Block is clicked, Line renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });

    expect(Object.keys(wrapper.state('linesProps')).length).toBe(2);
    const blocks = wrapper.find('.block-group');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');

    blocks.at(1).simulate('click');
    blocks.at(2).simulate('click');

    blocks.at(0).simulate('click');
    blocks.at(2).simulate('click');
    expect(Object.keys(wrapper.state('linesProps')).length).toBe(3);
  });

  it('should not render redundant Line', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });

    const blocks = wrapper.find('.block-group');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(3);

    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(3);
  });

  it('when passing data, canvas should render mapping correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });

    expect(wrapper.find('.block-group').length).toBe(3);
    expect(wrapper.find('.tag-group').length).toBe(3);
  });

  it('when data is null, it should render correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: null });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ data: undefined });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ data: {} });
    expect(wrapper).toMatchSnapshot();
  });

  it('onDrop should return when dragItem is null', () => {
    const wrapper = createWrapper().instance();
    const event = {};
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return false;
    };
    expect(wrapper.onDrop(event)).toBe(false);
  });

  it('onDrop should update blockProps when droping a Block', () => {
    const wrapper = createWrapper().instance();
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"block","style":{"width":100,"height":80}}';
    };
    const value = wrapper.onDrop(event);
    expect(value).toEqual({
      x: 50,
      y: 60,
    });
  });

  it('onDrop should update tagProps when droping a Tag', () => {
    const wrapper = createWrapper().instance();
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"input","style":{"width":100,"height":80}}';
    };
    const value = wrapper.onDrop(event);
    expect(value).toEqual({
      x: 50,
      y: 84,
    });
  });

  it('onDrop default return origin', () => {
    const wrapper = createWrapper().instance();
    const event = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return '{"key":"border","value":"test","style":{"width":100,"height":80}}';
    };
    const value = wrapper.onDrop(event);
    expect(value).toEqual({
      x: 50,
      y: 60,
    });
  });

  it('handleDrag should work correctly', () => {
    const wrapper = createWrapper();
    wrapper.instance().handleDrag(null, { x: 1, y: 1 });
    expect(wrapper.state().position).toEqual({ x: 1, y: 1, z: 0, gap: 1 });
  });

  it('stopPropagation should work', () => {
    const stopPropagation = jest.fn();
    const wrapper = createWrapper().instance();
    wrapper.handleDragStart({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('right click should work', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });
    wrapper
      .find('.block-group')
      .at(0)
      .simulate('contextmenu');
    expect(wrapper.find('.block-group').length).toBe(2);
    wrapper
      .find('.tag-group')
      .at(0)
      .simulate('contextmenu');
    expect(wrapper.find('.tag-group').length).toBe(2);
  });

  it('onWheel should work', () => {
    const wrapper = createWrapper();
    const onWheel = jest.fn();
    wrapper.setProps({ data: mapping, onWheel });
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
    const wrapper = createWrapper();
    const onChange = jest.fn();
    wrapper.setProps({ data: mapping, onChange });
    wrapper
      .find('BlockGroup')
      .props()
      .onChange(null);
    expect(onChange).toHaveBeenCalled();
  });

  it('clean checkBlockClickList after clicking canvas', () => {
    if (process.env.LIB_DIR === 'dist') {
      return;
    }
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });

    const blocks = wrapper.find('.block-group');
    blocks.at(0).simulate('click');
    wrapper.find('Canvas').simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(1);
  });
});
