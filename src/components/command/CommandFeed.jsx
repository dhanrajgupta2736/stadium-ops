import PropTypes from 'prop-types';
import { BrainCircuit } from 'lucide-react';
import { directiveEntryShape, translateFnPropType } from '../../utils/propShapes';
import DirectiveEntry from './DirectiveEntry';

export default function CommandFeed({ feed, t }) {
  return (
    <section aria-labelledby="command-feed-heading" className="flex h-full flex-col rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 id="command-feed-heading" className="font-display text-lg uppercase tracking-wide text-ink">
          {t('commandFeedHeading')}
        </h2>
      </div>

      <ul
        className="mt-3 flex-1 space-y-2 overflow-y-auto"
        aria-live="polite"
        aria-relevant="additions"
        style={{ maxHeight: '520px' }}
      >
        {feed.map((directive) => (
          <DirectiveEntry key={directive.id} directive={directive} t={t} />
        ))}
      </ul>
    </section>
  );
}

CommandFeed.propTypes = {
  feed: PropTypes.arrayOf(directiveEntryShape).isRequired,
  t: translateFnPropType,
};
