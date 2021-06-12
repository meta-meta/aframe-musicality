import {Entity} from "aframe-react";
import React from "react";

const Camera = () => (
  <Entity
    primitive="a-camera"
    id="camera"
    position={{ x: 0, y: 0, z: 0 }}
    look-controls
    // touch-look-controls={{
    //   enabled: true,
    // }}
    wasd-controls={{
      acceleration: 25,
    }}
  >
    {/*<Entity*/}
    {/*  primitive="a-cursor"*/}
    {/*  animation__click={{*/}
    {/*    property: 'scale',*/}
    {/*    startEvents: 'click',*/}
    {/*    from: '0.1 0.1 0.1',*/}
    {/*    to: '1 1 1',*/}
    {/*    dur: 150,*/}
    {/*  }}/>*/}
  </Entity>
);

export default Camera;
