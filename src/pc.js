import Cell from './cell';
import React from "react";
import {toSolfege, toSymbol} from "./util";

const PC = ({
  classes,
  isOdd,
  isSolfege = false,
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
  </Cell>
)

export default PC;
