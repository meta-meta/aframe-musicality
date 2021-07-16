import React, {useEffect} from 'react';
import useP5 from './useP5';
import {initialState, sketch} from "./ratioLightshipP5";

const RatioLightship = () => {
  const {
    ref,
    sketchInstance,
    sketchState,
    setSketchState,
  } = useP5(sketch, initialState);

  window.sketchInstance = sketchInstance;

  useEffect(() => {
    document.title = 'Ratio Lightship';
  }, [sketchInstance]);

  return (
    <div
      ref={ref}
      style={{
        alignSelf: 'start',
        background: 'radial-gradient(circle, rgba(74,153,117,1) 0%, rgba(188,148,233,0.6943726953672094) 100%)',
        height: '100vh',
        width: '100vw',
      }}
    />);
};


export default RatioLightship;
