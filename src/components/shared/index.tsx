import { type ReactNode } from 'react';
import { riskBgColor, riskBorderColor, freshnessColor, freshnessLabel, riskFromScore } from '@/utils/helpers';
import type { RiskLevel, FreshnessStatus } from '@/data/types';
import { Info, TrendingUp, TrendingDown, Minus, AlertCircle, Loader2, FolderOpen } from 'lucide-react';

// === KPIBlock ===
interface KPIBlockProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  riskLevel?: RiskLevel;
  icon?: ReactNode;
  className?: string;
}

export function KPIBlock({ label, value, unit, trend, riskLevel, icon, className = '' }: KPIBlockProps) {
  const trendIcon = trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />;
  const borderClass = riskLevel ? riskBorderColor(riskLevel) : 'border-neutral-200';

  return (
    <div className={`bg-white rounded-lg border-l-[3px] ${borderClass} border border-neutral-150 px-4 py-3 animate-count-up ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        {unit && <span className="text-xs text-neutral-500">{unit}</span>}
        {trend && (
          <span className={`ml-auto text-xs flex items-center gap-0.5 ${
            trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-neutral-400'
          }`}>
            {trendIcon}
          </span>
        )}
      </div>
    </div>
  );
}

// === StatusBadge ===
interface StatusBadgeProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ level, label, size = 'sm' }: StatusBadgeProps) {
  const classes = riskBgColor(level);
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${classes} ${sizeClasses}`}>
      {label || level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

// === RiskScoreBadge ===
interface RiskScoreBadgeProps {
  score: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreBadge({ score, max = 100, showLabel = true, size = 'md' }: RiskScoreBadgeProps) {
  const level = riskFromScore(score);
  const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg' };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold ${riskBgColor(level)} border`}>
        {score}
      </div>
      {showLabel && <span className="text-[10px] text-neutral-500">/ {max}</span>}
    </div>
  );
}

// === DataFreshnessIndicator ===
interface DataFreshnessProps {
  name: string;
  status: FreshnessStatus;
  lastUpdated: string;
}

export function DataFreshnessIndicator({ name, status, lastUpdated }: DataFreshnessProps) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5">
      <span className="text-neutral-600">{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-neutral-400">{lastUpdated}</span>
        <span className={`font-medium ${freshnessColor(status)}`}>{freshnessLabel(status)}</span>
      </div>
    </div>
  );
}

// === ConfidenceIndicator ===
interface ConfidenceProps {
  label: string;
  value: number;
  suffix?: string;
}

export function ConfidenceIndicator({ label, value, suffix = '%' }: ConfidenceProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-neutral-500">{label}</span>
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-neutral-700 font-medium w-10 text-right">{value}{suffix}</span>
    </div>
  );
}

// === IntensityMetric ===
interface IntensityMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  highlight?: boolean;
}

export function IntensityMetric({ label, value, unit, tooltip, highlight }: IntensityMetricProps) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md ${highlight ? 'bg-neutral-50' : ''}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-neutral-600">{label}</span>
        {tooltip && (
          <span className="group relative">
            <Info size={12} className="text-neutral-400 cursor-help" />
            <span className="hidden group-hover:block absolute left-0 top-5 z-50 w-64 p-2 text-xs bg-neutral-900 text-neutral-200 rounded-md shadow-lg">
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-semibold text-neutral-900">{value}</span>
        {unit && <span className="text-xs text-neutral-500">{unit}</span>}
      </div>
    </div>
  );
}

// === HazardScoreBar ===
interface HazardScoreBarProps {
  label: string;
  score: number;
  max?: number;
  color?: string;
}

export function HazardScoreBar({ label, score, max = 100, color }: HazardScoreBarProps) {
  const level = riskFromScore(score);
  const barColor = color || `bg-risk-${level}`;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-600">{label}</span>
        <span className="text-xs font-semibold text-neutral-800">{score}</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

// === SectionHeader ===
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// === PageHeader ===
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path?: string }[];
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-150">
      <div>
        <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// === EmptyState ===
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-neutral-300 mb-3">{icon || <FolderOpen size={40} />}</div>
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      {description && <p className="text-xs text-neutral-400 mt-1 max-w-sm">{description}</p>}
    </div>
  );
}

// === LoadingState ===
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 size={24} className="text-accent animate-spin mb-3" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}

// === ErrorState ===
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Failed to load data.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle size={32} className="text-red-400 mb-3" />
      <p className="text-sm font-medium text-neutral-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-xs text-accent hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}

// === AIExplanationPanel ===
interface AIExplanationProps {
  title: string;
  reasons: { label: string; positive: boolean }[];
  disclaimer?: string;
}

export function AIExplanationPanel({ title, reasons, disclaimer }: AIExplanationProps) {
  return (
    <div className="bg-accent-bg border border-blue-100 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-accent-dark mb-3">{title}</h4>
      <div className="space-y-1.5">
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={r.positive ? 'text-green-600' : 'text-red-500'}>
              {r.positive ? '✓' : '✗'}
            </span>
            <span className="text-neutral-700">{r.label}</span>
          </div>
        ))}
      </div>
      {disclaimer && (
        <p className="text-[10px] text-neutral-400 mt-3 border-t border-blue-100 pt-2">{disclaimer}</p>
      )}
    </div>
  );
}
