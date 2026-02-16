'use client';

import React from 'react';

interface PulsoAnimationProps {
  size?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const intensityConfig = {
  low: { rings: 2, duration: 3 },
  medium: { rings: 3, duration: 2 },
  high: { rings: 4, duration: 1.5 },
};

export default function PulsoAnimation({
  size = 200,
  intensity = 'medium',
}: PulsoAnimationProps) {
  const config = intensityConfig[intensity];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <linearGradient id="pulso-anim-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>

        {Array.from({ length: config.rings }).map((_, idx) => (
          <circle
            key={idx}
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="url(#pulso-anim-gradient)"
            strokeWidth="3"
            opacity="0.6"
            style={{
              animation: `pulso-ring ${config.duration}s ease-out infinite`,
              animationDelay: `${idx * (config.duration / config.rings)}s`,
            }}
          />
        ))}

        <circle cx="50" cy="50" r="20" fill="url(#pulso-anim-gradient)" />
        <circle cx="50" cy="50" r="6" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}
