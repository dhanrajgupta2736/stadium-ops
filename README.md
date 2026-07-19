# FIFA World Cup 2026 · Stadium Command Center

A GenAI-enabled, rules-driven Tournament Operations & Smart Stadium Management dashboard, built for the **Crowd Management & Tournament Operations** vertical, using the FIFA World Cup 2026 as the operating scenario.

The persona this is designed around is a **stadium operations coordinator** sitting in a control room during a live match: someone who needs to glance at zone status, understand *why* the system is recommending an action, inspect a visual layout map, activate emergency protocols, and consult an AI advisor to coordinate logistics in seconds.

---

## Challenge Requirements & Implementations

| Parameter | Status | Implementation Details |
|---|---|---|
| **Real-Time Dynamic Crowd Control & Stadium Map** | ✅ | [StadiumMap.jsx](src/components/dashboard/StadiumMap.jsx) rendering an interactive SVG arena layout updating color-coded statuses (green/yellow/red) in real-time. |
| **Generative AI Real-Time Decision Support** | ✅ | [GeminiCopilot.jsx](src/components/copilot/GeminiCopilot.jsx) and [useGeminiCopilot.js](src/hooks/useGeminiCopilot.js) calling the official Gemini 1.5 Flash API with simulated streaming, input sanitization, and automatic request timeouts. Includes a smart context-aware local fallback simulation if no API key is provided. |
| **Actionable Response Protocols & Tracking** | ✅ | Coordinators can check off dispatch tasks. Completing a task applies delta adjustments to density/wait metrics, which dynamically resolves rules alerts and updates the Gemini AI prompt context. |
| **Emergency Evacuation Protocol System** | ✅ | [useEmergencyProtocol.js](src/hooks/useEmergencyProtocol.js) providing a one-click emergency evacuation trigger with confirmation dialog, auto-logging an emergency incident, and broadcasting an active emergency banner across the command center. |
| **Multi-Language Incident Reporting & Mirrored RTL** | ✅ | Supported languages include English, Spanish, Arabic, and French. Toggling mirrors the UI layout symmetrically for Arabic (`dir="rtl"`) and adapts all protocols and AI prompts to the selected locale. |
| **Code Quality & Resilience** | ✅ | Zero business logic in UI components (100% in custom React hooks). Strict `PropTypes` on every component. React [ErrorBoundary.jsx](src/components/layout/ErrorBoundary.jsx) for crash resilience. Passing ESLint with 0 errors and 0 warnings. Full JSDoc documentation across all modules. |
| **Security & Hardening** | ✅ | Strict Content-Security-Policy (CSP) meta tag, Gemini API key format validation, and client-side input sanitization against XSS. |
| **Automated Testing & Coverage** | ✅ | **60 unit tests** covering boundary metric values, cross-zone conditional rules, async hook state transitions, interactive SVG rendering, error boundaries, emergency protocols, and accessibility bindings. |

---

## Approach & Logic

### 1. Interactive Visual Stadium Map (`StadiumMap.jsx`)
Currently, the stadium layout is mapped as a responsive SVG dashboard showing the premium Hospitality Suites, Upper/Lower Bowls, Concourses A/B, and Gates A/B/C.
* Each zone automatically derives its status (Safe, Warning, Critical) based on density and wait time thresholds.
* Fills and borders change colors dynamically with smooth CSS transitions.
* Clicking any sector focuses the area, presenting a detailed breakdown card of metrics and capacities.
* Fully keyboard accessible (navigable via `tabIndex` and selectable with Enter/Space keys).

### 2. Gemini AI Copilot decision support (`useGeminiCopilot.js`)
We integrated a genuine GenAI assistant powered by **Gemini 1.5 Flash** using browser-native `fetch`.
* **API Key Integration**: Coordinators can securely set their Gemini API key in the UI settings panel (persisted locally in browser `localStorage`).
* **AI Optimization Plan**: Generates a unified operational analysis. It serializes the live density percent, gate wait times, active rules-based directives, completed dispatch tasks, and recent incident logs, sending them to Gemini to get actionable, concise logistics advice.
* **Input Sanitization & Security**: All prompts are sanitized to strip HTML tags and prevent XSS injection. Request timeouts via `AbortController` prevent hung connections.
* **Interactive Chat**: Coordinators can prompt Gemini directly (e.g. *"How do I handle the medical incident in Gate A?"*).
* **Smart Local Simulation Fallback**: If no API key is specified, the Copilot runs in a localized predictive simulation, analyzing live metrics to output realistic, translated advisories in the selected language.

### 3. Emergency Evacuation Protocol (`useEmergencyProtocol.js`)
* Provides a prominent emergency trigger button in the main status bar with confirmation guards to prevent accidental triggers.
* Instantly auto-logs an emergency incident with audit timestamps.
* Broadcasts an animated `aria-live` emergency banner across the top header bar.

### 4. Closed-Loop Metrics Adjustments (`useDispatchActions.js`)
Completing actions (like redirection or opening exit doors) doesn't just cross off a checklist — it applies direct metrics modifications:
* Open Exit 4: Reduces Lower Bowl seating density by 14%.
* Redirect Gate A to C: Cuts Gate A wait by 16 minutes and density by 10%; shifts traffic to Gate C.
The revised metrics feed back into the rules engine and the Gemini AI prompt, closing the control loop.

### 5. Multi-Language Incident Logger (`IncidentForm.jsx`)
Staff can log incidents (medical help, blockages, asset failures) in English, Spanish, Arabic, or French.
* Incident tickets automatically resolve to localized safety protocols.
* Symmetrical grid flex systems ensure that Arabic mirrors the entire control room dashboard correctly (RTL text directions, mirrored buttons, reversed columns).

---

## Getting Started

No external servers are required. Ensure Node.js is installed, then run:

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run Vitest suite (60 tests)
npm run test

# Run ESLint validation checks (0 errors, 0 warnings)
npm run lint

# Compile production-ready bundle to dist/ (only 213 kB!)
npm run build
```

---

## Assumptions & Rules
* **Generative AI**: Enabled via direct client-side fetch to the Gemini 1.5 Flash endpoint (`https://generativelanguage.googleapis.com`). Standard system instructions are included to prevent formatting hallucinations.
* **Simulation Mode**: A fallback model is built into the hook, resolving realistic stadium suggestions based on live zones. This allows evaluation without requiring the user to have a Gemini API key.
* **No Bloat**: Built without heavy frameworks, keeping the production bundle footprint exceptionally small (~213 kB, well under the 10 MB limit).
