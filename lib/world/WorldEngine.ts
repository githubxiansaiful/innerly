import { PointerState, RenderContext, ThemeMode, WorldLayer } from './types';
import { clamp, easeInOutCubic } from './math';
import { SkyLayer } from './layers/SkyLayer';
import { StarLayer } from './layers/StarLayer';
import { MountainLayer } from './layers/MountainLayer';
import { CloudLayer } from './layers/CloudLayer';
import { HillLayer } from './layers/HillLayer';
import { GrassLayer } from './layers/GrassLayer';
import { FlowerLayer } from './layers/FlowerLayer';
import { ParticleLayer } from './layers/ParticleLayer';

export class WorldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: WorldLayer[] = [];

  private isRunning = false;
  private animFrameId: number | null = null;
  private lastTimestamp = 0;
  private elapsedTime = 0;

  private currentTheme: ThemeMode = 'day';
  private targetThemeTransition = 0; // 0 for day, 1 for night
  private currentThemeTransition = 0;
  private transitionSpeed = 1.0; // reaches target in ~1 second

  private width = 0;
  private height = 0;
  private dpr = 1;

  private reducedMotion = false;
  private pointer: PointerState = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
  };

  private resizeObserver: ResizeObserver | null = null;
  private mediaQueryList: MediaQueryList | null = null;
  private boundVisibilityHandler: () => void;
  private boundPointerMoveHandler: (e: MouseEvent) => void;
  private boundPointerLeaveHandler: () => void;
  private boundMotionChangeHandler: (e: MediaQueryListEvent) => void;

  constructor(canvas: HTMLCanvasElement, initialTheme: ThemeMode = 'day') {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D context is not supported');
    }
    this.ctx = context;

    this.currentTheme = initialTheme;
    this.targetThemeTransition = initialTheme === 'night' ? 1 : 0;
    this.currentThemeTransition = this.targetThemeTransition;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      this.mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.mediaQueryList.matches;
    }

    // Initialize layers in specified visual order
    this.layers = [
      new SkyLayer(),
      new StarLayer(),
      new MountainLayer(),
      new CloudLayer(),
      new HillLayer(),
      new GrassLayer(),
      new FlowerLayer(),
      new ParticleLayer(),
    ];

    // Setup event listeners
    this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    this.boundPointerMoveHandler = this.handlePointerMove.bind(this);
    this.boundPointerLeaveHandler = this.handlePointerLeave.bind(this);
    this.boundMotionChangeHandler = (e: MediaQueryListEvent) => {
      this.reducedMotion = e.matches;
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.boundPointerMoveHandler, { passive: true });
      window.addEventListener('mouseleave', this.boundPointerLeaveHandler, { passive: true });
      if (this.mediaQueryList) {
        this.mediaQueryList.addEventListener('change', this.boundMotionChangeHandler);
      }
    }

    this.setupResizeObserver();
    this.resizeBackingStore();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeBackingStore();
    });

    if (this.canvas.parentElement) {
      this.resizeObserver.observe(this.canvas.parentElement);
    } else {
      this.resizeObserver.observe(this.canvas);
    }
  }

  private resizeBackingStore() {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    const maxDpr = 2; // cap devicePixelRatio to prevent GPU strain on mobile / retina
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, maxDpr);

    if (this.width !== width || this.height !== height || this.dpr !== dpr) {
      this.width = width;
      this.height = height;
      this.dpr = dpr;

      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);

      // Notify layers that support resize
      for (const layer of this.layers) {
        if (layer.resize) {
          layer.resize(width, height);
        }
      }

      // If loop is paused, trigger a single render
      if (!this.isRunning) {
        this.renderSingleFrame();
      }
    }
  }

  private handlePointerMove(e: MouseEvent) {
    if (this.reducedMotion || this.width === 0 || this.height === 0) return;
    // Normalized [-1, 1] relative to center
    this.pointer.targetX = clamp((e.clientX / this.width - 0.5) * 2, -1, 1);
    this.pointer.targetY = clamp((e.clientY / this.height - 0.5) * 2, -1, 1);
    this.pointer.active = true;
  }

  private handlePointerLeave() {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
    this.pointer.active = false;
  }

  private handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.stop();
    } else {
      this.lastTimestamp = performance.now();
      this.start();
    }
  }

  public setTheme(theme: ThemeMode) {
    this.currentTheme = theme;
    this.targetThemeTransition = theme === 'night' ? 1 : 0;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop(timestamp: number) {
    if (!this.isRunning) return;

    let delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Clamp large delta after tab refocus
    delta = clamp(delta, 0.001, 0.06);
    this.elapsedTime += delta;

    // Smoothly interpolate theme transition
    if (this.currentThemeTransition !== this.targetThemeTransition) {
      const dir = Math.sign(this.targetThemeTransition - this.currentThemeTransition);
      this.currentThemeTransition += dir * this.transitionSpeed * delta;
      if (dir > 0 && this.currentThemeTransition > this.targetThemeTransition) {
        this.currentThemeTransition = this.targetThemeTransition;
      } else if (dir < 0 && this.currentThemeTransition < this.targetThemeTransition) {
        this.currentThemeTransition = this.targetThemeTransition;
      }
    }

    // Smooth pointer parallax movement
    if (this.pointer.active) {
      this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
      this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;
    } else {
      this.pointer.x += (0 - this.pointer.x) * 0.05;
      this.pointer.y += (0 - this.pointer.y) * 0.05;
    }

    this.renderSingleFrame(delta);

    this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }

  private renderSingleFrame(deltaTime = 0.016) {
    if (this.width === 0 || this.height === 0) return;

    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);

    const easedTransition = easeInOutCubic(this.currentThemeTransition);

    const rc: RenderContext = {
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      time: this.elapsedTime,
      deltaTime,
      theme: this.currentTheme,
      themeTransition: easedTransition,
      reducedMotion: this.reducedMotion,
      pointer: this.pointer,
    };

    // Render layers in defined order
    for (const layer of this.layers) {
      layer.render(rc);
    }

    this.ctx.restore();
  }

  public destroy() {
    this.stop();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.boundPointerMoveHandler);
      window.removeEventListener('mouseleave', this.boundPointerLeaveHandler);
      if (this.mediaQueryList) {
        this.mediaQueryList.removeEventListener('change', this.boundMotionChangeHandler);
      }
    }

    for (const layer of this.layers) {
      if (layer.destroy) {
        layer.destroy();
      }
    }
  }
}
