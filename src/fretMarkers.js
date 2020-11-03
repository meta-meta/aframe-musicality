import _ from 'lodash';
import Cell from "./cell";
import React from "react";
import {withStyles} from "@material-ui/core/styles";

const FretMarkers = withStyles({
  fretMarker: {color: 'purple'}
})(
  ({classes: {fretMarker}, frets}) => _.range(_.last(frets) + 1)
    .map(f => _.includes(frets, f) ? f : '')
    .map((fret, ix) => <Cell className={fretMarker} key={ix}>{fret}</Cell>));

export default FretMarkers;
