import _ from 'lodash';
import PC from './pc';
import React from 'react';

const Tonnetz = () => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    {_.range(30)
      .map(y => (
        <>
          {_.range(50).map(x => {
            const n = ((y % 2 > 0
              ? ((y - 1) / 2) * 11 + 3
              : (y / 2) * 11) + x * 7) % 12;

            return (
              <PC key={x} n={n} isOdd={y % 2 === 1}/>
            )
          })}
          <br/>
        </>
      ))}
  </div>
);

export default Tonnetz;
