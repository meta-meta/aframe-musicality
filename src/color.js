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