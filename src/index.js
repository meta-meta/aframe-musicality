import 'aframe';
// import 'aframe-animation-component';
import 'aframe-look-at-component';
import Midi from './midi';
import MultTableMod12 from './multTableMod12';
import React from 'react';
import ReactDOM from 'react-dom';
import Tonnetz from './tonnetz';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import VR from './vr';

const App = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <Route path="/" exact render={routerProps => (
      <h1>Hello World</h1>
    )} />

    <Route path="/vr" render={(routerProps) => <VR {...routerProps} />} />

    <Route path="/multTableMod12" render={MultTableMod12} />
    <Route path="/tonnetz" render={Tonnetz} />


    <div
      style={{
        background: 'black',
        bottom: 0,
        color: 'white',
        position: 'absolute',
      }}>

      <Link to="/multTableMod12">MultTable</Link>
      -
      <Link to="/tonnetz">Tonnetz</Link>
      --
      <Link to="/vr/coltrane">Coltrane Circle</Link>
      -
      <Link to="/vr/dod">Dod</Link>

      <Midi />


    </div>
  </Router>
);

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));
