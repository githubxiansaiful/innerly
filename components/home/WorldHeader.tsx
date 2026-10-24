'use client';

import React, { useEffect, useState } from 'react';
import { ThemeMode } from '@/lib/world/types';
import { useAudio } from '@/lib/audio/AudioContext';

interface WorldHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenVent?: () => void;
  onOpenLetGo?: () => void;
}

export function WorldHeader({ theme, onToggleTheme }: WorldHeaderProps) {
  const [timeString, setTimeString] = useState<string>('');
  const { isPlaying, toggleSound } = useAudio();
  const [a11yHighContrast, setA11yHighContrast] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hStr = hours < 10 ? `0${hours}` : `${hours}`;
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeString(`${hStr}:${mStr} ${ampm}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleA11y = () => {
    setA11yHighContrast((prev) => !prev);
    document.documentElement.classList.toggle('a11y-high-contrast');
  };

  const isDay = theme === 'day';
  const textClass = isDay ? 'text-[#16324a]' : 'text-white';

  return (
    <header className="fixed top-5 sm:top-6 inset-x-0 mx-auto w-[94%] max-w-[1232px] z-50 relative flex items-center justify-between pointer-events-none select-none">
      {/* Left: Brand Pill matching Screenshot_5 */}
      <div
        className={`liquid-glass px-5 py-1 sm:py-1.5 rounded-full pointer-events-auto flex items-center justify-center transition-all duration-150 ${textClass}`}
      >
        <span className="font-serif text-[28px] sm:text-[30px] font-normal leading-[1.1] tracking-[-0.5px]">
          Miwa
        </span>
      </div>

      {/* Center: Clock Pill matching user's exact specification */}
      <div
        data-sky-avoid="true"
        className="zuzu-clock absolute left-[calc(50%-12px)] sm:left-1/2 -translate-x-1/2 text-[0.625rem] md:text-xs tracking-[0.2em] sm:tracking-[0.3em] font-medium opacity-60 uppercase z-50 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-md border text-night-ink bg-white/5 border-white/10 pointer-events-auto"
        style={{ opacity: 1, transform: 'none' }}
      >
        {timeString || '01:23 AM'}
      </div>

      {/* Right: Three Action Buttons matching Screenshot_5 */}
      <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
        {/* 1. Ambient Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`liquid-glass w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer hover:bg-white/[0.05] ${textClass}`}
          aria-label={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
          title={isPlaying ? 'Sound playing (click to mute)' : 'Sound muted (click to play)'}
        >
          {isPlaying ? (
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
            </svg>
          ) : (
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          )}
        </button>

        {/* 2. Theme Toggle (Sun in night mode / Moon in day mode) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`liquid-glass w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer hover:bg-white/[0.05] ${textClass}`}
          aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
          title={isDay ? 'Day active (switch to night)' : 'Night active (switch to day)'}
        >
          {isDay ? (
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          )}
        </button>

        {/* 3. Accessibility Toggle */}
        <button
          type="button"
          onClick={toggleA11y}
          className={`liquid-glass w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer hover:bg-white/[0.05] ${
            a11yHighContrast ? 'ring-2 ring-blue-400' : ''
          } ${textClass}`}
          aria-label="Toggle accessibility enhancements"
          title="Accessibility settings"
        >
          <svg
            className="w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="4.5" r="1.8" />
            <path d="M5 8.5c4.5 1.4 9.5 1.4 14 0" />
            <path d="M12 9v5" />
            <path d="M12 14l-3 6" />
            <path d="M12 14l3 6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
