import React from 'react';
import { mount } from 'enzyme';
import { shouldPaintLine } from '../BlockGroup';
let BlockGroup;
switch (process.env.LIB_DIR) {
  case 'lib':
    BlockGroup = require('../../../lib/tools').BlockGroup;
    break;
  default:
    BlockGroup = require('../BlockGroup').default;
    break;
}

describe('BlockGroup', () => {
  it("when lineData is null, onChange shouldn't be called", () => {
    const onChange = jest.fn();
    const renderLine = jest.fn();
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
        renderLine={renderLine}
      />,
    );
    expect(onChange).not.toBeCalled();
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const renderLine = jest.fn();
    const wrapper = mount(
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
        renderLine={renderLine}
      />,
    );
    wrapper
      .find('Draggable')
      .props()
      .onDrag({ x: 0, y: 0 }, 'block-442566');
    expect(onChange).toBeCalled();
  });

  it('shouldPaintLine', () => {
    expect(shouldPaintLine(null, {})).toBe(true);
  });
});
