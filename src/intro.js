import _ from 'lodash';
import PC from './pc';
import React from 'react';

const Intro = () => (
  <div style={{height: '100%', overflowY: 'auto', padding: '20% 10%'}}>
    <h1>musicality.computer</h1>

    <h2>12ET pitch-class symbols:</h2>
    <pre>{_.range(12).map(pc => <PC key={pc} n={pc}/>)}</pre>

    <h3>12ET pitch-classes as solfege syllables:</h3>
    {_.range(12).map(pc => <PC key={pc} isSolfege n={pc}/>)}
  </div>
);

export default Intro;
