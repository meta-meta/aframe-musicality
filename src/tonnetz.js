import _ from 'lodash';
import Cell from './cell';
import PC from './pc';
import React, {useState} from 'react';
import {HSVtoHex} from './color';
import {toSolfege, toSymbol} from './util';

const pcSetOpts = [
  {
    label: 'Diatonic Scale',
    val: [0, 2, 4, 5, 7, 9, 11],
  },
  {
    label: 'Major Triad',
    val: [0, 4, 7],
  },
  {
    label: 'Major 7',
    val: [0, 4, 7, 10],
  },
  {
    label: 'Minor Triad',
    val: [0, 3, 7],
  },
  {
    label: 'Minor 7',
    val: [0, 3, 7, 10],
  },
  {
    label: 'Diminished Triad',
    val: [0, 3, 6],
  },
  {
    label: 'Diminished 7',
    val: [0, 4, 7],
  },
  {
    label: 'Augmented Triad',
    val: [0, 4, 8],
  },
]


const lumatoneRows = [
  2,
  5,
  8,
  11,
  14,
  17,
  20,
  23,
  26,
  28,
  26,
  23,
  20,
  17,
  14,
  11,
  8,
  5,
  2,
];

const lumatoneRowShift = [
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  1,
  4,
  7,
  10,
  13,
  16,
  19,
  22,
  25,
  28,
];

const layoutOpts = [
  {
    label: 'Wicki-Hayden',
    val: (x, y) => !(y % 2 === 1)
      ? (x * 2) % 12
      : (x * 2 + 7) % 12
  },
  {
    label: 'Harmonic table',
    val: (x, y) => ((y % 2 > 0
      ? ((y - 1) / 2) * 11 + 3
      : (y / 2) * 11) + x * 7) % 12
  },
];

const Tonnetz = ({rows = lumatoneRows}) => {

  const [layoutKey, setLayoutKey] = useState(0);
  const {val: layout} = layoutOpts[layoutKey];

  const [pcSetKey, setPcSetKey] = useState(0);
  const {val: pcSet} = pcSetOpts[pcSetKey];

  return (
    <div style={{
      display: 'block',
      flexShrink: 0,
    }}>
      <select value={layoutKey} onChange={evt => setLayoutKey(parseInt(evt.target.value, 10))}>
        {layoutOpts.map(({label}, val) => <option key={val} value={val}>{label}</option>)}
      </select>

      <select value={pcSetKey} onChange={evt => setPcSetKey(parseInt(evt.target.value, 10))}>
        {pcSetOpts.map(({label}, val) => <option key={val} value={val}>{label}</option>)}
      </select>

      <br/>
      <br/>
      <br/>

      {_.range(rows.length)
        .map(y => (
          <>
            {_.range(rows[y] + lumatoneRowShift[y]).map(x => {

              const isOdd = y % 2 === 1;

              const n = layout(x, y);

              const isInPcSet = _.includes(pcSet, n);

              const isBlank = lumatoneRowShift[y] > x;

              return (
                !isBlank
                  ? (
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
                    />)
                  : (<
                    Cell
                    key={x}
                    isOdd={isOdd}
                  >
                    &nbsp;
                  </Cell>)
              );
            })}
            <br/>
          </>
        ))}
    </div>
  );
};

export default Tonnetz;
