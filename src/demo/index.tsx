import React, { useState, useEffect } from 'react';
import Canvas, { DataSource } from '../canvas/core';
import mapping from '../mock/mapping.json';
import Toolbar from '../tools/Toolbar';
import './css/demo.css';

const Demo = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(mapping);
  }, []);

  const handleChange = (data: DataSource) => {
    setData(data);
  };

  const handleWhellChange = (data: DataSource, e: any) => {
    if (data.CanvasPosition) {
      const { z, gap } = data.CanvasPosition;
      if (e.deltaY < 0) {
        // scrolling up
        data.CanvasPosition.z = z + gap;
      } else if (e.deltaY > 0) {
        // scrolling down
        data.CanvasPosition.z = z - gap;
      }
      setData(data);
    }
  };

  return (
    <div className="Demo">
      <Toolbar />
      <Canvas
        className="canvas-wrapper"
        data={data}
        onChange={handleChange}
        onWheel={handleWhellChange}
      />
    </div>
  );
};

export default Demo;
