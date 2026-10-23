import { clamp, lerp } from './math';

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const colorCache = new Map<string, RGBA>();

export function parseColor(color: string): RGBA {
  const cached = colorCache.get(color);
  if (cached) return cached;

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  const hexMatch = color.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
  if (hexMatch) {
    r = parseInt(hexMatch[1], 16);
    g = parseInt(hexMatch[2], 16);
    b = parseInt(hexMatch[3], 16);
    if (hexMatch[4]) {
      a = parseInt(hexMatch[4], 16) / 255;
    }
  } else {
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
      if (rgbMatch[4] !== undefined) {
        a = parseFloat(rgbMatch[4]);
      }
    }
  }

  const result: RGBA = { r, g, b, a };
  colorCache.set(color, result);
  return result;
}

export function lerpColor(colorA: string, colorB: string, t: number): string {
  const cA = parseColor(colorA);
  const cB = parseColor(colorB);
  const clT = clamp(t, 0, 1);

  const r = Math.round(lerp(cA.r, cB.r, clT));
  const g = Math.round(lerp(cA.g, cB.g, clT));
  const b = Math.round(lerp(cA.b, cB.b, clT));
  const a = +(lerp(cA.a, cB.a, clT)).toFixed(3);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
