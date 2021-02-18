import _ from 'lodash';
import Vex from 'vexflow';
import React, {useCallback, useState} from 'react';

const VF = Vex.Flow;

const useVexFlow = () => {
  const [context, setContext] = useState(null);
  const [resizeObserver, setResizeObserver] = useState(null);

  const ref = useCallback((el) => {
    if (el) {
      const renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
      renderer.resize(el.clientWidth, el.clientHeight);
      setContext(renderer.getContext());

      const resizeObserver = new ResizeObserver(([{ contentRect: { height, width } }]) => {
        renderer.resize(width, height);
      });
      setResizeObserver(resizeObserver);
      resizeObserver.observe(el);
    } else {
      resizeObserver.disconnect();
    }
  }, []);

  return {
    context,
    ref,
  };
}

const Staff = () => {
  const {
    context,
    ref,
  } = useVexFlow();

  if (context) {
    context.setStrokeStyle('white');
    context.setFillStyle('white');

    const treble = new VF.Stave(50, 0, 10000)
      .addClef('treble')
      .addKeySignature('Db')
      .addTimeSignature('4/4')
      .setContext(context)
      .draw();

    window.VF= VF;
    window.context = context
    window.treble = treble

    const bass = new VF.Stave(50, 60, 10000)
      .addClef('bass')
      .addTimeSignature('4/4')
      .addKeySignature('Db')
      .setContext(context)
      .draw();

    const brace = new VF.StaveConnector(treble, bass)
      .setType(VF.StaveConnector.type.BRACE)
      .setContext(context)
      .draw();


    const leftLine = new VF.StaveConnector(treble, bass)
      .setType(VF.StaveConnector.type.SINGLE_LEFT)
      .setContext(context)
      .draw();

  }


  return (
    <div style={{
      display: 'block',
      width: '100%',
    }}>
      <div
        ref={ref}
        style={{
          // background: 'darkcyan',
          fill: 'white',
          height: 500,
          stroke: 'white',
        }}/>
    </div>
  )
};

export default Staff;
