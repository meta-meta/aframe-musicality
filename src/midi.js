import _ from 'lodash';
import PitchClass from './pitchClass';
import React from 'react';
import WebMidi from 'webmidi';
import { Entity } from 'aframe-react';

export default class Midi extends React.Component {
  state = {
    midiIn: _.zipObject(
      _.range(128),
      _.fill(new Array(128), 0)),
  }

  componentDidMount() {
    WebMidi.enable((err) => {
      if (err) console.error(err);
      else console.log('WebMidi enabled.');

      console.log(WebMidi.inputs);
      if (WebMidi.inputs[0]) {
        WebMidi.inputs[0].addListener('noteon', 'all', this.handleMidi);
        WebMidi.inputs[0].addListener('noteoff', 'all', this.handleMidi);
      }
    });
  }

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

    const midiInPitchClasses = _(12)
      .range()
      .map(n => _(this.state.midiIn)
        .pickBy((v, i) => i % 12 === n)
        .values()
        .sum())
      .value();

    return (
      <Entity>
        {_(12)
          .range()
          .filter(n => n % 2 == 0)
          .map(n => ({
            n,
            r: 1.5,
            x: -Math.sin(n * Math.PI / 6),
            y: Math.cos(n * Math.PI / 6),
          }))
          .map(({ n, r, x, y }) => (
            <PitchClass
              midiIn={midiInPitchClasses[n]}
              n={n}
              position={`${r * x} ${r * y} 0`}
            />))
          .value()
        }

        {_(48)
          .range()
          .filter(n => !_.includes([6, 7, 0, 1], n % 8))
          .map((n, i) => ({
            i,
            n: ((i + 1) * 2 + Math.floor(i / 4) * 2) % 12,
            // n: (n * 2) % 12,
            r: 1.5,
            x: Math.sin((n + 0.5) * Math.PI / 24),
            y: Math.cos((n + 0.5) * Math.PI / 24),
          }))
          .map(({ n, r, x, y }) => (
            <PitchClass
              midiIn={midiInPitchClasses[n]}
              n={n}
              position={`${r * x} ${r * y} 0`}
              scale="0.5 0.5 0.5"
            />))
          .value()
        }

        {_(12)
          .range()
          .filter(n => n % 2 != 0)
          .map(n => ({
            n: (n + 6) % 12,
            r: 1.2,
            x: -Math.sin(n * Math.PI / 6),
            y: Math.cos(n * Math.PI / 6),
          }))
          .map(({ n, r, x, y }) => (
            <PitchClass
              midiIn={midiInPitchClasses[n]}
              n={n}
              position={`${r * x} ${r * y} 0`}
            />))
          .value()
        }

        {_(48)
          .range()
          .filter(n => !_.includes([4, 5, 6, 7], n % 8))
          .map((n, i) => ({
            i,
            // n: i,
            n: (i * 2 + 9 + Math.floor(i / 4) * 2) % 12,
            // n: i,
            r: 1.2,
            x: Math.sin((n - 1.5) * Math.PI / 24),
            y: Math.cos((n - 1.5) * Math.PI / 24),
          }))
          .map(({ n, r, x, y }) => (
            <PitchClass
              midiIn={midiInPitchClasses[n]}
              n={n}
              position={`${r * x} ${r * y} 0`}
              scale="0.5 0.5 0.5"
            />))
          .value()
        }
      </Entity>
    );
  }
}