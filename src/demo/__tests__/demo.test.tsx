import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import Listener from '../../utils/GlobalListener';
import 'nino-cli/scripts/setup';

// eslint-disable-next-line
const log = console.log;
describe('demo', () => {
  beforeEach(() => {
    (window as any).DataCollector = new Listener();
    // eslint-disable-next-line
    console.log = function() {};
  });

  afterEach(() => {
    (window as any).DataCollector = null;
    // eslint-disable-next-line
    console.log = log;
  });

  it('render correctly', () => {
    const wrapper = mount(<Demo />);
    expect(wrapper).toMatchSnapshot();
  });

  it('when button is clicked, it should return layout info', () => {
    const wrapper = mount(<Demo />);
    const instance: any = wrapper.instance();
    const data = instance.outputData();
    const mapping = {
      BlockGroup: {
        'block-623187': { x: 132, y: 118 },
        'block-624018': { x: 426, y: -50 },
        'block-73377': { x: 428, y: 306 },
      },
      CanvasPosition: { x: -67, y: 230 },
      LineGroup: {
        'line-592694': {
          from: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
          fromKey: 'block-623187',
          to: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
          toKey: 'block-624018',
        },
        'line-77619': {
          from: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
          fromKey: 'block-73377',
          to: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0 },
          toKey: 'block-623187',
        },
      },
      TagGroup: {
        'tag-626505': {
          editable: false,
          input: 'test',
          style: { height: 32, width: 100 },
          x: 169,
          y: 144,
        },
        'tag-629962': {
          editable: false,
          input: 'test2',
          style: { height: 32, width: 100 },
          x: 462,
          y: -23,
        },
        'tag-80986': {
          editable: false,
          input: 'test3',
          style: { height: 32, width: 100 },
          x: 463,
          y: 333,
        },
      },
    };
    expect(mapping).toEqual(data);
  });

  it('when state changed, Line should render correctly', () => {
    const wrapper = mount(<Demo />);
    const instance: any = wrapper.instance();
    const data = instance.outputData();
    wrapper.setState({ data });
    wrapper.update();
    expect(wrapper.find('.stepped-line-to').length).toBe(2);
  });
});
