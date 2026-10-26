import React, { useState, useMemo } from 'react';
import { TabId, DestinationRegion, TimeRange, DestinationSummary } from './types/tourism';
import { DESTINATIONS_DATA, COMPLAINT_CASES_DATA } from './data/mockTourismData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/tabs/OverviewDashboard';
import { CrowdSenseView } from './components/tabs/CrowdSenseView';
import { LocalTripView } from './components/tabs/LocalTripView';
import { RefundResolveView } from './components/tabs/RefundResolveView';
import { PriceGuardView } from './components/tabs/PriceGuardView';
import { SeasonCastView } from './components/tabs/SeasonCastView';
import { CopilotView } from './components/tabs/CopilotView';
import { AgentsWorkflowView } from './components/tabs/AgentsWorkflowView';
import { ReportsView } from './components/tabs/ReportsView';
import { SettingsView } from './components/tabs/SettingsView';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('overview');
  const [selectedRegion, setSelectedRegion] = useState<DestinationRegion>('All India');
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<DestinationSummary | null>(null);

  // Dest counts
  const destinations = useMemo(() => {
    if (!searchQuery.trim()) return DESTINATIONS_DATA;
    const q = searchQuery.toLowerCase();
    return DESTINATIONS_DATA.filter(
      d => d.name.toLowerCase().includes(q) ||
           d.state.toLowerCase().includes(q) ||
           d.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const criticalCrowdCount = useMemo(() => {
    return DESTINATIONS_DATA.filter(d => d.crowdRisk === 'critical').length;
  }, []);

  const pendingApprovalsCount = useMemo(() => {
    return COMPLAINT_CASES_DATA.filter(c => c.status === 'Pending Human Approval').length;
  }, []);

  const handleInspectDestination = (dest: DestinationSummary) => {
    setSelectedDestination(dest);
    setSelectedRegion(dest.state);
    setCurrentTab('crowd');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Deep Navy Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingApprovalsCount={pendingApprovalsCount}
        criticalCrowdCount={criticalCrowdCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <Header
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          timeRange={timeRange}
          onSelectTimeRange={setTimeRange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCopilot={() => setCurrentTab('copilot')}
          onNavigateTab={setCurrentTab}
        />

        {/* Operational Workspace Viewport */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Regulatory Transparency & Demonstration Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg px-3.5 py-2 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Prototype Demonstration Mode:</strong> Tourism turnstile feeds, predictive ARIMA outputs, and agent workflows are simulated for enterprise review. Consequential financial disbursements require explicit supervisor approval.
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('settings')}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
              >
                Integrity Settings
              </button>
            </div>

            {/* Active View Module */}
            {currentTab === 'overview' && (
              <OverviewDashboard
                destinations={destinations}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                onNavigateTab={setCurrentTab}
                onInspectDestination={handleInspectDestination}
              />
            )}

            {currentTab === 'crowd' && (
              <CrowdSenseView
                destinations={destinations}
                selectedRegion={selectedRegion}
                onSelectRegion={setSelectedRegion}
                selectedDestination={selectedDestination}
                onSelectDestination={setSelectedDestination}
              />
            )}

            {currentTab === 'local-travel' && <LocalTripView />}

            {currentTab === 'refunds' && <RefundResolveView />}

            {currentTab === 'pricing' && <PriceGuardView />}

            {currentTab === 'forecasting' && <SeasonCastView />}

            {currentTab === 'copilot' && <CopilotView onNavigateTab={setCurrentTab} />}

            {currentTab === 'agents' && <AgentsWorkflowView />}

            {currentTab === 'reports' && <ReportsView />}

            {currentTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
