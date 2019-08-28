import Listener from '../GlobalListener';

describe('GlobalListener', () => {
  it('when no related listener, init it as an empty Array', () => {
    const listener = new Listener();
    const newListener = listener.on('test', () => {});
    expect(newListener.listeners['test'].length).toBe(1);
  });

  it('when bind a function with on, should be called when executing it with listeners', () => {
    const callback = jest.fn();
    const listener = new Listener();
    const newListener = listener.on('test', () => {
      callback();
    });
    newListener.listeners['test'][0]();
    expect(callback).toBeCalled();
  });

  it('when executing do, target callback should be called', () => {
    const callback = jest.fn();
    const listener = new Listener();
    listener.on('test', () => {
      callback('called');
    });
    listener.do('test', result => {
      expect(result).toBe('called');
    });
  });

  it('when executing get, target data should be returned', () => {
    const listener = new Listener();
    listener.set('test', { data: 'result' });
    expect(listener.get('test')).toEqual({ data: 'result' });
  });

  it('when executing clear, meta should be empty', () => {
    const listener = new Listener();
    listener.set('test', { data: 'result' });
    expect(listener.meta['test']).toEqual({ data: 'result' });
    listener.clear();
    expect(listener.meta).toEqual({});
  });

  it('getAll', () => {
    const listener = new Listener();
    expect(listener.getAll()).toEqual({});
  });
});
