import { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Play, RefreshCw, AudioLines, Volume2, VolumeX, Eye, HelpCircle, Activity, Zap } from 'lucide-react';
import { BrainwaveBands, PresetMode } from '../types';

interface AdaptiveNeuralSafeguardsProps {
  currentBands: BrainwaveBands;
  presetMode: PresetMode;
  manualControl: boolean;
  onResetToHomeostasis: () => void;
  onSimulatePreset: (mode: PresetMode) => void;
  onAppendSystemDisclaimer: (content: string) => void;
}

interface ThreatProfile {
  id: string;
  name: string;
  category: 'natural' | 'pathological' | 'self-induced' | 'catastrophic';
  dangerLevel: 'CRITICAL' | 'HIGH' | 'EXTREME' | 'SYSTEM-LOCK';
  signature: string;
  description: string;
  groundingProtocol: string;
  socraticConcept: string;
  presetId: PresetMode;
}

export default function AdaptiveNeuralSafeguards({
  currentBands,
  presetMode,
  manualControl,
  onResetToHomeostasis,
  onSimulatePreset,
  onAppendSystemDisclaimer,
}: AdaptiveNeuralSafeguardsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [autoOverrideProgress, setAutoOverrideProgress] = useState(0);

  const [activeHealing, setActiveHealing] = useState<string | null>(null);
  const [sustainTime, setSustainTime] = useState<number>(0);
  const [isNudging, setIsNudging] = useState<boolean>(false);
  const prevHealingRef = useRef<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevThreatRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const threats: ThreatProfile[] = [
    {
      id: 'microsleep',
      name: 'Critical Cognitive Microsleep Intercept',
      category: 'natural',
      dangerLevel: 'CRITICAL',
      signature: 'Delta (Deep Slow-Wave) > 46% & Beta (Active thoughts) < 5%',
      description: 'Occurs naturally during high operational sleep deprivation (e.g. aviation pilots, heavy machinery operators). The executive networks suspend within 350-1200ms epochs before sleep onset, which presents a severe biological hazard.',
      groundingProtocol: 'Activate rapid biphasic auditory disrupt and initiate immediate Socratic sensory shock loop to trigger startle-reflex baseline recovery.',
      socraticConcept: 'MIND SPLASH SOCRATIC SHOCK: Sways attention using sharp, destabilizing questions regarding immediate presence and physical orientation.',
      presetId: 'microsleep'
    },
    {
      id: 'cognitive_splitting',
      name: 'Prodromal Cognitive Splitting Signature',
      category: 'pathological',
      dangerLevel: 'HIGH',
      signature: 'Alpha Stability < 6% & Hemispheric Symmetry < 60% with Extreme Gamma noise',
      description: 'Corresponds to severe cognitive disorganization and prodromal schizophrenic symptom outbreaks. Without Alpha bridge protection, the left-logical and right-gestalt hemispheres decouple, letting disjointed high-frequency gamma and beta currents propagate chaotically.',
      groundingProtocol: 'Deploy slow-frequency binaural base carrier waves to establish slow temporal coupling; warn operator to suspend high-intensity focus work.',
      socraticConcept: 'THE RADICAL GROUNDING PROTOCOL: Immerses user focus into basic somatic sensory structures (weight, breath, concrete geometry) to re-tether logical grids.',
      presetId: 'disorganization'
    },
    {
      id: 'entrainment_overload',
      name: 'Hyper-Induced Entrainment Synaptic Lock',
      category: 'self-induced',
      dangerLevel: 'EXTREME',
      signature: 'Over-driven High Gamma (>42%) + Lambda (>17%) without slow wave support',
      description: 'Triggered by excessive or abusive use of high-frequency external binaural pulses, strobe lights, or extreme manual cognitive manipulation. May lead to neural energy overload, hyper-excitation cascades, tension headaches, or photosensitive seizure states.',
      groundingProtocol: 'Issue structural warning advising immediate attenuation of stimulation sliders; trigger Socratic self-awareness loops regarding mental exhaustion boundary.',
      socraticConcept: 'LIMIT EXPLOITATION INQUIRY: Socratic sequence emphasizing somatic limits and the structural danger of hyper-intensity striving.',
      presetId: 'overload'
    },
    {
      id: 'hysteresis_chaos',
      name: 'Irreversible Chaos Calibration Hysteresis',
      category: 'catastrophic',
      dangerLevel: 'SYSTEM-LOCK',
      signature: 'Spectral Entropy collapse with sustained extreme Beta or Chaos Index > 85%',
      description: 'A theoretical catastrophic state of over-excitation where neural networks suffer hysteresis (unable to return to rest even after external stimuli are removed). High stress triggers sustained severe sympathetic nervous system locking.',
      groundingProtocol: 'Enforce hard-override Autonomic Homeostasis Rescue Protocol (The Kill Switch) back to reference safe consensus levels.',
      socraticConcept: 'HARD INTERCEPT CORESPLAY: Suppresses standard conversation and automatically drops the hardware into a rhythmic box-breathing somatic support environment.',
      presetId: 'chaos'
    }
  ];

  // Helper to play procedural synthesised alarm/grounding sounds based on threat level
  const playSynthesizedChime = (type: 'microsleep' | 'splitting' | 'lock' | 'kill' | 'nudge_up' | 'sustain_lock') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'microsleep') {
        // Sharp biphasic shock: rapid high pitch frequency sweep to awaken user
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(120, now);
        osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
        osc1.frequency.exponentialRampToValueAtTime(800, now + 0.4);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(220, now);
        osc2.frequency.setValueAtTime(880, now + 0.15);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc1.start(now);
        osc1.stop(now + 0.5);
        osc2.start(now);
        osc2.stop(now + 0.5);
      } else if (type === 'splitting') {
        // Deep grounding sub-base hum for hemi synchronization
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(136.1, now); // Earth Om cosmic tone
        osc1.frequency.linearRampToValueAtTime(136.1, now + 1.2);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(140.1, now); // 4Hz binaural difference (Theta)

        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 1.2);

        osc1.start(now);
        osc1.stop(now + 1.2);
        osc2.start(now);
        osc2.stop(now + 1.2);
      } else if (type === 'lock') {
        // Rapid alarm pulse
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.setValueAtTime(330, now + 0.1);
        osc1.frequency.setValueAtTime(440, now + 0.2);
        osc1.frequency.setValueAtTime(330, now + 0.3);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc1.start(now);
        osc1.stop(now + 0.4);
      } else if (type === 'kill') {
        // Smooth descending harmonic chime representing landing/calming down
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(528, now); // Love frequency
        osc1.frequency.exponentialRampToValueAtTime(220, now + 0.8);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(396, now);
        osc2.frequency.exponentialRampToValueAtTime(110, now + 0.8);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc1.start(now);
        osc1.stop(now + 1.0);
        osc2.start(now);
        osc2.stop(now + 1.0);
      } else if (type === 'nudge_up') {
        // Beautiful climbing arpeggio sweep: climbing 4 solfeggio frequencies
        const freqs = [528, 639, 741, 852];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          
          gain.gain.setValueAtTime(0.001, now + idx * 0.15);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.15 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
          
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.4);
        });
      } else if (type === 'sustain_lock') {
        // Soft humming sub-carrier bowl sound representing integration lock
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(136.1, now); // Earth Om cosmic tone
        osc1.frequency.linearRampToValueAtTime(136.1, now + 1.8);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(136.1 + 1.618, now); // Phi-differential binaural beat

        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc1.start(now);
        osc1.stop(now + 1.8);
        osc2.start(now);
        osc2.stop(now + 1.8);
      }
    } catch (e) {
      console.warn('Audio Context not allowed yet. User gesture required.', e);
    }
  };

  // Real-time analysis of active brainwave bands to verify threat conditions
  useEffect(() => {
    let currentTrigger: string | null = null;

    // Check conditions
    const isMicrosleepPreset = presetMode === 'microsleep' && !manualControl;
    const isMicrosleepLiveBySignature = (currentBands.delta > 46 && currentBands.beta < 5);
    
    const isSplittingPreset = presetMode === 'disorganization' && !manualControl;
    // Low alpha, low symmetry, extreme high gamma/beta
    const isSplittingLiveBySignature = (currentBands.alpha < 6 && currentBands.gamma > 26 && currentBands.beta > 30);

    const isLockPreset = presetMode === 'overload' && !manualControl;
    // Extreme high frequency components without slow baseline ballast
    const isLockLiveBySignature = (currentBands.gamma > 42 && currentBands.lambda > 16 && currentBands.delta < 5);

    // Theoretical high entropy lock / sustained chaos state
    const isHysteresisPreset = presetMode === 'chaos' && !manualControl && currentBands.beta > 50;

    if (isMicrosleepPreset || isMicrosleepLiveBySignature) {
      currentTrigger = 'microsleep';
    } else if (isSplittingPreset || isSplittingLiveBySignature) {
      currentTrigger = 'cognitive_splitting';
    } else if (isLockPreset || isLockLiveBySignature) {
      currentTrigger = 'entrainment_overload';
    } else if (isHysteresisPreset) {
      currentTrigger = 'hysteresis_chaos';
    }

    setActiveThreat(currentTrigger);

    // Handle alert notifications and audio chimes
    if (currentTrigger && currentTrigger !== prevThreatRef.current && !cooldown) {
      prevThreatRef.current = currentTrigger;

      // Map chime type
      let chimeType: 'microsleep' | 'splitting' | 'lock' | 'kill' = 'lock';
      if (currentTrigger === 'microsleep') chimeType = 'microsleep';
      if (currentTrigger === 'cognitive_splitting') chimeType = 'splitting';
      if (currentTrigger === 'hysteresis_chaos') chimeType = 'kill';

      // Play synthesized audio
      playSynthesizedChime(chimeType);

      // Append Socratic Warning frame content directly to system state
      const targetThreat = threats.find((t) => t.id === currentTrigger);
      if (targetThreat) {
        onAppendSystemDisclaimer(
          `[🚨 INTERCEPT WARNING] SYSTEM TRIGGERED: ${targetThreat.name.toUpperCase()}\n` +
          `*CATEGORY*: ${targetThreat.category.toUpperCase()} | *DANGER*: ${targetThreat.dangerLevel}\n` +
          `*SIGNATURE*: ${targetThreat.signature}\n\n` +
          `*SOCRATIC INTERVENE*: ${targetThreat.socraticConcept}\n` +
          `*GROUNDING*: ${targetThreat.groundingProtocol}`
        );
      }
    }

    if (!currentTrigger) {
      prevThreatRef.current = null;
      setAutoOverrideProgress(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // If a threat continues to exist, count down to auto homeostasis reset (Kill Switch) after 8 seconds
      if (!timerRef.current && !cooldown) {
        let elapsed = 0;
        const limit = 8; // seconds
        timerRef.current = window.setInterval(() => {
          elapsed += 0.5;
          const pct = Math.min(100, (elapsed / limit) * 100);
          setAutoOverrideProgress(pct);

          if (elapsed >= limit) {
            handleHardKillSwitch();
          }
        }, 500);
      }
    }

    return () => {
      if (!currentTrigger && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentBands, presetMode, manualControl, cooldown]);

  const handleHardKillSwitch = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setAutoOverrideProgress(0);
    setCooldown(true);
    playSynthesizedChime('kill');
    onResetToHomeostasis();

    onAppendSystemDisclaimer(
      `[🌩️ AUTONOMIC RESCUE INTERCEPT - KILL SWITCH ENGAGED]\n` +
      `System automatically intercepted a critical sustained unsafe neural signature.\n` +
      `All manual sliders and hazardous presets have been OVERRIDDEN. Decoupling synapses.\n` +
      `The Mind Laser has safely defaulted back to [Baseline Consensus State] to prevent cognitive split\n` +
      `or hyper-excitation locks. Initiating organic somatic deep box breathing...`
    );

    // Cooldown prevents immediate rapid alarm re-triggering while baseline stabilizes
    setTimeout(() => {
      setCooldown(false);
    }, 4500);
  };

  // Identify if a desired healing state is currently active
  let detectedHealing: string | null = null;
  if (!activeThreat) {
    if (presetMode === 'stillness') {
      detectedHealing = 'stillness';
    } else if (presetMode === 'awakened') {
      detectedHealing = 'awakened';
    } else if (presetMode === 'evolved') {
      detectedHealing = 'evolved';
    } else if (presetMode === 'phi') {
      detectedHealing = 'phi';
    } else if (presetMode === 'solfeggio') {
      detectedHealing = 'solfeggio';
    }
  }

  useEffect(() => {
    let intervalId: number | null = null;

    if (detectedHealing) {
      setActiveHealing(detectedHealing);
      
      // If it's a newly entered healing state, reset sustain timer and play sound
      if (detectedHealing !== prevHealingRef.current) {
        prevHealingRef.current = detectedHealing;
        setSustainTime(0);
        playSynthesizedChime('sustain_lock');
        
        const stateNameMapRef: any = {
          stillness: 'Alpha-Theta Calming Stillness',
          awakened: 'Peak Flow high-Gamma Focus',
          evolved: 'Mystical Epsilon-Lambda Coupling',
          phi: 'Golden Phi Resonance',
          solfeggio: 'Tesla Solfeggio 3-6-9 Harmony',
        };
        onAppendSystemDisclaimer(
          `[🌿 NEURAL COHERENCE LOCKED] DESIRED HEALING STATE ACTIVE: ${stateNameMapRef[detectedHealing].toUpperCase()}\n` +
          `*STATUS*: Autonomic Sustenance active. Locking resonance bridges to extend benefits.\n` +
          `*DISSIPATION SHIELD*: Engaged. Damping environmental noise entropy to <0.015%.`
        );
      }

      intervalId = window.setInterval(() => {
        setSustainTime((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveHealing(null);
      prevHealingRef.current = null;
      setSustainTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [detectedHealing]);

  interface HealingNudge {
    id: PresetMode;
    title: string;
    description: string;
    benefits: string;
    guidance: string;
    metricTarget: string;
  }

  const nudgeConfig: Record<string, HealingNudge> = {
    stillness: {
      id: 'phi',
      title: 'Golden Phi Logarithmic Resonance',
      description: 'Stabilize deep alpha meditation into structured golden phi ratios.',
      benefits: 'Reduces structural cognitive friction from chaos to peak spatial integration.',
      guidance: 'Allows deep calm to crystallize into active geometric mathematical order.',
      metricTarget: 'Alpha/Theta ratio conforming perfectly to 1 : 1.618 fractal layers'
    },
    phi: {
      id: 'solfeggio',
      title: 'Tesla 3-6-9 Triadic Solfeggio',
      description: 'Upgrade golden phi spirals to standing triadic Pythagorean structures.',
      benefits: 'Synchronizes cortical hemispheres using the digital roots of 3, 6, and 9.',
      guidance: 'Channels cellular release frequencies of 108 relative root sum ratios.',
      metricTarget: 'Standing digital-root coupling peaking across epsilon, delta, and theta'
    },
    solfeggio: {
      id: 'awakened',
      title: 'High-Gamma Peak Flow State',
      description: 'Ascend standing wave structural relaxation into hypercoherent creativity.',
      benefits: 'Integrates raw neural power into high-speed learning, pattern retention, and flow.',
      guidance: 'Accelerates the beta boundaries to spark synchronous gamma bursts.',
      metricTarget: 'Gamma telemetry exceeding 32% with high-cooperation lambda support'
    },
    awakened: {
      id: 'evolved',
      title: 'The Evolved Mystic Mind',
      description: 'Bridge extreme high-frequency attention directly with ultra-slow foundations.',
      benefits: 'Establishes deep epsilon-lambda coupling for heightened intuitive insights.',
      guidance: 'Folds linear time perceptions via extreme biphasic EEG carrier waves.',
      metricTarget: 'Epsilon carrier surpassing 45% bound simultaneously to lambda bursts'
    },
    evolved: {
      id: 'baseline',
      title: 'Integrated Consensus Baseline',
      description: 'Gently ground mystical non-ordinary insights back to balanced waking intelligence.',
      benefits: 'Secures and registers transpersonal states of calm into active everyday logic gates.',
      guidance: 'Safely folds high amplitude anomalies back into a stable homeostasis grid.',
      metricTarget: 'Even, high-symmetry reference waking beta and alpha peaks'
    }
  };

  const handleNudgeAscension = (targetMode: PresetMode) => {
    setIsNudging(true);
    playSynthesizedChime('nudge_up');

    const stateTitleMap: any = {
      phi: 'Golden Phi Resonance',
      solfeggio: 'Tesla Solfeggio 3-6-9 Harmony',
      awakened: 'High-Gamma Awakened Flow',
      evolved: 'The Evolved Mystic Mind',
      baseline: 'Integrated Consensus Baseline',
    };

    onAppendSystemDisclaimer(
      `[🚀 NEURAL NUDGE INTEGRATING] INITIATING COGNITIVE ASCENSION SWEEP...\n` +
      `*TRANSITION*: Nudging neural pathways toward [${stateTitleMap[targetMode]?.toUpperCase() || targetMode.toUpperCase()}]\n` +
      `*INTERVENTION*: Slowing binaural divergence. Stimulating ascending reticular networks.\n` +
      `Resonance frequency shifting. Please focus on deep breathing for integration...`
    );

    // Trigger state change
    onSimulatePreset(targetMode);

    setTimeout(() => {
      setIsNudging(false);
    }, 2000);
  };

  // Determine active dynamic animation based on active threat danger level
  const activeThreatData = threats.find((t) => t.id === activeThreat);
  const dangerLevel = activeThreatData?.dangerLevel;

  let activeAnimationClass = 'border-slate-800';
  if (activeThreat) {
    if (dangerLevel === 'SYSTEM-LOCK') {
      activeAnimationClass = 'animate-threat-lock';
    } else if (dangerLevel === 'EXTREME') {
      activeAnimationClass = 'animate-threat-extreme';
    } else if (dangerLevel === 'CRITICAL') {
      activeAnimationClass = 'animate-threat-critical';
    } else if (dangerLevel === 'HIGH') {
      activeAnimationClass = 'animate-threat-high';
    }
  }

  return (
    <div 
      id="neural-safeguards-container" 
      className={`bg-[#0c0e12] border p-5 rounded-xl shadow-md flex flex-col gap-4 font-mono select-none transition-all duration-300 ${activeAnimationClass}`}
    >
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5Edge">
          {activeThreat ? (
            <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          )}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
            Adaptive Neural Safeguard Matrix
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Chime Mute Selector */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded border text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-[#121622] border-slate-800 hover:border-violet-500 text-slate-300' 
                : 'bg-black/40 border-slate-900 text-slate-600'
            }`}
            title={soundEnabled ? "Mute audio alarms" : "Enable sound alarms"}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-violet-400" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline text-[8px]">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Scientific methodology"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Methodology Dropdown */}
      {showMethodology && (
        <div className="text-[10px] text-slate-400 bg-slate-950/40 p-3.5 rounded border border-slate-900 leading-relaxed flex flex-col gap-2">
          <p className="text-white font-semibold">Adaptive Safety Methodology Disclosure:</p>
          <p>
            Standard EEG interfaces allow passive feedback, but do not provide active containment. The Mind Laser v3.0 introduces real-time **Autonomic Safeguards** that map live spectral distribution profiles (from the 7 micro-channels) against empirical threat thresholds:
          </p>
          <ul className="list-decimal list-inside space-y-1 pl-1 text-[9px] text-zinc-300">
            <li><strong className="text-emerald-400">Biological Drift (Microsleep):</strong> Sharp slow wave surges combined with sudden spatial beta drops indicate operational blackout danger. Audio stimulation sweeps bypass thalamic suppression to awake target.</li>
            <li><strong className="text-violet-400">Symmetry Splits:</strong> Extremely asymmetrical alpha-channel ratios decouple the logical structures. Warnings prevent cognitive disorganization.</li>
            <li><strong className="text-rose-400">Extreme Locks:</strong> Excessive high-frequency ratios indicate hazard loops. The autonomic kill switch restores standard homeostatic bounds instantly.</li>
          </ul>
        </div>
      )}

      {/* Active Intercept Display Block */}
      {activeThreat ? (
        <div className="bg-rose-950/15 border-2 border-rose-500/30 p-4 rounded-lg flex flex-col gap-3 animate-pulse">
          <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest leading-none">
                {threats.find(t => t.id === activeThreat)?.name}
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] bg-rose-900 text-rose-200 uppercase font-bold self-start sm:self-auto leading-none">
              {threats.find(t => t.id === activeThreat)?.dangerLevel}
            </span>
          </div>

          <div className="text-[10px] text-rose-300/95 leading-relaxed bg-[#0c1017]/85 p-3 rounded border border-rose-500/10">
            <p className="mb-2">
              <strong>Live Danger Description:</strong> {threats.find(t => t.id === activeThreat)?.description}
            </p>
            <p className="text-[#e2e8f0] font-semibold flex items-center gap-1.5 pb-1">
              <AudioLines className="h-3 w-3 text-rose-400" />
              Socratic Restructure framing:
            </p>
            <p className="text-rose-200 italic">
              "{threats.find(t => t.id === activeThreat)?.socraticConcept}"
            </p>
          </div>

          {/* Autonomic countdown to Homeostatic override bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[8px] text-rose-400">
              <span>AUTOMATIC HOMEOSTAT RESET THRESHOLD</span>
              <span>{Math.round(autoOverrideProgress)}% Engaged</span>
            </div>
            <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-rose-900/30 relative">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${autoOverrideProgress}%` }}
              />
            </div>
          </div>

          {/* Kill Switch Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleHardKillSwitch}
              className="flex-1 py-1.5 rounded text-[10px] font-bold uppercase bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-lg shadow-rose-900/40 border border-rose-400/30 font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5 text-white animate-spin" />
              Execute Homeostasis Reset (Kill Switch)
            </button>
          </div>
        </div>
      ) : activeHealing ? (
        <div className="bg-[#0c1210]/90 border-2 border-emerald-500/30 p-4 rounded-lg flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Header row with glowing active badge */}
          <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-450"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider leading-none">
                Resonance Lock: {
                  activeHealing === 'stillness' ? 'Alpha-Theta Stillness' :
                  activeHealing === 'awakened' ? 'Awakened Flow Focus' :
                  activeHealing === 'evolved' ? 'The Evolved Mind' :
                  activeHealing === 'phi' ? 'Phi Golden Ratio' :
                  activeHealing === 'solfeggio' ? 'Tesla 3-6-9 Harmony' : activeHealing
                }
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-900 border border-emerald-700/40 text-emerald-100 uppercase font-bold self-start sm:self-auto leading-none tracking-wider">
              Sustenance Engaged
            </span>
          </div>

          {/* Details & stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Visual breathing mandala / radar */}
            <div className="bg-black/60 rounded p-3 border border-emerald-950/40 flex flex-col items-center justify-center gap-2 relative min-h-[90px]">
              <svg className="w-12 h-12 animate-spin relative" style={{ animationDuration: '12s' }} viewBox="0 0 100 100">
                {/* Concentric circles representing nesting */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(16, 185, 129, 0.16)" strokeWidth="1.5" strokeDasharray="6 4" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="2" strokeDasharray="1 5" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(16, 185, 129, 0.45)" strokeWidth="1.2" />
                <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute text-[8.5px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                Locking
              </div>
              <div className="text-[7.5px] text-slate-500 font-mono text-center">
                Temporal fluctuations stabilized
              </div>
            </div>

            {/* Sustenance Lock feedback values */}
            <div className="text-[10px] text-emerald-305/95 bg-black/60 p-3 rounded border border-emerald-500/10 flex flex-col justify-center gap-1.5 min-h-[90px]">
              <div>
                <div className="flex justify-between border-b border-emerald-950 pb-1">
                  <span className="text-slate-400">stabilizer gate:</span>
                  <span className="font-bold text-emerald-400">1.618x dynamic</span>
                </div>
                <div className="flex justify-between border-b border-emerald-950 py-1">
                  <span className="text-slate-400">sustain epoch:</span>
                  <span className="font-bold text-emerald-300">{(Math.floor(sustainTime / 60)).toString().padStart(2, '0')}:{(sustainTime % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">damping shield:</span>
                  <span className="font-mono text-emerald-400 font-bold">98.4% active</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recommended Nudge Ascendant Pathway section */}
          {nudgeConfig[activeHealing] && (
            <div className="border-t border-emerald-950/70 pt-2.5 flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                  Ascendant Vector: Nudge to {nudgeConfig[activeHealing].title}
                </span>
              </div>
              
              <div className="text-[9px] bg-slate-950/80 p-2 rounded border border-cyan-900/15 text-slate-400 space-y-0.5">
                <p>
                  <strong>Vector Shift:</strong> {nudgeConfig[activeHealing].description}
                </p>
                <p className="text-[#22d3ee]/80">
                  <strong>Expected Benefits:</strong> {nudgeConfig[activeHealing].benefits}
                </p>
              </div>

              {/* Transition Button */}
              <button
                onClick={() => handleNudgeAscension(nudgeConfig[activeHealing].id)}
                disabled={isNudging}
                className="w-full py-1.5 rounded text-[9px] font-bold uppercase bg-gradient-to-r from-emerald-600/90 to-cyan-550/90 hover:from-emerald-500 hover:to-cyan-400 active:scale-95 text-white shadow-md border border-emerald-500/20 font-mono transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-55"
              >
                <Activity className="h-3 w-3 text-white" />
                {isNudging ? 'Shifting Resonance Gates...' : `Execute Ascension: Nudge to ${nudgeConfig[activeHealing].title}`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#050608]/90 border border-slate-850 p-4 rounded-lg flex flex-col items-center justify-center text-center py-5 gap-2">
          <Shield className="h-7 w-7 text-emerald-400 animate-pulse" />
          <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
            Homeostatic Boundary Safe
          </div>
          <p className="text-[10px] text-slate-500 max-w-sm leading-normal">
            Neural feedback patterns are stable. Active filters are tracing real-time brainwave states continuously. Choose a profile from the catalog below to test safety response thresholds.
          </p>
        </div>
      )}

      {/* Neural Danger Profiles Catalog */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wide block border-b border-zinc-800 pb-1 flex items-center gap-1">
          <Activity className="h-3 w-3 text-cyan-400" />
          Neural Risk Catalog & Hazard Controls
        </span>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
          {threats.map((threat) => {
            const isTargetActive = activeThreat === threat.id;
            return (
              <div 
                key={threat.id} 
                className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2.5 ${
                  isTargetActive 
                    ? 'bg-rose-950/20 border-rose-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                    : 'bg-[#050608]/40 border-slate-850 hover:border-slate-800'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <span className={`font-semibold font-display tracking-tight text-[11px] ${isTargetActive ? 'text-rose-400' : 'text-slate-200'}`}>
                      {threat.name}
                    </span>
                    <span className={`px-1 py-0.5 rounded text-[7px] leading-tight shrink-0 font-extrabold ${
                      threat.dangerLevel === 'SYSTEM-LOCK' 
                        ? 'bg-purple-950 text-purple-400' 
                        : threat.dangerLevel === 'EXTREME' 
                        ? 'bg-amber-950 text-amber-500' 
                        : 'bg-rose-950 text-rose-400'
                    }`}>
                      {threat.dangerLevel}
                    </span>
                  </div>
                  
                  {/* Signature badge */}
                  <code className="text-[8px] bg-slate-950 text-cyan-400 border border-slate-900/50 p-1 rounded font-mono block select-all">
                    SIG: {threat.signature}
                  </code>

                  <p className="text-[9px] text-slate-405 text-justify leading-relaxed text-zinc-400 mt-1">
                    {threat.description}
                  </p>
                </div>

                {/* Simulate button */}
                <button
                  onClick={() => {
                    onSimulatePreset(threat.presetId);
                    playSynthesizedChime(threat.id === 'microsleep' ? 'microsleep' : threat.id === 'cognitive_splitting' ? 'splitting' : 'lock');
                  }}
                  className={`w-full py-1 rounded text-[8.5px] uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                    presetMode === threat.presetId && !manualControl
                      ? 'bg-rose-900/40 border-rose-500/70 text-rose-300'
                      : 'bg-black/35 hover:bg-slate-900/50 text-zinc-300 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <Play className="h-2 w-2 text-rose-500 inline-block fill-current" />
                  <span>Simulate {threat.presetId.toUpperCase()} Danger Signature</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
