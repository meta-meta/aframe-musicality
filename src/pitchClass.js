import React from 'react';
import { HSVtoHex } from './color';
import { toSymbol } from "./util";


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
      color={HSVtoHex(n / 12, 0.75, 1)}
      font="../segoeui-msdf.json"
      negate="false"
      look-at="#camera"
      opacity={midiIn ? 1 : 0.25}
      value={toSymbol(n)}
    />
  </a-sphere>
