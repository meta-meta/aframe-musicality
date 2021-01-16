import _ from 'lodash';
import OSC from "osc-js";
import React, {useEffect} from 'react';
import useOsc from './useOsc';
import PC from "./pc";

const Osc = () => {

  const [state, actions] = useOsc(
    ({beat, midi, oscHost, seq}) => ({beat, midi, oscHost, seq}), // https://github.com/andregardi/use-global-hook#avoid-unnecessary-renders
    actions => actions,
  );

  useEffect(() => {
    const oscHost = {
      host: window.location.hostname,
      port: '8080',
    };
    const osc = new OSC({
      plugin: new OSC.WebsocketClientPlugin(oscHost),
    });
    osc.open();

    // window.sendOsc = (address, ...args) => osc.send(new OSC.Message(address, ...args));

    const {
      clearSeq,
      setBeat,
      setInSeq,
      setMidiEvent,
      setOscHost,
    } = actions;

    setOscHost(oscHost);

    osc.on('/midiSeq/clear', () => clearSeq());
    osc.on('/midiSeq/beat', ({args: [beat]}) => setBeat(beat));
    osc.on('/midiSeq/note/*', ({address, args}) => {
      const beat = parseInt(_.takeRight(address.split('/'), 2)[0], 10);
      setInSeq(beat, _(args).chunk(2).map(([note, vel]) => ({note, vel})).value()); // args is array of interleaved note, vel...
    });

  }, []);


  const pcs = (state.seq[state.beat] || []).map(({note}) => note % 12);

  return <div>
    <h1>{state.beat}</h1>
    {/*<pre>{JSON.stringify((state.seq[state.beat] || []).map(({note}) => note), null, 2)}</pre>*/}
    <div style={{
      backgroundColor: 'deeppink',
      color: 'black',
      height: '30vh',
      position: 'relative',
      width: '30vh',
    }}>
      {(state.seq[state.beat] || []).map(({note, vel}, idx) => {
        return <PC key={idx} n={note}/>
      })}

      {(_.range(12)).map((pc, idx) => {

        const theta = (pc / 12) * Math.PI * 2;

        return <PC key={idx} n={pc} style={{
          color: _.includes(pcs, pc) ? 'cyan' : 'black',
          fontSize: '3em',
          position: 'absolute',
          left: `${(0.35 * Math.sin(theta) + 0.5) * 100}%`,
          top: `${(-0.35 * Math.cos(theta) + 0.5) * 100}%`,
        }}/>
      })}
    </div>
  </div>;
};

export default Osc;
