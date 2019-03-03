import React from 'react';
import { mount } from 'enzyme';
import { SteppedLineTo } from '..';
import 'nino-cli/scripts/setup';

const from = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
};

const to = {
  width: 0,
  height: 0,
  left: 100,
  top: 0,
};

describe('Line', () => {
  it('Line renders correctly', () => {
    const wrapper = mount(
      <SteppedLineTo from={from} to={to} key="line-test" orientation="v" />,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.stepped-line-to').length).toBe(1);
  });

  it('offset works well', () => {
    const wrapper = mount(
      <SteppedLineTo
        from={from}
        to={to}
        key="line-test"
        orientation="v"
        offset={{ x: 100, y: 100 }}
      />,
    );
    expect(wrapper).toMatchSnapshot();

    const x0: string = wrapper.find('SteppedLine').prop('x0');
    expect(parseFloat(x0) + 100).toBe(0);

    const y0: string = wrapper.find('SteppedLine').prop('y0');
    expect(parseFloat(y0) + 100).toBe(0);
  });
});
