"use client"

interface PlaceholderLogoProps {
  size?: number
  className?: string
}

export function PlaceholderLogo({ size = 40, className = "" }: PlaceholderLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Intentionally basic/poor quality circle */}
        <circle cx="50" cy="50" r="45" fill="#333" stroke="#666" strokeWidth="2" />

        {/* Basic eye shape */}
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="#777" />

        {/* Basic pupil */}
        <circle cx="50" cy="50" r="10" fill="#222" />

        {/* Poorly drawn eyelid */}
        <path d="M20 40 Q50 10 80 40" stroke="#555" strokeWidth="3" fill="none" />

        {/* Text saying "LOGO" */}
        <text x="50" y="85" textAnchor="middle" fill="#999" fontSize="12" fontFamily="monospace">
          LOGO
        </text>
      </svg>
    </div>
  )
}

