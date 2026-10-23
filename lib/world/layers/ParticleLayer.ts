import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface Particle {
  xRatio: number;
  yRatio: number;
  vx: number;
  vy: number;
  radius: number;
  pulseSpeed: number;
  phase: number;
}

export class ParticleLayer implements WorldLayer {
  id = 'particles';
  private particles: Particle[] = [];
  private count = 28;

  constructor() {
    this.initParticles();
  }

  private initParticles() {
    const prng = createPRNG(1234);
    this.particles = [];

    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        xRatio: prng(),
        yRatio: randomRange(prng, 0.45, 0.95), // float around hills and flowers
        vx: randomRange(prng, -0.015, 0.025),
        vy: randomRange(prng, -0.02, 0.01),
        radius: randomRange(prng, 1.2, 2.5),
        pulseSpeed: randomRange(prng, 1.5, 3.2),
        phase: randomRange(prng, 0, Math.PI * 2),
      });
    }
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, time, deltaTime, themeTransition, reducedMotion } = rc;

    const baseColor = lerpColor(DAY_PALETTE.particleColor, NIGHT_PALETTE.particleColor, themeTransition);
    const glowColor = lerpColor(DAY_PALETTE.particleGlow, NIGHT_PALETTE.particleGlow, themeTransition);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update particle positions
      if (!reducedMotion) {
        p.xRatio += p.vx * deltaTime;
        p.yRatio += p.vy * deltaTime;

        // Wrap around horizontally
        if (p.xRatio < 0) p.xRatio += 1;
        if (p.xRatio > 1) p.xRatio -= 1;

        // Wrap around vertically within lower sky and hill region
        if (p.yRatio < 0.4) p.yRatio = 0.95;
        if (p.yRatio > 0.96) p.yRatio = 0.42;
      }

      const x = p.xRatio * width;
      const y = p.yRatio * height;

      const pulse = reducedMotion ? 1 : 0.65 + 0.35 * Math.sin(time * p.pulseSpeed + p.phase);
      const r = p.radius * pulse;

      // Outer glow
      const glowR = r * 3.5;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      glow.addColorStop(0, glowColor);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Core mote
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
