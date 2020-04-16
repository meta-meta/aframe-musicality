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
    }[evt.code];

    if (char) this.setState({ text: this.state.text + char });
  };

  render() {
    return <div>
      <h3>Use the numpad to enter pitch classes</h3>
      <pre>
          {this.state.text}
      </pre>
    </div>
  }
}

export default NumpadMod12;
