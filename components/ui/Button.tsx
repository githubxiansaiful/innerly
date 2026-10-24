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
        'text-[#FFFFFF] hover:bg-white/[0.06] hover:text-white',
      glass:
        'text-[#FFFFFF] hover:bg-white/[0.08] hover:text-white',
      elevated:
        'bg-white/[0.03] text-[#FFFFFF] hover:bg-white/[0.08]',
      solid:
        'bg-[#FFFFFF] text-[#000000] hover:bg-[#e5e5e5] shadow-none',
      ghost:
        'bg-transparent text-[#949494] shadow-none hover:text-[#FFFFFF] hover:bg-white/5',
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
