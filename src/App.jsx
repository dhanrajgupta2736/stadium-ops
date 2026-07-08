import { useZoneSimulation } from './hooks/useZoneSimulation';
import { useDirectiveFeed } from './hooks/useDirectiveFeed';
import { useOverallLoad } from './hooks/useOverallLoad';
import { useLocale } from './hooks/useLocale';
import { useDispatchActions } from './hooks/useDispatchActions';
import { useIncidentLog } from './hooks/useIncidentLog';
import { useIncidentForm } from './hooks/useIncidentForm';

import StatusBar from './components/layout/StatusBar';
import ZoneGrid from './components/dashboard/ZoneGrid';
import CommandFeed from './components/command/CommandFeed';
import DispatchTaskList from './components/dispatch/DispatchTaskList';
import IncidentReporterPanel from './components/incidents/IncidentReporterPanel';

export default function App() {
  const { zones, applyZoneAdjustment } = useZoneSimulation();
  const directiveFeed = useDirectiveFeed(zones);
  const overallLoad = useOverallLoad(zones);
  const { locale, setLocale, t, direction, availableLocales, localeMeta } = useLocale();
  const { actions, completedActionIds, toggleAction } = useDispatchActions(applyZoneAdjustment);
  const { incidents, logIncident } = useIncidentLog();
  const { formState, updateField, submitForm } = useIncidentForm(logIncident, zones);

  return (
    <div dir={direction} className="min-h-screen bg-base text-ink">
      <StatusBar
        t={t}
        overallLoad={overallLoad}
        locale={locale}
        setLocale={setLocale}
        availableLocales={availableLocales}
        localeMeta={localeMeta}
      />

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <ZoneGrid zones={zones} t={t} />
            <DispatchTaskList
              actions={actions}
              completedActionIds={completedActionIds}
              onToggle={toggleAction}
              t={t}
            />
          </div>

          <div>
            <CommandFeed feed={directiveFeed} t={t} />
          </div>
        </div>

        <div className="mt-4">
          <IncidentReporterPanel
            formState={formState}
            updateField={updateField}
            submitForm={submitForm}
            incidents={incidents}
            zones={zones}
            t={t}
          />
        </div>
      </main>
    </div>
  );
}
