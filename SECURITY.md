# Security Policy · Stadium Command Center

## Supported Versions

Only the latest release on the `main` branch is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Best Practices

The **Stadium Command Center** enforces multiple layers of security to protect operational control room data and AI interactions:

1. **Client-Side API Key Storage**:
   - Gemini API keys are stored exclusively in the browser's `localStorage` (`stadium_ops_gemini_api_key`).
   - Keys are never transmitted to third-party tracking servers, proxies, or analytics platforms.
   - All GenAI calls originate client-side directly to Google's official Gemini endpoint (`https://generativelanguage.googleapis.com`).

2. **Content Security Policy (CSP)**:
   - Enforces strict HTTP/Meta CSP rules restricting executable script domains, connections, and external resource origins.

3. **Input Sanitization & Injection Defense**:
   - User inputs to the AI Copilot and Incident Reporter are sanitized to strip HTML tags, script tags, and prompt injection characters before execution.

4. **Client-Side Rate Limiting**:
   - Prevents rapid-fire requests to the Gemini API using request throttling and `AbortController` cancellation timeouts.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it directly by creating a confidential issue on GitHub or contacting the maintainers.

- **Response SLA**: Vulnerability reports will be acknowledged within 24 hours.
- **Fix SLA**: Critical security patches will be committed within 48 hours.
