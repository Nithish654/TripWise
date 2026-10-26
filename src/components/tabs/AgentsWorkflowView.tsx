import React, { useState } from 'react';
import { AI_AGENTS_DATA } from '../../data/mockTourismData';
import { AIAgent } from '../../types/tourism';
import {
  Bot,
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Check,
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export const AgentsWorkflowView: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS_DATA);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleAgentPause = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextStatus = a.status === 'Paused' ? 'Active Running' : 'Paused';
        return { ...a, status: nextStatus };
      }
      return a;
    }));

    setSelectedAgent(prev => prev.id === agentId ? { ...prev, status: prev.status === 'Paused' ? 'Active Running' : 'Paused' } : prev);
    setToastMessage(`Agent state updated successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerManualRun = (agentId: string) => {
    setToastMessage(`Manual execution cycle queued for ${selectedAgent.name}...`);
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, tasksCompleted: a.tasksCompleted + 1, lastExecution: 'Just now' } : a));
      setSelectedAgent(prev => prev.id === agentId ? { ...prev, tasksCompleted: prev.tasksCompleted + 1, lastExecution: 'Just now' } : prev);
      setToastMessage(`Execution cycle completed for ${selectedAgent.name}. Telemetry synced.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handleApproveAction = (actionId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        return {
          ...a,
          pendingApprovalsCount: Math.max(0, a.pendingApprovalsCount - 1),
          recentActions: a.recentActions.map(act => act.id === actionId ? { ...act, approved: true } : act),
        };
      }
      return a;
    }));

    setSelectedAgent(prev => ({
      ...prev,
      pendingApprovalsCount: Math.max(0, prev.pendingApprovalsCount - 1),
      recentActions: prev.recentActions.map(act => act.id === actionId ? { ...act, approved: true } : act),
    }));

    setToastMessage(`Action ${actionId} approved. Autonomous execution dispatched.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalCompleted = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const totalPending = agents.reduce((acc, a) => acc + a.pendingApprovalsCount, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-lg text-xs flex items-center justify-between shadow-lg border border-slate-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              AGENTIC AI ORCHESTRATION CENTER
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Autonomous Workflow Engine with Human-in-the-Loop</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Autonomous Operations & Workflow Automation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Specialized background agents continuously ingesting telemetry, formulating regulatory actions, and seeking supervisory approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            Total Executions: <strong>{totalCompleted.toLocaleString('en-IN')}</strong>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-800">
            Pending Approvals: <strong>{totalPending}</strong>
          </div>
        </div>
      </div>

      {/* Agent Selector Grid (5 specialized agents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {agents.map((agent) => {
          const isSelected = selectedAgent.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] font-bold text-indigo-600">
                    {agent.codeName}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase font-mono ${
                      agent.status === 'Active Running'
                        ? 'bg-emerald-100 text-emerald-800'
                        : agent.status === 'Awaiting Human Approval'
                        ? 'bg-amber-100 text-amber-800'
                        : agent.status === 'Paused'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {agent.status === 'Active Running' ? 'Running' : agent.status === 'Awaiting Human Approval' ? 'Approval Req' : agent.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {agent.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {agent.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono tabular-nums">
                <span>{agent.tasksCompleted} tasks</span>
                {agent.pendingApprovalsCount > 0 ? (
                  <span className="text-amber-600 font-bold font-sans">
                    {agent.pendingApprovalsCount} Approval
                  </span>
                ) : (
                  <span className="text-emerald-600">Optimal</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Agent Workbench: Timeline & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Execution Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {selectedAgent.codeName}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono">Accuracy: {selectedAgent.accuracyRate}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedAgent.name} · Step-by-Step Execution Trace
              </h2>
            </div>

            {/* Agent Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerManualRun(selectedAgent.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Run Cycle</span>
              </button>

              <button
                onClick={() => toggleAgentPause(selectedAgent.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  selectedAgent.status === 'Paused'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                {selectedAgent.status === 'Paused' ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Agent</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Active Task Banner */}
          <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-700 uppercase font-bold tracking-wider block">
                Active Ingestion Focus:
              </span>
              <span className="font-semibold text-indigo-950">{selectedAgent.currentTask}</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-mono">Last run: {selectedAgent.lastExecution}</span>
          </div>

          {/* Execution Steps Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Execution Lifecycle Protocol
            </h4>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedAgent.executionSteps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';

                return (
                  <div key={idx} className="relative flex items-start gap-4 pl-8 text-xs">
                    {/* Step Icon Marker */}
                    <div
                      className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{step.step}</span>
                        <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        {step.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Actions Requiring Human Authorization (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Proposed Agent Actions Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Human supervisory approval gate
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              Strict Gatekeeper
            </span>
          </div>

          <div className="space-y-3">
            {selectedAgent.recentActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {act.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {act.payloadDetails}
                </p>

                <div className="p-2 bg-indigo-50/80 rounded border border-indigo-200/60 text-[11px] text-indigo-900">
                  <strong>Impact:</strong> {act.impact}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  {act.approved ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved & Dispatched
                    </span>
                  ) : (
                    <div className="w-full flex items-center gap-2">
                      <button
                        onClick={() => handleApproveAction(act.id)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Authorize Action</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              All autonomous decisions affecting consumer finances, public traffic advisories, or vendor sanctions mandate human approval under AI Governance standard 2026.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
