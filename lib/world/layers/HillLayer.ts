import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface MeadowDot {
  nx: number;
  ny: number;
  r: number;
  colorType: 'white' | 'yellow' | 'orange' | 'tick';
}

export class HillLayer implements WorldLayer {
  id = 'hills';
  private meadowDots: MeadowDot[] = [];

  constructor() {
    this.initMeadowDots();
  }

  private initMeadowDots() {
    const prng = createPRNG(314);
    this.meadowDots = [];

    // Meadow dots & grass ticks from Screenshot_2.png
    for (let i = 0; i < 90; i++) {
      const rand = prng();
      let colorType: MeadowDot['colorType'] = 'white';
      if (rand < 0.45) colorType = 'tick';
      else if (rand < 0.70) colorType = 'white';
      else if (rand < 0.88) colorType = 'yellow';
      else colorType = 'orange';

      this.meadowDots.push({
        nx: prng(),
        ny: randomRange(prng, 0.52, 0.96),
        r: randomRange(prng, 1.2, 2.2),
        colorType,
      });
    }
  }

  // Hill profile curves
  static getFarHillY(xRatio: number, height: number): number {
    return height * (0.48 + 0.06 * Math.sin(xRatio * 2.8 + 0.3) + 0.02 * Math.cos(xRatio * 5.4));
  }

  static getMidHillY(xRatio: number, height: number): number {
    return height * (0.60 + 0.05 * Math.sin(xRatio * 2.1 + 2.4) + 0.025 * Math.cos(xRatio * 4.2));
  }

  static getNearHillY(xRatio: number, height: number): number {
    return height * (0.74 + 0.04 * Math.sin(xRatio * 1.8 + 4.1) + 0.015 * Math.sin(xRatio * 3.6));
  }

  private drawHill(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    getY: (xRatio: number, height: number) => number,
    parallaxOffsetX: number
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();

    const steps = 60;
    const stepSize = (width + 80) / steps;
    const startX = -40 + parallaxOffsetX;

    ctx.moveTo(startX, height);

    for (let i = 0; i <= steps; i++) {
      const screenX = startX + i * stepSize;
      const xRatio = (screenX - parallaxOffsetX) / width;
      const y = getY(xRatio, height);
      ctx.lineTo(screenX, y);
    }

    ctx.lineTo(width + 40 + parallaxOffsetX, height);
    ctx.closePath();
    ctx.fill();
  }

  // Stylized storybook tree seen in Screenshot_2.png
  private drawTree(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    themeTransition: number,
    pX: number
  ) {
    const treeX = width * 0.76 + pX * 18;
    const treeBaseY = HillLayer.getMidHillY(0.76, height) + height * 0.08;
    const treeHeight = height * 0.22;
    const trunkW = Math.max(7, width * 0.009);

    const trunkColor = lerpColor(DAY_PALETTE.treeTrunk, NIGHT_PALETTE.treeTrunk, themeTransition);
    const foliageDark = lerpColor(DAY_PALETTE.treeFoliageDark, NIGHT_PALETTE.treeFoliageDark, themeTransition);
    const foliageLight = lerpColor(DAY_PALETTE.treeFoliageLight, NIGHT_PALETTE.treeFoliageLight, themeTransition);
    const shadowColor = lerpColor(DAY_PALETTE.treeShadow, NIGHT_PALETTE.treeShadow, themeTransition);

    ctx.save();

    // 1. Oval Ground Shadow under Tree
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.ellipse(treeX + trunkW * 0.5, treeBaseY + 4, trunkW * 3.8, trunkW * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Trunk
    ctx.fillStyle = trunkColor;
    ctx.beginPath();
    ctx.rect(treeX - trunkW * 0.5, treeBaseY - treeHeight * 0.65, trunkW, treeHeight * 0.65);
    ctx.fill();

    // 3. Puffy Cloud-like Foliage Lobes (from Screenshot_2.png)
    const foliageCenterY = treeBaseY - treeHeight * 0.68;
    const lobeR = treeHeight * 0.26;

    // Darker foliage back lobes
    ctx.fillStyle = foliageDark;
    const lobesDark = [
      { dx: 0, dy: -lobeR * 0.6, r: lobeR * 0.95 },
      { dx: -lobeR * 0.7, dy: -lobeR * 0.1, r: lobeR * 0.85 },
      { dx: lobeR * 0.6, dy: -lobeR * 0.15, r: lobeR * 0.9 },
      { dx: -lobeR * 0.2, dy: lobeR * 0.35, r: lobeR * 0.8 },
      { dx: lobeR * 0.4, dy: lobeR * 0.4, r: lobeR * 0.75 },
    ];
    for (const l of lobesDark) {
      ctx.beginPath();
      ctx.arc(treeX + l.dx, foliageCenterY + l.dy, l.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lighter highlight foliage front lobes
    ctx.fillStyle = foliageLight;
    const lobesLight = [
      { dx: -lobeR * 0.2, dy: -lobeR * 0.4, r: lobeR * 0.65 },
      { dx: lobeR * 0.2, dy: -lobeR * 0.25, r: lobeR * 0.7 },
      { dx: -lobeR * 0.35, dy: lobeR * 0.05, r: lobeR * 0.6 },
    ];
    for (const l of lobesLight) {
      ctx.beginPath();
      ctx.arc(treeX + l.dx, foliageCenterY + l.dy, l.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition, pointer, reducedMotion } = rc;

    const farColor = lerpColor(DAY_PALETTE.hillFar, NIGHT_PALETTE.hillFar, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.hillMid, NIGHT_PALETTE.hillMid, themeTransition);
    const nearColor = lerpColor(DAY_PALETTE.hillNear, NIGHT_PALETTE.hillNear, themeTransition);

    const pX = !reducedMotion && pointer.active ? pointer.x : 0;

    // 1. Far rolling hill
    this.drawHill(ctx, width, height, farColor, HillLayer.getFarHillY, pX * 12);

    // 2. Mid rolling hill
    this.drawHill(ctx, width, height, midColor, HillLayer.getMidHillY, pX * 18);

    // 3. Draw Storybook Tree on the mid hill
    this.drawTree(ctx, width, height, themeTransition, pX);

    // 4. Near meadow hill
    this.drawHill(ctx, width, height, nearColor, HillLayer.getNearHillY, pX * 24);

    // 5. Meadow grass ticks & tiny wildflower dots (only in day or softly in night)
    const tickColor = lerpColor(DAY_PALETTE.grassTick, NIGHT_PALETTE.grassTick, themeTransition);

    for (const dot of this.meadowDots) {
      const x = dot.nx * width + pX * 20;
      const y = dot.ny * height;

      // Ensure dot is below the mid hill line
      if (y < HillLayer.getFarHillY(dot.nx, height)) continue;

      if (dot.colorType === 'tick') {
        // Vertical grass tick mark from Screenshot_2.png
        ctx.strokeStyle = tickColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - dot.r * 2.5);
        ctx.stroke();
      } else {
        // Colorful flower dots
        let col = '#FFFFFF';
        if (dot.colorType === 'yellow') col = '#FFD54F';
        if (dot.colorType === 'orange') col = '#FF8A65';

        const dotCol = lerpColor(col, 'rgba(255, 200, 100, 0.4)', themeTransition);
        ctx.fillStyle = dotCol;
        ctx.beginPath();
        ctx.arc(x, y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
