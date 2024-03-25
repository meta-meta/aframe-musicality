export function HSVtoHex(h, s, v) {
  function rgbToHex({ r, g, b }) {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s;
    v = h.v;
    h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: {
      r = v;
      g = t;
      b = p;
      break;
    }
    case 1: {
      r = q;
      g = v;
      b = p;
      break;
    }
    case 2: {
      r = p;
      g = v;
      b = t;
      break;
    }
    case 3: {
      r = p;
      g = q;
      b = v;
      break;
    }
    case 4: {
      r = t;
      g = p;
      b = v;
      break;
    }
    case 5: {
      r = v;
      g = p;
      b = q;
      break;
    }
  }
  return rgbToHex({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  });
}


let _hsluv;
export const hslToHex = (h, s, l) => {
  if (!window.Hsluv) return "#000";
  _hsluv = _hsluv || new window.Hsluv();
  _hsluv.hsluv_h = (h * 360 + 12.2) % 360;
  _hsluv.hsluv_s = s * 100;
  _hsluv.hsluv_l = l * 100;
  _hsluv.hsluvToHex();
  return _hsluv.hex;
};

export const hslToRgb = (h, s, l) => {
  if (!window.Hsluv) return "#000";
  _hsluv = _hsluv || new window.Hsluv();
  _hsluv.hsluv_h = (h * 360 + 12.2) % 360;
  _hsluv.hsluv_s = s * 100;
  _hsluv.hsluv_l = l * 100;
  _hsluv.hsluvToRgb();
  return [_hsluv.rgb_r * 255, _hsluv.rgb_g * 255, _hsluv.rgb_b * 255];
};

export const getNoteColorHsl = (n) => {

  const oct = ((n - 60) / 12);

  return [
    360 * (((n * 5) % 12) / 12),
    0.9 - (oct > 0 ? oct * .2 : 0),
    0.4 + oct * .1,
  ];
};

export const getNoteColorHex = (n, isHighlighted = false, isFaded = false) =>
  hslToHex(...getNoteColorHsl(n,isHighlighted,isFaded));
