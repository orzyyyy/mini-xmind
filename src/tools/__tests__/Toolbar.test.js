import React from 'react';
import { mount } from 'enzyme';
const testDist = process.env.LIB_DIR === 'dist';
const Toolbar = testDist
  ? require('../../../dist/lib/toolbar').default
  : require('../Toolbar').default;
import 'nino-cli/scripts/setup';

describe('Toolbar', () => {
  it('toolbar render correctly', () => {
    expect(mount(<Toolbar />)).toMatchSnapshot();
  });
});
