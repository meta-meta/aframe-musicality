import _ from 'lodash';
import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  input: undefined,
  inputDevices: [],
  isMidiClockInSelectorOpen: false,
  isMidiInSelectorOpen: false,
  midiClockInDevice: undefined,
  midiInDevice: undefined,
  midiIn: _.zipObject(
    _.range(128),
    _.fill(new Array(128), 0)),
};

const actions = {
  setInputDevices: (store, inputDevices) =>
    store.setState({inputDevices}),

  setMidiEvent: (store, midiEvt) =>
    store.setState({midiIn: _.merge(store.state.midiIn, midiEvt)}),

  setMidiClockInDevice: (store, midiClockInDevice) => store.setState({midiClockInDevice}),

  setMidiInDevice: (store, midiInDevice) => store.setState({midiInDevice}),

  toggleMidiInSelector: (store) =>
    store.setState({isMidiInSelectorOpen: !store.state.isMidiInSelectorOpen}),

  // todo: only 1 selector
  toggleMidiClockInSelector: (store) =>
    store.setState({isMidiClockInSelectorOpen: !store.state.isMidiClockInSelectorOpen}),


};

export default globalHook(React, initialState, actions);
