import { RenderContext, WorldLayer } from '../types';
import { DAY_PALETTE, NIGHT_PALETTE } from '../constants';
import { lerpColor } from '../color';
import { createPRNG, randomRange } from '../random';

interface Leaf {
  side: 1 | -1;
  relativeHeight: number;
  length: number;
  width: number;
  angle: number;
}

interface Sunflower {
  xRatio: number;
  headYRatio: number;
  headRadius: number;
  petalCount: number;
  swaySpeed: number;
  phase: number;
  leaves: Leaf[];
  depthTier: 'bokeh-fg' | 'hero' | 'mid' | 'bg';
  isLantern?: boolean;
}

export class FlowerLayer implements WorldLayer {
  id = 'flowers';
  private flowers: Sunflower[] = [];

  constructor() {
    this.initFlowers();
  }

  private initFlowers() {
    const prng = createPRNG(888);
    this.flowers = [];

    // 1. Extreme Foreground Blurred Sunflower (Bottom-Left from Screenshot_1.png)
    this.flowers.push({
      xRatio: 0.025,
      headYRatio: 0.77,
      headRadius: 44,
      petalCount: 22,
      swaySpeed: 0.8,
      phase: 0.2,
      leaves: [
        { side: 1, relativeHeight: 0.45, length: 50, width: 25, angle: 0.4 },
        { side: -1, relativeHeight: 0.65, length: 58, width: 28, angle: 0.45 },
      ],
      depthTier: 'bokeh-fg',
    });

    // 2. The Iconic Hero Trio (Seen in Screenshot_2.png and on left of Screenshot_1.png)
    // Tall Left Sunflower
    this.flowers.push({
      xRatio: 0.068,
      headYRatio: 0.565,
      headRadius: 26,
      petalCount: 20,
      swaySpeed: 1.0,
      phase: 0.4,
      leaves: [
        { side: -1, relativeHeight: 0.35, length: 28, width: 14, angle: 0.45 },
        { side: 1, relativeHeight: 0.52, length: 32, width: 16, angle: 0.4 },
        { side: -1, relativeHeight: 0.72, length: 30, width: 15, angle: 0.45 },
      ],
      depthTier: 'hero',
    });

    // Tall Middle-Left Sunflower
    this.flowers.push({
      xRatio: 0.162,
      headYRatio: 0.59,
      headRadius: 27,
      petalCount: 20,
      swaySpeed: 1.05,
      phase: 1.2,
      leaves: [
        { side: 1, relativeHeight: 0.38, length: 28, width: 14, angle: 0.4 },
        { side: -1, relativeHeight: 0.55, length: 32, width: 16, angle: 0.45 },
        { side: 1, relativeHeight: 0.72, length: 30, width: 15, angle: 0.4 },
      ],
      depthTier: 'hero',
    });

    // Lower Mid-Left Sunflower (Lower in the trio from Screenshot_2.png)
    this.flowers.push({
      xRatio: 0.135,
      headYRatio: 0.70,
      headRadius: 23,
      petalCount: 18,
      swaySpeed: 1.2,
      phase: 2.1,
      leaves: [
        { side: -1, relativeHeight: 0.45, length: 26, width: 13, angle: 0.5 },
        { side: 1, relativeHeight: 0.68, length: 28, width: 14, angle: 0.45 },
      ],
      depthTier: 'hero',
    });

    // Companions on the left
    this.flowers.push({
      xRatio: 0.155,
      headYRatio: 0.69,
      headRadius: 18,
      petalCount: 16,
      swaySpeed: 1.3,
      phase: 3.2,
      leaves: [{ side: 1, relativeHeight: 0.55, length: 20, width: 10, angle: 0.5 }],
      depthTier: 'mid',
    });

    this.flowers.push({
      xRatio: 0.175,
      headYRatio: 0.82,
      headRadius: 14,
      petalCount: 15,
      swaySpeed: 1.4,
      phase: 0.8,
      leaves: [{ side: -1, relativeHeight: 0.5, length: 16, width: 8, angle: 0.5 }],
      depthTier: 'mid',
    });

    this.flowers.push({
      xRatio: 0.195,
      headYRatio: 0.84,
      headRadius: 15,
      petalCount: 15,
      swaySpeed: 1.35,
      phase: 1.8,
      leaves: [{ side: 1, relativeHeight: 0.5, length: 16, width: 8, angle: 0.5 }],
      depthTier: 'mid',
    });

    // 3. Right Hero Cluster (From Screenshot_1.png)
    // Tallest Right Hero
    this.flowers.push({
      xRatio: 0.842,
      headYRatio: 0.635,
      headRadius: 28,
      petalCount: 20,
      swaySpeed: 1.0,
      phase: 0.9,
      leaves: [
        { side: -1, relativeHeight: 0.32, length: 32, width: 16, angle: 0.45 },
        { side: 1, relativeHeight: 0.48, length: 34, width: 17, angle: 0.4 },
        { side: -1, relativeHeight: 0.68, length: 30, width: 15, angle: 0.45 },
        { side: 1, relativeHeight: 0.82, length: 26, width: 13, angle: 0.4 },
      ],
      depthTier: 'hero',
    });

    // Mid Right Companion
    this.flowers.push({
      xRatio: 0.878,
      headYRatio: 0.735,
      headRadius: 22,
      petalCount: 18,
      swaySpeed: 1.15,
      phase: 2.4,
      leaves: [
        { side: 1, relativeHeight: 0.42, length: 26, width: 13, angle: 0.45 },
        { side: -1, relativeHeight: 0.65, length: 28, width: 14, angle: 0.5 },
      ],
      depthTier: 'hero',
    });

    this.flowers.push({
      xRatio: 0.815,
      headYRatio: 0.81,
      headRadius: 16,
      petalCount: 15,
      swaySpeed: 1.3,
      phase: 1.5,
      leaves: [{ side: -1, relativeHeight: 0.55, length: 18, width: 9, angle: 0.5 }],
      depthTier: 'mid',
    });

    this.flowers.push({
      xRatio: 0.895,
      headYRatio: 0.80,
      headRadius: 16,
      petalCount: 15,
      swaySpeed: 1.25,
      phase: 2.8,
      leaves: [{ side: 1, relativeHeight: 0.55, length: 18, width: 9, angle: 0.5 }],
      depthTier: 'mid',
    });

    // 4. Midfield Sunflowers (Including the Lantern Flower from Screenshot_1.png)
    const midFieldSpecs = [
      { x: 0.245, y: 0.80, r: 15 },
      { x: 0.305, y: 0.84, r: 13 },
      { x: 0.385, y: 0.86, r: 12 },
      { x: 0.440, y: 0.85, r: 13 },
      { x: 0.470, y: 0.87, r: 14 },
      { x: 0.495, y: 0.795, r: 15 },
      { x: 0.520, y: 0.875, r: 14 },
      { x: 0.555, y: 0.818, r: 16, isLantern: true }, // Radiant Lantern Flower
      { x: 0.575, y: 0.88, r: 12 },
      { x: 0.605, y: 0.86, r: 13 },
      { x: 0.678, y: 0.795, r: 15 },
      { x: 0.695, y: 0.81, r: 15 },
      { x: 0.712, y: 0.865, r: 14 },
      { x: 0.745, y: 0.81, r: 15 },
      { x: 0.785, y: 0.85, r: 13 },
    ];

    for (const spec of midFieldSpecs) {
      this.flowers.push({
        xRatio: spec.x,
        headYRatio: spec.y,
        headRadius: spec.r,
        petalCount: 16,
        swaySpeed: randomRange(prng, 1.1, 1.6),
        phase: randomRange(prng, 0, Math.PI * 2),
        leaves: [
          { side: prng() > 0.5 ? 1 : -1, relativeHeight: 0.55, length: spec.r * 1.2, width: spec.r * 0.55, angle: 0.5 },
        ],
        depthTier: 'mid',
        isLantern: spec.isLantern,
      });
    }

    // 5. Background Field Sunflowers
    const bgCount = 30;
    for (let i = 0; i < bgCount; i++) {
      const xRatio = (i + randomRange(prng, 0.1, 0.9)) / bgCount;
      const headYRatio = randomRange(prng, 0.84, 0.94);
      const headRadius = randomRange(prng, 7, 11);

      this.flowers.push({
        xRatio,
        headYRatio,
        headRadius,
        petalCount: 13,
        swaySpeed: randomRange(prng, 1.2, 1.8),
        phase: randomRange(prng, 0, Math.PI * 2),
        leaves: [],
        depthTier: 'bg',
      });
    }
  }

  // Renders a high-fidelity sunflower head matching Screenshot_2.png & Screenshot_1.png
  private drawSunflowerHead(
    ctx: CanvasRenderingContext2D,
    f: Sunflower,
    r: number,
    outerPetalColor: string,
    innerPetalColor: string,
    creaseColor: string,
    centerDarkColor: string,
    centerRingColor: string,
    centerLightColor: string,
    isBlurred = false
  ) {
    const petalLen = r * 1.38;
    const petalW = (r * Math.PI) / f.petalCount;

    // 1. Outer Layer Petals (with pointed tip and center crease from Screenshot_2.png)
    ctx.fillStyle = outerPetalColor;
    for (let i = 0; i < f.petalCount; i++) {
      const angle = (i * Math.PI * 2) / f.petalCount;
      ctx.save();
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, r * 0.65);
      ctx.quadraticCurveTo(petalW * 0.85, r * 1.1, 0, r + petalLen);
      ctx.quadraticCurveTo(-petalW * 0.85, r * 1.1, 0, r * 0.65);
      ctx.fill();

      // Sharp center crease spine on each petal (from Screenshot_2.png)
      if (!isBlurred) {
        ctx.strokeStyle = creaseColor;
        ctx.lineWidth = Math.max(0.7, r * 0.04);
        ctx.beginPath();
        ctx.moveTo(0, r * 0.72);
        ctx.lineTo(0, r + petalLen * 0.92);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 2. Inner Layer Petals (interleaved for natural richness)
    ctx.fillStyle = innerPetalColor;
    for (let i = 0; i < f.petalCount; i++) {
      const angle = ((i + 0.5) * Math.PI * 2) / f.petalCount;
      ctx.save();
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, r * 0.6);
      ctx.quadraticCurveTo(petalW * 0.75, r * 0.95, 0, r + petalLen * 0.82);
      ctx.quadraticCurveTo(-petalW * 0.75, r * 0.95, 0, r * 0.6);
      ctx.fill();

      if (!isBlurred) {
        ctx.strokeStyle = creaseColor;
        ctx.lineWidth = Math.max(0.6, r * 0.035);
        ctx.beginPath();
        ctx.moveTo(0, r * 0.68);
        ctx.lineTo(0, r + petalLen * 0.76);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 3. Stippled Seed Ring (Seed florets around perimeter from Screenshot_2.png)
    if (!isBlurred && r >= 14) {
      const seedCount = f.petalCount * 2;
      ctx.fillStyle = centerRingColor;
      for (let s = 0; s < seedCount; s++) {
        const seedAngle = (s * Math.PI * 2) / seedCount;
        const sx = Math.cos(seedAngle) * (r * 0.82);
        const sy = Math.sin(seedAngle) * (r * 0.82);
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(1, r * 0.06), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Dark Center Disc Core (with 3D domed spherical shading)
    const discRadius = r * 0.74;
    const discGrad = ctx.createRadialGradient(
      -discRadius * 0.15,
      -discRadius * 0.15,
      discRadius * 0.1,
      0,
      0,
      discRadius
    );
    discGrad.addColorStop(0, centerLightColor);
    discGrad.addColorStop(0.55, centerRingColor);
    discGrad.addColorStop(1, centerDarkColor);

    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(0, 0, discRadius, 0, Math.PI * 2);
    ctx.fill();

    // 5. Fine inner textured floret ring
    if (!isBlurred && r >= 16) {
      ctx.strokeStyle = centerLightColor;
      ctx.lineWidth = Math.max(1, r * 0.07);
      ctx.beginPath();
      ctx.arc(0, 0, discRadius * 0.52, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawSingleFlower(
    ctx: CanvasRenderingContext2D,
    f: Sunflower,
    rc: RenderContext,
    stemHighlight: string,
    stemBase: string,
    stemShadow: string,
    stemCastShadow: string,
    leafColor: string,
    outerPetal: string,
    innerPetal: string,
    creaseColor: string,
    centerDark: string,
    centerRing: string,
    centerLight: string,
    lanternGlow: string
  ) {
    const { width, height, time, reducedMotion, pointer, themeTransition } = rc;

    const pX = !reducedMotion && pointer.active ? pointer.x : 0;
    const parallaxWeight =
      f.depthTier === 'bokeh-fg'
        ? 35
        : f.depthTier === 'hero'
        ? 24
        : f.depthTier === 'mid'
        ? 16
        : 8;

    const baseX = f.xRatio * width + pX * parallaxWeight;
    const baseY = height + 10;

    const targetHeadY = f.headYRatio * height;
    const stemLength = baseY - targetHeadY;

    // Gentle natural wind sway
    const swayAmount = reducedMotion
      ? 0
      : Math.sin(time * f.swaySpeed + f.phase) * (stemLength * 0.045);
    const headX = baseX + swayAmount;
    const headY = targetHeadY;

    const ctrlX = baseX + (headX - baseX) * 0.35 - swayAmount * 0.3;
    const ctrlY = baseY - stemLength * 0.5;

    const isBlurred = f.depthTier === 'bokeh-fg';
    const stemWidth = Math.max(2.5, f.headRadius * 0.20);

    ctx.save();
    if (isBlurred) {
      if ('filter' in ctx) {
        ctx.filter = 'blur(6px)';
      }
      ctx.globalAlpha = 0.88;
    }

    // 1. Stem Cast Shadow on Hill (Daytime from Screenshot_2.png)
    if (themeTransition < 0.85 && !isBlurred && f.depthTier !== 'bg') {
      const shadowAlpha = (1 - themeTransition) * 0.38;
      ctx.save();
      ctx.strokeStyle = stemCastShadow;
      ctx.lineWidth = stemWidth * 1.4;
      ctx.lineCap = 'round';
      ctx.globalAlpha = shadowAlpha;

      // Cast shadow slants gently to the right as in Screenshot_2.png
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(ctrlX + stemLength * 0.08, ctrlY, headX + stemLength * 0.12, headY + 12);
      ctx.stroke();
      ctx.restore();
    }

    // 2. 3D Cylindrical Stem with highlight and shadow (from Screenshot_2.png)
    ctx.lineCap = 'round';

    // Base tube
    ctx.strokeStyle = stemBase;
    ctx.lineWidth = stemWidth;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, headX, headY);
    ctx.stroke();

    // Shadow on right edge of cylinder
    if (!isBlurred && stemWidth >= 3.5) {
      ctx.strokeStyle = stemShadow;
      ctx.lineWidth = stemWidth * 0.35;
      ctx.beginPath();
      ctx.moveTo(baseX + stemWidth * 0.25, baseY);
      ctx.quadraticCurveTo(ctrlX + stemWidth * 0.25, ctrlY, headX + stemWidth * 0.25, headY);
      ctx.stroke();

      // Highlight on left edge of cylinder
      ctx.strokeStyle = stemHighlight;
      ctx.lineWidth = stemWidth * 0.3;
      ctx.beginPath();
      ctx.moveTo(baseX - stemWidth * 0.22, baseY);
      ctx.quadraticCurveTo(ctrlX - stemWidth * 0.22, ctrlY, headX - stemWidth * 0.22, headY);
      ctx.stroke();
    }

    // 3. Paired Spade-Shaped Green Leaves
    for (const leaf of f.leaves) {
      const t = leaf.relativeHeight;
      const lx = (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * ctrlX + t * t * headX;
      const ly = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * ctrlY + t * t * headY;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(leaf.side * leaf.angle + (reducedMotion ? 0 : Math.sin(time * f.swaySpeed + f.phase) * 0.08));

      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.length * 0.45, -leaf.width * 0.8, leaf.length, 0);
      ctx.quadraticCurveTo(leaf.length * 0.45, leaf.width * 0.8, 0, 0);
      ctx.fill();

      // Subtle leaf centerline
      if (!isBlurred && leaf.length >= 22) {
        ctx.strokeStyle = stemShadow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(leaf.length * 0.85, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 4. Lantern Flower Golden Flare (Nighttime from Screenshot_1.png)
    if (f.isLantern && themeTransition > 0.05) {
      const flareR = f.headRadius * 4.6;
      const flareGrad = ctx.createRadialGradient(headX, headY, f.headRadius * 0.2, headX, headY, flareR);
      flareGrad.addColorStop(0, lanternGlow);
      flareGrad.addColorStop(0.35, 'rgba(255, 205, 80, 0.45)');
      flareGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');

      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(headX, headY, flareR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Sunflower Head
    ctx.save();
    ctx.translate(headX, headY);
    const tilt = reducedMotion ? 0 : Math.sin(time * f.swaySpeed + f.phase) * 0.05;
    ctx.rotate(tilt);

    this.drawSunflowerHead(
      ctx,
      f,
      f.headRadius,
      outerPetal,
      innerPetal,
      creaseColor,
      centerDark,
      centerRing,
      centerLight,
      isBlurred
    );

    ctx.restore();
    ctx.restore();
  }

  render(rc: RenderContext): void {
    const { ctx, themeTransition } = rc;

    const stemHighlight = lerpColor(DAY_PALETTE.stemHighlight, NIGHT_PALETTE.stemHighlight, themeTransition);
    const stemBase = lerpColor(DAY_PALETTE.stemBase, NIGHT_PALETTE.stemBase, themeTransition);
    const stemShadow = lerpColor(DAY_PALETTE.stemShadow, NIGHT_PALETTE.stemShadow, themeTransition);
    const stemCastShadow = lerpColor(DAY_PALETTE.stemCastShadow, NIGHT_PALETTE.stemCastShadow, themeTransition);
    const leafColor = lerpColor(DAY_PALETTE.leafColor, NIGHT_PALETTE.leafColor, themeTransition);

    const outerPetal = lerpColor(DAY_PALETTE.sunflowerPetalOuter, NIGHT_PALETTE.sunflowerPetalOuter, themeTransition);
    const innerPetal = lerpColor(DAY_PALETTE.sunflowerPetalInner, NIGHT_PALETTE.sunflowerPetalInner, themeTransition);
    const creaseColor = lerpColor(DAY_PALETTE.sunflowerPetalCrease, NIGHT_PALETTE.sunflowerPetalCrease, themeTransition);

    const centerDark = lerpColor(DAY_PALETTE.sunflowerCenterDark, NIGHT_PALETTE.sunflowerCenterDark, themeTransition);
    const centerRing = lerpColor(DAY_PALETTE.sunflowerCenterRing, NIGHT_PALETTE.sunflowerCenterRing, themeTransition);
    const centerLight = lerpColor(DAY_PALETTE.sunflowerCenterLight, NIGHT_PALETTE.sunflowerCenterLight, themeTransition);

    const lanternGlow = lerpColor(DAY_PALETTE.sunflowerLanternGlow, NIGHT_PALETTE.sunflowerLanternGlow, themeTransition);

    // Render depth layers
    const bgFlowers = this.flowers.filter((f) => f.depthTier === 'bg');
    const midFlowers = this.flowers.filter((f) => f.depthTier === 'mid');
    const heroFlowers = this.flowers.filter((f) => f.depthTier === 'hero');
    const bokehFlowers = this.flowers.filter((f) => f.depthTier === 'bokeh-fg');

    for (const f of bgFlowers) {
      this.drawSingleFlower(
        ctx, f, rc, stemHighlight, stemBase, stemShadow, stemCastShadow,
        leafColor, outerPetal, innerPetal, creaseColor,
        centerDark, centerRing, centerLight, lanternGlow
      );
    }

    for (const f of midFlowers) {
      this.drawSingleFlower(
        ctx, f, rc, stemHighlight, stemBase, stemShadow, stemCastShadow,
        leafColor, outerPetal, innerPetal, creaseColor,
        centerDark, centerRing, centerLight, lanternGlow
      );
    }

    for (const f of heroFlowers) {
      this.drawSingleFlower(
        ctx, f, rc, stemHighlight, stemBase, stemShadow, stemCastShadow,
        leafColor, outerPetal, innerPetal, creaseColor,
        centerDark, centerRing, centerLight, lanternGlow
      );
    }

    for (const f of bokehFlowers) {
      this.drawSingleFlower(
        ctx, f, rc, stemHighlight, stemBase, stemShadow, stemCastShadow,
        leafColor, outerPetal, innerPetal, creaseColor,
        centerDark, centerRing, centerLight, lanternGlow
      );
    }
  }
}
