import PropTypes from 'prop-types';
import { CheckCircle2, Circle } from 'lucide-react';
import { dispatchActionShape, translateFnPropType } from '../../utils/propShapes';

export default function DispatchTaskRow({ action, isCompleted, onToggle, t }) {
  const handleToggle = () => {
    if (isCompleted) return;
    onToggle(action.id);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleToggle();
  };

  return (
    <li>
      <div
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`flex cursor-pointer items-start gap-3 rounded border border-line bg-surface px-3 py-2.5 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          isCompleted ? 'opacity-50' : 'hover:border-accent/50'
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-safe" aria-hidden="true" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
        )}
        <div className="min-w-0">
          <p className={`text-sm text-ink ${isCompleted ? 'line-through' : ''}`}>{t(action.labelKey)}</p>
          <p className="mt-0.5 font-mono text-[11px] text-ink-muted">{t(action.descriptionKey)}</p>
          {isCompleted && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-safe">
              {t('dispatchCompleted')}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

DispatchTaskRow.propTypes = {
  action: dispatchActionShape,
  isCompleted: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  t: translateFnPropType,
};
