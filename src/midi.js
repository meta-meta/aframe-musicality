import _ from 'lodash';
import React from 'react';
import WebMidi from 'webmidi';

export default class Midi extends React.Component {
  state = {
    input: undefined,
    inputDevices: [],
    midiIn: _.zipObject(
      _.range(128),
      _.fill(new Array(128), 0)),
  };

  componentDidMount() {
    WebMidi.enable((err) => {
      if (err) console.error(err);
      else console.log('WebMidi enabled.');

      this.setState({inputDevices: WebMidi.inputs});

      console.log(WebMidi.inputs);
      if (WebMidi.inputs[0]) {
        WebMidi.inputs[0].addListener('noteon', 'all', this.handleMidi);
        WebMidi.inputs[0].addListener('noteoff', 'all', this.handleMidi);
      }
    });
  }

  setDevice = ({target: {value: ix}}) => { // todo: remove prev listener
    const input = WebMidi.inputs[ix];
    console.log(ix, input);
    this.setState({input});
    input.addListener('noteon', 'all', this.handleMidi);
    input.addListener('noteoff', 'all', this.handleMidi);
  };

  handleMidi = (e) => {
    const n = e.note.number;
    console.log(n)
    this.setState({
      midiIn: {
        ...this.state.midiIn,
        [n]: e.type === 'noteon' ? e.rawVelocity : 0
      }
    })
  };

  render() {
    // return <div>devices</div>
    return (this.state.input
        ? this.props.render({ match: this.props.match, midiIn: this.state.midiIn })
        : (
          <select onChange={this.setDevice}>
            {this.state.inputDevices.map(({name}, ix) => (
              <option key={name} value={ix}>{name}</option>
            ))}
          </select>
        )
    );
  }
}
