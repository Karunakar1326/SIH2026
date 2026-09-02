import type { SafeSite } from './types';

export const safeSites: SafeSite[] = [
  {
    id: 'site-001', name: 'Beguniapada Plateau', district: 'Ganjam', state: 'Odisha',
    coordinates: { lat: 19.52, lng: 84.82 }, area_sqkm: 4.2, elevation_m: 45,
    suitability_score: 88, safety_score: 92, capacity_score: 85, infrastructure_score: 82, accessibility_score: 78, environmental_score: 90,
    distance_from_habitation_km: 18, target_habitation_id: 'hab-001',
    infrastructure: { road: true, water: true, electricity: true, healthcare: true, education: true, communication: true, drainage: true, sanitation: true },
    carrying_capacity: { buildable_land_sqkm: 2.8, housing_capacity: 4200, water_capacity_people: 5000, sanitation_capacity_people: 3800, electricity_capacity_people: 5500, healthcare_capacity_people: 4000, education_capacity_students: 1200, road_access_quality: 78, emergency_access: true, bottleneck_dimension: 'Sanitation Infrastructure', environmental_constraints: ['Minor seasonal waterlogging in NE section'], estimated_sustainable_capacity: 3800 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion (IMD/CWC/GSI)', evaluatedCount: 23, passedCount: 12, rejectedCount: 11, primaryRejectionReason: 'Located inside Cat-4 Surge Zone or 100-yr Flood Inundation Area' },
      { stageName: 'Stage 3: Terrain & Slope Exclusion (DEM)', evaluatedCount: 12, passedCount: 9, rejectedCount: 3, primaryRejectionReason: 'Slope gradient > 25° or Elevation < 10m MSL' },
      { stageName: 'Stage 4: Infrastructure Suitability (PWD/PHED)', evaluatedCount: 9, passedCount: 5, rejectedCount: 4, primaryRejectionReason: 'No all-weather road access or severe water deficit' },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2, primaryRejectionReason: 'Capacity insufficient for target population requirement' },
    ],
    provenance: {
      site: { datasetName: 'ISRO Bhuvan Land Use Land Cover (LULC)', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 98 },
      infra: { datasetName: 'Ganjam PWD & PHED Asset Register', agency: 'DISTRICT_ADMIN', lastUpdated: '2026-08-28T00:00:00Z', confidence: 'high', dataCompleteness: 92 },
    },
    status: 'suitable',
  },
  {
    id: 'site-002', name: 'Kukudakhandi Upland', district: 'Ganjam', state: 'Odisha',
    coordinates: { lat: 19.42, lng: 84.88 }, area_sqkm: 3.5, elevation_m: 38,
    suitability_score: 82, safety_score: 88, capacity_score: 78, infrastructure_score: 75, accessibility_score: 82, environmental_score: 85,
    distance_from_habitation_km: 14, target_habitation_id: 'hab-001',
    infrastructure: { road: true, water: true, electricity: true, healthcare: true, education: false, communication: true, drainage: false, sanitation: true },
    carrying_capacity: { buildable_land_sqkm: 2.2, housing_capacity: 3100, water_capacity_people: 3500, sanitation_capacity_people: 2800, electricity_capacity_people: 4000, healthcare_capacity_people: 3000, education_capacity_students: 800, road_access_quality: 72, emergency_access: true, bottleneck_dimension: 'Sanitation Capacity', environmental_constraints: [], estimated_sustainable_capacity: 2800 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion (IMD/CWC/GSI)', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain & Slope Exclusion (DEM)', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability (PWD/PHED)', evaluatedCount: 9, passedCount: 5, rejectedCount: 4 },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2 },
    ],
    provenance: {
      site: { datasetName: 'ISRO Bhuvan LULC', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 95 },
    },
    status: 'suitable',
  },
  {
    id: 'site-003', name: 'Dharakote Ridge', district: 'Ganjam', state: 'Odisha',
    coordinates: { lat: 19.55, lng: 84.75 }, area_sqkm: 5.0, elevation_m: 55,
    suitability_score: 91, safety_score: 95, capacity_score: 88, infrastructure_score: 85, accessibility_score: 75, environmental_score: 88,
    distance_from_habitation_km: 28, target_habitation_id: 'hab-002',
    infrastructure: { road: true, water: true, electricity: true, healthcare: true, education: true, communication: true, drainage: true, sanitation: true },
    carrying_capacity: { buildable_land_sqkm: 3.5, housing_capacity: 5200, water_capacity_people: 6000, sanitation_capacity_people: 4500, electricity_capacity_people: 6500, healthcare_capacity_people: 4800, education_capacity_students: 1500, road_access_quality: 82, emergency_access: true, bottleneck_dimension: 'Sanitation Facility Capacity', environmental_constraints: ['Protected forest buffer 2km east'], estimated_sustainable_capacity: 4500 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain Exclusion', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability', evaluatedCount: 9, passedCount: 5, rejectedCount: 4 },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2 },
    ],
    provenance: {
      site: { datasetName: 'Survey of India Toposheets & ISRO LULC', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 98 },
    },
    status: 'suitable',
  },
  {
    id: 'site-004', name: 'Naugaon Highlands', district: 'Jagatsinghpur', state: 'Odisha',
    coordinates: { lat: 20.35, lng: 86.08 }, area_sqkm: 6.2, elevation_m: 35,
    suitability_score: 85, safety_score: 90, capacity_score: 82, infrastructure_score: 80, accessibility_score: 85, environmental_score: 82,
    distance_from_habitation_km: 22, target_habitation_id: 'hab-004',
    infrastructure: { road: true, water: true, electricity: true, healthcare: false, education: true, communication: true, drainage: true, sanitation: false },
    carrying_capacity: { buildable_land_sqkm: 4.0, housing_capacity: 6000, water_capacity_people: 5500, sanitation_capacity_people: 3500, electricity_capacity_people: 7000, healthcare_capacity_people: 2500, education_capacity_students: 1800, road_access_quality: 80, emergency_access: true, bottleneck_dimension: 'Healthcare Facility Capacity', environmental_constraints: ['Wetland area in southern portion - not buildable'], estimated_sustainable_capacity: 3500 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain Exclusion', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability', evaluatedCount: 9, passedCount: 5, rejectedCount: 4 },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2 },
    ],
    provenance: {
      site: { datasetName: 'ISRO Bhuvan LULC', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 94 },
    },
    status: 'suitable',
  },
  {
    id: 'site-005', name: 'Bagapatia Flatlands', district: 'Kendrapara', state: 'Odisha',
    coordinates: { lat: 20.58, lng: 86.62 }, area_sqkm: 3.0, elevation_m: 22,
    suitability_score: 79, safety_score: 82, capacity_score: 75, infrastructure_score: 72, accessibility_score: 80, environmental_score: 78,
    distance_from_habitation_km: 16, target_habitation_id: 'hab-006',
    infrastructure: { road: true, water: true, electricity: true, healthcare: true, education: true, communication: false, drainage: false, sanitation: true },
    carrying_capacity: { buildable_land_sqkm: 2.0, housing_capacity: 2800, water_capacity_people: 3200, sanitation_capacity_people: 2400, electricity_capacity_people: 3500, healthcare_capacity_people: 2000, education_capacity_students: 600, road_access_quality: 68, emergency_access: true, bottleneck_dimension: 'Healthcare Capacity', environmental_constraints: ['Proximity to mangrove buffer zone'], estimated_sustainable_capacity: 2000 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain Exclusion', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability', evaluatedCount: 9, passedCount: 5, rejectedCount: 4 },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2 },
    ],
    provenance: {
      site: { datasetName: 'Kendrapara Revenue Land Records & ISRO DEM', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 92 },
    },
    status: 'suitable',
  },
  {
    id: 'site-006', name: 'Coastal Strip A', district: 'Ganjam', state: 'Odisha',
    coordinates: { lat: 19.30, lng: 85.15 }, area_sqkm: 1.5, elevation_m: 5,
    suitability_score: 22, safety_score: 18, capacity_score: 65, infrastructure_score: 58, accessibility_score: 72, environmental_score: 30,
    distance_from_habitation_km: 8, target_habitation_id: 'hab-001',
    infrastructure: { road: true, water: false, electricity: true, healthcare: false, education: false, communication: true, drainage: false, sanitation: false },
    carrying_capacity: { buildable_land_sqkm: 0.8, housing_capacity: 900, water_capacity_people: 500, sanitation_capacity_people: 400, electricity_capacity_people: 1200, healthcare_capacity_people: 0, education_capacity_students: 0, road_access_quality: 45, emergency_access: false, bottleneck_dimension: 'Water Supply', environmental_constraints: ['CRZ Zone I', 'High storm surge exposure'], estimated_sustainable_capacity: 400 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion (IMD/CWC/GSI)', evaluatedCount: 23, passedCount: 12, rejectedCount: 11, primaryRejectionReason: 'REJECTED: Elevation < 5m MSL inside IMD Category-4 Surge Inundation Corridor.' },
    ],
    provenance: {
      site: { datasetName: 'CRZ Mapping & IMD Surge Layer', agency: 'NCSCM', lastUpdated: '2026-08-29T08:00:00Z', confidence: 'high', dataCompleteness: 95 },
    },
    status: 'rejected_hazard', rejection_reason: 'REJECTED at Stage 2 (Hazard Exclusion): Located within IMD Cat-4 Storm Surge & Coastal Erosion Zone. Elevation 5m MSL is below safe threshold.',
  },
  {
    id: 'site-007', name: 'Riverside Plot B', district: 'Jagatsinghpur', state: 'Odisha',
    coordinates: { lat: 20.22, lng: 86.25 }, area_sqkm: 2.0, elevation_m: 8,
    suitability_score: 35, safety_score: 28, capacity_score: 72, infrastructure_score: 62, accessibility_score: 68, environmental_score: 40,
    distance_from_habitation_km: 12, target_habitation_id: 'hab-004',
    infrastructure: { road: true, water: true, electricity: true, healthcare: false, education: false, communication: true, drainage: false, sanitation: false },
    carrying_capacity: { buildable_land_sqkm: 1.2, housing_capacity: 1800, water_capacity_people: 2000, sanitation_capacity_people: 1000, electricity_capacity_people: 2500, healthcare_capacity_people: 0, education_capacity_students: 0, road_access_quality: 55, emergency_access: false, bottleneck_dimension: 'Flood Plain Inundation', environmental_constraints: ['Mahanadi flood plain'], estimated_sustainable_capacity: 1000 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion (IMD/CWC/GSI)', evaluatedCount: 23, passedCount: 12, rejectedCount: 11, primaryRejectionReason: 'REJECTED: Located inside CWC 100-year Flood Inundation Zone.' },
    ],
    provenance: {
      site: { datasetName: 'CWC Flood Plain Zoning Map', agency: 'CWC', lastUpdated: '2026-09-01T10:30:00Z', confidence: 'high', dataCompleteness: 92 },
    },
    status: 'rejected_hazard', rejection_reason: 'REJECTED at Stage 2 (Hazard Exclusion): Located within CWC 100-year flood inundation zone. Historical peak water depth exceeds 2.5m.',
  },
  {
    id: 'site-008', name: 'Small Hill Patch C', district: 'Ganjam', state: 'Odisha',
    coordinates: { lat: 19.48, lng: 84.72 }, area_sqkm: 0.5, elevation_m: 65,
    suitability_score: 42, safety_score: 88, capacity_score: 18, infrastructure_score: 25, accessibility_score: 35, environmental_score: 72,
    distance_from_habitation_km: 32, target_habitation_id: 'hab-002',
    infrastructure: { road: false, water: false, electricity: false, healthcare: false, education: false, communication: false, drainage: false, sanitation: false },
    carrying_capacity: { buildable_land_sqkm: 0.3, housing_capacity: 350, water_capacity_people: 200, sanitation_capacity_people: 150, electricity_capacity_people: 0, healthcare_capacity_people: 0, education_capacity_students: 0, road_access_quality: 15, emergency_access: false, bottleneck_dimension: 'Buildable Land Deficit', environmental_constraints: ['Steep hill slope', 'Forest clearance needed'], estimated_sustainable_capacity: 150 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain Exclusion', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability', evaluatedCount: 9, passedCount: 5, rejectedCount: 4 },
      { stageName: 'Stage 5: Carrying Capacity Evaluation', evaluatedCount: 5, passedCount: 3, rejectedCount: 2, primaryRejectionReason: 'REJECTED: Capacity (150 people) far below required target population of 2,180.' },
    ],
    provenance: {
      site: { datasetName: 'ISRO DEM & LULC Map', agency: 'ISRO_NRSC', lastUpdated: '2026-08-30T06:00:00Z', confidence: 'high', dataCompleteness: 90 },
    },
    status: 'rejected_capacity', rejection_reason: 'REJECTED at Stage 5 (Carrying Capacity): Insufficient buildable land area (0.3 sqkm) and maximum capacity of 150 people for target population of 2,180.',
  },
  {
    id: 'site-009', name: 'Industrial Zone D', district: 'Kendrapara', state: 'Odisha',
    coordinates: { lat: 20.55, lng: 86.70 }, area_sqkm: 3.8, elevation_m: 18,
    suitability_score: 38, safety_score: 72, capacity_score: 68, infrastructure_score: 22, accessibility_score: 55, environmental_score: 25,
    distance_from_habitation_km: 20, target_habitation_id: 'hab-007',
    infrastructure: { road: true, water: false, electricity: true, healthcare: false, education: false, communication: true, drainage: false, sanitation: false },
    carrying_capacity: { buildable_land_sqkm: 2.5, housing_capacity: 3500, water_capacity_people: 800, sanitation_capacity_people: 600, electricity_capacity_people: 4000, healthcare_capacity_people: 0, education_capacity_students: 0, road_access_quality: 60, emergency_access: true, bottleneck_dimension: 'Water & Sanitation Deficit', environmental_constraints: ['Soil industrial contamination'], estimated_sustainable_capacity: 600 },
    funnel_history: [
      { stageName: 'Stage 1: Candidate Identification', evaluatedCount: 23, passedCount: 23, rejectedCount: 0 },
      { stageName: 'Stage 2: Hazard Exclusion', evaluatedCount: 23, passedCount: 12, rejectedCount: 11 },
      { stageName: 'Stage 3: Terrain Exclusion', evaluatedCount: 12, passedCount: 9, rejectedCount: 3 },
      { stageName: 'Stage 4: Infrastructure Suitability', evaluatedCount: 9, passedCount: 5, rejectedCount: 4, primaryRejectionReason: 'REJECTED: Absence of potable water supply and health/education infrastructure.' },
    ],
    provenance: {
      site: { datasetName: 'Kendrapara District Infrastructure Survey', agency: 'DISTRICT_ADMIN', lastUpdated: '2026-08-28T00:00:00Z', confidence: 'high', dataCompleteness: 88 },
    },
    status: 'rejected_infrastructure', rejection_reason: 'REJECTED at Stage 4 (Infrastructure Suitability): Severe deficit in drinking water supply, sanitation, healthcare, and primary education infrastructure.',
  },
];

export const getSafeSites = async (): Promise<SafeSite[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(safeSites), 200));
};
