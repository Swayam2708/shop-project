import React from "react";

interface GoldCornerProps {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}

export default function GoldCorner({ className, flipX = false, flipY = false }: GoldCornerProps) {
  const transform = `${flipX ? "scaleX(-1)" : ""} ${flipY ? "scaleY(-1)" : ""}`.trim();
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={transform ? { transform } : undefined}
    >
      <path d="M 4,4 L 96,4 C 80,4 60,10 50,30 C 40,50 30,80 30,96 M 4,4 L 4,96 C 4,80 10,60 30,50 C 50,40 80,30 96,30" stroke="url(#corner-gold-gradient-shared)" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M 12,12 L 60,12 C 50,12 40,18 35,30 C 30,42 22,50 12,60 L 12,12" stroke="url(#corner-gold-gradient-shared)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <circle cx="6" cy="6" r="2.5" fill="#dfba73" />
      <circle cx="20" cy="20" r="1.5" fill="#dfba73" opacity="0.7" />
      <defs>
        <linearGradient id="corner-gold-gradient-shared" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AA851C" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#F3E6C4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
