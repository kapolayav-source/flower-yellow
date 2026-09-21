import { CardData } from '../types';

export function encodeCardToHash(data: CardData): string {
  try {
    const jsonStr = JSON.stringify(data);
    // Safe UTF-8 Base64 encoding
    const encoded = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return encoded;
  } catch (err) {
    console.error('Failed to encode card data:', err);
    return '';
  }
}

export function decodeCardFromHash(hash: string): CardData | null {
  try {
    if (!hash) return null;
    const cleanHash = hash.replace(/^#(\/)?/, '').replace(/^d=/, '');
    if (!cleanHash) return null;

    // Decode safe UTF-8 Base64
    const decodedStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(cleanHash), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const parsed = JSON.parse(decodedStr) as CardData;
    if (parsed && parsed.recipientName && parsed.message) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.error('Failed to decode card data from hash:', err);
    return null;
  }
}

export function buildShareableUrl(data: CardData): string {
  const hash = encodeCardToHash(data);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#d=${hash}`;
}

export function formatWhatsAppMessage(data: CardData, url: string): string {
  const name = data.recipientName.trim();
  const greeting = name ? `¡Hola ${name}! 🌻💛` : `¡Hola! 🌻💛`;

  return `${greeting}

Te envío este ramo especial de flores amarillas para celebrar este 21 de septiembre ✨

Mira tu detalle interactivo aquí:
${url}

¡Que nunca te falte luz, felicidad y cosas bonitas! 🌼✨`;
}
