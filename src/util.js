/**
 *
 * Michael L. Friedmann - https://yalebooks.yale.edu/book/9780300045376/ear-training-twentieth-century-music/
 * (Friedmann uses "lev" for 11)
 * @param note {number} integer - MIDI note
 * @param equalDivisions {number} integer - note % equalDivisions
 * @returns {number}
 */
export const toSolfege = (note, equalDivisions = 12) => ({
  0: 'oh',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'sev',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'el',
})[note % equalDivisions] || note % equalDivisions;

/**
 *
 * @param note {number} integer - MIDI note
 * @param equalDivisions {number} integer - note % equalDivisions
 * @returns {number}
 */
export const toSymbol = (note, equalDivisions = 12) => ({
  10: '૪',
  11: 'Ɛ',
})[note % equalDivisions] || note % equalDivisions;

// ripped from Tone/core/Conversions
export const ftomf = (frequency) => {
  return 69 + 12 * Math.log2(frequency / 440);
}
