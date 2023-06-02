import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import useMidi from './useMidi';
import usePrevious from './usePrevious';
import {Entity} from 'aframe-react';
import {getNoteColorHex, HSVtoHex} from './color';

const PcSpiralWindController = ({isNoteOffIgnored, noteToDimensions, notePoolSize = 10}) => {
  const [noteEls, setNoteEls] = useState(Array(notePoolSize));

  const [midiInEl, setMidiInEl] = useState();
  const [{midiInDevice}] = useMidi();
  const prevMidiInDevice = usePrevious(midiInDevice);


  useEffect(() => {
    const notePool = _.range(notePoolSize).map(() => null);
    const getPoolKey = (n) => {
      const ix = _.indexOf(notePool, n);
      if (ix >= 0) return ix;

      const ixEmpty = _.indexOf(notePool, null);
      if (ixEmpty >= 0) {
        notePool[ixEmpty] = n;
        return ixEmpty;
      }

      return -1;
    };

    const getNoteElAndKey = (n) => {
      const key = getPoolKey(n);
      return key < 0 ? [null] : [noteEls[key], key];
    };

    let pitchBendAmount = 0;

    const handleMidi = (evt) => {
      // console.log(evt)
      const {note: {number: n}, velocity: vel, type} = evt;
      const [noteEl, poolKey] = getNoteElAndKey(n);
      if (!noteEl) return;


      if (type === 'noteon') {
        const opacity = vel / (0.1 + vel);
        const {s, x, y, z} = noteToDimensions(n + pitchBendAmount);
        noteEl.setAttribute('material', 'opacity', opacity);

        noteEl.note = n; // FIXME Hack
        noteEl.object3D.position.set(x, y, z + 0.01);
        noteEl.object3D.scale.set(s * 1.1, s * 1.1, s * 1.1);
        noteEl.setAttribute('material', 'color', getNoteColorHex(n));
      }

      if (type === 'noteoff' && !isNoteOffIgnored) {
        console.log('off', n, noteEl);
        noteEl.setAttribute('material', 'opacity', 0);
        notePool[poolKey] = null;
      }
    };

    // const handleCC = ({ controller: { number }, value }) => {
    //   if (number === 2) { // breath control
    //
    //     const vel = value / 128;
    //     const opacity = vel / (0.1 + vel);
    //     noteEl.setAttribute('material', 'opacity', opacity);
    //   }
    // };

    const handlePitchbend = ({value}) => {
      // console.log(value)

      notePool.forEach((n, k) => {
        if (n === null) return;
        const noteEl = noteEls[k];
        pitchBendAmount = value * 2;
        const {s, x, y, z} = noteToDimensions(n + pitchBendAmount);
        noteEl.object3D.position.set(x, y, z + 0.01);
        noteEl.object3D.scale.set(s * 1.1, s * 1.1, s * 1.1);
      });
    };

    if (/*midiInEl*/ true) {
      if (midiInDevice) {
        console.log('new midiInDevice: ', _.get(midiInDevice, 'name'), 'prev: ', _.get(prevMidiInDevice, 'name'));
        midiInDevice.addListener('noteon', 'all', handleMidi);
        midiInDevice.addListener('noteoff', 'all', handleMidi);
        // midiInDevice.addListener('controlchange', 'all', handleCC);
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
    };
  }, [noteEls, midiInDevice, noteToDimensions, prevMidiInDevice]);

  const midiInRef = useCallback((key, el) => {
    noteEls[key] = el;
  }, []);

  return (
    <>
      {_.range(notePoolSize).map((ix) => (
        <Entity
          key={ix}
          _ref={el => midiInRef(ix, el)}
          primitive="a-sphere"
          material={{
            blending: 'additive',
            color: HSVtoHex(1, 0, 1),
            opacity: 0,
            transparent: true,
          }}
          radius={0.07}
        />
      ))}
    </>

  );
};

export default PcSpiralWindController;
