import React from 'react';
import FrettedInstrument from './frettedInstrument';

const tunings = {
  standard: [4, 9, 2, 7, 11, 4],
  chelseaSessionsTuning: [0, 5, 0, 5, 9, 5],
  octoberSongTuning: [0, 7, 0, 4, 7, 0],
};

const tuning = tunings['standard'];

const Guitar = () => (
  <FrettedInstrument
    fretCount={24}
    fretMarkers={[0, 5, 7, 12, 15, 17, 19, 24]}
    tuning={tuning}
  />
)

export default Guitar;
