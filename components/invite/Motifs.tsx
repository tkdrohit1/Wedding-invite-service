'use client';

import React from 'react';

// ============================================================================
// 1. RAJASTHANI ROYAL JHAROKHA & PALACE ARCH MOTIFS
// ============================================================================

export function RoyalJharokhaCrown({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center my-2 select-none pointer-events-none">
      {/* Ornate Chhatri Finial */}
      <svg
        viewBox="0 0 320 80"
        className="w-64 sm:w-80 h-auto max-h-20 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Dome / Kalash */}
        <path
          d="M160 5 C157 15, 153 22, 148 28 C155 30, 165 30, 172 28 C167 22, 163 15, 160 5 Z"
          fill={color}
        />
        <circle cx="160" cy="4" r="3" fill="#FFF2B2" />
        {/* Scalloped Palace Arch Canopy */}
        <path
          d="M20 75 Q90 35, 140 45 Q160 25, 180 45 Q230 35, 300 75"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
        />
        {/* Inner scalloped filigree */}
        <path
          d="M40 75 Q95 48, 145 54 Q160 38, 175 54 Q225 48, 280 75"
          stroke={color}
          strokeWidth="1.2"
          strokeDasharray="3 3"
          fill="none"
        />
        {/* Hanging Jhumki / Pearl Drops */}
        {[60, 100, 140, 160, 180, 220, 260].map((cx, i) => (
          <g key={i}>
            <line x1={cx} y1={cx === 160 ? 40 : 52} x2={cx} y2={cx === 160 ? 56 : 65} stroke={color} strokeWidth="1" />
            <circle cx={cx} cy={cx === 160 ? 59 : 68} r={cx === 160 ? 3.5 : 2.5} fill={color} />
          </g>
        ))}
        {/* Royal Peacocks Flanking the Dome */}
        <path
          d="M135 40 C125 35, 120 28, 125 22 C128 18, 134 20, 137 24 C134 27, 138 32, 142 36 Z"
          fill={color}
        />
        <path
          d="M185 40 C195 35, 200 28, 195 22 C192 18, 186 20, 183 24 C186 27, 182 32, 178 36 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function RoyalElephantProcession({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex items-center justify-between px-6 py-2 opacity-70 select-none pointer-events-none">
      {/* Left Marching Elephant */}
      <svg viewBox="0 0 70 40" className="w-12 h-8" fill={color}>
        <path d="M55 28 C55 22, 50 18, 44 18 C40 18, 38 15, 38 12 C38 8, 32 6, 26 8 C20 10, 18 16, 18 22 C15 22, 12 25, 12 29 L14 36 L18 36 L19 28 C22 28, 25 32, 28 32 L30 36 L34 36 L34 28 C38 28, 42 32, 45 32 L47 36 L51 36 L51 28 Z" />
        <circle cx="22" cy="12" r="1.5" fill="#000" />
        <path d="M12 25 C10 25, 8 28, 9 32 C10 34, 12 33, 11 31 Z" />
        {/* Royal Howdah Ambari */}
        <rect x="28" y="2" width="14" height="6" rx="2" fill={color} />
        <polygon points="35,0 32,3 38,3" fill="#FFF2B2" />
      </svg>

      {/* Decorative center divider */}
      <div className="flex-1 mx-4 flex items-center justify-center gap-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <span className="text-[10px] uppercase font-serif tracking-widest text-amber-300">
          ✦ Maharaja & Maharani Regalia ✦
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      {/* Right Marching Elephant (Flipped) */}
      <svg viewBox="0 0 70 40" className="w-12 h-8 transform -scale-x-100" fill={color}>
        <path d="M55 28 C55 22, 50 18, 44 18 C40 18, 38 15, 38 12 C38 8, 32 6, 26 8 C20 10, 18 16, 18 22 C15 22, 12 25, 12 29 L14 36 L18 36 L19 28 C22 28, 25 32, 28 32 L30 36 L34 36 L34 28 C38 28, 42 32, 45 32 L47 36 L51 36 L51 28 Z" />
        <circle cx="22" cy="12" r="1.5" fill="#000" />
        <path d="M12 25 C10 25, 8 28, 9 32 C10 34, 12 33, 11 31 Z" />
        <rect x="28" y="2" width="14" height="6" rx="2" fill={color} />
        <polygon points="35,0 32,3 38,3" fill="#FFF2B2" />
      </svg>
    </div>
  );
}

// ============================================================================
// 2. SOUTH INDIAN TEMPLE & GOPURAM MOTIFS
// ============================================================================

export function TempleGopuramHeader({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center select-none pointer-events-none mb-1">
      {/* Gopuram Spires Silhouette */}
      <svg viewBox="0 0 280 60" className="w-56 sm:w-72 h-auto" fill="none">
        {/* 5 Sacred Kalasams atop Gopuram */}
        {[-32, -16, 0, 16, 32].map((offset, i) => (
          <g key={i} transform={`translate(${140 + offset}, 10)`}>
            <path d="M0 -8 L-3 0 L3 0 Z" fill={color} />
            <circle cx="0" cy="3" r="3" fill={color} />
            <circle cx="0" cy="-9" r="1.5" fill="#FFF" />
          </g>
        ))}
        {/* Tiered Gopuram Crown Base */}
        <path
          d="M90 22 L190 22 L180 32 L100 32 Z"
          fill={color}
          opacity="0.8"
        />
        <path
          d="M75 34 L205 34 L195 44 L85 44 Z"
          fill={color}
          opacity="0.7"
        />
        <path
          d="M60 46 L220 46 L210 56 L70 56 Z"
          fill={color}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export function MangoLeafThoranam() {
  return (
    <div className="w-full overflow-hidden select-none pointer-events-none py-1">
      {/* Mango Leaf Garland with Marigold Flowers */}
      <svg viewBox="0 0 600 36" className="w-full h-8" fill="none">
        {/* Golden Rope */}
        <path d="M0 6 Q150 14, 300 6 Q450 14, 600 6" stroke="#D4AF37" strokeWidth="2" />
        {/* Repeating Mango Leaves */}
        {Array.from({ length: 15 }).map((_, i) => {
          const cx = 20 + i * 40;
          return (
            <g key={i} transform={`translate(${cx}, 8)`}>
              {/* Green Mango Leaf */}
              <path
                d="M0 0 C-6 10, -4 20, 0 24 C4 20, 6 10, 0 0 Z"
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth="0.5"
              />
              {/* Orange Marigold Blossom */}
              <circle cx="0" cy="2" r="3.5" fill="#FF8F00" />
              <circle cx="0" cy="2" r="1.5" fill="#FFD54F" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function KuthuVilakkuLamp({ color = '#D4AF37', className = '' }: { color?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 50 140" className="w-10 sm:w-12 h-auto drop-shadow-lg" fill="none">
        {/* Animated Flame */}
        <g className="animate-pulse">
          <path
            d="M25 5 C23 12, 19 16, 25 24 C31 16, 27 12, 25 5 Z"
            fill="url(#flameGrad)"
          />
          <circle cx="25" cy="18" r="4" fill="#FFF275" opacity="0.8" />
        </g>
        {/* Top Finial / Annam Bird */}
        <path d="M22 25 Q25 22, 28 25 L25 29 Z" fill={color} />
        {/* Oil Bowl with 5 Wicks */}
        <ellipse cx="25" cy="32" rx="16" ry="5" fill={color} />
        <ellipse cx="25" cy="31" rx="14" ry="3.5" fill="#FFB300" opacity="0.6" />
        {/* Tall Carved Brass Column */}
        <rect x="23" y="36" width="4" height="60" fill={color} rx="1" />
        {/* Ornamental Ribs / Discs on Stem */}
        <ellipse cx="25" cy="50" rx="8" ry="2.5" fill={color} />
        <ellipse cx="25" cy="70" rx="10" ry="3" fill={color} />
        <ellipse cx="25" cy="90" rx="12" ry="3.5" fill={color} />
        {/* Fluted Base Stand */}
        <path d="M12 135 C12 110, 38 110, 38 135 Z" fill={color} />
        <ellipse cx="25" cy="135" rx="20" ry="4" fill={color} />

        <defs>
          <radialGradient id="flameGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFD600" />
            <stop offset="100%" stopColor="#FF3D00" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export function SouthIndianKolam({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex items-center justify-center my-4 opacity-75 select-none pointer-events-none">
      <svg viewBox="0 0 200 50" className="w-48 sm:w-64 h-auto" fill="none">
        <path
          d="M20 25 Q40 5, 60 25 Q80 45, 100 25 Q120 5, 140 25 Q160 45, 180 25"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20 25 Q40 45, 60 25 Q80 5, 100 25 Q120 45, 140 25 Q160 5, 180 25"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Lotus Petals at Center */}
        <circle cx="100" cy="25" r="4" fill={color} />
        <circle cx="60" cy="25" r="2.5" fill={color} />
        <circle cx="140" cy="25" r="2.5" fill={color} />
      </svg>
    </div>
  );
}

// ============================================================================
// 3. MUGHAL & ISLAMIC NIKAH MEHRAB MOTIFS
// ============================================================================

export function MughalMehrabArch({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center select-none pointer-events-none mb-2">
      <svg viewBox="0 0 320 80" className="w-64 sm:w-80 h-auto" fill="none">
        {/* Crescent Moon & Star Finial */}
        <g transform="translate(160, 10)">
          <path
            d="M-4 -6 A 8 8 0 1 0 6 6 A 6 6 0 1 1 -4 -6 Z"
            fill={color}
          />
          <polygon points="5,-2 6,0 8,1 6,2 5,4 4,2 2,1 4,0" fill="#FFF2B2" />
        </g>
        {/* Pointed Scalloped Mughal Arch Line */}
        <path
          d="M10 75 C30 50, 70 35, 120 40 C140 25, 155 18, 160 12 C165 18, 180 25, 200 40 C250 35, 290 50, 310 75"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M25 75 C45 54, 80 42, 125 46 C143 32, 155 24, 160 18 C165 24, 177 32, 195 46 C240 42, 275 54, 295 75"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 2"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function HangingMoroccanLantern({ color = '#D4AF37', className = '' }: { color?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 40 120" className="w-8 sm:w-10 h-auto drop-shadow-xl" fill="none">
        {/* Hanging Chain */}
        <line x1="20" y1="0" x2="20" y2="45" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
        {/* Top Dome of Lantern */}
        <path d="M12 50 C12 44, 28 44, 28 50 Z" fill={color} />
        {/* Glass Lamp Body with Filigree Jaali */}
        <polygon points="10,50 30,50 25,85 15,85" fill="rgba(255,220,100,0.25)" stroke={color} strokeWidth="1.5" />
        {/* Internal Glow Light */}
        <circle cx="20" cy="65" r="5" fill="#FFE57F" className="animate-pulse" />
        {/* Geometric Jaali Lines */}
        <line x1="10" y1="50" x2="25" y2="85" stroke={color} strokeWidth="0.8" opacity="0.6" />
        <line x1="30" y1="50" x2="15" y2="85" stroke={color} strokeWidth="0.8" opacity="0.6" />
        {/* Bottom Finial */}
        <polygon points="17,85 23,85 20,95" fill={color} />
        <circle cx="20" cy="98" r="2" fill={color} />
      </svg>
    </div>
  );
}

// ============================================================================
// 4. PICHWAI & SACRED LOTUS MOTIFS
// ============================================================================

export function PichwaiSacredCow({ color = '#D4AF37', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 70"
      className={`w-16 sm:w-20 h-auto drop-shadow-md ${flip ? '-scale-x-100' : ''}`}
      fill="none"
    >
      {/* Holy Shrinathji White Cow with Golden Ornaments */}
      <path
        d="M20 35 C20 25, 30 18, 45 20 C60 22, 75 16, 85 24 C90 28, 92 38, 88 45 L88 62 L80 62 L80 48 L55 48 L55 62 L48 62 L48 45 C35 48, 25 45, 20 35 Z"
        fill="#FFF9E6"
        stroke={color}
        strokeWidth="1.2"
      />
      {/* Horns & Peacock Feather */}
      <path d="M78 18 C75 10, 72 8, 70 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M84 18 C88 10, 91 8, 93 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="82" cy="7" rx="3" ry="5" fill="#00897B" />
      {/* Red Handprint / Tilak Stamp */}
      <circle cx="50" cy="32" r="3.5" fill="#D32F2F" opacity="0.85" />
      <circle cx="62" cy="32" r="3.5" fill="#D32F2F" opacity="0.85" />
      {/* Golden Necklace / Ghungroo Bell */}
      <path d="M72 32 C75 38, 82 38, 85 32" stroke={color} strokeWidth="2" />
      <circle cx="78" cy="39" r="2.5" fill={color} />
    </svg>
  );
}

export function PichwaiLotusPond({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex items-center justify-center my-3 select-none pointer-events-none">
      <svg viewBox="0 0 300 45" className="w-64 sm:w-80 h-auto" fill="none">
        {/* Rippling Water Waves */}
        <path
          d="M0 35 Q30 28, 60 35 Q90 42, 120 35 Q150 28, 180 35 Q210 42, 240 35 Q270 28, 300 35"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Central Blooming Lotus */}
        <g transform="translate(150, 22)">
          {/* Outer Pink Petals */}
          <path d="M0 8 C-14 2, -18 -12, 0 -18 C18 -12, 14 2, 0 8 Z" fill="#F48FB1" stroke="#C2185B" strokeWidth="0.8" />
          <path d="M-6 8 C-22 4, -22 -6, -8 -12 Z" fill="#F06292" />
          <path d="M6 8 C22 4, 22 -6, 8 -12 Z" fill="#F06292" />
          {/* Golden Center */}
          <circle cx="0" cy="-2" r="3" fill="#FFD54F" />
        </g>
        {/* Smaller Side Lotuses */}
        <g transform="translate(70, 26)">
          <path d="M0 6 C-10 2, -12 -8, 0 -12 C12 -8, 10 2, 0 6 Z" fill="#F48FB1" />
        </g>
        <g transform="translate(230, 26)">
          <path d="M0 6 C-10 2, -12 -8, 0 -12 C12 -8, 10 2, 0 6 Z" fill="#F48FB1" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 5. BOTANICAL GARDEN & FLORAL WREATH MOTIFS
// ============================================================================

export function BotanicalFloralBower({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center select-none pointer-events-none mb-2">
      <svg viewBox="0 0 320 70" className="w-64 sm:w-80 h-auto" fill="none">
        {/* Graceful Vine Curve */}
        <path
          d="M20 50 Q160 5, 300 50"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Center Rose Blossom */}
        <g transform="translate(160, 25)">
          <circle cx="0" cy="0" r="9" fill="#E57373" />
          <circle cx="0" cy="0" r="6" fill="#EF5350" />
          <circle cx="0" cy="0" r="3" fill="#FFE082" />
          {/* Leaves flanking central rose */}
          <path d="M-12 0 C-18 -8, -26 -4, -20 4 Z" fill="#81C784" />
          <path d="M12 0 C18 -8, 26 -4, 20 4 Z" fill="#81C784" />
        </g>
        {/* Flanking Side Flowers */}
        {[-70, 70].map((dx, idx) => (
          <g key={idx} transform={`translate(${160 + dx}, 34)`}>
            <circle cx="0" cy="0" r="6" fill="#F8BBD0" />
            <circle cx="0" cy="0" r="3" fill="#FFF59D" />
            <path d="M0 -7 C-5 -12, 5 -12, 0 -7 Z" fill="#A5D6A7" />
          </g>
        ))}
        {/* Trailing Eucalyptus Sprigs */}
        {[-110, 110].map((dx, idx) => (
          <g key={idx} transform={`translate(${160 + dx}, 45)`}>
            <ellipse cx="0" cy="0" rx="4" ry="7" fill="#80CBC4" opacity="0.8" transform="rotate(25)" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================================
// 6. MODERN EDITORIAL & LUXE GEOMETRIC MOTIFS
// ============================================================================

export function EditorialMonogramHeader({
  groom,
  bride,
  color = '#D4AF37',
}: {
  groom: string;
  bride: string;
  color?: string;
}) {
  const gInit = groom.charAt(0).toUpperCase();
  const bInit = bride.charAt(0).toUpperCase();

  return (
    <div className="w-full flex flex-col items-center justify-center my-3 select-none">
      {/* High-Fashion Editorial Dual Monogram */}
      <div className="relative flex items-center justify-center gap-1 font-serif">
        <span
          className="text-5xl sm:text-6xl font-light tracking-tighter"
          style={{ color }}
        >
          {gInit}
        </span>
        <span className="text-xl sm:text-2xl font-sans font-thin text-zinc-400 italic mx-1">
          &
        </span>
        <span
          className="text-5xl sm:text-6xl font-light tracking-tighter"
          style={{ color }}
        >
          {bInit}
        </span>
      </div>

      {/* Modern Hairline Editorial Accent */}
      <div className="flex items-center gap-3 w-48 mt-2">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-400/60" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-300 font-sans font-semibold">
          THE UNION
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-400/60" />
      </div>
    </div>
  );
}

// ============================================================================
// 7. FOLK ART & ETHNIC HAND-PAINTED BORDERS (Warli / Madhubani / Kalamkari)
// ============================================================================

export function FolkArtHeaderBand({ color = '#D4AF37' }: { color?: string }) {
  return (
    <div className="w-full flex items-center justify-center py-2 select-none pointer-events-none">
      <svg viewBox="0 0 300 24" className="w-full max-w-sm h-6" fill="none">
        {/* Repeating Ethnic Triangle Pattern (Warli/Madhubani border) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 20}, 4)`}>
            <polygon points="0,16 10,0 20,16" stroke={color} strokeWidth="1" fill="none" />
            <circle cx="10" cy="9" r="1.5" fill={color} />
          </g>
        ))}
      </svg>
    </div>
  );
}
