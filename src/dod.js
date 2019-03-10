import {Entity} from 'aframe-react';
import React from 'react';
import {HSVtoHex} from './color';

// http://dmccooey.com/polyhedra/PentakisDodecahedron.txt
const c1 = 1.33058699733550141141687582919;
const c2 = 2.15293498667750705708437914596;

// in ordered, opposite pairs
const verts = [
  [0.0,  -c2,   c1],
  [0.0,   c2,  -c1],
  [ c2,  -c1,  0.0],
  [-c2,   c1,  0.0],
  [0.0,  -c2,  -c1],
  [0.0,   c2,   c1],
  [-c2,  -c1,  0.0],
  [ c2,   c1,  0.0],
  [-c1,  0.0,   c2],
  [ c1,  0.0,  -c2],
  [ c1,  0.0,   c2],
  [-c1,  0.0,  -c2],
];

const Dod = ({ rep = 1, sat, stack = [], n = 0 }) =>
  <Entity position="0 0 0">
    {verts.map((v, i) =>
      <Entity
        key={i}
        color={HSVtoHex(i * (1 / 12), sat || 1, 1)}
        events={{ click: () => console.log(i) }}
        primitive="a-sphere"
        position={v.join(' ')}
        scale={[1, 1, 1].map(n => 0.3 * n/ (rep * rep)).join(' ')}
      />)}

    {rep < 3 && verts.map((v, i) =>
      <Entity
        key={i}
        position={v.map(n => n * 2).join(' ')}
        text={`color: ${HSVtoHex((stack.length ? stack[stack.length - 1] : i) * (1 / 12), 1, 1)}; align: center; value: ${[...stack, i].join(',')} - ${(n + i) % 12}; width: 5; zOffset: 0`}
      >
        <Dod rep={rep+1} sat={0.3} stack={[...stack, i]} n={(n + i) % 12} />
      </Entity>)
      // .filter((n, i) => i % 2)
    }
  </Entity>;

export default Dod;