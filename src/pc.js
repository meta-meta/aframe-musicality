import Cell from './cell';
import React from "react";
import {toSymbol} from "./util";
import {withStyles} from "@material-ui/core/styles";

const PC = withStyles({
  el: {
    fontFamily: 'Segoe UI',
  },
})(({classes, n, isOdd}) => (
  <Cell
    className={n === 11 ? classes.el : ''}
    isOdd={isOdd}
  >
    {toSymbol(n)}
  </Cell>
));

export default PC;
