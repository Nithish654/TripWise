import React, { useState } from 'react';
import { COMPLAINT_CASES_DATA } from '../../data/mockTourismData';
import { ComplaintCase } from '../../types/tourism';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  FileText,
  UserCheck,
  Send,
  Building2,
  IndianRupee,
  AlertCircle,
  X,
  FileCheck
} from 'lucide-react';

export const RefundResolveView: React.FC = () => {
  const [cases, setCases] = useState<ComplaintCase[]>(COMPLAINT_CASES_DATA);
  const [selectedCase, setSelectedCase] = useState<ComplaintCase | null>(cases[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Confirmation Modal state for Consequential Human Financial Commitment
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [processingApproval, setProcessingApproval] = useState(false);
  const [approvalSuccessMessage, setApprovalSuccessMessage] = useState<string | null>(null);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.travelerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.vendorName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalCases = cases.length;
  const pendingApprovals = cases.filter(c => c.status === 'Pending Human Approval');
  const urgentCount = cases.filter(c => c.priority === 'Urgent');
  const totalContestedINR = cases.reduce((acc, c) => acc + c.amountClaimedINR, 0);

  const handleConfirmRefund = () => {
    if (!selectedCase) return;
    setProcessingApproval(true);

    setTimeout(() => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCase.id
            ? { ...c, status: 'Resolved & Refunded', approvalRequired: false }
            : c
        )
      );

      setSelectedCase((prev) =>
        prev && prev.id === selectedCase.id
          ? { ...prev, status: 'Resolved & Refunded', approvalRequired: false }
          : prev
      );

      setProcessingApproval(false);
      setShowApprovalModal(false);
      setApprovalSuccessMessage(
        `Refund of ₹${selectedCase.proposedRefundINR.toLocaleString('en-IN')} approved and queued to payment escrow ledger for ${selectedCase.travelerName} (${selectedCase.id}).`
      );

      setTimeout(() => setApprovalSuccessMessage(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {approvalSuccessMessage && (
        <div className="p-3 bg-emerald-900 text-emerald-100 rounded-lg text-xs flex items-center justify-between shadow-lg border border-emerald-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{approvalSuccessMessage}</span>
          </div>
          <button onClick={() => setApprovalSuccessMessage(null)} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              REFUNDRESOLVE AI PLATFORM
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Autonomous Case Auditing & Escrow Enforcement</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Consumer Dispute & Refund Management Console
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            SLA tracking, Force Majeure regulatory checks, GenAI defense analysis, and human-in-the-loop approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">SLA Adherence:</span>
          <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            94.2% on-time
          </span>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Active Disputes</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {totalCases} Cases
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all state corridors</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Human Sign-Off</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 mt-1 font-mono tabular-nums">
            {pendingApprovals.length} Cases
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Requires supervisor sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Urgent SLA Deadlines</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 mt-1 font-mono tabular-nums">
            {urgentCount.length} Cases (&lt;6h)
          </div>
          <div className="text-[11px] text-rose-500 mt-0.5">High consumer court risk</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Value Claimed</span>
            <IndianRupee className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ₹{totalContestedINR.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Under escrow hold</div>
        </div>
      </div>

      {/* Main Workbench: Filterable Case Table + Deep Dive Case Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Search and Filters Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by traveler, case ID, operator..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Human Approval">Pending Approval</option>
                  <option value="Under AI Review">Under Review</option>
                  <option value="Awaiting Supplier Docs">Awaiting Docs</option>
                  <option value="Resolved & Refunded">Resolved</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Urgent">Urgent (&lt;6h)</option>
                  <option value="High">High</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            {/* Cases Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Traveler & Route</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Claim</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((c) => {
                    const isSelected = selectedCase?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-50/70 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-900">
                          {c.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{c.travelerName}</div>
                          <div className="text-[10px] text-slate-400">{c.destination}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                          {c.category}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                          ₹{c.amountClaimedINR.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                              c.status === 'Pending Human Approval'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : c.status === 'Resolved & Refunded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'Escalated'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {c.slaDeadlineHours > 0 ? (
                            <span
                              className={`text-[11px] font-semibold ${
                                c.slaDeadlineHours <= 6 ? 'text-rose-600 font-bold' : 'text-slate-600'
                              }`}
                            >
                              {c.slaDeadlineHours}h left
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold">Done</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Showing {filteredCases.length} of {cases.length} cases</span>
            <span className="text-slate-400">Escrow Security Guard Active</span>
          </div>
        </div>

        {/* Selected Case Deep Dive Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          {selectedCase ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {selectedCase.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Ref: {selectedCase.bookingRef}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedCase.travelerName}
                  </h3>
                  <div className="text-xs text-slate-500">{selectedCase.travelerEmail}</div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded font-mono ${
                      selectedCase.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedCase.priority} Priority
                  </span>
                  <div className="text-xs font-mono text-slate-500 mt-1">
                    {selectedCase.slaDeadlineHours > 0 ? `SLA: ${selectedCase.slaDeadlineHours}h remaining` : 'Resolved'}
                  </div>
                </div>
              </div>

              {/* Dispute Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-xs font-mono tabular-nums">
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Vendor Accused</span>
                  <span className="font-semibold text-slate-800">{selectedCase.vendorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Amount Claimed</span>
                  <span className="font-bold text-slate-900">
                    ₹{selectedCase.amountClaimedINR.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* GenAI Case Summary & Legal Precedent */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  GenAI Case Synthesis & Defense Check
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedCase.aiSummary}
                </p>

                {selectedCase.missingDocuments.length > 0 && (
                  <div className="mt-2 p-2 bg-amber-950/60 border border-amber-700/60 rounded text-[11px] text-amber-200">
                    <strong>Pending Evidence:</strong> {selectedCase.missingDocuments.join(', ')}
                  </div>
                )}
              </div>

              {/* Recommended Settlement & Action Box */}
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                <div className="text-xs font-bold text-indigo-950 flex items-center justify-between">
                  <span>AI Recommended Settlement</span>
                  <span className="font-mono text-indigo-700 text-sm font-extrabold">
                    ₹{selectedCase.proposedRefundINR.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-900 leading-snug">
                  {selectedCase.recommendedAction}
                </p>
              </div>

              {/* Strict Consequential Action Trigger */}
              <div className="pt-2 border-t border-slate-100">
                {selectedCase.status === 'Resolved & Refunded' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Refund of ₹{selectedCase.proposedRefundINR.toLocaleString('en-IN')} successfully executed to source account.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowApprovalModal(true)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Review & Authorize Refund (₹{selectedCase.proposedRefundINR.toLocaleString('en-IN')})</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      * Strict human-in-the-loop requirement: financial commitments are never executed autonomously.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mb-2 stroke-1" />
              <span>Select a complaint case from the table to inspect details</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Consequential Financial Approval */}
      {showApprovalModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Authorize Escrow Refund Disbursement
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">{selectedCase.id}</div>
                </div>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Beneficiary Traveler:</span>
                <span className="font-semibold text-slate-900">{selectedCase.travelerName}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Debited Supplier:</span>
                <span className="font-semibold text-slate-900">{selectedCase.vendorName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-slate-200 pt-1 font-mono">
                <span className="text-slate-500">Authorized Refund Amount:</span>
                <span className="font-bold text-indigo-700 text-sm">
                  ₹{selectedCase.proposedRefundINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              By confirming, you execute a binding disbursement order against the participating supplier escrow balance under Ministry of Tourism Consumer Protection Regulations.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                disabled={processingApproval}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {processingApproval ? 'Processing Transfer...' : 'Confirm & Release Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
