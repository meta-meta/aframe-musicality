import _ from 'lodash';
import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  input: undefined,
  inputDevices: [],
  isDeviceSelectorVisible: false,
  midiIn: _.zipObject(
    _.range(128),
    _.fill(new Array(128), 0)),
};

const actions = {
  setInputDevice: (store, amount) => {
    const newCounterValue = store.state.counter + amount;
    store.setState({counter: newCounterValue});
  },

  setInputDevices: (store, inputDevices) =>
    store.setState({inputDevices}),

  setMidiEvent: (store, midiEvt) =>
    store.setState({midiIn: _.merge(store.state.midiIn, midiEvt)}),

  toggleDeviceSelector: (store) =>
    store.setState({isDeviceSelectorVisible: !store.state.isDeviceSelectorVisible}),
};

export default globalHook(React, initialState, actions);
