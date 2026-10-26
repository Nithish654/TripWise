import React, { useState } from 'react';
import { PRICE_AUDITS_DATA } from '../../data/mockTourismData';
import { PriceAuditItem } from '../../types/tourism';
import {
  ReceiptText,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Info,
  Scale,
  Ban,
  Lock,
  ChevronDown
} from 'lucide-react';

export const PriceGuardView: React.FC = () => {
  const [auditItems, setAuditItems] = useState<PriceAuditItem[]>(PRICE_AUDITS_DATA);
  const [selectedItem, setSelectedItem] = useState<PriceAuditItem>(auditItems[0]);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const flaggedCount = auditItems.filter(i => i.status === 'Flagged Anomaly').length;
  const compliantCount = auditItems.filter(i => i.status === 'Verified Compliant').length;
  const totalHiddenDetected = auditItems.reduce((acc, i) => acc + i.hiddenFeesDetectedINR, 0);

  const handleFreezeDisbursement = (item: PriceAuditItem) => {
    setStatusFeedback(`Payment disbursement to ${item.operator} has been suspended pending amended invoice (Discrepancy: ₹${item.hiddenFeesDetectedINR.toLocaleString('en-IN')}).`);
    setTimeout(() => setStatusFeedback(null), 5000);
  };

  const handleClearAnomaly = (item: PriceAuditItem) => {
    setAuditItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Verified Compliant', hiddenFeesDetectedINR: 0, discrepancyPercent: 0 } : i));
    setSelectedItem(prev => prev.id === item.id ? { ...prev, status: 'Verified Compliant', hiddenFeesDetectedINR: 0, discrepancyPercent: 0 } : prev);
    setStatusFeedback(`Anomaly cleared: ${item.packageName} marked compliant.`);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {statusFeedback && (
        <div className="p-3 bg-slate-900 text-white rounded-lg text-xs flex items-center justify-between shadow-lg border border-slate-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <span>{statusFeedback}</span>
          </div>
          <button onClick={() => setStatusFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              PRICEGUARD AI AUDITING ENGINE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Automated Quotation vs Invoice Reconciliation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Package Pricing Transparency & Fee Anomaly Auditor
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time optical audit of operator package invoices, GST legitimacy checks, and hidden surcharge flags.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Audit Compliance Rate:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
            87.5% clean
          </span>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Hidden Fees Detected</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 mt-1 font-mono tabular-nums">
            ₹{totalHiddenDetected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Unitemized charges blocked</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Flagged Package Invoices</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 mt-1 font-mono tabular-nums">
            {flaggedCount} Packages
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Pending operator amendment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Compliant Packages</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-1 font-mono tabular-nums">
            {compliantCount} Packages
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% statutory match</div>
        </div>
      </div>

      {/* Main Audit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Packages List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Tour Package Audit Queue
          </h3>

          <div className="space-y-2.5">
            {auditItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.destination}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                        {item.packageName}
                      </h4>
                      <div className="text-[10px] text-slate-500">{item.operator}</div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono shrink-0 ${
                        item.status === 'Flagged Anomaly'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status === 'Flagged Anomaly' ? `+${item.discrepancyPercent}% Inflated` : 'Compliant'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs font-mono tabular-nums">
                    <span className="text-slate-500">Quoted: ₹{item.quotedTotalINR.toLocaleString('en-IN')}</span>
                    <span className="font-bold text-slate-900">Final: ₹{item.finalBilledINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Package Line-Item Breakdown & Anomaly Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600">
                  {selectedItem.id}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{selectedItem.operator}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {selectedItem.packageName}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Cancellation Fairness</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {selectedItem.cancellationTermFairnessScore}/100
              </span>
            </div>
          </div>

          {/* Itemized Cost Breakdown Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Itemized Component Ledger vs Final Billed
            </h4>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 space-y-2 text-xs font-mono tabular-nums">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">1. Base Tariff & Management Fee</span>
                <span className="text-slate-900">₹{selectedItem.basePriceINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">2. Hotel Accommodation (Verified Voucher)</span>
                <span className="text-slate-900">₹{selectedItem.hotelINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">3. Dedicated Chauffeur & Vehicle Transit</span>
                <span className="text-slate-900">₹{selectedItem.transportINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">4. Scheduled Sightseeing & Guide Fees</span>
                <span className="text-slate-900">₹{selectedItem.activitiesINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">5. Statutory GST (5% Tour Package Rate)</span>
                <span className="text-slate-900">₹{selectedItem.taxesGstINR.toLocaleString('en-IN')}</span>
              </div>

              {selectedItem.hiddenFeesDetectedINR > 0 && (
                <div className="flex justify-between py-1.5 bg-rose-50 text-rose-800 px-2 rounded border border-rose-200 font-bold">
                  <span className="font-sans flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Unitemized / Hidden Fee Surcharge Detected:
                  </span>
                  <span>+₹{selectedItem.hiddenFeesDetectedINR.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-300 font-sans font-bold text-sm text-slate-900">
                <span>Total Billed Amount:</span>
                <span className="font-mono text-indigo-700">₹{selectedItem.finalBilledINR.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* AI Discrepancy & Anomaly Diagnostic */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              PriceGuard AI · Audit Diagnostic
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedItem.anomalyReason}
            </p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Contract Inclusions
              </div>
              <ul className="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5">
                {selectedItem.inclusions.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px] text-slate-700">
                <Info className="w-3.5 h-3.5 text-slate-500" /> Stated Exclusions
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                {selectedItem.exclusions.map((exc, i) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Controls */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            {selectedItem.hiddenFeesDetectedINR > 0 ? (
              <>
                <button
                  onClick={() => handleFreezeDisbursement(selectedItem)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Freeze Disbursement (₹{selectedItem.finalBilledINR.toLocaleString('en-IN')})</span>
                </button>
                <button
                  onClick={() => handleClearAnomaly(selectedItem)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                >
                  Override & Clear Flag
                </button>
              </>
            ) : (
              <div className="w-full p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PriceGuard Verified Compliant: statutory GST and transparent tariff verified.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
