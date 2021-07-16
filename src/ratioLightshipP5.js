import _ from 'lodash';



export const initialState = {
  decayDuration: 5000,
  exciteEnergy: 0.05,
  exciteDuration: 1000,
  fundamentalFreq: 200,
  hilbertN: 64, // hilbertN must be power of 2 in order to be square
  hilbMand: [/*{ x, y, m }*/], // coordinates and associated mandelbrot val in hilbert traversal order
  isControlPanelOpen: true,
  isPlaying: false,
  isRegenNeeded: true,
  maxIters: 4096, // max number of steps to recurse the mandelbrot fn
  midiClock: 0,
  midiClocksPerTick: 24,
  panX: -0.05,
  panY: 0,
  partials: {/* partial: { amp, oscIdx } */}, // the collection is updated in setState but values within are changed in drawLoop directly
  partialsCountMax: 16,
  isSmooth: false, // smooth technique https://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
  tick: 0, // updated in draw() bypasses setState
  tickDuration: 100,
  tickLastMillis: 0, // updated in draw() bypasses setState
  zoom: 1.2,

  // zoom: 3603.7157567397, panX: 0.18580280974577668, panY: 0.00036930706052212803,

  // floating point errors here
  // zoom: 279919582741326.66, panX: -0.014853203736137617, panY: 0.13451319076043783,

  // panX: 0.0011548427778035686,
  // panY: 0.025033026937542575,
  // zoom: 319852972190.0951,
  //
  // panX: -0.18498767183730766,
  // panY: 0.4722205531430409,
  // zoom: 419013953.31772846,
  //
  //
  // decay: 0.000075,
  // exciteEnergy: 0.006,
  // fundamentalFreq: 10,
  // hilbertN: 256,
  // maxIters: 4096,
  // panX: 0.0011503007796323155,
  // panY: 0.025033026938902938,
  // tickDuration: 10,
  // zoom: 836635.9887997985,
  //
  //
  //
  // panX: 0.08871194014553094,
  // panY: -0.12829271146701177,
  // zoom: 19736096.460687958,

  // ...{zoom: 39422433.84662852, panX: 0.04670942760989286, panY: 0.13656218122372943},

  // demo for 10 partials
  // ...{zoom: 12371177.464729108, panX: 0.04671008941233588, panY: 0.13656133340058238},
};

let audioCtx = new AudioContext();
let oscs = [];

const masterGain = audioCtx.createGain();
window.masterGain = masterGain;
masterGain.gain.value = 1;
masterGain.connect(audioCtx.destination);


export const sketch = (p5) => {
  p5.state = initialState;

  const setupOscillators = () => {
    oscs.forEach(({osc, gain}) =>
    {
      osc.stop();
    }); // TODO: gain.disconnect?

    oscs = _.range(p5.state.partialsCountMax).map(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return {osc, gain};
    });

    window.oscs = oscs;
  }

  let font;
  p5.preload = () => {
    font = p5.loadFont('JetBrainsMono-Regular.ttf');
  }


  const TWO_PI = Math.PI * 2;

  let h, w;

  let d, n, n2 = 0;

  [n, d] = [2, 1];

  p5.setup = () => {
    p5.createCanvas(p5._width, p5._height);
    p5.blendMode(p5.ADD);
    p5.colorMode(p5.HSB, 255);
    p5.textFont(font);
  }

  let input = [];
  p5.keyTyped = () => {
    console.log(p5.key)
    // if (key === ':') {
    //   value = 255;
    // } else if (key === 'b') {
    //   value = 0;
    // }
    // uncomment to prevent any default behavior
    if (p5.key === 'Enter') {

      const obj = input.join('').split(':').map(s => parseInt(s, 10));

      n2 = 0;
      [d, n, n2] = obj;
      if (!n2) {
        [n, d] = obj;
        n2 = 0;
      }
      console.log(d, n, n2)
      console.log(w, h)

      input = [];
    } else {
      input.push(p5.key);
    }



    return false;
  }

  let phase = 0;
  let x1 = 0;
  let y1 = 0;
  let r;
  const rayCount = 500;

  const drawWave = ({ freq, phase = 0, hue }) => {
    const dt = TWO_PI / rayCount;
    p5.push();
    p5.translate(w/2, h/2);
    for(let t = 0; t < TWO_PI - dt; t += dt) {
      p5.stroke(
        hue,
        255,
        freq && (50 + 50 * Math.sin(t * freq)),
        100,
      );

      r = w + h;
      x1 = r * Math.sin(t + phase);
      y1 = r * Math.cos(t + phase);

      p5.line(0, 0, x1, y1);
    }
    p5.pop();
  };


  p5.draw = () => {
    p5.clear();
    p5.background(0, 0, 0);
    h = p5.height;
    w = p5.width;


    phase = p5.millis() * (0.001/d);

    drawWave({
      freq: d,
      hue: 0,
      phase,
    });

    drawWave({
      freq: d * n / d,
      hue: 90,
      phase: phase * 2,
    });

    drawWave({
      freq: d * n2 / n,
      hue: 180,
      phase: phase * 3,
    });





    p5.blendMode(p5.BLEND);
    p5.fill(255);
    p5.stroke(0);
    p5.strokeWeight(4);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(h/15)
    p5.text(n2 ? `${d}:${n}:${n2}` : `${n}:${d}`, w/2, h/2)
    p5.blendMode(p5.ADD);
  }

  /**
   * This needs to be called by a user event handler.
   * @param isPlaying
   */
  p5.toggleAudio = () => {
    p5.setState(prevState => {
      const { isPlaying } = prevState;
      if (!isPlaying && audioCtx.state !== 'running') {
        audioCtx.resume();
      }

      if (isPlaying && audioCtx.state === 'running') {
        audioCtx.suspend();
      }

      return { ...prevState, isPlaying: !prevState.isPlaying };
    });

  }
}
