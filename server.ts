import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate AI dedication for Yellow Flowers Day
app.post("/api/generate-message", async (req, res) => {
  const { recipientName, relationship, tone, extraDetails, senderName } = req.body;

  const targetName = (recipientName || "alguien especial").trim();
  const rel = (relationship || "amistad").trim();
  const mood = (tone || "tierno").trim();
  const sender = (senderName || "").trim();

  // Curated fallbacks in case API key is not configured
  const fallbackTemplates = [
    `Para ${targetName}: Dicen que regalar flores amarillas cada 21 de septiembre es desearle a alguien luz, alegría sincera y que se quede en tu vida por siempre. ¡Gracias por llenar mis días de color y sonrisas! 🌻✨💛`,
    `¡Feliz día de las flores amarillas, ${targetName}! 🌼 Que este nuevo inicio de primavera te traiga tanta paz, felicidad y proyectos bonitos como te mereces. ¡Te quiero un montón!`,
    `No podía dejar pasar este 21 de septiembre sin mandarte tus flores amarillas, ${targetName}. Eres de esas personas que brillan con luz propia y hacen que todo sea más bonito. ¡Un abrazote inmenso! 🌻💛`,
  ];

  try {
    const ai = getAI();
    if (!ai) {
      const randomFallback = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
      return res.json({ message: randomFallback, source: "curated" });
    }

    const prompt = `Genera un mensaje dedicatorio breve (de 2 a 4 oraciones), sincero, fresco y emotivo en español para el "Día de las Flores Amarillas" (21 de septiembre, tradición latinoamericana inspirada en la llegada de la primavera, desear felicidad eterna y amor/amistad).
Destinatario: "${targetName}"
Relación con quien lo envía: "${rel}"
Tono deseado: "${mood}"
Detalles extras o anécdotas: "${extraDetails || 'Ninguno'}"
Firma de quien envía: "${sender || 'Un amigo/a'}"

Reglas:
1. Incluye 2 o 3 emojis bonitos (como 🌻, 🌼, ✨, 💛).
2. Que suene natural, cálido y latinoamericano (no robotizado ni formal tipo carta comercial).
3. No pongas introducciones ni comillas al inicio ni al final, solo el texto listo para enviar por WhatsApp.
4. Extensión ideal: 25 a 50 palabras.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
        maxOutputTokens: 250,
      },
    });

    const generatedText = response.text?.trim();
    if (!generatedText) {
      throw new Error("No text generated");
    }

    return res.json({ message: generatedText, source: "ai" });
  } catch (error) {
    console.error("Error generating message with Gemini:", error);
    const randomFallback = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
    return res.json({ message: randomFallback, source: "fallback" });
  }
});

// Vite middleware configuration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
