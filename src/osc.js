import _ from 'lodash';
import OSC from "osc-js";
import React, {useEffect} from 'react';
import useOsc from './useOsc';

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
    osc.on('/midiSeq/beat', ({ args: [beat]}) => setBeat(beat));
    osc.on('/midiSeq/note/*', ({ address, args }) => {
      const beat = parseInt(_.takeRight(address.split('/'), 2)[0], 10);
      setInSeq(beat, _(args).chunk(2).map(([note, vel]) => ({ note, vel }))); // args is array of interleaved note, vel...
    });

  }, []);

  return <div>
    <h1>{state.beat}</h1>
    <pre>{JSON.stringify(state.seq, null, 2)}</pre>
  </div>;
};

export default Osc;
