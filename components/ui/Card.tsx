import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className = '', elevated = true, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-[12px] p-6 border border-white/10 text-white shadow-none transition-colors duration-150 ${
        elevated ? 'bg-[#141414]' : 'bg-[#000000]'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
