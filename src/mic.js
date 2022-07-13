import React from 'react';
import useMic from './useMic';
import {IconButton} from "@material-ui/core";
import {MicOffOutlined, Mic as MicIcon} from '@material-ui/icons';

const Mic = () => {

  const [state, actions] = useMic( // https://github.com/andregardi/use-global-hook#avoid-unnecessary-renders
    ({mediaStream}) => ({mediaStream}),
    actions => actions,
  );

  const handleMicOnClick = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(mediaStream => {
      actions.setMediaStream(mediaStream)
    });
  }

  const handleMicOffClick = () => {
    state.mediaStream.getTracks().forEach(tr => tr.stop());
    actions.setMediaStream(undefined);
  }

  const isMicOn = !!state.mediaStream;

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        // aria-label="open drawer"
        onClick={isMicOn ? handleMicOffClick : handleMicOnClick}
      >
        {isMicOn ? <MicOffOutlined/> : <MicIcon/>}
      </IconButton>
    </>
  );
};

export default Mic;
