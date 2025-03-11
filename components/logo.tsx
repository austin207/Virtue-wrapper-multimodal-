import Image from "next/image"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* 
        This uses the favicon.ico from the public folder
        You can replace favicon.ico with your own logo file
      */}
      <Image src="/favicon.ico" alt="Virtue Logo" width={size} height={size} className="rounded-full" priority />
    </div>
  )
}

