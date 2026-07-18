import PropTypes from 'prop-types';
import { useState } from 'react';
import { zoneShape, translateFnPropType } from '../../utils/propShapes';

export default function StadiumMap({ zones, t }) {
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const getZoneColorClass = (status) => {
    if (status === 'critical') return 'stroke-critical fill-critical/10 hover:fill-critical/20';
    if (status === 'warning') return 'stroke-warning fill-warning/10 hover:fill-warning/20';
    return 'stroke-safe fill-safe/10 hover:fill-safe/20';
  };

  const handleZoneClick = (zoneId) => {
    setSelectedZoneId(selectedZoneId === zoneId ? null : zoneId);
  };

  const handleKeyDown = (event, zoneId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleZoneClick(zoneId);
    }
  };

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <h3 className="font-display text-lg uppercase tracking-wide text-ink mb-2">
        {t('stadiumMapHeading')}
      </h3>
      
      <div className="relative flex justify-center bg-base/50 rounded-lg p-2 border border-line/50">
        <svg viewBox="0 0 500 320" className="w-full max-w-[480px] select-none">
          {/* Decorative pitch */}
          <rect x="175" y="105" width="150" height="110" rx="4" fill="#0f2921" stroke="#3FB67F/30" strokeWidth="2" />
          <line x1="250" y1="105" x2="250" y2="215" stroke="#3FB67F/20" strokeWidth="1.5" />
          <circle cx="250" cy="160" r="22" fill="none" stroke="#3FB67F/20" strokeWidth="1.5" />
          <text x="250" y="163" textAnchor="middle" className="fill-safe/30 text-[9px] font-mono tracking-widest pointer-events-none">
            FIFA 2026
          </text>

          {/* Zones */}
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const colorClass = getZoneColorClass(zone.status);
            const commonProps = {
              onClick: () => handleZoneClick(zone.id),
              onKeyDown: (e) => handleKeyDown(e, zone.id),
              tabIndex: 0,
              role: 'button',
              'aria-pressed': isSelected,
              'aria-label': `${zone.label}, status: ${zone.status}, density: ${zone.densityPercent}%`,
              className: `cursor-pointer transition-all duration-300 stroke-[2] hover:stroke-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1 ${colorClass} ${isSelected ? 'stroke-accent stroke-[3] fill-accent/15' : ''}`
            };

            if (zone.id === 'hospitality') {
              return <rect key={zone.id} x="145" y="15" width="210" height="22" rx="4" {...commonProps} />;
            }
            if (zone.id === 'seating-upper') {
              return <rect key={zone.id} x="110" y="45" width="280" height="230" rx="16" fill="none" {...commonProps} />;
            }
            if (zone.id === 'seating-lower') {
              return <rect key={zone.id} x="145" y="77" width="210" height="166" rx="12" fill="none" {...commonProps} />;
            }
            if (zone.id === 'concourse-a') {
              return <rect key={zone.id} x="70" y="77" width="30" height="166" rx="6" {...commonProps} />;
            }
            if (zone.id === 'concourse-b') {
              return <rect key={zone.id} x="400" y="77" width="30" height="166" rx="6" {...commonProps} />;
            }
            if (zone.id === 'gate-a') {
              return <rect key={zone.id} x="20" y="130" width="38" height="60" rx="6" {...commonProps} />;
            }
            if (zone.id === 'gate-b') {
              return <rect key={zone.id} x="442" y="130" width="38" height="60" rx="6" {...commonProps} />;
            }
            if (zone.id === 'gate-c') {
              return <rect key={zone.id} x="210" y="282" width="80" height="28" rx="6" {...commonProps} />;
            }
            return null;
          })}

          {/* Labels */}
          <text x="250" y="29" textAnchor="middle" className="fill-ink/70 text-[9px] font-mono pointer-events-none uppercase font-semibold">Hospitality</text>
          <text x="250" y="58" textAnchor="middle" className="fill-ink/70 text-[9px] font-mono pointer-events-none uppercase font-semibold">Upper Bowl</text>
          <text x="250" y="91" textAnchor="middle" className="fill-ink/70 text-[9px] font-mono pointer-events-none uppercase font-semibold">Lower Bowl</text>
          <text x="85" y="163" textAnchor="middle" transform="rotate(-90 85 163)" className="fill-ink/70 text-[9px] font-mono pointer-events-none uppercase font-semibold">Concourse A</text>
          <text x="415" y="163" textAnchor="middle" transform="rotate(90 415 163)" className="fill-ink/70 text-[9px] font-mono pointer-events-none uppercase font-semibold">Concourse B</text>
          <text x="39" y="163" textAnchor="middle" className="fill-ink/70 text-[8px] font-mono pointer-events-none uppercase font-semibold">Gate A</text>
          <text x="461" y="163" textAnchor="middle" className="fill-ink/70 text-[8px] font-mono pointer-events-none uppercase font-semibold">Gate B</text>
          <text x="250" y="300" textAnchor="middle" className="fill-ink/70 text-[8px] font-mono pointer-events-none uppercase font-semibold">Gate C</text>
        </svg>
      </div>

      {selectedZone ? (
        <div className="mt-3 rounded border border-line bg-surface p-2.5 text-xs transition-opacity duration-300">
          <div className="flex justify-between items-center">
            <span className="font-display font-semibold uppercase text-ink">{selectedZone.label}</span>
            <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase font-semibold ${selectedZone.status === 'critical' ? 'bg-critical/10 text-critical' : selectedZone.status === 'warning' ? 'bg-warning/10 text-warning' : 'bg-safe/10 text-safe'}`}>
              {t(`status${selectedZone.status.charAt(0).toUpperCase() + selectedZone.status.slice(1)}`)}
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-2 text-ink-muted font-mono text-[10px]">
            <div>{t('densityLabel')}: <span className="text-ink font-semibold">{selectedZone.densityPercent.toFixed(0)}%</span></div>
            {selectedZone.waitMinutes > 0 && (
              <div>{t('waitLabel')}: <span className="text-ink font-semibold">{selectedZone.waitMinutes.toFixed(0)} {t('minutesAbbrev')}</span></div>
            )}
            <div className="col-span-2 text-[9px] uppercase tracking-wider text-ink-muted/60 mt-0.5 border-t border-line/40 pt-1">
              Cap: {selectedZone.capacityLimit.toLocaleString()} pax
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-center py-2.5 text-xs text-ink-muted/50 border border-dashed border-line/60 rounded">
          {t('stadiumMapSelectPrompt')}
        </div>
      )}
    </div>
  );
}

StadiumMap.propTypes = {
  zones: PropTypes.arrayOf(zoneShape).isRequired,
  t: translateFnPropType,
};
