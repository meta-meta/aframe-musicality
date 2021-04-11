import _ from "lodash";
import React, {useCallback, useEffect, useState} from "react";
import useMidi from "./useMidi";
import usePrevious from "./usePrevious";
import {Entity} from "aframe-react";
import {HSVtoHex} from "./color";

const PcSpiralWindController = ({noteToDimensions}) => {
  const [midiInEl, setMidiInEl] = useState();
  const [{midiInDevice}] = useMidi();
  const prevMidiInDevice = usePrevious(midiInDevice);

  useEffect(() => {
    const handleMidi = (evt) => {
      // console.log(evt)
      const {note: {number: n}, velocity: vel, type} = evt;
      const opacity = vel / (0.1 + vel);
      const {s, x, y, z} = noteToDimensions(n);
      midiInEl.setAttribute('material', 'opacity', opacity);
      if (type === 'noteon') {
        midiInEl.note = n; // FIXME Hack
        midiInEl.object3D.position.set(x, y, z + 0.01);
        midiInEl.object3D.scale.set(s * 1.1, s * 1.1, s * 1.1);
        midiInEl.setAttribute('material', 'color', HSVtoHex(n / 12, 0.75, 0.5));
      }
    };

    const handleCC = ({ controller: { number }, value }) => {
      if (number === 2) { // breath control
        const vel = value / 128;
        const opacity = vel / (0.1 + vel);
        midiInEl.setAttribute('material', 'opacity', opacity);
      }
    };

    const handlePitchbend = ({ value }) => {
      // console.log(value)
      const n = midiInEl.note || 0;
      const bendAmount = value * 2;
      const {s, x, y, z} = noteToDimensions(n + bendAmount);
      midiInEl.object3D.position.set(x, y, z + 0.01);
      midiInEl.object3D.scale.set(s * 1.1, s * 1.1, s * 1.1);
    };

    if (midiInEl) {
      if (midiInDevice) {
        console.log('new midiInDevice: ', _.get(midiInDevice,'name'), 'prev: ', _.get(prevMidiInDevice, 'name'));
        midiInDevice.addListener('noteon', 'all', handleMidi);
        midiInDevice.addListener('noteoff', 'all', handleMidi);
        midiInDevice.addListener('controlchange', 'all', handleCC);
        midiInDevice.addListener('pitchbend', 'all', handlePitchbend);
      }
    }

    return () => {
      if (midiInDevice) {
        console.log('removing listeners for', _.get(midiInDevice, 'name'));
        midiInDevice.removeListener('noteon');
        midiInDevice.removeListener('noteoff');
        midiInDevice.removeListener('controlchange');
        midiInDevice.removeListener('pitchbend');
      }
    }
  }, [midiInEl, midiInDevice, noteToDimensions, prevMidiInDevice]);

  const midiInRef = useCallback(setMidiInEl, []);

  return (
    <Entity
      _ref={midiInRef}
      primitive='a-sphere'
      material={{
        blending: 'additive',
        color: HSVtoHex(1, 0, 1),
        opacity: 0,
        transparent: true,
      }}
      radius={0.07}
    />
  )
}

export default PcSpiralWindController;
