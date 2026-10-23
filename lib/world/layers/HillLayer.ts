import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';

export class HillLayer implements WorldLayer {
  id = 'hills';

  static getFarHillY(xRatio: number, height: number): number {
    return height * (0.64 + 0.05 * Math.sin(xRatio * 3.2 + 0.5) + 0.02 * Math.cos(xRatio * 6.0));
  }

  static getMidHillY(xRatio: number, height: number): number {
    return height * (0.73 + 0.06 * Math.sin(xRatio * 2.4 + 2.3) + 0.03 * Math.cos(xRatio * 4.6));
  }

  static getNearHillY(xRatio: number, height: number): number {
    return height * (0.82 + 0.06 * Math.sin(xRatio * 2.0 + 4.1) + 0.02 * Math.sin(xRatio * 3.8));
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
      if (i === 0) {
        ctx.lineTo(screenX, y);
      } else {
        ctx.lineTo(screenX, y);
      }
    }

    ctx.lineTo(width + 40 + parallaxOffsetX, height);
    ctx.closePath();
    ctx.fill();
  }

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition, pointer, reducedMotion } = rc;

    const farColor = lerpColor(DAY_PALETTE.hillFar, NIGHT_PALETTE.hillFar, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.hillMid, NIGHT_PALETTE.hillMid, themeTransition);
    const nearColor = lerpColor(DAY_PALETTE.hillNear, NIGHT_PALETTE.hillNear, themeTransition);

    const pX = !reducedMotion && pointer.active ? pointer.x : 0;

    // 1. Far rolling hill
    this.drawHill(ctx, width, height, farColor, HillLayer.getFarHillY, pX * 15);

    // 2. Mid rolling hill
    this.drawHill(ctx, width, height, midColor, HillLayer.getMidHillY, pX * 22);

    // 3. Near rolling hill
    this.drawHill(ctx, width, height, nearColor, HillLayer.getNearHillY, pX * 30);
  }
}
