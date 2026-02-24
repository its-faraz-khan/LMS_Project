import React from 'react';

export default function IllustrationPanel() {
  return (
    <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-slate-100 to-blue-50 w-5/12 items-center justify-center overflow-hidden p-8">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <span className="logo-mark text-2xl">uu</span>
      </div>

      {/* Decorative elements */}
      <svg className="absolute top-10 right-10 opacity-30" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8Z" fill="#1B4D3E" />
      </svg>
      <svg className="absolute top-28 left-12 opacity-20" width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5Z" fill="#1B4D3E" />
      </svg>

      {/* Main Illustration SVG */}
      <div className="animate-float">
        <svg width="320" height="360" viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground line */}
          <line x1="60" y1="340" x2="260" y2="340" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />

          {/* Red sad ball (bottom) */}
          <circle cx="160" cy="310" r="38" fill="#EF5350" />
          <circle cx="160" cy="310" r="38" fill="url(#redGrad)" />
          {/* sad face */}
          <circle cx="148" cy="303" r="4" fill="#333" />
          <circle cx="172" cy="303" r="4" fill="#333" />
          <path d="M148 322 Q160 312 172 322" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Person body */}
          {/* Legs */}
          <line x1="155" y1="270" x2="145" y2="290" stroke="#1B3A6B" strokeWidth="10" strokeLinecap="round" />
          <line x1="165" y1="270" x2="185" y2="300" stroke="#1B3A6B" strokeWidth="10" strokeLinecap="round" />
          {/* Shoe left */}
          <ellipse cx="141" cy="293" rx="10" ry="6" fill="#E8622A" transform="rotate(-20 141 293)" />
          {/* Shoe right */}
          <ellipse cx="188" cy="303" rx="10" ry="6" fill="#E8622A" transform="rotate(10 188 303)" />

          {/* Torso */}
          <rect x="140" y="210" width="42" height="65" rx="12" fill="#87CEEB" />

          {/* Left arm holding yellow ball */}
          <line x1="140" y1="225" x2="100" y2="250" stroke="#87CEEB" strokeWidth="12" strokeLinecap="round" />
          {/* Right arm up holding green ball */}
          <line x1="182" y1="215" x2="215" y2="170" stroke="#87CEEB" strokeWidth="12" strokeLinecap="round" />

          {/* Head */}
          <circle cx="161" cy="198" r="24" fill="#FFCCAA" />
          {/* Hair */}
          <ellipse cx="161" cy="178" rx="22" ry="10" fill="#E06060" />
          {/* Face */}
          <circle cx="154" cy="198" r="3" fill="#555" />
          <circle cx="168" cy="198" r="3" fill="#555" />
          <path d="M154 207 Q161 213 168 207" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Yellow happy ball (left) */}
          <circle cx="90" cy="255" r="34" fill="#FFC107" />
          <circle cx="90" cy="255" r="34" fill="url(#yellowGrad)" />
          <circle cx="78" cy="248" r="4" fill="#333" />
          <circle cx="102" cy="248" r="4" fill="#333" />
          <path d="M78 263 Q90 272 102 263" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Green happy big ball (top right) */}
          <circle cx="220" cy="145" r="44" fill="#4CAF50" />
          <circle cx="220" cy="145" r="44" fill="url(#greenGrad)" />
          <circle cx="207" cy="137" r="5" fill="#1B5E20" />
          <circle cx="233" cy="137" r="5" fill="#1B5E20" />
          <path d="M207 157 Q220 167 233 157" stroke="#1B5E20" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Olive small ball (knee level) */}
          <circle cx="200" cy="282" r="26" fill="#8BC34A" />
          <circle cx="200" cy="282" r="26" fill="url(#oliveGrad)" />
          <circle cx="192" cy="276" r="3" fill="#33691E" />
          <circle cx="208" cy="276" r="3" fill="#33691E" />
          <path d="M192 289 Q200 295 208 289" stroke="#33691E" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Clouds */}
          <ellipse cx="260" cy="200" rx="22" ry="12" fill="white" opacity="0.8" />
          <ellipse cx="250" cy="195" rx="15" ry="10" fill="white" opacity="0.8" />
          <ellipse cx="275" cy="197" rx="14" ry="9" fill="white" opacity="0.8" />

          <ellipse cx="70" cy="320" rx="30" ry="14" fill="white" opacity="0.7" />
          <ellipse cx="57" cy="316" rx="18" ry="11" fill="white" opacity="0.7" />
          <ellipse cx="90" cy="317" rx="16" ry="10" fill="white" opacity="0.7" />

          {/* Sparkles */}
          <text x="305" y="130" fontSize="18" fill="#1B4D3E" opacity="0.4">✦</text>
          <text x="50" y="180" fontSize="14" fill="#1B4D3E" opacity="0.3">✦</text>
          <text x="115" y="130" fontSize="10" fill="#1B4D3E" opacity="0.25">+</text>
          <text x="285" y="280" fontSize="14" fill="#1B4D3E" opacity="0.3">×</text>
          <text x="40" y="260" fontSize="10" fill="#1B4D3E" opacity="0.25">○</text>

          {/* Gradients */}
          <defs>
            <radialGradient id="redGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="yellowGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="greenGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="oliveGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom decorative dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary opacity-30" />
        <div className="w-2 h-2 rounded-full bg-primary opacity-50" />
        <div className="w-2 h-2 rounded-full bg-primary opacity-30" />
      </div>
    </div>
  );
}
