import React from 'react';
import { mount } from 'enzyme';
const testDist = process.env.LIB_DIR === 'dist';
const Toolbar = testDist
  ? require('../../../dist/lib/toolbar').default
  : require('../Toolbar').default;
import { tools } from '../../options/tools';
import 'nino-cli/scripts/setup';

describe('Toolbar', () => {
  it('toolbar render correctly', () => {
    const wrapper = mount(<Toolbar />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.anticon').length).toBe(tools.length);
  });
});
