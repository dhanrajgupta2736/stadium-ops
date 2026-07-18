import { useZoneSimulation } from './hooks/useZoneSimulation';
import { useDirectiveFeed } from './hooks/useDirectiveFeed';
import { useOverallLoad } from './hooks/useOverallLoad';
import { useLocale } from './hooks/useLocale';
import { useDispatchActions } from './hooks/useDispatchActions';
import { useIncidentLog } from './hooks/useIncidentLog';
import { useIncidentForm } from './hooks/useIncidentForm';

import StatusBar from './components/layout/StatusBar';
import ZoneGrid from './components/dashboard/ZoneGrid';
import StadiumMap from './components/dashboard/StadiumMap';
import CommandFeed from './components/command/CommandFeed';
import DispatchTaskList from './components/dispatch/DispatchTaskList';
import IncidentReporterPanel from './components/incidents/IncidentReporterPanel';
import GeminiCopilot from './components/copilot/GeminiCopilot';

export default function App() {
  const { zones, applyZoneAdjustment } = useZoneSimulation();
  const directiveFeed = useDirectiveFeed(zones);
  const overallLoad = useOverallLoad(zones);
  const { locale, setLocale, t, direction, availableLocales, localeMeta } = useLocale();
  const { actions, completedActionIds, toggleAction } = useDispatchActions(applyZoneAdjustment);
  const { incidents, logIncident } = useIncidentLog();
  const { formState, updateField, submitForm } = useIncidentForm(logIncident, zones);

  return (
    <div dir={direction} className="min-h-screen bg-base text-ink transition-colors duration-300">
      <StatusBar
        t={t}
        overallLoad={overallLoad}
        locale={locale}
        setLocale={setLocale}
        availableLocales={availableLocales}
        localeMeta={localeMeta}
      />

      <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
          {/* Left Column: Visual Map, Cards, and Checklist */}
          <div className="space-y-6">
            <StadiumMap zones={zones} t={t} />
            <ZoneGrid zones={zones} t={t} />
            <DispatchTaskList
              actions={actions}
              completedActionIds={completedActionIds}
              onToggle={toggleAction}
              t={t}
            />
          </div>

          {/* Right Column: AI Assistant & Rules Feed */}
          <div className="space-y-6">
            <GeminiCopilot
              zones={zones}
              activeDirectives={directiveFeed}
              incidents={incidents}
              completedActions={completedActionIds}
              locale={locale}
              direction={direction}
              t={t}
            />
            <CommandFeed feed={directiveFeed} t={t} />
          </div>
        </div>

        {/* Bottom Section: Full-Width Administrative Incident Logger */}
        <div>
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
