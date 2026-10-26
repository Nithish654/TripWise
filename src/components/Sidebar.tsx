import React from 'react';
import { TabId } from '../types/tourism';
import {
  LayoutDashboard,
  Users,
  Compass,
  AlertTriangle,
  ReceiptText,
  TrendingUp,
  Sparkles,
  Bot,
  FileBarChart2,
  Sliders,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  pendingApprovalsCount: number;
  criticalCrowdCount: number;
}

interface NavItem {
  id: TabId;
  label: string;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeType?: 'alert' | 'neutral' | 'accent';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount,
  criticalCrowdCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'crowd',
      label: 'Crowd Intelligence',
      subLabel: 'CrowdSense AI',
      icon: Users,
      badge: criticalCrowdCount > 0 ? `${criticalCrowdCount} Peak` : undefined,
      badgeType: 'alert',
    },
    {
      id: 'local-travel',
      label: 'Local Travel Intelligence',
      subLabel: 'LocalTrip AI',
      icon: Compass,
    },
    {
      id: 'refunds',
      label: 'Refund & Complaints',
      subLabel: 'RefundResolve AI',
      icon: AlertTriangle,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeType: 'alert',
    },
    {
      id: 'pricing',
      label: 'Price Transparency',
      subLabel: 'PriceGuard AI',
      icon: ReceiptText,
      badge: '3 Flagged',
      badgeType: 'neutral',
    },
    {
      id: 'forecasting',
      label: 'Demand Forecasting',
      subLabel: 'SeasonCast AI',
      icon: TrendingUp,
    },
    {
      id: 'copilot',
      label: 'AI Copilot',
      subLabel: 'GenAI Analyst',
      icon: Sparkles,
      badge: 'Interactive',
      badgeType: 'accent',
    },
    {
      id: 'agents',
      label: 'Agent Workflows',
      subLabel: 'Autonomous Ops',
      icon: Bot,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Action` : undefined,
      badgeType: 'alert',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: FileBarChart2,
    },
    {
      id: 'settings',
      label: 'Settings & Data Sources',
      icon: Sliders,
    },
  ];

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            TW
          </div>
          <div>
            <div className="text-white font-bold tracking-tight text-base leading-none">
              TripWise <span className="text-indigo-400 font-normal">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">
              Tourism Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Organization Switcher Bar */}
      <div className="px-3 py-2.5 mx-3 mt-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
        <div className="truncate">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Workspace</div>
          <div className="text-slate-200 font-semibold truncate text-[11px]">
            Incredible India Ops
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
          ENTERPRISE
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
          Platform Modules
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="text-left truncate">
                  <div className="truncate">{item.label}</div>
                  {item.subLabel && !isActive && (
                    <div className="text-[10px] text-slate-400 font-normal">
                      {item.subLabel}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                    item.badgeType === 'alert'
                      ? isActive
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.badgeType === 'accent'
                      ? isActive
                        ? 'bg-cyan-400 text-slate-900 font-semibold'
                        : 'bg-cyan-500/20 text-cyan-300'
                      : isActive
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Simulation Disclaimer Card */}
      <div className="p-3 m-3 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px] mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Governance & Integrity</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Model predictions & simulated feeds clearly demarcated from ASI / HR&CE official telemetry.
        </p>
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center justify-center font-mono shrink-0">
            VN
          </div>
          <div className="truncate">
            <div className="text-white text-[11px] font-semibold truncate">V J Nithish</div>
            <div className="text-[10px] text-slate-400 truncate">Director, Tourism Ops</div>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">v2.4</span>
      </div>
    </aside>
  );
};
