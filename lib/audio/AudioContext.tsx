'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isMuted: boolean;
  isPlaying: boolean;
  toggleSound: () => void;
  setVolume: (val: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // BY DEFAULT LOUD (NOT MUTED) as requested
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    // Initialize ambient audio element for feeling.mp3
    const audio = new Audio('/feeling.mp3');
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    // Attempt playback immediately by default
    const attemptPlay = async () => {
      try {
        await audio.play();
      } catch {
        // Browser autoplay restriction paused unprompted audio on reload.
        // Keep isMuted = false (LOUD icon stays visible in UI by default).
        // Resume playback on the user's first touch/click anywhere on the page.
        const handleFirstInteraction = () => {
          if (!isMutedRef.current && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
          window.removeEventListener('pointerdown', handleFirstInteraction);
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('keydown', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
      }
    };

    attemptPlay();

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isMuted) {
      // User explicitly clicked to mute
      audio.pause();
      setIsMuted(true);
    } else {
      // User explicitly clicked to unmute / make loud
      audio.play().catch(() => {});
      setIsMuted(false);
    }
  };

  const setVolume = (val: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, val));
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, isPlaying: !isMuted, toggleSound, setVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
