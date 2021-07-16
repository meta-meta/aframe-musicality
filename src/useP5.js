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
