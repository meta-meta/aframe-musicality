import Cell from './cell';
import React from "react";
import {toSolfege, toSymbol} from "./util";

const PC = ({
  classes,
  isOdd,
  isSolfege = false,
  showOctave = false,
  n,
  style = isSolfege ? {
    borderStyle: 'solid',
    borderWidth: 1,
    width: 70,
  } : null,
}) => (
  <Cell
    isOdd={isOdd}
    style={style}
  >
    {isSolfege ? toSolfege(n) : toSymbol(n)}
    {showOctave && (
      <div style={{
        bottom: '15%',
        fontSize: '0.4em',
        position: 'absolute',
        right: '10%',
      }} >{Math.floor(n / 12)}</div>)}
  </Cell>
)

export default PC;
