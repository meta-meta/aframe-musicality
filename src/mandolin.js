import FrettedInstrument from './frettedInstrument';
import React from 'react';

const Mandolin = () => (
  <FrettedInstrument
    fretCount={20}
    fretMarkers={[0, 3, 5, 7, 10, 12, 15]}
    tuning={[7, 2, 9, 4]}
  />
);

export default Mandolin;
