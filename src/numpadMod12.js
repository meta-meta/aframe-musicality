import _ from 'lodash';
import React, { Component } from 'react';
import { toSymbol } from "./util";

class NumpadMod12 extends Component {
  state = {
    text: '',
  };

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
  }

  handleKeyPress = (evt) => {
    // console.log(evt.code)
    const char = {
      Backquote: '0',
      Digit1: '1',
      Digit2: '2',
      Digit3: '3',
      Digit4: '4',
      Digit5: '5',
      Digit6: '6',
      Digit7: '7',
      Digit8: '8',
      Digit9: '9',
      Digit0: '૪',
      Minus: 'Ɛ',
      Equal: '0',
      Numpad0: '0',
      Numpad1: '1',
      Numpad2: '2',
      Numpad3: '3',
      Numpad4: '4',
      Numpad5: '5',
      Numpad6: '6',
      Numpad7: '7',
      Numpad8: '8',
      Numpad9: '9',
      NumpadDivide: '૪',
      NumpadMultiply: 'Ɛ',
      NumpadDecimal: ' ',
      NumpadEnter: '\n',
      Enter: '\n',
      Space: ' ',
    }[evt.code];

    if (char) {
      evt.preventDefault();
      this.setState({ text: this.state.text + char });
    }
  };

  handleChange = ({ target: { value }}) => this.setState({ text: value });

  render() {
    return <div>
      <h3>Use the numpad to enter pitch classes</h3>
      <textarea
        cols={24}
        rows={20}
        onChange={this.handleChange}
        style={{
          background: 'black',
          color: 'darkgray',
          fontSize: 20,
        }}
        value={this.state.text}
      />
    </div>
  }
}

export default NumpadMod12;
