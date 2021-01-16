import _ from 'lodash';
import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  beat: 1,
  midi: _.zipObject(
    _.range(128),
    _.fill(new Array(128), 0)),
  oscHost: '',
  seq: {},
};

const actions = {
  clearSeq: (store) => store.setState({seq: {}}),

  setBeat: (store, beat) => store.setState({beat}),

  setInSeq: (store, beat, data) =>
    store.setState({seq: _.set(store.state.seq, [beat], data)}),

  setMidiEvent: (store, midiEvt) =>
    store.setState({midi: _.merge(store.state.midi, midiEvt)}),

  setOscHost: (store, oscHost) => store.setState({oscHost}),
};

export default globalHook(React, initialState, actions);
