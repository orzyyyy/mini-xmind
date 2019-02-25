// rename Canvas to core because circleci is case-sensitive
import Canvas from './core';
import Listener from '../utils/GlobalListener';

(window as any).DataCollector = new Listener();

export default Canvas;
