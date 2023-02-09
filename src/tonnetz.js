import _ from 'lodash';
import PC from './pc';
import React from 'react';
import {HSVtoHex} from './color';

const maj = [0, 4, 7];
const maj7 = [0, 4, 7, 11];
const min = [0, 3, 7];
const min7 = [0, 3, 7, 10];
const dim = [0, 3, 6];
const dim7 = [0, 3, 6, 9];
const aug = [0, 4, 8];
const diatonic = [0, 2, 4, 5, 7, 9, 11];

const wickiHayden = (x, y) => !y % 2 === 1
  ? (x * 2) % 12
  : (x * 2 + 7) % 12;

const harmonicTable = (x, y) => ((y % 2 > 0
  ? ((y - 1) / 2) * 11 + 3
  : (y / 2) * 11) + x * 7) % 12;

const Tonnetz = ({pcSet = diatonic, layout = harmonicTable}) => (
  <div style={{
    display: 'block',
    flexShrink: 0,
  }}>
    {_.range(30)
      .map(y => (
        <>
          {_.range(50).map(x => {

            const isOdd = y % 2 === 1;

            const n = layout(x, y);

            const isInPcSet = _.includes(pcSet, n);

            return (
              <PC
                key={x}
                n={n}
                isOdd={isOdd}
                style={{
                  border: `solid ${isInPcSet ? 2 : 1}px`,
                  borderRadius: '50%',
                  color: HSVtoHex(((n * 5) % 12) / 12, 1, isInPcSet ? 1 : 0.4),
                  // color: isInPcSet ? 'magenta' : 'white',
                }}
              />
            );
          })}
          <br/>
        </>
      ))}
  </div>
);

export default Tonnetz;
