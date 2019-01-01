import React from 'react';
import ReactDOM from 'react-dom';
import { render, mount, shallow } from 'enzyme';
import { SteppedLineTo } from '..';
import Block from '../../tools/Block';

describe('DrawLine', () => {
  it('DrawLine render correctly', () => {
    class Demo extends React.Component {
      constructor() {
        super();

        this.state = {
          steps: [],
        };
      }

      componentDidMount = () => {
        let steps = [];

        steps.push(
          <SteppedLineTo
            from={ReactDOM.findDOMNode(this.blockA)}
            to={ReactDOM.findDOMNode(this.blockB)}
            fromAnchor="bottom"
            toAnchor="top"
            borderColor="#ddd"
            borderStyle="solid"
            borderWidth={3}
          />,
        );

        this.setState({ steps });
      };

      render() {
        return (
          <React.Fragment>
            <Block
              top="50px"
              left="90px"
              color="#00f"
              ref={ref => (this.blockA = ref)}
            >
              A
            </Block>
            <Block
              top="150px"
              left="20px"
              color="#00f"
              ref={ref => (this.blockB = ref)}
            >
              B
            </Block>
            {this.state.steps}
          </React.Fragment>
        );
      }
    }
    const wrapper = mount(<Demo />);

    expect(wrapper).toMatchSnapshot();
  });
});
