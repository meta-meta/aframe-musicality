export const toSymbol = n => ({
  10: '૪',
  11: 'Ɛ',
})[n % 12] || n % 12;

// ripped from Tone/core/Conversions
export const ftomf = (frequency) => {
  return 69 + 12 * Math.log2(frequency / 440);
}
