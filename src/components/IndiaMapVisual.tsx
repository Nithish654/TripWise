import React, { useState } from 'react';
import { DestinationRegion, DestinationSummary } from '../types/tourism';
import { MapPin, AlertCircle, Users, Wind, ExternalLink } from 'lucide-react';

interface IndiaMapVisualProps {
  destinations: DestinationSummary[];
  selectedRegion: DestinationRegion;
  onSelectRegion: (region: DestinationRegion) => void;
  onSelectDestination?: (dest: DestinationSummary) => void;
}

interface MapMarker {
  id: string;
  name: string;
  state: DestinationRegion;
  x: number; // percentage in SVG (0-100)
  y: number; // percentage in SVG (0-100)
  destId: string;
}

const MARKERS: MapMarker[] = [
  { id: 'm-delhi', name: 'Delhi NCR', state: 'Delhi', x: 42, y: 31, destId: 'dest-dl-1' },
  { id: 'm-jaipur', name: 'Jaipur & Forts', state: 'Rajasthan', x: 34, y: 36, destId: 'dest-rj-1' },
  { id: 'm-udaipur', name: 'Udaipur Lakes', state: 'Rajasthan', x: 30, y: 44, destId: 'dest-rj-2' },
  { id: 'm-goa', name: 'Goa Beaches', state: 'Goa', x: 31, y: 72, destId: 'dest-ga-1' },
  { id: 'm-kochi', name: 'Alleppey & Kochi', state: 'Kerala', x: 37, y: 88, destId: 'dest-kl-1' },
  { id: 'm-munnar', name: 'Munnar Hills', state: 'Kerala', x: 41, y: 86, destId: 'dest-kl-2' },
  { id: 'm-madurai', name: 'Madurai Temple', state: 'Tamil Nadu', x: 43, y: 91, destId: 'dest-tn-1' },
  { id: 'm-ooty', name: 'Nilgiris / Ooty', state: 'Tamil Nadu', x: 38, y: 83, destId: 'dest-tn-2' },
  { id: 'm-mahabs', name: 'Mahabalipuram', state: 'Tamil Nadu', x: 47, y: 81, destId: 'dest-tn-3' },
];

export const IndiaMapVisual: React.FC<IndiaMapVisualProps> = ({
  destinations,
  selectedRegion,
  onSelectRegion,
  onSelectDestination,
}) => {
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);

  const filteredMarkers = selectedRegion === 'All India' 
    ? MARKERS 
    : MARKERS.filter(m => m.state === selectedRegion);

  const getRiskColor = (destId: string) => {
    const d = destinations.find(it => it.id === destId);
    if (!d) return '#6366f1';
    switch (d.crowdRisk) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'moderate': return '#0ea5e9';
      case 'low': return '#10b981';
    }
  };

  const getDestinationDetails = (destId: string) => {
    return destinations.find(it => it.id === destId);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs relative">
      {/* Header and Region Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            Geographic Tourism Corridor & Density Map
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and ML crowd density indicators across key state corridors
          </p>
        </div>

        {/* Quick state chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto max-w-full">
          {(['All India', 'Tamil Nadu', 'Kerala', 'Rajasthan', 'Goa', 'Delhi'] as DestinationRegion[]).map((reg) => (
            <button
              key={reg}
              onClick={() => onSelectRegion(reg)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[400px] bg-slate-50/70 rounded-lg border border-slate-100 overflow-hidden flex items-center justify-center">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f01f_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f01f_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Scalable Vector Map of India outline */}
        <svg
          viewBox="0 0 500 560"
          className="h-full w-auto max-w-full drop-shadow-xs select-none"
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* India Boundary Path Approximation */}
          <path
            d="M 210 25 
               C 225 35, 240 50, 250 70 
               C 265 90, 290 95, 305 115 
               C 310 130, 340 145, 360 150 
               C 375 160, 420 160, 435 170 
               C 455 185, 465 210, 440 225 
               C 415 240, 395 230, 385 245 
               C 375 260, 350 255, 340 270 
               C 330 290, 310 320, 295 340 
               C 285 365, 275 390, 260 420 
               C 248 445, 235 480, 225 510 
               C 218 535, 212 540, 208 530 
               C 198 500, 185 450, 175 420 
               C 165 390, 155 350, 145 320 
               C 140 290, 120 270, 125 250 
               C 130 230, 160 215, 175 190 
               C 185 165, 170 140, 175 110 
               C 180 80, 195 40, 210 25 Z"
            fill="url(#mapGradient)"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinejoin="round"
            filter="url(#softGlow)"
          />

          {/* Key internal state highlight boundaries */}
          {/* North Zone */}
          <path
            d="M 180 120 Q 210 140 240 150 L 260 190 Q 210 200 175 190 Z"
            fill={selectedRegion === 'Delhi' || selectedRegion === 'Rajasthan' ? '#e0e7ff' : '#f1f5f9'}
            stroke="#94a3b8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* Western / Rajasthan Zone */}
          <path
            d="M 140 170 Q 180 190 190 230 L 155 270 Q 130 230 140 170 Z"
            fill={selectedRegion === 'Rajasthan' ? '#e0e7ff' : '#f1f5f9'}
            stroke="#94a3b8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* Goa Coastal pocket */}
          <path
            d="M 160 365 L 175 375 L 170 395 L 155 385 Z"
            fill={selectedRegion === 'Goa' ? '#e0e7ff' : '#f1f5f9'}
            stroke="#94a3b8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* South Zone / Tamil Nadu & Kerala */}
          <path
            d="M 175 420 Q 220 440 245 470 L 225 510 L 208 530 Q 190 480 175 420 Z"
            fill={selectedRegion === 'Tamil Nadu' || selectedRegion === 'Kerala' ? '#e0e7ff' : '#f1f5f9'}
            stroke="#94a3b8"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* State & Landmark Labels */}
          <text x="210" y="160" textAnchor="middle" className="text-[11px] font-semibold fill-slate-500 pointer-events-none select-none">
            Delhi NCR
          </text>
          <text x="165" y="210" textAnchor="middle" className="text-[11px] font-semibold fill-slate-500 pointer-events-none select-none">
            Rajasthan
          </text>
          <text x="145" y="380" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500 pointer-events-none select-none">
            Goa
          </text>
          <text x="195" y="475" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500 pointer-events-none select-none">
            Kerala
          </text>
          <text x="235" y="490" textAnchor="middle" className="text-[10px] font-semibold fill-slate-500 pointer-events-none select-none">
            Tamil Nadu
          </text>

          {/* Interactive Destination Hotspots */}
          {filteredMarkers.map((m) => {
            const svgX = (m.x / 100) * 500;
            const svgY = (m.y / 100) * 560;
            const color = getRiskColor(m.destId);
            const isSelected = activeMarker?.id === m.id;

            return (
              <g
                key={m.id}
                className="cursor-pointer group"
                onClick={() => {
                  setActiveMarker(m);
                  const dest = getDestinationDetails(m.destId);
                  if (dest && onSelectDestination) {
                    onSelectDestination(dest);
                  }
                }}
              >
                {/* Animated pulse ring */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isSelected ? 16 : 10}
                  fill={color}
                  fillOpacity="0.2"
                  className="animate-ping"
                  style={{ animationDuration: '3s' }}
                />
                {/* Secondary halo */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isSelected ? 11 : 7}
                  fill={color}
                  fillOpacity="0.4"
                />
                {/* Core Pin */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r={isSelected ? 6 : 4}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Marker label */}
                <text
                  x={svgX + 9}
                  y={svgY + 3}
                  className="text-[10px] font-medium fill-slate-800 tracking-tight drop-shadow-xs group-hover:fill-indigo-700 transition-colors pointer-events-none"
                >
                  {m.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[11px] shadow-xs flex flex-col gap-1.5 z-10">
          <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider">Crowd Density Risk</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Critical (&gt;85%)
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> High (75-85%)
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Moderate
            </span>
          </div>
        </div>

        {/* Active Destination Card Overlay at top right */}
        {activeMarker && (
          <div className="absolute top-3 right-3 max-w-xs bg-white rounded-lg border border-slate-200 p-3.5 shadow-md z-20 animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const dest = getDestinationDetails(activeMarker.destId);
              if (!dest) return null;
              return (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">
                        {dest.state} · {dest.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {dest.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveMarker(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs p-0.5"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs font-mono tabular-nums">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Footfall</span>
                      <span className="font-semibold text-slate-800">
                        {dest.currentVisitors.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Capacity Load</span>
                      <span className={`font-semibold ${dest.utilizationRate >= 85 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {dest.utilizationRate}%
                      </span>
                    </div>
                  </div>

                  {dest.festivalImpact && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      <strong>Surge:</strong> {dest.festivalImpact}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>{dest.weather.temp}°C · {dest.weather.condition}</span>
                    <span className="text-indigo-600 font-sans cursor-pointer hover:underline flex items-center gap-0.5"
                      onClick={() => onSelectDestination && onSelectDestination(dest)}
                    >
                      Inspect <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
