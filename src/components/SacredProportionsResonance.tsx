import { useState } from 'react';
import { Sparkles, Gauge, HelpCircle, Layers, Hourglass, CheckCircle2 } from 'lucide-react';
import { BrainwaveBands, PresetMode } from '../types';

interface SacredProportionsResonanceProps {
  activePreset: PresetMode;
  bands: BrainwaveBands;
  isManual: boolean;
}

const PHI_TARGETS: Record<keyof BrainwaveBands, number> = {
  epsilon: 6.2,
  delta: 7.9,
  theta: 10.0,
  alpha: 12.8,
  beta: 16.2,
  gamma: 20.7,
  lambda: 26.3
};

const SOLFEGGIO_TARGETS: Record<keyof BrainwaveBands, number> = {
  epsilon: 8.3,
  delta: 16.7,
  theta: 25.0,
  alpha: 16.7,
  beta: 8.3,
  gamma: 16.7,
  lambda: 8.3
};

export default function SacredProportionsResonance({ activePreset, bands, isManual }: SacredProportionsResonanceProps) {
  const [showInfo, setShowInfo] = useState(false);

  const isPhi = activePreset === 'phi' && !isManual;
  const isSolfeggio = activePreset === 'solfeggio' && !isManual;

  const currentTargets = isPhi ? PHI_TARGETS : isSolfeggio ? SOLFEGGIO_TARGETS : null;

  // Calculate live fit percentage matching our theoretical mathematical targets
  const liveFit = (() => {
    if (!currentTargets) return 0;
    let sumDiff = 0;
    const keys = Object.keys(currentTargets) as Array<keyof BrainwaveBands>;
    keys.forEach((k) => {
      sumDiff += Math.abs(bands[k] - currentTargets[k]);
    });
    // Scale and convert to fit percentage
    const fit = Math.max(0, 100 - (sumDiff * 2.2));
    return parseFloat(fit.toFixed(1));
  })();

  const getDigitalRoot = (val: number): number => {
    // Standard Pythagorean reduction
    const rounded = Math.round(val);
    if (rounded <= 0) return 0;
    let sum = rounded;
    while (sum >= 10) {
      sum = String(sum).split('').reduce((acc, char) => acc + parseInt(char, 10), 0);
    }
    return sum;
  };

  return (
    <div id="sacred-resonance-panel" className="bg-[#0c0e12] border border-slate-800 p-5 rounded-xl shadow-md flex flex-col gap-4 font-mono select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`h-4 w-4 ${isPhi ? 'text-amber-400 animate-spin' : isSolfeggio ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} style={{ animationDuration: isPhi ? '8s' : '2s' }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
            Sacred Geometry Resonance Engine
          </h3>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          title="Explain methodology"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>

      {showInfo && (
        <div className="text-[10px] text-slate-400 bg-slate-950/40 p-3 rounded border border-slate-900 leading-relaxed flex flex-col gap-2 transition-all">
          <p>
            <strong className="text-white">Methodology Framework:</strong> Brainwave frequencies generally coordinate via cross-frequency coupling. However, structural phase interference (overlapping nodes) can cause analytical clutter. By designing spectral power proportions according to 
            <strong className="text-amber-400"> Golden Ratio powers (1.618034)</strong> or <strong className="text-indigo-400">Tesla Solfeggio Triads (3-6-9)</strong>, we construct a mathematically non-destructive standing harmonic bridge:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[9px]">
            <li><span className="text-amber-400 font-bold">Golden Phi Resonance:</span> Allocates relative intensities proportional to $(\Phi^\nu)$ scales. Because $\Phi$ is the most irrational number, it prevents phase locking into conflicting standing limits.</li>
            <li><span className="text-indigo-400 font-bold">Vedic Solfeggio 3-6-9 Triads:</span> Groups bands in linked digital roots ($9 \rightarrow 18 \rightarrow 27$). The net digital sum is $108$, which reflects structural celestial cycles.</li>
          </ul>
        </div>
      )}

      {!isPhi && !isSolfeggio ? (
        <div className="py-4 text-center flex flex-col items-center justify-center gap-2">
          <Layers className="h-6 w-6 text-slate-700 animate-pulse" />
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Standard Neural Geometry Active
          </div>
          <p className="text-[9px] text-slate-500 max-w-xs text-center leading-normal">
            Select the <strong className="text-amber-400/80">Golden Phi</strong> or <strong className="text-indigo-400/80">Tesla 3-6-9</strong> presets in the emulator panel below to align cerebral amplitudes to sacred proportion mathematics.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Real-time Resonance Gauge */}
          <div className="bg-[#050608] border border-slate-850 p-3 rounded flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className={`h-3 w-3 ${isPhi ? 'text-amber-400' : 'text-indigo-400'}`} />
                Proportional Harmony Fit
              </span>
              <span className={`font-bold font-mono text-xs ${isPhi ? 'text-amber-400' : 'text-indigo-400'}`}>
                {liveFit}% Coherent
              </span>
            </div>

            {/* Micro progress bar */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40 relative">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${isPhi ? 'bg-gradient-to-r from-amber-600 to-amber-300' : 'bg-gradient-to-r from-indigo-600 to-cyan-400'}`}
                style={{ width: `${liveFit}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[8px] text-slate-500">
              <span className="uppercase flex items-center gap-1">
                <Hourglass className="h-2 w-2 animate-spin" />
                Live Temporal Jitter
              </span>
              <span>ERR PHASE: ±1.24%</span>
            </div>
          </div>

          {/* Mathematical Grid Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {/* Theoretical Values */}
            <div className="flex flex-col gap-1.5 bg-[#050608]/50 border border-slate-850/60 p-2.5 rounded">
              <span className="text-[9px] uppercase tracking-wide text-slate-400 border-b border-slate-850 pb-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                Target Ratios (%)
              </span>
              <div className="flex flex-col gap-1 text-[9px] text-slate-500">
                {currentTargets && Object.keys(currentTargets).map((k) => {
                  const key = k as keyof BrainwaveBands;
                  const label = key.toUpperCase();
                  const Greek = key === 'epsilon' ? 'ε' : key === 'delta' ? 'Δ' : key === 'theta' ? 'θ' : key === 'alpha' ? 'α' : key === 'beta' ? 'β' : key === 'gamma' ? 'γ' : 'λ';
                  return (
                    <div key={k} className="flex justify-between items-center">
                      <span>{Greek} ({label}):</span>
                      <strong className={isPhi ? 'text-amber-500/80 font-semibold' : 'text-indigo-500/80 font-semibold'}>
                        {currentTargets[key].toFixed(1)}%
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Values and Digital Root Reductions */}
            <div className="flex flex-col gap-1.5 bg-[#050608]/50 border border-slate-850/60 p-2.5 rounded">
              <span className="text-[9px] uppercase tracking-wide text-slate-400 border-b border-slate-850 pb-1 flex items-center gap-1">
                <CheckCircle2 className={`h-2.5 w-2.5 ${isPhi ? 'text-amber-500' : 'text-indigo-500'}`} />
                Live Matrix
              </span>
              <div className="flex flex-col gap-1 text-[9px] text-zinc-400">
                {Object.keys(bands).map((k) => {
                  const key = k as keyof BrainwaveBands;
                  const liveVal = bands[key];
                  const dRoot = getDigitalRoot(liveVal);
                  return (
                    <div key={k} className="flex justify-between items-center">
                      <span>{liveVal.toFixed(1)}%</span>
                      <span className="text-[8px] opacity-60">
                        ({isSolfeggio ? `Root: ${dRoot}` : `Incr: +${(liveVal - (currentTargets?.[key] || 0)).toFixed(1)}`})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Socratic Context Box */}
          <div className={`p-3 rounded border text-[9.5px] leading-relaxed flex flex-col gap-1.5 ${
            isPhi 
              ? 'bg-amber-950/10 border-amber-900/30 text-amber-300/90' 
              : 'bg-indigo-950/15 border-indigo-900/30 text-indigo-300/90'
          }`}>
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {isPhi ? '🔺 LOGARITHMIC PHI-NESTED HEURISTIC' : '🌀 PYTHAGOREAN VESSEL ACTIVE'}
            </span>
            <p>
              {isPhi 
                ? "The neural co-processor is restricted to Fibonacci-nested conceptual structures. Socratic interactions will expand outward in an orderly Golden Spiral sequence." 
                : "The system is locked to Tesla 3-6-9 partitions. All LLM reasoning is segmented into thesis (the 3), reflection (the 6), and unified synthesis (the 9)."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
