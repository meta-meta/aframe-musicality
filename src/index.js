// import 'aframe-animation-component';
import 'aframe';
import 'aframe-look-at-component';
import Banjo from './banjo';
import CssBaseline from '@material-ui/core/CssBaseline';
import Guitar from './guitar';
import Intro from './intro';
import MultTableMod12 from './multTableMod12';
import NumpadMod12 from './numpadMod12';
import OSC from './osc';
import React from 'react';
import ReactDOM from 'react-dom';
import Mandelbrot from './mandelbrot';
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
import {Menu as MenuIcon} from '@material-ui/icons';


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
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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

        <Route path="/vr" render={(routerProps) => <VR {...routerProps} />}/>

        {routes2d.map(([title, path, component], key) => (
          <Route {...{ component, key, path }} />
        ))}

        <AppBar
          color="transparent"
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
              <MenuItem >
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
