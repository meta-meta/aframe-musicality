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
                  n,
                  isActive,
                  position = {x: 0, y: 0, z: 0},
                  scale = {x: 1, y: 1, z: 1}
                }) =>
  <Entity
    // animation={{
    //   dur: 500,
    //   property: 'position',
    //   to: position,
    // }}
    // events={{
    //   osc: handleOsc(n),
    // }}
    primitive='a-sphere'
    material={{
      blending: 'additive',
      color: HSVtoHex(n / 12, 0.75, 1),
      opacity: isActive ? 0.7 : 0.05,
    }}
    osc={{

    }}
    _ref={handleOsc(n)}
    position={position}
    radius={0.1}
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
