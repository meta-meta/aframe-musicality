import OSC from 'osc-js';
import Banjo from './banjo';
import ColtraneCircle from './coltraneCircle';
import Dod from './dod';
import Guitar from './guitar';
import Mandelbrot from './mandelbrot';
import Mandolin from './mandolin';
import MultTableMod12 from './multTableMod12';
import NumpadMod12 from './numpadMod12';
import PitchClassCollections from './pitchClassCollections';
import PitchClassSpiral from './pitchClassSpiral';
import RatioLightship from './ratioLightship';
import Staff from './staff';
import Tonnetz from './tonnetz';
import Ukulele from './ukulele';

export const routes2d = [
  ['Mandelbrot Muse', '/mandelbrot', Mandelbrot],
  ['Mod12 Multiplication Tables', '/multTableMod12', MultTableMod12],
  ['OSC Dataviz', '/osc', OSC, true],
  ['PC Number Notepad', '/numpadMod12', NumpadMod12],
  ['PC Tonnetz', '/tonnetz', Tonnetz],
  ['Ratio Lightship', '/ratioLightship', RatioLightship],
  ['Staff', '/staff', Staff],
  ['Strings PCs - Banjo', '/banjo', Banjo],
  ['Strings PCs - Guitar', '/guitar', Guitar],
  ['Strings PCs - Mandolin', '/mandolin', Mandolin],
  ['Strings PCs - Ukulele', '/ukulele', Ukulele],
];

export const routesVr = [
  ['Coltrane Circle', '/vr/coltrane', ColtraneCircle],
  ['Dod', '/vr/dod', Dod],
  ['PitchClassCollections', '/vr/pitchClassCollections', PitchClassCollections],
  ['PitchClassSpiral', '/vr/pitchClassSpiral', PitchClassSpiral],
]
