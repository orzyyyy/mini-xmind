import React from 'react';
import { mount } from 'enzyme';
let TagGroup: any;
switch (process.env.LIB_DIR) {
  case 'dist':
    TagGroup = require('../../../dist/lib/toolbar').default;
    break;
  case 'lib':
    TagGroup = require('../../../lib/tools').TagGroup;
    break;
  default:
    TagGroup = require('..').TagGroup;
    break;
}
import Listener from '../../utils/GlobalListener';
import 'nino-cli/scripts/setup';

describe('TagGroup', () => {
  beforeEach(() => {
    (window as any).DataCollector = new Listener();
  });

  afterEach(() => {
    (window as any).DataCollector = null;
  });

  it('when data is null, render correctly', () => {
    const wrapper = mount(<TagGroup />);
    expect(wrapper).toMatchSnapshot();
  });
});
