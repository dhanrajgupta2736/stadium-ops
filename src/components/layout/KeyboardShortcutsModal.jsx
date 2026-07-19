import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { translateFnPropType } from '../../utils/propShapes';

export default function KeyboardShortcutsModal({ isOpen, onClose, _t }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Tab / Shift+Tab', desc: 'Navigate between interactive zones and controls' },
    { key: 'Enter / Space', desc: 'Select focused zone on stadium map or trigger buttons' },
    { key: 'Shift + E', desc: 'Trigger Emergency Evacuation Protocol' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Modal' },
    { key: 'Esc', desc: 'Close dialogs or clear selection' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-lg border border-line bg-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-accent" />
            <h2 id="shortcuts-title" className="font-display text-lg uppercase tracking-wide text-ink">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-muted hover:bg-surface hover:text-ink"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <dl className="mt-4 space-y-3">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <dt className="font-mono text-xs text-ink-muted">{s.desc}</dt>
              <dd>
                <kbd className="rounded border border-line bg-surface px-2 py-1 font-mono text-[10px] font-semibold text-accent shadow-sm">
                  {s.key}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-panel hover:bg-accent/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

KeyboardShortcutsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  _t: translateFnPropType,
};
