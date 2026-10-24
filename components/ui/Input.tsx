import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-[#141414] text-white placeholder:text-[#949494] text-[12px] font-sans font-medium leading-[1.63] px-3 py-2 rounded-[6px] border border-white/15 shadow-none transition-all duration-150 focus:outline-none focus:border-white/40 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-[#141414] text-white placeholder:text-[#949494] text-[12px] font-sans font-medium leading-[1.63] px-3 py-2 rounded-[6px] border border-white/15 shadow-none resize-none transition-all duration-150 focus:outline-none focus:border-white/40 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
