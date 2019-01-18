import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import Listener from '../../utils/GlobalListener';
import mapping from '../../mock/mapping.json';
import omit from 'omit.js';
import 'nino-cli/scripts/setup';

describe('demo', () => {
  beforeEach(() => {
    window.DataCollector = new Listener();
  });

  afterEach(() => {
    window.DataCollector = null;
  });

  it('render correctly', () => {
    expect(mount(<Demo />)).toMatchSnapshot();
  });

  it('when button is clicked, it should return layout info', () => {
    const wrapper = mount(<Demo />);
    let data = wrapper.instance().outputData();

    // clear LineGroup up
    for (let key in data.LineGroup) {
      data.LineGroup[key] = omit(data.LineGroup[key], ['from', 'to']);
    }

    expect(mapping).toEqual(data);
  });
});
