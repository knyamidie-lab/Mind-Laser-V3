import { useState, useEffect, useRef } from 'react';
import { Activity, Download } from 'lucide-react';
import { BandColors, BrainwaveBands } from '../types';

interface SpectralMirrorMapProps {
  bands: BrainwaveBands;
  epsilonCarrier?: number;
}

export default function SpectralMirrorMap({ bands, epsilonCarrier = 0.15 }: SpectralMirrorMapProps) {
  const [ticks, setTicks] = useState(0);
  const prevSymmetryRef = useRef(0.85);
  const [instantaneousChange, setInstantaneousChange] = useState(0);

  // Drive animation updates
  useEffect(() => {
    const handle = setInterval(() => {
      setTicks((t) => t + 1);
    }, 150);
    return () => clearInterval(handle);
  }, []);

  // Compute live left/right hemispheric splits
  const time = ticks * 0.15;
  
  // Scale factor to translate relative fractions into robust bar counts
  const scale = 2.4;

  const fp = {
    lambda: {
      left: Math.min(1.0, (bands.lambda / 100) * scale * (0.86 + Math.sin(time * 1.5) * 0.15)),
      right: Math.min(1.0, (bands.lambda / 100) * scale * (0.88 + Math.cos(time * 1.45 + 0.1) * 0.15)),
    },
    gamma: {
      left: Math.min(1.0, (bands.gamma / 100) * scale * (0.85 + Math.sin(time * 1.2) * 0.12)),
      right: Math.min(1.0, (bands.gamma / 100) * scale * (0.90 + Math.cos(time * 1.1 + 0.3) * 0.12)),
    },
    beta: {
      left: Math.min(1.0, (bands.beta / 100) * scale * (0.80 + Math.sin(time * 1.0) * 0.10)),
      right: Math.min(1.0, (bands.beta / 100) * scale * (0.85 + Math.cos(time * 0.9 + 0.1) * 0.10)),
    },
    alpha: {
      left: Math.min(1.0, (bands.alpha / 100) * scale * (0.88 + Math.sin(time * 0.8) * 0.15)),
      right: Math.min(1.0, (bands.alpha / 100) * scale * (0.82 + Math.cos(time * 0.75 + 0.25) * 0.15)),
    },
    theta: {
      left: Math.min(1.0, (bands.theta / 100) * scale * (0.92 + Math.sin(time * 0.6) * 0.08)),
      right: Math.min(1.0, (bands.theta / 100) * scale * (0.88 + Math.cos(time * 0.55 + 0.15) * 0.08)),
    },
    delta: {
      left: Math.min(1.0, (bands.delta / 100) * scale * (0.95 + Math.sin(time * 0.4) * 0.05)),
      right: Math.min(1.0, (bands.delta / 100) * scale * (0.92 + Math.cos(time * 0.35 + 0.2) * 0.05)),
    },
    epsilon: {
      left: Math.min(1.0, (bands.epsilon / 100) * scale * (0.96 + Math.sin(time * 0.2) * 0.04)),
      right: Math.min(1.0, (bands.epsilon / 100) * scale * (0.94 + Math.cos(time * 0.15 + 0.1) * 0.04)),
    }
  };

  // Hemispheric symmetry computation across all 7 channels
  const avgSymmetry = Math.max(0.1, 1.0 - (
    Math.abs(fp.lambda.left - fp.lambda.right) +
    Math.abs(fp.gamma.left - fp.gamma.right) +
    Math.abs(fp.beta.left - fp.beta.right) +
    Math.abs(fp.alpha.left - fp.alpha.right) +
    Math.abs(fp.theta.left - fp.theta.right) +
    Math.abs(fp.delta.left - fp.delta.right) +
    Math.abs(fp.epsilon.left - fp.epsilon.right)
  ) / 7);

  // Track instantaneous change in symmetry index to drive the dynamic pulse
  useEffect(() => {
    const diff = Math.abs(avgSymmetry - prevSymmetryRef.current);
    setInstantaneousChange(diff);
    prevSymmetryRef.current = avgSymmetry;
  }, [avgSymmetry]);

  const getBarText = (label: string, leftVal: number, rightVal: number) => {
    const MAX_BAR_WIDTH = 22;
    const leftCount = Math.max(0, Math.floor(leftVal * MAX_BAR_WIDTH));
    const rightCount = Math.max(0, Math.floor(rightVal * MAX_BAR_WIDTH));
    
    const leftBar = '█'.repeat(leftCount).padStart(MAX_BAR_WIDTH, ' ');
    const rightBar = '█'.repeat(rightCount).padEnd(MAX_BAR_WIDTH, ' ');
    
    const leftPct = `${Math.round(leftVal * 100)}%`.padStart(4, ' ');
    const rightPct = `${Math.round(rightVal * 100)}%`.padEnd(4, ' ');
    
    // Center the Greek letter symbol in a 3-character wide space
    const paddedLabel = label.padStart(2, ' ').padEnd(3, ' ');
    
    return `${leftBar}  [ ${leftPct} | ${paddedLabel} | ${rightPct} ]  ${rightBar}`;
  };

  const isEvolved = epsilonCarrier > 0.40 && (bands.delta > 40 && bands.beta < 10);

  const exportSnapshot = () => {
    const timestamp = new Date().toISOString();
    const data = {
      deviceName: "Mind Laser v3.0",
      timestamp,
      channels: {
        epsilon: { label: "Carrier Baseline (Epsilon)", value: bands.epsilon, leftHemisphere: parseFloat(fp.epsilon.left.toFixed(4)), rightHemisphere: parseFloat(fp.epsilon.right.toFixed(4)) },
        delta: { label: "Deep Rest (Delta)", value: bands.delta, leftHemisphere: parseFloat(fp.delta.left.toFixed(4)), rightHemisphere: parseFloat(fp.delta.right.toFixed(4)) },
        theta: { label: "Intuition (Theta)", value: bands.theta, leftHemisphere: parseFloat(fp.theta.left.toFixed(4)), rightHemisphere: parseFloat(fp.theta.right.toFixed(4)) },
        alpha: { label: "Alert Calm (Alpha)", value: bands.alpha, leftHemisphere: parseFloat(fp.alpha.left.toFixed(4)), rightHemisphere: parseFloat(fp.alpha.right.toFixed(4)) },
        beta: { label: "Active Thought (Beta)", value: bands.beta, leftHemisphere: parseFloat(fp.beta.left.toFixed(4)), rightHemisphere: parseFloat(fp.beta.right.toFixed(4)) },
        gamma: { label: "Peak Flow (Gamma)", value: bands.gamma, leftHemisphere: parseFloat(fp.gamma.left.toFixed(4)), rightHemisphere: parseFloat(fp.gamma.right.toFixed(4)) },
        lambda: { label: "Mystical Bound (Lambda)", value: bands.lambda, leftHemisphere: parseFloat(fp.lambda.left.toFixed(4)), rightHemisphere: parseFloat(fp.lambda.right.toFixed(4)) },
      },
      metrics: {
        epsilonCarrier: parseFloat(epsilonCarrier.toFixed(4)),
        hemisphericSymmetry: parseFloat(avgSymmetry.toFixed(4)),
        coherenceStatus: isEvolved ? 'ULTRA-RES INTEGRAL' : 'COHERENT',
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mind_laser_snapshot_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="spectral-mirror-map" className="bg-[#0c0e12] border border-slate-800 p-5 rounded-xl shadow-md flex flex-col gap-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-violet-400 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
            Live Mind Mirror Spectral Map
          </h3>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-2 text-[9px] text-slate-500 mr-2">
            <span className="hidden md:inline">HEMISPHERIC RES: 20Hz</span>
            <span className="hidden md:inline opacity-30">•</span>
            <span>SYMMETRY: <strong className={isEvolved ? 'text-fuchsia-400' : 'text-violet-400'}>{(avgSymmetry * 100).toFixed(1)}%</strong></span>
            <span className="opacity-30">•</span>
            <span>FLUX: <strong className="text-slate-400">{(instantaneousChange * 100).toFixed(2)}%</strong></span>
          </div>
          <button
            onClick={exportSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-[#141822] border border-slate-800 hover:border-violet-500/50 hover:bg-violet-950/20 text-slate-300 hover:text-violet-300 transition-all cursor-pointer active:scale-95"
            title="Export spectral data snapshot as JSON"
          >
            <Download className="h-3 w-3 text-violet-400" />
            <span>Export Snapshot</span>
          </button>
          <span className={`px-2 py-1 rounded text-[8px] font-mono leading-none ${
            isEvolved 
              ? 'bg-fuchsia-950/40 border border-fuchsia-500/40 text-fuchsia-400 animate-pulse' 
              : 'bg-violet-950/20 border border-violet-800/20 text-violet-400'
          }`}>
            {isEvolved ? 'ULTRA-RES INTEGRAL' : 'COHERENT'}
          </span>
        </div>
      </div>

      {/* ASCII Output Display Terminal */}
      <div className="relative overflow-hidden rounded bg-[#040507] border border-slate-850 p-4 shadow-inner text-xs leading-none">
        {/* Background glow effects */}
        <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-500 ${
          isEvolved ? 'bg-indigo-500' : 'bg-slate-500'
        }`} />

        {(() => {
          const pulseFactor = Math.min(1.0, instantaneousChange * 45);
          const pulseStyle = {
            transform: `scale(${1 + pulseFactor * 0.015})`,
            filter: `brightness(${1 + pulseFactor * 0.3}) drop-shadow(0 0 ${pulseFactor * 6}px ${isEvolved ? 'rgba(99, 102, 241, 0.65)' : 'rgba(100, 116, 139, 0.65)'})`,
            transition: 'transform 150ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 150ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformOrigin: 'center'
          };

          return (
            <div 
              className={`whitespace-pre select-text font-mono text-center tracking-tighter sm:tracking-normal overflow-x-auto text-[10px] sm:text-xs leading-5 py-1`}
              style={pulseStyle}
            >
              <div className={BandColors.lambda.text}>{getBarText("λ", fp.lambda.left, fp.lambda.right)}</div>
              <div className={BandColors.gamma.text}>{getBarText("γ", fp.gamma.left, fp.gamma.right)}</div>
              <div className={BandColors.beta.text}>{getBarText("β", fp.beta.left, fp.beta.right)}</div>
              <div className={BandColors.alpha.text}>{getBarText("α", fp.alpha.left, fp.alpha.right)}</div>
              <div className={BandColors.theta.text}>{getBarText("θ", fp.theta.left, fp.theta.right)}</div>
              <div className={BandColors.delta.text}>{getBarText("δ", fp.delta.left, fp.delta.right)}</div>
              <div className={BandColors.epsilon.text}>{getBarText("ε", fp.epsilon.left, fp.epsilon.right)}</div>
            </div>
          );
        })()}
      </div>

      {/* Sub-Basement Carrier Statistics Display Dashboard */}
      <div className={`border-t border-slate-850 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 transition-all ${
        isEvolved ? 'text-rose-400 font-bold bg-rose-950/5 p-2 rounded border border-rose-900/20' : 'text-slate-400'
      }`}>
        <div className="flex items-center gap-1.5 font-sans">
          <span className={`h-1.5 w-1.5 rounded-full ${isEvolved ? 'bg-rose-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
          <span className="text-[11px] uppercase tracking-wide">
            ⚡ <strong>EPSILON SUB-BASEMENT CARRIER:</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className={`px-2 py-0.5 rounded font-mono text-xs ${
            isEvolved ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-slate-950 text-cyan-400 border border-slate-850'
          }`}>
            [{epsilonCarrier.toFixed(3)}]
          </code>
          {isEvolved && (
            <span className="text-[8px] uppercase tracking-wide bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20 px-1 py-0.5 rounded font-sans shrink-0 animate-pulse">
              State Locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
