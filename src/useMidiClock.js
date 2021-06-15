import useMidi from "./useMidi";
import {useEffect} from "react";

const useMidiClock = (onClock) => {
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

    if (midiClockInDevice) {
      midiClockInDevice.addListener('clock', 'all', handleMidiClock);
    }

    return () => {
      if (midiClockInDevice) {
        midiClockInDevice.removeListener('clock', 'all', handleMidiClock);
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
