import type { Alert, AgencyDataStatus, DynamicUpdateNotification } from './types';

export const alerts: Alert[] = [
  { id: 'alert-001', title: 'RED-ZONE ALERT — Arjipalli & Podampeta Coastal Breach', description: 'IMD & ISRO coastal surge models confirm critical tide inundation threat. Immediate evacuation & relocation phase-1 triggered.', severity: 'critical', hazard_type: 'cyclone', district: 'Ganjam', timestamp: '2026-09-01T08:30:00Z', is_active: true },
  { id: 'alert-002', title: 'IMD Orange Warning — Heavy Rainfall Corridor Ganjam', description: 'IMD Doppler Weather Radar indicates >220mm rainfall over next 24 hours in coastal river basins.', severity: 'high', hazard_type: 'extreme_rainfall', district: 'Ganjam', timestamp: '2026-09-01T06:00:00Z', is_active: true },
  { id: 'alert-003', title: 'CWC Mahanadi River Level Above Danger Mark', description: 'CWC Telemetry Station Naraj records 25.95m water level against 26.41m danger mark. Flood watch active for Jagatsinghpur Delta.', severity: 'high', hazard_type: 'flood', district: 'Jagatsinghpur', timestamp: '2026-09-01T10:15:00Z', is_active: true },
  { id: 'alert-004', title: 'NCSCM Erosion Emergency — Satabhaya Coast', description: 'NCSCM satellite monitoring reports 3 additional structures compromised by coastal erosion retreat.', severity: 'critical', hazard_type: 'coastal_erosion', district: 'Kendrapara', timestamp: '2026-08-28T14:00:00Z', is_active: true },
  { id: 'alert-005', title: 'GSI Slope Saturation Advisory — Western Ganjam', description: 'Geological Survey of India marks hill slope soil saturation at critical 92% capacity.', severity: 'moderate', hazard_type: 'landslide', district: 'Ganjam', timestamp: '2026-08-30T11:00:00Z', is_active: true },
];

export const agencyStatuses: AgencyDataStatus[] = [
  { agency: 'IMD', datasetName: 'Tropical Cyclone & Weather Radar', lastUpdated: '2026-09-01T11:00:00Z', updateFrequency: 'Every 15 minutes', status: 'fresh', isLive: true },
  { agency: 'CWC', datasetName: 'Mahanadi Basin River Level Telemetry', lastUpdated: '2026-09-01T10:30:00Z', updateFrequency: 'Hourly', status: 'fresh', isLive: true },
  { agency: 'ISRO_NRSC', datasetName: 'CartoDEM v3 & Bhuvan NDEM Layers', lastUpdated: '2026-08-30T06:00:00Z', updateFrequency: 'Daily / On-demand', status: 'recent', isLive: false },
  { agency: 'NCSCM', datasetName: 'National Shoreline Change Monitoring', lastUpdated: '2026-08-29T08:00:00Z', updateFrequency: 'Weekly', status: 'recent', isLive: false },
  { agency: 'GSI', datasetName: 'Landslide Susceptibility GIS Inventory', lastUpdated: '2026-08-25T00:00:00Z', updateFrequency: 'Monthly', status: 'recent', isLive: false },
  { agency: 'CENSUS', datasetName: 'Habitation Demographics & Household Survey', lastUpdated: '2026-03-15T00:00:00Z', updateFrequency: 'Annual', status: 'stale', isLive: false },
  { agency: 'DISTRICT_ADMIN', datasetName: 'DDMA Infrastructure & Relief Register', lastUpdated: '2026-08-28T00:00:00Z', updateFrequency: 'Weekly', status: 'recent', isLive: false },
];

export const dynamicNotifications: DynamicUpdateNotification[] = [
  {
    id: 'dyn-001',
    habitationId: 'hab-001',
    habitationName: 'Arjipalli',
    agency: 'IMD',
    previousScore: 82,
    newScore: 94,
    hazardType: 'cyclone',
    changeReason: 'Updated IMD storm surge model increased inundation forecast depth from 2.2m to 4.5m.',
    timestamp: '2026-09-01T11:05:00Z',
  },
  {
    id: 'dyn-002',
    habitationId: 'hab-004',
    habitationName: 'Noliasahi',
    agency: 'CWC',
    previousScore: 86,
    newScore: 92,
    hazardType: 'flood',
    changeReason: 'CWC river discharge telemetry reported 12% increase in peak flood flow at downstream gauge.',
    timestamp: '2026-09-01T10:45:00Z',
  },
];

export const currentConditions = {
  hazard_type: 'cyclone' as const,
  wind_kmh: 145,
  pressure_hpa: 960,
  rainfall_mm: 220,
  similarity_to_historical: 87,
  closest_analogue_id: 'evt-002',
};

export const getAlerts = async (): Promise<Alert[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(alerts), 100));
};

export const getAgencyStatuses = async (): Promise<AgencyDataStatus[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(agencyStatuses), 100));
};
