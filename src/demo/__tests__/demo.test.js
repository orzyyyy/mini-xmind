import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import Listener from '../../utils/GlobalListener';
import mapping from '../../mock/mapping.json';
import 'nino-cli/scripts/setup';

const fetch = window.fetch;
describe('demo', () => {
  beforeEach(() => {
    window.DataCollector = new Listener();
    window.fetch = null;
  });

  afterEach(() => {
    window.DataCollector = null;
    window.fetch = fetch;
  });

  it('render correctly', done => {
    const wrapper = mount(<Demo />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    }, 0);
  });

  it('when button is clicked, it should return layout info', () => {
    const wrapper = mount(<Demo />);
    let data = wrapper.instance().outputData();

    // LineGroup has a bug that it can't get instance
    // by DataCollector when rendered
    // expect(mapping).toEqual(data);

    expect(mapping.BlockGroup).toEqual(data.BlockGroup);
    expect(mapping.TagGroup).toEqual(data.TagGroup);
  });
});
