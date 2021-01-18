import _ from 'lodash';
import React from 'react';
import globalHook from 'use-global-hook';

const newEmptyMidi = () => _.zipObject(
  _.range(128),
  _.fill(new Array(128), 0));

const emptyMidi = newEmptyMidi();

const initialState = {
  beat: 1,
  midi: {
    ewi: [], // {note: vel} monophonic
    seq: newEmptyMidi(),
  },
  oscHost: '',
  seq: {},
};

const actions = {
  clearSeq: (store) => store.setState({seq: {}}),

  setBeat: (store, beat) => store.setState({beat}),

  setInSeq: (store, beat, data) =>
    store.setState({seq: _.set(store.state.seq, [beat], data)}),

  setMidiEvent: (store, instrument, midiEvt) =>
    store.setState({midi: instrument === 'ewi'
        ? _.set(store.state.midi, instrument, _.toPairs(midiEvt)[0].map(n => parseInt(n, 10))) // monophonic
        : _.merge(store.state.midi, {[instrument]: midiEvt})}),

  setOscHost: (store, oscHost) => store.setState({oscHost}),
};

export default globalHook(React, initialState, actions);
