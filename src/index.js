import 'aframe';
// import 'aframe-animation-component';
import 'aframe-look-at-component';
import CssBaseline from '@material-ui/core/CssBaseline';
import Guitar from './guitar';
import MultTableMod12 from './multTableMod12';
import NumpadMod12 from './numpadMod12';
import OSC from 'osc-js';
import React from 'react';
import ReactDOM from 'react-dom';
import Tonnetz from './tonnetz';
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
import {Menu as MenuIcon} from '@material-ui/icons';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: { // https://material-ui.com/customization/palette/
          action: {
            active: '#660000',
          },
          primary: {
            main: '#440044'
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
        <Route path="/" exact render={routerProps => (
          <h1>Hello World</h1>
        )}/>

        <Route path="/vr" render={(routerProps) => <VR {...routerProps} />}/>

        <Route path="/multTableMod12" render={MultTableMod12}/>

        <Route path="/numpadMod12" render={() => <NumpadMod12/>}/>

        <Route path="/tonnetz" render={Tonnetz}/>

        <Route path="/guitar" render={Guitar}/>

        <AppBar
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
              <MenuItem disabled >2D</MenuItem>
              {[
                ['Numpad', '/numpadMod12'],
                ['Mod 12 Multiplication Tables', '/multTableMod12'],
                ['Tonnetz', '/tonnetz'],
                ['Guitar', '/guitar'],
              ].map(([title, url], idx) => (
                <MenuItem key={idx}>
                  <Link style={{ color: 'pink'}} onClick={handleMenuClose} to={url}>{title}</Link>
                </MenuItem>
              ))}
              <MenuItem divider />
              <MenuItem disabled >VR</MenuItem>
              {[
                ['Coltrane Circle', '/vr/coltrane'],
                ['Dod', '/vr/dod'],
              ].map(([title, url], idx) => (
                <MenuItem key={idx}>
                  <Link style={{ color: 'cyan'}} onClick={handleMenuClose} to={url}>{title}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
      </Router>
    </ThemeProvider>
  );
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));


const osc = new OSC();
osc.open();
window.osc = osc;
window.sendOsc = (address, ...args) => osc.send(new OSC.Message(address, ...args));
