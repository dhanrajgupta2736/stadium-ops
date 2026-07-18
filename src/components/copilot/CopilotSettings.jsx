import PropTypes from 'prop-types';
import { useState } from 'react';
import { Key, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';

export default function CopilotSettings({ apiKey, onSave, t }) {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(tempKey);
  };

  return (
    <div className="rounded-lg border border-line bg-surface p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase tracking-wider text-ink-muted">{t('copilotStatusLabel')}</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${apiKey ? 'bg-safe shadow-[0_0_8px_#3FB67F]' : 'bg-warning shadow-[0_0_8px_#E0A730]'}`} />
          <span className="font-mono font-medium text-ink">
            {apiKey ? t('copilotConnectedMode') : t('copilotSimulationMode')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-2.5">
        <label htmlFor="copilot-key" className="sr-only">
          {t('copilotApiKeyPlaceholder')}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink-muted" />
            <input
              id="copilot-key"
              type={showKey ? 'text' : 'password'}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder={t('copilotApiKeyPlaceholder')}
              className="w-full rounded border border-line bg-panel py-2 pl-8 pr-8 text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-2 text-ink-muted hover:text-ink"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          <button
            type="submit"
            className="rounded bg-accent px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-panel hover:bg-accent/90"
          >
            {t('copilotSaveKey')}
          </button>
        </div>
      </form>
      {!apiKey && (
        <div className="mt-2 flex items-start gap-1.5 text-warning">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="font-sans leading-relaxed text-[10px]">
            {t('copilotKeyNotice')}
          </p>
        </div>
      )}
    </div>
  );
}

CopilotSettings.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  t: translateFnPropType,
};
