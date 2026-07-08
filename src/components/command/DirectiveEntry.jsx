import { directiveEntryShape, translateFnPropType } from '../../utils/propShapes';
import { getDirectivePresentation } from '../../utils/directivePresentation';

function formatTimestamp(epochMs) {
  return new Date(epochMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function DirectiveEntry({ directive, t }) {
  const presentation = getDirectivePresentation(directive.severity);
  const message = t(directive.messageKey, directive.messageParams);

  return (
    <li className={`rounded border-l-2 bg-surface px-3 py-2 ${presentation.borderClass}`}>
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 font-mono text-xs ${presentation.textClass}`} aria-hidden="true">
          {presentation.prefixSymbol}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[13px] leading-snug text-ink">{message}</p>
          <p className="mt-0.5 font-mono text-[10px] text-ink-muted">
            {formatTimestamp(directive.occurredAt)}
          </p>
        </div>
      </div>
    </li>
  );
}

DirectiveEntry.propTypes = {
  directive: directiveEntryShape,
  t: translateFnPropType,
};
