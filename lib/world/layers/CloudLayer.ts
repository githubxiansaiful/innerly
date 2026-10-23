import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface Cloud {
  baseX: number; // 0..1
  yRatio: number; // 0.35..0.65
  scale: number;
  speed: number;
  puffs: { dx: number; dy: number; rx: number; ry: number }[];
  opacity: number;
}

export class CloudLayer implements WorldLayer {
  id = 'clouds';
  private clouds: Cloud[] = [];

  constructor() {
    this.initClouds();
  }

  private initClouds() {
    const prng = createPRNG(777);
    const count = 5;
    this.clouds = [];

    for (let i = 0; i < count; i++) {
      const puffCount = 5;
      const puffs: { dx: number; dy: number; rx: number; ry: number }[] = [];

      for (let j = 0; j < puffCount; j++) {
        puffs.push({
          dx: (j - puffCount / 2) * 35 + randomRange(prng, -10, 10),
          dy: randomRange(prng, -12, 12),
          rx: randomRange(prng, 40, 75),
          ry: randomRange(prng, 18, 32),
        });
      }

      this.clouds.push({
        baseX: prng(),
        yRatio: randomRange(prng, 0.42, 0.62),
        scale: randomRange(prng, 0.8, 1.4),
        speed: randomRange(prng, 0.004, 0.009), // slow gentle drift
        puffs,
        opacity: randomRange(prng, 0.4, 0.7),
      });
    }
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, time, themeTransition, reducedMotion } = rc;
    const mistColor = lerpColor(DAY_PALETTE.cloudMist, NIGHT_PALETTE.cloudMist, themeTransition);

    for (const c of this.clouds) {
      // Calculate drifting x position wrapping smoothly across screen
      const drift = reducedMotion ? 0 : time * c.speed;
      const currentNormX = (c.baseX + drift) % 1.25 - 0.15; // wrap with slight offscreen margin
      const x = currentNormX * width;
      const y = c.yRatio * height;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(c.scale, c.scale);
      ctx.fillStyle = mistColor;

      for (const puff of c.puffs) {
        ctx.beginPath();
        ctx.ellipse(puff.dx, puff.dy, puff.rx, puff.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
