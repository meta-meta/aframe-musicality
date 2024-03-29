import _ from 'lodash';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, {useEffect} from 'react';
import MidiIcon from './icons/midiIcon';
import useMidi from './useMidi';
import {WebMidi} from 'webmidi';
import {IconButton, Toolbar} from "@material-ui/core";
import {WatchLater as MidiClockIcon} from '@material-ui/icons';

const Midi = () => {

  const [state, actions] = useMidi( // https://github.com/andregardi/use-global-hook#avoid-unnecessary-renders
    ({
      inputDevices,
      isMidiClockInSelectorOpen,
      isMidiInSelectorOpen,
      midiInDevice,
      outputDevices,
    }) => ({
      inputDevices,
      isMidiClockInSelectorOpen,
      isMidiInSelectorOpen,
      midiInDevice,
      outputDevices,
    }),
    actions => actions,
  );

  const {
    inputDevices,
    isMidiClockInSelectorOpen,
    isMidiInSelectorOpen,
    midiInDevice,
    outputDevices,
  } = state;

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) console.error(err);
      else {
        console.log('WebMidi enabled.');
        actions.setInputDevices(WebMidi.inputs);
        actions.setOutputDevices(WebMidi.outputs);
      }
    }, true);
  }, []);


  const handleMidi = (evt) => {
    const {note: {number: n}, rawVelocity: vel, type} = evt;
    // console.log(evt)
    // actions.setMidiEvent({
    //   [n]: type === 'noteon' ? vel : 0
    // });
  }

  const handleMidiClock = (evt) => {

    // console.log(evt)
    // actions.setMidiEvent({
    //   [n]: type === 'noteon' ? vel : 0
    // });
  }


  const [midiMenuAnchorEl, setMidiMenuAnchorEl] = React.useState(null);

  const handleMidiMenuButtonClick = (isBeatClock = false) => ({ currentTarget }) => {
    setMidiMenuAnchorEl(currentTarget);
    actions[isBeatClock ? 'toggleMidiClockInSelector' : 'toggleMidiInSelector']();
  }

  const handleMidiMenuClose = (isBeatClock = false) => () => {
    console.log('close', isBeatClock ? 'toggleMidiClockInSelector' : 'toggleMidiInSelector')
    actions[isBeatClock ? 'toggleMidiClockInSelector' : 'toggleMidiInSelector']();
    setMidiMenuAnchorEl(null);
  }

  const handleMidiInputSelect = (deviceIdx, isBeatClock = false) => ({ currentTarget }) => { // todo: remove prev listener
    setMidiMenuAnchorEl(currentTarget);

    const midiInDevice = inputDevices[deviceIdx];
    actions[isBeatClock ? 'toggleMidiClockInSelector' : 'toggleMidiInSelector']();
    if (isBeatClock) {
      midiInDevice.addListener('clock', 'all', handleMidiClock);
      actions.setMidiClockInDevice(midiInDevice);
    } else {
      actions.setMidiInDevice(midiInDevice);
      midiInDevice.addListener('noteon', 'all', handleMidi);
      midiInDevice.addListener('noteoff', 'all', handleMidi);
    }

  };

  return ( // TODO: only show if MIDI devices present; use looser permission to query
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleMidiMenuButtonClick(false)}
      >
        <MidiIcon/>
      </IconButton>

      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleMidiMenuButtonClick(true)}
      >
        <MidiClockIcon/>
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={midiMenuAnchorEl}
        open={isMidiInSelectorOpen || isMidiClockInSelectorOpen}
        onClose={handleMidiMenuClose(isMidiClockInSelectorOpen)}
      >
        {inputDevices.map(({name}, idx) => (
          <MenuItem
            key={name}
            onClick={handleMidiInputSelect(idx, isMidiClockInSelectorOpen)}
            selected={isMidiInSelectorOpen && name === _.get(midiInDevice, 'name')}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </>

  );
};

export default Midi;
