export const DIRECTIVE_PRESENTATION = {
  critical: { textClass: 'text-critical', borderClass: 'border-critical/40', prefixSymbol: '▲' },
  advisory: { textClass: 'text-warning', borderClass: 'border-warning/40', prefixSymbol: '●' },
  info: { textClass: 'text-safe', borderClass: 'border-safe/30', prefixSymbol: '✓' },
};

export function getDirectivePresentation(severity) {
  return DIRECTIVE_PRESENTATION[severity] ?? DIRECTIVE_PRESENTATION.info;
}
