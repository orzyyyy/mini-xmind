import React from 'react';
import { mount } from 'enzyme';
import MockDate from 'mockdate';
import {
  shouldPaintLine,
  cleanCheckBlockClickList,
  getCheckBlockClickList,
  generateLineData,
  setCheckBlockClickList,
  getMapping,
  setMapping,
  setBlockDOM,
} from '../BlockGroup';
let BlockGroup;
switch (process.env.LIB_DIR) {
  case 'lib':
    BlockGroup = require('../../../lib/tools').BlockGroup;
    break;
  default:
    BlockGroup = require('../BlockGroup').default;
    break;
}

const defaultCheckBlockClickList1 = {
  'block-73377': {
    current: {
      bottom: 616,
      height: 80,
      left: 361,
      right: 461,
      top: 536,
      width: 100,
      x: 361,
      y: 536,
    },
    time: 1566984174971,
  },
  'block-624018': {
    current: {
      bottom: 260,
      height: 80,
      left: 359,
      right: 459,
      top: 180,
      width: 100,
      x: 359,
      y: 180,
    },
    time: 1566984176547,
  },
};

const defaultCheckBlockClickList2 = {
  'block-73377': {
    current: {
      bottom: 616,
      height: 80,
      left: 361,
      right: 461,
      top: 536,
      width: 100,
      x: 361,
      y: 536,
    },
    time: 1566984176547,
  },
  'block-624018': {
    current: {
      bottom: 260,
      height: 80,
      left: 359,
      right: 459,
      top: 180,
      width: 100,
      x: 359,
      y: 180,
    },
    time: 1566984174971,
  },
};

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
    setMapping({});
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 })).toBe(
      true,
    );
    setMapping({ block1: { fromKey: 'block-73377', toKey: 'block-624018' } });
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 })).toBe(
      false,
    );
  });

  it('cleanCheckBlockClickList', () => {
    cleanCheckBlockClickList();
    expect(getCheckBlockClickList()).toEqual({});
  });

  it('generateLineData', () => {
    setCheckBlockClickList(defaultCheckBlockClickList1);
    expect(generateLineData({ 'line-test': {} }, 'line-test')).toEqual({
      fromKey: 'block-73377',
      result: {
        'line-test': {
          from: defaultCheckBlockClickList1['block-73377'].current,
          fromKey: 'block-73377',
          to: defaultCheckBlockClickList1['block-624018'].current,
          toKey: 'block-624018',
        },
      },
      toKey: 'block-624018',
    });
    cleanCheckBlockClickList();
    setCheckBlockClickList(defaultCheckBlockClickList2);
    expect(generateLineData({ 'line-test': {} }, 'line-test')).toEqual({
      fromKey: 'block-624018',
      result: {
        'line-test': {
          from: defaultCheckBlockClickList2['block-624018'].current,
          fromKey: 'block-624018',
          to: defaultCheckBlockClickList2['block-73377'].current,
          toKey: 'block-73377',
        },
      },
      toKey: 'block-73377',
    });
  });

  it('handleBlockClick', () => {
    MockDate.set(new Date('2019-04-09T00:00:00'));
    const renderLine = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <BlockGroup
        data={defaultCheckBlockClickList1}
        lineData={{ 'line-test': {} }}
        onChange={onChange}
        renderLine={renderLine}
      />,
    );
    cleanCheckBlockClickList();
    setMapping({}, true);
    setBlockDOM({ 'block-73377': {}, 'block-624018': {} });
    wrapper
      .find('.block-group')
      .first()
      .props()
      .onClick('block-73377');
    expect(getCheckBlockClickList()['block-73377'].current).toEqual({});
    expect(onChange).not.toHaveBeenCalled();
    wrapper
      .find('.block-group')
      .at(1)
      .props()
      .onClick('block-624018');
    expect(getCheckBlockClickList()).toEqual({});
    expect(onChange).toHaveBeenCalled();
    MockDate.reset();
  });
});
