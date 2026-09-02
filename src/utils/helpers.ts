import type { RiskLevel, FreshnessStatus, HazardType } from '@/data/types';

// --- Risk Level Helpers ---
export const riskColor = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    low: '#22c55e',
    moderate: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };
  return map[level];
};

export const riskBgColor = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    low: 'bg-risk-low-bg text-green-800',
    moderate: 'bg-risk-moderate-bg text-yellow-800',
    high: 'bg-risk-high-bg text-orange-800',
    critical: 'bg-risk-critical-bg text-red-800',
  };
  return map[level];
};

export const riskBorderColor = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    low: 'border-risk-low',
    moderate: 'border-risk-moderate',
    high: 'border-risk-high',
    critical: 'border-risk-critical',
  };
  return map[level];
};

export const riskFromScore = (score: number): RiskLevel => {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
};

// --- Freshness Helpers ---
export const freshnessColor = (status: FreshnessStatus): string => {
  const map: Record<FreshnessStatus, string> = {
    fresh: 'text-fresh',
    recent: 'text-recent',
    stale: 'text-stale',
  };
  return map[status];
};

export const freshnessLabel = (status: FreshnessStatus): string => {
  const map: Record<FreshnessStatus, string> = {
    fresh: 'Fresh',
    recent: 'Recent',
    stale: 'Stale',
  };
  return map[status];
};

// --- Formatting ---
export const formatNumber = (n: number): string => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return n.toLocaleString('en-IN');
  return n.toString();
};

export const formatCompactNumber = (n: number): string => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
};

// --- Hazard Labels ---
export const hazardLabel = (type: HazardType): string => {
  const map: Record<HazardType, string> = {
    flood: 'Flood',
    landslide: 'Landslide',
    cyclone: 'Cyclone',
    extreme_rainfall: 'Extreme Rainfall',
    coastal_erosion: 'Coastal Erosion',
  };
  return map[type];
};

export const hazardIcon = (type: HazardType): string => {
  const map: Record<HazardType, string> = {
    flood: '🌊',
    landslide: '⛰️',
    cyclone: '🌀',
    extreme_rainfall: '⛈️',
    coastal_erosion: '🏖️',
  };
  return map[type];
};

// --- Urgency ---
export const urgencyLabel = (urgency: string): string => {
  const map: Record<string, string> = {
    immediate: 'Immediate',
    'short-term': 'Short-term',
    'medium-term': 'Medium-term',
    monitor: 'Monitor',
  };
  return map[urgency] || urgency;
};

export const urgencyColor = (urgency: string): string => {
  const map: Record<string, string> = {
    immediate: 'bg-red-100 text-red-800 border-red-200',
    'short-term': 'bg-orange-100 text-orange-800 border-orange-200',
    'medium-term': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    monitor: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return map[urgency] || '';
};
