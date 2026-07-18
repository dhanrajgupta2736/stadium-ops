import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';

export default function CopilotChat({ chatHistory, onSendMessage, onClear, isLoading, t }) {
  const [query, setQuery] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setQuery('');
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-[300px]">
      <div className="flex justify-between items-center py-1.5 border-b border-line">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{t('copilotLogLabel')}</span>
        {chatHistory.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-critical hover:text-critical/80 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('copilotClearLog')}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-sm scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-ink-muted/60 p-4">
            <Bot className="h-8 w-8 mb-2 stroke-[1.5]" />
            <p className="font-sans text-xs">{t('copilotChatEmpty')}</p>
          </div>
        ) : (
          chatHistory.map((msg, index) => {
            const messageKey = `${msg.role}-${index}-${msg.text.slice(0, 8)}`;
            return (
              <div
                key={messageKey}
                className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="h-6 w-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 leading-relaxed text-xs whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-line text-ink border border-line/50 rounded-tr-none'
                      : 'bg-surface text-ink border border-line rounded-tl-none font-sans'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="h-6 w-6 rounded-full bg-line border border-line flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-ink-muted" />
                  </div>
                )}
              </div>
            );
          })
        )}
        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="h-6 w-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Bot className="h-3.5 w-3.5 text-accent animate-spin" />
            </div>
            <div className="bg-surface text-ink-muted border border-line rounded-lg rounded-tl-none px-3 py-2.5 text-xs">
              <div className="flex gap-1 items-center">
                <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 bg-accent rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <label htmlFor="copilot-query-input" className="sr-only">
          {t('copilotInputPlaceholder')}
        </label>
        <input
          id="copilot-query-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('copilotInputPlaceholder')}
          disabled={isLoading}
          className="flex-1 rounded border border-line bg-surface px-2.5 py-2 text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded bg-accent p-2 text-panel transition-colors hover:bg-accent/90 disabled:opacity-50"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

CopilotChat.propTypes = {
  chatHistory: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  t: translateFnPropType,
};
