import _ from 'lodash';
import FretMarkers from "./fretMarkers";
import PC from './pc';
import React from 'react';

const frets = [0,5,7,10,12];

const Ukulele = () => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    <FretMarkers frets={frets}/>
    <br/>
    {[9, 4, 0, 7].map(pc0 => (
      <>
        {_.range(19)
          .map(i => (i + pc0) % 12)
          .map((pc, ix) => (
            <PC key={ix} n={pc}/>
          ))}
        <br/>
      </>
    ))}
    <FretMarkers frets={frets}/>
  </div>
);

export default Ukulele;
