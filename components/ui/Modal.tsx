'use client';

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop (z-50) */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Elevated Card Content (z-60) */}
      <div
        className={`relative z-60 w-full ${maxWidth} bg-[#141414] border border-white/15 rounded-[12px] p-6 shadow-none text-white transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            {title && (
              <h3 className="font-serif text-[20px] font-normal tracking-tight text-white leading-[1.2]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-[12px] font-medium leading-[1.63] text-[#949494] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#949494] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors duration-150 cursor-pointer focus:outline-none"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="font-sans text-[12px] font-medium leading-[1.63] text-[#949494]">
          {children}
        </div>
      </div>
    </div>
  );
}
