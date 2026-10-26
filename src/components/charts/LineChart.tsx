import React, { useState } from 'react';

export interface DataPoint {
  label: string;
  actual?: number;
  forecast?: number;
  lowerBound?: number;
  upperBound?: number;
  secondary?: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  showForecast?: boolean;
  showBounds?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  actualLabel?: string;
  forecastLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 240,
  showForecast = true,
  showBounds = true,
  valuePrefix = '',
  valueSuffix = '',
  actualLabel = 'Actual Footfall',
  forecastLabel = 'ML Predicted Inflow',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Extract all numeric values to calculate bounds
  const allValues: number[] = [];
  data.forEach((d) => {
    if (d.actual !== undefined) allValues.push(d.actual);
    if (d.forecast !== undefined) allValues.push(d.forecast);
    if (d.lowerBound !== undefined) allValues.push(d.lowerBound);
    if (d.upperBound !== undefined) allValues.push(d.upperBound);
  });

  const minVal = Math.min(...allValues) * 0.92;
  const maxVal = Math.max(...allValues) * 1.05;
  const range = maxVal - minVal || 1;

  const paddingLeft = 60;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = 720;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - ((val - minVal) / range) * innerHeight;

  // Build Actual Path (only for points with actual)
  const actualPoints: { x: number; y: number; idx: number }[] = [];
  data.forEach((d, i) => {
    if (d.actual !== undefined) {
      actualPoints.push({ x: getX(i), y: getY(d.actual), idx: i });
    }
  });

  // Build Forecast Path
  const forecastPoints: { x: number; y: number; idx: number }[] = [];
  data.forEach((d, i) => {
    if (d.forecast !== undefined) {
      forecastPoints.push({ x: getX(i), y: getY(d.forecast), idx: i });
    }
  });

  const makePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
  };

  const actualPath = makePath(actualPoints);
  const forecastPath = makePath(forecastPoints);

  // Confidence Interval Area
  let boundsAreaPath = '';
  if (showBounds) {
    const upperPoints: { x: number; y: number }[] = [];
    const lowerPoints: { x: number; y: number }[] = [];
    data.forEach((d, i) => {
      if (d.upperBound !== undefined && d.lowerBound !== undefined) {
        upperPoints.push({ x: getX(i), y: getY(d.upperBound) });
        lowerPoints.push({ x: getX(i), y: getY(d.lowerBound) });
      }
    });

    if (upperPoints.length > 0 && lowerPoints.length > 0) {
      const topStr = upperPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
      const botStr = lowerPoints.reverse().reduce((acc, p) => `${acc} L ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
      boundsAreaPath = `${topStr} ${botStr} Z`;
    }
  }

  // Y-axis tick values (4 steps)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => minVal + pct * range);

  const hoveredData = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible font-sans"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                {valuePrefix}
                {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                {valueSuffix}
              </text>
            </g>
          );
        })}

        {/* Confidence Band Area */}
        {showBounds && boundsAreaPath && (
          <path d={boundsAreaPath} fill="rgba(6, 182, 212, 0.08)" stroke="rgba(6, 182, 212, 0.2)" strokeDasharray="3 3" />
        )}

        {/* Forecast Area & Line */}
        {showForecast && forecastPath && (
          <>
            <path
              d={`${forecastPath} L ${getX(data.length - 1)},${chartHeight - paddingBottom} L ${forecastPoints[0].x},${chartHeight - paddingBottom} Z`}
              fill="url(#forecastGradient)"
            />
            <path
              d={forecastPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Actual Area & Line */}
        {actualPoints.length > 0 && (
          <>
            <path
              d={`${actualPath} L ${actualPoints[actualPoints.length - 1].x},${chartHeight - paddingBottom} L ${actualPoints[0].x},${chartHeight - paddingBottom} Z`}
              fill="url(#actualGradient)"
            />
            <path
              d={actualPath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Data points and hover overlays */}
        {data.map((d, idx) => {
          const x = getX(idx);
          const isHovered = hoverIndex === idx;

          return (
            <g key={idx} onMouseEnter={() => setHoverIndex(idx)} className="cursor-pointer">
              {/* Invisible interactive hover hit area */}
              <rect
                x={x - innerWidth / data.length / 2}
                y={paddingTop}
                width={innerWidth / data.length}
                height={innerHeight}
                fill="transparent"
              />

              {/* X-axis labels (render every 2nd or 3rd on tight space) */}
              {(idx % 2 === 0 || idx === data.length - 1) && (
                <text
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className={`text-[10px] ${isHovered ? 'fill-indigo-600 font-semibold' : 'fill-slate-400'}`}
                >
                  {d.label}
                </text>
              )}

              {/* Hover vertical guide line */}
              {isHovered && (
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={chartHeight - paddingBottom}
                  stroke="#6366f1"
                  strokeWidth="1.25"
                  strokeDasharray="2 2"
                />
              )}

              {/* Point dots */}
              {d.actual !== undefined && (
                <circle
                  cx={x}
                  cy={getY(d.actual)}
                  r={isHovered ? 5 : 3.5}
                  className="fill-white stroke-indigo-600 transition-all duration-150"
                  strokeWidth="2"
                />
              )}
              {d.forecast !== undefined && d.actual === undefined && (
                <circle
                  cx={x}
                  cy={getY(d.forecast)}
                  r={isHovered ? 4.5 : 3}
                  className="fill-white stroke-cyan-500 transition-all duration-150"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {hoverIndex !== null && hoveredData && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-700/60 transition-transform duration-75"
          style={{
            left: `${(getX(hoverIndex) / chartWidth) * 100}%`,
            top: '16px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>{hoveredData.label}</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {hoveredData.actual !== undefined ? 'Live Telemetry' : 'ML Forecast'}
            </span>
          </div>
          {hoveredData.actual !== undefined && (
            <div className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                {actualLabel}:
              </span>
              <span className="font-mono font-medium text-white tabular-nums">
                {valuePrefix}
                {hoveredData.actual.toLocaleString('en-IN')}
                {valueSuffix}
              </span>
            </div>
          )}
          {hoveredData.forecast !== undefined && (
            <div className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                {forecastLabel}:
              </span>
              <span className="font-mono font-medium text-cyan-300 tabular-nums">
                {valuePrefix}
                {hoveredData.forecast.toLocaleString('en-IN')}
                {valueSuffix}
              </span>
            </div>
          )}
          {hoveredData.lowerBound !== undefined && hoveredData.upperBound !== undefined && (
            <div className="text-[10px] text-slate-400 pt-1 mt-1 border-t border-slate-800 flex justify-between font-mono tabular-nums">
              <span>95% CI:</span>
              <span>
                {hoveredData.lowerBound.toLocaleString('en-IN')} – {hoveredData.upperBound.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
