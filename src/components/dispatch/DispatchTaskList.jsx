import PropTypes from 'prop-types';
import { ClipboardList } from 'lucide-react';
import { dispatchActionShape, translateFnPropType } from '../../utils/propShapes';
import DispatchTaskRow from './DispatchTaskRow';

export default function DispatchTaskList({ actions, completedActionIds, onToggle, t }) {
  return (
    <section aria-labelledby="dispatch-heading" className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 id="dispatch-heading" className="font-display text-lg uppercase tracking-wide text-ink">
          {t('dispatchHeading')}
        </h2>
      </div>
      <ul className="mt-3 space-y-2">
        {actions.map((action) => (
          <DispatchTaskRow
            key={action.id}
            action={action}
            isCompleted={completedActionIds.has(action.id)}
            onToggle={onToggle}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
}

DispatchTaskList.propTypes = {
  actions: PropTypes.arrayOf(dispatchActionShape).isRequired,
  completedActionIds: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  t: translateFnPropType,
};
