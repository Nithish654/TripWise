import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_COPILOT_MESSAGES } from '../../data/mockTourismData';
import { ChatMessage, TabId } from '../../types/tourism';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Download,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Compass
} from 'lucide-react';

interface CopilotViewProps {
  onNavigateTab: (tab: TabId) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Which Tamil Nadu destinations may experience high crowds this weekend?',
    'Explain why hotel occupancy is expected to increase next month.',
    'Summarize unresolved refunds and identify urgent cases.',
    'Compare package prices and identify unexplained charges.',
    'Generate a tourism performance report for this month.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateAIResponse = (userText: string) => {
    const lower = userText.toLowerCase();

    if (lower.includes('tamil nadu') || lower.includes('crowd') || lower.includes('weekend')) {
      return {
        text: `### Crowd Intelligence Assessment for Tamil Nadu (Upcoming Weekend)

Based on turnstile sensors and the CrowdSense AI predictive model:

1. **Meenakshi Amman Temple (Madurai):** **CRITICAL RISK** (Predicted peak: 46,200 visitors, 85% capacity load). Driven by the Chithirai pre-season pilgrimage surge. Recommended action: stage incoming tour coaches past 16:30 or redirect non-pilgrim travelers to Thirumalai Nayakkar Palace.
2. **Ooty Botanical Gardens & Doddabetta:** **HIGH RISK** (Predicted peak: 24,500 visitors, 76% capacity). Autumn getaway travelers from Bengaluru and Coimbatore have saturated 88% of Nilgiris e-pass vehicular slots.
3. **Shore Temple (Mahabalipuram):** **MODERATE RISK** (51% capacity). Flow is smooth along the East Coast Road corridor with zero transit disruptions.`,
        citations: [
          { title: 'Madurai District Administration Sensor Grid', source: 'HR&CE Ingress Feed', type: 'Official Record' as const },
          { title: 'CrowdSense 24h ARIMA Projection', source: 'SeasonCast ML Pipeline', type: 'ML Forecast' as const },
        ],
        metricsCard: {
          title: 'Tamil Nadu Weekend Load',
          value: '85% Peak',
          subtext: '46,200 projected at Madurai',
          trend: 'up' as const,
        },
        suggestedAction: {
          label: 'Open CrowdSense Heatmap',
          targetTab: 'crowd' as TabId,
        },
      };
    }

    if (lower.includes('occupancy') || lower.includes('increase') || lower.includes('next month')) {
      return {
        text: `### SeasonCast Demand Growth Drivers for November & December

Hotel occupancy across premier state corridors is projected to climb from **74% to 92%** next month due to three primary macroeconomic vectors:

1. **Winter Festival & Wedding Corridor:** Rajasthan (Jaipur, Udaipur) and Kerala (Alleppey backwaters) are witnessing peak heritage booking velocity.
2. **Leisure Multiplier:** Sunburn festival preparation and foreign tourist charter arrivals in Goa are driving coastal hotel inventory to near-depletion (Candolim & Calangute at 89% capacity).
3. **Corporate Retreat Season:** High demand for Munnar and Ooty hill cottages on long weekends.`,
        citations: [
          { title: 'Federation of Hotel & Restaurant Associations (FHRAI)', source: 'Q4 Yield Benchmarks', type: 'Supplier Audit' as const },
          { title: 'SeasonCast 30-Day Predictive Model', source: 'Prophet Time-Series Inference', type: 'ML Forecast' as const },
        ],
        metricsCard: {
          title: 'Occupancy Outlook',
          value: '92% Avg',
          subtext: '+18% MoM Surge in South & West',
          trend: 'up' as const,
        },
        suggestedAction: {
          label: 'View SeasonCast Scenarios',
          targetTab: 'forecasting' as TabId,
        },
      };
    }

    if (lower.includes('refund') || lower.includes('unresolved') || lower.includes('urgent')) {
      return {
        text: `### RefundResolve AI Dispute Summary

There are currently **4 active dispute cases** under management, representing **₹1,09,800** in contested funds held in escrow:

- **CASE-8841 (URGENT - 6h SLA remaining):** Ananya Deshmukh vs Misty Valleys Resort (Munnar). Force Majeure flood cancellation. Proposed settlement: ₹33,300 refund. Awaiting human supervisor sign-off.
- **CASE-8822 (URGENT - 4h SLA remaining):** Dr. Michael Chen vs Azure Waves Hotel (Goa). Unlawful eviction due to overbooking. Recommended compensation: ₹52,000.
- **CASE-8839 (High Priority):** Vikramjit Singh vs Royal Rajputana Caravans. Hidden heritage fee anomaly of ₹14,800 flagged by PriceGuard.`,
        citations: [
          { title: 'Escrow Ledger & SLA Register', source: 'Ministry of Tourism Dispute Portal', type: 'Official Record' as const },
          { title: 'Force Majeure Advisory Memo 14B', source: 'Disaster Management Authority', type: 'Official Record' as const },
        ],
        metricsCard: {
          title: 'Pending Human Approvals',
          value: '₹85,300',
          subtext: '2 Urgent Cases with SLA < 6h',
          trend: 'down' as const,
        },
        suggestedAction: {
          label: 'Inspect & Authorize in RefundResolve',
          targetTab: 'refunds' as TabId,
        },
      };
    }

    if (lower.includes('price') || lower.includes('unexplained') || lower.includes('charges')) {
      return {
        text: `### PriceGuard Transparency Audit Findings

Optical and line-item audits across 64 operator quotations identified **3 flagged pricing anomalies**:

1. **Goa Coastal Weekend (AUD-312):** Compulsory **₹8,900** beach party charge added at hotel checkout despite marketing as "All-Inclusive". PriceGuard has placed vendor disbursement on freeze.
2. **Royal Rajasthan Forts (AUD-309):** Undisclosed **₹6,500** "Monuments Evening Entry Cess" with zero statutory basis.
3. **Tamil Nadu Temple Odyssey (AUD-311):** Billed darshan passes at 3x counter rate with unitemized facilitation fee (₹4,200).`,
        citations: [
          { title: 'PriceGuard OCR Invoice Parsing Model', source: 'Automated GST & Tariff Checker', type: 'Supplier Audit' as const },
        ],
        metricsCard: {
          title: 'Hidden Surcharges Blocked',
          value: '₹19,600',
          subtext: 'Across 3 Operator Packages',
          trend: 'down' as const,
        },
        suggestedAction: {
          label: 'Review PriceGuard Audits',
          targetTab: 'pricing' as TabId,
        },
      };
    }

    // Default synthesis
    return {
      text: `### TripWise AI Operational Synthesis

Regarding "${userText}":

Across the 5 monitored tourism state corridors (Tamil Nadu, Kerala, Rajasthan, Goa, Delhi):
- **Crowd Dynamics:** Madurai Meenakshi Temple and North Goa beaches are operating above 85% capacity.
- **Travel Corridors:** Southern Railway Pamban Bridge and Jaipur-Udaipur Vande Bharat express lines are operating at 96% on-time reliability.
- **Pricing & Dispute Health:** Automated audits have protected ₹19,600 in consumer overcharges; 2 urgent refund approvals remain queued for human authorization.`,
      citations: [
        { title: 'Unified Tourism Intelligence Core', source: 'TripWise Multi-Agent Synthesis', type: 'ML Forecast' as const },
      ],
      suggestedAction: {
        label: 'Return to Executive Overview',
        targetTab: 'overview' as TabId,
      },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateAIResponse(text);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseData.text,
        citations: responseData.citations,
        metricsCard: responseData.metricsCard,
        suggestedAction: responseData.suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Copilot Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-200" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              TripWise AI Copilot
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono px-2 py-0.5 rounded">
                GENAI ANALYST ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Conversational intelligence grounded in live telemetry, ML forecasts, and dispute records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const fullText = messages.map(m => `[${m.sender.toUpperCase()} - ${m.timestamp}]\n${m.text}`).join('\n\n');
              const blob = new Blob([fullText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `TripWise_Intelligence_Report_${new Date().toISOString().split('T')[0]}.txt`;
              a.click();
            }}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Briefing</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/40">
        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          const isCopied = copiedId === m.id;

          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isAssistant ? '' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAssistant
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAssistant ? <Sparkles className="w-4 h-4 text-cyan-300" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700">
                    {isAssistant ? 'TripWise Tourism Copilot' : 'V J Nithish (Ops Director)'}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{m.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-xl text-xs leading-relaxed space-y-2 ${
                    isAssistant
                      ? 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-xs max-w-none">
                    {m.text}
                  </div>

                  {/* Embedded Metric Card */}
                  {m.metricsCard && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-slate-900">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                          {m.metricsCard.title}
                        </span>
                        <span className="text-base font-bold font-mono text-indigo-700">
                          {m.metricsCard.value}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-0.5">
                          {m.metricsCard.subtext}
                        </span>
                      </div>
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Citations & Source Links */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] space-y-1">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider block">
                        Verified Sources & Inference Grounding:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {m.citations.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {c.title} ({c.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deep link action button */}
                  {m.suggestedAction && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onNavigateTab(m.suggestedAction!.targetTab)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {isAssistant && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pl-1">
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      className="hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2 text-slate-400">Synthesizing telemetry across state nodes...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about crowd levels, hotel predictions, pricing discrepancies, or urgent disputes..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Analyze</span>
        </button>
      </div>
    </div>
  );
};
