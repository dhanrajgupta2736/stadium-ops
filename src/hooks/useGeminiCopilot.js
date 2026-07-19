/* global localStorage, fetch, setTimeout, clearTimeout, AbortController */
import { useState, useCallback, useEffect, useRef } from 'react';

/** localStorage key used to persist the Gemini API key across sessions. */
const API_KEY_STORAGE_KEY = 'stadium_ops_gemini_api_key';

/** Expected minimum length of a valid Gemini API key. */
const API_KEY_MIN_LENGTH = 30;

/** Delay (ms) before the simulation fallback returns a mock response. */
const SIMULATION_DELAY_PLAN_MS = 1200;

/** Delay (ms) before the simulation fallback returns a chat response. */
const SIMULATION_DELAY_CHAT_MS = 1000;

/** Timeout (ms) for Gemini API requests before aborting. */
const API_REQUEST_TIMEOUT_MS = 30000;

/** Maximum allowed length for user chat input to prevent abuse. */
const MAX_INPUT_LENGTH = 2000;

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

/**
 * Generates a context-aware mock response based on current zone metrics.
 * Used as a fallback when no Gemini API key is configured.
 *
 * @param {Array} zones - Current zone state array
 * @param {Array} incidents - Active incident entries
 * @param {string} locale - Current UI locale code
 * @returns {string} A localized advisory response string
 */
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

/**
 * Sanitizes user input before sending to the Gemini API.
 * Strips HTML tags and trims excessive whitespace to prevent injection.
 *
 * @param {string} input - Raw user input string
 * @returns {string} Sanitized input safe for API transmission
 */
function sanitizeInput(input) {
  return input
    .replace(/<[^>]*>/g, '')       // Strip HTML tags
    .replace(/\s{3,}/g, '  ')      // Collapse excessive whitespace
    .trim()
    .slice(0, MAX_INPUT_LENGTH);   // Enforce maximum length
}

/**
 * Validates that the provided string looks like a Gemini API key.
 * @param {string} key - The API key to validate
 * @returns {boolean} True if the key passes basic format checks
 */
function isValidApiKeyFormat(key) {
  return typeof key === 'string' && key.trim().length >= API_KEY_MIN_LENGTH;
}

/**
 * Custom React hook for managing the Gemini AI Copilot integration.
 * Handles API key storage, real-time context serialization, chat history,
 * and a simulation fallback when no API key is provided.
 *
 * @param {Array} zones - Current zone state array from useZoneSimulation
 * @param {Array} activeDirectives - Current active directives from useDirectiveFeed
 * @param {Array} incidents - Current incident log from useIncidentLog
 * @param {Set} completedActions - Set of completed dispatch action IDs
 * @param {string} locale - Current UI locale code
 * @returns {Object} Copilot state and action functions
 */
export function useGeminiCopilot(zones, activeDirectives, incidents, completedActions, locale) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE_KEY) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Cleanup any in-flight requests when the hook unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Persists the API key to localStorage after trimming whitespace.
   * Removes the key from storage if an empty string is provided.
   * @param {string} key - The API key to save
   */
  const saveApiKey = useCallback((key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  /**
   * Builds a structured system prompt with current stadium metrics
   * for the Gemini API system instruction.
   * @returns {string} The complete system context prompt
   */
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

  /**
   * Sends a prompt to the Gemini API and appends the response to chat history.
   * Includes AbortController timeout and structured error handling.
   * @param {string} userPrompt - The user's message
   * @param {Array} currentHistory - Current chat history for context
   */
  const callGemini = useCallback(async (userPrompt, currentHistory) => {
    setIsLoading(true);
    setError(null);

    // Abort any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set a timeout to auto-abort long-running requests
    const timeoutId = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

    const systemContext = buildSystemContext();
    const sanitizedPrompt = sanitizeInput(userPrompt);

    const formattedHistory = currentHistory.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: sanitizedPrompt }]
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
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemContext }]
            }
          })
        }
      );

      clearTimeout(timeoutId);

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
        { role: 'user', text: sanitizedPrompt },
        { role: 'model', text: answerText }
      ]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        /* eslint-disable-next-line no-console */
        console.error(err);
        setError(err.message);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiKey, buildSystemContext]);

  /**
   * Generates a full stadium optimization plan.
   * Falls back to simulation mode if no valid API key is configured.
   */
  const generateOptimizationPlan = useCallback(() => {
    const userPrompt = "Provide a complete stadium optimization plan based on the current situation.";
    
    if (!apiKey || !isValidApiKeyFormat(apiKey)) {
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
      }, SIMULATION_DELAY_PLAN_MS);
      return;
    }

    callGemini(userPrompt, chatHistory);
  }, [apiKey, zones, incidents, locale, chatHistory, callGemini]);

  /**
   * Sends a free-form chat message to the Gemini AI copilot.
   * @param {string} text - The user's message text
   */
  const sendMessage = useCallback((text) => {
    const sanitized = sanitizeInput(text);
    if (!sanitized) return;

    if (!apiKey || !isValidApiKeyFormat(apiKey)) {
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        const mockText = generateMockResponse(zones, incidents, locale) + `\n\n(Simulated reply to: "${sanitized}")`;
        setChatHistory(prev => [
          ...prev,
          { role: 'user', text: sanitized },
          { role: 'model', text: mockText }
        ]);
        setIsLoading(false);
      }, SIMULATION_DELAY_CHAT_MS);
      return;
    }

    callGemini(sanitized, chatHistory);
  }, [apiKey, zones, incidents, locale, chatHistory, callGemini]);

  /** Clears the entire chat history and resets any error state. */
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
