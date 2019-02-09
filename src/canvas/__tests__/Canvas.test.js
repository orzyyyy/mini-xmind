import React from 'react';
import { mount } from 'enzyme';
let Canvas;
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

const style = {
  width: 100,
  height: 80,
  background: '#F96',
  borderRadius: '10px',
  border: '1px solid #aaa',
};
const blockProps = {
  test1: {
    x: 90,
    y: 50,
    style,
  },
  test2: {
    x: 20,
    y: 150,
    style,
  },
  test3: {
    x: 100,
    y: 100,
    style,
  },
};

const createWrapper = (...props) =>
  mount(<Canvas style={{ width: '100%', height: '100%' }} {...props} />);

describe('Canvas', () => {
  beforeEach(() => {
    window.DataCollector = new Listener();
  });

  afterEach(() => {
    window.DataCollector = null;
  });

  it('Canvas renders correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it('Block renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setState({ blockProps });

    expect(wrapper.find('.BlockGroup').length).toBe(3);
    expect(wrapper).toMatchSnapshot();
  });

  it('when Block is clicked, Line renders correctly', () => {
    const wrapper = createWrapper();
    wrapper.setState({ blockProps });

    const blocks = wrapper.find('.BlockGroup');
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
    wrapper.setState({ blockProps });

    const blocks = wrapper.find('.BlockGroup');
    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(1);

    blocks.at(0).simulate('click');
    blocks.at(1).simulate('click');
    expect(wrapper.find('.stepped-line-to').length).toBe(1);
  });

  it('when passing data, canvas should render mapping correctly', () => {
    const wrapper = createWrapper();
    wrapper.setProps({ data: mapping });

    expect(wrapper.find('.BlockGroup').length).toBe(3);
    expect(wrapper.find('.TagGroup').length).toBe(3);
    expect(wrapper).toMatchSnapshot();
  });
});
