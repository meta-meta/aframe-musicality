import _ from 'lodash';
import PitchClass from './pitchClass';
import React, {useEffect, useState} from 'react';
import useMidi from "./useMidi";
import {Entity} from 'aframe-react';

const ColtraneCircle = () => {
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
    <Entity
      animation={`property: rotation; to: 0 ${is180 ? 180 : 0} 0; dur: 500;`}
      position={`0 0 -3`}
    >
      {_(12)
        .range()
        .filter(n => n % 2 == 0)
        .map(n => ({
          n,
          r: 1.5,
          x: -Math.sin(n * Math.PI / 6),
          y: Math.cos(n * Math.PI / 6),
        }))
        .map(({n, r, x, y}) => (
          <PitchClass
            midiIn={midiInPitchClasses[n]}
            n={n}
            position={`${r * x} ${r * y} 0`}
          />))
        .value()
      }

      {_(48)
        .range()
        .filter(n => !_.includes([6, 7, 0, 1], n % 8))
        .map((n, i) => ({
          i,
          n: ((i + 1) * 2 + Math.floor(i / 4) * 2) % 12,
          // n: (n * 2) % 12,
          r: 1.5,
          x: Math.sin((n + 0.5) * Math.PI / 24),
          y: Math.cos((n + 0.5) * Math.PI / 24),
        }))
        .map(({n, r, x, y}) => (
          <PitchClass
            midiIn={midiInPitchClasses[n]}
            n={n}
            position={`${r * x} ${r * y} 0`}
            scale="0.5 0.5 0.5"
          />))
        .value()
      }

      {_(12)
        .range()
        .filter(n => n % 2 != 0)
        .map(n => ({
          n: (n + 6) % 12,
          r: 1.2,
          x: -Math.sin(n * Math.PI / 6),
          y: Math.cos(n * Math.PI / 6),
        }))
        .map(({n, r, x, y}) => (
          <PitchClass
            midiIn={midiInPitchClasses[n]}
            n={n}
            position={`${r * x} ${r * y} 0`}
          />))
        .value()
      }

      {_(48)
        .range()
        .filter(n => !_.includes([4, 5, 6, 7], n % 8))
        .map((n, i) => ({
          i,
          // n: i,
          n: (i * 2 + 9 + Math.floor(i / 4) * 2) % 12,
          // n: i,
          r: 1.2,
          x: Math.sin((n - 1.5) * Math.PI / 24),
          y: Math.cos((n - 1.5) * Math.PI / 24),
        }))
        .map(({n, r, x, y}) => (
          <PitchClass
            midiIn={midiInPitchClasses[n]}
            n={n}
            position={`${r * x} ${r * y} 0`}
            scale="0.5 0.5 0.5"
          />))
        .value()
      }
    </Entity>
  );
};

export default ColtraneCircle;
