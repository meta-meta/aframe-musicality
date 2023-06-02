import _ from 'lodash';
import Cell from './cell';
import LumatoneKeySync from './lumatoneKeySync';
import PC from './pc';
import React, {useCallback, useEffect, useState} from 'react';
import {getNoteColorHsl, hslToHex, HSVtoHex} from './color';
import useMidi from './useMidi';
// import {Hsluv} from 'hsluv'; // FIXME ts loader
import {toSolfege, toSymbol} from './util';



const pcSetOpts = [
  {
    label: 'Nothing',
    val: [],
  },
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
  {
    label: `'S Wonderful`,
    val: [53, 55, 57],
    // val: [5, 7, 9],
    // val: [0, 4, 5, 6, 7, 9, 10],
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
    });
  });

});


const lumatone = () => {


};

const setColor = (lumatoneIn, lumatoneOut, board, key, r, g, b) => new Promise((res) => {
  const mfid = [0x00, 0x21, 0x50]; // Embodme according to https://www.midi.org/specifications-old/item/manufacturer-id-numbers
  const setKeyColor = 0x01;
  console.log('setcolor', r, g, b);

  lumatoneIn.addOneTimeListener('sysex', () => {
    // console.log('ack');
    res();
  });
  lumatoneOut.sendSysex(mfid, [board, setKeyColor, key, r >> 4, r & 0xf, g >> 4, g & 0xf, b >> 4, b & 0xf]);
});

/**
 *
 *
 *
 * @param lumatoneIn
 * @param lumatoneOut
 * @param board
 * @param key
 * @param note
 * @param midiChannel
 * @param typeByte  disabledDefault = 0, noteOnNoteOff = 1,  continuousController = 2, lumaTouch = 3, disabled = 4
 * @returns {Promise<unknown>}
 */
const setNote = (lumatoneIn, lumatoneOut, board, key, note, midiChannel = 1, typeByte = 1) => new Promise((res) => {
  const mfid = [0x00, 0x21, 0x50]; // Embodme according to https://www.midi.org/specifications-old/item/manufacturer-id-numbers
  const setKeyNote = 0x00;
  console.log('setnote', lumatoneIn, lumatoneOut);

  lumatoneIn.addOneTimeListener('sysex', () => {
    // console.log('ack');
    res();
  });
  lumatoneOut.sendSysex(mfid, [board, setKeyNote, key, Math.min(127, Math.max(0, note)), midiChannel, typeByte]);
});


// http://www.altkeyboards.com/instruments/isomorphic-keyboards
const layoutOpts = [
  {
    label: 'Wicki-Hayden',
    val: (x, y) => y % 2 === 0
      ? ((12 - y) * 6 + x * 2) + (x > 12 ? 24 : 0)
      : (12 - y) * 6 + x * 2 + 1 + (x > 12 ? 24 : 0)
  },

  {
    label: 'Harmonic table',
    val: (x, y) => (
      (y % 2 === 0
          ? (8 - y) * 6 + x * 4// + (x > 12 ? 24 : 0)
          : (8 - y) * 6 + x * 4 - 1 //+ (x > 12 ? 24 : 0)
      ))
  },

];

const Tonnetz = ({rows = lumatoneRowLengths}) => {

  const [{inputDevices, outputDevices}] = useMidi();
  const xTouchIn = inputDevices.find(({name}) => name === 'LM-X-Touch-CS-in');
  const lumaIn = inputDevices.find(({name}) => name === 'LM-Lumatone-in');
  const lumaOut = outputDevices.find(({name}) => name === 'LM-Lumatone-out');


  const [layoutKey, setLayoutKey] = useState(0);
  const {val: layout} = layoutOpts[layoutKey];

  const [pcSetKey, setPcSetKey] = useState(0);
  const [pitchSet, setPitchSet] = useState({});
  // const {val: pitchSet} = pcSetOpts[pcSetKey];
  // const pcSet = pitchSet.map(p => p % 12);

  useEffect(() => {
    if (!xTouchIn || !lumaIn) return;

    const notesCurr = {};

    const handleNoteOn = (e) => {
      const {dataBytes: [nPlayed, vPlayed]} = e;
      notesCurr[nPlayed] = true;
    };

    const handleNoteOff = (e) => {
      const {dataBytes: [nPlayed, vPlayed]} = e;
      notesCurr[nPlayed] = false;
    };

    const handlePedalDown = (e) => {
      const {dataBytes: [nPlayed, vPlayed]} = e;
      if (nPlayed === 103) {
        setPitchSet({...notesCurr});
        console.log(notesCurr);
      }
    };

    xTouchIn.addListener('noteoff', handlePedalDown);
    lumaIn.addListener('noteon', handleNoteOn);
    lumaIn.addListener('noteoff', handleNoteOff);

    return () => {
      xTouchIn.removeListener('noteoff', handlePedalDown);
      lumaIn.removeListener('noteon', handleNoteOn);
      lumaIn.removeListener('noteoff', handleNoteOff);
    }
  }, [lumaIn, xTouchIn])


//   useEffect(() => {
//     if (!lumaIn || !lumaOut) return;
//
//     const changeColors = async () => {
//       for (const y of _.range(rows.length)) {
//         const rowStartX = lumatoneRowStarts[y];
//
//         for (const x of _.range(rowStartX, rows[y] + rowStartX)) {
//           const lumaKey = boardsOnGrid[y][x];
//           if (lumaKey) {
//             const {boardNum, note} = lumaKey;
//             const n = layout(x, y);
// // console.log(n, 1 - Math.floor(n/12) / 5 )
//
//
//
//             const [r, g, b] = hslToRgb(...colorHsl);
//             await setColor(lumaIn, lumaOut, boardNum, note, r, g, b);
//             // await setNote(lumaIn, lumaOut, boardNum, note, n);
//
//
//             // const typeByteCC =  (true << 4) | 2;   // (faderUpIsNull << 4) | keyType
//             // await setNote(lumaIn, lumaOut, boardNum, note, n, 1, typeByteCC); // cc
//
//             await setNote(lumaIn, lumaOut, boardNum, note, n);
//             // console.log('board', boardNum, 'lumaKey', note, n, color)
//           }
//         }
//       }
//     };
//
//     changeColors().catch(e => console.log(e));
//
//   }, [layoutKey, pcSetKey, lumaIn, lumaOut]);


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

                  const isInPcSet = true// _.includes(pcSet, n % 12);
                  const isInPitchSet = pitchSet[n];
                  const colorHsl = getNoteColorHsl(n, isInPitchSet, !isInPcSet);

                  // return (
                  //   <
                  //     Cell
                  //     key={x}
                  //     isOdd={isOdd}
                  //   >
                  //     {(boardsOnGrid[y][x] || {}).boardNum}
                  //   </Cell>);

                  return (
                    <>
                      <PC
                        key={x}
                        n={n}
                        isOdd={isOdd}
                        showOctave
                        style={{
                          // border: `solid ${1}px`,
                          border: `solid 1px`,
                          borderRadius: '50%',
                          color: isInPcSet ? 'white' : 'grey', //TODO: printer settings as well as mediaquery stylesheet
                          backgroundColor: hslToHex(...colorHsl),
                          // color: isInPcSet ? 'magenta' : 'white',
                        }}
                      />
                      <LumatoneKeySync
                        h={colorHsl[0]}
                        key={`keysync-${x}`}
                        l={colorHsl[2]}
                        lumaIn={lumaIn}
                        lumaOut={lumaOut}
                        n={n}
                        s={colorHsl[1]}
                        x={x}
                        y={y}
                      />
                    </>
                  );
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
