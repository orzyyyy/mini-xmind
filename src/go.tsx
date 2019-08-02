import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './demo';

const MOUNT_NODE = document.getElementById('root');

function renderToDOM() {
  if (MOUNT_NODE !== null) {
    ReactDOM.render(<Demo />, MOUNT_NODE);
  }
}
renderToDOM();
export { renderToDOM };
