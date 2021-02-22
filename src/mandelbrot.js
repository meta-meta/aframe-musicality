import _ from 'lodash';
import P5 from 'p5';
import React, {useCallback, useEffect, useState} from 'react';
import { initialState, sketch } from "./mandelbrotP5";

const useP5 = (sketch) => {
  const [sketchState, setSketchState] = useState(initialState);
  const [sketchInstance, setSketchInstance] = useState(null);
  const [resizeObserver, setResizeObserver] = useState(null);

  if (sketchInstance) {
    sketchInstance.setState = setSketchState;
    sketchInstance.state = sketchState;
  }

  const ref = useCallback((el) => {
    if (el) {
      const instance = new P5(sketch, el);
      setSketchInstance(instance);

      instance._height = el.clientHeight;
      instance._width = el.clientWidth;

      const resize = (width, height) => {
        instance.resizeCanvas(width, height);
        setSketchState((prevState) => ({...prevState, isRegenNeeded: true}))
      }

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

const handleKeyDown = (setSketchState, sketchInstance) => (evt) => {
  console.log(evt);
  const {code, shiftKey, key} = evt;
  if (_.includes(['Control', 'Shift'], key)) return;

  setSketchState(prevState => {
    const {hilbertN, isPlaying, panX, panY, zoom} = prevState;
    const panDelta = 0.1 / zoom;

    if (code === 'Space') {
      sketchInstance.toggleAudio(!isPlaying);
      return { ...prevState, isPlaying: !isPlaying}
    }

    const nextState = {
      ...key === 'ArrowLeft'
        ? shiftKey
          ? {hilbertN: Math.pow(2, Math.log2(hilbertN) - 1)}
          : {panX: panX + panDelta}
        : {},
      ...key === 'ArrowRight'
        ? shiftKey
          ? {hilbertN: Math.min(256, Math.pow(2, Math.log2(hilbertN) + 1))}
          : {panX: panX - panDelta}
        : {},
      ...key === 'ArrowUp'
        ? shiftKey
          ? {zoom: zoom * (10 / 9)}
          : {panY: panY + panDelta}
        : {},
      ...key === 'ArrowDown'
        ? shiftKey
          ? {zoom: zoom * (9 / 10)}
          : {panY: panY - panDelta}
        : {},
    };

    return {
      ...prevState,
      ...nextState,
      isRegenNeeded: !_.isEmpty(nextState),
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
    if (sketchInstance) {
      const handler = handleKeyDown(setSketchState, sketchInstance);
      window.addEventListener('keydown', handler)
      return () => { // cleanup
        window.removeEventListener('keydown', handler);
      };
    }
  }, [sketchInstance]);

  return (
    <div
      ref={ref}
      style={{
        alignSelf: 'start',
        background: 'radial-gradient(circle, rgba(74,153,117,1) 0%, rgba(188,148,233,0.6943726953672094) 100%)',
        height: '50vw',
        width: '100vw',
      }}
    />
   );
};

export default Mandelbrot;
