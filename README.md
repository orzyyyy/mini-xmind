<p align="center">
  <img style="width: 500px;" src="./docs/logo_transparent.gif" />
</p>

<p align="center">
  <img src="./docs/screenshot.gif" />
</p>

[![codecov](https://codecov.io/gh/orzyyyy/mini-xmind/branch/master/graph/badge.svg)](https://codecov.io/gh/orzyyyy/mini-xmind)

## Install

```bash
npm install mini-xmind --save-dev
```

## Usage

Check `dataSource` [here](./src/demo/index.tsx).

```javascript
import React, { useState, useEffect } from 'react';
import { Canvas, Toolbar } from 'mini-xmind';

const dataSource = {...};

export default () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(dataSource);
  }, []);

  const onChange = newData => {
    setData(newData);
  };

  return (
    <>
      <Toolbar />
      <Canvas className="canvas-wrapper" data={data} onChange={onChange} />
    </>
  );
};
```

## Development

```bash
$ git clone https://github.com/orzyyyy/mini-xmind.git
$ cd mini-xmind
$ npm install
$ npm start
```

Open your browser and visit <http://localhost:9099>

## Test Case

```
npm test
```

## API

### Toolbar props

No prop for now, just render

### Canvas props

| Property    | Description                                         | Type                                                                                                                                               | Default   |
| ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| data        | what you want to paint in canvas                    | [DataSource](https://github.com/orzyyyy/mini-xmind/blob/0b83c704edf98fac54dc5117f120565b28244877/src/canvas/core.tsx#L23)                          | {}        |
| onChange    | return all data when dragging or typing in TagGroup | (dataCollector: [DataSource](https://github.com/orzyyyy/mini-xmind/blob/0b83c704edf98fac54dc5117f120565b28244877/src/canvas/core.tsx#L23)) => void | -         |
| orientation | the direction of Line startting                     | enum, ['horizonal', 'vertical']                                                                                                                    | horizonal |
