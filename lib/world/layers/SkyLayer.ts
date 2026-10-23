import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';

export class SkyLayer implements WorldLayer {
  id = 'sky';

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition } = rc;

    // 1. Sky vertical gradient
    const topColor = lerpColor(DAY_PALETTE.skyTop, NIGHT_PALETTE.skyTop, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.skyMiddle, NIGHT_PALETTE.skyMiddle, themeTransition);
    const botColor = lerpColor(DAY_PALETTE.skyBottom, NIGHT_PALETTE.skyBottom, themeTransition);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, topColor);
    skyGrad.addColorStop(0.55, midColor);
    skyGrad.addColorStop(1, botColor);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Sun or Moon celestial ambient glow
    // Day sun: warm radial glow in the upper sky
    const sunGlowColor = lerpColor(DAY_PALETTE.sunOrMoonGlow, NIGHT_PALETTE.sunOrMoonGlow, themeTransition);
    const sunX = width * 0.7;
    const sunY = height * 0.22;
    const sunRadius = Math.max(width, height) * 0.35;

    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
    sunGrad.addColorStop(0, sunGlowColor);
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Horizon atmospheric warmth/glow
    const horizonGlowColor = lerpColor(DAY_PALETTE.horizonGlow, NIGHT_PALETTE.horizonGlow, themeTransition);
    const horizonY = height * 0.65;
    const horizonGrad = ctx.createRadialGradient(width * 0.5, horizonY, 20, width * 0.5, horizonY, width * 0.7);
    horizonGrad.addColorStop(0, horizonGlowColor);
    horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, 0, width, height);
  }
}
