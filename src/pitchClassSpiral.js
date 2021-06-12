import _ from 'lodash';
import PcSpiralWindController from './pcSpiralWindController';
import PitchClass from './pitchClass';
import PitchDetector from 'pitchdetect';
import React, {useCallback, useEffect, useState} from 'react';
import useMidi from "./useMidi";
import {Entity} from 'aframe-react';
import {ftomf} from "./util";
import {HSVtoHex} from "./color";

const audioContext = new AudioContext();

// FIXME HACK
window.audioContext = audioContext;


const PitchClassSpiral = ({
  depthMax = 1,
  isAlwaysCounterClockwise = false,
  rMax = 0.75,
  rMin = 0,
  noteRange = [34, 99],
  // notesHighlighted = [0, 2, 4, 5, 7, 9, 11],
  pcsHighlighted= [0, 2, 4, 5, 7, 9, 11],
}) => {
  const [is180, setIs180] = useState(true);
  const [detector, setDetector] = useState();
  const [pitchDetectEl, setPitchDetectEl] = useState();



  const noteToDimensions = n => {
    const step = n / 128;
    const r = (is180 ? 1 : 1.5) * rMax - ((is180 ? 1 : 1.5) * rMax - rMin) * step;

    return {
      n,
      s:  0.75 - n / 192,
      x: r * (is180 && isAlwaysCounterClockwise ? -1 : 1) * Math.sin(n * Math.PI / 6 + 0.01), // +0.01 to fix floating point error in animation library
      y: r * Math.cos(n * Math.PI / 6 + 0.01),
      z: is180
        ? depthMax - depthMax * step
        : depthMax * step,
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

  useEffect(() => {
    console.log('el', pitchDetectEl, 'detector', detector);

    const handlePitch = (stats, pitchDetector) => {
      const {frequency, detected, rms} = stats;

      // https://math.stackexchange.com/q/57429/398343
      // const opacity = 1 - Math.exp(-2 * rms);
      const opacity = rms / (0.1 + rms);
      const n = ftomf(frequency);
      const {s, x, y, z} = noteToDimensions(n);
      pitchDetectEl.setAttribute('material', 'opacity', detected ? opacity : 0);
      pitchDetectEl.object3D.position.set(x, y, z + 0.01);
      pitchDetectEl.object3D.scale.set(s, s, s);

      if (_.isFinite(n)) {
        pitchDetectEl.setAttribute('material', 'color', HSVtoHex(n / 12, 0.5, 1));
      }
    };

    if (audioContext && !detector && pitchDetectEl) {
      setDetector(new PitchDetector({
        context: audioContext,

        // input: audioBufferNode, // default: Microphone input

        interpolateFrequency: true, // default: true

        onDebug: handlePitch,

        // Minimal signal strength (RMS, Optional)
        // minRms: 0.1,

        // Detect pitch only with minimal correlation of: (Optional)
        // minCorrelation: 0.9,

        // Detect pitch only if correlation increases with at least: (Optional)
        minCorrelationIncrease: 0.5,

        // Note: you cannot use minCorrelation and minCorreationIncrease
        // at the same time!

        // Signal Normalization (Optional)
        normalize: "rms", // or "peak". default: undefined

        // Only detect pitch once: (Optional)
        stopAfterDetection: false,

        // Buffer length (Optional)
        length: 1024, // default 1024

        // Limit range (Optional):
        minNote: 32, // by MIDI note number
        maxNote: 128,

        // minFrequency: 440,    // by Frequency in Hz
        // maxFrequency: 20000,

        minPeriod: 2,  // by period (i.e. actual distance of calculation in audio buffer)
        maxPeriod: 512, // --> convert to frequency: frequency = sampleRate / period

        // Start right away
        start: true, // default: false
      }));
      // window.detector = detector;
    } else if (detector && !pitchDetectEl) {
      detector.stop();
      detector.destroy();
    }
  }, [audioContext, detector, is180, pitchDetectEl]);



  const pitchDetectRef = useCallback(setPitchDetectEl, []);


  // const midiInPitchClasses = _(12)
  //   .range()
  //   .map(n => _(midiIn)
  //     .pickBy((v, i) => i % 12 === n)
  //     .values()
  //     .sum())
  //   .value();

  // TODO: position by freq, not 12TET pitch

  return (// https://www.npmjs.com/package/aframe-animation-component
    <Entity
      events={{
        click: () => {
          audioContext.resume()
        },
      }}
      position={{x: 0, y: 0, z: -6}}
      scale={{x: 4, y: 4, z: 4}}
    >
      {_.range(noteRange[0], noteRange[1] + 1)
        .map(noteToDimensions)
        .map(({n, s, x, y, z}) => (
          <React.Fragment key={n}>
            <Entity
              line={{
                color: 'black',
                opacity: 0.3,
                start: _.pick(noteToDimensions(n + 0.25), ['x', 'y', 'z']),
                end: _.pick(noteToDimensions(n + 0.75), ['x', 'y', 'z']),
                visible: n < noteRange[1],
              }}
            />

            <PitchClass
              darkened={!_.includes(pcsHighlighted, n%12)}
              n={n}
              position={{x, y, z}}
              scale={{x: s, y: s, z: s}}
            />
          </React.Fragment>
          ))
      }

      <PcSpiralWindController
        noteToDimensions={noteToDimensions}
      />

      {/* TODO intervals   */}
      {/*<Entity*/}
      {/*  line={{*/}
      {/*    color: 'white',*/}
      {/*    opacity: 0.3,*/}
      {/*    start: _.pick(noteToDimensions(60), ['x', 'y', 'z']),*/}
      {/*    end: _.pick(noteToDimensions(65), ['x', 'y', 'z']),*/}
      {/*  }}*/}
      {/*/>*/}


      <Entity
        _ref={pitchDetectRef}
        primitive='a-sphere'
        material={{
          blending: 'additive',
          color: HSVtoHex(1, 0, 1),
          opacity: 0,
          transparent: true,
        }}
        radius={0.1}
      />
    </Entity>
  );
};

export default PitchClassSpiral;
