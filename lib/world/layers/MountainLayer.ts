import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface MountainProfile {
  points: { nx: number; ny: number }[];
  parallaxFactor: number;
}

export class MountainLayer implements WorldLayer {
  id = 'mountains';

  private farProfile: MountainProfile;
  private midProfile: MountainProfile;
  private nearProfile: MountainProfile;

  constructor() {
    this.farProfile = this.generateProfile(101, 0.44, 0.54, 18, 0.08);
    this.midProfile = this.generateProfile(202, 0.50, 0.60, 16, 0.15);
    this.nearProfile = this.generateProfile(303, 0.56, 0.66, 14, 0.22);
  }

  private generateProfile(
    seed: number,
    minY: number,
    maxY: number,
    segments: number,
    parallax: number
  ): MountainProfile {
    const prng = createPRNG(seed);
    const points: { nx: number; ny: number }[] = [];

    // Start slightly off-canvas on the left
    points.push({ nx: -0.1, ny: randomRange(prng, minY + 0.04, maxY) });

    for (let i = 0; i <= segments; i++) {
      const nx = i / segments;
      // create natural rolling peaks with higher peaks in center-right
      const wave = Math.sin(nx * Math.PI) * 0.05;
      const ny = randomRange(prng, minY - wave, maxY - wave);
      points.push({ nx, ny });
    }

    // End slightly off-canvas on the right
    points.push({ nx: 1.1, ny: randomRange(prng, minY + 0.04, maxY) });

    return { points, parallaxFactor: parallax };
  }

  private drawMountain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    profile: MountainProfile,
    fillColor: string,
    parallaxOffsetX: number
  ) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();

    const pts = profile.points;
    const startX = pts[0].nx * width + parallaxOffsetX;
    const startY = pts[0].ny * height;
    ctx.moveTo(startX, startY);

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];

      const x0 = p0.nx * width + parallaxOffsetX;
      const y0 = p0.ny * height;
      const x1 = p1.nx * width + parallaxOffsetX;
      const y1 = p1.ny * height;

      // Smooth curve through midpoints
      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;

      ctx.quadraticCurveTo(x0, y0, midX, midY);
    }

    const last = pts[pts.length - 1];
    ctx.lineTo(last.nx * width + parallaxOffsetX, last.ny * height);
    ctx.lineTo(width + 50, height);
    ctx.lineTo(-50, height);
    ctx.closePath();
    ctx.fill();
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition, pointer, reducedMotion } = rc;

    const farColor = lerpColor(DAY_PALETTE.mountainFar, NIGHT_PALETTE.mountainFar, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.mountainMid, NIGHT_PALETTE.mountainMid, themeTransition);
    const nearColor = lerpColor(DAY_PALETTE.mountainNear, NIGHT_PALETTE.mountainNear, themeTransition);

    const pX = !reducedMotion && pointer.active ? pointer.x : 0;

    // 1. Far mountain range
    this.drawMountain(ctx, width, height, this.farProfile, farColor, pX * this.farProfile.parallaxFactor * 20);

    // 2. Mid mountain range
    this.drawMountain(ctx, width, height, this.midProfile, midColor, pX * this.midProfile.parallaxFactor * 25);

    // 3. Near mountain range
    this.drawMountain(ctx, width, height, this.nearProfile, nearColor, pX * this.nearProfile.parallaxFactor * 30);
  }
}
