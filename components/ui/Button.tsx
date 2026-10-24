import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'solid' | 'ghost' | 'elevated' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      pill = true,
      children,
      ...props
    },
    ref
  ) => {
    // Liquid glass button tokens: blur(4px), luminosity blend, inset highlight, transparent surface
    const baseStyles =
      'liquid-glass inline-flex items-center justify-center font-sans font-semibold text-[12px] leading-[1.63] select-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

    const radiusStyles = pill ? 'rounded-full' : 'rounded-[8px]';

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-[11px]',
      md: 'px-4 py-2.5 text-[12px]',
      lg: 'px-6 py-3 text-[13px]',
      icon: 'p-2.5',
    }[size];

    const variantStyles = {
      default:
        'text-[#FFFFFF] [data-theme=day]:text-[#000000] hover:bg-white/[0.06] [data-theme=day]:hover:bg-black/[0.04]',
      glass:
        'text-[#FFFFFF] [data-theme=day]:text-[#000000] hover:bg-white/[0.08] [data-theme=day]:hover:bg-black/[0.04]',
      elevated:
        'bg-white/[0.03] [data-theme=day]:bg-black/[0.04] text-[#FFFFFF] [data-theme=day]:text-[#000000] hover:bg-white/[0.08]',
      solid:
        'bg-[#FFFFFF] [data-theme=day]:bg-[#000000] text-[#000000] [data-theme=day]:text-[#FFFFFF] hover:bg-[#e5e5e5] [data-theme=day]:hover:bg-[#222222] shadow-none',
      ghost:
        'bg-transparent text-[#949494] [data-theme=day]:text-[#555555] shadow-none hover:text-[#FFFFFF] [data-theme=day]:hover:text-[#000000] hover:bg-white/5',
    }[variant];

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${radiusStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
