import 'aframe';
// import 'aframe-animation-component';
// import 'aframe-particle-system-component';
import 'aframe-look-at-component';
import _ from 'lodash';
import Dod from './dod';
import React from 'react';
import ReactDOM from 'react-dom';
import { Entity, Scene } from 'aframe-react';
import Midi from './midi';

class App extends React.Component {
  render() {

    return (
      <Scene>
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" />
        </a-assets>

        {/*<Dod/>*/}


        <Midi/>


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
        {/*<Entity particle-system={{preset: 'snow', particleCount: 2000}}/>*/}
        {/*<Entity text={{value: 'Hello, A-Frame React!', align: 'center'}} position={{x: 0, y: 2, z: -1}}/>*/}

        {/*<Entity id="box"*/}
        {/*geometry={{primitive: 'box'}}*/}
        {/*material={{color: this.state.color, opacity: 0.6}}*/}
        {/*animation__rotate={{property: 'rotation', dur: 2000, loop: true, to: '360 360 360'}}*/}
        {/*animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '1.1 1.1 1.1'}}*/}
        {/*position={{x: 0, y: 1, z: -3}}*/}
        {/*events={{click: this.changeColor.bind(this)}}>*/}
        {/*<Entity animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '2 2 2'}}*/}
        {/*geometry={{primitive: 'box', depth: 0.2, height: 0.2, width: 0.2}}*/}
        {/*material={{color: '#24CAFF'}}/>*/}
        {/*</Entity>*/}


        <Entity primitive="a-camera" id="camera" position="0 0 2">
          <Entity primitive="a-cursor" animation__click={{
            property: 'scale',
            startEvents: 'click',
            from: '0.1 0.1 0.1',
            to: '1 1 1',
            dur: 150
          }} />
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));
