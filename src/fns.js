import { fraction } from 'mathjs';

export const toOctave = (r) => r > 2
  ? toOctave(r / 2)
  : r < 1
    ? toOctave(r * 2)
    : r;

export const intToRatio = (i) => fraction(toOctave(i));

// TODO: n-dimensions
export const coordToRatio = (x, y) => {
  const raw = Math.pow(3, x) * Math.pow(5, y);
  return fraction(toOctave(raw));
}

// for(let threes = -5; threes <= 5; threes++) {
//   for(let fives = -5; fives <= 5; fives++) {
//     let f = coordToRatio(threes, fives);
//     console.log(`${f.n}/${f.d}`)
//   }
// }
