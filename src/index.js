// import 'aframe-animation-component';
import 'aframe';
import 'aframe-look-at-component';
import Banjo from './banjo';
import CssBaseline from '@material-ui/core/CssBaseline';
import Guitar from './guitar';
import Intro from './intro';
import MultTableMod12 from './multTableMod12';
import NumpadMod12 from './numpadMod12';
import OSC from 'osc-js';
import React from 'react';
import ReactDOM from 'react-dom';
import Mandelbrot from './mandelbrot';
import Midi from './midi';
import Staff from './staff';
import Tonnetz from './tonnetz';
import Ukulele from './ukulele';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import VR from './vr';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@material-ui/core';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {Menu as MenuIcon, WatchLater as MidiClockIcon} from '@material-ui/icons';
import _ from 'lodash';
import {MicOffOutlined, MicOutlined} from '@material-ui/icons';

import { intToRatio } from "./fns";

window.intToRation = intToRatio;

const doWhenAframeLoaded = () => {
  if (typeof AFRAME === 'undefined') {
    setTimeout(doWhenAframeLoaded, 100);
    return;
  }

  const oscHost = {
    host: window.location.hostname,
    port: '8080',
    secure: true,
  };
  const osc = new OSC({
    plugin: new OSC.WebsocketClientPlugin(oscHost),
  });
  osc.open();
  window.osc = osc;

  // window.sendOsc = (address, ...args) => osc.send(new OSC.Message(address, ...args));

  // osc.on('/midiSeq/clear', () => clearSeq());

  // osc.on('/midiSeq/beat', ({args: [beat]}) => setBeat(beat));

  // WIP
  window.AFRAME.registerComponent('midi', {
    init: function() {
      // this.onOsc = (i, e) => {};

      this._onOscId = osc.on('/midi/*', ({address, args: [note, vel]}) => {
        const instrument = _.last(address.split('/'));
        if (this.onOsc) this.onOsc({ instrument, note, vel });
      });

    },

    tick: function (time, timeDelta) {
      if (this.onTick) this.onTick(time, timeDelta);
    },

    remove: function() {
      osc.off('/midi/*', this._onOscId);
    },
  });

  window.AFRAME.registerComponent('osc', {
    init: function() {
      // this.onOsc = (i, e) => {};

      this._onOscId = osc.on('/midi/*', ({address, args: [note, vel]}) => {
        const instrument = _.last(address.split('/'));
        if (this.onOsc) this.onOsc({ instrument, note, vel });
      });

    },

    tick: function (time, timeDelta) {
      if (this.onTick) this.onTick(time, timeDelta);
    },

    remove: function() {
      osc.off('/midi/*', this._onOscId);
    },
  });
}
doWhenAframeLoaded();

const routes2d = [
  ['Mod12 Multiplication Tables', '/multTableMod12', MultTableMod12],
  ['PC-Number Notepad', '/numpadMod12', NumpadMod12],
  ['OSC Dataviz', '/osc', OSC, true],
  ['PC Tonnetz', '/tonnetz', Tonnetz],
  ['Banjo PCs', '/banjo', Banjo],
  ['Guitar PCs', '/guitar', Guitar],
  ['Ukulele PCs', '/ukulele', Ukulele],
  ['Staff', '/staff', Staff],
  ['Mandelbrot', '/mandelbrot', Mandelbrot],
];

const App = () => {
  const prefersDarkMode = true; //FIXME useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: { // https://material-ui.com/customization/palette/
          action: {
            active: '#660000',
          },
          primary: {
            main: '#330033'
          },
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  // Menu open/close
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const handleMenuButtonClick = ({ currentTarget }) => setMenuAnchorEl(currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router basename={process.env.PUBLIC_URL}>
        <Route path="/" exact component={Intro}/>

        <Route path="/vr" component={VR} />

        {routes2d.map(([title, path, component], key) => (
          <Route {...{ component, key, path }} />
        ))}

        <AppBar
          color="transparent"
          onClick={() => {
            // if (window.audioContext) { // FIXME HACK
            //   window.audioContext.resume();
            //   window.detector.start();
            // }
          }}
          position="fixed"
          style={{
            top: 'auto',
            bottom: 0,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleMenuButtonClick}
            >
              <MenuIcon/>
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              open={!!menuAnchorEl}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <Link style={{ color: 'lightgrey'}} onClick={handleMenuClose} to="/">Introduction</Link>
              </MenuItem>
              <MenuItem disabled divider >2D</MenuItem>
              {routes2d.map(([title, url, component, isDevOnly], idx) => !isDevOnly && (
                <MenuItem key={idx}>
                  <Link style={{ color: 'pink'}} onClick={handleMenuClose} to={url}>{title}</Link>
                </MenuItem>
              ))}
              <MenuItem disabled divider>VR</MenuItem>
              {[
                ['Coltrane Circle', '/vr/coltrane'],
                ['Dod', '/vr/dod'],
                ['PitchClassCollections', '/vr/pitchClassCollections'],
                ['PitchClassSpiral', '/vr/pitchClassSpiral'],
              ].map(([title, url], idx) => (
                <MenuItem key={idx}>
                  <Link style={{ color: 'cyan'}} onClick={handleMenuClose} to={url}>{title}</Link>
                </MenuItem>
              ))}
            </Menu>

            <Midi />

            <IconButton
              edge="start"
              color="inherit"
              // onClick={handleMidiMenuButtonClick(true)}
            >
              <MicOffOutlined />
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              // onClick={handleMidiMenuButtonClick(true)}
            >
              <MicOutlined />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Router>
    </ThemeProvider>
  );
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));
