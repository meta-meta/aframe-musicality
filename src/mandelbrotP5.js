import _ from 'lodash';

const oscCount = 32;

export const initialState = {
  decayMillis: 1000,
  excite: 0.001,
  freq: 20,
  hilbertN: 64, // hilbertN must be power of 2 in order to be square
  hilbMand: [],
  isPlaying: false,
  isRedrawNeeded: false,
  maxIters: 4096,
  panX: -0.035,
  panY: 0.23,
  tick: 0,
  tickDuration: 100,
  tickLastMillis: 0,
  zoom: 18,

  panX: 0.0011548427778035686,
  panY: 0.025033026937542575,
  zoom: 319852972190.0951,

  panX: -0.18498767183730766,
  panY: 0.4722205531430409,
  zoom: 419013953.31772846,


  decay: 0.000075,
  excite: 0.006,
  freq: 10,
  hilbertN: 256,
  maxIters: 4096,
  panX: 0.0011503007796323155,
  panY: 0.025033026938902938,
  tickDuration: 10,
  zoom: 836635.9887997985,



  panX: 0.08871194014553094,
  panY: -0.12829271146701177,
  zoom: 19736096.460687958,
};

let partials = {/* partial: { a, oscIdx } */};
let audioCtx = new AudioContext();

const masterGain = audioCtx.createGain();
window.masterGain = masterGain;
masterGain.gain.value = 1;
masterGain.connect(audioCtx.destination);

const oscs = _.range(oscCount).map(() => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  return {osc, gain};
})

window.oscs = oscs;

export const sketch = (p5) => {
  p5.state = initialState;

  const getHilbertDMax = () => Math.pow(p5.state.hilbertN, 2);


  /* Border size and color */
  const CURSOR_STROKE_COLOR_SEPARATION = 20;
  const CURSOR_ALPHA = 128;
  const STROKE_WEIGHT_COEF = 1;
  const STROKE_COLOR_LINEARIZED_VIEW = 255;
  const STROKE_COLOR_HILBERT_VIEW = 0;
  const strokeWeightHilbert = 0;
  let strokeWeightLinearized = 1;

  //rotate/flip a quadrant appropriately
  const hilbGetRotatedVec = (n, v, rx, ry) => {
    if (ry === 0) {
      if (rx === 1) {
        v.x = n - 1 - v.x;
        v.y = n - 1 - v.y;
      }

      //Swap x and y
      let temp = v.x;
      v.x = v.y;
      v.y = temp;
    }
  }

  const hilbDistanceToVec = (size, dist) => {
    //    TODO: get distanceToVector based on percentage of maxD so that the Hilbert cursor stays in the same place when changing Hilbert resolutions
    //    TODO: also click the screen to set the cursor so need a function to convert x,y to hilbert distance

    const v = {x: 0, y: 0};
    for (let s = 1; s < size; s *= 2) {
      let rx = 1 & (dist / 2);
      let ry = 1 & (dist ^ rx);
      hilbGetRotatedVec(s, v, rx, ry);
      v.x += s * rx;
      v.y += s * ry;
      dist /= 4;
    }
    return v;
  }

  /**
   * Returns a {@code Vec} representing the Euclidian coordinates of the given normalized "Mandelbrot coordinates"
   * <br>Mandelbrot X scale: -2.5 to 1
   * <br>Mandelbrot Y scale: -1 to 1
   * @param x normalized x coordinate 0 to 1.0
   * @param y normalized y coordinate 0 to 1.0
   * @return
   */
  const mandGetDenormalizedCoords = (x, y) => ({
    x: -2.5 + x * 3.5,
    y: -1 + y * 2,
  })

  /**
   * Returns the number of iterations to escape the Mandelbrot set at the given coordinates
   * @param scaledX
   * @param scaledY
   * @param maxIterations
   * @return
   */
  const mandGetVal = (scaledX, scaledY, maxIterations) => {
    let x = 0, y = 0;
    let iter = 0;

    while (x * x + y * y < 4 && iter < maxIterations) {
      let xTemp = x * x - y * y + scaledX;
      y = 2 * x * y + scaledY;
      x = xTemp;
      iter++;
    }
    return iter;
  }

  /**
   * Returns the number of iterations required to escape the Mandelbrot set at the given coordinates
   * @param xN normalized x coordinate 0 to 1.0
   * @param yN normalized y coordinate 0 to 1.0
   * @param panX < 0 pans left. > 0 pans right
   * @param panY < 0 pans up. > 0 pans down
   * @param zoom 1.0 is unzoomed
   * @param maxIterations
   * @return
   */
  const mandGetValFromNormalizedCoords = (xN, yN, panX, panY, zoom, maxIterations) => {
    let x1 = 0.5 - panX + (xN - 0.5) / zoom;
    let y1 = 0.5 - panY + (yN - 0.5) / zoom;
    const {x, y} = mandGetDenormalizedCoords(x1, y1);
    return mandGetVal(x, y, maxIterations);
  }

  const genHilbertMandelbrot = (dMax) => _.range(dMax)
    .map(d => {
      const {hilbertN} = p5.state;

      const {x, y} = hilbDistanceToVec(hilbertN, d);

      const {
        maxIters,
        panX,
        panY,
        zoom,
      } = p5.state;

      return {
        x,
        y,
        m: mandGetValFromNormalizedCoords(x / hilbertN, y / hilbertN, panX, panY, zoom, maxIters),
      };
    });

  const getStrokeWeight = (sideLength) => sideLength > 2
    ? STROKE_WEIGHT_COEF * Math.max(1, Math.min(10, sideLength / 20))
    : 0;

  const hilbGetStrokeWeight = (w, numVals) => {
    const s = w / Math.sqrt(numVals);
    return getStrokeWeight(s);
  };

  const mandGetBrightness = (val, maxIters) => val === maxIters ? 0 : 255;
  const mandGetHue = (val) => (val % oscCount) * (255 / oscCount);

  const setFillColorForMandelbrotCoord = (p5, coordWithVal, maxIters, s = 255) => {
    p5.fill(mandGetHue(coordWithVal.m), s, mandGetBrightness(coordWithVal.m, maxIters));
  }

  const drawHilbertCoord = (w, h, hilbertCoord, hilbertN) => {
    const scaleX = w / hilbertN;
    const scaleY = h / hilbertN;
    p5.rect(hilbertCoord.x * scaleX, hilbertCoord.y * scaleY, scaleX, scaleY);
  }

  const drawHilbertMandelbrot = (p5, w, h, maxIters, hilbertN, strokeWeight) => {
    p5.strokeWeight(strokeWeight);
    p5.stroke(STROKE_COLOR_HILBERT_VIEW);

    const {hilbMand} = p5.state;
    const maxD = hilbMand.length;
    const s = getSideLengthForLinearizedMap(maxD, p5.width / 2, p5.height);

    hilbMand.forEach((coordWithVal, d) => {
      setFillColorForMandelbrotCoord(p5, coordWithVal, maxIters);
      drawHilbertCoord(w, h, coordWithVal, hilbertN);

      p5.push();
      p5.translate(p5.width / 2, 0);
      p5.strokeWeight(strokeWeightLinearized);
      p5.stroke(STROKE_COLOR_LINEARIZED_VIEW);
      drawLinearizedMandelbrotCoord(p5, p5.width / 2, s, d);
      p5.pop();
    })
  };

  const getSideLengthForLinearizedMap = (dMax, w, h) => {
    const maxA = w * h;
    const largestPossibleSide = Math.sqrt(maxA / dMax);

    let s = 0;
    for (let i = 1; i < w; i++) {
      s = w / i;
      if (s > largestPossibleSide) {
        continue;
      }

      const sqPerRow = w / s;
      const rows = dMax / sqPerRow;
      const leftover = dMax % sqPerRow;

      if (rows * s + (leftover > 0 ? s : 0) <= h) {
        break;
      }
    }
    return s;
  }

  const drawLinearizedMandelbrotCoord = (p5, w, s, d) => {
    const valsPerRow = w / s;

    let x = d % valsPerRow;
    const y = Math.floor(d / valsPerRow);

    // snake around instead of starting from the left for each row
    if (y % 2 === 1) {
      x = valsPerRow - (x + 1);
    }

    p5.rect(x * s, y * s, s, s);
  }

  const drawLinearizedValues = (w, h, coordsWithVals, maxIters) => {
    const dMax = coordsWithVals.length;
    const s = getSideLengthForLinearizedMap(dMax, w, h);
    strokeWeightLinearized = getStrokeWeight(s);
    p5.stroke(STROKE_COLOR_LINEARIZED_VIEW);
    p5.strokeWeight(strokeWeightLinearized);
    for (let d = 0; d < dMax; d++) {
      setFillColorForMandelbrotCoord(p5, coordsWithVals[d], maxIters);
      drawLinearizedMandelbrotCoord(p5, w, s, d);
    }
  }

  const genAndDrawHilbertMandelbrot = (dMax) => {
    const hilbMand = genHilbertMandelbrot(dMax);

    const {hilbertN, maxIters} = p5.state;

    partials = _(hilbMand)
      .map(({m}) => m % oscCount + 1)
      .filter(m => m !== maxIters)
      .uniq()
      .sort()
      .take(oscCount)
      .map((m, i) => [m, {a: 0, oscIdx: i}])
      .fromPairs()
      .value()

    window.partials = partials;

    console.log('partials', _.keys(partials))

    oscs.forEach(({gain}) => {
      gain.gain.value = 0;
    })

    _.each(partials, ({oscIdx}, partial) => {
      oscs[oscIdx].osc.frequency.value = partial * p5.state.freq;
    });

    p5.setState(prevState => ({...prevState, hilbMand}));
    const strokeWeightHilbert = hilbGetStrokeWeight(p5.width / 2, hilbMand.length);
    drawHilbertMandelbrot(p5, p5.width / 2, p5.height, maxIters, hilbertN, strokeWeightHilbert);

    // p5.push();
    // p5.translate(p5.width / 2, 0);
    // drawLinearizedValues(p5.width / 2, p5.height, maxIters);
    // p5.pop();

    // generateNoteList();  // TODO: only generate if maxIters increased
  }


  const cursorErase = (p5, maxD, s, d) => {
    const prevD = (maxD + d - 1) % maxD;
    const {hilbMand} = p5.state;
    const prevCoordAndVal = hilbMand[prevD];
    const strokeWeightHilbert = hilbGetStrokeWeight(p5.width / 2, hilbMand.length);

    setFillColorForMandelbrotCoord(p5, prevCoordAndVal, p5.state.maxIters);
    p5.strokeWeight(strokeWeightHilbert);
    p5.stroke(STROKE_COLOR_HILBERT_VIEW);
    drawHilbertCoord(p5.width / 2, p5.height, prevCoordAndVal, p5.state.hilbertN);

    p5.push();
    p5.translate(p5.width / 2, 0);
    p5.strokeWeight(strokeWeightLinearized);
    p5.stroke(STROKE_COLOR_LINEARIZED_VIEW);
    drawLinearizedMandelbrotCoord(p5, p5.width / 2, s, prevD);
    p5.pop();
  }

  const cursorDrawAndExcite = (id, tick) => {
    const {decayMillis, excite, hilbMand, maxIters} = p5.state;
    const maxD = hilbMand.length;
    const d = tick % maxD;
    const s = getSideLengthForLinearizedMap(maxD, p5.width / 2, p5.height);

    // previous cursor position
    cursorErase(p5, maxD, s, d);

    const coordAndVal = hilbMand[d];
    const {m} = coordAndVal;

    // const diff = 1 - amps[val];
    if (m !== maxIters) {
      const val = m % oscCount + 1;
      const {a, oscIdx} = partials[val];
      const {gain} = oscs[oscIdx];

      // partials[val].a = 0.8 * Math.min(1, a + excite / (1 - a));


      // const rampToTime = audioCtx.currentTime * (now - (p5.prevMillis || 0)) / 1000;
      // console.log(rampToTime)

      // gain.gain.value = a;
      // gain.gain.cancelScheduledValues(audioCtx.currentTime);
      const rampMillis = 200;//p5.state.tickDuration * 10;
      // gain.gain.cancelScheduledValues(audioCtx.currentTime);

      const newGain = 0.8 * Math.min(1, gain.gain.value + excite * (1 - gain.gain.value))

      // gain.gain.cancelScheduledValues(audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(newGain, audioCtx.currentTime + rampMillis / 1000);

      _.delay(() => {
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + decayMillis / 1000)
      }, rampMillis);
    }


    // base.playNote(id, notes.get(val % notes.size()), val == maxIters);

    // p5.blendMode(p5.ADD);
    p5.fill(255, CURSOR_ALPHA);
    // setFillColorForMandelbrotCoord(p5, coordAndVal, p5.state.maxIters, CURSOR_ALPHA);
    p5.strokeWeight(strokeWeightHilbert);
    p5.stroke((CURSOR_STROKE_COLOR_SEPARATION * id) % 255, 255, 255);
    drawHilbertCoord(p5.width / 2, p5.height, coordAndVal, p5.state.hilbertN);

    p5.push();
    p5.translate(p5.width / 2, 0);
    p5.strokeWeight(strokeWeightLinearized);
    drawLinearizedMandelbrotCoord(p5, p5.width / 2, s, d);
    p5.pop();
    // p5.blendMode(p5.REPLACE);
  }


  p5.setup = () => {
    p5.createCanvas(p5._width, p5._height);
    p5.colorMode(p5.HSB);
    genAndDrawHilbertMandelbrot(getHilbertDMax());
  }

  p5.draw = () => {
    const {
      isPlaying,
      isRedrawNeeded,
      tick,
      tickDuration,
      tickLastMillis,
    } = p5.state;

    if (isPlaying && audioCtx.state !== 'running') {
      audioCtx.resume();
    }

    if (!isPlaying && audioCtx.state === 'running') {
      audioCtx.suspend();
    }

    if (isRedrawNeeded) {
      genAndDrawHilbertMandelbrot(getHilbertDMax());
      p5.setState(prevState => ({...prevState, isRedrawNeeded: false}));
    }

    const now = p5.millis();

    if (now > tickLastMillis + tickDuration) {
      cursorDrawAndExcite(0, tick);

      p5.setState(prevState => ({
        ...prevState,
        tick: tick + 1,
        tickLastMillis: now,
      }));

    }

    p5.prevMillis = now;
  }
}
