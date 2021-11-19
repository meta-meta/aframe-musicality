import React, {useCallback, useEffect, useRef} from 'react';
import {ForceGraph3D} from 'react-force-graph';
import FrettedInstrument from './frettedInstrument';
import OSC from 'osc-js';
import _ from 'lodash';
import {HSVtoHex} from './color';
// import {
//   forceLink
// } from 'd3-force-3d';

// import data from './likes.json';

const tunings = {
  standard: [4, 9, 2, 7, 11, 4],
  chelseaSessionsTuning: [0, 5, 0, 5, 9, 5],
  octoberSongTuning: [0, 7, 0, 4, 7, 0],
};

const tuning = tunings['standard'];

const oscHost = {
  host: window.location.hostname,
  port: '8080',
  secure: true,
};
const osc = new OSC({
  plugin: new OSC.WebsocketClientPlugin(oscHost),
});
osc.open();

osc.on('/likes/*', ({address, args: [note, vel]}) => {
  const instrument = _.last(address.split('/'));
  if (this.onOsc) this.onOsc({instrument, note, vel});
});

osc.on('/likes/*', ({address, args: [note, vel]}) => {
  const instrument = _.last(address.split('/'));
  if (this.onOsc) this.onOsc({instrument, note, vel});
});


const tags = {
  '12ET': [
    'Feynman',
    'musicality-clj',
    'musicality-sequencer',
    'musicality.computer',
    'pc-clock',
    'pitch-spiral',
    'sinewave-organ',
    'Soundgarden',
    'VRimba',
  ],
  '3D print': [],
  'JI': [],
  'MIDI sync': [],
  'MIDI': [],
  'OSC': [],
  'XR object': [],
  'dataviz': [],
  'electronic': [],
  'hardware': [],
  'instrument': [],
  'media production': [],
  'tool': [],
};

const concepts = [
  'Earth Under Gold',
  'Feynman',
  'musicality-clj',
  'musicality-sequencer',
  'musicality.computer',
  'Oronoco',
  'pc-clock',
  'Pheremin',
  'pitch-spiral',
  'sinewave-organ',
  'Soundgarden',
  'VRimba',
];

const features = [];

const linkTypes = [
  'describes',
  'component of',
  '',

];


const data = {
  nodes: [
    ...concepts.map(id => ({id, type: 'concept',})),
    ..._.keys(tags).map(id => ({id, type: 'tag',})),
  ],
  links: [
    ..._(tags)
      .map((conceptsTagged, tagId) =>
        conceptsTagged.map(conceptId => ({source: tagId, target: conceptId, type: 'describes'}))
      ).flatten()
      .value(),
    // {source: '2', target: '1', type: 'describes'},
    // {source: '3', target: '1', type: 'describes'},
  ]
}

window.data = data

// data.links = data.links.map(link => ({...link, forceCoef: link.event === 'accepted' ? 4 : 0 }))

const Guitar = () => {
  const fgRef = useRef();

  useEffect(() => {
    const fg = fgRef.current;
    window.fg = fg;

    // Deactivate existing forces
    // fg.d3Force('center', null);
    // fg.d3Force('charge', null);
    // fg.d3Force('charge').strength(-500);
    // fg.d3Force('link').strength(({ event }) => event === 'accepted'
    //   ? 0.1
    //   : event === 'declined'
    //     ? 0.01
    //     : 0.05);
    // fg.d3ReheatSimulation();


  }, []);

  const handleClick = useCallback(node => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const millis = 2000;

    // _.delay(() => {
    //   window.open(`https://colormelove.worldsingles.com/index.cfm?event=user.view&id=${node.id}`, '_blank');
    // }, millis);

    fgRef.current.cameraPosition(
      {x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio}, // new position
      node, // lookAt ({ x, y, z })
      millis  // ms transition duration
    );
  }, [fgRef]);

  const linkColor = ({type}) => type === 'describes'
    ? '#f4f'
    : '#666';

  const showReceiver = false;

  // TODO: string -> hash -> normalized 0 - 1.0 -> hue

  return (
    <ForceGraph3D

      ref={fgRef}

      numDimensions={3}
      graphData={data}
      nodeOpacity={0.7}
      nodeLabel={({id, type}) => `${id} type:${type}`}
      nodeColor={({type}) => HSVtoHex({concept: 0, tag: 0.1, feature: 0.3}[type] || 0.75, 1, 1)}
      nodeResolution={12}
      nodeRelSize={10}
      onNodeClick={handleClick}

      linkDirectionalParticles={1}
      linkDirectionalParticleColor={linkColor}
      linkDirectionalParticleResolution={1}
      linkDirectionalParticleWidth={1.5}

      // linkDirectionalArrowLength={5}
      // linkDirectionalArrowRelPos={showReceiver ? 0.99 : 0.02}

      linkOpacity={0.7}
      // linkVisibility={({target}) => target !== '0'}
      // linkColor={linkColor}
      // linkWidth={1}


      d3VelocityDecay={0.4}
    />
  )
}


/*
* const extraRenderers = [new THREE.CSS2DRenderer()];

    fetch('../datasets/miserables.json').then(res => res.json()).then(data => {
      ReactDOM.render(
        <ForceGraph3D
          extraRenderers={extraRenderers}
          graphData={data}
          nodeAutoColorBy="group"
          nodeThreeObject={node => {
            const nodeEl = document.createElement('div');
            nodeEl.textContent = node.id;
            nodeEl.style.color = node.color;
            nodeEl.className = 'node-label';
            return new THREE.CSS2DObject(nodeEl);
          }}
          nodeThreeObjectExtend={true}
        />,
        document.getElementById('graph')
      );
    });*/


export default Guitar;
