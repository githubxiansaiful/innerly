import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';
import { HillLayer } from './HillLayer';

interface GrassBlade {
  xRatio: number;
  hillType: 'mid' | 'near';
  height: number;
  tilt: number;
  phase: number;
  swaySpeed: number;
  width: number;
}

interface WildFlower {
  xRatio: number;
  hillType: 'mid' | 'near';
  size: number;
  colorDay: string;
  colorNight: string;
}

export class GrassLayer implements WorldLayer {
  id = 'grass';
  private blades: GrassBlade[] = [];
  private wildFlowers: WildFlower[] = [];

  constructor() {
    this.initGrass();
  }

  private initGrass() {
    const prng = createPRNG(909);
    this.blades = [];
    this.wildFlowers = [];

    // Mid hill grass
    const midCount = 55;
    for (let i = 0; i < midCount; i++) {
      this.blades.push({
        xRatio: (i + randomRange(prng, -0.3, 0.3)) / midCount,
        hillType: 'mid',
        height: randomRange(prng, 14, 26),
        tilt: randomRange(prng, -0.25, 0.25),
        phase: randomRange(prng, 0, Math.PI * 2),
        swaySpeed: randomRange(prng, 1.8, 3.2),
        width: randomRange(prng, 2, 3.5),
      });
    }

    // Near hill grass (taller, more pronounced)
    const nearCount = 70;
    for (let i = 0; i < nearCount; i++) {
      this.blades.push({
        xRatio: (i + randomRange(prng, -0.3, 0.3)) / nearCount,
        hillType: 'near',
        height: randomRange(prng, 22, 42),
        tilt: randomRange(prng, -0.3, 0.3),
        phase: randomRange(prng, 0, Math.PI * 2),
        swaySpeed: randomRange(prng, 1.6, 2.8),
        width: randomRange(prng, 2.5, 4.5),
      });
    }

    // Scatter tiny wild meadow flowers
    const flowerCount = 28;
    for (let i = 0; i < flowerCount; i++) {
      const isWhite = prng() > 0.4;
      this.wildFlowers.push({
        xRatio: prng(),
        hillType: prng() > 0.5 ? 'near' : 'mid',
        size: randomRange(prng, 3, 5),
        colorDay: isWhite ? '#FFFFFF' : '#FFE57F',
        colorNight: isWhite ? 'rgba(210, 230, 255, 0.7)' : 'rgba(230, 180, 80, 0.7)',
      });
    }
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, time, themeTransition, reducedMotion, pointer } = rc;

    const baseColor = lerpColor(DAY_PALETTE.grassBase, NIGHT_PALETTE.grassBase, themeTransition);
    const tipColor = lerpColor(DAY_PALETTE.grassTip, NIGHT_PALETTE.grassTip, themeTransition);
    const pX = !reducedMotion && pointer.active ? pointer.x : 0;

    // Draw grass blades
    ctx.lineCap = 'round';

    for (let i = 0; i < this.blades.length; i++) {
      const b = this.blades[i];
      const parallax = (b.hillType === 'near' ? 30 : 22) * pX;
      const x = b.xRatio * width + parallax;
      const baseY =
        b.hillType === 'near'
          ? HillLayer.getNearHillY(b.xRatio, height)
          : HillLayer.getMidHillY(b.xRatio, height);

      const sway = reducedMotion ? 0 : Math.sin(time * b.swaySpeed + b.phase) * (b.height * 0.28);
      const tipX = x + b.tilt * b.height + sway;
      const tipY = baseY - b.height;
      const ctrlX = x + (b.tilt * b.height) * 0.5 + sway * 0.4;
      const ctrlY = baseY - b.height * 0.5;

      const grad = ctx.createLinearGradient(x, baseY, tipX, tipY);
      grad.addColorStop(0, baseColor);
      grad.addColorStop(1, tipColor);

      ctx.strokeStyle = grad;
      ctx.lineWidth = b.width;
      ctx.beginPath();
      ctx.moveTo(x, baseY + 2);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      ctx.stroke();
    }

    // Draw tiny wildflowers
    for (let i = 0; i < this.wildFlowers.length; i++) {
      const wf = this.wildFlowers[i];
      const parallax = (wf.hillType === 'near' ? 30 : 22) * pX;
      const x = wf.xRatio * width + parallax;
      const baseY =
        wf.hillType === 'near'
          ? HillLayer.getNearHillY(wf.xRatio, height)
          : HillLayer.getMidHillY(wf.xRatio, height);
      const y = baseY - wf.size * 1.5;

      const col = lerpColor(wf.colorDay, wf.colorNight, themeTransition);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, wf.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
