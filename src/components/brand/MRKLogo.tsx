import React from 'react';

interface MRKVectorEmblemProps {
  className?: string;
  variant?: 'color' | 'mono-light' | 'mono-dark';
}

/**
 * True editable SVG vector mark for MRK Removals Adelaide.
 * Uses pure geometric vector paths (roof peak + aerodynamic truck silhouette + ruby motion arc).
 */
export const MRKVectorEmblem: React.FC<MRKVectorEmblemProps> = ({
  className = 'w-9 h-9',
  variant = 'color',
}) => {
  const isMonoLight = variant === 'mono-light';
  const isMonoDark = variant === 'mono-dark';

  const shieldFill = isMonoLight ? '#FFFFFF' : isMonoDark ? '#090D15' : '#0E1420';
  const strokePlatinum = isMonoLight ? '#FFFFFF' : isMonoDark ? '#090D15' : '#C9D2DC';
  const accentRuby = isMonoLight ? '#FFFFFF' : isMonoDark ? '#090D15' : '#C81036';
  const accentSapphire = isMonoLight ? '#E2E8F0' : isMonoDark ? '#242A34' : '#124FA3';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shield / architectural frame */}
      <path
        d="M32 4L56 16V36C56 48.5 45.8 57.2 32 60C18.2 57.2 8 48.5 8 36V16L32 4Z"
        fill={shieldFill}
        stroke={strokePlatinum}
        strokeWidth="2.2"
      />
      {/* Subtle sapphire inner horizon */}
      <path
        d="M13 36C19 32 27 30 35 30C43 30 49 32 51 34"
        stroke={accentSapphire}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Roofline peak */}
      <path
        d="M16 26L27 15L36 24"
        stroke={strokePlatinum}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stylized pantechnicon cab & body silhouette */}
      <path
        d="M22 25H40V37H22V25Z"
        fill={strokePlatinum}
        fillOpacity={isMonoLight || isMonoDark ? '0.2' : '0.15'}
        stroke={strokePlatinum}
        strokeWidth="1.8"
      />
      <path
        d="M40 28H46.5L49.5 32.5V37H40V28Z"
        stroke={strokePlatinum}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Ruby aerodynamic motion sweep */}
      <path
        d="M12 44C21 37.5 34 34.5 52 35.5"
        stroke={accentRuby}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Monogram M R K geometric bars */}
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fill={strokePlatinum}
        fontFamily="Outfit, sans-serif"
        fontWeight="800"
        fontSize="11"
        letterSpacing="1.5"
      >
        MRK
      </text>
    </svg>
  );
};
