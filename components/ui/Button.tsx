import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'solid' | 'ghost' | 'elevated';
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
    // Monochrome tokens: #000000 bg, white text, 8px or pill radius, 10px 16px padding, 600 weight
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold text-[12px] leading-[1.63] select-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

    const radiusStyles = pill ? 'rounded-full' : 'rounded-[8px]';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-[11px]',
      md: 'px-4 py-2.5 text-[12px]', // 10px 16px padding as specified
      lg: 'px-6 py-3 text-[13px]',
      icon: 'p-2.5',
    }[size];

    const variantStyles = {
      default:
        'bg-[#000000] text-[#FFFFFF] border border-white/15 hover:bg-[#141414] hover:border-white/30 hover:text-white',
      elevated:
        'bg-[#141414] text-[#FFFFFF] border border-white/15 hover:bg-[#1e1e1e] hover:border-white/30',
      solid:
        'bg-[#FFFFFF] text-[#000000] border border-white hover:bg-[#e5e5e5]',
      ghost:
        'bg-transparent text-[#949494] border border-transparent hover:text-[#FFFFFF] hover:bg-white/5',
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
