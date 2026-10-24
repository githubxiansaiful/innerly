'use client';

import React, { useState } from 'react';
import { ScenicBackground } from '@/components/home/ScenicBackground';
import { WorldHeader } from '@/components/home/WorldHeader';
import { FeatureNavigation } from '@/components/home/FeatureNavigation';
import { ThemeMode } from '@/lib/world/types';
import { AudioProvider } from '@/lib/audio/AudioContext';

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>('night'); // Default to night scene

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  return (
    <AudioProvider>
      <main className="relative w-full h-full overflow-hidden select-none bg-black text-white">
        {/* Scenic Background from home-bg.html */}
        <ScenicBackground theme={theme} onThemeChange={setTheme} />

        {/* Monochrome Minimalist Header (z-60) */}
        <WorldHeader theme={theme} onToggleTheme={toggleTheme} />

        {/* Editorial Monochrome Hero Section (Centered within the natural valley of flowers) */}
        <div className="absolute inset-x-0 top-[18%] sm:top-[22%] mx-auto max-w-xl text-center px-4 sm:px-6 pointer-events-none z-10">
          {/* H1 — Instrument Serif 16px 400, 1.5 line-height */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#000000]/80 border border-white/15 backdrop-blur-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            <h1 className="font-serif text-[16px] font-normal leading-[1.5] text-white tracking-tight">
              Innerly Sanctuary
            </h1>
          </div>

          {/* H2 — Instrument Serif 60px 300, 1 line-height */}
          <h2 className="font-serif text-[42px] sm:text-[60px] font-light leading-[1.0] text-white tracking-tight italic drop-shadow-sm">
            A quiet place to breathe.
          </h2>

          {/* Body — Inter 12px 500, 1.63 line-height */}
          <p className="mt-3 font-sans text-[12px] font-medium leading-[1.63] text-[#949494] max-w-sm mx-auto">
            Express what is on your mind, listen without judgment, and wander through the living landscape.
          </p>
        </div>

        {/* Monochrome Feature Navigation Dock (z-60) */}
        <FeatureNavigation />
      </main>
    </AudioProvider>
  );
}
