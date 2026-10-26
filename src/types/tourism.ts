export type DestinationRegion = 
  | 'All India' 
  | 'Tamil Nadu' 
  | 'Kerala' 
  | 'Rajasthan' 
  | 'Goa' 
  | 'Delhi';

export type TimeRange = 'today' | '7d' | '30d' | '90d' | 'q4';

export type TabId = 
  | 'overview' 
  | 'crowd' 
  | 'local-travel' 
  | 'refunds' 
  | 'pricing' 
  | 'forecasting' 
  | 'copilot' 
  | 'agents' 
  | 'reports' 
  | 'settings';

export type CrowdRiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface DestinationSummary {
  id: string;
  name: string;
  state: DestinationRegion;
  category: 'Heritage' | 'Beach' | 'Hill Station' | 'Pilgrimage' | 'Urban & Culture';
  currentVisitors: number;
  capacityLimit: number;
  utilizationRate: number; // 0 - 100%
  predictedPeak24h: number;
  predictedPeak7d: number;
  crowdRisk: CrowdRiskLevel;
  weather: {
    temp: number;
    condition: string;
    monsoonRisk: 'Low' | 'Moderate' | 'Heavy';
  };
  festivalImpact?: string;
  alternativeRecommendation?: string;
  verifiedSource: string;
  isSimulatedData: boolean;
}

export interface RouteOption {
  id: string;
  title: string;
  mode: 'Vande Bharat / Express Train' | 'Flight + Private Cab' | 'State Highway Volvo Bus' | 'Self-Drive / Rental';
  durationMinutes: number;
  estimatedCostINR: number;
  carbonKg: number;
  reliabilityScore: number; // 0 - 100
  disruptions: string[];
  departureFrequency: string;
  isVerified: boolean;
  scenicRating: number;
}

export interface ComplaintCase {
  id: string;
  bookingRef: string;
  travelerName: string;
  travelerEmail: string;
  destination: string;
  vendorName: string;
  category: 'Hotel Non-Refundable Cancellation' | 'Hidden Fuel & Surcharge' | 'Flight Delay Disconnect' | 'Tour Guide Misrepresentation' | 'Overbooking Eviction';
  amountClaimedINR: number;
  status: 'Under AI Review' | 'Awaiting Supplier Docs' | 'Escalated' | 'Pending Human Approval' | 'Resolved & Refunded';
  priority: 'High' | 'Urgent' | 'Standard';
  filedDate: string;
  slaDeadlineHours: number;
  aiSummary: string;
  missingDocuments: string[];
  recommendedAction: string;
  proposedRefundINR: number;
  approvalRequired: boolean;
  isSimulated: boolean;
}

export interface PriceAuditItem {
  id: string;
  packageName: string;
  destination: string;
  operator: string;
  basePriceINR: number;
  taxesGstINR: number;
  transportINR: number;
  hotelINR: number;
  activitiesINR: number;
  hiddenFeesDetectedINR: number;
  quotedTotalINR: number;
  finalBilledINR: number;
  discrepancyPercent: number;
  status: 'Flagged Anomaly' | 'Verified Compliant' | 'Pending Explanation';
  anomalyReason: string;
  financialImpactINR: number;
  cancellationTermFairnessScore: number; // 0-100
  inclusions: string[];
  exclusions: string[];
}

export interface ForecastPoint {
  date: string;
  label: string;
  actualArrivals?: number;
  forecastArrivals: number;
  lowerConfidence95: number;
  upperConfidence95: number;
  occupancyPercent: number;
  revenueCroresINR: number;
  cancellationRatePercent: number;
  festivalMultiplier: number;
}

export interface AIAgent {
  id: string;
  name: string;
  codeName: string;
  role: string;
  status: 'Active Running' | 'Idle Standby' | 'Awaiting Human Approval' | 'Paused';
  lastExecution: string;
  tasksCompleted: number;
  pendingApprovalsCount: number;
  accuracyRate: string;
  currentTask: string;
  executionSteps: {
    timestamp: string;
    step: 'Trigger Detected' | 'Data Retrieved' | 'Inference & Analysis' | 'Action Formulated' | 'Human Approval Requested' | 'Execution Completed';
    details: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
  recentActions: {
    id: string;
    title: string;
    impact: string;
    timestamp: string;
    requiresApproval: boolean;
    approved?: boolean;
    payloadDetails: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: {
    title: string;
    source: string;
    type: 'Official Record' | 'ML Forecast' | 'Supplier Audit';
  }[];
  suggestedAction?: {
    label: string;
    targetTab: TabId;
    actionPayload?: string;
  };
  metricsCard?: {
    title: string;
    value: string;
    subtext: string;
    trend: 'up' | 'down' | 'neutral';
  };
}
