'use client';

import React, { useEffect, useState } from 'react';
import { ThemeMode } from '@/lib/world/types';
import { ThemeToggle } from './ThemeToggle';

interface WorldHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function WorldHeader({ theme, onToggleTheme }: WorldHeaderProps) {
  const [localTime, setLocalTime] = useState<string>('');
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(true);

  // Update local time without full-page re-renders
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

  const isNight = theme === 'night';

  const toggleSound = () => {
    // Sound is muted by default as required by specification
    setIsSoundMuted((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-4 sm:top-6 inset-x-0 mx-auto w-[92%] max-w-4xl z-30 transition-colors duration-700 rounded-full px-4 sm:px-6 py-2.5 backdrop-blur-md border shadow-sm flex items-center justify-between ${
        isNight
          ? 'bg-slate-900/40 border-slate-700/40 text-slate-100 shadow-black/20'
          : 'bg-white/45 border-white/50 text-slate-800 shadow-amber-900/5'
      }`}
    >
      {/* Brand Wordmark */}
      <div className="flex items-center space-x-2.5 select-none">
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500 ${
            isNight
              ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30'
              : 'bg-amber-500/20 text-amber-700 ring-1 ring-amber-500/30'
          }`}
          aria-hidden="true"
        >
          {/* Sprouting seed / leaf icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
              className="hidden"
            />
            <path
              fillRule="evenodd"
              d="M12 3.75a8.25 8.25 0 0 0-8.25 8.25c0 2.82 1.412 5.312 3.58 6.797.355.243.834.024.896-.402.164-1.127.794-2.88 2.348-4.434 1.554-1.554 3.307-2.184 4.434-2.348.426-.062.645-.54.402-.896A8.214 8.214 0 0 0 12 3.75Zm.75 8.25a.75.75 0 0 1 .75-.75 6.75 6.75 0 0 1 6.75 6.75.75.75 0 0 1-1.5 0 5.25 5.25 0 0 0-5.25-5.25.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="font-semibold tracking-wide text-sm sm:text-base">
          Innerly
        </span>
      </div>

      {/* Local Time Display */}
      <div className="hidden sm:flex items-center space-x-1.5 text-xs font-mono font-medium tracking-wider opacity-75">
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            isNight ? 'bg-indigo-400' : 'bg-emerald-500'
          }`}
          aria-hidden="true"
        />
        <span>{localTime || '--:--:--'}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
            isNight
              ? 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 active:scale-95'
          }`}
          aria-label={isSoundMuted ? 'Turn ambient sound on' : 'Mute ambient sound'}
          title={isSoundMuted ? 'Sound off (Click to enable)' : 'Sound on (Click to mute)'}
        >
          {isSoundMuted ? (
            // Muted Speaker
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 opacity-70 hover:opacity-100"
              aria-hidden="true"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A2.25 2.25 0 0 0 2.25 9.75v4.5A2.25 2.25 0 0 0 4.5 16.5h1.94l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 0 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
            </svg>
          ) : (
            // Active Speaker
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-emerald-500"
              aria-hidden="true"
            >
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5A2.25 2.25 0 0 0 2.25 9.75v4.5A2.25 2.25 0 0 0 4.5 16.5h1.94l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
              <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
            </svg>
          )}
        </button>

        {/* Day / Night Toggle */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
