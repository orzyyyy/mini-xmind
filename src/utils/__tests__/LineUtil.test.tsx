import {
  getPlacement,
  preventDefault,
  stopPropagation,
  getRelativeLinesByBlockKey,
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
    expect(firstQuadrantTopInstance.toAnchor).toBe('bottom');

    const firstQuadrantBottomInstance = getPlacement(
      target,
      firstQuadrantBottom,
    );
    expect(firstQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(firstQuadrantBottomInstance.toAnchor).toBe('left');

    const secondQuadrantTopInstance = getPlacement(target, secondQuadrantTop);
    expect(secondQuadrantTopInstance.fromAnchor).toBe('top');
    expect(secondQuadrantTopInstance.toAnchor).toBe('bottom');

    const secondQuadrantBottomInstance = getPlacement(
      target,
      secondQuadrantBottom,
    );
    expect(secondQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(secondQuadrantBottomInstance.toAnchor).toBe('right');

    const thirdQuadrantTopInstance = getPlacement(target, thirdQuadrantTop);
    expect(thirdQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantTopInstance.toAnchor).toBe('right');

    const thirdQuadrantBottomInstance = getPlacement(
      target,
      thirdQuadrantBottom,
    );
    expect(thirdQuadrantBottomInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantBottomInstance.toAnchor).toBe('top');

    const fourthQuadrantTopInstance = getPlacement(target, fourthQuadrantTop);
    expect(fourthQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(fourthQuadrantTopInstance.toAnchor).toBe('left');

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
  });
});
