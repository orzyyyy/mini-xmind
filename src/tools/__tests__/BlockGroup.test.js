import React from 'react';
import { mount } from 'enzyme';
import MockDate from 'mockdate';
import BlockGroup from '../BlockGroup';
import {
  setClickList,
  setLineMapping,
  setTargetDom,
  getTargetDom,
} from '../../canvas/nino-zone';

const defaultCheckBlockClickList1 = {
  'block-73377': {
    current: {
      bottom: 616,
      height: 80,
      left: 361,
      right: 461,
      top: 536,
      width: 100,
      x: 361,
      y: 536,
    },
    time: 1566984174971,
  },
  'block-624018': {
    current: {
      bottom: 260,
      height: 80,
      left: 359,
      right: 459,
      top: 180,
      width: 100,
      x: 359,
      y: 180,
    },
    time: 1566984176547,
  },
};

describe('BlockGroup', () => {
  it("when lineData is null, onChange shouldn't be called", () => {
    const onChange = jest.fn();
    const renderLine = jest.fn();
    mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        onChange={onChange}
        renderLine={renderLine}
      />,
    );
    expect(onChange).not.toBeCalled();
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const renderLine = jest.fn();
    const wrapper = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        onChange={onChange}
        renderLine={renderLine}
      />,
    );
    wrapper
      .find('Draggable')
      .props()
      .onDrag({ x: 0, y: 0 }, 'block-442566');
    expect(onChange).toBeCalled();
  });

  it('handleBlockClick', () => {
    MockDate.set(new Date('2019-04-09T00:00:00'));
    const renderLine = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(
      <BlockGroup
        data={defaultCheckBlockClickList1}
        lineData={{ 'line-test': {} }}
        onChange={onChange}
        renderLine={renderLine}
      />,
    );
    setClickList({}, true);
    setLineMapping({}, true);
    setTargetDom({ 'block-73377': {}, 'block-624018': {} });
    wrapper
      .find('.block-group')
      .at(1)
      .props()
      .onClick('block-73377');
    expect(onChange).not.toHaveBeenCalled();
    wrapper
      .find('.block-group')
      .at(1)
      .props()
      .onClick('block-624018');
    expect(getTargetDom()).toEqual({
      'block-442566': {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      'block-624018': {},
      'block-73377': {},
    });
    setLineMapping(
      { test1: { fromKey: 'block-73377', toKey: 'block-624018' } },
      true,
    );
    setTargetDom({ 'block-73377': {}, 'block-624018': {} });
    setClickList({ 'block-73377': {}, 'block-624018': {} }, true);
    expect(
      wrapper
        .find('.block-group')
        .at(1)
        .props()
        .onClick('block-73377'),
    ).toBe();
    MockDate.reset();
  });

  it('handleDragStart', () => {
    const stopPropagation = jest.fn();
    const preventDefault = jest.fn();
    const renderLine = jest.fn();
    const wrapper = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        renderLine={renderLine}
      />,
    );
    wrapper
      .find('Draggable')
      .first()
      .props()
      .onStart({ stopPropagation, preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onContextMenu', () => {
    const renderLine = jest.fn();
    const onContextMenu = jest.fn();
    const wrapper = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
            style: {
              width: 100,
              height: 80,
            },
          },
        }}
        lineData={undefined}
        renderLine={renderLine}
        onContextMenu={onContextMenu}
      />,
    );
    wrapper
      .find('.block-group')
      .at(1)
      .props()
      .onContextMenu();
    expect(onContextMenu).toHaveBeenCalled();
  });
});
