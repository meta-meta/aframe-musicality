import React from 'react';
import { HSVtoHex } from './color';


export default ({ n }) =>
  <a-text
    align="center"
    color={HSVtoHex(n / 12, 1, 1)}
    value={n}
  />