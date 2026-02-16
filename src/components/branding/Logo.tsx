'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizes = {
  sm: { height: 32, fontSize: '1.25rem' },
  md: { height: 48, fontSize: '2rem' },
  lg: { height: 64, fontSize: '2.5rem' },
  xl: { height: 96, fontSize: '4rem' },
};

export default function Logo({
  variant = 'full',
  size = 'md',
  animated = true,
  className = '',
}: LogoProps) {
  const currentSize = sizes[size];

  if (variant === 'icon') {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: currentSize.height, height: currentSize.height }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id="pulso-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4facfe" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>
          </defs>

          {animated && (
            <>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#pulso-gradient)"
                strokeWidth="2"
                opacity="0.3"
                className="animate-ping"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#pulso-gradient)"
                strokeWidth="2"
                opacity="0.5"
                className="animate-pulse"
              />
            </>
          )}

          <circle cx="50" cy="50" r="25" fill="url(#pulso-gradient)" />
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.9" />
        </svg>
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div
        className={`font-bold ${className}`}
        style={{
          fontSize: currentSize.fontSize,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Pulso
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo variant="icon" size={size} animated={animated} />
      <Logo variant="wordmark" size={size} />
    </div>
  );
}
