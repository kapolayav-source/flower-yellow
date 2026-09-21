import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { ENCOURAGING_QUOTES } from '../data/quotes';
import { playSinglePluck, startYellowFlowerMelody, stopMelody } from '../utils/audio';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import sunsetLandscapeImg from '../assets/images/sunset_flower_field_1789954521081.jpg';

interface ClickedFlower {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const YellowFlowerLandscape: React.FC = () => {
  // Quotes index
  const [quoteIndex, setQuoteIndex] = useState<number>(() => {
    return Math.floor(Math.random() * ENCOURAGING_QUOTES.length);
  });

  // Audio state
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Planted interactive blooms on touch
  const [plantedFlowers, setPlantedFlowers] = useState<ClickedFlower[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeQuote = ENCOURAGING_QUOTES[quoteIndex];

  // Musical chord notes
  const HARP_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 987.77, 1046.5];

  // Audio cleanup
  useEffect(() => {
    return () => {
      stopMelody();
    };
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => {
      let next = Math.floor(Math.random() * ENCOURAGING_QUOTES.length);
      if (next === prev) {
        next = (prev + 1) % ENCOURAGING_QUOTES.length;
      }
      return next;
    });
  };

  // Click anywhere on screen to bloom a flower and advance phrase
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.no-landscape-click')) {
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Play sweet harp note
    const note = HARP_NOTES[Math.floor(Math.random() * HARP_NOTES.length)];
    playSinglePluck(note, 1.3, 0.16);

    // Spawn blooming daffodil / yellow flower
    const flower: ClickedFlower = {
      id: Date.now() + Math.random(),
      x,
      y,
      scale: 0.85 + Math.random() * 0.35,
      rotation: -20 + Math.random() * 40,
    };

    setPlantedFlowers((prev) => [...prev.slice(-18), flower]);

    // Golden twilight petal burst
    confetti({
      particleCount: 14,
      spread: 50,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#fef08a', '#facc15', '#f59e0b', '#fdba74', '#ffffff'],
      shapes: ['circle'],
      scalar: 0.85,
    });

    handleNextQuote();
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAudioActive) {
      setIsAudioActive(true);
      startYellowFlowerMelody(true);
    } else {
      setIsAudioActive(false);
      stopMelody();
    }
  };

  return (
    <div
      ref={containerRef}
      id="sunset-flower-landscape"
      onClick={handleScreenClick}
      className="relative w-full min-h-screen overflow-hidden cursor-pointer select-none flex flex-col justify-between"
    >
      {/* --- CINEMATIC LIVING LANDSCAPE BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Photographic Sunset Daffodil Field with Breathing Camera Motion */}
        <div
          className="absolute inset-[-4%] w-[108%] h-[108%] bg-cover bg-center animate-landscape-breathe"
          style={{
            backgroundImage: `url(${sunsetLandscapeImg})`,
            filter: 'saturate(1.1) contrast(1.05) brightness(0.98)',
          }}
        />

        {/* Sunset Sky Warm Horizon Haze Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-950/20 mix-blend-multiply" />

        {/* Warm Golden Hour Sunset Sunburst / Flare on Horizon */}
        <div
          className="absolute top-[38%] left-[26%] -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-radial from-amber-200/90 via-orange-400/40 to-transparent blur-2xl animate-sun-glow pointer-events-none"
        />

        {/* Drifting Clouds Shadows & Light Texture in Sky */}
        <div className="absolute top-0 left-0 w-full h-[45%] pointer-events-none animate-cloud-drift opacity-40 mix-blend-soft-light">
          <svg viewBox="0 0 1200 400" className="w-full h-full object-cover">
            <ellipse cx="300" cy="120" rx="350" ry="80" fill="#fde047" opacity="0.4" />
            <ellipse cx="800" cy="90" rx="400" ry="70" fill="#fb923c" opacity="0.35" />
          </svg>
        </div>

        {/* Golden Twilight Pollen & Fireflies Drifting Upward */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-200/90 shadow-[0_0_8px_#fde047] animate-golden-float"
              style={{
                left: `${(i * 5.3 + 2) % 98}%`,
                bottom: '-20px',
                animationDuration: `${8 + (i % 6) * 2}s`,
                animationDelay: `${(i * 0.7) % 6}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Sunset Petals Drifting in the Wind */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute -top-10 w-3.5 h-4.5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-[0.4px] shadow-sm animate-petal"
              style={{
                left: `${(i * 7.5 + 3) % 96}%`,
                animationDuration: `${6 + (i % 4) * 1.8}s`,
                animationDelay: `${(i * 0.5) % 5}s`,
                transform: `scale(${0.75 + (i % 3) * 0.25})`,
              }}
            />
          ))}
        </div>

        {/* Fluttering Twilight Butterflies */}
        <div className="absolute top-[48%] left-[18%] sm:left-[28%] pointer-events-none animate-gentle-sway">
          <span className="text-xl sm:text-2xl filter drop-shadow-md inline-block transform -rotate-12 animate-bounce opacity-90">
            🦋
          </span>
        </div>
        <div
          className="absolute top-[52%] right-[22%] sm:right-[35%] pointer-events-none animate-gentle-sway"
          style={{ animationDelay: '2s' }}
        >
          <span className="text-lg sm:text-xl filter drop-shadow-md inline-block transform rotate-12 opacity-85">
            🦋
          </span>
        </div>
      </div>

      {/* --- TOP CONTROL (DISCREET & CLEAN AUDIO TOGGLE ONLY) --- */}
      <header className="relative z-30 w-full max-w-5xl mx-auto p-4 sm:p-6 flex items-center justify-end pointer-events-none">
        <div className="no-landscape-click pointer-events-auto">
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-amber-200 border border-amber-300/30 shadow-lg backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
            title={isAudioActive ? 'Silenciar música' : 'Activar música de fondo'}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-yellow-300 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-300" />
            )}
          </button>
        </div>
      </header>

      {/* --- INTERACTIVE BLOOMS (TOUCH SPAWNS REALISTIC DAFFODILS) --- */}
      {plantedFlowers.map((f) => (
        <div
          key={f.id}
          className="absolute z-20 pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: `${f.x - 28}px`,
            top: `${f.y - 28}px`,
            transform: `scale(${f.scale}) rotate(${f.rotation}deg)`,
          }}
        >
          {/* Animated realistic golden daffodil svg flower bloom */}
          <div className="animate-bounce">
            <svg width="56" height="56" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-xl">
              <circle cx="50" cy="50" r="14" fill="#fbbf24" />
              {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
                <path
                  key={idx}
                  d="M50 50 Q38 18 50 8 Q62 18 50 50 Z"
                  fill="#facc15"
                  stroke="#eab308"
                  strokeWidth="1.5"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
              <ellipse cx="50" cy="50" rx="13" ry="11" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              <circle cx="50" cy="50" r="7" fill="#ea580c" opacity="0.8" />
              <circle cx="50" cy="50" r="3" fill="#fef08a" />
            </svg>
          </div>
        </div>
      ))}

      {/* --- CENTER FLOATING GLASS PHRASE CARD --- */}
      <main className="relative z-30 w-full max-w-lg mx-auto px-5 py-6 my-auto flex flex-col items-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuote.id}
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ type: 'spring', damping: 24, stiffness: 130 }}
            className="w-full bg-stone-950/40 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-amber-300/40 shadow-2xl shadow-black/60 flex flex-col items-center text-center relative overflow-hidden pointer-events-auto"
            style={{
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6), inset 0 1px 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>21 de Septiembre · Flores Amarillas</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            {/* The Inspiring Phrase */}
            <p className="font-serif-display text-xl sm:text-2xl text-amber-100 font-bold leading-relaxed tracking-tight px-2 my-2 drop-shadow-md">
              "{activeQuote.text}"
            </p>

            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent my-3.5" />

            {/* Subtle Interactive Tap Instruction */}
            <span className="text-xs text-amber-200/85 font-medium italic drop-shadow-xs">
              ✨ Toca el paisaje para que florezca otra frase ✨
            </span>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- REALISTIC FOREGROUND SWAYING DAFFODILS MEADOW --- */}
      <div className="relative z-20 w-full pointer-events-none mt-auto overflow-hidden">
        {/* Dense field of swaying golden daffodils in the immediate foreground */}
        <div className="w-full h-32 sm:h-44 relative flex items-end justify-between px-2 sm:px-6">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="relative origin-bottom animate-gentle-sway -mb-2"
              style={{
                animationDuration: `${3.2 + (i % 5) * 0.7}s`,
                animationDelay: `${(i * 0.3) % 2.5}s`,
                transform: `scale(${0.85 + (i % 3) * 0.2})`,
              }}
            >
              {/* Natural Narcissus SVG */}
              <svg width="70" height="110" viewBox="0 0 100 160" fill="none" className="filter drop-shadow-lg">
                {/* Stem */}
                <path
                  d="M50 160 Q45 100 50 60"
                  stroke="#2d5a27"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Dark Green Foliage Blades */}
                <path
                  d="M48 160 Q20 110 32 75"
                  stroke="#1b4317"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M52 160 Q80 120 68 85"
                  stroke="#1b4317"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Flower Head */}
                <g transform="translate(50, 60)">
                  {/* Yellow Outer Petals */}
                  <path d="M0 0 Q-18 -22 0 -36 Q18 -22 0 0" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M0 0 Q-28 -8 -36 8 Q-16 12 0 0" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M0 0 Q28 -8 36 8 Q16 12 0 0" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M0 0 Q-18 22 0 36 Q18 22 0 0" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M0 0 Q-24 16 -30 26 Q-10 24 0 0" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />
                  <path d="M0 0 Q24 16 30 26 Q10 24 0 0" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />

                  {/* Golden Center Corona */}
                  <ellipse cx="0" cy="0" rx="12" ry="9" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="#ea580c" />
                  <circle cx="0" cy="0" r="2" fill="#fffbeb" />
                </g>
              </svg>
            </div>
          ))}
        </div>

        {/* Soft bottom vignette grounding */}
        <div className="w-full h-10 bg-gradient-to-t from-black/80 to-transparent -mt-6" />
      </div>
    </div>
  );
};
