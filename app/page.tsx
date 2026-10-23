'use client';

import React, { useState } from 'react';
import { WorldCanvas } from '@/components/home/WorldCanvas';
import { WorldHeader } from '@/components/home/WorldHeader';
import { ThemeMode } from '@/lib/world/types';

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>('day');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const isNight = theme === 'night';

  return (
    <main className="relative w-full h-full overflow-hidden select-none">
      {/* Immersive Living Canvas */}
      <WorldCanvas theme={theme} />

      {/* Compact Header Bar */}
      <WorldHeader theme={theme} onToggleTheme={toggleTheme} />

      {/* Subtle Welcoming Message */}
      <div className="absolute inset-x-0 top-[22%] sm:top-[26%] mx-auto max-w-xl text-center px-6 pointer-events-none z-10 transition-colors duration-700">
        <span
          className={`inline-block text-xs uppercase tracking-[0.25em] font-medium py-1 px-3 rounded-full mb-3 backdrop-blur-sm transition-all duration-700 ${
            isNight
              ? 'bg-indigo-950/40 text-amber-200/90 border border-indigo-700/30'
              : 'bg-white/40 text-amber-900/80 border border-amber-800/10'
          }`}
        >
          {isNight ? 'Starlit Haven' : 'Peaceful Meadow'}
        </span>
        <h1
          className={`text-2xl sm:text-4xl font-light tracking-tight transition-colors duration-700 drop-shadow-sm ${
            isNight ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          A quiet place to breathe.
        </h1>
        <p
          className={`mt-2 text-xs sm:text-sm font-normal max-w-sm mx-auto transition-colors duration-700 leading-relaxed ${
            isNight ? 'text-slate-300/80' : 'text-slate-600'
          }`}
        >
          Express what is on your mind, listen without judgment, and wander through the living landscape.
        </p>
      </div>
    </main>
  );
}
