import useMidi from "./useMidi";
import {useEffect} from "react";

const useMidiClock = (onClock, onStop, onSongPos) => {
  const [{midiClockInDevice}, actions] = useMidi( // https://github.com/andregardi/use-global-hook#avoid-unnecessary-renders
    ({midiClockInDevice}) => ({midiClockInDevice}),
    actions => actions,
  );

  let tick = 0;

  useEffect(() => {

    const handleMidiClock = (evt) => {
      tick++;
      if (onClock) onClock({ tick });
    };

    const handleStop = (evt) => {
      if (onStop) onStop();
      console.log('stop')
    };

    const handleSpp = ({ data: [,lsb,msb] }) => {
      const beats = (lsb + msb * 128) * 6;
      console.log('SPP', beats);
      if (onSongPos) onSongPos(beats);
    };

    if (midiClockInDevice) {
      midiClockInDevice.addListener('clock', 'all', handleMidiClock);
      // midiClockInDevice.addListener('start', 'all', handleStart); // wasn't getting called
      midiClockInDevice.addListener('stop', 'all', handleStop);
      midiClockInDevice.addListener('songposition', 'all', handleSpp);
    }

    return () => {
      if (midiClockInDevice) {
        midiClockInDevice.removeListener('clock', 'all', handleMidiClock);
        midiClockInDevice.removeListener('stop', 'all', handleStop);
        midiClockInDevice.removeListener('songposition', 'all', handleSpp);
      }
    }
  }, [midiClockInDevice]);

  return {
    midiClockInDevice,
    reset: () => {
      tick = 0;
    },
  };
};

export default useMidiClock;
