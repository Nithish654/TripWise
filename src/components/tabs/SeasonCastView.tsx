import React, { useState, useMemo } from 'react';
import { FORECAST_TRENDS_DATA } from '../../data/mockTourismData';
import { ForecastPoint } from '../../types/tourism';
import { LineChart, DataPoint } from '../charts/LineChart';
import {
  TrendingUp,
  Calendar,
  Building2,
  IndianRupee,
  Sparkles,
  Sliders,
  CheckCircle2,
  Info,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw,
  Zap,
  Users
} from 'lucide-react';

export const SeasonCastView: React.FC = () => {
  const [horizon, setHorizon] = useState<'7d' | '30d' | '90d'>('7d');
  const [festivalSurgePct, setFestivalSurgePct] = useState<number>(25);
  const [monsoonShift, setMonsoonShift] = useState<boolean>(false);
  const [extendedWeekendMultiplier, setExtendedWeekendMultiplier] = useState<boolean>(true);

  // Dynamic datasets for 7d, 30d, and 90d
  const baseDataForHorizon = useMemo(() => {
    if (horizon === '7d') {
      return FORECAST_TRENDS_DATA.slice(0, 10);
    }
    if (horizon === '30d') {
      return [
        { date: '2026-10-26', label: 'Oct Wk 4', actualArrivals: 178000, forecastArrivals: 176500, lowerConfidence95: 169000, upperConfidence95: 184000, occupancyPercent: 85, revenueCroresINR: 49.2, cancellationRatePercent: 3.8, festivalMultiplier: 1.25 },
        { date: '2026-11-02', label: 'Nov Wk 1 (Diwali)', forecastArrivals: 235000, lowerConfidence95: 218000, upperConfidence95: 252000, occupancyPercent: 96, revenueCroresINR: 74.5, cancellationRatePercent: 2.8, festivalMultiplier: 1.68 },
        { date: '2026-11-09', label: 'Nov Wk 2', forecastArrivals: 210000, lowerConfidence95: 195000, upperConfidence95: 225000, occupancyPercent: 92, revenueCroresINR: 65.1, cancellationRatePercent: 3.2, festivalMultiplier: 1.45 },
        { date: '2026-11-16', label: 'Nov Wk 3 (Pushkar)', forecastArrivals: 228000, lowerConfidence95: 212000, upperConfidence95: 244000, occupancyPercent: 94, revenueCroresINR: 71.8, cancellationRatePercent: 3.0, festivalMultiplier: 1.55 },
        { date: '2026-11-23', label: 'Nov Wk 4', forecastArrivals: 198000, lowerConfidence95: 184000, upperConfidence95: 212000, occupancyPercent: 88, revenueCroresINR: 58.4, cancellationRatePercent: 3.9, festivalMultiplier: 1.30 },
      ];
    }
    // 90-day Quarterly Outlook
    return [
      { date: '2026-10-01', label: 'Oct Early', actualArrivals: 135000, forecastArrivals: 132000, lowerConfidence95: 125000, upperConfidence95: 139000, occupancyPercent: 72, revenueCroresINR: 36.5, cancellationRatePercent: 4.8, festivalMultiplier: 1.05 },
      { date: '2026-10-15', label: 'Oct Mid', actualArrivals: 168000, forecastArrivals: 165000, lowerConfidence95: 156000, upperConfidence95: 174000, occupancyPercent: 82, revenueCroresINR: 48.0, cancellationRatePercent: 3.9, festivalMultiplier: 1.22 },
      { date: '2026-10-31', label: 'Oct Peak', actualArrivals: 195000, forecastArrivals: 192000, lowerConfidence95: 182000, upperConfidence95: 202000, occupancyPercent: 91, revenueCroresINR: 56.4, cancellationRatePercent: 3.3, festivalMultiplier: 1.40 },
      { date: '2026-11-15', label: 'Nov Mid', forecastArrivals: 232000, lowerConfidence95: 214000, upperConfidence95: 250000, occupancyPercent: 95, revenueCroresINR: 72.8, cancellationRatePercent: 2.9, festivalMultiplier: 1.62 },
      { date: '2026-11-30', label: 'Nov End', forecastArrivals: 205000, lowerConfidence95: 189000, upperConfidence95: 221000, occupancyPercent: 89, revenueCroresINR: 62.0, cancellationRatePercent: 3.5, festivalMultiplier: 1.35 },
      { date: '2026-12-15', label: 'Dec Mid', forecastArrivals: 245000, lowerConfidence95: 226000, upperConfidence95: 264000, occupancyPercent: 97, revenueCroresINR: 81.5, cancellationRatePercent: 2.6, festivalMultiplier: 1.75 },
      { date: '2026-12-31', label: 'Dec Peak (NYE)', forecastArrivals: 278000, lowerConfidence95: 255000, upperConfidence95: 301000, occupancyPercent: 99, revenueCroresINR: 98.2, cancellationRatePercent: 2.1, festivalMultiplier: 1.95 },
      { date: '2027-01-15', label: 'Jan Mid (Pongal)', forecastArrivals: 238000, lowerConfidence95: 219000, upperConfidence95: 257000, occupancyPercent: 94, revenueCroresINR: 76.0, cancellationRatePercent: 3.0, festivalMultiplier: 1.65 },
    ];
  }, [horizon]);

  // Apply scenario simulation parameters dynamically to baseline forecast
  const simulatedForecast: ForecastPoint[] = baseDataForHorizon.map((pt: any) => {
    let multiplier = 1 + (festivalSurgePct / 100) * (pt.festivalMultiplier - 1);
    if (monsoonShift) multiplier *= 0.88; // 12% wet weather reduction
    if (extendedWeekendMultiplier) multiplier *= 1.06; // 6% long weekend bump

    const forecastArrivals = Math.round(pt.forecastArrivals * multiplier);
    const lowerConfidence95 = Math.round(forecastArrivals * 0.92);
    const upperConfidence95 = Math.round(forecastArrivals * 1.08);
    const occupancyPercent = Math.min(99, Math.round(pt.occupancyPercent * multiplier));
    const revenueCroresINR = Number((pt.revenueCroresINR * multiplier).toFixed(1));

    return {
      ...pt,
      forecastArrivals,
      lowerConfidence95,
      upperConfidence95,
      occupancyPercent,
      revenueCroresINR,
    };
  });

  // Chart data points
  const chartData: DataPoint[] = simulatedForecast.map((pt) => ({
    label: pt.label,
    actual: pt.actualArrivals,
    forecast: pt.forecastArrivals,
    lowerBound: pt.lowerConfidence95,
    upperBound: pt.upperConfidence95,
  }));

  const totalProjectedRevenueCr = simulatedForecast
    .reduce((acc, pt) => acc + pt.revenueCroresINR, 0)
    .toFixed(0);

  const avgOccupancy = Math.round(
    simulatedForecast.reduce((acc, pt) => acc + pt.occupancyPercent, 0) / simulatedForecast.length
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
              SEASONCAST AI PREDICTIVE SUITE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Hybrid ARIMA + Prophet Ensembled Model</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Macro Tourism Demand Forecasting & Capacity Yield
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Statistical visitor projections, hotel occupancy elasticity, and scenario parameter simulators.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          {(['7d', '30d', '90d'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                horizon === h ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h === '7d' ? '7-Day Horizon' : h === '30d' ? '30-Day Outlook' : '90-Day Seasonal'}
            </button>
          ))}
        </div>
      </div>

      {/* Accuracy & Model Metadata Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono tabular-nums">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Model Error (MAE)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">3.82%</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-sans">Within ±4.5% tolerance benchmark</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Goodness of Fit (R²)</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-indigo-600 mt-1">0.964</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-sans">Trained on 5-year ASI turnstile logs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Avg Projected Occupancy</span>
            <Building2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{avgOccupancy}%</div>
          <div className="text-[11px] text-emerald-600 mt-0.5 font-sans">+9.4% seasonal compression</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Simulated Q4 Revenue</span>
            <IndianRupee className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">₹{totalProjectedRevenueCr} Cr</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-sans">Aggregated state corridor spend</div>
        </div>
      </div>

      {/* Main Forecast Graph & Scenario Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Forecast Graph with 95% Confidence Interval (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Projected Daily Tourist Inflow with 95% Confidence Bounds
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shaded envelope indicates upper & lower variance from seasonal flight/train booking pace
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Actuals
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> ML Forecast
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  [ 95% Confidence Interval ]
                </span>
              </div>
            </div>

            <LineChart
              data={chartData}
              height={280}
              showBounds={true}
              actualLabel="Recorded Footfall"
              forecastLabel="Simulated Arrival Inflow"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Data source: SeasonCast ML Ensemble API (v2.4)</span>
            <span className="font-mono text-cyan-600">Simulated Scenario Active</span>
          </div>
        </div>

        {/* What-If Scenario Levers (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                What-If Scenario Sandbox
              </h3>
            </div>
            <button
              onClick={() => {
                setFestivalSurgePct(25);
                setMonsoonShift(false);
                setExtendedWeekendMultiplier(true);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Festival Demand Surge */}
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Diwali & Festive Surge Factor</span>
                <span className="font-mono font-bold text-indigo-600">+{festivalSurgePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={festivalSurgePct}
                onChange={(e) => setFestivalSurgePct(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Simulates Pushkar, Diwali & Goa Year-End hotel pre-bookings.
              </span>
            </div>

            {/* Toggle 2: Monsoon Deviation */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 block">Monsoon Weather Deviation</span>
                  <span className="text-[10px] text-slate-400">Simulate -12% rainfall dampening</span>
                </div>
                <input
                  type="checkbox"
                  checked={monsoonShift}
                  onChange={(e) => setMonsoonShift(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Toggle 3: Long Weekend Multiplier */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-800 block">Extended Holiday Weekend</span>
                  <span className="text-[10px] text-slate-400">Simulate +6% metropolitan getaway surge</span>
                </div>
                <input
                  type="checkbox"
                  checked={extendedWeekendMultiplier}
                  onChange={(e) => setExtendedWeekendMultiplier(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* AI Recommended Business Actions */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 mt-4 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              SeasonCast Actionable Recommendations
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">·</span>
                <span><strong>Hospitality:</strong> Release 15% reserved hotel inventory in Kochi & Madurai to capture peak yield.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">·</span>
                <span><strong>Transport:</strong> Coordinate with TNSTC and KSRTC for 40 additional inter-city AC Volvo runs on Oct 30-Nov 02.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">·</span>
                <span><strong>Staffing:</strong> Deploy 25 additional crowd marshals at Amber Fort turnstiles during 11:00-15:00 window.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
