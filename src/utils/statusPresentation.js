export const STATUS_PRESENTATION = {
  safe: {
    borderClass: 'border-safe/40',
    glowClass: 'shadow-[0_0_0_1px_rgba(63,182,127,0.25)]',
    dotClass: 'bg-safe',
    textClass: 'text-safe',
    labelKey: 'statusSafe',
  },
  warning: {
    borderClass: 'border-warning/50',
    glowClass: 'shadow-[0_0_18px_rgba(224,167,48,0.18)]',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    labelKey: 'statusWarning',
  },
  critical: {
    borderClass: 'border-critical/60',
    glowClass: 'shadow-[0_0_18px_rgba(220,76,76,0.28)]',
    dotClass: 'bg-critical animate-pulse-slow',
    textClass: 'text-critical',
    labelKey: 'statusCritical',
  },
};

export function getStatusPresentation(status) {
  return STATUS_PRESENTATION[status] ?? STATUS_PRESENTATION.safe;
}
