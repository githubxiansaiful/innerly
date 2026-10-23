/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Ensures consistent procedural landscape generation across renders and resizes.
 */

export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomRange(prng: () => number, min: number, max: number): number {
  return min + prng() * (max - min);
}

export function randomInt(prng: () => number, min: number, max: number): number {
  return Math.floor(randomRange(prng, min, max + 1));
}
