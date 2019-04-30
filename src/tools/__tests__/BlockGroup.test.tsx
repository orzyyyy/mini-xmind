import React from 'react';
import { mount } from 'enzyme';
let BlockGroup: any;
switch (process.env.LIB_DIR) {
  case 'lib':
    BlockGroup = require('../../../lib/tools').BlockGroup;
    break;
  default:
    BlockGroup = require('../BlockGroup').default;
    break;
}
import 'nino-cli/scripts/setup';

describe('BlockGroup', () => {
  it("when lineData is null, onChange shouldn't be called", () => {
    const onChange = jest.fn();
    mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        onChange={onChange}
      />,
    );
    expect(onChange).not.toBeCalled();
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const wrapper: any = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        onChange={onChange}
      />,
    ).instance();
    wrapper.handleDrag({ x: 0, y: 0 }, 'block');
    expect(onChange).toBeCalled();
  });

  it('shouldPaintLine', () => {
    const wrapper: any = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
      />,
    ).instance();
    expect(wrapper.shouldPaintLine(null, {})).toBe(true);
  });
});
