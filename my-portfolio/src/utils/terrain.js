export const MTN_R = 130;
export const MTN_H = 92;

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

export function fbm(x, y, oct = 5) {
  let s = 0, a = 1, f = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x * f, y * f);
    n += a; a *= 0.5; f *= 2.02;
  }
  return s / n;
}

const PEAKS = [
  { x: 0,   z: 0,   h: 1.00, w: 60 },
  { x: -46, z: 30,  h: 0.62, w: 40 },
  { x: 38,  z: -26, h: 0.55, w: 38 },
];
const RIDGES = [
  { ax: 0.5, len: 0.95, w: 22, h: 0.85 },
  { ax: 2.6, len: 0.85, w: 20, h: 0.72 },
  { ax: 4.6, len: 0.85, w: 22, h: 0.68 },
];

function ridgeProfile(x, z) {
  let v = 0;
  for (const p of PEAKS) {
    const d = Math.hypot(x - p.x, z - p.z);
    v = Math.max(v, p.h * Math.exp(-Math.pow(d / p.w, 2)));
  }
  for (const r of RIDGES) {
    const along  =  x * Math.cos(r.ax) + z * Math.sin(r.ax);
    const across = -x * Math.sin(r.ax) + z * Math.cos(r.ax);
    if (along > 0) {
      const wob = Math.sin(along * 0.06) * 5 + (vnoise(along * 0.04, r.ax) * 2 - 1) * 8;
      const d = Math.abs(across - wob);
      const lenFall = Math.exp(-Math.pow(along / (MTN_R * r.len), 2) * 1.3);
      const widFall = Math.exp(-Math.pow(d / r.w, 2));
      v = Math.max(v, lenFall * widFall * r.h);
    }
  }
  return v;
}

function valleyDepth(x, z) {
  const u = Math.max(0, Math.min(1, (z + 30) / 160));
  if (u <= 0 || u >= 1) return 0;
  const spineX = u * (78 - 6) + 6 + Math.sin(u * Math.PI * 1.1) * 16;
  const d = Math.abs(x - spineX);
  const w = u * (20 - 7) + 7;
  return 0.7 * u * Math.exp(-Math.pow(d / w, 2));
}

export function heightAt(x, z) {
  const r = Math.hypot(x, z) / MTN_R;
  const outer = Math.pow(Math.max(0, 1 - r * 0.94), 1.6);
  const ridge = ridgeProfile(x, z);
  const macro = fbm(x * 0.013, z * 0.013, 4);
  const med   = fbm(x * 0.045 + 5, z * 0.045 + 9, 4);
  const fine  = fbm(x * 0.13 + 17, z * 0.13, 3);

  let h = outer * (0.78 * ridge + 0.20 * macro + 0.10 * med) + 0.04 * fine;
  h = Math.pow(h, 1.18) * MTN_H;
  h -= valleyDepth(x, z) * Math.min(h, 28);
  if (h < 0.4) h = 0.15 + 0.06 * Math.sin(x * 0.07 + z * 0.05);
  return h;
}
