// import 'aframe-touch-look-controls'; FIXME
import Camera from './camera';
import ColtraneCircle from "./coltraneCircle";
import Dod from './dod';
import PitchClassCollections from "./pitchClassCollections";
import PitchClassSpiral from "./pitchClassSpiral";
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import {Route, Switch} from 'react-router-dom';
import {routesVr} from './routes';

// Note: needs https to enter VR

const VR = ({match: {path}}) => (
  <Scene
    // fog={{type: 'linear', color: '#000', near: 1, far: 10}}
  >
    <a-assets>
      {/*<img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>*/}
      {/*<img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>*/}
    </a-assets>

    <Switch
      // FIXME: used to be <Route path={`${path}/pitchClassSpiral`} component={PitchClassSpiral}/>
    >
      {routesVr.map(([title, path, component], key) => (
        <Route {...{ component, key, path }} />
      ))}
    </Switch>


    {/*<Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>*/}
    {/*<Entity primitive="a-light" type="ambient" color="#445451"/>*/}
    {/*<Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>*/}

    {/*<Entity*/}
    {/*  height="2048"*/}
    {/*  primitive="a-sky"*/}
    {/*  radius="30"*/}
    {/*  rotation="90 0 0"*/}
    {/*  src="#skyTexture"*/}
    {/*  theta-length="90"*/}
    {/*  width="2048"*/}
    {/*/>*/}
    {/*<Entity*/}
    {/*  height="2048"*/}
    {/*  primitive="a-sky"*/}
    {/*  radius="30"*/}
    {/*  rotation="90 0 180"*/}
    {/*  src="#skyTexture"*/}
    {/*  theta-length="90"*/}
    {/*  width="2048"*/}
    {/*/>*/}

    <Camera />

    <Entity
      // events={{}}
      id="leftHand"
      oculus-touch-controls="hand: left"
    />
    <Entity
      id="rightHand"
      oculus-touch-controls="hand: right"
    />

  </Scene>
);

export default VR;
