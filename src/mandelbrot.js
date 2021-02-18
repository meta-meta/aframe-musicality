import _ from 'lodash';
import P5 from 'p5';
import React, {useCallback, useEffect, useState} from 'react';

const initialState = {
  hilbertN: 64, // hilbertN must be power of 2 in order to be square
  isRedrawNeeded: false,
  maxMandelbrotIters: 1024,
  panX: -0.035,
  panY: 0.23,
  zoom: 18,
};

const sketch = (p5) => {
  p5.state = initialState;

  const getHilbertDMax = () => Math.pow(p5.state.hilbertN, 2);


  /* Border size and color */
  const STROKE_WEIGHT_COEF = 1;
  const STROKE_COLOR_LINEARIZED_VIEW = 64;
  const STROKE_COLOR_HILBERT_VIEW = 0;
  const strokeWeightHilbert = 0;
  let strokeWeightLinearized = 0;

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
      const { hilbertN } = p5.state;

      const {x, y} = hilbDistanceToVec(hilbertN, d);

      const {
        maxMandelbrotIters,
        panX,
        panY,
        zoom,
      } = p5.state;

      return {
        x,
        y,
        m: mandGetValFromNormalizedCoords(x / hilbertN, y / hilbertN, panX, panY, zoom, maxMandelbrotIters)
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
  const mandGetHue = (val) => val % 255;

  const setFillColorForMandelbrotCoord = (p5, coordWithVal, maxIters) => {
    p5.fill(mandGetHue(coordWithVal.m), 255, mandGetBrightness(coordWithVal.m, maxIters));
  }

  const drawHilbertCoord = (p5, w, h, hilbertCoord, hilbertN) => {
    const scaleX = w / hilbertN;
    const scaleY = h / hilbertN;
    p5.rect(hilbertCoord.x * scaleX, hilbertCoord.y * scaleY, scaleX, scaleY);
  }

  const drawHilbertMandelbrot = (p5, w, h, coordsWithVals, maxIters, hilbertN, strokeWeight) => {
    p5.strokeWeight(strokeWeight);
    p5.stroke(STROKE_COLOR_HILBERT_VIEW);

    coordsWithVals.forEach(coordWithVal => {
      setFillColorForMandelbrotCoord(p5, coordWithVal, maxIters);
      drawHilbertCoord(p5, w, h, coordWithVal, hilbertN);
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
    const strokeWeightHilbert = hilbGetStrokeWeight(p5.width / 2, hilbMand.length);
    const { hilbertN, maxMandelbrotIters } = p5.state;
    drawHilbertMandelbrot(p5, p5.width / 2, p5.height, hilbMand, maxMandelbrotIters, hilbertN, strokeWeightHilbert);

    p5.push();
    p5.translate(p5.width / 2, 0);
    drawLinearizedValues(p5.width / 2, p5.height, hilbMand, maxMandelbrotIters);
    p5.pop();

    // generateNoteList();  // TODO: only generate if maxMandelbrotIters increased
  }


  p5.setup = () => {
    p5.createCanvas(1000, 500);
    p5.colorMode(p5.HSB);
    genAndDrawHilbertMandelbrot(getHilbertDMax());
    // p5.noLoop();
  }

  p5.draw = () => {
    if (_.get(p5.state, 'isRedrawNeeded')) {
      genAndDrawHilbertMandelbrot(getHilbertDMax());
      p5.setState(prevState => ({ ...prevState, isRedrawNeeded: false }));
    }
    // p5.background(0)
    // p5.fill(255, 50, 50);
    // p5.circle(100, 100, 50);
  }
}

const useP5 = (sketch) => {
  const [sketchState, setSketchState] = useState(initialState);
  const [sketchInstance, setSketchInstance] = useState(null);
  const [resizeObserver, setResizeObserver] = useState(null);

  if (sketchInstance) {
    sketchInstance.setState = setSketchState;
    sketchInstance.state = sketchState;
  };

  const ref = useCallback((el) => {
    if (el) {
      const instance = new P5(sketch, el);
      setSketchInstance(instance);

      const resize = (width, height) => {
        instance.resizeCanvas(width, height);
        setSketchState((prevState) => ({ ...prevState, isRedrawNeeded: true }))
      }

      _.delay(() => resize(el.clientWidth, el.clientHeight), 1000);

      const resizeObserver = new ResizeObserver(([{contentRect: {height, width}}]) => {
        resize(width, height);
      });
      setResizeObserver(resizeObserver);
      resizeObserver.observe(el);
    } else {
      resizeObserver.disconnect();
    }
  }, []);

  return {
    sketchInstance,
    sketchState,
    setSketchState,
    ref,
  };
}

const handleKeyDown = (setSketchState) => ({ key }) => {
  console.log(key);

  setSketchState(prevState => {
    const { hilbertN, panX, panY, zoom } = prevState;
    const panDelta = 0.1 / zoom;
console.log(zoom)
    return {
      ...prevState,
      ...key === 'ArrowLeft' ? { panX: panX + panDelta } : {},
      ...key === 'ArrowRight' ? { panX: panX - panDelta } : {},
      ...key === 'ArrowUp' ? { panY: panY + panDelta } : {},
      ...key === 'ArrowDown' ? { panY: panY - panDelta } : {},
      ...key === 'PageUp' ? { zoom: zoom * (10/9) } : {},
      ...key === 'PageDown' ? { zoom: zoom * (9/10) } : {},
      ...key === ',' ? { hilbertN: Math.pow(2, Math.log2(hilbertN) - 1) } : {},
      ...key === '.' ? { hilbertN: Math.pow(2, Math.log2(hilbertN) + 1) } : {},
      isRedrawNeeded: true,
    };
  })
  
};

const Mandelbrot = () => {
  const {
    ref,
    sketchInstance,
    sketchState,
    setSketchState,
  } = useP5(sketch);

  window.sketchInstance = sketchInstance;

  useEffect(() => {
    const handler = handleKeyDown(setSketchState);
    window.addEventListener('keydown', handler)
    return () => { // cleanup
      window.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <div
      style={{
        background: 'darkcyan',
        height: '50vw',
        width: '100vw',
      }}
    >
      <div
        ref={ref}
        style={{
          background: 'pink',
          height: '100%',
          width: '100%',
        }}
      />
    </div>);
};

export default Mandelbrot;
