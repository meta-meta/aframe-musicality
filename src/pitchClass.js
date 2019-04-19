import React from 'react';
import { HSVtoHex } from './color';



export default ({ n, midiIn, position = "0 0 0", scale = "1 1 1" }) =>
  <a-sphere
    color="black"
    opacity={0.3}
    position={position}
    radius={0.15}
    scale={scale}
  >
    <a-text
      align="center"
      color={HSVtoHex(n / 12, 1, 1)}
      look-at="#camera"
      opacity={midiIn ? 1 : 0.25}
      value={n}
    />
  </a-sphere>