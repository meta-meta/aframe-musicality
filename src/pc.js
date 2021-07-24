import Cell from './cell';
import React from "react";
import {toSymbol} from "./util";

const PC = ({classes, n, isOdd, style}) => (
  <Cell
    isOdd={isOdd}
    style={style}
  >
    {toSymbol(n)}
  </Cell>
)

export default PC;
