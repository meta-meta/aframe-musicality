// import * as Tone from 'tone'
import _ from 'lodash';
import PitchClass from './pitchClass';
import PitchDetector from 'pitchdetect';
import React, {useCallback, useEffect, useState} from 'react';
import useMidi from "./useMidi";
import {Entity} from 'aframe-react';
import {HSVtoHex} from "./color";

const PitchClassCollections = ({}) => {


  useEffect(() => {
    const handleKeyup = ({code, key}) => {
      // if (key === 'r') setIs180(is180 => !is180);
      // if (code === 'Space') audioContext.resume();
    };

    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, []);

  const colls = [[2, 5, 9], [7, 11, 2], [0, 4, 7]];

  return (// https://www.npmjs.com/package/aframe-animation-component
    <Entity
      position={{x: 0, y: 0, z: -2}}
      scale={{x: 4, y: 4, z: 4}}
    >
      {
        _.range(50)
          .map(i => 50 - i)// draw order
          .map(i => ({ coll: colls[i % colls.length], z: i * -0.75}))
          .map(({coll, z}) => (
            <React.Fragment key={z}>
              <Entity
                material={{
                  // blending: 'subtractive',
                  color: '#040404',
                  opacity: 0.45,
                }}
                position={{ x: 0, y: 0, z: z - 0.01}}
                rotation={{x: 90, y: 0, z: 0}}
                primitive='a-cylinder'
                scale={{ x: 1, y: 0.001, z: 1}}
              />
              {_.range(12)
                .map(n => {
                  const r = 0.25;
                  const theta = n * (Math.PI * 2) / 12;

                  return {
                    n,
                    x: r * Math.sin(theta),
                    y: r * Math.cos(theta),
                  };
                })
                .map(({n, s = 0.5, x, y}) => (
                  <PitchClass
                    darkened={!_.includes(coll, n)}
                    key={n}
                    n={n}
                    position={{x, y, z}}
                    scale={{x: s, y: s, z: s}}
                  />))}
            </React.Fragment>
          ))
      }

    </Entity>
  );
};

export default PitchClassCollections;
