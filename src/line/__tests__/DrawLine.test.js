import React from 'react';
import { render, mount, shallow } from 'enzyme';
import { SteppedLineTo } from '..';
import Block from '../../tools/Block';

describe('DrawLine', () => {
  it('DrawLine render correctly', () => {
    class Demo extends React.Component {
      render() {
        const style = {
          delay: true,
          borderColor: '#ddd',
          borderStyle: 'solid',
          borderWidth: 3,
        };

        return (
          <React.Fragment>
            <Block className="stepped-A" top="50px" left="90px" color="#00f">
              A
            </Block>
            <Block className="stepped-B" top="150px" left="20px" color="#00f">
              B
            </Block>
            <Block className="stepped-C" top="150px" left="90px" color="#00f">
              C
            </Block>
            <Block className="stepped-D" top="150px" left="160px" color="#00f">
              D
            </Block>
            <Block className="stepped-E" top="50px" left="300px" color="#00f">
              E
            </Block>
            <Block className="stepped-F" top="120px" left="300px" color="#00f">
              F
            </Block>
            <SteppedLineTo
              from="stepped-A"
              to="stepped-B"
              fromAnchor="bottom"
              toAnchor="top"
              {...style}
            />
            <SteppedLineTo
              from="stepped-A"
              to="stepped-C"
              fromAnchor="bottom"
              toAnchor="top"
              {...style}
            />
            <SteppedLineTo
              from="stepped-A"
              to="stepped-D"
              fromAnchor="bottom"
              toAnchor="top"
              {...style}
            />
            <SteppedLineTo
              from="stepped-A"
              to="stepped-E"
              fromAnchor="right"
              toAnchor="left"
              orientation="h"
              {...style}
            />
            <SteppedLineTo
              from="stepped-A"
              to="stepped-F"
              fromAnchor="right"
              toAnchor="left"
              orientation="h"
              {...style}
            />
          </React.Fragment>
        );
      }
    }
    const wrapper = mount(<Demo />);

    expect(wrapper).toMatchSnapshot();
  });
});
