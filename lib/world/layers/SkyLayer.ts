import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';

export class SkyLayer implements WorldLayer {
  id = 'sky';

  render(rc: RenderContext): void {
    const { ctx, width, height, themeTransition } = rc;

    // 1. Sky vertical gradient (Day from Screenshot_2.png, Night from Screenshot_1.png)
    const topColor = lerpColor(DAY_PALETTE.skyTop, NIGHT_PALETTE.skyTop, themeTransition);
    const midColor = lerpColor(DAY_PALETTE.skyMiddle, NIGHT_PALETTE.skyMiddle, themeTransition);
    const botColor = lerpColor(DAY_PALETTE.skyHorizon, NIGHT_PALETTE.skyHorizon, themeTransition);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, topColor);
    skyGrad.addColorStop(0.50, midColor);
    skyGrad.addColorStop(0.85, botColor);
    skyGrad.addColorStop(1, botColor);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Horizon warm underglow mist (signature night atmospheric glow from Screenshot_1.png)
    if (themeTransition > 0.05) {
      const mistColor = lerpColor(
        DAY_PALETTE.horizonMistGlow,
        NIGHT_PALETTE.horizonMistGlow,
        themeTransition
      );
      const mistY = height * 0.88;
      const mistGrad = ctx.createRadialGradient(
        width * 0.5,
        mistY,
        width * 0.05,
        width * 0.5,
        mistY,
        width * 0.75
      );
      mistGrad.addColorStop(0, mistColor);
      mistGrad.addColorStop(
        0.55,
        `rgba(215, 125, 45, ${0.30 * themeTransition})`
      );
      mistGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);

      // Low ground-level warm haze strip
      const groundHazeGrad = ctx.createLinearGradient(0, height * 0.72, 0, height);
      groundHazeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      groundHazeGrad.addColorStop(
        1,
        `rgba(195, 115, 45, ${0.38 * themeTransition})`
      );
      ctx.fillStyle = groundHazeGrad;
      ctx.fillRect(0, height * 0.72, width, height * 0.28);
    }
  }
}
