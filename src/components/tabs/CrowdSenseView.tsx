import React, { useState } from 'react';
import { DestinationRegion, DestinationSummary } from '../../types/tourism';
import { DynamicInteractiveChart, DynamicPoint } from '../charts/DynamicInteractiveChart';
import { BarChart } from '../charts/BarChart';
import {
  Users,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  CloudSun,
  ShieldCheck,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Send,
  Info
} from 'lucide-react';

interface CrowdSenseViewProps {
  destinations: DestinationSummary[];
  selectedRegion: DestinationRegion;
  onSelectRegion: (reg: DestinationRegion) => void;
  selectedDestination: DestinationSummary | null;
  onSelectDestination: (dest: DestinationSummary) => void;
}

export const CrowdSenseView: React.FC<CrowdSenseViewProps> = ({
  destinations,
  selectedRegion,
  onSelectRegion,
  selectedDestination,
  onSelectDestination,
}) => {
  const filtered = selectedRegion === 'All India'
    ? destinations
    : destinations.filter((d) => d.state === selectedRegion);

  const activeDest = selectedDestination || filtered[0] || destinations[0];

  // Simulated alert approval state
  const [alertStatus, setAlertStatus] = useState<'idle' | 'approving' | 'approved'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApproveAdvisory = () => {
    setAlertStatus('approving');
    setTimeout(() => {
      setAlertStatus('approved');
      setToastMessage(`Advisory successfully dispatched to Smart City VMS boards & Tourist App for ${activeDest.name}`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  // Bar chart items for capacity comparison across regional hotspots
  const capacityBarItems = filtered.map((d) => ({
    label: d.name.split(',')[0],
    value: d.currentVisitors,
    capacity: d.capacityLimit,
    color: d.crowdRisk === 'critical' ? '#ef4444' : d.crowdRisk === 'high' ? '#f59e0b' : '#6366f1',
  }));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-900 text-emerald-100 rounded-lg text-xs flex items-center justify-between shadow-lg border border-emerald-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              CROWDSENSE AI ENGINE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Telemetry Refresh: 180s frequency</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Crowd Intelligence & Spatial Congestion Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Turnstile ingress sensors, telecom cluster signals, and seasonal crowd projection models.
          </p>
        </div>

        {/* State Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          {(['All India', 'Tamil Nadu', 'Kerala', 'Rajasthan', 'Goa', 'Delhi'] as DestinationRegion[]).map((r) => (
            <button
              key={r}
              onClick={() => onSelectRegion(r)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedRegion === r ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Active Corridor Spotlight & AI Cause Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Destination Deep Dive (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Corridor Inspector · {activeDest.state}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeDest.name}</h2>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider font-mono ${
                activeDest.crowdRisk === 'critical'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : activeDest.crowdRisk === 'high'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              Risk: {activeDest.crowdRisk}
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200/60 font-mono tabular-nums text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Current Count</span>
              <span className="text-base font-bold text-slate-900">
                {activeDest.currentVisitors.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Capacity Ceiling</span>
              <span className="text-base font-bold text-slate-700">
                {activeDest.capacityLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">Load Factor</span>
              <span className={`text-base font-bold ${activeDest.utilizationRate >= 85 ? 'text-rose-600' : 'text-slate-900'}`}>
                {activeDest.utilizationRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-sans">24h Peak Predicted</span>
              <span className="text-base font-bold text-cyan-600">
                {activeDest.predictedPeak24h.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Capacity Utilization Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Dynamic Threshold Utilization</span>
              <span className="text-slate-900 font-mono tabular-nums">
                {activeDest.currentVisitors.toLocaleString('en-IN')} / {activeDest.capacityLimit.toLocaleString('en-IN')} max
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeDest.utilizationRate >= 85
                    ? 'bg-rose-500'
                    : activeDest.utilizationRate >= 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, activeDest.utilizationRate)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Normal</span>
              <span>70% High Alert</span>
              <span>85% Critical Limit</span>
              <span>100% Saturation</span>
            </div>
          </div>

          {/* Dynamic Inflow Telemetry & Peak Projection Chart */}
          <div className="pt-2">
            <DynamicInteractiveChart
              title={`Live Ingress Telemetry: ${activeDest.name.split(',')[0]}`}
              subtitle="Streaming turnstile telemetry, capacity threshold envelope, and peak bottleneck projection"
              corridorName={`${activeDest.name} (${activeDest.state})`}
              baseCapacity={activeDest.capacityLimit}
              height={220}
            />
          </div>
        </div>

        {/* Right: AI Root-Cause Diagnostic & Dispersal Workflow (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Root-Cause Insight Card */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 text-cyan-300 rounded border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                CrowdSense AI · Root-Cause Diagnostic
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700 text-slate-300">
                <strong className="text-white block mb-0.5">Primary Congestion Vector:</strong>
                {activeDest.festivalImpact || 'Standard weekend leisure influx coupled with local pilgrim corridor alignment.'}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-800/40 p-2 rounded border border-slate-700/60">
                  <span className="text-slate-400 block">Weather Condition:</span>
                  <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                    {activeDest.weather.temp}°C, {activeDest.weather.condition}
                  </span>
                </div>
                <div className="bg-slate-800/40 p-2 rounded border border-slate-700/60">
                  <span className="text-slate-400 block">Monsoon Disruption:</span>
                  <span className="text-emerald-400 font-medium mt-0.5 block">
                    {activeDest.weather.monsoonRisk} Risk
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/40 p-2.5 rounded border border-slate-700/60">
                <span className="text-cyan-300 font-semibold block text-[11px] mb-0.5">
                  Recommended Alternate Route & Dispersal:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeDest.alternativeRecommendation || 'Redirect tourists to suburban heritage parks to smooth peak ingress.'}
                </p>
              </div>
            </div>

            {/* Workflow Action Simulator */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Autonomous Advisory Workflow</span>
                <span className="text-[10px] text-amber-400 font-mono">Requires Human Approval</span>
              </div>

              {alertStatus === 'approved' ? (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-600/50 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Staggered entry notice broadcasted to 28 tour operators.</span>
                </div>
              ) : (
                <button
                  onClick={handleApproveAdvisory}
                  disabled={alertStatus === 'approving'}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{alertStatus === 'approving' ? 'Authorizing Dispatch...' : 'Approve & Dispatch Staggered Traffic Notice'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Integrity Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Sensor Telemetry Source</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              {activeDest.verifiedSource}
            </p>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Status: Online & Verified</span>
              <span className="font-mono">Latency: 140ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Comparison Grid / Heatmap Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Corridor Capacity Utilization Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative visitor volume vs safe operational thresholds across {selectedRegion}
            </p>
          </div>
          <span className="text-xs text-rose-500 font-mono flex items-center gap-1">
            <span className="w-3 border-t border-dashed border-rose-500 inline-block" /> Capacity Ceiling Limit
          </span>
        </div>

        <BarChart items={capacityBarItems} height={200} />

        {/* Clickable Destination Selection Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8 pt-4 border-t border-slate-100">
          {filtered.map((dest) => {
            const isSelected = activeDest.id === dest.id;
            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{dest.state}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      dest.crowdRisk === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : dest.crowdRisk === 'high'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {dest.crowdRisk}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{dest.name}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono mt-1.5 tabular-nums">
                  <span>{dest.currentVisitors.toLocaleString('en-IN')} visitors</span>
                  <span className="font-semibold">{dest.utilizationRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
