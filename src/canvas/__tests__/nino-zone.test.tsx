import React from 'react';
import { mount } from 'enzyme';
import NinoZone, { shouldPaintLine, generateLineData, setClickList, setLineMapping } from '../nino-zone';

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

describe('nino-zone', () => {
  it('shouldPaintLine', () => {
    expect(shouldPaintLine(null, {})).toBe(true);
    setLineMapping({}, true);
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 } as any)).toBe(true);
    setLineMapping({
      block1: { fromKey: 'block-73377', toKey: 'block-624018' },
    });
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 } as any)).toBe(false);
  });

  it('generateLineData', () => {
    setClickList(defaultCheckBlockClickList1, true);
    expect(generateLineData({ 'line-test': {} as any }, 'line-test')).toEqual({
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
    setClickList(defaultCheckBlockClickList2, true);
    expect(generateLineData({ 'line-test': {} as any }, 'line-test')).toEqual({
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

  it('should not render redundant line', () => {
    const onChange = jest.fn();
    const onWheel = jest.fn();
    const wrapper = mount(
      <NinoZone
        onChange={onChange}
        targetKey="test-key"
        onContextMenu={jest.fn()}
        name="tag-group"
        data={
          {
            'tag-416176': { x: 186, y: 469, editable: false, input: 'test' },
            'tag-439992': { x: 34, y: 367, editable: false, input: 'test2' },
          } as any
        }
        lineData={{}}
        onWheel={onWheel}
      />,
    );
    setClickList({ test: 1 }, true);
    (wrapper.find('div').props() as any).onClick();
    (wrapper.find('div').props() as any).onClick();
    expect(onChange).toHaveBeenCalled();
  });

  it('onWheel', () => {
    const onChange = jest.fn();
    const onWheel = jest.fn();
    const wrapper: any = mount(
      <NinoZone
        onChange={onChange}
        targetKey="tag-416176"
        onContextMenu={jest.fn()}
        name="tag-group"
        data={
          {
            'tag-416176': { x: 186, y: 469, editable: false, input: 'test' },
            'tag-439992': { x: 34, y: 367, editable: false, input: 'test2' },
          } as any
        }
        lineData={{}}
        onWheel={onWheel}
      />,
    );
    wrapper
      .find('div')
      .props()
      .onWheel({ deltaY: -1 });
    expect(onWheel).toHaveBeenCalledWith({ x: 186, y: 469, editable: false, input: 'test' }, 'tag-416176', {
      deltaY: -1,
    });
  });
});
