"use client"

import { motion } from "framer-motion"

interface VirtueEyeLogoProps {
  size?: number
  className?: string
}

export function VirtueEyeLogo({ size = 40, className = "" }: VirtueEyeLogoProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0.9 }}
      animate={{
        scale: [0.98, 1.02, 0.98],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 4,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer glow ring */}
        <circle cx="50" cy="50" r="48" fill="url(#outerRingGradient)" className="opacity-50" />

        {/* Main ring */}
        <circle cx="50" cy="50" r="45" fill="url(#ringGradient)" />

        {/* Eye shape */}
        <ellipse cx="50" cy="50" rx="35" ry="38" fill="url(#eyeGradient)" />

        {/* Pupil */}
        <path d="M50 25 L50 75" strokeWidth="12" strokeLinecap="round" stroke="black" />

        {/* Sharp corners */}
        <path d="M30 50 L70 50" strokeWidth="2" stroke="rgba(255,255,255,0.5)" />

        {/* Highlights */}
        <path d="M60 35 L65 32" strokeWidth="3" strokeLinecap="round" stroke="white" className="opacity-80" />
        <path d="M35 45 L40 42" strokeWidth="2" strokeLinecap="round" stroke="white" className="opacity-60" />

        {/* Gradients */}
        <defs>
          <radialGradient id="outerRingGradient" cx="50" cy="50" r="48" gradientUnits="userSpaceOnUse">
            <stop offset="80%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </radialGradient>

          <radialGradient id="ringGradient" cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#6B21A8" />
          </radialGradient>

          <radialGradient id="eyeGradient" cx="50" cy="50" r="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

