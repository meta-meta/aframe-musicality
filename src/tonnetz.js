import _ from 'lodash';
import Cell from './cell';
import PC from './pc';
import React, {useCallback, useEffect, useState} from 'react';
import {HSVtoHex} from './color';
// import {Hsluv} from 'hsluv'; // FIXME ts loader
import {toSolfege, toSymbol} from './util';

let _hsluv;
const hslToHex = (h, s, l) => {
  _hsluv = _hsluv || new window.Hsluv();
  _hsluv.hsluv_h = (h * 360 + 12.2) % 360;
  _hsluv.hsluv_s = s * 100;
  _hsluv.hsluv_l = l * 100;
  _hsluv.hsluvToHex();
  return _hsluv.hex;
};

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
    val: [0, 4, 7, 11],
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
];

const fallingGrace = [
  {
    label: 'Ab Maj7 -- 8+47Ɛ', // implied 0 -- but how would we notate omission of 0?
    val: [8, 0, 3, 7],
  },
  {
    label: `D7/F# -- 2+47૪/4 ${''/*(redundant 4)*/} -- 2+7૪/4 ${''/*(familiar slash chord notation, no redundancy)*/}  -- 2+47૪0 ${''/*(explicit 0 allows for omitting 0)*/}`,
    val: [2, 6, 9, 0],
  },
  {
    label: 'G min7 -- 7+37૪',
    val: [7, 10, 2, 5],
  },
  {
    label: 'F min7',
    val: [],
  },
  {
    label: '',
    val: [],
  },
  {
    label: '',
    val: [],
  },
  {
    label: '',
    val: [],
  },
  {
    label: '',
    val: [],
  },
  {
    label: '',
    val: [],
  },
];


const lumatoneRowLengths = [
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

const lumatoneRowStarts = [
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

const boardRowLengths = [
  2,
  5,
  6, 6, 6, 6, 6, 6, 6,
  5,
  2,
];

const boardsOnGrid = lumatoneRowLengths.map(() => ([]));

_.range(5).forEach(boardIndex => {
  const boardNum = boardIndex + 1;

  const boardStartX = boardIndex * 6;
  const boardStartY = boardIndex * 2;

  let note = 0;
  _.forEach(boardRowLengths, (boardRowLen, boardRow) => {
    _.range(boardRowLen).forEach(boardX => {
      const y = boardStartY + boardRow;
      boardsOnGrid[y][boardStartX + lumatoneRowStarts[boardRow] + boardX] = {
        boardNum,
        note,
      };

      note++;
    })
  })

})

// _.forEach(lumatoneRowLengths, (row, y) => {
//   boardsOnGrid[y] = [];
//   const rowStartX = lumatoneRowStarts[y];
//
//   _.range(rowStartX, rowStartX + lumatoneRowLengths[y]).forEach(x => {
//     boardsOnGrid[y][x] =
//   })
// })


const getBoardAndNote = (xRaw, y) => {
  const rowStartX = lumatoneRowStarts[y];
  const x = x - rowStartX;


  // const boardStartRow =

};

// http://www.altkeyboards.com/instruments/isomorphic-keyboards
const layoutOpts = [
  {
    label: 'Wicki-Hayden',
    val: (x, y) => !(y % 2 === 1)
      ? (x * 2)
      : (x * 2 + 7)
  },
  {
    label: 'Harmonic table',
    val: (x, y) => ((y % 2 > 0
      ? ((y - 1) / 2) * 11 + 3
      : (y / 2) * 11) + x * 7)/* % 12*/
  },
];

const Tonnetz = ({rows = lumatoneRowLengths}) => {

  const [layoutKey, setLayoutKey] = useState(0);
  const {val: layout} = layoutOpts[layoutKey];

  const [pcSetKey, setPcSetKey] = useState(0);
  const {val: pcSet} = pcSetOpts[pcSetKey];

  useEffect(() => {
    _.range(rows.length).forEach(y => {
      const rowStartX = lumatoneRowStarts[y];
      _.range(rowStartX, rows[y] + rowStartX).forEach(x => {
        const lumaKey = boardsOnGrid[y][x];
        if (lumaKey) {
          const { boardNum, note } = lumaKey;
          const n = layout(x, y);
          const color = hslToHex(((n * 5) % 12) / 12, 1, 0.1)
          console.log('board', boardNum, 'lumaKey', note, n, color)
        }
      });
    })
  }, [layoutKey, pcSetKey]);

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
        .map(y => {
          const isOdd = y % 2 === 1;
          const rowStartX = lumatoneRowStarts[y];

          return (
            <>
              {[
                ..._.range(rowStartX).map(x => {
                  return (
                    <
                      Cell
                      key={x}
                      isOdd={isOdd}
                    >
                      &nbsp;
                    </Cell>);
                }),
                ..._.range(rowStartX, rows[y] + rowStartX).map(x => {
                  const n = layout(x, y);
                  const isInPcSet = _.includes(pcSet, n % 12);

                  // return (
                  //   <
                  //     Cell
                  //     key={x}
                  //     isOdd={isOdd}
                  //   >
                  //     {(boardsOnGrid[y][x] || {}).boardNum}
                  //   </Cell>);

                  return (
                    <PC
                      key={x}
                      n={n}
                      isOdd={isOdd}
                      showOctave
                      style={{
                        // border: `solid ${1}px`,
                        border: `solid ${isInPcSet ? 3 : 1}px`,
                        borderRadius: '50%',
                        // color: 'grey', //TODO: printer settings as well as mediaquery stylesheet
                        color: hslToHex(((n * 5) % 12) / 12, 1, isInPcSet ? 0.35 : 0.3),
                        // color: isInPcSet ? 'magenta' : 'white',
                      }}
                    />);
                })
              ]}
              <br/>
            </>
          );
        })}
    </div>
  );
};

export default Tonnetz;
