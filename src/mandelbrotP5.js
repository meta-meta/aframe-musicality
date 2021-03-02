import _ from 'lodash';


/* TODO

* params bound to urlParams
* option to auto-choose fundamentalFreq
  based on which partials are present
  to center around 500 - 1000hz
* option to add a second cursor for stereo effects
* alternate space-filling curves
* keep cursor in same location when switching resolutions
* manual cursor
* for hilbertN of 256 or 512, use the vals to fill an audio buffer and play the ~1 or ~5s of audio
* utonal partials
* */



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

  /* Border size and color */
  const CURSOR_STROKE_COLOR_SEPARATION = 20;
  const CURSOR_ALPHA = 0.7;
  const STROKE_WEIGHT_COEF = 1;
  const STROKE_COLOR = 0;

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

  const hilbDistanceToCoords = (hilbertN, dist) => {
    //    TODO: get distanceToVector based on percentage of maxD so that the Hilbert cursor stays in the same place when changing Hilbert resolutions
    //    TODO: also click the screen to set the cursor so need amp function to convert x,y to hilbert distance

    const v = {x: 0, y: 0};
    // _(size)
    //   .range()
    //   .map(v => Math.pow(2, v))
    //   .takeWhile(v => v < size)
    //   .value()

    for (let s = 1; s < hilbertN; s *= 2) {
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
   * Returns amp {@code Vec} representing the Euclidian coordinates of the given normalized "Mandelbrot coordinates"
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


  const dot = (v1, v2) => _.reduce(v1, (acc, val, idx) => acc + val * v2[idx], 0);

  /**
   * https://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
   * @param cx
   * @param cy
   * @param maxIterations
   * @returns {*|number}
   */
  const mandGetValSmooth = (cx, cy, maxIterations) => {
    const Bsq = 256 * 256;
    const z = [0,0];
    let n = 0;
    let x, y;

    for (let i = 0; i < maxIterations; i++) {
      [x, y] = z;
      z[0] = x * x - y * y + cx;
      z[1] = 2 * x * y + cy;
      if (dot(z, z) > Bsq) break;
      n++;
    }

    // return n - Math.log(Math.log(Math.sqrt(z[0] * z[0] + z[1] * z[1]) / Math.log(B) / Math.log(2)))
    return n >= maxIterations
      ? maxIterations
      : n - Math.log2(Math.log2(dot(z,z))) + 4;
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
    return p5.state.isSmooth
      ? mandGetValSmooth(x, y, maxIterations)
      : mandGetVal(x, y, maxIterations);
  }

  const genHilbertCoords = _.memoize((hilbertN) =>
    _.range(hilbertN * hilbertN)
      .map(d => hilbDistanceToCoords(hilbertN, d)));


  const genHilbertMandelbrot = () => {
    const {
      hilbertN,
      maxIters,
      panX,
      panY,
      partialsCountMax,
      zoom,
    } = p5.state;


    return genHilbertCoords(hilbertN).map(({ x, y }) => {
      const m = mandGetValFromNormalizedCoords(x / hilbertN, y / hilbertN, panX, panY, zoom, maxIters);
      return {
        x,
        y,
        m,
        p: m === maxIters
          ? 0 // to be filtered out
          : Math.floor(((m - 1) % partialsCountMax) + 1),
      };
    })
  };

  const getStrokeWeight = (w) => {
    const sideLength = w / p5.state.hilbertN;
    return STROKE_WEIGHT_COEF * Math.min(10, sideLength / 20);
  };

  const getPartialOfOctaveStart = _.memoize((f) =>
    _(100)
      .range()
      .map(n => Math.pow(2, n))
      .dropWhile(n => f / n >= 2)
      .first());

  const getColorForMandelbrotVal = ({m, p}, isCursor = false) => {
    const {
      maxIters,
      partialsCountMax,
    } = p5.state;

    const octMax = getPartialOfOctaveStart(partialsCountMax);
    const oct = getPartialOfOctaveStart(p);

    // good looks with smooth but not relevant to partials
    // const h = (m * 10) % 255;
    // const s = isCursor ? 0 : 255 - (m / maxIters) * 225  //(p / partialsCountMax) * 225;

    const h = 255 * Math.log2(p / oct);
    const s = isCursor ? 0 : 255 - Math.pow(oct / octMax, 2) * 225  //(p / partialsCountMax) * 225;
    const b = m === maxIters ? 0 : 255;

    return p5.color(h, s, b, isCursor ? CURSOR_ALPHA : 255);
  };

  const setFillColorForMandelbrotVal = (coordsWithVal, isCursor = false) => {
    p5.fill(getColorForMandelbrotVal(coordsWithVal, isCursor));
  }

  const drawHilbertCoord = (w, h, hilbertCoord, hilbertN) => {
    const scaleX = w / hilbertN;
    const scaleY = h / hilbertN;
    p5.rect(hilbertCoord.x * scaleX, hilbertCoord.y * scaleY, scaleX, scaleY);
    // p5.circle(hilbertCoord.x * scaleX + scaleX / 2, hilbertCoord.y * scaleY + scaleY / 2, scaleX);
  }

  const drawHilbertMandelbrot = (w, h, state) => {
    const {
      hilbertN,
      hilbMand,
    } = state;

    const strokeWeight = getStrokeWeight(p5.width / 2);
    p5.strokeWeight(strokeWeight);
    p5.stroke(STROKE_COLOR);

    const s = getSideLengthForLinearizedMap(hilbMand.length, p5.width / 4, p5.height);

    hilbMand.forEach((coordWithVal, d) => {
      setFillColorForMandelbrotVal(coordWithVal);

      p5.push();
      {
        p5.translate(p5.width / 4, 0);
        drawHilbertCoord(w, h, coordWithVal, hilbertN);
      }
      p5.pop();

      p5.push(); // TODO: is it more expensive to push/pop 1000 times or iterate over hilbMand twice?
      {
        p5.translate((p5.width / 4) * 3, 0);
        drawLinearizedMandelbrotCoord(p5.width / 4, s, d);
      }
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

  const drawLinearizedMandelbrotCoord = (w, s, d) => {
    const valsPerRow = w / s;

    let x = d % valsPerRow;
    const y = Math.floor(d / valsPerRow);

    // snake around instead of starting from the left for each row
    if (y % 2 === 1) {
      x = valsPerRow - (x + 1);
    }

    p5.rect(x * s, y * s, s, s);
  }

  const genAndDrawHilbertMandelbrot = () => {
    p5.background(32);

    // fade out. this can probably move to partials _.each
    oscs.forEach(({gain}) => {
      gain.gain.cancelScheduledValues(audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    })

    if (oscs.length !== partialsCountMax) {
      setupOscillators(); // TODO: fade out first
    }

    const {
      fundamentalFreq,
      partialsCountMax,
    } = p5.state;

    const hilbMand = genHilbertMandelbrot();

    const partials = _(hilbMand)
      .map(({p}) => p)
      .filter(_.identity) // maxIters (black) are set as p: 0
      .uniq()
      .sort()
      .take(partialsCountMax)
      .map((partial, i) => [partial, {amp: 0, oscIdx: i}])
      .fromPairs()
      .value();

    // slide to new freqs if partials change
    _.each(partials, ({decayTimerId, oscIdx, zeroGainTimerId}, partial) => {
      clearTimeout(decayTimerId);
      clearTimeout(zeroGainTimerId);
      oscs[oscIdx].osc.frequency.cancelScheduledValues(audioCtx.currentTime);
      oscs[oscIdx].osc.frequency.linearRampToValueAtTime(partial * fundamentalFreq, audioCtx.currentTime + 0.5);
    });

    p5.setState(prevState => {
      const nextState = {
        ...prevState,
        hilbMand,
        isRegenNeeded: false,
        partials,
      };
      drawHilbertMandelbrot( p5.width / 2, p5.height, nextState);
      return nextState;
    });
  }


  const cursorErasePrev = (maxD, s, d) => {
    const prevD = (maxD + d - 1) % maxD;
    const {hilbMand} = p5.state;
    const prevCoordAndVal = hilbMand[prevD];

    setFillColorForMandelbrotVal(prevCoordAndVal);
    p5.stroke(STROKE_COLOR);

    p5.push();
    {
      p5.translate(p5.width / 4, 0);
      drawHilbertCoord(p5.width / 2, p5.height, prevCoordAndVal, p5.state.hilbertN);
    }
    p5.pop();

    p5.push();
    {
      p5.translate((p5.width / 4) * 3, 0);
      drawLinearizedMandelbrotCoord(p5.width / 4, s, prevD);
    }
    p5.pop();
  }

  const cursorDraw = (id) => {
    const {hilbMand} = p5.state;
    const d = p5.state.tick % hilbMand.length;
    const coordAndVal = hilbMand[d];
    const sideLength = getSideLengthForLinearizedMap(hilbMand.length, p5.width / 4, p5.height);
    const strokeWeight = getStrokeWeight(p5.width / 2);

    p5.strokeWeight(strokeWeight);
    cursorErasePrev(hilbMand.length, sideLength, d);
    p5.stroke((CURSOR_STROKE_COLOR_SEPARATION * id) % 255, 0, 255);
    setFillColorForMandelbrotVal(coordAndVal, true);

    p5.push();
    {
      p5.translate(p5.width / 4, 0);
      drawHilbertCoord(p5.width / 2, p5.height, coordAndVal, p5.state.hilbertN);
    }
    p5.pop();

    p5.push();
    {
      p5.translate((p5.width / 4) * 3, 0);
      drawLinearizedMandelbrotCoord(p5.width / 4, sideLength, d);
    }
    p5.pop();
  }

  const cursorExcite = (id) => {
    const {
      decayDuration,
      exciteEnergy,
      exciteDuration,
      hilbMand,
      partials,
      tick,
    } = p5.state;

    const d = tick % hilbMand.length;
    const {p} = hilbMand[d];

    if (p > 0) {
      const partial = partials[p];
      const {
        amp,
        decayTimerId,
        oscIdx,
        zeroGainTimerId,
      } = partial;
      const {gain} = oscs[oscIdx];

      const isExcited = _.isNumber(decayTimerId);
      const currGain = isExcited ? amp : gain.gain.value;

      // console.log(p, currGain);

      const targetGain = 0.8 * Math.min(1, currGain + exciteEnergy * (1 - currGain));
      partial.amp = targetGain;

      clearTimeout(decayTimerId); // further delay the decay
      clearTimeout(zeroGainTimerId); // don't reset amp to zero
      gain.gain.cancelScheduledValues(0);
      gain.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + exciteDuration / 1000);

      partial.decayTimerId = setTimeout(() => {
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + decayDuration / 1000);
        partial.decayTimerId = null;

        partial.zeroGainTimerId = setTimeout(() => {
          partial.amp = 0;
        }, decayDuration)
      }, exciteDuration);
    }
  }

  const partialsDraw = () => {
    const h = p5.height;
    const w = p5.width / 4;

    p5.noStroke();

    const { partials, partialsCountMax } = p5.state;

    _.each(partials, ({ amp: targetAmp, oscIdx }, p) => {
      const barH = h / partialsCountMax;
      const y = h * ((p - 1) / partialsCountMax);
      const barW = oscs[oscIdx].gain.gain.value * w;

      const c = getColorForMandelbrotVal({ m: 1, p})
      p5.fill(p5.color(p5.hue(c), 255, 8));
      p5.rect(0, y, w, barH);

      p5.fill(c);
      p5.rect(0, y, barW, barH);
      p5.fill(255);
      p5.rect(targetAmp * w, y, 1, barH);
    })

  }

  let wasPaused = true;
  const pauseScreenDraw = () => {
    if (!p5.state.isPlaying && !p5.state.isControlPanelOpen) {
      wasPaused = true;
      p5.background(0, 0.1);
      p5.noFill();
      p5.stroke(192, 127, 90);
      p5.textSize(10);
      p5.text('arrow keys to move', 0, p5.height / 2 - 50, p5.width, p5.height);
      p5.text('shift+arrow for zoom/resolution', 0, p5.height / 2 - 35, p5.width, p5.height);
      p5.text('shift+spacebar toggle controls', 0, p5.height / 2 - 20, p5.width, p5.height);
      p5.textSize(20);
      p5.textAlign(p5.CENTER);
      p5.text('spacebar to start', 0, p5.height / 2, p5.width, p5.height);
    } else {
      if (wasPaused) {
        partialsDraw();
        drawHilbertMandelbrot(p5.width / 2, p5.height, p5.state);
        wasPaused = false;
      }
    }
  }

  let font;
  p5.preload = () => {
    font = p5.loadFont('JetBrainsMono-Regular.ttf');
  }

  p5.setup = () => {
    p5.createCanvas(p5._width, p5._height);
    p5.colorMode(p5.HSB);
    p5.textFont(font);
  }

  p5.draw = () => {
    const {
      isPlaying,
      isRegenNeeded,
      tickDuration,
      tickLastMillis,
    } = p5.state;

    if (isRegenNeeded) {
      genAndDrawHilbertMandelbrot();
    }



    const now = p5.millis();

    // console.log(!isRegenNeeded,
    //   isPlaying,
    //   now > tickLastMillis + tickDuration)

    if (_.every([
      !isRegenNeeded,
      isPlaying,
      now > tickLastMillis + tickDuration
    ])) {
      cursorDraw(0);
      cursorExcite(0);
      p5.state.tick++;
      p5.state.tickLastMillis = now;
    }

    if (isPlaying) partialsDraw();

    pauseScreenDraw();
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
