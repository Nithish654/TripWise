import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Database,
  Cpu,
  Key,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Activity
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [simulationBadge, setSimulationBadge] = useState(true);
  const [modelConfidenceThreshold, setModelConfidenceThreshold] = useState(90);
  const [autoFlagAnomalies, setAutoFlagAnomalies] = useState(true);
  const [humanApprovalMandatory, setHumanApprovalMandatory] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-900 text-emerald-100 rounded-lg text-xs flex items-center justify-between shadow-lg border border-emerald-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Settings and compliance preferences updated successfully.</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Governance & Data Pipeline Policies</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Platform Settings & Data Integrity Safeguards
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure data integrity disclaimers, ML confidence thresholds, and human-in-the-loop safeguards.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Save Changes
        </button>
      </div>

      {/* Mandatory Data and AI Integrity Notice */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-cyan-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Data and AI Integrity Notice (AI Governance Standard)
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          TripWise AI clearly delineates verified live turnstile and transport data from simulated datasets, statistical forecast projections, and AI-generated text summaries. In accordance with platform integrity rules, simulated crowd projections and synthetic test tickets are clearly labeled as demonstration items. Consequential financial transactions and regulatory sanctions strictly mandate human supervisor authorization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Verified Feeds</span>
            <span className="text-emerald-400 font-semibold mt-0.5 block">ASI Digital Counters, IRCTC, DMRC</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Inference Models</span>
            <span className="text-cyan-300 font-semibold mt-0.5 block">SeasonCast ARIMA + Prophet Pipeline</span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Human Gatekeeper</span>
            <span className="text-amber-300 font-semibold mt-0.5 block">100% Mandatory for Escrow Payouts</span>
          </div>
        </div>
      </div>

      {/* Core Settings Options */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {/* Toggle 1: Simulation Disclaimer Banner */}
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 max-w-lg">
            <span className="font-bold text-slate-900 block">Show Demonstration & Simulation Disclaimers</span>
            <p className="text-slate-500 text-[11px]">
              Display the visual integrity banner across views to prevent confusing prototype data with live official government bulletins.
            </p>
          </div>
          <input
            type="checkbox"
            checked={simulationBadge}
            onChange={(e) => setSimulationBadge(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        {/* Toggle 2: Mandatory Human Approval */}
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 max-w-lg">
            <span className="font-bold text-slate-900 block">Enforce Human Approval Gate on All Financial Disbursements</span>
            <p className="text-slate-500 text-[11px]">
              Require an operations supervisor to manually authorize refund checks and chargebacks before releasing escrow funds.
            </p>
          </div>
          <input
            type="checkbox"
            checked={humanApprovalMandatory}
            disabled
            className="w-4 h-4 accent-indigo-600 rounded cursor-not-allowed opacity-80"
          />
        </div>

        {/* Slider: ML Confidence Threshold */}
        <div className="p-4 flex items-center justify-between gap-6">
          <div className="space-y-0.5 max-w-lg">
            <span className="font-bold text-slate-900 block">Anomaly Detection Confidence Threshold</span>
            <p className="text-slate-500 text-[11px]">
              Minimum statistical confidence score required before PriceGuard and SeasonCast formulate automated escalation actions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="75"
              max="99"
              value={modelConfidenceThreshold}
              onChange={(e) => setModelConfidenceThreshold(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-indigo-700 w-12 text-right">
              {modelConfidenceThreshold}%
            </span>
          </div>
        </div>

        {/* Toggle 3: Automated Price Anomaly Auditing */}
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 max-w-lg">
            <span className="font-bold text-slate-900 block">Autonomous Price Anomaly Scanning</span>
            <p className="text-slate-500 text-[11px]">
              Automatically run OCR quotation-to-invoice reconciliation upon supplier invoice upload.
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoFlagAnomalies}
            onChange={(e) => setAutoFlagAnomalies(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* System Diagnostics & Future Integration Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-600" />
          Enterprise Integration Readiness Matrix
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">State Tourism Board REST Ingest</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Ready</span>
            </div>
            <p className="text-[11px] text-slate-500">Supports direct JSON webhook streams from district collectors and ASI gates.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">PostgreSQL & Cloud SQL Schema</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">Compatible</span>
            </div>
            <p className="text-[11px] text-slate-500">Normalized relational schema prepared for booking ledgers and operator audits.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Python ML Model Inference Server</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-mono">Microservice</span>
            </div>
            <p className="text-[11px] text-slate-500">FastAPI endpoint architecture for seasonal ARIMA and Prophet training pipelines.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Gemini 2.4 Multimodal RAG Engine</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">Active</span>
            </div>
            <p className="text-[11px] text-slate-500">Grounded in verified dispute statutes and historical case precedent.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
