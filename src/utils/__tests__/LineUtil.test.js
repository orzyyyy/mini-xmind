import {
  getPlacement,
  preventDefault,
  stopPropagation,
  getRelativeLinesByBlockKey,
  getLineCoordinates,
} from '../LineUtil';
import 'nino-cli/scripts/setup';
import { mount } from 'enzyme';
import React from 'react';

describe('LineUtil', () => {
  it('getPlacement works correctly', () => {
    const target = { x: 0, y: 0 };

    // for brower, it's fourth quadrant
    // so change those cases to fourth
    const firstQuadrantTop = { x: 10, y: 20 * -1 };
    const firstQuadrantBottom = { x: 10, y: 5 * -1 };
    const secondQuadrantTop = { x: -10, y: 20 * -1 };
    const secondQuadrantBottom = { x: -10, y: 5 * -1 };
    const thirdQuadrantTop = { x: -10, y: -5 * -1 };
    const thirdQuadrantBottom = { x: -10, y: -20 * -1 };
    const fourthQuadrantTop = { x: 10, y: -5 * -1 };
    const fourthQuadrantBottom = { x: 10, y: -20 * -1 };

    const firstQuadrantTopInstance = getPlacement(target, firstQuadrantTop);
    expect(firstQuadrantTopInstance.fromAnchor).toBe('top');
    expect(firstQuadrantTopInstance.toAnchor).toBe('right');

    const firstQuadrantBottomInstance = getPlacement(
      target,
      firstQuadrantBottom,
    );
    expect(firstQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(firstQuadrantBottomInstance.toAnchor).toBe('right');

    const secondQuadrantTopInstance = getPlacement(target, secondQuadrantTop);
    expect(secondQuadrantTopInstance.fromAnchor).toBe('top');
    expect(secondQuadrantTopInstance.toAnchor).toBe('left');

    const secondQuadrantBottomInstance = getPlacement(
      target,
      secondQuadrantBottom,
    );
    expect(secondQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(secondQuadrantBottomInstance.toAnchor).toBe('left');

    const thirdQuadrantTopInstance = getPlacement(target, thirdQuadrantTop);
    expect(thirdQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantTopInstance.toAnchor).toBe('left');

    const thirdQuadrantBottomInstance = getPlacement(
      target,
      thirdQuadrantBottom,
    );
    expect(thirdQuadrantBottomInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantBottomInstance.toAnchor).toBe('left');

    const fourthQuadrantTopInstance = getPlacement(target, fourthQuadrantTop);
    expect(fourthQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(fourthQuadrantTopInstance.toAnchor).toBe('right');

    const fourthQuadrantBottomInstance = getPlacement(
      target,
      fourthQuadrantBottom,
    );
    expect(fourthQuadrantBottomInstance.fromAnchor).toBe('bottom');
    expect(fourthQuadrantBottomInstance.toAnchor).toBe('right');
  });

  it('preventDefault should work', () => {
    const defaultEvent = jest.fn();
    class Demo extends React.Component {
      render = () => <button onClick={preventDefault}>test</button>;
    }
    const wrapper = mount(<Demo />);
    wrapper
      .find('button')
      .at(0)
      .simulate('click', () => {
        // tslint:disable-next-line
        preventDefault: () => {
          defaultEvent();
        };
      });
    expect(defaultEvent).not.toBeCalled();
  });

  it('stopPropagation should work', () => {
    const defaultEvent = jest.fn();
    class Demo extends React.Component {
      render = () => <button onClick={stopPropagation}>test</button>;
    }
    const wrapper = mount(<Demo />);
    wrapper
      .find('button')
      .at(0)
      .simulate('click', () => {
        // tslint:disable-next-line
        stopPropagation: () => {
          defaultEvent();
        };
      });
    expect(defaultEvent).not.toBeCalled();
  });

  it('getRelativeLinesByBlockKey should work', () => {
    expect(
      getRelativeLinesByBlockKey('block-73377', {
        'block-623187': {},
        'block-624018': {},
        LineGroup: {
          'line-77619': { fromKey: 'block-73377', toKey: 'block-623187' },
          'line-592694': { fromKey: 'block-623187', toKey: 'block-624018' },
        },
      }),
    ).toEqual([]);
    expect(
      getRelativeLinesByBlockKey('block-73377', {
        'line-77619': { fromKey: 'block-73377', toKey: 'block-623187' },
        'line-592694': { fromKey: 'block-623187', toKey: 'block-624018' },
      }),
    ).toEqual(['line-77619']);
  });

  it('getLineCoordinates', () => {
    expect(
      getLineCoordinates(
        { width: 100, x: 468, y: 242 },
        { width: 100, x: 408, y: 502 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      centerX: 488,
      firstLineVisible: false,
      secondLineVisible: true,
      thirdLineVisible: false,
      x0: 568,
      x1: 408,
      y0: 242,
      y1: 502,
    });
    expect(
      getLineCoordinates(
        { width: 100, x: 361, y: 687 },
        { width: 100, x: 409, y: 503 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      centerX: 435,
      firstLineVisible: false,
      secondLineVisible: true,
      thirdLineVisible: false,
      x0: 461,
      x1: 409,
      y0: 687,
      y1: 503,
    });
    expect(
      getLineCoordinates(
        { width: 100, x: 469, y: 695 },
        { width: 100, x: 409, y: 503 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      centerX: 489,
      firstLineVisible: false,
      secondLineVisible: true,
      thirdLineVisible: false,
      x0: 569,
      x1: 409,
      y0: 695,
      y1: 503,
    });
  });
});
