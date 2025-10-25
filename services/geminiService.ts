import { GoogleGenAI } from "@google/genai";

// Use a function to initialize the client lazily, preventing crashes if API_KEY is not set.
const getAiClient = (() => {
  let ai: GoogleGenAI | null = null;
  let hasWarned = false;
  return () => {
    if (ai) return ai;

    const API_KEY = process.env.API_KEY;
    if (API_KEY) {
      ai = new GoogleGenAI({ apiKey: API_KEY });
      return ai;
    }

    if (!hasWarned) {
        console.warn("Gemini API key not found. AI features will be disabled.");
        hasWarned = true;
    }
    return null;
  }
})();


const CONDO_RULES = `
Reglamento de la privada "Llama Querétaro":
- Horario de la alberca: 9 AM a 9 PM, todos los días.
- Salón de eventos: Se debe reservar con al menos 1 semana de anticipación. Costo de $2,000 MXN.
- Cuotas de mantenimiento: Vencen los primeros 5 días de cada mes.
- Mascotas: Deben llevar correa en áreas comunes y los dueños deben limpiar sus desechos.
- Basura: Se recolecta Lunes, Miércoles y Viernes por la mañana. Separar orgánico e inorgánico.
- Para reportar un problema de mantenimiento, el residente debe ir a la sección de Mantenimiento en la app y llenar el formulario.
- Las visitas deben ser pre-registradas en la sección de Seguridad de la app para agilizar su acceso.
`;

export const getAIResponse = async (prompt: string) => {
  const ai = getAiClient();
  if (!ai) {
    return "La función de asistente AI no está disponible. Falta la clave de API.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `Eres un asistente virtual para la administración del condominio "Llama Querétaro". Responde las preguntas de los residentes de forma amable y concisa, basándote únicamente en la siguiente información del reglamento. Si no sabes la respuesta, di que consultarás con la administración. \n\n${CONDO_RULES}`,
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al contactar al asistente de IA. Por favor, inténtalo de nuevo más tarde.";
  }
};

export const generateAnnouncement = async (topic: string) => {
    const ai = getAiClient();
    if (!ai) {
    return "La función de asistente AI no está disponible. Falta la clave de API.";
  }
  
  try {
    const prompt = `Genera un comunicado oficial y amigable para los residentes del condominio "Llama Querétaro" sobre el siguiente tema: "${topic}". El tono debe ser profesional pero cercano. Incluye un título y el cuerpo del mensaje.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        systemInstruction: "Eres un asistente de redacción para el administrador del condominio Llama Querétaro. Tu tarea es escribir comunicados claros y profesionales.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un error al generar el comunicado.";
  }
};