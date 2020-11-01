import _ from 'lodash';
import Cell from './cell';
import PC from './pc';
import React from 'react';

const FretMarkers = () => ['0', '', '', '', '', '5', '', '7', '', '', '', '', '12', '', '', '15', '', '17', '', '19', '', '', '', '', '24']
  .map((fret, ix) => <Cell key={ix}>{fret}</Cell>);

const Guitar = () => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    <FretMarkers/>
    <br/>
    {[4, 11, 7, 2, 9, 4].map(pc0 => (
      <>
        {_.range(25)
          .map(i => (i + pc0) % 12)
          .map((pc, ix) => (
            <PC key={ix} n={pc}/>
          ))}
        <br/>
      </>
    ))}
    <FretMarkers/>
  </div>
);

export default Guitar;
