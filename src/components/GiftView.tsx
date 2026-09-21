import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { CardData } from '../types';
import { CardPreview } from './CardPreview';
import { startYellowFlowerMelody, stopMelody, playSinglePluck } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Send, Gift, RefreshCw } from 'lucide-react';

interface GiftViewProps {
  cardData: CardData;
  onCreateYourOwn: () => void;
}

export const GiftView: React.FC<GiftViewProps> = ({ cardData, onCreateYourOwn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Trigger celebratory yellow petal confetti
  const triggerConfetti = () => {
    // Left burst
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#fef08a', '#facc15', '#f59e0b', '#eab308', '#ffffff'],
      shapes: ['circle'],
      scalar: 1.2,
    });
    // Right burst
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#fef08a', '#facc15', '#f59e0b', '#eab308', '#ffffff'],
      shapes: ['circle'],
      scalar: 1.2,
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
    triggerConfetti();
    // Start gentle ambient melody
    if (!isMuted) {
      startYellowFlowerMelody(true);
    }
  };

  const handleFlowerTapFx = (x: number, y: number) => {
    confetti({
      particleCount: 15,
      spread: 40,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
      colors: ['#facc15', '#fef08a', '#fbbf24'],
      scalar: 0.8,
    });
  };

  const toggleAudio = () => {
    if (isMuted) {
      setIsMuted(false);
      startYellowFlowerMelody(true);
    } else {
      setIsMuted(true);
      stopMelody();
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
    };
  }, []);

  // WhatsApp reply link
  const replyText = encodeURIComponent(
    `¡Hola! 🌻💛 Muchísimas gracias por el detalle de las flores amarillas, ¡me encantó! ✨ Te mando un abrazote enorme.`
  );
  const whatsappReplyUrl = `https://api.whatsapp.com/send?text=${replyText}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100/60 via-yellow-50 to-amber-50 flex flex-col items-center justify-between p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Falling ambient CSS petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute -top-10 w-4 h-4 bg-yellow-300/60 rounded-full blur-[1px] animate-petal"
            style={{
              left: `${(i * 9 + 4) % 100}%`,
              animationDuration: `${7 + (i % 5) * 2}s`,
              animationDelay: `${(i * 0.7) % 4}s`,
              transform: `scale(${0.6 + (i % 4) * 0.2})`,
            }}
          />
        ))}
      </div>

      {/* Top Bar with Audio Control */}
      <header className="w-full max-w-md flex items-center justify-between z-20 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌻</span>
          <span className="font-serif-display font-bold text-amber-950 text-base sm:text-lg">
            21 de Septiembre
          </span>
        </div>

        {isOpen && (
          <button
            id="btn-toggle-music"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-xs transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
            <span>{isMuted ? 'Música: Off' : 'Música: On'}</span>
          </button>
        )}
      </header>

      {/* Main Container: Unopened Envelope vs Open Card */}
      <main className="w-full max-w-md my-auto z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white/95 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-md mb-4 animate-bounce">
                🌻
              </div>

              <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                TIENES UN DETALLE ESPECIAL
              </span>

              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-950 mt-1 mb-2">
                Para {cardData.recipientName || 'Ti'} 💛
              </h1>

              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                {cardData.senderName ? (
                  <span>
                    <strong className="text-amber-900">{cardData.senderName}</strong> te ha preparado un ramo virtual de flores amarillas para este 21 de septiembre.
                  </span>
                ) : (
                  <span>Alguien especial te ha enviado un ramo virtual de flores amarillas para alegrar tu día.</span>
                )}
              </p>

              <button
                id="btn-open-gift"
                onClick={handleOpen}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-bold text-base shadow-lg shadow-amber-300/50 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
              >
                <Gift className="w-5 h-5 text-amber-900" />
                <span>Toca para abrir tu ramo 🌻</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-amber-700/80">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flores amarillas eternas</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="opened-card"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              className="w-full flex flex-col items-center gap-4"
            >
              <CardPreview
                data={cardData}
                interactiveBouquet={true}
                onFlowerClick={handleFlowerTapFx}
              />

              {/* Action Buttons for the recipient */}
              <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-2">
                <a
                  id="btn-reply-whatsapp"
                  href={whatsappReplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Dar las gracias por WhatsApp</span>
                </a>

                <button
                  id="btn-create-own-flowers"
                  onClick={onCreateYourOwn}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-200/90 hover:bg-amber-300 border border-amber-300 text-amber-950 font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-800" />
                  <span>Enviar a mis contactos</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer watermark */}
      <footer className="w-full max-w-md text-center py-2 text-xs text-amber-800/60 z-10">
        ✨ 21 de Septiembre · Flores amarillas que nunca se marchitan 🌻
      </footer>
    </div>
  );
};
