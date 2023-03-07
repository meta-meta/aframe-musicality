import React from "react";
import {withStyles} from "@material-ui/core/styles";

const cellSize = 30;

const Cell = withStyles({
  root: {
    fontSize: 20,
    fontFamily: 'jetBrainsMono',
    display: 'inline-flex',
    height: cellSize,
    width: cellSize,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // border: '1px solid',
  },
  odd: {
    left: cellSize / 2,
  }
})(({children, classes, className = '', isOdd, style}) => (
  <div
    className={`${classes.root} ${className} ${isOdd ? classes.odd : ''}`}
    style={style}>
    {children}
  </div>
));

export default Cell;
