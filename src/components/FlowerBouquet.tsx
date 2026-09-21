import React, { useState } from 'react';
import { BouquetStyle } from '../types';
import { playSinglePluck } from '../utils/audio';

interface FlowerBouquetProps {
  style: BouquetStyle;
  interactive?: boolean;
  onFlowerClick?: (x: number, y: number) => void;
  className?: string;
}

export const FlowerBouquet: React.FC<FlowerBouquetProps> = ({
  style,
  interactive = true,
  onFlowerClick,
  className = '',
}) => {
  const [blooms, setBlooms] = useState<number[]>([]);

  const handleFlowerTap = (e: React.MouseEvent<SVGGElement>, id: number, noteFreq: number) => {
    if (!interactive) return;
    playSinglePluck(noteFreq, 1.0, 0.18);
    setBlooms((prev) => [...prev, id]);
    setTimeout(() => {
      setBlooms((prev) => prev.filter((b) => b !== id));
    }, 600);

    if (onFlowerClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      onFlowerClick(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* SVG illustrations */}
      <svg
        viewBox="0 0 400 420"
        className="w-full h-full max-h-[340px] drop-shadow-lg transition-transform duration-500 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d7c0f" />
            <stop offset="100%" stopColor="#365314" />
          </linearGradient>

          <linearGradient id="sunflowerPetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <radialGradient id="sunflowerCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#713f12" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#291102" />
          </radialGradient>

          <linearGradient id="rosePetalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Stems and foliage */}
        <g id="stems" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round">
          <path d="M200 400 Q195 320 180 230" />
          <path d="M200 400 Q205 330 240 210" />
          <path d="M200 400 Q170 340 130 250" />
          <path d="M200 400 Q230 350 270 260" />
          <path d="M200 400 Q200 300 200 170" />
        </g>

        {/* Leaves */}
        <g id="leaves" fill="#65a30d" stroke="#3f6212" strokeWidth="1.5">
          <path d="M165 310 Q120 300 110 330 Q140 340 168 325 Z" />
          <path d="M225 320 Q280 310 290 340 Q255 350 223 335 Z" />
          <path d="M180 270 Q130 240 135 215 Q165 240 182 260 Z" />
          <path d="M220 280 Q270 250 265 220 Q235 245 218 270 Z" />
        </g>

        {/* Style specific floral arrangement */}
        {style === 'sunflowers' && (
          <g id="sunflowers-arrangement" className="animate-gentle-sway origin-bottom">
            {/* Left Sunflower */}
            <g
              id="flower-left"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(1) ? 'scale(1.15)' : 'scale(1)',
                transformOrigin: '130px 220px',
              }}
              onClick={(e) => handleFlowerTap(e, 1, 523.25)}
            >
              {[...Array(14)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="130"
                  cy="220"
                  rx="14"
                  ry="48"
                  fill="url(#sunflowerPetal)"
                  transform={`rotate(${i * (360 / 14)} 130 220)`}
                  stroke="#ca8a04"
                  strokeWidth="0.6"
                />
              ))}
              <circle cx="130" cy="220" r="26" fill="url(#sunflowerCenter)" />
              <circle cx="130" cy="220" r="24" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </g>

            {/* Right Sunflower */}
            <g
              id="flower-right"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(2) ? 'scale(1.15)' : 'scale(1)',
                transformOrigin: '270px 225px',
              }}
              onClick={(e) => handleFlowerTap(e, 2, 659.25)}
            >
              {[...Array(14)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="270"
                  cy="225"
                  rx="13"
                  ry="46"
                  fill="url(#sunflowerPetal)"
                  transform={`rotate(${i * (360 / 14)} 270 225)`}
                  stroke="#ca8a04"
                  strokeWidth="0.6"
                />
              ))}
              <circle cx="270" cy="225" r="24" fill="url(#sunflowerCenter)" />
              <circle cx="270" cy="225" r="22" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </g>

            {/* Center Big Sunflower */}
            <g
              id="flower-center"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(3) ? 'scale(1.18)' : 'scale(1)',
                transformOrigin: '200px 145px',
              }}
              onClick={(e) => handleFlowerTap(e, 3, 783.99)}
            >
              {[...Array(16)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="200"
                  cy="145"
                  rx="16"
                  ry="58"
                  fill="url(#sunflowerPetal)"
                  transform={`rotate(${i * (360 / 16)} 200 145)`}
                  stroke="#ca8a04"
                  strokeWidth="0.8"
                />
              ))}
              <circle cx="200" cy="145" r="32" fill="url(#sunflowerCenter)" />
              <circle cx="200" cy="145" r="29" stroke="#facc15" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
              <circle cx="200" cy="145" r="16" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5" />
            </g>
          </g>
        )}

        {style === 'roses' && (
          <g id="roses-arrangement" className="animate-gentle-sway origin-bottom">
            {/* Left Rose */}
            <g
              id="rose-left"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(4) ? 'scale(1.15)' : 'scale(1)',
                transformOrigin: '135px 210px',
              }}
              onClick={(e) => handleFlowerTap(e, 4, 587.33)}
            >
              <circle cx="135" cy="210" r="38" fill="url(#rosePetalGrad)" />
              <path d="M110 210 Q135 175 160 210 Q135 245 110 210" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <path d="M120 195 Q145 185 150 215 Q125 230 120 195" fill="#eab308" opacity="0.7" />
              <circle cx="135" cy="205" r="12" fill="#ca8a04" opacity="0.8" />
            </g>

            {/* Right Rose */}
            <g
              id="rose-right"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(5) ? 'scale(1.15)' : 'scale(1)',
                transformOrigin: '265px 215px',
              }}
              onClick={(e) => handleFlowerTap(e, 5, 659.25)}
            >
              <circle cx="265" cy="215" r="36" fill="url(#rosePetalGrad)" />
              <path d="M240 215 Q265 180 290 215 Q265 250 240 215" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <path d="M250 200 Q275 190 280 220 Q255 235 250 200" fill="#eab308" opacity="0.7" />
              <circle cx="265" cy="210" r="11" fill="#ca8a04" opacity="0.8" />
            </g>

            {/* Center Big Rose */}
            <g
              id="rose-center"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(6) ? 'scale(1.18)' : 'scale(1)',
                transformOrigin: '200px 145px',
              }}
              onClick={(e) => handleFlowerTap(e, 6, 880.0)}
            >
              <circle cx="200" cy="145" r="48" fill="url(#rosePetalGrad)" />
              <path d="M165 145 Q200 100 235 145 Q200 190 165 145" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
              <path d="M178 130 Q212 115 222 150 Q188 175 178 130" fill="#eab308" opacity="0.75" />
              <path d="M188 140 Q205 130 212 148 Q198 160 188 140" fill="#ca8a04" opacity="0.9" />
              <circle cx="200" cy="144" r="8" fill="#a16207" />
            </g>
          </g>
        )}

        {style === 'wildflowers' && (
          <g id="wildflowers-arrangement" className="animate-gentle-sway origin-bottom">
            {/* Mixed meadow flowers */}
            {/* Top Center Daisy */}
            <g
              id="wild-1"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(7) ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: '200px 135px',
              }}
              onClick={(e) => handleFlowerTap(e, 7, 783.99)}
            >
              {[...Array(12)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="200"
                  cy="135"
                  rx="11"
                  ry="38"
                  fill="#fde047"
                  transform={`rotate(${i * (360 / 12)} 200 135)`}
                  stroke="#eab308"
                  strokeWidth="0.8"
                />
              ))}
              <circle cx="200" cy="135" r="18" fill="#ca8a04" />
              <circle cx="200" cy="135" r="12" fill="#a16207" />
            </g>

            {/* Left Blossom */}
            <g
              id="wild-2"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(8) ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: '140px 195px',
              }}
              onClick={(e) => handleFlowerTap(e, 8, 659.25)}
            >
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx="140"
                  cy="195"
                  r="16"
                  fill="#fef08a"
                  transform={`rotate(${i * (360 / 8)} 140 195) translate(0 -22)`}
                  stroke="#facc15"
                  strokeWidth="1"
                />
              ))}
              <circle cx="140" cy="195" r="15" fill="#eab308" />
            </g>

            {/* Right Blossom */}
            <g
              id="wild-3"
              className="cursor-pointer transition-transform duration-300"
              style={{
                transform: blooms.includes(9) ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: '260px 190px',
              }}
              onClick={(e) => handleFlowerTap(e, 9, 880.0)}
            >
              {[...Array(10)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="260"
                  cy="190"
                  rx="9"
                  ry="32"
                  fill="#facc15"
                  transform={`rotate(${i * (360 / 10)} 260 190)`}
                  stroke="#ca8a04"
                  strokeWidth="0.8"
                />
              ))}
              <circle cx="260" cy="190" r="14" fill="#854d0e" />
            </g>

            {/* Small accent buttercups */}
            <circle cx="170" cy="245" r="12" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
            <circle cx="170" cy="245" r="5" fill="#ca8a04" />
            <circle cx="230" cy="245" r="12" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
            <circle cx="230" cy="245" r="5" fill="#ca8a04" />
          </g>
        )}

        {style === 'chamomile' && (
          <g id="chamomile-arrangement" className="animate-gentle-sway origin-bottom">
            {/* Multiple delicate white/yellow sun chamomiles */}
            {[
              { cx: 200, cy: 140, r: 14, pR: 8, pL: 32, count: 14, note: 1046.5, id: 10 },
              { cx: 135, cy: 200, r: 11, pR: 6, pL: 25, count: 12, note: 783.99, id: 11 },
              { cx: 265, cy: 195, r: 11, pR: 6, pL: 25, count: 12, note: 880.0, id: 12 },
              { cx: 165, cy: 250, r: 9, pR: 5, pL: 20, count: 10, note: 659.25, id: 13 },
              { cx: 235, cy: 255, r: 9, pR: 5, pL: 20, count: 10, note: 587.33, id: 14 },
            ].map((flower) => (
              <g
                key={flower.id}
                className="cursor-pointer transition-transform duration-300"
                style={{
                  transform: blooms.includes(flower.id) ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${flower.cx}px ${flower.cy}px`,
                }}
                onClick={(e) => handleFlowerTap(e, flower.id, flower.note)}
              >
                {[...Array(flower.count)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx={flower.cx}
                    cy={flower.cy}
                    rx={flower.pR}
                    ry={flower.pL}
                    fill="#fef9c3"
                    transform={`rotate(${i * (360 / flower.count)} ${flower.cx} ${flower.cy})`}
                    stroke="#fde047"
                    strokeWidth="0.6"
                  />
                ))}
                <circle cx={flower.cx} cy={flower.cy} r={flower.r} fill="#eab308" />
                <circle cx={flower.cx} cy={flower.cy} r={flower.r - 3} fill="#ca8a04" opacity="0.6" />
              </g>
            ))}
          </g>
        )}

        {/* Satin golden ribbon wrapping the stems */}
        <g id="ribbon" filter="url(#softGlow)">
          <path
            d="M175 365 C190 355 210 355 225 365 C230 380 215 390 200 385 C185 390 170 380 175 365 Z"
            fill="url(#ribbonGrad)"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          {/* Bow loops */}
          <path
            d="M195 375 C160 360 155 400 190 385 Z"
            fill="url(#ribbonGrad)"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <path
            d="M205 375 C240 360 245 400 210 385 Z"
            fill="url(#ribbonGrad)"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          {/* Hanging tails */}
          <path
            d="M195 385 Q175 415 185 435"
            stroke="url(#ribbonGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M205 385 Q225 415 215 435"
            stroke="url(#ribbonGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Center knot */}
          <circle cx="200" cy="378" r="6" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Subtle Hint for recipient */}
      {interactive && (
        <div className="absolute bottom-2 text-center text-xs text-amber-700/70 font-medium tracking-wide">
          ✨ Toca las flores para hacerlas sonar y florecer ✨
        </div>
      )}
    </div>
  );
};
