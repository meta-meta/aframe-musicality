import _ from 'lodash';
import FretMarkers from "./fretMarkers";
import PC from './pc';
import React from 'react';


const FrettedInstrument = ({ fretCount, fretMarkers, tuning }) => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    <FretMarkers frets={fretMarkers}/>
    <br/>
    {[...tuning]
      .reverse() //mutates
      .map((pc0, ixPc0) => (
      <React.Fragment key={ixPc0}>
        {_.range(fretCount + 1 /*for zeroth*/)
          .map(i => (i + pc0) % 12)
          .map((pc, ix) => (
            <PC key={ix} n={pc}/>
          ))}
        <br/>
      </React.Fragment>
    ))}
    <FretMarkers frets={fretMarkers}/>
  </div>
);

export default FrettedInstrument;
