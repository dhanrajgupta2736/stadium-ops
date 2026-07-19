/**
 * Type declarations for Stadium Operations Command Center.
 * Provides explicit IDE autocompletion and static type analysis guarantees.
 */

export type ZoneCategory = 'gate' | 'concourse' | 'seating' | 'hospitality';
export type ZoneStatus = 'safe' | 'warning' | 'critical';
export type DirectiveSeverity = 'info' | 'advisory' | 'critical';
export type IncidentType = 'medical' | 'blockage' | 'asset_failure';
export type SupportedLocale = 'en' | 'es' | 'ar' | 'fr';

export interface StadiumZone {
  id: string;
  label: string;
  category: ZoneCategory;
  capacityLimit: number;
  densityPercent: number;
  waitMinutes: number;
  status: ZoneStatus;
  lastUpdatedAt: number;
}

export interface DirectiveDescriptor {
  id: string;
  severity: DirectiveSeverity;
  messageKey: string;
  messageParams: Record<string, string | number>;
  occurredAt: number;
}

export interface ZoneAdjustment {
  zoneId: string;
  densityDelta: number;
  waitDelta: number;
}

export interface DispatchAction {
  id: string;
  labelKey: string;
  descriptionKey: string;
  adjustments: ZoneAdjustment[];
}

export interface IncidentEntry {
  id: string;
  incidentType: IncidentType;
  zoneLabel: string;
  description: string;
  protocolKey: string;
  loggedAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LocaleMeta {
  label: string;
  direction: 'ltr' | 'rtl';
}

export type TranslateFunction = (key: string, params?: Record<string, string | number>) => string;
