import React, { useState } from 'react';
import { ROUTE_OPTIONS_DATA } from '../../data/mockTourismData';
import { RouteOption } from '../../types/tourism';
import {
  Compass,
  Train,
  Bus,
  Car,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Languages,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Sparkles,
  Info
} from 'lucide-react';

export const LocalTripView: React.FC = () => {
  const corridors = Object.keys(ROUTE_OPTIONS_DATA);
  const [selectedCorridor, setSelectedCorridor] = useState<string>(corridors[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Tamil' | 'Hindi' | 'Malayalam'>('English');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('rt-1');

  const routes = ROUTE_OPTIONS_DATA[selectedCorridor] || [];
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Multilingual assistant simulated responses
  const regionalPhrases: Record<string, { query: string; answer: string; advisory: string }> = {
    English: {
      query: 'What is the fastest and most reliable way from Madurai to Rameswaram today?',
      answer: 'The Vande Bharat / Express Train corridor takes 2h 45m (₹480). It provides 96% reliability with pristine scenic views over the Pamban Sea Bridge.',
      advisory: 'Caution: Trains are observing a temporary 30km/h safety limit across Pamban channel during high tide.',
    },
    Tamil: {
      query: 'மதுரையிலிருந்து ராமேஸ்வரம் செல்ல இன்று எது சிறந்த வழி?',
      answer: 'வந்தே பாரத் / விரைவு ரயில் 2 மணி 45 நிமிடங்களில் சென்றடையும் (கட்டணம் ₹480). பாம்பன் கடல் பாலம் வழியே 96% நம்பகத்தன்மை கொண்டது.',
      advisory: 'எச்சரிக்கை: பாம்பன் பாலத்தில் அதிக அலைகள் காரணமாக ரயில்கள் 30 கி.மீ வேக வரம்பில் இயக்கப்படுகின்றன.',
    },
    Hindi: {
      query: 'मदुरै से रामेश्वरम जाने के लिए आज सबसे तेज़ और सुरक्षित साधन कौन सा है?',
      answer: 'वंदे भारत / एक्सप्रेस ट्रेन सबसे उपयुक्त है (समय 2 घंटे 45 मिनट, किराया ₹480)। पंबन समुद्री पुल पर 96% विश्वसनीयता मिलती है।',
      advisory: 'सावधानी: समुद्र में उच्च ज्वार के कारण पंबन पुल पर ट्रेनें 30 किमी/घंटा की नियंत्रित गति से चल रही हैं।',
    },
    Malayalam: {
      query: 'മധുരയിൽ നിന്ന് രാമേശ്വരത്തേക്ക് പോകാൻ ഏറ്റവും മികച്ച മാർഗ്ഗം ഏതാണ്?',
      answer: 'വന്ദേ ഭാരത് / എക്സ്പ്രസ് ട്രെയിൻ സർവീസ് 2 മണിക്കൂർ 45 മിനിറ്റ് കൊണ്ട് എത്തും (ചെലവ് ₹480). 96% കൃത്യതയോടെ പാമ്പൻ പാലത്തിലൂടെ യാത്ര ചെയ്യാം.',
      advisory: 'ജാഗ്രത: ഉയർന്ന വേലിയേറ്റം കാരണം പാമ്പൻ പാലത്തിൽ ട്രെയിനുകൾ 30 കി.മീ/മണിക്കൂർ വേഗതയിലാണ് സഞ്ചരിക്കുന്നത്.',
    },
  };

  const getModeIcon = (mode: RouteOption['mode']) => {
    switch (mode) {
      case 'Vande Bharat / Express Train':
        return <Train className="w-4 h-4 text-indigo-600" />;
      case 'State Highway Volvo Bus':
        return <Bus className="w-4 h-4 text-emerald-600" />;
      case 'Flight + Private Cab':
      case 'Self-Drive / Rental':
        return <Car className="w-4 h-4 text-cyan-600" />;
      default:
        return <Compass className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              LOCALTRIP AI ENGINE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">Multimodal Transit & Verified Corridors</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Local Travel Intelligence & Route Optimizer
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Compare journey duration, travel cost, carbon load, and real-time transit disruption alerts.
          </p>
        </div>

        {/* Corridor Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto max-w-full">
          {corridors.map((corr) => (
            <button
              key={corr}
              onClick={() => {
                setSelectedCorridor(corr);
                const rts = ROUTE_OPTIONS_DATA[corr];
                if (rts && rts.length > 0) setSelectedRouteId(rts[0].id);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCorridor === corr
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {corr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Cards Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Available Transit Modes for: <span className="text-indigo-600">{selectedCorridor}</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {routes.length} options evaluated
            </span>
          </div>

          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = activeRoute.id === route.id;
              const hours = Math.floor(route.durationMinutes / 60);
              const mins = route.durationMinutes % 60;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-indigo-600 ring-1 ring-indigo-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        {getModeIcon(route.mode)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{route.title}</h4>
                          {route.isVerified ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Official IRCTC/KSRTC
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Estimated
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {route.departureFrequency}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono tabular-nums">
                      <div className="text-sm font-bold text-slate-900">
                        ₹{route.estimatedCostINR.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-400">per traveler</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hours > 0 ? `${hours}h ` : ''}{mins}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono tabular-nums">
                      <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{route.carbonKg} kg CO₂</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono tabular-nums">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{route.reliabilityScore}% On-Time</span>
                    </div>
                  </div>

                  {route.disruptions.length > 0 && (
                    <div className="mt-2.5 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Advisory:</strong> {route.disruptions[0]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Regional Language AI Assistant & Route Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Multilingual Regional AI Assistant Card */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-cyan-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Regional Language Transit Assistant
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded text-[10px]">
                {(['English', 'Tamil', 'Hindi', 'Malayalam'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] text-cyan-400 font-mono block mb-1">
                  Traveler Query ({selectedLanguage}):
                </span>
                <p className="text-slate-200 italic font-sans leading-relaxed">
                  "{regionalPhrases[selectedLanguage]?.query}"
                </p>
              </div>

              <div className="bg-indigo-950/60 p-3 rounded-lg border border-indigo-700/60 text-slate-200">
                <span className="text-[10px] text-indigo-300 font-mono block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  LocalTrip AI Verified Answer:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {regionalPhrases[selectedLanguage]?.answer}
                </p>
              </div>

              <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-[11px] text-amber-200 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{regionalPhrases[selectedLanguage]?.advisory}</span>
              </div>
            </div>
          </div>

          {/* Attraction Verification & Timing Panel */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900">Key Attraction Timings & Status</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Official State DTO
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-800">Pamban Sea Bridge Viewpoint</div>
                  <div className="text-[10px] text-slate-500">Open 24/7 · Best sunset 17:30 - 18:45</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-800">Ramanathaswamy Temple Darshan</div>
                  <div className="text-[10px] text-slate-500">05:00 - 13:00 & 15:00 - 21:00</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-800">Dhanushkodi Ghost Town & Beach</div>
                  <div className="text-[10px] text-slate-500">Permits required past 17:00 (Coast Guard checkpoint)</div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                  Restricted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
