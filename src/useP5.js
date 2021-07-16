import P5 from 'p5';
import {useCallback, useState} from "react";

export default (sketch, initialState) => {
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

      const ro = new ResizeObserver(([{contentRect: {height, width}}]) => {
        instance.resizeCanvas(width, height);
        if (width + height > 0) setSketchState((prevState) => ({...prevState, isRegenNeeded: true}));
      });

      setResizeObserver(ro);
      ro.observe(el);
    } else {
      if (resizeObserver) resizeObserver.disconnect();
    }
  }, []);

  return {
    sketchInstance,
    sketchState,
    setSketchState,
    ref,
  };
};
