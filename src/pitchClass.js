import _ from 'lodash';
import React from 'react';
import {Entity} from 'aframe-react';
import {HSVtoHex} from './color';
import {toSymbol} from "./util";

const handleOsc = n => (el) => {
  if (el) {
    const { components: { osc } } = el;
    osc.onOsc = ({ instrument, note, vel }) => {
      if (note === n) {
        osc.vel = vel;
      }
    }

    osc.onTick = (time, timeDelta) => {
      if (osc.vel === 0) {

      }

      if (_.has(osc, 'vel')) {
        el.setAttribute('material', 'opacity', 0.05 + 0.75 * osc.vel / 128);
      }
    }
  }
};

export default ({
  darkened = true,
  n,
  position = {x: 0, y: 0, z: 0},
  scale = {x: 1, y: 1, z: 1}
}) =>
  <Entity
    _ref={handleOsc(n)}
    // animation={{
    //   dur: 500,
    //   property: 'position',
    //   to: position,
    // }}
    material={{
      blending: darkened ? 'normal' : 'additive',
      color: HSVtoHex(n / 12, 0.7, darkened ? 0 : 1),
      opacity: darkened ? 0.5 : 0.1,
    }}
    osc={{

    }}
    position={position}
    primitive='a-torus'
    radius={0.1}
    radius-tubular={0.003}
    scale={scale}
  >
    <Entity
      look-at="#camera"
      position={{x: 0, y: 0, z: 0}}
      scale={{x: 2, y: 2, z: 2}}
      text={{
        align: 'center',
        color: HSVtoHex(n / 12, 0.75, 0.5),
        font: `../${n % 12 > 9 ? 'segoeui' : 'JetBrainsMono-Medium'}-msdf.json`,
        negate: false,
        transparent: true,
        value: toSymbol(n),
      }}
    />
  </Entity>
