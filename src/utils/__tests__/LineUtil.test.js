import { getPlacement } from '../LineUtil';

describe('LineUtil', () => {
  it('getPlacement works correctly', () => {
    const target = { x: 100, y: 100 };

    const relativeTopLeft = { x: 10, y: 10 };
    const relativeTopRight = { x: 200, y: 10 };
    const relativeBottomLeft = { x: 10, y: 200 };
    const relativeBottomRight = { x: 200, y: 200 };

    const topLeft = getPlacement(target, relativeTopLeft);
    expect(topLeft.placement).toBe('topLeft');
    // expect(topLeft.fromAnchor).toBe('');

    expect(getPlacement(target, relativeTopRight).placement).toBe('topRight');
    expect(getPlacement(target, relativeBottomLeft).placement).toBe(
      'bottomLeft',
    );
    expect(getPlacement(target, relativeBottomRight).placement).toBe(
      'bottomRight',
    );
  });
});
