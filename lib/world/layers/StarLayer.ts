import { RenderContext, WorldLayer } from '../types';
import { createPRNG, randomRange } from '../random';

interface Star {
  nx: number;
  ny: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  isBright: boolean;
}

export class StarLayer implements WorldLayer {
  id = 'stars';
  private stars: Star[] = [];
  private count = 160;

  constructor() {
    this.initStars();
  }

  private initStars() {
    const prng = createPRNG(42);
    this.stars = [];
    for (let i = 0; i < this.count; i++) {
      const isBright = prng() < 0.12;
      this.stars.push({
        nx: prng(),
        ny: Math.pow(prng(), 1.6) * 0.72, // spread mostly across upper and mid sky
        radius: isBright ? randomRange(prng, 1.2, 1.8) : randomRange(prng, 0.5, 1.0),
        alpha: randomRange(prng, 0.4, 0.95),
        twinkleSpeed: randomRange(prng, 1.0, 3.0),
        phase: randomRange(prng, 0, Math.PI * 2),
        isBright,
      });
    }
  }

  render(rc: RenderContext): void {
    if (rc.themeTransition <= 0.02) return;

    const { ctx, width, height, time, themeTransition, reducedMotion, pointer } = rc;
    const globalAlpha = themeTransition;

    const parallaxX = !reducedMotion && pointer.active ? pointer.x * 6 : 0;
    const parallaxY = !reducedMotion && pointer.active ? pointer.y * 4 : 0;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const x = s.nx * width + parallaxX * (0.15 + s.ny * 0.25);
      const y = s.ny * height + parallaxY * (0.15 + s.ny * 0.25);

      const twinkle = reducedMotion ? 1 : 0.8 + 0.2 * Math.sin(time * s.twinkleSpeed + s.phase);
      const currentAlpha = s.alpha * twinkle * globalAlpha;

      if (currentAlpha <= 0.01) continue;

      if (s.isBright) {
        const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, s.radius * 3.5);
        haloGrad.addColorStop(0, `rgba(215, 235, 255, ${currentAlpha * 0.45})`);
        haloGrad.addColorStop(1, 'rgba(215, 235, 255, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(x, y, s.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(240, 246, 255, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(x, y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
