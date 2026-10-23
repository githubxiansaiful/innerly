import { RenderContext, WorldLayer } from '../types';
import { createPRNG, randomRange } from '../random';

interface Star {
  nx: number; // 0..1
  ny: number; // 0..0.7 (stars mostly in upper sky)
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  isBright: boolean;
}

export class StarLayer implements WorldLayer {
  id = 'stars';
  private stars: Star[] = [];
  private count = 120;

  constructor() {
    this.initStars();
  }

  private initStars() {
    const prng = createPRNG(42);
    this.stars = [];
    for (let i = 0; i < this.count; i++) {
      const isBright = prng() < 0.15;
      this.stars.push({
        nx: prng(),
        ny: Math.pow(prng(), 1.4) * 0.65, // distribute more near the top
        radius: isBright ? randomRange(prng, 1.4, 2.2) : randomRange(prng, 0.6, 1.3),
        alpha: randomRange(prng, 0.5, 0.95),
        twinkleSpeed: randomRange(prng, 1.2, 3.5),
        phase: randomRange(prng, 0, Math.PI * 2),
        isBright,
      });
    }
  }

  render(rc: RenderContext): void {
    // Only render when night or transitioning into night
    if (rc.themeTransition <= 0.02) return;

    const { ctx, width, height, time, themeTransition, reducedMotion, pointer } = rc;
    const globalAlpha = themeTransition;

    const parallaxX = !reducedMotion && pointer.active ? pointer.x * 6 : 0;
    const parallaxY = !reducedMotion && pointer.active ? pointer.y * 4 : 0;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const x = s.nx * width + parallaxX * (0.2 + s.ny * 0.3);
      const y = s.ny * height + parallaxY * (0.2 + s.ny * 0.3);

      const twinkle = reducedMotion ? 1 : 0.75 + 0.25 * Math.sin(time * s.twinkleSpeed + s.phase);
      const currentAlpha = s.alpha * twinkle * globalAlpha;

      if (currentAlpha <= 0.01) continue;

      if (s.isBright) {
        // Bright star subtle outer halo
        const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, s.radius * 3.5);
        haloGrad.addColorStop(0, `rgba(200, 225, 255, ${currentAlpha * 0.5})`);
        haloGrad.addColorStop(1, 'rgba(200, 225, 255, 0)');
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
