import FrettedInstrument from './frettedInstrument';
import React from 'react';

const Ukulele = () => (
  <FrettedInstrument
    fretCount={18}
    fretMarkers={[0,5,7,10,12]}
    tuning={[7, 0, 4, 9]}
  />
);

export default Ukulele;
