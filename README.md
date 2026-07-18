# Stadium Command Center

A GenAI-branded, rules-driven Tournament Operations & Smart Stadium Management dashboard, built for the **Crowd Management & Tournament Operations** vertical, using the FIFA World Cup 2026 as the operating scenario.

The persona this is designed around is a **stadium operations coordinator** sitting in a control room during a live match: someone who needs to glance at zone status, understand *why* the system is recommending an action, and act on it in seconds — not read a report.

## Challenge Requirements → Where They're Implemented

| Brief requirement | Status | Where |
|---|---|---|
| Real-Time Dynamic Crowd Control & Stadium Map | ✅ | `src/components/dashboard/`, `src/hooks/useZoneSimulation.js` |
| Color-coded zones (Green/Yellow/Red) | ✅ | `src/utils/zoneStatus.js`, `src/utils/statusPresentation.js` |
| GenAI Real-Time Decision Support Assistant ("Stadium Command Center") | ✅ | `src/utils/directiveRules.js`, `src/hooks/useDirectiveFeed.js`, `src/components/command/` |
| Cross-zone conditional directive (brief's Gate A / Concourse B example) | ✅ | `directiveRules.js` rule `gate-a-to-concourse-b-critical` |
| Multi-Language Incident Reporting & Logistics Logger | ✅ | `src/components/incidents/`, `src/i18n/dictionaries.js` (EN/ES/AR/FR) |
| Actionable Response Protocols & Tracking (checkbox updates live metrics) | ✅ | `src/hooks/useDispatchActions.js`, `src/utils/dispatchCatalog.js` |
| Zero logic in UI components | ✅ | See "Project Structure" below |
| Strict PropTypes on every component | ✅ | `src/utils/propShapes.js`, imported by every file in `src/components/` |
| No UI file over 120 lines | ✅ | Largest is 83 lines — see line-count note in Project Structure |
| Test suite covering boundary values | ✅ | `src/tests/` — 43 tests, see Testing section |
| Semantic HTML, labeled inputs, ARIA live-regions | ✅ | See Accessibility Notes |

## Live Demo Data

Everything in this app is **simulated client-side**. There is no backend, no real stadium feed, and no external AI API call. Zone density and wait times drift on a timer to imitate a live venue; the "Command Center" reacts to that simulated data using a deterministic rules engine. This is explained further in **Assumptions** below.

## Approach & Logic

### 1. Real-Time Dynamic Crowd Control & Stadium Map (`useZoneSimulation`)
Eight zones (3 gates, 2 concourses, 2 seating bowls, 1 hospitality area) each carry a density percentage and, where relevant, a gate wait time. Values drift slightly every 4 seconds within realistic bounds (0–130%, 0–90 min) to simulate a live venue. Status (`safe` / `warning` / `critical`) is derived from those two numbers by a pure function (`deriveZoneStatus`), so the same inputs always produce the same status — no hidden state, easy to unit test.

### 2. GenAI Real-Time Decision Support Assistant — "Stadium Command Center" (`directiveRules.js` + `useDirectiveFeed`)
This is the "smart assistant" layer. Rather than a single AI model call, it's a small ordered set of declarative rules, each of which inspects the *combined* state of multiple zones and decides whether to fire a directive. The flagship rule is a genuine cross-zone conditional:

> If Gate A's wait time exceeds 25 minutes **AND** Concourse B is critical, fire: *"Redirecting fans from Gate A to Gate C. Dispatching 5 stewards to Concourse B."*

Neither condition alone triggers this — it's a real two-variable decision, matching the brief's example directly. Additional rules cover single-zone critical/warning states and a calm "all nominal" fallback. Every rule is independently unit-tested, including the exact boundary values (0%, 120%+ over-capacity, exact threshold crossings).

We call this the "GenAI Command Center" per the original brief's naming, but it is **not backed by a large language model** — it's a transparent, auditable rules engine. We think this is the right call for a live safety tool (deterministic, testable, no hallucination risk) but want to be upfront that "GenAI" here describes the branding/vision, not the actual mechanism. See Assumptions.

### 3. Actionable Response Protocols & Tracking (`useDispatchActions`)
Coordinators can check off dispatch tasks (open an auxiliary exit, redirect fans, send stewards). Completing a task doesn't just cross off a to-do — it applies a real adjustment to the affected zone(s)' density and wait time, which then flows back through the directive engine and can resolve or downgrade an active alert. This closes the loop the brief asked for: "Ticking off an action item must dynamically update the active crowd density metrics."

### 4. Multi-Language Incident Reporting & Logistics Logger (`useIncidentLog`, `useIncidentForm`)
A form lets staff log incidents (medical, blockage, asset failure) against a zone, in one of four languages (English, Spanish, Arabic, French). Submitting resolves a locale-specific response protocol string for that incident type. Arabic renders right-to-left (`dir="rtl"`) via layout-agnostic Tailwind classes (no hardcoded left/right margins), so the whole page mirrors correctly rather than just the text.

## How It Works (Quick Start)

```bash
npm install
npm run dev       # starts local dev server
npm run test      # runs the full Vitest suite (43 tests)
npm run lint      # ESLint: React hooks rules, PropTypes enforcement, jsx-a11y, no console/unused vars
npm run build     # production build to dist/
```

No environment variables or API keys are required — everything runs client-side.

## Deployment (Netlify)

This repo includes `netlify.toml` with an explicit build configuration:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

To deploy: connect this repository in Netlify (New site → Import from Git), and it will pick up `netlify.toml` automatically — no manual configuration needed. A `[[redirects]]` rule is included so any deep-link route falls back to `index.html` rather than 404ing (this app is currently single-route, but the fallback is there for correctness).

## Project Structure

```
src/
  components/     # UI only — every file under ~85 lines, PropTypes on every component
    dashboard/    # Zone grid + zone cards
    command/      # Directive feed (ARIA live region)
    dispatch/     # Task list that mutates zone state on completion
    incidents/    # Multi-language incident form + log
    layout/       # Status bar, language switcher
  hooks/          # ALL state and logic lives here, not in components
  utils/          # Pure functions and static data catalogs (zones, rules, i18n dictionaries)
  i18n/           # EN/ES/AR/FR string dictionaries
  tests/          # Vitest suite: pure-function boundary tests, hook tests, component tests
```

Zero business logic lives inside a UI component — every calculation, status derivation, and rule evaluation is an isolated, independently-testable function or hook.

## Assumptions

- **"GenAI" is the rules engine described above, not an LLM call.** The brief calls for an "intelligent, rule-driven contextual engine" and gives a concrete example directive — we implemented exactly that as a deterministic engine rather than wiring in a real model call, since a live safety-critical tool benefits from being auditable and reproducible rather than probabilistic. Happy to swap in a real LLM call if that's preferred; the current architecture (rules return structured descriptors, i18n resolves them to strings) would make that a contained change.
- **Zone set:** we picked 8 representative zones (3 gates, 2 concourses, 2 seating tiers, hospitality) rather than modeling an entire real stadium, since the brief asked for a "representative" grid, not a 1:1 venue map.
- **Simulation, not live data:** density and wait times drift on a client-side timer. There's no real IoT/camera/ticketing feed — this is explicitly a simulated environment per the brief's "mock real-time metrics."
- **Translation is a locale dictionary, not live machine translation.** The brief calls for a "multi-language simulator toggle" that "automatically translates or adapts response protocols" — we interpreted this as pre-written, professionally-worded protocol strings per locale (safety-critical text shouldn't depend on live MT quality), not a runtime translation API call.
- **Single-page, single-session state.** Nothing persists between page reloads (no backend, no localStorage per the environment's constraints). Each session starts from the same baseline zone values.

## Testing

43 tests across 7 files, covering:
- Pure status-derivation logic at exact boundary values (0%, exact threshold crossings, 120%+ over-capacity)
- The directive engine's cross-zone rule, including a regression test confirming it does *not* false-positive when only one of its two conditions is met
- A race condition in dispatch-action completion (rapid repeated toggles could previously double-apply a zone adjustment; fixed and covered by a dedicated test)
- Form accessibility (every input has a properly associated `<label>`)
- Component rendering at boundary values

Run with `npm run test`.

## Accessibility Notes

- Every form input has an associated `<label for>` (verified by test, not just visual inspection)
- The command feed uses `aria-live="polite"` so new directives are announced to screen readers as they occur
- Full keyboard support on the dispatch task list (`role="checkbox"`, `tabIndex`, Enter/Space toggle)
- Layout uses symmetric spacing utilities throughout so the Arabic RTL mode mirrors correctly, not just the text direction
- `prefers-reduced-motion` is respected globally (the status-bar scan line and pulse animations are disabled for users who request reduced motion)
