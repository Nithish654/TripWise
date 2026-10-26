import React, { useState } from 'react';
import { DestinationRegion, TimeRange, TabId } from '../types/tourism';
import {
  Search,
  Calendar,
  MapPin,
  Bell,
  Sparkles,
  ChevronDown,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface HeaderProps {
  selectedRegion: DestinationRegion;
  onSelectRegion: (region: DestinationRegion) => void;
  timeRange: TimeRange;
  onSelectTimeRange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCopilot: () => void;
  onNavigateTab: (tab: TabId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRegion,
  onSelectRegion,
  timeRange,
  onSelectTimeRange,
  searchQuery,
  onSearchChange,
  onOpenCopilot,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Crowd Alert: Madurai Meenakshi Temple',
      description: 'Sensor density exceeded 85% capacity threshold. Staggered bus entry recommended.',
      time: '14 mins ago',
      type: 'critical',
      targetTab: 'crowd' as TabId,
    },
    {
      id: 'notif-2',
      title: 'Action Pending: ₹33,300 Refund Approval',
      description: 'Force Majeure weather advisory refund for CASE-8841 ready for human authorization.',
      time: '32 mins ago',
      type: 'action',
      targetTab: 'refunds' as TabId,
    },
    {
      id: 'notif-3',
      title: 'Price Anomaly Detected in Goa Package',
      description: 'Hidden mandatory festive gala surcharge of ₹8,900 flagged in invoice AUD-312.',
      time: '1 hour ago',
      type: 'warning',
      targetTab: 'pricing' as TabId,
    },
  ];

  const regions: DestinationRegion[] = [
    'All India',
    'Tamil Nadu',
    'Kerala',
    'Rajasthan',
    'Goa',
    'Delhi',
  ];

  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: 'today', label: 'Today (Live)' },
    { id: '7d', label: 'Next 7 Days' },
    { id: '30d', label: '30-Day Outlook' },
    { id: '90d', label: 'Quarterly Forecast' },
    { id: 'q4', label: 'Q4 Festive Season' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
      {/* Left Area: Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search destination, case ID (CASE-8841), route, package..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Filters, Assistant Shortcut, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Destination Region Selector */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
          <select
            value={selectedRegion}
            onChange={(e) => onSelectRegion(e.target.value as DestinationRegion)}
            className="bg-transparent text-slate-800 font-medium text-xs focus:outline-none cursor-pointer pr-4"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
          <select
            value={timeRange}
            onChange={(e) => onSelectTimeRange(e.target.value as TimeRange)}
            className="bg-transparent text-slate-800 font-medium text-xs focus:outline-none cursor-pointer pr-4"
          >
            {timeRanges.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick AI Assistant Trigger */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-xs font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline">Ask AI Copilot</span>
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="text-xs font-bold text-slate-900">
                  Operational Alerts & Approvals
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  3 Active Events
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => {
                      onNavigateTab(n.targetTab);
                      setShowNotifications(false);
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'critical' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : n.type === 'action' ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {n.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-indigo-600 font-medium">
                          Review in module <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Close Tray
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
            VN
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-slate-900 leading-tight">V J Nithish</div>
            <div className="text-[10px] text-slate-500">Director · Ops Command</div>
          </div>
        </div>
      </div>
    </header>
  );
};
