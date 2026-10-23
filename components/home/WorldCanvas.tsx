'use client';

import React, { useEffect, useRef } from 'react';
import { WorldEngine } from '@/lib/world/WorldEngine';
import { ThemeMode } from '@/lib/world/types';

interface WorldCanvasProps {
  theme: ThemeMode;
}

export function WorldCanvas({ theme }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const initialThemeRef = useRef(theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Instantiate engine with initial theme
    const engine = new WorldEngine(canvas, initialThemeRef.current);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []); // Mount and unmount lifecycle only

  // Sync theme changes to engine smoothly
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTheme(theme);
    }
  }, [theme]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
}
