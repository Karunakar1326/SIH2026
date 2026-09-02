// ============================================================
// NEXUS — Authoritative Disaster Relocation Intelligence System
// TypeScript Data Definitions & Provenance Schemas
// ============================================================

// --- Authoritative Data Agencies ---
export type AuthoritativeAgency =
  | 'ISRO_NRSC'
  | 'IMD'
  | 'CWC'
  | 'GSI'
  | 'NCSCM'
  | 'CENSUS'
  | 'DISTRICT_ADMIN';

export const agencyMeta: Record<AuthoritativeAgency, { name: string; fullName: string; logoText: string; color: string }> = {
  ISRO_NRSC: { name: 'ISRO / NRSC', fullName: 'National Remote Sensing Centre (ISRO)', logoText: 'ISRO', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  IMD: { name: 'IMD', fullName: 'India Meteorological Department', logoText: 'IMD', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  CWC: { name: 'CWC', fullName: 'Central Water Commission', logoText: 'CWC', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  GSI: { name: 'GSI', fullName: 'Geological Survey of India', logoText: 'GSI', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  NCSCM: { name: 'NCSCM', fullName: 'National Centre for Sustainable Coastal Management', logoText: 'NCSCM', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  CENSUS: { name: 'Census of India', fullName: 'Office of the Registrar General & Census Commissioner', logoText: 'CENSUS', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  DISTRICT_ADMIN: { name: 'District Admin', fullName: 'District Disaster Management Authority', logoText: 'DDMA', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
};

// --- Alerts ---
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  hazard_type: HazardType;
  district: string;
  timestamp: string;
  is_active: boolean;
}

// --- Risk, Red-Zone & Classification ---
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type RedZoneStatus = 'red_zone' | 'warning_zone' | 'safe_zone';
export type RelocationUrgency = 'immediate' | 'short-term' | 'medium-term' | 'monitor';
export type RelocationPhase = 'phase_1' | 'phase_2' | 'phase_3' | 'monitor';
export type HazardType = 'flood' | 'landslide' | 'cyclone' | 'extreme_rainfall' | 'coastal_erosion';
export type FreshnessStatus = 'fresh' | 'recent' | 'stale';

export interface Coordinates {
  lat: number;
  lng: number;
}

// --- Data Provenance & Traceability ---
export interface DataProvenance {
  datasetName: string;
  agency: AuthoritativeAgency;
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  dataCompleteness: number; // 0-100
  methodologyNote?: string;
}

export interface ScoreFactor {
  name: string;
  score: number; // 0-100
  weight: number; // percentage
  agency: AuthoritativeAgency;
  rawValue: string;
  unit?: string;
  description: string;
}

export interface RedZoneCriteria {
  isRedZone: boolean;
  classificationTitle: string;
  primaryTrigger: string;
  hazardThresholdExceeded: boolean;
  elevationConstraintMet: boolean;
  historicalRecurrenceMet: boolean;
  triggerFactors: ScoreFactor[];
}

// --- Habitation ---
export interface HazardScore {
  flood: number;
  landslide: number;
  extreme_rainfall: number;
  coastal_erosion: number;
  cyclone: number;
}

export interface VulnerabilityFactors {
  population_exposure: number;
  housing_vulnerability: number;
  accessibility: number;
  healthcare_access: number;
  historical_impact: number;
  infrastructure_resilience: number;
}

export interface Habitation {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: Coordinates;
  population: number;
  households: number;
  area_sqkm: number;
  elevation_m: number;
  population_density: number;
  risk_score: number;
  risk_level: RiskLevel;
  red_zone: RedZoneCriteria;
  hazard_scores: HazardScore;
  vulnerability_score: number;
  vulnerability_factors: VulnerabilityFactors;
  historical_event_count: number;
  most_frequent_hazard: HazardType;
  relocation_priority: number;
  relocation_urgency: RelocationUrgency;
  assigned_phase: RelocationPhase;
  assigned_site_id?: string;
  provenance: Record<string, DataProvenance>;
  status: 'active' | 'relocated' | 'in_progress' | 'planned';
}

// --- Historical Events ---
export interface CycloneIntensity {
  type: 'cyclone';
  max_sustained_wind_kmh: number;
  min_central_pressure_hpa: number;
  rainfall_mm: number;
  storm_surge_m: number;
  movement_speed_kmh: number;
  classification: string;
}

export interface FloodIntensity {
  type: 'flood';
  peak_water_level_m: number;
  peak_discharge_m3s: number;
  flood_depth_m: number;
  rainfall_mm: number;
  duration_hours: number;
  flooded_area_sqkm: number;
}

export interface LandslideIntensity {
  type: 'landslide';
  trigger_rainfall_mm: number;
  slope_degrees: number;
  affected_area_sqkm: number;
  volume_m3: number;
  runout_distance_m: number;
}

export interface ExtremeRainfallIntensity {
  type: 'extreme_rainfall';
  rainfall_1hr_mm: number;
  rainfall_3hr_mm: number;
  rainfall_24hr_mm: number;
  peak_intensity_mmhr: number;
  duration_hours: number;
}

export interface CoastalErosionIntensity {
  type: 'coastal_erosion';
  erosion_rate_m_per_year: number;
  shoreline_retreat_m: number;
  wave_height_m: number;
  tide_surge_m: number;
}

export type HazardIntensity =
  | CycloneIntensity
  | FloodIntensity
  | LandslideIntensity
  | ExtremeRainfallIntensity
  | CoastalErosionIntensity;

export interface EventConsequences {
  people_affected: number;
  deaths: number;
  houses_damaged: number;
  houses_destroyed: number;
  roads_affected_km: number;
  infrastructure_damage_inr_cr: number;
  economic_loss_inr_cr: number;
  crops_affected_hectares: number;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  hazard_type: HazardType;
  date: string;
  end_date?: string;
  location: string;
  district: string;
  state: string;
  coordinates: Coordinates;
  affected_radius_km: number;
  intensity: HazardIntensity;
  consequences: EventConsequences;
  source: string;
  source_agency: AuthoritativeAgency;
  provenance: DataProvenance;
  description: string;
}

// --- Safe Sites & Candidate Funnel ---
export interface InfrastructureChecklist {
  road: boolean;
  water: boolean;
  electricity: boolean;
  healthcare: boolean;
  education: boolean;
  communication: boolean;
  drainage: boolean;
  sanitation: boolean;
}

export interface CarryingCapacity {
  buildable_land_sqkm: number;
  housing_capacity: number;
  water_capacity_people: number;
  sanitation_capacity_people: number;
  electricity_capacity_people: number;
  healthcare_capacity_people: number;
  education_capacity_students: number;
  road_access_quality: number; // 0-100
  emergency_access: boolean;
  bottleneck_dimension: string;
  environmental_constraints: string[];
  estimated_sustainable_capacity: number;
}

export interface FunnelStep {
  stageName: string;
  evaluatedCount: number;
  passedCount: number;
  rejectedCount: number;
  primaryRejectionReason?: string;
}

export interface SafeSite {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: Coordinates;
  area_sqkm: number;
  elevation_m: number;
  suitability_score: number;
  safety_score: number;
  capacity_score: number;
  infrastructure_score: number;
  accessibility_score: number;
  environmental_score: number;
  distance_from_habitation_km: number;
  target_habitation_id: string;
  infrastructure: InfrastructureChecklist;
  carrying_capacity: CarryingCapacity;
  funnel_history: FunnelStep[];
  provenance: Record<string, DataProvenance>;
  status: 'suitable' | 'rejected_hazard' | 'rejected_capacity' | 'rejected_infrastructure' | 'under_review';
  rejection_reason?: string;
}

// --- Relocation Optimization Assignment ---
export interface RelocationAssignment {
  id: string;
  habitationId: string;
  habitationName: string;
  habitationPopulation: number;
  siteId: string;
  siteName: string;
  siteSustainableCapacity: number;
  assignedPopulation: number;
  remainingSiteCapacity: number;
  travelDistanceKm: number;
  infrastructureStressPercent: number;
  phase: RelocationPhase;
  urgency: RelocationUrgency;
  suitabilityScore: number;
  recommendationReason: string[];
  confidence: 'high' | 'medium' | 'low';
}

// --- Agency Alerts & Data Freshness ---
export interface AgencyDataStatus {
  agency: AuthoritativeAgency;
  datasetName: string;
  lastUpdated: string;
  updateFrequency: string;
  status: FreshnessStatus;
  isLive: boolean;
}

export interface DynamicUpdateNotification {
  id: string;
  habitationId: string;
  habitationName: string;
  agency: AuthoritativeAgency;
  previousScore: number;
  newScore: number;
  hazardType: HazardType;
  changeReason: string;
  timestamp: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  coordinates: Coordinates;
  zoom: number;
}
