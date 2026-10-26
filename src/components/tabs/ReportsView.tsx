import React, { useState } from 'react';
import { DESTINATIONS_DATA, FORECAST_TRENDS_DATA } from '../../data/mockTourismData';
import { DestinationRegion } from '../../types/tourism';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  IndianRupee,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<'executive' | 'crowd' | 'financial' | 'compliance'>('executive');
  const [selectedState, setSelectedState] = useState<DestinationRegion>('All India');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Destination,State,Category,Visitors,Capacity,Utilization_Pct,Risk_Level,Verified_Source\n';

    DESTINATIONS_DATA.forEach((d) => {
      csvContent += `"${d.name}","${d.state}","${d.category}",${d.currentVisitors},${d.capacityLimit},${d.utilizationRate},"${d.crowdRisk}","${d.verifiedSource}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TripWise_Tourism_Intelligence_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Export generated and downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-900 text-emerald-100 rounded-lg text-xs flex items-center justify-between shadow-lg border border-emerald-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{downloadSuccess}</span>
          </div>
          <button onClick={() => setDownloadSuccess(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              REPORTS & AUDIT GENERATOR
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Official Operational Intelligence Dispatches</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Tourism Analytics & Executive Briefing Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Compile board-ready operational summaries, CSV telemetry datasets, and statutory compliance documentation.
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Report Scope:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(
              [
                { id: 'executive', label: 'Executive Synthesis' },
                { id: 'crowd', label: 'Crowd & Corridors' },
                { id: 'financial', label: 'Pricing & Surcharges' },
                { id: 'compliance', label: 'Disputes & Escrow' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedReportType(t.id)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedReportType === t.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as DestinationRegion)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none"
          >
            <option value="All India">All India (Aggregated)</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Goa">Goa</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
        {/* Document Letterhead */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                TW
              </div>
              <span className="text-base font-bold text-slate-900">
                TripWise AI · Operations Briefing
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ministry of Tourism & Incredible India Digital Operations Command
            </p>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="text-slate-900 font-bold">DOC REF: TW-OPS-2026-Q4</div>
            <div className="text-slate-400">Date: October 26, 2026 · 10:00 IST</div>
            <div className="text-emerald-600 font-semibold">Classification: OFFICIAL / UNRESTRICTED</div>
          </div>
        </div>

        {/* AI Dynamic Summary Narrative */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            1. {selectedReportType === 'executive' ? 'Executive Tourism Operations Synthesis' : selectedReportType === 'crowd' ? 'Crowd Density & Corridor Telemetry Audit' : selectedReportType === 'financial' ? 'Package Pricing Transparency & Surcharge Audit' : 'Consumer Dispute & Escrow Compliance Ledger'}
          </div>

          {selectedReportType === 'executive' && (
            <>
              <p className="text-xs text-slate-700 leading-relaxed">
                During late October 2026, total tourist inflows across premier pilgrimage and heritage circuits in India reached an estimated <strong>1,78,000 daily visitors</strong> ({selectedState}), reflecting a <strong>14.2% week-on-week expansion</strong>. Critical crowd congestion has concentrated at <strong>Madurai Meenakshi Amman Temple</strong> (85% capacity load) and <strong>Amber Palace Jaipur</strong> (85% load), where automated advisory rerouting has successfully diverted 35% of secondary tourist coach arrivals to low-density suburban heritage corridors.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                Hotel occupancy in Kerala and Goa has crossed <strong>84%</strong> ahead of Diwali and winter festival itineraries. SeasonCast ML models project an aggregate Q4 state corridor tourism expenditure of <strong>₹518.4 Crores</strong>, with an average model error rate (MAE) maintained at 3.8%.
              </p>
            </>
          )}

          {selectedReportType === 'crowd' && (
            <p className="text-xs text-slate-700 leading-relaxed">
              Optical sensors and automated turnstiles indicate sustained high footfall across <strong>{selectedState === 'All India' ? 'all major state corridors' : selectedState}</strong>. Peak bottlenecks occurred between 11:30 and 15:00 IST. Alternate dispersal routes to suburban cultural hubs reduced average queue wait times by 26 minutes with zero safety incidents recorded.
            </p>
          )}

          {selectedReportType === 'financial' && (
            <p className="text-xs text-slate-700 leading-relaxed">
              PriceGuard optical OCR and invoice parsing audited 64 tour operator packages. The platform successfully identified and frozen <strong>₹19,600 in unitemized festive surcharges</strong> and hidden entrance cesses across 3 delinquent operators, safeguarding consumer trust ahead of the high-demand festival season.
            </p>
          )}

          {selectedReportType === 'compliance' && (
            <p className="text-xs text-slate-700 leading-relaxed">
              Escrow resolution adherence stands at <strong>94.2% on-time resolution</strong>. Four active cases are under supervisory review totaling ₹1,09,800. In accordance with platform governance, all consequential financial disbursements remain gated behind mandatory human operations director approval.
            </p>
          )}
        </div>

        {/* Dynamic Key Indicators Summary Grid */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono tabular-nums">
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">Aggregate Footfall</span>
            <span className="font-bold text-slate-900 text-sm">1,78,000</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">Avg Package Price</span>
            <span className="font-bold text-slate-900 text-sm">₹43,125</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">Occupancy Rate</span>
            <span className="font-bold text-slate-900 text-sm">84.6%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-sans block">SLA Adherence</span>
            <span className="font-bold text-emerald-600 text-sm">94.2%</span>
          </div>
        </div>

        {/* Detailed Corridor Audit Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>2. Corridor Verification Matrix ({selectedState})</span>
            <span className="text-[10px] text-slate-400 font-mono">Live Turnstiles</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Corridor</th>
                  <th className="py-2 px-3">State</th>
                  <th className="py-2 px-3 text-right">Visitor Count</th>
                  <th className="py-2 px-3 text-right">Capacity</th>
                  <th className="py-2 px-3">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(selectedState === 'All India' ? DESTINATIONS_DATA : DESTINATIONS_DATA.filter(d => d.state === selectedState)).map((dest) => (
                  <tr key={dest.id}>
                    <td className="py-2 px-3 font-medium text-slate-900">{dest.name}</td>
                    <td className="py-2 px-3 text-slate-600">{dest.state}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">{dest.currentVisitors.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">{dest.capacityLimit.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 font-mono text-[11px] font-semibold text-slate-700 uppercase">
                      {dest.crowdRisk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sign-off & Audit Seal */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <div className="font-semibold text-slate-900">V J Nithish</div>
            <div className="text-[10px]">Operations Director, Ministry of Tourism Protocol Desk</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Verification Signature #9024-TW</span>
            </div>
            <div className="text-[10px] text-slate-400">Grounded in AI Studio Secure Runtime</div>
          </div>
        </div>
      </div>
    </div>
  );
};
