import React from 'react';
import { mount } from 'enzyme';
let Canvas: any;
switch (process.env.LIB_DIR) {
  case 'dist':
    Canvas = require('../../../dist/lib/canvas').default;
    break;
  case 'lib':
    Canvas = require('../../../lib/canvas').default;
    break;
  default:
    Canvas = require('..').default;
    break;
}
import Listener from '../../utils/GlobalListener';
import mapping from '../../mock/mapping.json';
import 'nino-cli/scripts/setup';

const createWrapper = (...props: Array<any>) =>
  mount(<Canvas style={{ width: '100%', height: '100%' }} {...props} />);

describe('Canvas', () => {
  beforeEach(() => {
    (window as any).DataCollector = new Listener();
  });

  afterEach(() => {
    (window as any).DataCollector = null;
  });

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

    const blocks = wrapper.find('.block-group');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');

    blocks.at(1).simulate('click');
    blocks.at(2).simulate('click');

    blocks.at(0).simulate('click');
    blocks.at(2).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(3);
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
    const wrapper: any = createWrapper().instance();
    const event: any = {};
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return false;
    };
    expect(wrapper.onDrop(event)).toBe(false);
  });

  it('onDrop should update blockProps when droping a Block', () => {
    const wrapper: any = createWrapper().instance();
    const event: any = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return "{\"key\":\"border\",\"value\":\"block\",\"style\":{\"width\":100,\"height\":80}}";
    };
    const value = wrapper.onDrop(event);
    expect(value).toEqual({
      x: 50,
      y: 60,
    });
  });

  it('onDrop should update tagProps when droping a Tag', () => {
    const wrapper: any = createWrapper().instance();
    const event: any = {};
    event.clientX = 100;
    event.clientY = 100;
    event.dataTransfer = {};
    event.dataTransfer.getData = () => {
      return "{\"key\":\"border\",\"value\":\"input\",\"style\":{\"width\":100,\"height\":80}}";
    };
    const value = wrapper.onDrop(event);
    expect(value).toEqual({
      x: 50,
      y: 84,
    });
  });
});
