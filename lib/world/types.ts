export type ThemeMode = 'day' | 'night';

export interface PointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: boolean;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  time: number; // elapsed time in seconds
  deltaTime: number; // clamped delta time in seconds
  theme: ThemeMode;
  themeTransition: number; // 0.0 (day) -> 1.0 (night)
  reducedMotion: boolean;
  pointer: PointerState;
}

export interface WorldLayer {
  id: string;
  resize?(width: number, height: number): void;
  render(rc: RenderContext): void;
  destroy?(): void;
}
