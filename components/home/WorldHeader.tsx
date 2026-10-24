'use client';

import React, { useEffect, useState } from 'react';
import { ThemeMode } from '@/lib/world/types';
import { ThemeToggle } from './ThemeToggle';
import { useAudio } from '@/lib/audio/AudioContext';

interface WorldHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenVent?: () => void;
  onOpenLetGo?: () => void;
}

export function WorldHeader({ theme, onToggleTheme }: WorldHeaderProps) {
  const [localTime, setLocalTime] = useState<string>('');
  const { isPlaying, toggleSound } = useAudio();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-[94%] max-w-4xl z-60 rounded-full px-4 sm:px-6 py-2.5 bg-[#000000]/85 backdrop-blur-md border border-white/15 text-white shadow-none flex items-center justify-between transition-all duration-150"
    >
      {/* Brand Wordmark (Instrument Serif 16px 400 as specified) */}
      <div className="flex items-center space-x-2.5 select-none">
        <span
          className="w-6 h-6 rounded-full bg-[#141414] border border-white/20 flex items-center justify-center text-white"
          aria-hidden="true"
        >
          {/* Minimalist seed glyph */}
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </span>
        <span className="font-serif text-[18px] font-normal tracking-tight text-white leading-[1.2]">
          Innerly
        </span>
        <span className="hidden sm:inline-block text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#949494] pl-1">
          monochrome
        </span>
      </div>

      {/* Local Time Display (Inter/Mono 11px font-medium muted text) */}
      <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono font-medium tracking-wider text-[#949494]">
        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60" aria-hidden="true" />
        <span>{localTime || '--:--:--'}</span>
      </div>

      {/* Right Controls (Pill buttons with 4px grid rhythm) */}
      <div className="flex items-center space-x-2">
        {/* Sound Toggle connected to feeling.mp3 */}
        <button
          type="button"
          onClick={toggleSound}
          className={`inline-flex items-center justify-center p-2 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer shadow-none ${
            isPlaying
              ? 'bg-[#141414] border-white/30 text-white'
              : 'bg-[#000000] border-white/15 text-[#949494] hover:text-white hover:bg-[#141414]'
          }`}
          aria-label={isPlaying ? 'Pause ambient audio' : 'Play ambient audio'}
          title={isPlaying ? 'Ambient audio playing (feeling.mp3)' : 'Ambient audio paused'}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Day / Night Toggle */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
