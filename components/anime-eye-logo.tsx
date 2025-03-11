"use client"

import { motion } from "framer-motion"

interface AnimeEyeLogoProps {
  size?: number
  className?: string
}

export function AnimeEyeLogo({ size = 40, className = "" }: AnimeEyeLogoProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0.9 }}
      animate={{
        scale: [0.95, 1.05, 0.95],
        filter: [
          "drop-shadow(0 0 8px rgba(255, 100, 0, 0.7))",
          "drop-shadow(0 0 12px rgba(255, 100, 0, 0.9))",
          "drop-shadow(0 0 8px rgba(255, 100, 0, 0.7))",
        ],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Eye outer glow */}
        <motion.ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="30"
          fill="url(#eyeGradient)"
          animate={{
            filter: ["blur(5px)", "blur(8px)", "blur(5px)"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        />

        {/* Eye shape */}
        <ellipse cx="50" cy="50" rx="40" ry="25" fill="url(#eyeInnerGradient)" />

        {/* Pupil */}
        <motion.path
          d="M50 30 L50 70"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="black"
          animate={{
            d: ["M50 35 L50 65", "M50 38 L50 62", "M50 35 L50 65"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
        />

        {/* Highlights */}
        <motion.circle
          cx="65"
          cy="40"
          r="5"
          fill="rgba(255, 255, 255, 0.7)"
          animate={{
            opacity: [0.7, 0.9, 0.7],
            r: [5, 6, 5],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        />
        <circle cx="35" cy="45" r="3" fill="rgba(255, 255, 255, 0.5)" />

        {/* Gradients */}
        <defs>
          <radialGradient id="eyeGradient" cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="70%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#8B0000" />
          </radialGradient>

          <radialGradient id="eyeInnerGradient" cx="50" cy="50" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFCC00" />
            <stop offset="60%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#FF0000" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

