import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';
import { HillLayer } from './HillLayer';

interface Leaf {
  side: 1 | -1; // left or right
  relativeHeight: number; // 0..1 along stem
  length: number;
  angle: number;
}

interface Sunflower {
  xRatio: number;
  hillType: 'mid' | 'near' | 'foreground';
  customBaseYRatio?: number;
  stemHeight: number;
  headRadius: number;
  petalCount: number;
  baseTilt: number;
  swaySpeed: number;
  phase: number;
  leaves: Leaf[];
  depthTier: 'bg' | 'fg';
}

export class FlowerLayer implements WorldLayer {
  id = 'flowers';
  private flowers: Sunflower[] = [];

  constructor() {
    this.initFlowers();
  }

  private initFlowers() {
    const prng = createPRNG(456);
    this.flowers = [];

    // Midground sunflowers (sprinkled along the hills)
    const midCount = 14;
    for (let i = 0; i < midCount; i++) {
      const xRatio = (i + randomRange(prng, 0.1, 0.9)) / midCount;
      this.flowers.push({
        xRatio,
        hillType: 'mid',
        stemHeight: randomRange(prng, 40, 75),
        headRadius: randomRange(prng, 10, 16),
        petalCount: 14,
        baseTilt: randomRange(prng, -0.15, 0.15),
        swaySpeed: randomRange(prng, 1.2, 2.2),
        phase: randomRange(prng, 0, Math.PI * 2),
        leaves: [
          { side: prng() > 0.5 ? 1 : -1, relativeHeight: 0.45, length: 18, angle: 0.5 },
        ],
        depthTier: 'bg',
      });
    }

    // Near-ground sunflowers
    const nearCount = 10;
    for (let i = 0; i < nearCount; i++) {
      const xRatio = (i + randomRange(prng, 0.1, 0.9)) / nearCount;
      this.flowers.push({
        xRatio,
        hillType: 'near',
        stemHeight: randomRange(prng, 70, 115),
        headRadius: randomRange(prng, 16, 24),
        petalCount: 16,
        baseTilt: randomRange(prng, -0.2, 0.2),
        swaySpeed: randomRange(prng, 1.0, 1.8),
        phase: randomRange(prng, 0, Math.PI * 2),
        leaves: [
          { side: -1, relativeHeight: 0.35, length: 28, angle: 0.55 },
          { side: 1, relativeHeight: 0.65, length: 32, angle: 0.5 },
        ],
        depthTier: 'bg',
      });
    }

    // Prominent foreground sunflowers (artfully framed on the left & right sides)
    const fgLayouts = [
      { xRatio: 0.08, stem: 160, radius: 36, tilt: 0.12, leavesCount: 3 },
      { xRatio: 0.18, stem: 135, radius: 30, tilt: -0.08, leavesCount: 2 },
      { xRatio: 0.26, stem: 110, radius: 26, tilt: 0.1, leavesCount: 2 },
      { xRatio: 0.74, stem: 120, radius: 28, tilt: -0.12, leavesCount: 2 },
      { xRatio: 0.84, stem: 150, radius: 34, tilt: -0.15, leavesCount: 3 },
      { xRatio: 0.93, stem: 175, radius: 40, tilt: -0.22, leavesCount: 3 },
    ];

    for (const fg of fgLayouts) {
      const leaves: Leaf[] = [];
      for (let j = 0; j < fg.leavesCount; j++) {
        leaves.push({
          side: j % 2 === 0 ? 1 : -1,
          relativeHeight: 0.25 + j * 0.25,
          length: randomRange(prng, 35, 55),
          angle: randomRange(prng, 0.45, 0.65),
        });
      }

      this.flowers.push({
        xRatio: fg.xRatio,
        hillType: 'foreground',
        customBaseYRatio: 0.98,
        stemHeight: fg.stem,
        headRadius: fg.radius,
        petalCount: 20,
        baseTilt: fg.tilt,
        swaySpeed: randomRange(prng, 0.9, 1.4),
        phase: randomRange(prng, 0, Math.PI * 2),
        leaves,
        depthTier: 'fg',
      });
    }
  }

  private drawSunflower(
    ctx: CanvasRenderingContext2D,
    f: Sunflower,
    rc: RenderContext,
    stemColor: string,
    leafColor: string,
    outerPetalColor: string,
    innerPetalColor: string,
    centerDarkColor: string,
    centerRingColor: string,
    centerLightColor: string,
    glowColor: string
  ) {
    const { width, height, time, reducedMotion, pointer, themeTransition } = rc;

    // Parallax
    const pX = !reducedMotion && pointer.active ? pointer.x : 0;
    const parallaxWeight = f.depthTier === 'fg' ? 36 : f.hillType === 'near' ? 26 : 18;
    const baseX = f.xRatio * width + pX * parallaxWeight;

    let baseY: number;
    if (f.customBaseYRatio) {
      baseY = height * f.customBaseYRatio;
    } else if (f.hillType === 'near') {
      baseY = HillLayer.getNearHillY(f.xRatio, height) + 8;
    } else {
      baseY = HillLayer.getMidHillY(f.xRatio, height) + 6;
    }

    // Gentle wind sway
    const swayAmount = reducedMotion ? 0 : Math.sin(time * f.swaySpeed + f.phase) * (f.stemHeight * 0.12);
    const headX = baseX + f.baseTilt * f.stemHeight + swayAmount;
    const headY = baseY - f.stemHeight;

    const ctrlX = baseX + (headX - baseX) * 0.35 - swayAmount * 0.2;
    const ctrlY = baseY - f.stemHeight * 0.55;

    // 1. Draw Stem
    ctx.strokeStyle = stemColor;
    ctx.lineWidth = f.headRadius * 0.22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
    ctx.stroke();

    // 2. Draw Leaves
    for (const leaf of f.leaves) {
      const t = leaf.relativeHeight;
      // Point along quadratic bezier
      const lx = (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * ctrlX + t * t * headX;
      const ly = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * ctrlY + t * t * headY;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(leaf.side * leaf.angle + (reducedMotion ? 0 : Math.sin(time * f.swaySpeed + f.phase) * 0.08));

      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.length * 0.5, -leaf.length * 0.35, leaf.length, 0);
      ctx.quadraticCurveTo(leaf.length * 0.5, leaf.length * 0.35, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    // 3. Night Lantern Glow around head
    if (themeTransition > 0.05) {
      const glowR = f.headRadius * 3.4;
      const glowGrad = ctx.createRadialGradient(headX, headY, f.headRadius * 0.4, headX, headY, glowR);
      glowGrad.addColorStop(0, glowColor);
      glowGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, glowR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Sunflower Head
    ctx.save();
    ctx.translate(headX, headY);
    // Face the sky slightly
    const headTilt = f.baseTilt * 0.8 + (reducedMotion ? 0 : Math.sin(time * f.swaySpeed + f.phase) * 0.1);
    ctx.rotate(headTilt);

    // Draw Outer Petals
    const r = f.headRadius;
    const petalLen = r * 1.5;
    const petalW = (r * Math.PI) / f.petalCount;

    ctx.fillStyle = outerPetalColor;
    for (let i = 0; i < f.petalCount; i++) {
      const angle = (i * Math.PI * 2) / f.petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.7);
      ctx.quadraticCurveTo(petalW * 0.8, r * 1.2, 0, r + petalLen);
      ctx.quadraticCurveTo(-petalW * 0.8, r * 1.2, 0, r * 0.7);
      ctx.fill();
      ctx.restore();
    }

    // Draw Inner Petals (offset for lush density)
    ctx.fillStyle = innerPetalColor;
    for (let i = 0; i < f.petalCount; i++) {
      const angle = ((i + 0.5) * Math.PI * 2) / f.petalCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.65);
      ctx.quadraticCurveTo(petalW * 0.7, r * 1.05, 0, r + petalLen * 0.85);
      ctx.quadraticCurveTo(-petalW * 0.7, r * 1.05, 0, r * 0.65);
      ctx.fill();
      ctx.restore();
    }

    // 5. Center Disc (Dark floret seed center with textured rings)
    // Outer rim of floret
    ctx.fillStyle = centerRingColor;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Dark core
    ctx.fillStyle = centerDarkColor;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
    ctx.fill();

    // Subtle seed highlight ring
    ctx.strokeStyle = centerLightColor;
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  render(rc: RenderContext): void {
    const { ctx, themeTransition } = rc;

    const stemColor = lerpColor(DAY_PALETTE.flowerStem, NIGHT_PALETTE.flowerStem, themeTransition);
    const leafColor = lerpColor(DAY_PALETTE.flowerLeaf, NIGHT_PALETTE.flowerLeaf, themeTransition);

    const outerPetal = lerpColor(DAY_PALETTE.sunflowerPetalOuter, NIGHT_PALETTE.sunflowerPetalOuter, themeTransition);
    const innerPetal = lerpColor(DAY_PALETTE.sunflowerPetalInner, NIGHT_PALETTE.sunflowerPetalInner, themeTransition);

    const centerDark = lerpColor(DAY_PALETTE.sunflowerCenterDark, NIGHT_PALETTE.sunflowerCenterDark, themeTransition);
    const centerRing = lerpColor(DAY_PALETTE.sunflowerCenterRing, NIGHT_PALETTE.sunflowerCenterRing, themeTransition);
    const centerLight = lerpColor(DAY_PALETTE.sunflowerCenterLight, NIGHT_PALETTE.sunflowerCenterLight, themeTransition);

    const glow = lerpColor(DAY_PALETTE.sunflowerGlow, NIGHT_PALETTE.sunflowerGlow, themeTransition);

    // Render background flowers first, foreground flowers on top
    const bgFlowers = this.flowers.filter((f) => f.depthTier === 'bg');
    const fgFlowers = this.flowers.filter((f) => f.depthTier === 'fg');

    for (const f of bgFlowers) {
      this.drawSunflower(
        ctx,
        f,
        rc,
        stemColor,
        leafColor,
        outerPetal,
        innerPetal,
        centerDark,
        centerRing,
        centerLight,
        glow
      );
    }

    for (const f of fgFlowers) {
      this.drawSunflower(
        ctx,
        f,
        rc,
        stemColor,
        leafColor,
        outerPetal,
        innerPetal,
        centerDark,
        centerRing,
        centerLight,
        glow
      );
    }
  }
}
