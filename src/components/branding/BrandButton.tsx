'use client';

import React from 'react';

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantStyles = {
  primary:
    'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline:
    'border-2 border-[#4facfe] text-[#4facfe] hover:bg-[#4facfe] hover:text-white',
  ghost: 'text-[#4facfe] hover:bg-blue-50',
};

export default function BrandButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}: BrandButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
