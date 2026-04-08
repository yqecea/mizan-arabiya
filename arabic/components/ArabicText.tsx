import React from 'react';

export function ArabicText({ children, className = "", style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <span dir="rtl" className={`font-arabic ${className}`} style={style}>
      {children}
    </span>
  );
}
