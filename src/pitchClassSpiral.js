// import * as Tone from 'tone'
import _ from 'lodash';
import PitchClass from './pitchClass';
import PitchDetector from 'pitchdetect';
import React, {useCallback, useEffect, useState} from 'react';
import useMidi from "./useMidi";
import {Entity} from 'aframe-react';
import {HSVtoHex} from "./color";

// window.Tone = Tone;

const audioContext = new AudioContext();

// ripped from Tone/core/Conversions
const ftomf = (frequency) => {
  return 69 + 12 * Math.log2(frequency / 440);
}

const PitchClassSpiral = ({
                            depthMax = 1,
                            isAlwaysCounterClockwise = false,
                            rMax = 1,
                            rMin = 0.5,
                            noteRange = [0, 128],
                          }) => {
  const [is180, setIs180] = useState(true);

  const noteToDimensions = n => {
    const step = n / 128;
    const r = rMax - rMax * step;

    return {
      n,
      s: 0.75 - n / 192,
      x: r * (is180 && isAlwaysCounterClockwise ? -1 : 1) * Math.sin(n * Math.PI / 6 + 0.01), // +0.01 to fix floating point error in animation library
      y: r * Math.cos(n * Math.PI / 6 + 0.01),
      z: is180 ? depthMax - depthMax * step : depthMax * step,
    };
  };

  useEffect(() => {
    const handleKeyup = ({code, key}) => {
      if (key === 'r') setIs180(is180 => !is180);
      if (code === 'Space') audioContext.resume();
    };

    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, []);


  const ref = useCallback((el) => {
    let detector;

    if (el) {
      detector = new PitchDetector({
        // Audio Context (Required)
        context: audioContext,

        // Input AudioNode (Required)
        // input: audioBufferNode, // default: Microphone input

        // Output AudioNode (Optional)
        // output: AudioNode, // default: no output

        // interpolate frequency (Optional)
        //
        // Auto-correlation is calculated for different (discrete) signal periods
        // The true frequency is often in-beween two periods.
        //
        // We can interpolate (very hacky) by looking at neighbours of the best
        // auto-correlation period and shifting the frequency a bit towards the
        // highest neighbour.
        interpolateFrequency: true, // default: true

        // Callback on pitch detection (Optional)
        onDetect: function(stats, pitchDetector) {
          const { frequency, detected, rms } = stats;

          const { s, x, y, z } = noteToDimensions(ftomf(frequency));
          el.setAttribute('material', 'opacity', rms);
          el.object3D.position.set(x, y, z);
          el.object3D.scale.set(s * 1.5, s * 1.5, s * 1.5);


          // console.log(Tone.FrequencyClass.ftom(frequency), detected, rms);
          // stats.frequency // 440
          // stats.detected // --> true
          // stats.worst_correlation // 0.03 - local minimum, not global minimum!
          // stats.best_correlation // 0.98
          // stats.worst_period // 80
          // stats.best_period // 100
          // stats.time // 2.2332 - audioContext.currentTime
          // stats.rms // 0.02
        },

        // Debug Callback for visualisation (Optional)
        onDebug: function(stats, pitchDetector) { },

        // Minimal signal strength (RMS, Optional)
        minRms: 0.01,

        // Detect pitch only with minimal correlation of: (Optional)
        minCorrelation: 0.9,

        // Detect pitch only if correlation increases with at least: (Optional)
        minCorreationIncrease: 0.5,

        // Note: you cannot use minCorrelation and minCorreationIncrease
        // at the same time!

        // Signal Normalization (Optional)
        normalize: "rms", // or "peak". default: undefined

        // Only detect pitch once: (Optional)
        stopAfterDetection: false,

        // Buffer length (Optional)
        length: 1024, // default 1024

        // Limit range (Optional):
        minNote: 69, // by MIDI note number
        maxNote: 80,

        minFrequency: 440,    // by Frequency in Hz
        maxFrequency: 20000,

        minPeriod: 2,  // by period (i.e. actual distance of calculation in audio buffer)
        maxPeriod: 512, // --> convert to frequency: frequency = sampleRate / period

        // Start right away
        start: true, // default: false
      });
    } else {
      detector.stop();
      detector.destroy();
    }
  }, []);

  const [{midiIn}] = useMidi();

  const midiInPitchClasses = _(12)
    .range()
    .map(n => _(midiIn)
      .pickBy((v, i) => i % 12 === n)
      .values()
      .sum())
    .value();

  // TODO: position by freq, not 12TET pitch

  return (// https://www.npmjs.com/package/aframe-animation-component
    <Entity events={{ click: () => audioContext.resume()}} position={{x: 0, y: 0, z: -6}} scale={{x: 4, y: 4, z: 4}}>
      {_.range(noteRange[0], noteRange[1] + 1)
        .map(noteToDimensions)
        .map(({n, s, x, y, z}) => (
          <PitchClass
            key={n}
            n={n}
            position={{x, y, z}}
            scale={{x: s, y: s, z: s}}
          />))
      }
      <Entity
        _ref={ref}
        primitive='a-sphere'
        material={{
          blending: 'additive',
          color: HSVtoHex(1, 0, 1),
          opacity: 0,
        }}
        radius={0.1}
      />
    </Entity>
  );
};

export default PitchClassSpiral;
