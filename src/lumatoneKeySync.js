import _ from 'lodash';
import {useEffect, useState} from 'react';
// import {Hsluv} from 'hsluv'; // FIXME ts loader

let _hsluv;

const hslToRgb = (h, s, l) => {
  _hsluv = _hsluv || new window.Hsluv();
  _hsluv.hsluv_h = (h * 360 + 12.2) % 360;
  _hsluv.hsluv_s = s * 100;
  _hsluv.hsluv_l = l * 100;
  _hsluv.hsluvToRgb();
  return [_hsluv.rgb_r * 255, _hsluv.rgb_g * 255, _hsluv.rgb_b * 255];
};


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

const changeBuffer = [];
let isPopping = false;

const changePush = async (ch) => {
  changeBuffer.push(ch);

  if (isPopping) return;

  let chPop;
  isPopping = true;
  while (chPop = changeBuffer.shift()) {
    await chPop();
  }
  isPopping = false;
};


/**
 *
 * TODO: don't update note if only color changes
 *
 * @param h
 * @param l
 * @param lumaIn
 * @param lumaOut
 * @param n
 * @param s
 * @param x
 * @param y
 * @returns {null}
 * @constructor
 */
const LumatoneKeySync = ({
  h,
  l,
  lumaIn,
  lumaOut,
  n,
  s,
  x,
  y,
}) => {
  useEffect(() => {
    if (!lumaIn || !lumaOut) return;

    const lumaKey = boardsOnGrid[y][x];
    if (lumaKey) {
      const {boardNum, note /*note = key index of board*/} = lumaKey;
// console.log(n, 1 - Math.floor(n/12) / 5 )

      const [r, g, b] = hslToRgb(h,s,l);
      changePush(() => setColor(lumaIn, lumaOut, boardNum, note, r, g, b));
      // await setColor(lumaIn, lumaOut, boardNum, note, r, g, b);
      // await setNote(lumaIn, lumaOut, boardNum, note, n);


      // const typeByteCC =  (true << 4) | 2;   // (faderUpIsNull << 4) | keyType
      // await setNote(lumaIn, lumaOut, boardNum, note, n, 1, typeByteCC); // cc

      changePush(() => setNote(lumaIn, lumaOut, boardNum, note, n));
      // console.log('board', boardNum, 'lumaKey', note, n, color)

      let timeoutId;
      const maxL = 0.45;

      const handleNoteOff = (e) => {
        const {dataBytes: [nPlayed, vPlayed]} = e;

        const repeatCount = 5;
        if (nPlayed === n) {
          let repeat = repeatCount;
          const pushChanges = () => {

            const [r, g, b] = hslToRgb(h, s + (1-s)*(repeat / repeatCount), l + (maxL-l)*(repeat / repeatCount));

            changePush(() => setColor(lumaIn, lumaOut, boardNum, note, r, g, b));

            if (repeat > 0) {
              repeat--;

              clearTimeout(timeoutId);
              timeoutId = setTimeout(pushChanges, 200 * repeat);
            }
          };

          pushChanges();
        }
      };

      const handleNoteOn = (e) => {
        const {dataBytes: [nPlayed, vPlayed]} = e;

        if (nPlayed === n) {
          clearTimeout(timeoutId);
          const [r, g, b] = hslToRgb(h, 1, maxL);
          changePush(() => setColor(lumaIn, lumaOut, boardNum, note, r, g, b));
        }
      };

      lumaIn.addListener('noteon', handleNoteOn);
      lumaIn.addListener('noteoff', handleNoteOff);

      return () => {
        clearTimeout(timeoutId);
        lumaIn.removeListener('noteon', handleNoteOn);
        lumaIn.removeListener('noteoff', handleNoteOff);
      }

    }
  }, [h, l, lumaIn, lumaOut, n, s, x, y,]);

  return null;
}

export default LumatoneKeySync;
