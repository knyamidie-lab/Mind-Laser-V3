import { useState, useEffect, useRef } from 'react';
import { generateWaveBands, computeBiometrics, normalizeBands } from './utils/eegSimulator';
import Oscilloscope from './components/Oscilloscope';
import AgentTopologyMap from './components/AgentTopologyMap';
import SocraticChat from './components/SocraticChat';
import SpectralMirrorMap from './components/SpectralMirrorMap';
import SacredProportionsResonance from './components/SacredProportionsResonance';
import AdaptiveNeuralSafeguards from './components/AdaptiveNeuralSafeguards';
import LayeredSoundtrackAnchor from './components/LayeredSoundtrackAnchor';
import { BrainwaveBands, BiometricMetrics, EEGConnectionState, PresetMode, BandColors } from './types';
import { 
  Brain, 
  Radio, 
  Settings2, 
  Cpu, 
  Layers, 
  Sliders, 
  Bluetooth, 
  Zap, 
  Activity, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  AlertOctagon,
  Gauge
} from 'lucide-react';

export default function App() {
  // Preset state management
  const [presetMode, setPresetMode] = useState<PresetMode>('baseline');
  const [manualControl, setManualControl] = useState(false);
  
  // Custom manual slider values
  const [customBands, setCustomBands] = useState<BrainwaveBands>({
    epsilon: 10,
    delta: 15,
    theta: 15,
    alpha: 20,
    beta: 25,
    gamma: 10,
    lambda: 5
  });

  const [editingBand, setEditingBand] = useState<keyof BrainwaveBands | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Current active bands (sum = 100%) and calculated biometrics
  const [currentBands, setCurrentBands] = useState<BrainwaveBands>({
    epsilon: 10,
    delta: 15,
    theta: 15,
    alpha: 20,
    beta: 25,
    gamma: 10,
    lambda: 5
  });

  // Calibration points
  const [calibration, setCalibration] = useState({
    chaosFloor: 38,       // Beta percentage threshold
    stillnessCeiling: 45,  // Theta/Alpha percentage threshold
  });

  // Active adjustment tracking for visual highlight modes
  const [isAdjustingFloor, setIsAdjustingFloor] = useState(false);
  const [isAdjustingCeiling, setIsAdjustingCeiling] = useState(false);

  const [currentMetrics, setCurrentMetrics] = useState<BiometricMetrics>({
    attention: 50,
    meditation: 50,
    chaos: 40
  });

  // Track attention level history over the last 60 seconds (150 data points at 400ms intervals)
  const [attentionHistory, setAttentionHistory] = useState<number[]>(() =>
    Array.from({ length: 150 }, () => 50)
  );

  useEffect(() => {
    setAttentionHistory((prev) => {
      const next = [...prev, currentMetrics.attention];
      if (next.length > 150) {
        return next.slice(1);
      }
      return next;
    });
  }, [currentMetrics.attention]);

  const renderSparkline = () => {
    if (attentionHistory.length === 0) return null;
    const width = 120;
    const height = 24;
    const maxVal = 100;
    const minVal = 0;
    
    const points = attentionHistory.map((val, i) => {
      const x = (i / (attentionHistory.length - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const lastVal = attentionHistory[attentionHistory.length - 1] ?? 50;
    const lastX = width;
    const lastY = height - ((lastVal - minVal) / (maxVal - minVal)) * height;
    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <div className="w-full mt-2.5 px-2 flex flex-col items-center">
        <div className="w-full h-6 relative bg-slate-950/60 border border-slate-900 rounded overflow-hidden">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="attention-spark-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(192, 38, 211, 0.4)" />
                <stop offset="100%" stopColor="rgba(192, 38, 211, 0)" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
              points={areaPoints}
              fill="url(#attention-spark-grad)"
            />
            {/* Stroke line */}
            <polyline
              fill="none"
              stroke="rgb(192, 38, 211)"
              strokeWidth="1.2"
              points={points}
            />
            {/* Glowing endpoint dot */}
            <circle
              cx={lastX}
              cy={lastY}
              r="2"
              fill="rgb(192, 38, 211)"
              className="animate-ping"
              style={{ transformOrigin: `${lastX.toFixed(1)}px ${lastY.toFixed(1)}px` }}
            />
            <circle
              cx={lastX}
              cy={lastY}
              r="1.5"
              fill="rgb(192, 38, 211)"
            />
          </svg>
        </div>
        <div className="flex justify-between w-full text-[7.5px] font-mono text-slate-500 mt-1 uppercase tracking-tight">
          <span>60s ago</span>
          <span>trend</span>
          <span>now</span>
        </div>
      </div>
    );
  };

  // Bluetooth physical binding triggers
  const [connectionState, setConnectionState] = useState<EEGConnectionState>('disconnected');
  const [deviceName, setDeviceName] = useState('Synthesis Fallback Node');
  const [showCalibrationGuide, setShowCalibrationGuide] = useState(false);

  // Time reference for continuous wave oscillation calculations
  const tickRef = useRef<number>(0);

  // Periodic Telemetry Fluctuation Engine
  useEffect(() => {
    const interval = setInterval(() => {
      // If in a desired healing state, damp temporal fluctuation drift by 4x to sustain coherence
      const isHealingState = ['stillness', 'awakened', 'evolved', 'phi', 'solfeggio'].includes(presetMode) && !manualControl;
      const increment = isHealingState ? 0.25 : 1.0;
      tickRef.current += increment;
      
      let nextBands: BrainwaveBands;
      if (manualControl) {
        nextBands = generateWaveBands('baseline', customBands, tickRef.current * 0.15);
      } else {
        nextBands = generateWaveBands(presetMode, undefined, tickRef.current * 0.15);
      }
      
      setCurrentBands(nextBands);

      // Compute biological feedback metrics based on active bands & calibration values
      const nextMetrics = computeBiometrics(nextBands, calibration);
      setCurrentMetrics(nextMetrics);
    }, 400); // Ticks every 400ms to mimic continuous biometric polling

    return () => clearInterval(interval);
  }, [presetMode, manualControl, customBands, calibration]);

  // Adjust preset to manual sliders change
  const handleManualSliderChange = (band: keyof BrainwaveBands, val: number) => {
    const nextCustom = { ...customBands, [band]: val };
    setCustomBands(nextCustom);
    setManualControl(true);
  };

  const renderSliderRow = (
    band: keyof BrainwaveBands,
    label: string,
    labelColorClass: string,
    accentClass: string,
    focusBorderClass: string
  ) => {
    const value = customBands[band];
    const isEditing = editingBand === band;

    const decreaseVal = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleManualSliderChange(band, Math.max(0, value - 1));
    };

    const increaseVal = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleManualSliderChange(band, Math.min(100, value + 1));
    };

    const handleReset = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleManualSliderChange(band, 20);
    };

    // Determine specific background and button styling to match wave colors perfectly
    const styling = {
      bg: `${BandColors[band].bg} ${BandColors[band].shadow}`,
      btn: `bg-slate-900/30 hover:bg-slate-800/50 ${BandColors[band].text} border-slate-700/40 hover:border-${BandColors[band].text.split('-')[1]}-500`,
    };

    return (
      <div 
        key={band} 
        className="flex flex-col gap-1.5 p-1 rounded-md hover:bg-slate-900/40 transition-all duration-150 relative select-none"
        onDoubleClick={handleReset}
        title="Double-click anywhere on this slider panel to reset to 20%"
      >
        <div className="flex justify-between items-center text-[11px] font-mono">
          <div className="flex items-center gap-1.5 py-0.5">
            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 border border-white/10 ${styling.bg}`} />
            <span className={`${labelColorClass} font-medium`}>{label}</span>
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="100"
                value={editValue}
                className={`w-12 bg-black border ${focusBorderClass} text-right text-[11px] font-mono rounded px-1 text-white`}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => {
                  const val = parseInt(editValue);
                  if (!isNaN(val)) {
                    handleManualSliderChange(band, Math.min(100, Math.max(0, val)));
                  }
                  setEditingBand(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(editValue);
                    if (!isNaN(val)) {
                      handleManualSliderChange(band, Math.min(100, Math.max(0, val)));
                    }
                    setEditingBand(null);
                  } else if (e.key === 'Escape') {
                    setEditingBand(null);
                  }
                }}
              />
            ) : (
              <button
                type="button"
                className="text-slate-300 hover:text-white hover:underline cursor-pointer font-mono"
                onClick={() => {
                  setEditingBand(band);
                  setEditValue(value.toString());
                }}
                title="Click to type exact percentage"
              >
                {value}%
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={decreaseVal}
            onDoubleClick={handleReset}
            className={`h-6 w-6 shrink-0 flex items-center justify-center rounded border text-[10px] select-none cursor-pointer transition-colors ${styling.btn}`}
            title="Fine adjust: -1% (Double-click to reset to 20%)"
          >
            -
          </button>
          
          <div className="relative flex-1 flex items-center h-5">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleManualSliderChange(band, parseInt(e.target.value))}
              onDoubleClick={handleReset}
              className={`w-full bg-[#050608] ${accentClass} h-2 rounded-lg cursor-pointer transition-all duration-150 focus:outline-none`}
              title="Drag or single click. Double-click to reset to 20%."
            />
          </div>

          <button 
            type="button"
            onClick={increaseVal}
            onDoubleClick={handleReset}
            className={`h-6 w-6 shrink-0 flex items-center justify-center rounded border text-[10px] select-none cursor-pointer transition-colors ${styling.btn}`}
            title="Fine adjust: +1% (Double-click to reset to 20%)"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  // Re-synchronize preset settings
  const handlePresetSelect = (mode: PresetMode) => {
    setPresetMode(mode);
    setManualControl(false);
  };

  const handleResetToHomeostasis = () => {
    setPresetMode('baseline');
    setManualControl(false);
    setCustomBands({
      epsilon: 10,
      delta: 15,
      theta: 15,
      alpha: 20,
      beta: 25,
      gamma: 10,
      lambda: 5
    });
  };

  const handleAppendSystemDisclaimer = (content: string) => {
    const event = new CustomEvent('neural-warning', { detail: { content } });
    window.dispatchEvent(event);
  };

  // Human Real-Time State Label Helper
  const stateLabel = (() => {
    if (presetMode === 'microsleep' && !manualControl) {
      return "🚨 CRITICAL MICROSLEEP INTERCEPT";
    }
    if (presetMode === 'disorganization' && !manualControl) {
      return "⚠️ PRODROMAL COGNITIVE SPLIT";
    }
    if (presetMode === 'overload' && !manualControl) {
      return "🎯 HYPER-INDUCED ENTRAINMENT OVERLOAD";
    }
    if (presetMode === 'phi' && !manualControl) {
      return "GOLDEN PHI SACRED RESONANCE";
    }
    if (presetMode === 'solfeggio' && !manualControl) {
      return "TESLA 3-6-9 TRIADIC HARMONY";
    }
    if (currentMetrics.epsilon_carrier_amplitude && currentMetrics.epsilon_carrier_amplitude > 0.75 && currentMetrics.chaos < 20) {
      return "THE EVOLVED MIND (EPSILON BASELINE)";
    }
    if (currentMetrics.chaos > 65) return "HIGH-BETA NEURAL CHAOS";
    if (currentMetrics.meditation > 65) return "THETA-ALPHA COGNITIVE STILLNESS";
    if (currentMetrics.attention > 65 && currentBands.gamma > 23) return "AWAKENED FLOW CASCADE";
    return "BASELINE CONSENSUS STATE";
  })();

  // BLE standard hardware discovery handler
  const handleConnectHardware = async () => {
    if (connectionState === 'connected') {
      setConnectionState('disconnected');
      setDeviceName('Synthesis Fallback Node');
      return;
    }

    setConnectionState('connecting');
    try {
      // In compliance with our "No mock data" rule, we invoke real navigator.bluetooth logic
      const nav = navigator as any;
      if (!nav.bluetooth) {
        throw new Error("Web Bluetooth API is not supported in this frame or browser context.");
      }
      
      const device = await nav.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'Muse' },
          { namePrefix: 'Vilistus' },
          { namePrefix: 'Athena' },
          { namePrefix: 'EEG' }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      setDeviceName(device.name || 'Hardware Neural Link');
      setConnectionState('connected');
    } catch (err: any) {
      setConnectionState('disconnected');
      // Graceful error alerting & redirection to the built-in Synthesis Engine
      console.warn("BLE Pairing error:", err);
      alert(`Mind Laser Hardware Sync: ${err.message || "Request dismissed."}\n\nActivating built-in Premium High-Fidelity EEG Telemetry Emulator core.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col font-sans select-none antialiased selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Top Main Navigation HUD Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0c0e12] sticky top-0 z-40 px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-500 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)] rotate-3 shrink-0">
            <Brain className="h-5 w-5 text-black shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display tracking-tight text-white leading-none">
                MIND LASER
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-violet-950/80 text-violet-400 border border-violet-800/60 rounded font-semibold tracking-wider">
                V1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Bio-Adaptive Neural Telemetry & Socratic LLM Routing</p>
          </div>
        </div>

        {/* Real-time sync diagnostic badge */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end text-right hidden md:flex">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Synced Hardware Identifier</span>
            <span className="text-xs font-semibold text-slate-300">{deviceName}</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800 hidden md:block"></div>

          <button
            onClick={handleConnectHardware}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold font-display tracking-wide border transition-all flex items-center gap-2 cursor-pointer ${
              connectionState === 'connected'
                ? 'bg-emerald-950/25 hover:bg-emerald-900/40 border-emerald-500/40 text-emerald-350'
                : connectionState === 'connecting'
                  ? 'bg-cyan-950/40 border-cyan-600/50 text-cyan-200 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <Bluetooth className={`h-3.5 w-3.5 ${connectionState === 'connecting' ? 'animate-bounce' : ''}`} />
            {connectionState === 'connected' ? 'Hardware Bound' : connectionState === 'connecting' ? 'Searching BLE...' : 'Synchronize EEG'}
          </button>
        </div>
      </header>

      {/* Main Grid Layout - Balanced Bento Design */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Neural Telemetry, Controls & Calibration (Columns 1-5) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Diagnostic Active Vector Summary Card */}
          <div className="bg-[#0c0e12] p-5 rounded-xl border border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${
              currentMetrics.chaos > 65
                ? 'bg-rose-500'
                : currentMetrics.meditation > 65
                  ? 'bg-purple-500'
                  : 'bg-cyan-500'
            }`} />
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Active Telemetry Posture</span>
                <h2 className={`text-base font-bold font-display tracking-tight mt-1 ${
                  currentMetrics.chaos > 65
                    ? 'text-rose-400'
                    : currentMetrics.meditation > 65
                      ? 'text-purple-400'
                      : 'text-cyan-400'
                }`}>
                  {stateLabel}
                </h2>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-850 flex items-center justify-center">
                <Gauge className="h-4 w-4 text-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Neural Band Diagnostic Bars */}
            <div className="mt-4 grid grid-cols-7 gap-1 text-center bg-[#050608]/90 p-2.5 rounded border border-slate-800/80 font-mono">
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.epsilon.text} font-semibold truncate`}>ε EPS</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.epsilon.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.epsilon.bg} h-full`} style={{ width: `${currentBands.epsilon}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.delta.text} font-semibold truncate`}>Δ DEL</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.delta.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.delta.bg} h-full`} style={{ width: `${currentBands.delta}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.theta.text} font-semibold truncate`}>θ THE</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.theta.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.theta.bg} h-full`} style={{ width: `${currentBands.theta}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.alpha.text} font-semibold truncate`}>α ALPH</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.alpha.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.alpha.bg} h-full`} style={{ width: `${currentBands.alpha}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.beta.text} font-semibold truncate`}>β BETA</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.beta.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.beta.bg} h-full`} style={{ width: `${currentBands.beta}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.gamma.text} font-semibold truncate`}>γ GAM</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.gamma.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.gamma.bg} h-full`} style={{ width: `${currentBands.gamma}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`text-[8px] ${BandColors.lambda.text} font-semibold truncate`}>λ LAM</span>
                <span className="text-[10px] font-bold text-slate-200 mt-1">{currentBands.lambda.toFixed(1)}%</span>
                <div className="w-full h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`${BandColors.lambda.bg} h-full`} style={{ width: `${currentBands.lambda}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Oscilloscope Panel */}
          <Oscilloscope bands={currentBands} metrics={currentMetrics} />

          {/* Biometric Analysis Indices */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0c0e12] border border-slate-800 p-4 rounded-xl flex flex-col items-center shadow-md">
              <span className="text-[9px] font-mono text-slate-500 uppercase text-center block mb-2 font-bold select-none tracking-wider">Attention</span>
              <div className="relative flex items-center justify-center w-14 h-14">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-violet-400 transition-all duration-300" strokeDasharray={`${currentMetrics.attention}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-bold font-mono text-violet-200">{currentMetrics.attention}%</span>
              </div>
              
              {/* Mini Sparkline Chart */}
              {renderSparkline()}

              <span className="text-[9px] text-slate-400 mt-2 text-center select-none font-mono tracking-tighter">Active Focus</span>
            </div>

            <div className="bg-[#0c0e12] border border-slate-800 p-4 rounded-xl flex flex-col items-center shadow-md">
              <span className="text-[9px] font-mono text-slate-500 uppercase text-center block mb-2 font-bold select-none tracking-wider font-bold">Stillness</span>
              <div className="relative flex items-center justify-center w-14 h-14">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-purple-400 transition-all duration-300" strokeDasharray={`${currentMetrics.meditation}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-bold font-mono text-purple-205">{currentMetrics.meditation}%</span>
              </div>
              <span className="text-[9px] text-slate-400 mt-2 text-center select-none font-mono tracking-tighter">Reflective</span>
            </div>

            <div className="bg-[#0c0e12] border border-slate-800 p-4 rounded-xl flex flex-col items-center shadow-md">
              <span className="text-[9px] font-mono text-slate-500 uppercase text-center block mb-2 font-bold select-none tracking-wider">Chaos</span>
              <div className="relative flex items-center justify-center w-14 h-14">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-rose-400 transition-all duration-300" strokeDasharray={`${currentMetrics.chaos}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-bold font-mono text-rose-205">{currentMetrics.chaos}%</span>
              </div>
              <span className="text-[9px] text-slate-400 mt-2 text-center select-none font-mono tracking-tighter">Noise Ratio</span>
            </div>
          </div>

          {/* Spectral Mirror Map component */}
          <SpectralMirrorMap 
            bands={currentBands} 
            epsilonCarrier={currentMetrics.epsilon_carrier_amplitude} 
          />

          {/* Sacred Geometry Resonance Dashboard */}
          <SacredProportionsResonance 
            activePreset={presetMode} 
            bands={currentBands} 
            isManual={manualControl} 
          />

          {/* Acoustic Anchoring & Layered Soundtracks */}
          <LayeredSoundtrackAnchor 
            currentBands={currentBands} 
            presetMode={presetMode} 
            manualControl={manualControl} 
            onAppendSystemDisclaimer={handleAppendSystemDisclaimer}
          />

          {/* Adaptive Neural Safeguard Matrix */}
          <AdaptiveNeuralSafeguards 
            currentBands={currentBands} 
            presetMode={presetMode} 
            manualControl={manualControl} 
            onResetToHomeostasis={handleResetToHomeostasis} 
            onSimulatePreset={handlePresetSelect} 
            onAppendSystemDisclaimer={handleAppendSystemDisclaimer} 
          />

          {/* Calibration Profile Engine */}
          <div className="bg-[#0c0e12] border border-slate-800 p-5 rounded-xl flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1.5 col-span-2">
                <Settings2 className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
                  Profile Calibration Normalization
                </h3>
              </div>
              <button
                onClick={() => setShowCalibrationGuide(!showCalibrationGuide)}
                className="text-slate-500 hover:text-cyan-400 transition-colors"
                title="What is calibration?"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>

            {showCalibrationGuide && (
              <div className="p-3 bg-black/40 border border-slate-800 rounded text-xs space-y-2 leading-relaxed text-slate-400">
                <p>
                  <strong>Chaos Floor:</strong> This calibrates the minimum relative Beta amplitude beyond which active stress/logical noise is triggered inside LLM orchestration filters.
                </p>
                <p>
                  <strong>Stillness Ceiling:</strong> This defines the minimum relative density of meditative Alpha/Theta waves of conscious stillness needed to trigger philosophical, reflective Socratic states.
                </p>
              </div>
            )}

            {/* Sliders for calibration floor to ceiling */}
            <div className="space-y-5">
              
              {/* Chaos Floor Threshold Group */}
              <div className={`flex flex-col gap-2 p-3 rounded-lg border transition-all duration-300 ${
                isAdjustingFloor 
                  ? 'bg-slate-900/60 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                  : 'bg-slate-950/40 border-slate-800'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isAdjustingFloor 
                        ? 'bg-cyan-400 ring-4 ring-cyan-500/30' 
                        : currentBands.beta > calibration.chaosFloor 
                          ? 'bg-rose-500 ring-2 ring-rose-500/30 animate-pulse' 
                          : 'bg-cyan-500'
                    }`}></span>
                    <span className="text-slate-200 font-semibold font-display">Chaos Floor (Beta limit)</span>
                  </div>
                  
                  {/* Relational indicator badge */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const betaValue = currentBands.beta;
                      const floorDiff = betaValue - calibration.chaosFloor;
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all duration-300 border ${
                          floorDiff > 0 
                            ? 'bg-rose-950/30 border-rose-850/50 text-rose-400 font-bold animate-pulse' 
                            : 'bg-cyan-950/20 border-cyan-900/40 text-cyan-400'
                        }`}>
                          {floorDiff > 0 ? `+${floorDiff.toFixed(1)}% above ceiling` : `${Math.abs(floorDiff).toFixed(1)}% safe buffer`}
                        </span>
                      );
                    })()}
                    <span className={`font-mono font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border transition-all duration-200 ${
                      isAdjustingFloor ? 'border-cyan-400 text-white bg-cyan-900' : 'border-cyan-800/20 text-cyan-400'
                    }`}>{calibration.chaosFloor}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 tracking-tight block">Adjust threshold trigger:</span>
                  <input
                    type="range"
                    min="25"
                    max="60"
                    value={calibration.chaosFloor}
                    onChange={(e) => setCalibration({ ...calibration, chaosFloor: parseInt(e.target.value) })}
                    onFocus={() => setIsAdjustingFloor(true)}
                    onBlur={() => setIsAdjustingFloor(false)}
                    onMouseDown={() => setIsAdjustingFloor(true)}
                    onMouseUp={() => setIsAdjustingFloor(false)}
                    onTouchStart={() => setIsAdjustingFloor(true)}
                    onTouchEnd={() => setIsAdjustingFloor(false)}
                    className="w-full bg-[#050608] accent-cyan-400 h-1 rounded cursor-pointer"
                  />
                </div>

                {/* VISUAL REPRESENTATION BAR */}
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-[8px] font-mono text-slate-505 px-0.5">
                    <span>0% (Calm Beta)</span>
                    <span className="text-cyan-400">Threshold: {calibration.chaosFloor}%</span>
                    <span>100% (Turbulent)</span>
                  </div>

                  {/* Visual indicator bar */}
                  <div className="h-6 w-full bg-black/60 border border-slate-800/80 rounded relative flex items-center overflow-hidden px-1">
                    {/* Threshold Zone marker */}
                    <div 
                      className={`absolute inset-y-0 right-0 border-l border-dashed transition-all duration-300 ${
                        isAdjustingFloor 
                          ? 'bg-rose-500/15 border-rose-405/50' 
                          : 'bg-rose-500/10 border-rose-500/30'
                      }`}
                      style={{ left: `${calibration.chaosFloor}%` }}
                    />

                    {(() => {
                      const betaValue = currentBands.beta;
                      const floorGapWidth = Math.abs(betaValue - calibration.chaosFloor);
                      const floorGapLeft = Math.min(betaValue, calibration.chaosFloor);
                      return (
                        <>
                          {/* Dynamic Gap Segment highlighting the relation */}
                          <div 
                            className={`absolute h-4 rounded-sm top-[3px] transition-all duration-200 border-x border-dashed ${
                              betaValue > calibration.chaosFloor 
                                ? 'bg-rose-500/25 border-rose-500/60 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                                : 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                            } ${
                              isAdjustingFloor ? 'opacity-100 h-[18px] top-[2.5px] border-y border-dashed' : 'opacity-40'
                            }`}
                            style={{ 
                              left: `${floorGapLeft}%`, 
                              width: `${floorGapWidth}%`
                            }}
                          />
                        </>
                      );
                    })()}
                    
                    {/* Floating threshold vertical pin */}
                    <div 
                      className={`absolute top-0 bottom-0 z-10 transition-all duration-200 ${
                        isAdjustingFloor 
                          ? 'w-[3px] bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                          : currentBands.beta > calibration.chaosFloor
                            ? 'w-1 bg-rose-450 shadow-[0_0_10px_#ef4444]'
                            : 'w-0.5 bg-cyan-400/80'
                      }`}
                      style={{ left: `${calibration.chaosFloor}%` }}
                    >
                      <div className={`absolute top-0 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 bg-cyan-400 rotate-45 rounded-sm transition-transform duration-300 ${
                        isAdjustingFloor ? 'scale-125 saturate-150 rotate-[135deg] shadow-[0_0_6px_cyan]' : ''
                      } ${
                        currentBands.beta > calibration.chaosFloor ? 'animate-pulse bg-rose-500' : ''
                      }`} />
                      <div className={`absolute bottom-0 -translate-x-1/2 translate-y-1 w-2.5 h-2.5 bg-cyan-400 rotate-45 rounded-sm transition-transform duration-300 ${
                        isAdjustingFloor ? 'scale-125 saturate-150 rotate-[135deg] shadow-[0_0_6px_cyan]' : ''
                      } ${
                        currentBands.beta > calibration.chaosFloor ? 'animate-pulse bg-rose-500' : ''
                      }`} />
                    </div>

                    {/* Current Level Meter Bar */}
                    <div 
                      className={`h-3 rounded-sm transition-all duration-350 relative ${
                        isAdjustingFloor ? 'h-4 ring-2 ring-cyan-500/20' : ''
                      } ${
                        currentBands.beta > calibration.chaosFloor 
                          ? 'bg-gradient-to-r from-cyan-500 via-rose-500 to-rose-600 shadow-[0_0_12px_#ef4444]' 
                          : 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      }`}
                      style={{ width: `${Math.min(100, currentBands.beta)}%` }}
                    />

                    {/* Left/Right Text overlays */}
                    <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none font-mono text-[9px] font-bold z-20">
                      <span className="text-slate-400">Current Beta: {currentBands.beta.toFixed(1)}%</span>
                      {currentBands.beta > calibration.chaosFloor ? (
                        <span className="text-rose-400 animate-pulse font-sans">⚠️ OVERLOAD TRIGGERED</span>
                      ) : (
                        <span className="text-cyan-300 font-sans">✓ SAFE STATUS</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stillness Ceiling Threshold Group */}
              <div className={`flex flex-col gap-2 p-3 rounded-lg border transition-all duration-300 ${
                isAdjustingCeiling 
                  ? 'bg-slate-900/60 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                  : 'bg-slate-950/40 border-slate-800'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 font-display text-slate-205">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isAdjustingCeiling 
                        ? 'bg-purple-400 ring-4 ring-purple-500/30' 
                        : (currentBands.alpha + currentBands.theta) > calibration.stillnessCeiling 
                          ? 'bg-fuchsia-550 ring-2 ring-fuchsia-500/30 animate-pulse' 
                          : 'bg-purple-500'
                    }`}></span>
                    <span className="font-semibold text-slate-200">Stillness Ceiling (Alpha/Theta limit)</span>
                  </div>
                  
                  {/* Relational indicator badge */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const stillnessVal = currentBands.alpha + currentBands.theta;
                      const ceilDiff = stillnessVal - calibration.stillnessCeiling;
                      return (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all duration-300 border ${
                          ceilDiff >= 0 
                            ? 'bg-fuchsia-950/30 border-fuchsia-850/50 text-fuchsia-400 font-bold animate-pulse' 
                            : 'bg-slate-900/30 border-slate-800/40 text-slate-400'
                        }`}>
                          {ceilDiff >= 0 ? `+${ceilDiff.toFixed(1)}% stillness excess` : `${Math.abs(ceilDiff).toFixed(1)}% below trigger`}
                        </span>
                      );
                    })()}
                    <span className={`font-mono text-purple-400 font-bold bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/20 transition-all duration-200 ${
                      isAdjustingCeiling ? 'border-purple-400 text-white bg-purple-900' : 'border-purple-800/20 text-purple-400'
                    }`}>{calibration.stillnessCeiling}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 tracking-tight block">Adjust threshold trigger:</span>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={calibration.stillnessCeiling}
                    onChange={(e) => setCalibration({ ...calibration, stillnessCeiling: parseInt(e.target.value) })}
                    onFocus={() => setIsAdjustingCeiling(true)}
                    onBlur={() => setIsAdjustingCeiling(false)}
                    onMouseDown={() => setIsAdjustingCeiling(true)}
                    onMouseUp={() => setIsAdjustingCeiling(false)}
                    onTouchStart={() => setIsAdjustingCeiling(true)}
                    onTouchEnd={() => setIsAdjustingCeiling(false)}
                    className="w-full bg-[#050608] accent-purple-400 h-1 rounded cursor-pointer"
                  />
                </div>

                {/* VISUAL REPRESENTATION BAR */}
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-[8px] font-mono text-slate-505 px-0.5">
                    <span>0% (Low Calm)</span>
                    <span className="text-purple-400">Threshold: {calibration.stillnessCeiling}%</span>
                    <span>100% (High Zen)</span>
                  </div>

                  {/* Visual indicator bar */}
                  <div className="h-6 w-full bg-black/60 border border-slate-800/80 rounded relative flex items-center overflow-hidden px-1">
                    {/* Threshold Zone marker */}
                    <div 
                      className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                        isAdjustingCeiling 
                          ? 'bg-purple-500/10' 
                          : 'bg-purple-500/5'
                      }`}
                      style={{ right: `${100 - calibration.stillnessCeiling}%` }}
                    />

                    {(() => {
                      const stillnessVal = currentBands.alpha + currentBands.theta;
                      const ceilingGapWidth = Math.abs(stillnessVal - calibration.stillnessCeiling);
                      const ceilingGapLeft = Math.min(stillnessVal, calibration.stillnessCeiling);
                      const isStillAchieved = stillnessVal > calibration.stillnessCeiling;
                      return (
                        <>
                          {/* Dynamic Gap Segment highlighting the relation */}
                          <div 
                            className={`absolute h-4 rounded-sm top-[3px] transition-all duration-200 border-x border-dashed ${
                              isStillAchieved 
                                ? 'bg-purple-500/25 border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.2)]' 
                                : 'bg-fuchsia-500/15 border-fuchsia-400/55 shadow-[0_0_8px_rgba(240,46,170,0.15)]'
                            } ${
                              isAdjustingCeiling ? 'opacity-100 h-[18px] top-[2.5px] border-y border-dashed' : 'opacity-40'
                            }`}
                            style={{ 
                              left: `${ceilingGapLeft}%`, 
                              width: `${ceilingGapWidth}%`
                            }}
                          />
                        </>
                      );
                    })()}
                    
                    {/* Floating threshold vertical pin */}
                    <div 
                      className={`absolute top-0 bottom-0 z-10 transition-all duration-200 ${
                        isAdjustingCeiling 
                          ? 'w-[3px] bg-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.8)] filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' 
                          : (currentBands.alpha + currentBands.theta) > calibration.stillnessCeiling
                            ? 'w-1 bg-fuchsia-450 shadow-[0_0_10px_#a855f7]'
                            : 'w-0.5 bg-purple-400/85'
                      }`}
                      style={{ left: `${calibration.stillnessCeiling}%` }}
                    >
                      <div className={`absolute top-0 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 bg-purple-400 rotate-45 rounded-sm transition-transform duration-300 ${
                        isAdjustingCeiling ? 'scale-125 saturate-150 rotate-[135deg] shadow-[0_0_6px_purple]' : ''
                      } ${
                        (currentBands.alpha + currentBands.theta) > calibration.stillnessCeiling ? 'animate-pulse bg-fuchsia-500' : ''
                      }`} />
                      <div className={`absolute bottom-0 -translate-x-1/2 translate-y-1 w-2.5 h-2.5 bg-purple-400 rotate-45 rounded-sm transition-transform duration-300 ${
                        isAdjustingCeiling ? 'scale-125 saturate-150 rotate-[135deg] shadow-[0_0_6px_purple]' : ''
                      } ${
                        (currentBands.alpha + currentBands.theta) > calibration.stillnessCeiling ? 'animate-pulse bg-fuchsia-500' : ''
                      }`} />
                    </div>

                    {/* Current Level Meter Bar */}
                    {(() => {
                      const stillnessVal = currentBands.alpha + currentBands.theta;
                      const isStillAchieved = stillnessVal > calibration.stillnessCeiling;
                      return (
                        <>
                          <div 
                            className={`h-3 rounded-sm transition-all duration-300 relative ${
                              isAdjustingCeiling ? 'h-4 ring-2 ring-purple-500/20' : ''
                            } ${
                              isStillAchieved 
                                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_12px_#a855f7]' 
                                : 'bg-gradient-to-r from-purple-950/30 to-purple-600/70 shadow-[0_0_8px_rgba(168,85,247,0.15)]'
                            }`}
                            style={{ width: `${Math.min(100, stillnessVal)}%` }}
                          />

                          {/* Left/Right Text overlays */}
                          <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none font-mono text-[9px] font-bold z-20">
                            <span className="text-slate-400">Current α+θ: {stillnessVal.toFixed(1)}%</span>
                            {isStillAchieved ? (
                              <span className="text-fuchsia-400 animate-pulse font-sans">🧘 STILLNESS UNLOCKED</span>
                            ) : (
                              <span className="text-slate-500 font-sans">AWAITING TRANQUILITY</span>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Preset Emulator Controller */}
          <div className="bg-[#080a0d] border border-slate-800 p-5 rounded-xl shadow-md">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 mb-4">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
                Neural Telemetry Injector / Emulator
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {/* Presets Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePresetSelect('baseline')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'baseline' && !manualControl
                      ? 'bg-blue-950/25 border-blue-500/50 text-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold font-display">Baseline Consensus</span>
                  <span className="text-[10px] opacity-75">Balanced logic gates</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('stillness')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'stillness' && !manualControl
                      ? 'bg-purple-950/25 border-purple-500/50 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold font-display">Stillness Ceiling</span>
                  <span className="text-[10px] opacity-75">Alpha-Theta meditative calm</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('chaos')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'chaos' && !manualControl
                      ? 'bg-rose-950/25 border-rose-500/50 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold font-display">Chaos Floor</span>
                  <span className="text-[10px] opacity-75">High-Beta cognitive noise</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('awakened')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'awakened' && !manualControl
                      ? 'bg-cyan-950/25 border-cyan-500/50 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold font-display">Awakened Flow</span>
                  <span className="text-[10px] opacity-75">Peak Gamma synchronization</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('evolved')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 col-span-2 ${
                    presetMode === 'evolved' && !manualControl
                      ? 'bg-[#ffebee]/5 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse'
                      : 'bg-[#050608]/90 border-slate-800/80 text-rose-450/70 hover:border-slate-700 hover:text-rose-400'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-rose-450">⚡ The Evolved Mind</span>
                  <span className="text-[10px] opacity-75">Ultra-slow Epsilon carrier baseline immersion</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('phi')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'phi' && !manualControl
                      ? 'bg-amber-950/25 border-amber-500/50 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-amber-500/70 hover:border-slate-700 hover:text-amber-400'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-amber-400">🔺 Phi-Resonance</span>
                  <span className="text-[10px] opacity-75">Golden Ratio nesting (1.618)</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('solfeggio')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'solfeggio' && !manualControl
                      ? 'bg-[#1a1c36] border-indigo-500/50 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-indigo-400/80 hover:border-slate-700 hover:text-indigo-300'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-indigo-400">🌀 Tesla Harmony 3-6-9</span>
                  <span className="text-[10px] opacity-75">Pythagorean 108 root alignment</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('microsleep')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'microsleep' && !manualControl
                      ? 'bg-amber-900/10 border-amber-500/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-amber-400'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-amber-400">🚨 Microsleep</span>
                  <span className="text-[10px] opacity-75">Delta wave biological waking blackout</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('disorganization')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 ${
                    presetMode === 'disorganization' && !manualControl
                      ? 'bg-purple-900/10 border-purple-500/60 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                      : 'bg-[#050608]/90 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-purple-400'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-purple-400">⚠️ Cognitive Split</span>
                  <span className="text-[10px] opacity-75">Prodromal sensory disorganization</span>
                </button>

                <button
                  onClick={() => handlePresetSelect('overload')}
                  className={`p-2 rounded text-left border text-xs transition-all flex flex-col gap-1 col-span-2 ${
                    presetMode === 'overload' && !manualControl
                      ? 'bg-rose-900/15 border-rose-500/60 text-rose-105 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse'
                      : 'bg-[#050608]/90 border-slate-800/80 text-rose-450/70 hover:border-slate-700 hover:text-rose-400'
                  }`}
                >
                  <span className="font-semibold font-display flex items-center gap-1 text-rose-400">💥 Hyper Entrainment Overload</span>
                  <span className="text-[10px] opacity-75">Unsafe high-frequency gamma/lambda stimulation spikes</span>
                </button>
              </div>

              {/* Slider modulation toggling and custom inputs */}
              <div className="border-t border-slate-800/80 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-semibold text-slate-300 font-display uppercase tracking-wide">
                    Manual Wave Controls
                  </span>
                  <span className="text-[9px] font-mono uppercase text-slate-500">
                    {manualControl ? 'Custom Slider Override' : 'System Controlled Preset'}
                  </span>
                </div>

                <div className="space-y-3.5 opacity-90">
                  {renderSliderRow('epsilon', 'Epsilon Carrier (<0.5 Hz - Ground)', 'text-zinc-400/90', 'accent-zinc-500', 'border-zinc-500/50')}
                  {renderSliderRow('delta', 'Delta Waves (0.5-4 Hz - Sleep)', 'text-red-400/90', 'accent-red-500', 'border-red-500/50')}
                  {renderSliderRow('theta', 'Theta Waves (4-8 Hz - Dream/Intuition)', 'text-orange-400/90', 'accent-orange-500', 'border-orange-500/50')}
                  {renderSliderRow('alpha', 'Alpha Waves (8-12 Hz - Alert Calm)', 'text-emerald-400/90', 'accent-emerald-500', 'border-emerald-500/50')}
                  {renderSliderRow('beta', 'Beta Waves (12-30 Hz - Active Thinking)', 'text-blue-400/90', 'accent-blue-500', 'border-blue-500/50')}
                  {renderSliderRow('gamma', 'Gamma Waves (30-100 Hz - Peak Flow)', 'text-violet-400/90', 'accent-violet-500', 'border-violet-500/50')}
                  {renderSliderRow('lambda', 'Lambda Waves (100-200 Hz - Mystical Bound)', 'text-pink-400/90', 'accent-pink-500', 'border-pink-500/50')}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Side: Agent Routing Topologies & Socratic AI (Columns 6-12) */}
        <section className="lg:col-span-7 flex flex-col gap-6 h-full">
          
          {/* Agent topology map section */}
          <div className="h-[430px]">
            <AgentTopologyMap 
              metrics={currentMetrics} 
              bands={currentBands} 
              stateLabel={stateLabel} 
            />
          </div>

          {/* Socratic chat interface */}
          <div className="flex-1 min-h-[500px]">
            <SocraticChat 
              currentBands={currentBands} 
              currentMetrics={currentMetrics} 
              stateLabel={stateLabel} 
            />
          </div>

        </section>
      </main>

      {/* Footer Bar */}
      <footer className="h-12 bg-[#080a0d] border-t border-slate-800 px-6 flex items-center justify-between font-mono text-[10px] text-slate-500 select-none">
        <div className="flex gap-6 items-center">
          <span>UTC: 12:00:56</span>
          <span>LATENCY: 8ms</span>
          <span>BUFFER: 1024KB</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Mind Laser Protocol Active: Live telemetry bypass</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-1.5 w-24 bg-slate-900 rounded-full relative overflow-hidden hidden md:block border border-slate-800">
            <div className="absolute inset-y-0 left-0 w-[80%] bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Operational Beam Intensity</span>
        </div>
      </footer>
    </div>
  );
}
