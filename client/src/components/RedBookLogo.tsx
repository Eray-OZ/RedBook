import React from 'react';

interface RedBookLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const RedBookLogo: React.FC<RedBookLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
  };

  return (
    <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center ${className}`}>
      {/* 100% Pure Vector SVG Red Book Logo with 0 Background Pixels */}
      <svg
        viewBox="0 0 105 135"
        className="w-full h-full filter drop-shadow-[2px_3px_0px_var(--shadow-color)] hover:scale-105 transition-transform"
      >
        <defs>
          {/* Gold Foil Gradient */}
          <linearGradient id="goldGradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Gold Shading Light */}
          <linearGradient id="goldLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Gold Shading Dark */}
          <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Leather Gradient */}
          <linearGradient id="leatherRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>

        {/* Book Spine (Left side) */}
        <rect x="4" y="4" width="12" height="127" rx="3" fill="#6b1414" stroke="var(--color-on-background)" strokeWidth="2.5" />
        <line x1="4" y1="24" x2="16" y2="24" stroke="#facc15" strokeWidth="1.5" />
        <line x1="4" y1="67" x2="16" y2="67" stroke="#facc15" strokeWidth="1.5" />
        <line x1="4" y1="110" x2="16" y2="110" stroke="#facc15" strokeWidth="1.5" />

        {/* Red Leather Front Cover */}
        <rect x="14" y="4" width="87" height="127" rx="6" fill="url(#leatherRed)" stroke="var(--color-on-background)" strokeWidth="2.5" />

        {/* Golden Stitching Outline */}
        <rect x="18" y="8" width="79" height="119" rx="4" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" opacity="0.85" />

        {/* Inner Golden Filigree Frame */}
        <rect x="22" y="12" width="71" height="111" rx="3" fill="none" stroke="url(#goldGradientMain)" strokeWidth="1.5" />
        <rect x="25" y="15" width="65" height="105" rx="2" fill="none" stroke="#ca8a04" strokeWidth="0.75" opacity="0.6" />

        {/* Corner Ornaments */}
        <path d="M 22 22 L 32 22 L 22 32 Z" fill="url(#goldGradientMain)" />
        <path d="M 93 22 L 83 22 L 93 32 Z" fill="url(#goldGradientMain)" />
        <path d="M 22 123 L 32 123 L 22 113 Z" fill="url(#goldGradientMain)" />
        <path d="M 93 123 L 83 123 L 93 113 Z" fill="url(#goldGradientMain)" />

        {/* Center Golden 8-pointed Elongated Star Emblem */}
        {/* Top/Bottom: Long vertically. Left side: 3 points. Right side: 3 points. */}
        <g transform="translate(57.5, 67.5)">
          {/* Main Outer Star Base */}
          <path
            d="
              M 0 -43
              L 6 -15 L 16 -24 L 11 -8 L 29 -12 L 14 0 L 29 12 L 11 8 L 16 24 L 6 15
              L 0 43
              L -6 15 L -16 24 L -11 8 L -29 12 L -14 0 L -29 -12 L -11 -8 L -16 -24 L -6 -15 Z
            "
            fill="url(#goldGradientMain)"
            stroke="var(--color-on-background)"
            strokeWidth="1.5"
          />

          {/* Faceted Light & Dark Star Rays for 3D Gold Effect */}
          {/* Top Long Point Facet */}
          <polygon points="0,-43 0,0 6,-15" fill="url(#goldLight)" />
          <polygon points="0,-43 0,0 -6,-15" fill="url(#goldDark)" />

          {/* Bottom Long Point Facet */}
          <polygon points="0,43 0,0 6,15" fill="url(#goldDark)" />
          <polygon points="0,43 0,0 -6,15" fill="url(#goldLight)" />

          {/* Left Side 3 Points Facets */}
          <polygon points="-29,-12 0,0 -11,-8" fill="url(#goldLight)" />
          <polygon points="-29,0 0,0 -14,0" fill="url(#goldDark)" />
          <polygon points="-29,12 0,0 -11,8" fill="url(#goldLight)" />

          {/* Right Side 3 Points Facets */}
          <polygon points="29,-12 0,0 11,-8" fill="url(#goldDark)" />
          <polygon points="29,0 0,0 14,0" fill="url(#goldLight)" />
          <polygon points="29,12 0,0 11,8" fill="url(#goldDark)" />

          {/* Center Gem / Medallion */}
          <circle cx="0" cy="0" r="6" fill="#fef08a" stroke="var(--color-on-background)" strokeWidth="1" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
      </svg>
    </div>
  );
};
