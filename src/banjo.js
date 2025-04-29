import _ from 'lodash';
import Cell from './cell';
import FretMarkers from "./fretMarkers";
import PC from './pc';
import React from 'react';

const frets = [1,3,5,7,10,12,15,17,19];

const Banjo = () => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    <FretMarkers frets={frets} />
    <br/>
    {[2, 11, 7, 2, 2].map((pc0, pc0ix) => (
      <React.Fragment key={pc0ix}>
        {_.range(23)
          .map(i => (i + pc0) % 12)
          .map((pc, ix) =>
            pc0ix === 4 && ix < 5
              ? <Cell key={ix}/>
              : <PC key={ix} n={pc}/>
          )}
        <br/>
      </React.Fragment>
    ))}
    <FretMarkers frets={frets} />
  </div>
);

export default Banjo;
