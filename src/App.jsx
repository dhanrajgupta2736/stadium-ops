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

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[300px_1fr_400px]">
          {/* Left Column: Dispatches & Incident Reporter */}
          <div className="space-y-4 order-3 lg:order-1 lg:col-span-2 xl:col-span-1">
            <DispatchTaskList
              actions={actions}
              completedActionIds={completedActionIds}
              onToggle={toggleAction}
              t={t}
            />
            <IncidentReporterPanel
              formState={formState}
              updateField={updateField}
              submitForm={submitForm}
              incidents={incidents}
              zones={zones}
              t={t}
            />
          </div>

          {/* Center Column: Stadium Visual Map & Grid View */}
          <div className="space-y-4 order-1 lg:order-2 lg:col-span-1">
            <StadiumMap zones={zones} t={t} />
            <ZoneGrid zones={zones} t={t} />
          </div>

          {/* Right Column: AI Decision Assistant & Live Rules Feed */}
          <div className="space-y-4 order-2 lg:order-3 lg:col-span-1">
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
      </main>
    </div>
  );
}
