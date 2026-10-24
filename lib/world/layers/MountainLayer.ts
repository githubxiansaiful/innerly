import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface MountainRidge {
  points: { nx: number; ny: number }[];
  parallax: number;
}

export class MountainLayer implements WorldLayer {
  id = 'mountains';

  private farRidge: MountainRidge;
  private midRidge: MountainRidge;

  constructor() {
    this.farRidge = this.generateCrystallineRidge(123, 0.28, 0.42, 28, 0.08);
    this.midRidge = this.generateCrystallineRidge(456, 0.35, 0.48, 24, 0.14);
  }

  // Generates angular, faceted crystalline mountain peaks like in Screenshot_2.png
  private generateCrystallineRidge(
    seed: number,
    minY: number,
    maxY: number,
    segments: number,
    parallax: number
  ): MountainRidge {
    const prng = createPRNG(seed);
    const points: { nx: number; ny: number }[] = [];

    points.push({ nx: -0.1, ny: maxY });

    for (let i = 0; i <= segments; i++) {
      const nx = i / segments;
      // Alternate between sharp peaks and valleys
      const isPeak = i % 2 === 1;
      const ny = isPeak
        ? randomRange(prng, minY, minY + (maxY - minY) * 0.45)
        : randomRange(prng, minY + (maxY - minY) * 0.55, maxY);
      points.push({ nx, ny });
    }

    points.push({ nx: 1.1, ny: maxY });

    return { points, parallax };
  }

  private drawRidge(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    ridge: MountainRidge,
    fillColor: string,
    parallaxX: number
  ) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();

    const pts = ridge.points;
    const startX = pts[0].nx * width + parallaxX;
    const startY = pts[0].ny * height;
    ctx.moveTo(startX, startY);

    for (let i = 1; i < pts.length; i++) {
      const px = pts[i].nx * width + parallaxX;
      const py = pts[i].ny * height;
      ctx.lineTo(px, py);
    }

    ctx.lineTo(width + 50, height);
    ctx.lineTo(-50, height);
    ctx.closePath();
    ctx.fill();
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition, pointer, reducedMotion } = rc;

    // Soften mountains in night mode to let the amber horizon mist shine (from Screenshot_1)
    const mountainAlpha = 1 - themeTransition * 0.75;
    if (mountainAlpha <= 0.02) return;

    ctx.save();
    ctx.globalAlpha = mountainAlpha;

    const farColor = lerpColor(DAY_PALETTE.mountainFar, NIGHT_PALETTE.mountainFar, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.mountainMid, NIGHT_PALETTE.mountainMid, themeTransition);

    const pX = !reducedMotion && pointer.active ? pointer.x : 0;

    // 1. Far mountain range (crystalline peaks)
    this.drawRidge(ctx, width, height, this.farRidge, farColor, pX * this.farRidge.parallax * 20);

    // 2. Mid mountain range
    this.drawRidge(ctx, width, height, this.midRidge, midColor, pX * this.midRidge.parallax * 25);

    // 3. Valley atmospheric haze strip at foot of mountains (seen in Screenshot_2.png)
    const hazeColor = lerpColor(DAY_PALETTE.mountainHaze, NIGHT_PALETTE.mountainHaze, themeTransition);
    const hazeGrad = ctx.createLinearGradient(0, height * 0.40, 0, height * 0.55);
    hazeGrad.addColorStop(0, 'rgba(215, 225, 235, 0)');
    hazeGrad.addColorStop(0.6, hazeColor);
    hazeGrad.addColorStop(1, 'rgba(215, 225, 235, 0)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, height * 0.40, width, height * 0.15);

    ctx.restore();
  }
}
