import React from 'react';
import { DestinationRegion, DestinationSummary, TabId } from '../../types/tourism';
import { Sparkline } from '../charts/Sparkline';
import { DynamicInteractiveChart } from '../charts/DynamicInteractiveChart';
import { IndiaMapVisual } from '../IndiaMapVisual';
import {
  Users,
  AlertTriangle,
  ReceiptText,
  TrendingUp,
  Building2,
  IndianRupee,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OverviewDashboardProps {
  destinations: DestinationSummary[];
  selectedRegion: DestinationRegion;
  onSelectRegion: (reg: DestinationRegion) => void;
  onNavigateTab: (tab: TabId) => void;
  onInspectDestination: (dest: DestinationSummary) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  destinations,
  selectedRegion,
  onSelectRegion,
  onNavigateTab,
  onInspectDestination,
}) => {
  const filteredDests = selectedRegion === 'All India'
    ? destinations
    : destinations.filter(d => d.state === selectedRegion);

  const totalVisitors = filteredDests.reduce((acc, d) => acc + d.currentVisitors, 0);
  const criticalDests = filteredDests.filter(d => d.crowdRisk === 'critical');
  const avgCapacityLoad = Math.round(
    filteredDests.reduce((acc, d) => acc + d.utilizationRate, 0) / (filteredDests.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              LIVE TELEMETRY ACTIVE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Region: <strong className="text-slate-800">{selectedRegion}</strong></span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Executive Tourism Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Unified operations feed aggregating smart city footfall counters, ASI heritage turnstiles, IRCTC train corridors, and automated price compliance audits across India.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('crowd')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Crowd Heatmap</span>
          </button>
          <button
            onClick={() => onNavigateTab('agents')}
            className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Agent Workflows</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (6 Key Tourism Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Estimated Tourist Footfall */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Tourist Footfall</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              {totalVisitors.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14.2%</span>
              <span className="text-slate-400 font-normal">vs prev wk</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[124, 131, 142, 156, 172, 184, 178]} color="#4f46e5" />
          </div>
        </div>

        {/* KPI 2: Predicted Crowd Risk */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Critical Corridors</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl font-bold text-rose-600 mt-2 font-mono tabular-nums">
              {criticalDests.length} Zones
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+2 today</span>
              <span className="text-slate-400 font-normal">capacity &gt;85%</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[1, 1, 2, 2, 3, 3, criticalDests.length]} color="#ef4444" />
          </div>
        </div>

        {/* KPI 3: Average Package Price */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Package Price</span>
              <IndianRupee className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              ₹43,125
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6.4%</span>
              <span className="text-slate-400 font-normal">seasonal yield</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[38, 39, 41, 42, 42.5, 43.1]} color="#059669" />
          </div>
        </div>

        {/* KPI 4: Pending Refund Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Dispute Cases</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
              4 Cases
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>₹1,09,800</span>
              <span className="text-slate-400 font-normal">at stake</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[6, 5, 5, 4, 4, 4]} color="#d97706" />
          </div>
        </div>

        {/* KPI 5: Hotel Occupancy Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Hotel Occupancy</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              {avgCapacityLoad}%
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8.5%</span>
              <span className="text-slate-400 font-normal">vs Oct baseline</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[68, 71, 74, 79, 82, 85]} color="#4f46e5" />
          </div>
        </div>

        {/* KPI 6: Forecast Tourism Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Forecast Revenue</span>
              <TrendingUp className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              ₹518.4 Cr
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+24.1%</span>
              <span className="text-slate-400 font-normal">Q4 Festive</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <Sparkline data={[380, 410, 440, 470, 500, 518]} color="#06b6d4" />
          </div>
        </div>
      </div>

      {/* AI Daily Tourism Intelligence Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  TripWise AI · Daily Tourism Operations Briefing
                </h3>
                <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  OCTOBER 26, 2026 · 09:30 IST
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-model synthesis of crowd telemetry, weather indices, and price anomaly triggers
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('copilot')}
            className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>Ask Analyst</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
            <div className="text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              1. Pilgrimage & Weekend Surge
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong>Madurai Meenakshi Temple</strong> and <strong>Amber Palace Jaipur</strong> are approaching 85% capacity. Staggered bus arrivals and alternate monument promotion are actively recommended to avoid queue spills.
            </p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              2. Kerala & Goa Booking Velocity
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Alleppey houseboat occupancy reached <strong>91%</strong> for the upcoming week. SeasonCast projects a <strong>+28% revenue lift</strong> in South India beach and heritage circuits over the next 14 days.
            </p>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
            <div className="text-rose-400 font-semibold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              3. Urgent Human Approval Action
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Dispute <strong>CASE-8841</strong> (Munnar flood advisory cancellation, ₹33,300) SLA countdown is down to <strong>6 hours</strong>. RefundResolve AI has prepared settlement ready for authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Main Visuals Grid: Line Chart + Interactive Geographic Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Footfall Telemetry & Interactive Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <DynamicInteractiveChart
            title="Dynamic Tourist Ingress Telemetry & Forecast Engine"
            subtitle="Live turnstile data feed with streaming pulses, scenario controls, and predictive envelope"
            corridorName={selectedRegion === 'All India' ? 'All India Tourism Corridors' : `${selectedRegion} Corridor Feed`}
            height={280}
            baseCapacity={avgCapacityLoad > 0 ? 50000 : 45000}
          />

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Model Performance: <strong>MAE 3.8%</strong> · <strong>RMSE 4.2%</strong></span>
            <button
              onClick={() => onNavigateTab('forecasting')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Explore SeasonCast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Geographic Map Visualization (5 cols) */}
        <div className="lg:col-span-5">
          <IndiaMapVisual
            destinations={destinations}
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
            onSelectDestination={onInspectDestination}
          />
        </div>
      </div>

      {/* Bottom Section: Top Destinations Table & Active Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top-Performing Tourist Destinations Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Corridor Density & Capacity Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current visitors, maximum threshold, and alternate dispersal corridors
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('crowd')}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All 11 Corridors</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Destination & State</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Visitors</th>
                  <th className="py-2.5 px-3">Capacity Utilization</th>
                  <th className="py-2.5 px-3">Risk Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDests.slice(0, 5).map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{dest.name}</div>
                      <div className="text-[10px] text-slate-400">{dest.verifiedSource}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{dest.category}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                      {dest.currentVisitors.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden w-24">
                          <div
                            className={`h-full rounded-full ${
                              dest.utilizationRate >= 85
                                ? 'bg-rose-500'
                                : dest.utilizationRate >= 70
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${dest.utilizationRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 tabular-nums">
                          {dest.utilizationRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          dest.crowdRisk === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : dest.crowdRisk === 'high'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {dest.crowdRisk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onInspectDestination(dest)}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 text-xs cursor-pointer"
                      >
                        Drilldown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Activity Stream & Pending Approvals (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Operational Task Stream
              </h3>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                2 Approvals Required
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">CASE-8841 Refund Sign-Off</span>
                  <span className="text-[10px] font-mono text-rose-600 font-semibold">6h SLA</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Munnar landslide force majeure refund ₹33,300 drafted by RefundResolve AI.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Traveler: Ananya D.</span>
                  <button
                    onClick={() => onNavigateTab('refunds')}
                    className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded font-medium hover:bg-indigo-700 cursor-pointer"
                  >
                    Authorize
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Madurai Traffic Diversion</span>
                  <span className="text-[10px] font-mono text-amber-600 font-semibold">High Load</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Crowd Monitoring Agent proposed rerouting 35% non-darshan coaches to Thirumalai Palace.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Agent: CROWD-GUARDIAN</span>
                  <button
                    onClick={() => onNavigateTab('agents')}
                    className="text-xs bg-slate-900 text-white px-2.5 py-1 rounded font-medium hover:bg-slate-800 cursor-pointer"
                  >
                    Review Alert
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Goa Surcharge Freeze</span>
                  <span className="text-[10px] font-mono text-indigo-600 font-semibold">Audited</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">
                  PriceGuard audited AUD-312 with ₹8,900 hidden fee. Operator disbursement placed on hold.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Palm Coast Leisure</span>
                  <button
                    onClick={() => onNavigateTab('pricing')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automation health: <strong>Nominal</strong></span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-indigo-600 font-medium hover:underline"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
