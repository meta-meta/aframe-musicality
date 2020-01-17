import ColtraneCircle from "./coltraneCircle";
import Dod from './dod';
import React from 'react';
import {Entity, Scene} from 'aframe-react';
import {Route, Switch} from 'react-router-dom';

// Note: needs https to enter VR

const VR = ({match: {path}}) => (
  <Scene>
    <a-assets>
      <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
      <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>
    </a-assets>

    <Switch>
      <Route path={`${path}/coltrane`} component={ColtraneCircle}/>
      <Route path={`${path}/dod`} component={Dod}/>
    </Switch>


    {/*<Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>*/}
    {/*<Entity primitive="a-light" type="ambient" color="#445451"/>*/}
    {/*<Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>*/}

    <Entity
      height="2048"
      primitive="a-sky"
      radius="30"
      rotation="90 0 0"
      src="#skyTexture"
      theta-length="90"
      width="2048"
    />
    <Entity
      height="2048"
      primitive="a-sky"
      radius="30"
      rotation="90 0 180"
      src="#skyTexture"
      theta-length="90"
      width="2048"
    />

    <Entity primitive="a-camera" id="camera" position="0 0 2">
      <Entity primitive="a-cursor" animation__click={{
        property: 'scale',
        startEvents: 'click',
        from: '0.1 0.1 0.1',
        to: '1 1 1',
        dur: 150,
      }}/>
    </Entity>
  </Scene>
);

export default VR;
