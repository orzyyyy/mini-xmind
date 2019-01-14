import React from 'react';
import ReactDOM from 'react-dom';
import Listener from './utils/GlobalListener';

import Demo from './demo';

const MOUNT_NODE = document.getElementById('root');

window.DataCollector = new Listener(MOUNT_NODE);

ReactDOM.render(<Demo />, MOUNT_NODE);

if (module.hot) {
  module.hot.accept();
}
