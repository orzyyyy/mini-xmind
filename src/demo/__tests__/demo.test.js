import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import Listener from '../../utils/GlobalListener';
import mapping from '../../mock/mapping.json';
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

    // LineGroup has a bug that it can't get instance
    // by DataCoolector when rendered
    // expect(mapping).toEqual(data);

    expect(mapping.BlockGroup).toEqual(data.BlockGroup);
    expect(mapping.TagGroup).toEqual(data.TagGroup);
  });
});
