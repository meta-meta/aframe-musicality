import React from 'react';
import globalHook from 'use-global-hook';

const initialState = {
  mediaStream: undefined,
};

const actions = {
  setMediaStream: (store, mediaStream) =>
    store.setState({mediaStream}),
};

export default globalHook(React, initialState, actions);
