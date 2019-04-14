import { isSameCoordinate } from '../commonUtil';
import { renderToDOM } from '../../go';
import { render } from 'react-dom';

describe('commonUtil', () => {
  it('when currentKey is null, return', () => {
    expect(isSameCoordinate({}, {}, null)).toBe(false);
    expect(
      isSameCoordinate(
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        'block',
      ),
    ).toBe(false);
    expect(
      isSameCoordinate(
        {
          data: {
            block: { x: 11, y: 10 },
          },
        },
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        'block',
      ),
    ).toBe(true);
  });
});

describe('go', () => {
  const originalGetElement = (global as any).document.getElementById;
  jest.mock('react-dom', () => ({
    render: jest.fn(),
  }));
  beforeEach(() => {
    (global as any).document.getElementById = () => true;
  });
  afterAll(() => {
    (global as any).document.getElementById = originalGetElement;
  });
  it('should call ReactDOM.render', () => {
    renderToDOM();
    expect(render).toMatchSnapshot();
  });
});
