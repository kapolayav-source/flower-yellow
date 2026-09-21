import React, { forwardRef } from 'react';
import { CardData } from '../types';
import { FlowerBouquet } from './FlowerBouquet';
import { Sparkles, Heart } from 'lucide-react';

interface CardPreviewProps {
  data: CardData;
  interactiveBouquet?: boolean;
  onFlowerClick?: (x: number, y: number) => void;
  className?: string;
  isExporting?: boolean;
}

export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ data, interactiveBouquet = true, onFlowerClick, className = '', isExporting = false }, ref) => {
    return (
      <div
        ref={ref}
        id="yellow-flower-card"
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50 via-amber-100/40 to-yellow-50/80 border-2 border-amber-200/80 shadow-xl shadow-amber-200/40 p-6 sm:p-8 flex flex-col items-center max-w-md w-full mx-auto transition-all ${className}`}
      >
        {/* Decorative corner motifs */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Tag */}
        <div className="z-10 flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100/90 border border-amber-300/70 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>21 de Septiembre · Flores Amarillas</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        </div>

        {/* Recipient Dedication Header */}
        <div className="z-10 text-center mb-1">
          <span className="text-xs uppercase tracking-widest text-amber-700/80 font-bold block">
            UN DETALLE ESPECIAL PARA
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-950 tracking-tight mt-0.5">
            {data.recipientName.trim() || 'Alguien Especial'} 💛
          </h2>
        </div>

        {/* Bouquet Centerpiece */}
        <div className="z-10 w-full py-1 my-1">
          <FlowerBouquet
            style={data.bouquetStyle}
            interactive={interactiveBouquet && !isExporting}
            onFlowerClick={onFlowerClick}
            className="h-56 sm:h-64"
          />
        </div>

        {/* Letter / Note Parchment Container */}
        <div className="z-10 w-full mt-2 bg-white/85 backdrop-blur-xs rounded-2xl p-5 border border-amber-200/70 shadow-xs relative">
          {/* Heart watermark / pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-xs border border-amber-300">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-relaxed text-center whitespace-pre-line pt-1">
            "{data.message || 'Que este día te llene de luz, risas y motivos para seguir brillando siempre.'}"
          </p>

          {/* Signature */}
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-800/80 font-medium">
            <span className="italic">Flores que nunca se marchitan 🌻</span>
            <span className="font-semibold text-amber-900">
              {data.senderName ? `De: ${data.senderName}` : 'Con mucho cariño ✨'}
            </span>
          </div>
        </div>

        {/* Bottom subtle aesthetic touch */}
        <div className="z-10 mt-4 flex items-center gap-2 text-[11px] text-amber-700/70 font-medium">
          <span>🌻 Alegría</span>
          <span>•</span>
          <span>✨ Luz infinita</span>
          <span>•</span>
          <span>💛 Primavera</span>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';
