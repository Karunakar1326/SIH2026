import { useState, useId } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

export interface DataPoint {
  timestamp: string; // e.g. "11:42:15"
  value: number;
}

interface LiveTimeSeriesGraphProps {
  title: string;
  currentValue: number | string;
  unit: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendDetail?: string; // e.g. "+3.2 vs 30m avg"
  source: string;
  lastUpdatedSec: number;
  timeWindow: '1h' | '6h' | '24h';
  color?: string; // hex color string
  data: DataPoint[];
  prioritized?: boolean;
}

export function LiveTimeSeriesGraph({
  title,
  currentValue,
  unit,
  trend,
  trendDetail,
  source,
  lastUpdatedSec,
  timeWindow,
  color = '#FF5A1F',
  data,
  prioritized = false,
}: LiveTimeSeriesGraphProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const rawGraphId = useId();
  const graphId = rawGraphId.replace(/:/g, '');

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-center text-xs text-[#9A9A9A]">
        No telemetry data available for current window.
      </div>
    );
  }

  // Calculate min & max for SVG Y-axis scaling
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const svgWidth = 360;
  const svgHeight = 100;
  const paddingY = 16;
  const usableHeight = svgHeight - paddingY * 2;

  // Generate SVG points (x from 0 to svgWidth, y scaled inverse)
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * svgWidth;
    const normalizedY = (d.value - minVal) / valRange;
    const y = svgHeight - paddingY - normalizedY * usableHeight;
    return { x, y, timestamp: d.timestamp, value: d.value };
  });

  // SVG Smooth Path Command using smooth cubic curves
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) * 0.4;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) * 0.6;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, '');

  // Closed Path for Gradient Area Fill
  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  // Hover detection handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = mouseX / rect.width;
    const closestIdx = Math.round(ratio * (data.length - 1));
    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Trend Badge Styling
  const renderTrendBadge = () => {
    if (trend === 'increasing') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#FF5A1F] bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 px-2.5 py-0.5 rounded-full font-mono">
          <TrendingUp size={12} />
          <span>↑ Increasing</span>
        </span>
      );
    }
    if (trend === 'decreasing') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#34D399] bg-[#34D399]/15 border border-[#34D399]/30 px-2.5 py-0.5 rounded-full font-mono">
          <TrendingDown size={12} />
          <span>↓ Decreasing</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-[#FFB020] bg-[#FFB020]/15 border border-[#FFB020]/30 px-2.5 py-0.5 rounded-full font-mono">
        <Minus size={12} />
        <span>→ Stable</span>
      </span>
    );
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div
      className={`bg-[#1C1C1C] rounded-2xl border transition-all duration-300 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden group ${
        prioritized
          ? 'border-[#FF5A1F]/40 bg-gradient-to-b from-[#232323] to-[#1C1C1C]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between border-b border-white/8 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9A9A9A]">
              {title}
            </span>
            {prioritized && (
              <span className="text-[9px] font-bold bg-[#FF5A1F]/20 text-[#FF5A1F] px-1.5 py-0.5 rounded uppercase font-mono">
                PRIORITY INDICATOR
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white tabular-nums tracking-tight">
              {currentValue}
            </span>
            <span className="text-sm font-semibold text-[#9A9A9A] font-mono">{unit}</span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex flex-col items-end gap-1">
          {renderTrendBadge()}
          {trendDetail && (
            <span className="text-[10px] text-[#6B6B6B] font-mono">{trendDetail}</span>
          )}
        </div>
      </div>

      {/* SVG Time-Series Chart */}
      <div className="relative my-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-24 overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={`grad-${graphId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          <line x1="0" y1={paddingY} x2={svgWidth} y2={paddingY} stroke="#ffffff" strokeOpacity="0.06" strokeDasharray="3 3" />
          <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#ffffff" strokeOpacity="0.06" strokeDasharray="3 3" />
          <line x1="0" y1={svgHeight - paddingY} x2={svgWidth} y2={svgHeight - paddingY} stroke="#ffffff" strokeOpacity="0.06" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={areaD} fill={`url(#grad-${graphId})`} />

          {/* Continuous Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Latest Point Pulsing Dot */}
          {hoverIndex === null && (
            <g transform={`translate(${points[points.length - 1].x}, ${points[points.length - 1].y})`}>
              <circle r="6" fill={color} opacity="0.4" className="animate-ping" />
              <circle r="3.5" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            </g>
          )}

          {/* Interactive Hover Point & Guideline */}
          {hoverIndex !== null && activePoint && (
            <g>
              {/* Vertical Guide Line */}
              <line
                x1={activePoint.x}
                y1="0"
                x2={activePoint.x}
                y2={svgHeight}
                stroke="#FFFFFF"
                strokeOpacity="0.3"
                strokeDasharray="2 2"
              />
              {/* Hover Highlight Circle */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="shadow-lg"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && activePoint && (
          <div
            className="absolute -top-3 z-20 bg-[#141414]/95 text-white border border-white/20 text-[10px] font-mono px-2.5 py-1 rounded-lg shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full animate-fade-in flex items-center gap-2 whitespace-nowrap"
            style={{
              left: `${(hoverIndex / (data.length - 1)) * 100}%`,
            }}
          >
            <span className="text-[#9A9A9A]">{activePoint.timestamp}</span>
            <span className="font-bold" style={{ color }}>
              {activePoint.value} {unit}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info Row */}
      <div className="flex items-center justify-between border-t border-white/8 pt-2.5 mt-2 text-[10px] font-mono text-[#6B6B6B]">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-[#9A9A9A]" />
          <span>Last {timeWindow === '1h' ? '1 Hour' : timeWindow === '6h' ? '6 Hours' : '24 Hours'} Trend</span>
        </div>

        <div className="flex items-center gap-2">
          <span>{source}</span>
          <span>•</span>
          <span className="text-[#9A9A9A]">Updated {lastUpdatedSec}s ago</span>
        </div>
      </div>
    </div>
  );
}
