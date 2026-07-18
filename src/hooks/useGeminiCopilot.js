/* global localStorage, fetch, setTimeout */
import { useState, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'stadium_ops_gemini_api_key';

// Localized mock responses for the simulation mode fallback
const SIMULATION_RESPONSES = {
  en: {
    nominal: "All zones are running nominal. Gate wait times are within safety margins. Suggest keeping normal operational schedules.",
    criticalGate: "CRITICAL: Gate A wait times are high. Recommend initiating dispatch to redirect traffic to Gate C and open auxiliary lanes.",
    criticalConcourse: "CRITICAL: Concourse B is heavily congested. Dispatching stewards to guide crowd flow and prevent bottlenecks.",
    criticalSeating: "CRITICAL: Lower Bowl seating density is high. Ensure exit 4 is open and clear of obstructions.",
    incident: "ALERT: Active incident reported. Ensure the specified safety protocols are enforced and clear path for responders."
  },
  es: {
    nominal: "Todas las zonas operan con normalidad. Los tiempos de espera están en límites seguros. Mantener horario estándar.",
    criticalGate: "CRÍTICO: Tiempos de espera altos en Puerta A. Se sugiere iniciar redirección de tráfico hacia Puerta C.",
    criticalConcourse: "CRÍTICO: El Vestíbulo B está muy congestionado. Enviar personal de asistencia para guiar a la multitud.",
    criticalSeating: "CRÍTICO: Densidad alta en Tribuna Baja. Asegurar que la salida auxiliar 4 esté abierta y libre.",
    incident: "ALERTA: Incidente activo reportado. Asegurar que se sigan los protocolos de seguridad y despejar accesos."
  },
  ar: {
    nominal: "جميع المناطق تعمل بشكل طبيعي. أوقات الانتظار عند البوابات ضمن الحدود الآمنة. يُنصح بمواصلة جدول العمليات المعتاد.",
    criticalGate: "حرج: وقت الانتظار عند البوابة A مرتفع. يوصى بالبدء في توجيه حركة المرور إلى البوابة C وفتح ممرات إضافية.",
    criticalConcourse: "حرج: الردهة B مزدحمة للغاية. يرجى إيفاد مضيفين إضافيين لتوجيه تدفق الجمهور وتجنب الاختناقات.",
    criticalSeating: "حرج: كثافة المدرجات السفلية مرتفعة. تأكد من فتح المخرج المساعد 4 وخلوه من أي عوائق.",
    incident: "تنبيه: تم تسجيل حادث نشط. يرجى التأكد من تطبيق بروتوكولات السلامة وتسهيل وصول فريق الاستجابة."
  },
  fr: {
    nominal: "Toutes les zones fonctionnent normalement. Les temps d'attente aux portes sont sûrs. Maintenir le planning normal.",
    criticalGate: "CRITIQUE : Attente élevée à la Porte A. Recommandation d'initier la redirection du flux vers la Porte C.",
    criticalConcourse: "CRITIQUE : Le Hall B est très encombré. Envoi de stewards pour fluidifier le trafic et éviter les goulots d'étranglement.",
    criticalSeating: "CRITIQUE : Forte densité en Parterre Bas. S'assurer que la sortie auxiliaire 4 est ouverte et dégagée.",
    incident: "ALERTE : Incident actif signalé. Veiller à ce que les protocoles de sécurité soient appliqués et dégager les accès."
  }
};

function generateMockResponse(zones, incidents, locale) {
  const lang = SIMULATION_RESPONSES[locale] ? locale : 'en';
  const responses = SIMULATION_RESPONSES[lang];

  if (incidents.length > 0) {
    return `${responses.incident} (${incidents[0].description} at ${incidents[0].zoneLabel}).`;
  }

  const gateA = zones.find(z => z.id === 'gate-a');
  if (gateA && gateA.waitMinutes > 25) {
    return responses.criticalGate;
  }

  const concourseB = zones.find(z => z.id === 'concourse-b');
  if (concourseB && concourseB.status === 'critical') {
    return responses.criticalConcourse;
  }

  const seatingLower = zones.find(z => z.id === 'seating-lower');
  if (seatingLower && seatingLower.status === 'critical') {
    return responses.criticalSeating;
  }

  const criticalZone = zones.find(z => z.status === 'critical');
  if (criticalZone) {
    return `${criticalZone.label} is critical (${Math.round(criticalZone.densityPercent)}% density). Dispatch immediate crowd-control stewards.`;
  }

  return responses.nominal;
}

export function useGeminiCopilot(zones, activeDirectives, incidents, completedActions, locale) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);

  const saveApiKey = useCallback((key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  const buildSystemContext = useCallback(() => {
    const serializedZones = zones.map(z => ({
      name: z.label,
      density: `${z.densityPercent.toFixed(0)}%`,
      wait: `${z.waitMinutes.toFixed(0)} min`,
      status: z.status
    }));

    const serializedIncidents = incidents.map(i => ({
      zone: i.zoneLabel,
      type: i.incidentType,
      desc: i.description
    }));

    const completedLabels = completedActions.size > 0 
      ? Array.from(completedActions).join(', ') 
      : 'None';

    const systemPrompt = `You are the FIFA World Cup 2026 Stadium Operations AI Director.
You have access to the current stadium metrics:
- Zones: ${JSON.stringify(serializedZones)}
- Active Directives: ${JSON.stringify(activeDirectives)}
- Recent Incidents: ${JSON.stringify(serializedIncidents)}
- Completed Dispatches: ${completedLabels}

Evaluate the operational situation and provide recommendations or answer the query.
Answer directly, concisely, and highly professionally. Focus on actionable directives.
Limit your advice to 3-4 bullet points or short paragraphs.
IMPORTANT: You MUST respond in the following language: ${locale.toUpperCase()}.`;

    return systemPrompt;
  }, [zones, activeDirectives, incidents, completedActions, locale]);

  const callGemini = useCallback(async (userPrompt, currentHistory) => {
    setIsLoading(true);
    setError(null);

    const systemContext = buildSystemContext();

    // Setup history formatted for Gemini API
    const formattedHistory = currentHistory.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    // Add new user prompt to payload
    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemContext }]
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answerText) {
        throw new Error('Empty response from Gemini API.');
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'user', text: userPrompt },
        { role: 'model', text: answerText }
      ]);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, buildSystemContext]);

  const generateOptimizationPlan = useCallback(() => {
    const userPrompt = "Provide a complete stadium optimization plan based on the current situation.";
    
    if (!apiKey) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        const mockText = generateMockResponse(zones, incidents, locale);
        setChatHistory(prev => [
          ...prev,
          { role: 'user', text: userPrompt },
          { role: 'model', text: mockText }
        ]);
        setIsLoading(false);
      }, 1200);
      return;
    }

    callGemini(userPrompt, chatHistory);
  }, [apiKey, zones, incidents, locale, chatHistory, callGemini]);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!apiKey) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        const mockText = generateMockResponse(zones, incidents, locale) + `\n\n(Simulated reply to: "${trimmed}")`;
        setChatHistory(prev => [
          ...prev,
          { role: 'user', text: trimmed },
          { role: 'model', text: mockText }
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    callGemini(trimmed, chatHistory);
  }, [apiKey, zones, incidents, locale, chatHistory, callGemini]);

  const clearChat = useCallback(() => {
    setChatHistory([]);
    setError(null);
  }, []);

  return {
    apiKey,
    saveApiKey,
    isLoading,
    chatHistory,
    error,
    generateOptimizationPlan,
    sendMessage,
    clearChat
  };
}
