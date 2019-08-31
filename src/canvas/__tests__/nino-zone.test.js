import {
  shouldPaintLine,
  generateLineData,
  setClickList,
  setLineMapping,
} from '../nino-zone';

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
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 })).toBe(
      true,
    );
    setLineMapping({
      block1: { fromKey: 'block-73377', toKey: 'block-624018' },
    });
    expect(shouldPaintLine(defaultCheckBlockClickList1, { test: 1 })).toBe(
      false,
    );
  });

  it('generateLineData', () => {
    setClickList(defaultCheckBlockClickList1, true);
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
    setClickList(defaultCheckBlockClickList2, true);
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
});
