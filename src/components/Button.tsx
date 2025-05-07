import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded font-semibold inline-flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    secondary: 'bg-tan-500 text-black hover:bg-tan-600',
    outline: 'border border-green-700 text-green-700 hover:bg-green-50',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <button 
      className={classes} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
} 