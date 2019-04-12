import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import 'nino-cli/scripts/setup';

describe('demo', () => {
  it('render correctly', () => {
    const wrapper = mount(<Demo />);
    expect(wrapper).toMatchSnapshot();
  });
});
