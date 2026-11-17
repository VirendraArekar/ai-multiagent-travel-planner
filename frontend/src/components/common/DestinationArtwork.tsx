'use client';

import React from 'react';

interface DestinationArtworkProps {
  destination?: string;
  title?: string;
  className?: string;
}

export default function DestinationArtwork({
  destination = '',
  title = '',
  className = 'w-full h-full',
}: DestinationArtworkProps) {
  const normalized = (destination + ' ' + title).toLowerCase();

  // Tokyo / Japan artwork
  if (normalized.includes('tokyo') || normalized.includes('japan')) {
    return (
      <svg
        viewBox="0 0 800 500"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tokyoSkyArt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#311025" />
            <stop offset="35%" stopColor="#701a3c" />
            <stop offset="70%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="fujiGradArt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ffe4e6" />
            <stop offset="30%" stopColor="#380e22" />
            <stop offset="100%" stopColor="#1f0713" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#tokyoSkyArt)" />
        <circle cx="400" cy="220" r="130" fill="#e11d48" opacity="0.85" />
        <polygon points="400,140 220,440 580,440" fill="url(#fujiGradArt)" />
        <polygon points="400,140 350,220 370,210 385,230 400,215 415,230 430,210 450,220" fill="#ffffff" />
        <polygon points="170,310 160,325 180,325" fill="#17040d" />
        <rect x="166" y="325" width="8" height="15" fill="#17040d" />
        <polygon points="170,335 150,355 190,355" fill="#17040d" />
        <rect x="165" y="355" width="10" height="18" fill="#17040d" />
        <polygon points="170,365 140,390 200,390" fill="#17040d" />
        <rect x="162" y="390" width="16" height="55" fill="#17040d" />
        <rect x="620" y="320" width="110" height="12" rx="3" fill="#17040d" />
        <rect x="630" y="338" width="90" height="8" rx="2" fill="#17040d" />
        <rect x="645" y="320" width="10" height="125" fill="#17040d" />
        <rect x="695" y="320" width="10" height="125" fill="#17040d" />
        <rect y="440" width="800" height="60" fill="#14030b" />
        <circle cx="100" cy="180" r="14" fill="#f472b6" opacity="0.8" />
        <circle cx="120" cy="190" r="12" fill="#fbcfe8" opacity="0.9" />
        <circle cx="135" cy="170" r="10" fill="#fb7185" opacity="0.85" />
        <circle cx="150" cy="195" r="15" fill="#f472b6" opacity="0.8" />
        <circle cx="165" cy="175" r="11" fill="#fbcfe8" opacity="0.9" />
        <circle cx="190" cy="185" r="13" fill="#fb7185" opacity="0.8" />
        <ellipse cx="280" cy="260" rx="8" ry="4" fill="#fbcfe8" transform="rotate(25 280 260)" />
        <ellipse cx="320" cy="310" rx="7" ry="4" fill="#f472b6" transform="rotate(-15 320 310)" />
        <ellipse cx="480" cy="330" rx="9" ry="5" fill="#fbcfe8" transform="rotate(40 480 330)" />
        <text x="35" y="65" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="900" fill="#ffffff" letterSpacing="1.5">TOKYO, JAPAN</text>
        <text x="35" y="92" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600" fill="#fecdd3" letterSpacing="0.5">Tradition & Innovation • Shinkansen, Temples & Neon</text>
      </svg>
    );
  }

  // Bali / Indonesia / Tropical artwork
  if (normalized.includes('bali') || normalized.includes('indonesia') || normalized.includes('tropical') || normalized.includes('beach')) {
    return (
      <svg
        viewBox="0 0 800 500"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="baliSkyArt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4c0519" />
            <stop offset="40%" stopColor="#881337" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
          <linearGradient id="baliSeaArt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#701a3c" />
            <stop offset="50%" stopColor="#4c0519" />
            <stop offset="100%" stopColor="#1e040a" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#baliSkyArt)" />
        <circle cx="480" cy="220" r="110" fill="#fb923c" opacity="0.85" />
        <circle cx="480" cy="220" r="95" fill="#fed7aa" opacity="0.95" />
        <path d="M0,360 L120,330 L260,350 L400,320 L580,360 L800,340 L800,500 L0,500 Z" fill="#290714" opacity="0.7" />
        <rect y="380" width="800" height="120" fill="url(#baliSeaArt)" />
        <path d="M0,385 Q200,395 400,385 T800,388 L800,500 L0,500 Z" fill="#3b081c" opacity="0.8" />
        <path d="M420,390 Q480,410 540,390" stroke="#fecdd3" strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M380,410 Q480,430 580,410" stroke="#fecdd3" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M540,410 L680,410 L660,320 L560,320 Z" fill="#14030a" />
        <polygon points="610,240 570,280 650,280" fill="#14030a" />
        <polygon points="610,280 550,320 670,320" fill="#14030a" />
        <polygon points="610,190 585,220 635,220" fill="#14030a" />
        <polygon points="610,220 575,250 645,250" fill="#14030a" />
        <path d="M120,500 Q140,350 170,200" stroke="#14030a" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M170,200 Q230,170 300,190" stroke="#14030a" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M170,200 Q200,130 250,110" stroke="#14030a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M170,200 Q140,110 110,120" stroke="#14030a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M170,200 Q90,160 50,190" stroke="#14030a" strokeWidth="9" fill="none" strokeLinecap="round" />
        <text x="35" y="65" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="900" fill="#ffffff" letterSpacing="1.5">BALI, INDONESIA</text>
        <text x="35" y="92" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600" fill="#fed7aa" letterSpacing="0.5">Tropical Sanctuary • Emerald Terraces, Temples & Coastal Sunsets</text>
      </svg>
    );
  }

  // Default / Paris / France / Cultural artwork (Eiffel Tower & Sunset)
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="parisSkyArt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4c0519" />
          <stop offset="40%" stopColor="#881337" />
          <stop offset="70%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
        <linearGradient id="parisSunArt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="eiffelGradArt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c0710" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#parisSkyArt)" />
      <circle cx="560" cy="180" r="90" fill="url(#parisSunArt)" opacity="0.85" />
      <path d="M0,450 L40,430 L80,440 L120,410 L160,435 L220,420 L270,445 L320,400 L350,440 L430,420 L480,440 L540,415 L600,435 L680,410 L740,430 L800,425 L800,500 L0,500 Z" fill="#2a0815" opacity="0.7" />
      <rect y="440" width="800" height="60" fill="#1c050f" />
      <path d="M0,445 Q200,455 400,445 T800,448 L800,500 L0,500 Z" fill="#2d0a18" opacity="0.8" />
      <path d="M520,450 Q560,470 600,450" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M500,465 Q560,485 620,465" stroke="#fda4af" strokeWidth="1.5" fill="none" opacity="0.4" />
      <line x1="400" y1="50" x2="400" y2="120" stroke="#12030a" strokeWidth="4" />
      <circle cx="400" cy="50" r="4" fill="#ffd1d9" />
      <polygon points="396,120 404,120 408,180 392,180" fill="url(#eiffelGradArt)" />
      <rect x="386" y="180" width="28" height="6" rx="2" fill="#12030a" />
      <polygon points="390,186 410,186 422,290 378,290" fill="url(#eiffelGradArt)" />
      <line x1="390" y1="186" x2="422" y2="290" stroke="#3d0a1d" strokeWidth="1.5" />
      <line x1="410" y1="186" x2="378" y2="290" stroke="#3d0a1d" strokeWidth="1.5" />
      <rect x="368" y="290" width="64" height="8" rx="2" fill="#12030a" />
      <path d="M374,298 L340,450 L365,450 L382,350 Q400,320 418,350 L435,450 L460,450 L426,298 Z" fill="url(#eiffelGradArt)" />
      <path d="M372,450 Q400,380 428,450" fill="#2d0a18" opacity="0.5" />
      <path d="M372,450 Q400,380 428,450" stroke="#12030a" strokeWidth="3" fill="none" />
      <path d="M0,470 Q200,465 400,470 T800,468 L800,500 L0,500 Z" fill="#12030a" />
      <circle cx="120" cy="455" r="25" fill="#1f0612" />
      <circle cx="150" cy="460" r="20" fill="#15030c" />
      <circle cx="680" cy="458" r="28" fill="#1f0612" />
      <circle cx="720" cy="462" r="22" fill="#15030c" />
      <text x="35" y="65" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="900" fill="#ffffff" letterSpacing="1.5">
        {destination ? destination.toUpperCase() : 'PARIS, FRANCE'}
      </text>
      <text x="35" y="92" fontFamily="system-ui, -apple-system, sans-serif" fontSize="14" fontWeight="600" fill="#fecdd3" letterSpacing="0.5">
        {title || 'The City of Light • Art, Wine & Architecture'}
      </text>
    </svg>
  );
}
