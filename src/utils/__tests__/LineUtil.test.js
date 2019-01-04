import { getPlacement } from '../LineUtil';

describe('LineUtil', () => {
  it('getPlacement works correctly', () => {
    const target = { x: 0, y: 0 };

    const firstQuadrantTop = { x: 10, y: 20 };
    const firstQuadrantBottom = { x: 10, y: 5 };
    const secondQuadrantTop = { x: -10, y: 20 };
    const secondQuadrantBottom = { x: -10, y: 5 };
    const thirdQuadrantTop = { x: -10, y: -5 };
    const thirdQuadrantBottom = { x: -10, y: -20 };
    const fourthQuadrantTop = { x: 10, y: -5 };
    const fourthQuadrantBottom = { x: 10, y: -20 };

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
});
