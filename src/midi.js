import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, {useEffect} from 'react';
import useMidi from './useMidi';
import WebMidi from 'webmidi';

const Midi = () => {

  const [state, actions] = useMidi( // https://github.com/andregardi/use-global-hook#avoid-unnecessary-renders
    ({inputDevices, isDeviceSelectorVisible}) => ({inputDevices, isDeviceSelectorVisible}),
    actions => actions,
  );

  const {
    inputDevices,
    isDeviceSelectorVisible,
  } = state;

  useEffect(() => {
    WebMidi.enable((err) => {
      if (err) console.error(err);
      else {
        console.log('WebMidi enabled.');
        actions.setInputDevices(WebMidi.inputs);
      }
    });

    window.addEventListener('keyup', ({ code }) => {
      if (code === 'Space') actions.toggleDeviceSelector();
    })
  }, []);


  const handleMidi = ({note: {number: n}, rawVelocity: vel, type}) =>
    actions.setMidiEvent({
      [n]: type === 'noteon' ? vel : 0
    });

  return (
    <Menu
      id="simple-menu"
      // anchorEl={anchorEl}
      keepMounted
      open={isDeviceSelectorVisible}
    >
      {inputDevices.map(({name}, ix) => (
        <MenuItem
          key={name}
          onClick={() => { // todo: remove prev listener
            const input = inputDevices[ix];
            actions.setInputDevice(input);
            actions.toggleDeviceSelector();
            input.addListener('noteon', 'all', handleMidi);
            input.addListener('noteoff', 'all', handleMidi);
          }}>
          {name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Midi;
