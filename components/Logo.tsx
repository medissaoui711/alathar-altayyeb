
import React from 'react';

interface LogoProps {
  className?: string;
  disableGlow?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", disableGlow = false }) => {
  // استخدام الكلاسات المعرفة في index.html
  const svgClasses = `${className} logo-svg-container ${!disableGlow ? 'logo-glow-effect' : ''}`;

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={svgClasses}
    >
      {/* Outer Hexagon / Shield */}
      <path 
        d="M50 5 L90 25 V75 L50 95 L10 75 V25 Z" 
        stroke="currentColor" 
        strokeWidth="3" 
        className="opacity-40"
      />
      <path 
        d="M50 12 L84 28 V72 L50 88 L16 72 V28 Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        className="opacity-20"
      />
      
      {/* Central "Athar" Symbol */}
      <path 
        d="M30 40 C30 40 45 25 65 40 C85 55 50 85 50 85 C50 85 15 55 35 40" 
        stroke="currentColor" 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="logo-central-symbol"
      />
      
      {/* Luminous Core */}
      <circle cx="50" cy="55" r="4" fill="currentColor" className="logo-luminous-core" />
      
      {/* Decorative Ornaments */}
      <circle cx="50" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="35" r="1.5" fill="currentColor" className="opacity-40" />
      <circle cx="80" cy="35" r="1.5" fill="currentColor" className="opacity-40" />
      
      {/* Floating Sparkles */}
      <g className="animate-pulse">
        <path d="M48 30 L50 28 L52 30 L50 32 Z" fill="currentColor" />
        <path d="M72 65 L74 63 L76 65 L74 67 Z" fill="currentColor" className="opacity-60" />
        <path d="M24 65 L26 63 L28 65 L26 67 Z" fill="currentColor" className="opacity-60" />
      </g>
    </svg>
  );
};

export default Logo;
