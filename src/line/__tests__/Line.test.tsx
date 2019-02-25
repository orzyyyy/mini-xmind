import React from 'react';
import { mount } from 'enzyme';
import { SteppedLineTo } from '..';
import 'nino-cli/scripts/setup';

const from = document.createElement('div');
from.innerHTML = `
  <div style="position: absolute; top: 0px; left: 0px;">from</div>
`;

const to = document.createElement('div');
to.innerHTML = `
<div style="position: absolute; top: 0px; left: 100px;">from</div>
`;

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

    const x0: string = wrapper
      .find('SteppedLine')
      .at(0)
      .prop('x0');
    expect(parseFloat(x0) + 100).toBe(0);

    const y0: string = wrapper
      .find('SteppedLine')
      .at(0)
      .prop('y0');
    expect(parseFloat(y0) + 100).toBe(0);
  });
});
