import { useEffect, useRef, useState } from 'react';
import { BrainwaveBands, BiometricMetrics } from '../types';
import { Radio, Eye, EyeOff, Activity } from 'lucide-react';

interface OscilloscopeProps {
  bands: BrainwaveBands;
  metrics: BiometricMetrics;
}

export default function Oscilloscope({ bands, metrics }: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCompositeOnly, setShowCompositeOnly] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Compute active band on the React side too for legend styling
  const activeBandKey = (() => {
    const keys = ['epsilon', 'delta', 'theta', 'alpha', 'beta', 'gamma', 'lambda'] as const;
    let maxVal = -1;
    let maxKey: 'epsilon' | 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'lambda' = 'delta';
    keys.forEach((k) => {
      if (bands[k] > maxVal) {
        maxVal = bands[k];
        maxKey = k;
      }
    });
    return maxKey;
  })() as 'epsilon' | 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'lambda';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas dimensions
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        if (canvas && canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = 140;
        }
      });
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 140;
    }

    let phase = 0;

    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw horizontal baselines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      phase += 0.08; // speed of horizontal scroll

      // Frequencies mapping with the new Epsilon and Lambda waves fully integrated
      const waves = [
        { key: 'epsilon', name: 'Epsilon', value: bands.epsilon, freq: 0.04, amp: 24, color: 'rgba(148, 163, 184, 0.25)', activeColor: 'rgba(148, 163, 184, 0.95)' }, // Ultra-slow carrier
        { key: 'delta', name: 'Delta', value: bands.delta, freq: 0.12, amp: 22, color: 'rgba(239, 68, 68, 0.25)', activeColor: 'rgba(239, 68, 68, 0.95)' },      // Deep rest
        { key: 'theta', name: 'Theta', value: bands.theta, freq: 0.28, amp: 18, color: 'rgba(249, 115, 22, 0.25)', activeColor: 'rgba(249, 115, 22, 0.95)' },    // Flow / Intuition
        { key: 'alpha', name: 'Alpha', value: bands.alpha, freq: 0.60, amp: 16, color: 'rgba(16, 185, 129, 0.25)', activeColor: 'rgba(16, 185, 129, 0.95)' },   // Alert calm
        { key: 'beta', name: 'Beta', value: bands.beta, freq: 1.30, amp: 10, color: 'rgba(59, 130, 246, 0.25)', activeColor: 'rgba(59, 130, 246, 0.95)' },      // Active cognitive
        { key: 'gamma', name: 'Gamma', value: bands.gamma, freq: 2.50, amp: 6, color: 'rgba(168, 85, 247, 0.25)', activeColor: 'rgba(168, 85, 247, 0.95)' },     // Peak synthesis
        { key: 'lambda', name: 'Lambda', value: bands.lambda, freq: 4.80, amp: 4, color: 'rgba(236, 72, 153, 0.25)', activeColor: 'rgba(236, 72, 153, 0.95)' },   // High-speed mystical
      ];

      // Draw Individual Wave channels unless Composite Only is active
      if (!showCompositeOnly) {
        waves.forEach((wave) => {
          // Absolute amplitude proportional to its relative percentage representation
          const waveAmpFraction = wave.value / 100;
          if (waveAmpFraction < 0.02) return;

          const isActive = wave.key === activeBandKey;

          ctx.beginPath();
          if (isActive) {
            // Pulse width & soft outer bloom glow
            ctx.strokeStyle = wave.activeColor;
            ctx.lineWidth = 2.2 + Math.sin(phase * 4) * 0.6; // beautiful structural pulse thickening
            ctx.shadowColor = wave.activeColor;
            ctx.shadowBlur = 8 + Math.sin(phase * 4) * 5;
          } else {
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
          }

          for (let x = 0; x < width; x++) {
            const progress = x / width;
            // Fade waves near edges for clean containment
            const fade = Math.sin(progress * Math.PI);
            
            let y;
            if (isActive) {
              const pulseAmpMultiplier = 1.0 + Math.sin(phase * 2.5) * 0.12; // gentle bounce to active line amplitude
              y = centerY + Math.sin(x * 0.04 * wave.freq + phase) * wave.amp * waveAmpFraction * 2.5 * pulseAmpMultiplier * fade;
            } else {
              y = centerY + Math.sin(x * 0.04 * wave.freq + phase) * wave.amp * waveAmpFraction * 2.5 * fade;
            }
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // stop propagation
        });
      }

      // Draw the "Cognitive Laser Beam" (Composite super-posed wave)
      ctx.beginPath();
      // Color shifts from magenta (evolved mind) to violet (meditation) to cyan (attention) to crimson (chaos)
      const isEvolved = bands.epsilon > 40 && bands.lambda > 10 && bands.beta < 10;
      let beamColor = 'rgba(6, 182, 212, 0.85)'; // cyan default
      let glowColor = 'rgba(6, 182, 212, 0.3)';

      if (isEvolved) {
        beamColor = 'rgba(236, 72, 153, 0.95)'; // pink / magenta for evolved mind
        glowColor = 'rgba(236, 72, 153, 0.55)';
      } else if (metrics.chaos > 65) {
        beamColor = 'rgba(239, 68, 68, 0.9)'; // red for high chaos
        glowColor = 'rgba(239, 68, 68, 0.4)';
      } else if (metrics.meditation > 65) {
        beamColor = 'rgba(168, 85, 247, 0.9)'; // deep purple stillness
        glowColor = 'rgba(168, 85, 247, 0.4)';
      } else if (metrics.attention > 65) {
        beamColor = 'rgba(34, 211, 238, 0.95)'; // bright electric cyan
        glowColor = 'rgba(34, 211, 238, 0.5)';
      }

      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;

      for (let x = 0; x < width; x++) {
        const progress = x / width;
        const fade = Math.sin(progress * Math.PI);
        
        // Sum the waves mathematically
        let deltaY = 0;
        waves.forEach((wave) => {
          const waveAmpFraction = wave.value / 100;
          deltaY += Math.sin(x * 0.04 * wave.freq + phase) * wave.amp * waveAmpFraction * 2.2;
        });

        // Add extreme vibrating micro-bruits if Chaos is highly loaded
        if (metrics.chaos > 60) {
          const noiseLevel = (metrics.chaos - 60) * 0.15;
          deltaY += (Math.random() - 0.5) * noiseLevel * 5;
        }

        const y = centerY + deltaY * fade;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadows to preserve speed
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bands, metrics, showCompositeOnly, activeBandKey]);

  return (
    <div className="flex flex-col bg-[#0c0e12] border border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium font-display">
          <Activity className="h-3.5 w-3.5 text-cyan-400 rotate-12" />
          Neural Oscilloscope Telemetry
        </div>
        
        <button
          onClick={() => setShowCompositeOnly(!showCompositeOnly)}
          className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-400 border border-slate-800 bg-[#050608]/90 px-2 py-0.5 rounded transition-all cursor-pointer"
        >
          {showCompositeOnly ? (
            <>
              <Eye className="h-3 w-3" />
              Show Bands
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" />
              Composite Only
            </>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-[140px] flex items-center justify-center relative bg-[#050608]/90 rounded overflow-hidden border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Absolute coordinates tags */}
        <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-400 uppercase tracking-tight flex items-center gap-1.5 pointer-events-none">
          <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
          Raw telemetry feeds (μV / time)
        </div>

        {/* Dynamic Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[8px] sm:text-[9px] font-mono text-slate-400 pointer-events-none max-w-full truncate px-1 rounded bg-black/30 backdrop-blur-xs py-0.5 border border-slate-900/40">
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'epsilon' && !showCompositeOnly ? 'text-slate-200 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-slate-400 ${activeBandKey === 'epsilon' && !showCompositeOnly ? 'animate-ping' : ''}`} /> ε (Epsilon)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'delta' && !showCompositeOnly ? 'text-red-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${activeBandKey === 'delta' && !showCompositeOnly ? 'animate-ping' : ''}`} /> Δ (Delta)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'theta' && !showCompositeOnly ? 'text-orange-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-orange-500 ${activeBandKey === 'theta' && !showCompositeOnly ? 'animate-ping' : ''}`} /> θ (Theta)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'alpha' && !showCompositeOnly ? 'text-emerald-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${activeBandKey === 'alpha' && !showCompositeOnly ? 'animate-ping' : ''}`} /> α (Alpha)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'beta' && !showCompositeOnly ? 'text-blue-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 ${activeBandKey === 'beta' && !showCompositeOnly ? 'animate-ping' : ''}`} /> β (Beta)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'gamma' && !showCompositeOnly ? 'text-violet-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-purple-500 ${activeBandKey === 'gamma' && !showCompositeOnly ? 'animate-ping' : ''}`} /> γ (Gamma)
          </span>
          <span className={`inline-flex items-center gap-1 transition-all ${activeBandKey === 'lambda' && !showCompositeOnly ? 'text-pink-400 font-bold scale-105 saturate-150' : 'opacity-70'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${activeBandKey === 'lambda' && !showCompositeOnly ? 'animate-ping' : ''}`} /> λ (Lambda)
          </span>
        </div>
      </div>
    </div>
  );
}
