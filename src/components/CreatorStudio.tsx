import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { CardData, BouquetStyle, RelationshipType, ToneType } from '../types';
import { RELATIONSHIPS, BOUQUET_STYLES, PRESET_MESSAGES } from '../data/presets';
import { CardPreview } from './CardPreview';
import { buildShareableUrl, formatWhatsAppMessage } from '../utils/cardUrl';
import {
  Sparkles,
  Send,
  Copy,
  Download,
  Eye,
  Plus,
  Trash2,
  Check,
  Wand2,
  RefreshCw,
  Heart,
  MessageCircle,
} from 'lucide-react';

interface ContactCardItem {
  id: string;
  name: string;
  relationship: RelationshipType;
  tone: ToneType;
  style: BouquetStyle;
  message: string;
}

interface CreatorStudioProps {
  senderName: string;
  setSenderName: (val: string) => void;
  onPreviewGift: (card: CardData) => void;
}

const INITIAL_CONTACTS: ContactCardItem[] = [
  {
    id: 'contact-1',
    name: 'Sofi',
    relationship: 'amiga',
    tone: 'tierno',
    style: 'sunflowers',
    message:
      '¡Feliz 21 de septiembre a la amiga más leal y bonita del mundo! 🌻 Gracias por iluminar mis días con tus risas y consejos. Que este inicio de primavera te traiga tanta alegría como la que regalas a los demás.',
  },
  {
    id: 'contact-2',
    name: 'Mamá',
    relationship: 'mama',
    tone: 'tierno',
    style: 'wildflowers',
    message:
      'Mamá, tú eres la verdadera luz de nuestra vida y quien florece con más fuerza. Te mando estas flores amarillas con todo mi amor y agradecimiento por cuidarme siempre. ¡Te amo infinito! 🌷💛',
  },
  {
    id: 'contact-3',
    name: 'Mi amor',
    relationship: 'amor',
    tone: 'poetico',
    style: 'roses',
    message:
      'Dicen que quien te regala flores amarillas el 21 de septiembre quiere quedarse a tu lado por siempre. Y yo no tengo dudas de que mi lugar favorito es contigo. Te amo con todo mi corazón 💛✨',
  },
];

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  senderName,
  setSenderName,
  onPreviewGift,
}) => {
  const [contacts, setContacts] = useState<ContactCardItem[]>(() => {
    const saved = localStorage.getItem('fa_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CONTACTS;
      }
    }
    return INITIAL_CONTACTS;
  });

  const [activeContactId, setActiveContactId] = useState<string>(contacts[0]?.id || 'contact-1');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fa_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const currentContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  const updateCurrentContact = (patch: Partial<ContactCardItem>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === currentContact.id ? { ...c, ...patch } : c))
    );
  };

  const handleAddContact = () => {
    const newId = `contact-${Date.now()}`;
    const newContact: ContactCardItem = {
      id: newId,
      name: 'Nuevo Contacto',
      relationship: 'general',
      tone: 'tierno',
      style: 'sunflowers',
      message:
        '¡Feliz 21 de septiembre! 🌻 Te mando estas flores amarillas con mucha luz y buenos deseos para esta primavera ✨💛',
    };
    setContacts((prev) => [...prev, newContact]);
    setActiveContactId(newId);
    showToast('Contacto añadido a la lista');
  };

  const handleDeleteContact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (contacts.length <= 1) {
      showToast('Debes mantener al menos un contacto');
      return;
    }
    const filtered = contacts.filter((c) => c.id !== id);
    setContacts(filtered);
    if (activeContactId === id) {
      setActiveContactId(filtered[0].id);
    }
    showToast('Contacto eliminado');
  };

  const handleApplyPreset = (presetMsg: string, style?: BouquetStyle) => {
    updateCurrentContact({
      message: presetMsg,
      ...(style ? { style } : {}),
    });
    showToast('Mensaje aplicado');
  };

  // Call server Gemini API for AI dedication
  const handleGenerateAiMessage = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: currentContact.name,
          relationship: currentContact.relationship,
          tone: currentContact.tone,
          senderName: senderName,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await response.json();
      if (data && data.message) {
        updateCurrentContact({ message: data.message });
        showToast('¡Dedicatoria generada con IA! ✨');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const filteredPresets = PRESET_MESSAGES.filter(
        (p) => p.relationship === currentContact.relationship
      );
      const chosen =
        filteredPresets.length > 0
          ? filteredPresets[Math.floor(Math.random() * filteredPresets.length)]
          : PRESET_MESSAGES[0];
      updateCurrentContact({ message: chosen.message });
      showToast('Mensaje especial aplicado');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Compile active CardData
  const activeCardData: CardData = {
    id: currentContact.id,
    recipientName: currentContact.name,
    senderName: senderName,
    relationship: currentContact.relationship,
    tone: currentContact.tone,
    bouquetStyle: currentContact.style,
    message: currentContact.message,
    dateStr: '21 de Septiembre',
  };

  const shareableUrl = buildShareableUrl(activeCardData);
  const formattedWhatsAppText = formatWhatsAppMessage(activeCardData, shareableUrl);
  const whatsappSendUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    formattedWhatsAppText
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedWhatsAppText);
      setCopySuccess(true);
      showToast('¡Texto y enlace de WhatsApp copiados al portapapeles!');
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error(err);
      showToast('No se pudo copiar automáticamente');
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    showToast('Generando imagen de alta calidad...');
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      const safeName = currentContact.name.replace(/[^a-zA-Z0-9]/g, '_') || 'flores';
      link.download = `flores-amarillas-${safeName}.png`;
      link.href = dataUrl;
      link.click();
      showToast('¡Imagen descargada! Lista para enviar como foto o estado');
    } catch (err) {
      console.error('Error generating image:', err);
      showToast('Error al generar imagen');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md text-amber-200 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-xl border border-amber-400/30 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <header className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>🌻 21 de Septiembre · Especial WhatsApp</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-950 tracking-tight">
          Flores Amarillas para tus Contactos
        </h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Crea detalles virtuales interactivos con un clic. Personaliza cada mensaje, comparte el enlace directo o manda la tarjeta como foto por WhatsApp.
        </p>
      </header>

      {/* Sender Profile Bar (Persistent) */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">
            ✍️
          </div>
          <div>
            <label htmlFor="sender-name-input" className="block text-xs font-bold uppercase tracking-wider text-amber-900">
              ¿Quién envía las flores? (Tu firma)
            </label>
            <span className="text-xs text-stone-500">Aparecerá en todas tus tarjetas de regalo</span>
          </div>
        </div>
        <input
          id="sender-name-input"
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Ej. Tu nombre o apodo"
          className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-amber-50/60 border border-amber-300 text-stone-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Contacts Carousel / Switcher */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Mis Contactos ({contacts.length})
            </span>
            <span className="text-xs text-stone-500">Selecciona para personalizar y enviar</span>
          </div>
          <button
            id="btn-add-contact"
            onClick={handleAddContact}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar otro contacto</span>
          </button>
        </div>

        {/* Contact Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {contacts.map((contact) => {
            const isActive = contact.id === currentContact.id;
            return (
              <div
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer shrink-0 transition-all border ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs scale-102'
                    : 'bg-white text-stone-700 hover:bg-amber-50 border-amber-200'
                }`}
              >
                <span>🌻</span>
                <span>{contact.name || 'Sin nombre'}</span>
                {contacts.length > 1 && (
                  <button
                    title="Eliminar contacto"
                    onClick={(e) => handleDeleteContact(contact.id, e)}
                    className="ml-1 text-stone-400 hover:text-red-600 p-0.5 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Work Area: Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-xs space-y-6">
          {/* Section 1: Recipient Name & Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipient-name-input" className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5">
                Nombre del Contacto
              </label>
              <input
                id="recipient-name-input"
                type="text"
                value={currentContact.name}
                onChange={(e) => updateCurrentContact({ name: e.target.value })}
                placeholder="Ej. Sofi, Mi amor, Carlos..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/40 border border-amber-200 text-stone-800 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label htmlFor="relationship-select" className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5">
                Relación
              </label>
              <select
                id="relationship-select"
                value={currentContact.relationship}
                onChange={(e) => {
                  const rel = e.target.value as RelationshipType;
                  const found = RELATIONSHIPS.find((r) => r.id === rel);
                  updateCurrentContact({
                    relationship: rel,
                    ...(found ? { style: found.defaultStyle } : {}),
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/40 border border-amber-200 text-stone-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel.id} value={rel.id}>
                    {rel.icon} {rel.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Bouquet Floral Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">
              Tipo de Ramo de Flores
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BOUQUET_STYLES.map((bStyle) => {
                const isSelected = currentContact.style === bStyle.id;
                return (
                  <button
                    key={bStyle.id}
                    id={`btn-style-${bStyle.id}`}
                    onClick={() => updateCurrentContact({ style: bStyle.id })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 shadow-xs ring-2 ring-amber-400/40'
                        : 'bg-stone-50/60 hover:bg-amber-50/60 border-stone-200 text-stone-700'
                    }`}
                  >
                    <span className="text-2xl">{bStyle.icon}</span>
                    <span className="text-xs font-bold text-amber-950 leading-tight">
                      {bStyle.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Dedication Message & AI Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="message-textarea" className="block text-xs font-bold uppercase tracking-wider text-amber-950">
                Dedicatoria Escrita
              </label>

              <button
                id="btn-generate-ai"
                onClick={handleGenerateAiMessage}
                disabled={isGeneratingAi}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-amber-900" />
                )}
                <span>{isGeneratingAi ? 'Escribiendo...' : 'Inspirar con IA'}</span>
              </button>
            </div>

            <textarea
              id="message-textarea"
              rows={4}
              value={currentContact.message}
              onChange={(e) => updateCurrentContact({ message: e.target.value })}
              placeholder="Escribe aquí tu mensaje especial..."
              className="w-full p-3.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-stone-800 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-sans-body"
            />

            {/* Quick Inspiration Presets */}
            <div className="mt-2.5">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                Mensajes sugeridos rápidos:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_MESSAGES.filter(
                  (p) =>
                    p.relationship === currentContact.relationship ||
                    p.relationship === 'general'
                ).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.message, preset.style)}
                    className="px-2.5 py-1 rounded-lg bg-amber-100/70 hover:bg-amber-200 border border-amber-300/60 text-amber-900 text-xs font-medium transition-colors cursor-pointer"
                  >
                    ✨ {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: WhatsApp Actions and Direct Sending */}
          <div className="pt-4 border-t border-amber-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Enviar por WhatsApp a {currentContact.name}</span>
            </h3>

            {/* Big 1-Click WhatsApp Button */}
            <a
              id="btn-send-whatsapp-direct"
              href={whatsappSendUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Abrir chat de WhatsApp listo para enviar</span>
            </a>

            {/* Secondary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                id="btn-copy-link"
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copySuccess ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-amber-800" />
                )}
                <span>{copySuccess ? '¡Copiado!' : 'Copiar mensaje y enlace'}</span>
              </button>

              <button
                id="btn-download-image"
                onClick={handleDownloadImage}
                disabled={downloading}
                className="py-2.5 px-4 rounded-xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {downloading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-800" />
                ) : (
                  <Download className="w-4 h-4 text-amber-800" />
                )}
                <span>Descargar como foto (PNG)</span>
              </button>
            </div>

            {/* WhatsApp Bubble Preview */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-stone-700">
              <span className="font-bold text-emerald-800 block mb-1">
                💬 Vista previa del texto de WhatsApp:
              </span>
              <p className="font-mono text-[11px] text-stone-600 line-clamp-3 leading-relaxed">
                {formattedWhatsAppText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Vista previa en vivo</span>
            </span>

            <button
              id="btn-test-gift-experience"
              onClick={() => onPreviewGift(activeCardData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-amber-800" />
              <span>Probar modo sorpresa</span>
            </button>
          </div>

          {/* Actual Rendered Card */}
          <div className="w-full">
            <CardPreview
              ref={cardRef}
              data={activeCardData}
              interactiveBouquet={true}
            />
          </div>

          <p className="text-xs text-stone-500 text-center max-w-xs">
            💡 Puedes tocar las flores del ramo para escuchar cómo sonarán cuando tu contacto las abra en su teléfono.
          </p>
        </div>
      </div>
    </div>
  );
};
