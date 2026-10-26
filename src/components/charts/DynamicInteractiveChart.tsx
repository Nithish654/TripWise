import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Zap,
  TrendingUp,
  AlertTriangle,
  Eye,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export interface DynamicPoint {
  id: string;
  label: string;
  actual?: number;
  forecast?: number;
  lowerBound?: number;
  upperBound?: number;
  capacityLimit?: number;
  revenueCrores?: number;
  anomaly?: boolean;
  notes?: string;
}

interface DynamicInteractiveChartProps {
  initialData?: DynamicPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  corridorName?: string;
  baseCapacity?: number;
  onPointSelect?: (point: DynamicPoint) => void;
}

export const DynamicInteractiveChart: React.FC<DynamicInteractiveChartProps> = ({
  initialData,
  title = 'Live Corridor Ingress Telemetry & ML Prediction Engine',
  subtitle = 'Continuous turnstile sensor stream with real-time ARIMA forecast projection',
  height = 300,
  corridorName = 'National Corridor Aggregated',
  baseCapacity = 45000,
  onPointSelect,
}) => {
  // Chart Granularity Mode
  const [timeWindow, setTimeWindow] = useState<'24h' | '7d' | '30d'>('24h');
  // Metric Type
  const [metricMode, setMetricMode] = useState<'footfall' | 'capacity' | 'revenue'>('footfall');
  // Scenario Levers
  const [scenario, setScenario] = useState<'baseline' | 'festival' | 'rain' | 'holiday'>('baseline');
  // Live Streaming Simulation State
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [streamTick, setStreamTick] = useState<number>(0);
  const [lastPulseDelta, setLastPulseDelta] = useState<number>(0);

  // Interactive Hover / Scrubbing
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pinnedPoint, setPinnedPoint] = useState<DynamicPoint | null>(null);

  // Capacity threshold toggle
  const [showThreshold, setShowThreshold] = useState<boolean>(true);
  const [thresholdPct, setThresholdPct] = useState<number>(85);

  // Default 24H data template
  const default24h: DynamicPoint[] = useMemo(() => [
    { id: 'h1', label: '06:00', actual: 9800, forecast: 9500, capacityLimit: baseCapacity, notes: 'Early morning gates open' },
    { id: 'h2', label: '08:00', actual: 18400, forecast: 17900, capacityLimit: baseCapacity, notes: 'Morning pilgrim & tour bus arrival' },
    { id: 'h3', label: '10:00', actual: 29500, forecast: 28800, capacityLimit: baseCapacity, notes: 'Rapid queue acceleration' },
    { id: 'h4', label: '12:00', actual: 38400, forecast: 37900, capacityLimit: baseCapacity, notes: 'Current recorded peak' },
    { id: 'h5', label: '14:00 (Peak)', forecast: 46200, lowerBound: 42900, upperBound: 49500, capacityLimit: baseCapacity, notes: 'Projected maximum bottleneck', anomaly: true },
    { id: 'h6', label: '16:00', forecast: 43100, lowerBound: 39800, upperBound: 46400, capacityLimit: baseCapacity, notes: 'Afternoon secondary rush' },
    { id: 'h7', label: '18:00', forecast: 35800, lowerBound: 32500, upperBound: 39100, capacityLimit: baseCapacity, notes: 'Evening illuminated darshan' },
    { id: 'h8', label: '20:00', forecast: 21500, lowerBound: 18900, upperBound: 24100, capacityLimit: baseCapacity, notes: 'Egress dispersal phase' },
    { id: 'h9', label: '22:00', forecast: 8900, lowerBound: 7500, upperBound: 10300, capacityLimit: baseCapacity, notes: 'Final complex gate closure' },
  ], [baseCapacity]);

  // Default 7D data template
  const default7d: DynamicPoint[] = useMemo(() => [
    { id: 'd1', label: 'Mon (Oct 20)', actual: 135000, forecast: 132000, capacityLimit: baseCapacity * 3.5, revenueCrores: 36.5 },
    { id: 'd2', label: 'Tue (Oct 21)', actual: 142000, forecast: 139000, capacityLimit: baseCapacity * 3.5, revenueCrores: 38.2 },
    { id: 'd3', label: 'Wed (Oct 22)', actual: 154000, forecast: 151000, capacityLimit: baseCapacity * 3.5, revenueCrores: 41.8 },
    { id: 'd4', label: 'Thu (Oct 23)', actual: 168000, forecast: 164000, capacityLimit: baseCapacity * 3.5, revenueCrores: 45.4 },
    { id: 'd5', label: 'Fri (Oct 24)', actual: 189000, forecast: 184000, capacityLimit: baseCapacity * 3.5, revenueCrores: 51.2 },
    { id: 'd6', label: 'Sat (Oct 25)', actual: 198000, forecast: 194000, capacityLimit: baseCapacity * 3.5, revenueCrores: 54.8, anomaly: true },
    { id: 'd7', label: 'Sun (Oct 26 Today)', actual: 182000, forecast: 179000, capacityLimit: baseCapacity * 3.5, revenueCrores: 49.3 },
    { id: 'd8', label: 'Mon (Oct 27)', forecast: 186000, lowerBound: 175000, upperBound: 197000, capacityLimit: baseCapacity * 3.5, revenueCrores: 50.4 },
    { id: 'd9', label: 'Tue (Oct 28)', forecast: 192000, lowerBound: 181000, upperBound: 203000, capacityLimit: baseCapacity * 3.5, revenueCrores: 52.8 },
    { id: 'd10', label: 'Wed (Oct 29)', forecast: 208000, lowerBound: 195000, upperBound: 221000, capacityLimit: baseCapacity * 3.5, revenueCrores: 57.5, anomaly: true },
    { id: 'd11', label: 'Thu (Oct 30)', forecast: 224000, lowerBound: 208000, upperBound: 240000, capacityLimit: baseCapacity * 3.5, revenueCrores: 62.0, anomaly: true },
  ], [baseCapacity]);

  // Default 30D seasonal points
  const default30d: DynamicPoint[] = useMemo(() => [
    { id: 'w1', label: 'Wk 1 (Oct 1-7)', actual: 940000, forecast: 920000, revenueCrores: 245 },
    { id: 'w2', label: 'Wk 2 (Oct 8-14)', actual: 1020000, forecast: 1005000, revenueCrores: 272 },
    { id: 'w3', label: 'Wk 3 (Oct 15-21)', actual: 1140000, forecast: 1120000, revenueCrores: 308 },
    { id: 'w4', label: 'Wk 4 (Oct 22-28 Today)', actual: 1280000, forecast: 1260000, revenueCrores: 352 },
    { id: 'w5', label: 'Wk 5 (Oct 29-Nov 4 Diwali)', forecast: 1520000, lowerBound: 1420000, upperBound: 1620000, revenueCrores: 425, anomaly: true },
    { id: 'w6', label: 'Wk 6 (Nov 5-11 Post-Festive)', forecast: 1380000, lowerBound: 1290000, upperBound: 1470000, revenueCrores: 382 },
    { id: 'w7', label: 'Wk 7 (Nov 12-18)', forecast: 1310000, lowerBound: 1220000, upperBound: 1400000, revenueCrores: 360 },
  ], []);

  // Multiplier from scenario selection
  const scenarioMultiplier = useMemo(() => {
    switch (scenario) {
      case 'festival': return 1.28;
      case 'rain': return 0.85;
      case 'holiday': return 1.18;
      default: return 1.0;
    }
  }, [scenario]);

  // Active dataset with live streaming pulses applied
  const activeDataset: DynamicPoint[] = useMemo(() => {
    const raw = timeWindow === '24h' ? default24h : timeWindow === '7d' ? default7d : default30d;

    return raw.map((pt, idx) => {
      // Dynamic scaling with scenario
      const mult = scenarioMultiplier;
      const actualScaled = pt.actual !== undefined ? Math.round(pt.actual * mult + (idx === 3 && isLiveStreaming ? streamTick * 60 : 0)) : undefined;
      const forecastScaled = pt.forecast !== undefined ? Math.round(pt.forecast * mult) : undefined;
      const lowerScaled = pt.lowerBound !== undefined ? Math.round(pt.lowerBound * mult) : undefined;
      const upperScaled = pt.upperBound !== undefined ? Math.round(pt.upperBound * mult) : undefined;

      return {
        ...pt,
        actual: actualScaled,
        forecast: forecastScaled,
        lowerBound: lowerScaled,
        upperBound: upperScaled,
      };
    });
  }, [timeWindow, default24h, default7d, default30d, scenarioMultiplier, streamTick, isLiveStreaming]);

  // Live streaming interval
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setStreamTick((prev) => {
        const next = (prev + 1) % 15;
        const delta = Math.floor(Math.random() * 85) + 35;
        setLastPulseDelta(delta);
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Inject manual pulse burst
  const handleInjectPulse = () => {
    setStreamTick(prev => prev + 5);
    setLastPulseDelta(1250);
  };

  // Convert raw value to selected metric representation
  const getMetricValue = (val?: number, capLimit?: number) => {
    if (val === undefined) return 0;
    if (metricMode === 'capacity') {
      const cap = capLimit || baseCapacity;
      return Math.round((val / cap) * 100);
    }
    if (metricMode === 'revenue') {
      // Approximate INR Lakhs/Cr based on standard spend of ₹2,800/traveler
      return Number(((val * 2800) / 10000000).toFixed(2));
    }
    return val;
  };

  const metricSuffix = metricMode === 'capacity' ? '%' : metricMode === 'revenue' ? ' Cr' : '';
  const metricPrefix = metricMode === 'revenue' ? '₹' : '';

  // Extract all values for SVG scaling
  const allValues: number[] = [];
  activeDataset.forEach((pt) => {
    if (pt.actual !== undefined) allValues.push(getMetricValue(pt.actual, pt.capacityLimit));
    if (pt.forecast !== undefined) allValues.push(getMetricValue(pt.forecast, pt.capacityLimit));
    if (pt.lowerBound !== undefined) allValues.push(getMetricValue(pt.lowerBound, pt.capacityLimit));
    if (pt.upperBound !== undefined) allValues.push(getMetricValue(pt.upperBound, pt.capacityLimit));
  });

  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const minVal = Math.max(0, rawMin * 0.9);
  const maxVal = rawMax * 1.08 || 100;
  const range = maxVal - minVal || 1;

  const chartWidth = 760;
  const chartHeight = height;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 34;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (activeDataset.length - 1)) * innerWidth;
  const getY = (val: number) => paddingTop + innerHeight - ((val - minVal) / range) * innerHeight;

  // Catmull-Rom or cubic Bezier spline path generator for liquid-smooth curves
  const getSmoothSpline = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const actualPoints: { x: number; y: number; idx: number }[] = [];
  activeDataset.forEach((d, i) => {
    if (d.actual !== undefined) {
      actualPoints.push({ x: getX(i), y: getY(getMetricValue(d.actual, d.capacityLimit)), idx: i });
    }
  });

  const forecastPoints: { x: number; y: number; idx: number }[] = [];
  activeDataset.forEach((d, i) => {
    if (d.forecast !== undefined) {
      forecastPoints.push({ x: getX(i), y: getY(getMetricValue(d.forecast, d.capacityLimit)), idx: i });
    }
  });

  const actualSpline = getSmoothSpline(actualPoints);
  const forecastSpline = getSmoothSpline(forecastPoints);

  // Confidence Bounds Band
  let boundsBandPath = '';
  const upperPts: { x: number; y: number }[] = [];
  const lowerPts: { x: number; y: number }[] = [];
  activeDataset.forEach((d, i) => {
    if (d.upperBound !== undefined && d.lowerBound !== undefined) {
      upperPts.push({ x: getX(i), y: getY(getMetricValue(d.upperBound, d.capacityLimit)) });
      lowerPts.push({ x: getX(i), y: getY(getMetricValue(d.lowerBound, d.capacityLimit)) });
    }
  });

  if (upperPts.length > 0 && lowerPts.length > 0) {
    const topStr = upperPts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
    const botStr = lowerPts.reverse().reduce((acc, p) => `${acc} L ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');
    boundsBandPath = `${topStr} ${botStr} Z`;
  }

  // Horizontal ticks
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => minVal + pct * range);

  // Active hover/pinned item
  const activeDataPoint = hoverIndex !== null ? activeDataset[hoverIndex] : pinnedPoint || activeDataset[Math.min(3, activeDataset.length - 1)];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4 select-none">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isLiveStreaming ? 'LIVE TELEMETRY STREAM' : 'STREAM PAUSED'}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">{corridorName}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Live Streaming & Simulation Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Pause Stream' : 'Resume Live Feed'}</span>
          </button>

          <button
            onClick={handleInjectPulse}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Simulate live batch turnstile burst from arriving bus/train corridor"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-200" />
            <span>Inject Sensor Pulse</span>
          </button>
        </div>
      </div>

      {/* Dynamic Controls Bar: Granularity + Metric + Scenario */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70">
        {/* Time Window Buttons */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
          <button
            onClick={() => setTimeWindow('24h')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              timeWindow === '24h' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24H Real-Time
          </button>
          <button
            onClick={() => setTimeWindow('7d')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              timeWindow === '7d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7-Day Inflow
          </button>
          <button
            onClick={() => setTimeWindow('30d')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              timeWindow === '30d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30-Day Seasonal
          </button>
        </div>

        {/* Metric Modes */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200">
          <button
            onClick={() => setMetricMode('footfall')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              metricMode === 'footfall' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Footfall Count
          </button>
          <button
            onClick={() => setMetricMode('capacity')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              metricMode === 'capacity' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Load Factor %
          </button>
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              metricMode === 'revenue' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yield (₹ Cr)
          </button>
        </div>

        {/* Dynamic Scenario Simulator Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Scenario:</span>
          {(
            [
              { id: 'baseline', label: 'Baseline' },
              { id: 'festival', label: 'Festive (+28%)' },
              { id: 'rain', label: 'Rain (-15%)' },
              { id: 'holiday', label: 'Long Wknd (+18%)' },
            ] as const
          ).map((sc) => (
            <button
              key={sc.id}
              onClick={() => setScenario(sc.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                scenario === sc.id
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible font-sans"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="dynActualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
            </linearGradient>

            <linearGradient id="dynForecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.00" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
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
                  className="text-[10px] fill-slate-400 font-mono tabular-nums font-medium"
                >
                  {metricPrefix}
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(metricMode === 'revenue' ? 1 : 0)}
                  {metricSuffix}
                </text>
              </g>
            );
          })}

          {/* Dynamic 85% Warning Capacity Threshold Line */}
          {showThreshold && metricMode === 'capacity' && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(thresholdPct)}
                x2={chartWidth - paddingRight}
                y2={getY(thresholdPct)}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x={chartWidth - paddingRight}
                y={getY(thresholdPct) - 5}
                textAnchor="end"
                className="text-[10px] fill-rose-600 font-mono font-bold"
              >
                CRITICAL LIMIT ({thresholdPct}%)
              </text>
            </g>
          )}

          {/* 95% Confidence Interval Envelope */}
          {boundsBandPath && (
            <path
              d={boundsBandPath}
              fill="rgba(6, 182, 212, 0.09)"
              stroke="rgba(6, 182, 212, 0.35)"
              strokeDasharray="3 3"
            />
          )}

          {/* ML Forecast Spline Area & Line */}
          {forecastPoints.length > 0 && (
            <>
              <path
                d={`${forecastSpline} L ${forecastPoints[forecastPoints.length - 1].x},${chartHeight - paddingBottom} L ${forecastPoints[0].x},${chartHeight - paddingBottom} Z`}
                fill="url(#dynForecastGrad)"
              />
              <path
                d={forecastSpline}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.25"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Actual Turnstile Spline Area & Line */}
          {actualPoints.length > 0 && (
            <>
              <path
                d={`${actualSpline} L ${actualPoints[actualPoints.length - 1].x},${chartHeight - paddingBottom} L ${actualPoints[0].x},${chartHeight - paddingBottom} Z`}
                fill="url(#dynActualGrad)"
              />
              <path
                d={actualSpline}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowEffect)"
              />
            </>
          )}

          {/* Hover interactive columns, vertical laser lines, and point markers */}
          {activeDataset.map((d, idx) => {
            const x = getX(idx);
            const isHovered = hoverIndex === idx;
            const isPinned = pinnedPoint?.id === d.id;
            const hasActual = d.actual !== undefined;
            const yVal = hasActual
              ? getY(getMetricValue(d.actual, d.capacityLimit))
              : getY(getMetricValue(d.forecast, d.capacityLimit));

            const isAnomaly = d.anomaly;

            return (
              <g
                key={d.id}
                onMouseEnter={() => setHoverIndex(idx)}
                onClick={() => {
                  setPinnedPoint(d);
                  if (onPointSelect) onPointSelect(d);
                }}
                className="cursor-pointer"
              >
                {/* Transparent hit area */}
                <rect
                  x={x - innerWidth / activeDataset.length / 2}
                  y={paddingTop}
                  width={innerWidth / activeDataset.length}
                  height={innerHeight}
                  fill="transparent"
                />

                {/* X-axis Tick Label */}
                <text
                  x={x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className={`text-[10px] transition-colors ${
                    isHovered || isPinned
                      ? 'fill-indigo-600 font-bold'
                      : 'fill-slate-400 font-medium'
                  }`}
                >
                  {d.label.split(' ')[0]}
                </text>

                {/* Vertical Laser Crosshair */}
                {(isHovered || isPinned) && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={chartHeight - paddingBottom}
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point Node Marker */}
                <circle
                  cx={x}
                  cy={yVal}
                  r={isHovered ? 6 : isPinned ? 5 : isAnomaly ? 4.5 : 3.5}
                  className={`transition-all duration-150 ${
                    isAnomaly
                      ? 'fill-rose-500 stroke-white'
                      : hasActual
                      ? 'fill-indigo-600 stroke-white'
                      : 'fill-cyan-500 stroke-white'
                  }`}
                  strokeWidth="2"
                />

                {/* Pulsing ring on the current live data point */}
                {idx === 3 && isLiveStreaming && timeWindow === '24h' && (
                  <circle
                    cx={x}
                    cy={yVal}
                    r="9"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic HUD Scrubber Card */}
        {activeDataPoint && (
          <div className="mt-3 p-3.5 bg-slate-900 text-white rounded-lg shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-cyan-300 rounded-md border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                  Active Scrubbed Point · {activeDataPoint.label}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-bold text-white tabular-nums">
                    {metricPrefix}
                    {(activeDataPoint.actual !== undefined
                      ? getMetricValue(activeDataPoint.actual, activeDataPoint.capacityLimit)
                      : getMetricValue(activeDataPoint.forecast, activeDataPoint.capacityLimit)
                    ).toLocaleString('en-IN')}
                    {metricSuffix}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                    activeDataPoint.anomaly
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : activeDataPoint.actual !== undefined
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {activeDataPoint.anomaly ? 'Peak Alert' : activeDataPoint.actual !== undefined ? 'Ingress Log' : 'ML Forecast'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingress Velocity & Contextual Note */}
            <div className="flex items-center gap-6 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Ingress Rate:</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  +{lastPulseDelta > 0 ? lastPulseDelta : 142} pax/min
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-sans">Operational Note:</span>
                <span className="text-slate-200 font-sans">{activeDataPoint.notes || 'Normal queue flow'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
