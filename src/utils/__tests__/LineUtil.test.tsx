import {
  getPlacement,
  preventDefault,
  stopPropagation,
  getRelativeLinesByBlockKey,
  getLineCoordinatesForHorizonal,
  getLineCoordinatesForVertical,
  // getLineCoordinatesForHorizonal,
  // getLineCoordinatesForVertical,
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
        // eslint-disable-next-line no-unused-labels
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
        // eslint-disable-next-line no-unused-labels
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

  it('getLineCoordinatesForHorizonal', () => {
    //
    //   ____________
    //  |           |
    //  |   from    |______
    //  |           |     |
    //  |___________|     |
    //                    |
    //                    |
    //                    |
    //                    |      ____________
    //                    |     |           |
    //                    |_____|    to     |
    //                          |           |
    //                          |___________|
    //
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 208, y: 283 },
        {
          width: 22.578125,
          height: 21,
          x: 271,
          y: 372,
        },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 238.359375,
      firstLineX1: 254.6796875,
      firstLineY0: 293.5,
      firstLineY1: 293.5,
      secondLineX0: 254.6796875,
      secondLineX1: 254.6796875,
      secondLineY0: 293.5,
      secondLineY1: 382.5,
      thirdLineX0: 254.6796875,
      thirdLineX1: 271,
      thirdLineY0: 382.5,
      thirdLineY1: 382.5,
    });
    //
    //                             ____________
    //                            |           |
    //                      ______|   from    |
    //                     |      |           |
    //                     |      |___________|
    //                     |
    //                     |
    //                     |
    //     ____________    |
    //    |           |    |
    //    |    to     |____|
    //    |           |
    //    |___________|
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 400, y: 272 },
        { width: 22.578125, height: 21, x: 271, y: 372 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 400,
      firstLineX1: 346.7890625,
      firstLineY0: 282.5,
      firstLineY1: 282.5,
      secondLineX0: 346.7890625,
      secondLineX1: 346.7890625,
      secondLineY0: 282.5,
      secondLineY1: 382.5,
      thirdLineX0: 346.7890625,
      thirdLineX1: 293.578125,
      thirdLineY0: 382.5,
      thirdLineY1: 382.5,
    });
    //
    //    __________________
    //   |                 |
    //   |       from      |
    //   |                 |
    //   |_________________|
    //            |
    //            |___
    //               |
    //        _______|__________
    //       |                 |
    //       |       to        |
    //       |                 |
    //       |_________________|
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 251, y: 272 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 266.1796875,
      firstLineX1: 266.1796875,
      firstLineY0: 293,
      firstLineY1: 331,
      secondLineX0: 266.1796875,
      secondLineX1: 276.2890625,
      secondLineY0: 331,
      secondLineY1: 331,
      thirdLineX0: 276.2890625,
      thirdLineX1: 276.2890625,
      thirdLineY0: 331,
      thirdLineY1: 369,
    });
    //
    //             __________________
    //            |                 |
    //            |       from      |
    //            |                 |
    //            |_________________|
    //                    |
    //                ____|
    //               |
    //        _______|__________
    //       |                 |
    //       |       to        |
    //       |                 |
    //       |_________________|
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 272, y: 275 },
        { width: 22.578125, height: 21, x: 269, y: 370 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 287.1796875,
      firstLineX1: 287.1796875,
      firstLineY0: 296,
      firstLineY1: 333,
      secondLineX0: 287.1796875,
      secondLineX1: 280.2890625,
      secondLineY0: 333,
      secondLineY1: 333,
      thirdLineX0: 280.2890625,
      thirdLineX1: 280.2890625,
      thirdLineY0: 333,
      thirdLineY1: 370,
    });
    //
    //             __________________
    //            |                 |
    //            |       to        |
    //            |                 |
    //            |_________________|
    //                    |
    //                 ___|
    //                |
    //        ________|_________
    //       |                 |
    //       |      from       |
    //       |                 |
    //       |_________________|
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 257, y: 463 },
        { width: 22.578125, height: 21, x: 271, y: 372 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 272.1796875,
      firstLineX1: 272.1796875,
      firstLineY0: 463,
      firstLineY1: 428,
      secondLineX0: 272.1796875,
      secondLineX1: 282.2890625,
      secondLineY0: 428,
      secondLineY1: 428,
      thirdLineX0: 282.2890625,
      thirdLineX1: 282.2890625,
      thirdLineY0: 428,
      thirdLineY1: 393,
    });
    //
    //    __________________
    //   |                 |
    //   |       to        |
    //   |                 |
    //   |_________________|
    //            |
    //            |____
    //                |
    //        ________|_________
    //       |                 |
    //       |       from      |
    //       |                 |
    //       |_________________|
    //
    expect(
      getLineCoordinatesForHorizonal(
        { width: 30.359375, height: 21, x: 271, y: 497 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 286.1796875,
      firstLineX1: 286.1796875,
      firstLineY0: 497,
      firstLineY1: 443.5,
      secondLineX0: 286.1796875,
      secondLineX1: 276.2890625,
      secondLineY0: 443.5,
      secondLineY1: 443.5,
      thirdLineX0: 276.2890625,
      thirdLineX1: 276.2890625,
      thirdLineY0: 443.5,
      thirdLineY1: 390,
    });
  });

  it('getLineCoordinatesForVertical', () => {
    //
    //   ____________                                   ____________
    //  |           |                                  |           |
    //  |   from1   |                                  |   from2   |
    //  |           |                                  |           |
    //  |___________|                                  |___________|
    //        |                                             |
    //        |_____________________________________________|
    //                                |
    //                           _____|______
    //                          |           |
    //                          |    to     |
    //                          |           |
    //                          |___________|
    //
    expect(
      getLineCoordinatesForVertical(
        { width: 30.359375, height: 21, x: 121, y: 268 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 136.1796875,
      firstLineX1: 136.1796875,
      firstLineY0: 289,
      firstLineY1: 329,
      secondLineX0: 136.1796875,
      secondLineX1: 276.2890625,
      secondLineY0: 329,
      secondLineY1: 329,
      thirdLineX0: 276.2890625,
      thirdLineX1: 276.2890625,
      thirdLineY0: 329,
      thirdLineY1: 369,
    });

    //
    //
    //
    //   ____________
    //  |           |                       ____________
    //  |    from   |___________           |           |
    //  |           |          |___________|     to    |
    //  |___________|                      |           |
    //                                     |___________|
    //
    //
    expect(
      getLineCoordinatesForVertical(
        { width: 30.359375, height: 21, x: 82, y: 366 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 112.359375,
      firstLineX1: 188.6796875,
      firstLineY0: 376.5,
      firstLineY1: 376.5,
      secondLineX0: 188.6796875,
      secondLineX1: 188.6796875,
      secondLineY0: 376.5,
      secondLineY1: 379.5,
      thirdLineX0: 188.6796875,
      thirdLineX1: 265,
      thirdLineY0: 379.5,
      thirdLineY1: 379.5,
    });
    //
    //
    //
    //   ____________
    //  |           |                          _____________
    //  |     to    |_____________            |            |
    //  |           |            |____________|   from     |
    //  |___________|                         |            |
    //                                        |____________|
    //
    expect(
      getLineCoordinatesForVertical(
        { width: 30.359375, height: 21, x: 446, y: 362 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 446,
      firstLineX1: 370.6796875,
      firstLineY0: 372.5,
      firstLineY1: 372.5,
      secondLineX0: 370.6796875,
      secondLineX1: 370.6796875,
      secondLineY0: 372.5,
      secondLineY1: 379.5,
      thirdLineX0: 370.6796875,
      thirdLineX1: 287.578125,
      thirdLineY0: 379.5,
      thirdLineY1: 379.5,
    });
    //
    //                           ____________
    //                          |           |
    //                          |    to     |
    //                          |           |
    //                          |___________|
    //                               |
    //          _____________________|
    //         |
    //   ______|_____
    //  |           |
    //  |   from1   |
    //  |           |
    //  |___________|
    //
    //
    expect(
      getLineCoordinatesForVertical(
        { width: 30.359375, height: 21, x: 195, y: 419 },
        { width: 22.578125, height: 21, x: 265, y: 369 },
        { x: 0, y: 0 },
      ),
    ).toEqual({
      firstLineX0: 210.1796875,
      firstLineX1: 210.1796875,
      firstLineY0: 419,
      firstLineY1: 404.5,
      secondLineX0: 210.1796875,
      secondLineX1: 276.2890625,
      secondLineY0: 404.5,
      secondLineY1: 404.5,
      thirdLineX0: 276.2890625,
      thirdLineX1: 276.2890625,
      thirdLineY0: 404.5,
      thirdLineY1: 390,
    });
  });
});
