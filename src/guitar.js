import _ from 'lodash';
import FretMarkers from "./fretMarkers";
import PC from './pc';
import React from 'react';

const frets = [0,5,7,12,15,17,19, 24];

let standardTuning = [4, 9, 2, 7, 11, 4].reverse();
const chelseaSessionsTuning = [0, 5, 0, 5, 9, 5].reverse();
const octoberSongTuning = [0, 7, 0, 4, 7, 0].reverse();


const Guitar = () => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    <FretMarkers frets={frets}/>
    <br/>
    {standardTuning.map(pc0 => (
      <>
        {_.range(25)
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

export default Guitar;
