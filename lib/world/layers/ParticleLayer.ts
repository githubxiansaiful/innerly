import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface FloatingParticle {
  nx: number;
  ny: number;
  baseRadius: number;
  type: 'warm' | 'cool' | 'dandelion';
  speedX: number;
  speedY: number;
  pulseSpeed: number;
  phase: number;
}

interface GroundBokeh {
  nx: number;
  ny: number;
  radius: number;
  opacity: number;
  speed: number;
  phase: number;
}

export class ParticleLayer implements WorldLayer {
  id = 'particles';
  private particles: FloatingParticle[] = [];
  private groundBokehs: GroundBokeh[] = [];

  constructor() {
    this.initParticles();
  }

  private initParticles() {
    const prng = createPRNG(555);
    this.particles = [];
    this.groundBokehs = [];

    // 1. Floating Airborne Particles (Dandelion fluffs in Day / Glowing Bokeh Orbs in Night)
    const count = 22;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        nx: prng(),
        ny: randomRange(prng, 0.40, 0.88),
        baseRadius: randomRange(prng, 3.5, 9.5),
        type: prng() > 0.5 ? 'cool' : 'warm',
        speedX: randomRange(prng, -0.005, 0.009),
        speedY: randomRange(prng, -0.010, 0.005),
        pulseSpeed: randomRange(prng, 1.2, 2.5),
        phase: randomRange(prng, 0, Math.PI * 2),
      });
    }

    // 2. Ground-level Floral Bokeh Discs (Warm out-of-focus golden circles at bottom in Night)
    const bokehCount = 28;
    for (let i = 0; i < bokehCount; i++) {
      this.groundBokehs.push({
        nx: prng(),
        ny: randomRange(prng, 0.86, 0.98),
        radius: randomRange(prng, 8, 22),
        opacity: randomRange(prng, 0.25, 0.65),
        speed: randomRange(prng, 0.8, 2.0),
        phase: randomRange(prng, 0, Math.PI * 2),
      });
    }
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, time, deltaTime, themeTransition, reducedMotion } = rc;

    // 1. Render Ground Bokeh Discs (Only visible in Night mode from Screenshot_1.png)
    if (themeTransition > 0.05) {
      for (const b of this.groundBokehs) {
        const x = b.nx * width;
        const pulse = reducedMotion ? 1 : 0.8 + 0.2 * Math.sin(time * b.speed + b.phase);
        const y = b.ny * height;
        const r = b.radius * pulse;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(255, 175, 60, ${b.opacity * themeTransition * pulse})`);
        grad.addColorStop(0.65, `rgba(240, 140, 40, ${b.opacity * 0.5 * themeTransition})`);
        grad.addColorStop(1, 'rgba(200, 100, 20, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Render Floating Airborne Particles
    const warmBokehColor = lerpColor(DAY_PALETTE.bokehWarm, NIGHT_PALETTE.bokehWarm, themeTransition);
    const coolBokehColor = lerpColor(DAY_PALETTE.bokehCool, NIGHT_PALETTE.bokehCool, themeTransition);

    for (const p of this.particles) {
      if (!reducedMotion) {
        p.nx += p.speedX * deltaTime;
        p.ny += p.speedY * deltaTime;

        if (p.nx < 0) p.nx += 1;
        if (p.nx > 1) p.nx -= 1;
        if (p.ny < 0.35) p.ny = 0.90;
        if (p.ny > 0.92) p.ny = 0.38;
      }

      const x = p.nx * width;
      const y = p.ny * height;

      const pulse = reducedMotion ? 1 : 0.75 + 0.25 * Math.sin(time * p.pulseSpeed + p.phase);
      const r = p.baseRadius * pulse;

      if (themeTransition < 0.3) {
        // DAYTIME: White Dandelion Fluff / Pollen (from Screenshot_2.png)
        const dayAlpha = (1 - themeTransition) * 0.75 * pulse;
        ctx.fillStyle = `rgba(255, 255, 255, ${dayAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.2, r * 0.35), 0, Math.PI * 2);
        ctx.fill();

        // Subtle outer white halo
        ctx.fillStyle = `rgba(255, 255, 255, ${dayAlpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // NIGHTTIME: Luminous Bokeh Orbs (from Screenshot_1.png)
        const glowR = r * 3.5;
        const isCool = p.type === 'cool';
        const activeColor = isCool ? coolBokehColor : warmBokehColor;

        // Outer soft glow halo
        const glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, glowR);
        glow.addColorStop(0, activeColor);
        glow.addColorStop(0.5, isCool ? 'rgba(160, 230, 210, 0.25)' : 'rgba(255, 190, 80, 0.25)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Bright translucent core
        ctx.fillStyle = isCool ? 'rgba(230, 255, 245, 0.85)' : 'rgba(255, 245, 200, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
