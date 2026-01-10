import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'symbol' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  className?: string;
}

const sizeMap = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-16',
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const logoSrc = `/brand/logos/fitpro-logo-${variant === 'full' ? 'original' : variant}.png`;
  const alt = 'FitPro - Treinos Personalizados com IA';
  const sizeClass = sizeMap[size];

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${sizeClass} object-contain ${className}`}
      loading="lazy"
    />
  );
};

// Versão SVG simplificada do símbolo
export const LogoSymbolSVG: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pessoa flexionando */}
      <circle cx="100" cy="50" r="18" fill="#2D3748" />
      <path
        d="M70 80 Q70 65 85 65 L115 65 Q130 65 130 80"
        stroke="#2D3748"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="70" cy="85" r="12" fill="#2D3748" />
      <circle cx="130" cy="85" r="12" fill="#2D3748" />

      {/* Asas vermelhas em V */}
      <path
        d="M50 120 Q60 100 80 95 L100 110 L80 130 Q60 125 50 145 Z"
        fill="#DC2626"
      />
      <path
        d="M150 120 Q140 100 120 95 L100 110 L120 130 Q140 125 150 145 Z"
        fill="#DC2626"
      />
      <path
        d="M60 125 Q70 105 85 100 L100 115 L85 135 Q70 130 60 150 Z"
        fill="#B91C1C"
      />
      <path
        d="M140 125 Q130 105 115 100 L100 115 L115 135 Q130 130 140 150 Z"
        fill="#B91C1C"
      />
    </svg>
  );
};

// Componente de logo animado para loading
export const LogoLoading: React.FC<{ size?: number }> = ({ size = 60 }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-pulse">
        <LogoSymbolSVG size={size} />
      </div>
    </div>
  );
};

// Componente de logo para header
export const HeaderLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      aria-label="FitPro - Página Inicial"
    >
      <Logo variant="full" size="md" />
    </button>
  );
};

export default Logo;
