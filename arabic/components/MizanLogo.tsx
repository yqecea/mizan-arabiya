import React from 'react';

interface MizanLogoProps {
  variant?: 'full' | 'icon';
  context?: 'light' | 'dark';
  size?: number;
  className?: string;
}

/**
 * Mizan Logo — SVG implementation
 * Based on BRAND_BOOK.md §2.1:
 * - Icon: Geometric "M" mark
 * - Wordmark: "MIZAN" — Montserrat Black 900
 * - Light context: Deep on Cream
 * - Dark context: Cream on Deep
 */
export function MizanLogo({ variant = 'full', context = 'dark', size = 40, className = '' }: MizanLogoProps) {
  const iconColor = context === 'dark' ? '#F1F2EC' : '#2A2F35';
  const bgColor = context === 'dark' ? '#2A2F35' : 'transparent';
  const wordmarkColor = context === 'dark' ? '#F1F2EC' : '#2A2F35';

  const iconSize = size;
  const totalWidth = variant === 'full' ? iconSize * 4.5 : iconSize;

  return (
    <svg
      width={totalWidth}
      height={iconSize}
      viewBox={`0 0 ${variant === 'full' ? 180 : 40} 40`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mizan Arabiya"
    >
      {/* M Icon Mark */}
      <rect x="0" y="0" width="40" height="40" fill={bgColor} />
      <path
        d="M8 32V12L20 24L32 12V32"
        stroke={iconColor}
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M8 12L14 18"
        stroke={iconColor}
        strokeWidth="3.5"
        strokeLinecap="square"
      />
      <path
        d="M32 12L26 18"
        stroke={iconColor}
        strokeWidth="3.5"
        strokeLinecap="square"
      />

      {variant === 'full' && (
        <>
          {/* Wordmark: "MIZAN" — Montserrat Black 900, uppercase */}
          <text
            x="52"
            y="27"
            fontFamily="'Montserrat', sans-serif"
            fontWeight="900"
            fontSize="16"
            letterSpacing="0.15em"
            fill={wordmarkColor}
          >
            MIZAN
          </text>
        </>
      )}
    </svg>
  );
}

/**
 * Product sub-brand label
 * Format: "MIZAN" wordmark + "ARABIYA" sub-brand (§1.3 naming: "Mizan [Domain]")
 */
export function MizanProductLogo({ context = 'dark', className = '' }: { context?: 'light' | 'dark'; className?: string }) {
  const primaryColor = context === 'dark' ? '#F1F2EC' : '#2A2F35';
  const accentColor = '#A5887E'; // Mauve — always

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <MizanLogo variant="icon" context={context} size={36} />
      <div className="text-center">
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: primaryColor,
            display: 'block',
          }}
        >
          MIZAN
        </span>
        <span
          className="font-display"
          style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: accentColor,
            display: 'block',
            marginTop: '2px',
          }}
        >
          Arabiya
        </span>
      </div>
    </div>
  );
}
