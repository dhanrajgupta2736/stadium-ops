import PropTypes from 'prop-types';
import { useState } from 'react';
import { Sparkles, Settings, Bot } from 'lucide-react';
import { useGeminiCopilot } from '../../hooks/useGeminiCopilot';
import { zoneShape, incidentEntryShape, translateFnPropType } from '../../utils/propShapes';
import CopilotSettings from './CopilotSettings';
import CopilotChat from './CopilotChat';

export default function GeminiCopilot({ zones, activeDirectives, incidents, completedActions, locale, direction, t }) {
  const [showSettings, setShowSettings] = useState(false);

  const {
    apiKey,
    saveApiKey,
    isLoading,
    chatHistory,
    error,
    generateOptimizationPlan,
    sendMessage,
    clearChat
  } = useGeminiCopilot(zones, activeDirectives, incidents, completedActions, locale);

  return (
    <section
      aria-labelledby="copilot-heading"
      className="flex flex-col rounded-lg border border-line bg-panel p-4"
    >
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" aria-hidden="true" />
          <div>
            <h2 id="copilot-heading" className="font-display text-lg uppercase tracking-wide text-ink">
              {t('copilotHeading')}
            </h2>
            <p className="font-mono text-[10px] text-ink-muted leading-none mt-0.5">{t('copilotSubtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded border border-line bg-surface hover:border-accent/40 hover:text-accent transition-colors ${showSettings ? 'text-accent border-accent/40 bg-accent/5' : 'text-ink-muted'}`}
          title="Copilot Settings"
          aria-expanded={showSettings}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex-1 flex flex-col gap-3 overflow-hidden">
        {showSettings && (
          <CopilotSettings apiKey={apiKey} onSave={saveApiKey} t={t} />
        )}

        <button
          onClick={generateOptimizationPlan}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-accent/90 to-teal-500/90 py-2.5 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-panel transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          <Bot className="h-4 w-4" />
          {t('copilotAskAdvisor')}
        </button>

        {error && (
          <div className="rounded border border-critical/30 bg-critical/5 p-2.5 font-mono text-[10px] text-critical">
            {t('copilotErrorPrefix')}: {error}
          </div>
        )}

        <CopilotChat
          chatHistory={chatHistory}
          onSendMessage={sendMessage}
          onClear={clearChat}
          isLoading={isLoading}
          direction={direction}
          t={t}
        />
      </div>
    </section>
  );
}

GeminiCopilot.propTypes = {
  zones: PropTypes.arrayOf(zoneShape).isRequired,
  activeDirectives: PropTypes.arrayOf(PropTypes.object).isRequired,
  incidents: PropTypes.arrayOf(incidentEntryShape).isRequired,
  completedActions: PropTypes.instanceOf(Set).isRequired,
  locale: PropTypes.string.isRequired,
  direction: PropTypes.string.isRequired,
  t: translateFnPropType,
};
