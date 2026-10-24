'use client';

import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '@/lib/world/types';

interface ScenicBackgroundProps {
  theme: ThemeMode;
  onThemeChange?: (newTheme: ThemeMode) => void;
}

export function ScenicBackground({ theme, onThemeChange }: ScenicBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync theme changes from Next.js state to iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'set-theme', theme },
        '*'
      );
    }
  }, [theme]);

  // Listen for theme toggle events from inside the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'theme-changed' && e.data.theme) {
        onThemeChange?.(e.data.theme as ThemeMode);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onThemeChange]);

  // Forward mouse movements to iframe so sunflowers sway across the full screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'mousemove', clientX: e.clientX, clientY: e.clientY },
          '*'
        );
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'set-theme', theme },
        '*'
      );
    }
  };

  return (
    <iframe
      ref={iframeRef}
      src="/home-bg.html"
      title="Innerly Living Landscape Background"
      onLoad={handleLoad}
      className="absolute inset-0 w-full h-full border-0 pointer-events-auto z-0"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
