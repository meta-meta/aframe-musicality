import _ from 'lodash';
import PitchClass from './pitchClass';
import React, {useEffect, useState} from 'react';
import useMidi from "./useMidi";
import {Entity} from 'aframe-react';

const PitchClassSpiral = ({
                            depthMax = 1,
                            isAlwaysCounterClockwise = false,
                            rMax = 1,
                            rMin = 0.5,
                            noteRange = [0, 128],
                          }) => {
  const [is180, setIs180] = useState(true);

  useEffect(() => {
    const toggle = ({key}) => {
      if (key === 'r') setIs180(is180 => !is180);
    };

    window.addEventListener('keyup', toggle);
    return () => window.removeEventListener('keyup', toggle);
  }, []);

  const [{midiIn}] = useMidi();

  const midiInPitchClasses = _(12)
    .range()
    .map(n => _(midiIn)
      .pickBy((v, i) => i % 12 === n)
      .values()
      .sum())
    .value();

  return (// https://www.npmjs.com/package/aframe-animation-component
    <Entity position={{x: 0, y: 0, z: -2}}>
      {_.range(noteRange[0], noteRange[1] + 1)
        .map(n => {
          const step = n / 128;
          const r = rMax - rMax * step;

          return {
            n,
            s: 0.75 - n / 192,
            x: r * (is180 && isAlwaysCounterClockwise ? -1 : 1) * Math.sin(n * Math.PI / 6 + 0.01), // +0.01 to fix floating point error in animation library
            y: r * Math.cos(n * Math.PI / 6 + 0.01),
            z: is180 ? depthMax - depthMax * step : depthMax * step,
          };
        })
        .map(({n, s, x, y, z}) => (
          <PitchClass
            key={n}
            n={n}
            position={{x, y, z}}
            scale={{x: s, y: s, z: s}}
          />))
      }
    </Entity>
  );
};

export default PitchClassSpiral;
