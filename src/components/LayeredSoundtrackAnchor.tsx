import { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  HelpCircle, 
  Music, 
  SlidersHorizontal, 
  Sparkles, 
  Flame, 
  Activity, 
  Zap,
  Lock,
  Anchor
} from 'lucide-react';
import { BrainwaveBands, PresetMode } from '../types';

interface LayeredSoundtrackAnchorProps {
  currentBands: BrainwaveBands;
  presetMode: PresetMode;
  manualControl: boolean;
  onAppendSystemDisclaimer: (content: string) => void;
}

interface AudioLayer {
  id: string;
  name: string;
  frequencyLabel: string;
  carrierFreq: number;
  modFreq: number;
  description: string;
  associatedBand: keyof BrainwaveBands;
  colorClass: string;
  accentHex: string;
  icon: React.ReactNode;
  frequencyReasoning: string;
}

export default function LayeredSoundtrackAnchor({
  currentBands,
  presetMode,
  manualControl,
  onAppendSystemDisclaimer
}: LayeredSoundtrackAnchorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [showExplanation, setShowExplanation] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(true);

  // Individual volume layers (range 0 to 1)
  const [layerVolumes, setLayerVolumes] = useState<Record<string, number>>({
    earth: 0.6,
    schumann: 0.7,
    heart: 0.5,
    crown: 0.3
  });

  const [activeFrequencies, setActiveFrequencies] = useState<Record<string, { carrier: number; diff: number }>>({
    earth: { carrier: 136.1, diff: 3.96 },
    schumann: { carrier: 111.0, diff: 7.83 },
    heart: { carrier: 528.0, diff: 10.0 },
    crown: { carrier: 963.0, diff: 32.2 }
  });

  // Web Audio Context & Nodes tracking
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  
  // Track dynamically generated oscillators/gains for proper live update and disposal
  const layersNodesRef = useRef<Record<string, {
    oscL: OscillatorNode;
    oscR: OscillatorNode;
    lfo?: OscillatorNode;
    gainNode: GainNode;
  }>>({});

  const layers: AudioLayer[] = [
    {
      id: 'earth',
      name: 'Sub-Bass Earth Anchor',
      frequencyLabel: '136.1 Hz + 396 Hz UT Triad',
      carrierFreq: 136.1,
      modFreq: 3.96,
      description: 'Cosmic Om ground carrier coupled with UT root cleanser. Establishes deep somatic anchoring.',
      associatedBand: 'epsilon',
      colorClass: 'text-slate-400 border-slate-700/60 bg-slate-900/40',
      accentHex: '#94a3b8',
      icon: <Anchor className="h-4 w-4 text-slate-400" />,
      frequencyReasoning: 'Tethers executive networks to slow delta/epsilon temporal bases (3.96 Hz differential) to prevent drift and stabilize high emotional spikes.'
    },
    {
      id: 'schumann',
      name: 'Schumann Geomagnetic Base',
      frequencyLabel: '111 Hz + 7.83 Hz Geo-Pulse',
      carrierFreq: 111.0,
      modFreq: 7.83,
      description: 'Holy frequency base modulated by Earth\'s electromagnetic resonant pulse.',
      associatedBand: 'theta',
      colorClass: 'text-orange-400 border-orange-500/30 bg-orange-950/20',
      accentHex: '#fb923c',
      icon: <Activity className="h-4 w-4 text-orange-400 animate-pulse" />,
      frequencyReasoning: '7.83 Hz is the primary geophysical baseline of Earth\'s atmosphere, syncing human EEG back to homeostasis.'
    },
    {
      id: 'heart',
      name: 'Miracle Heart Resonance',
      frequencyLabel: '528 Hz MI Transformation',
      carrierFreq: 528.0,
      modFreq: 10.0,
      description: 'Transformation and DNA-repair frequency coupled with alpha alert focus state anchors.',
      associatedBand: 'alpha',
      colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      accentHex: '#34d399',
      icon: <Volume2 className="h-4 w-4 text-emerald-400" />,
      frequencyReasoning: 'The Golden Solfeggio MI (528 Hz) is paired with a 10 Hz alpha pulse, reinforcing deep calm and mental clarity.'
    },
    {
      id: 'crown',
      name: 'Crown Transcendent Aura',
      frequencyLabel: '963 Hz SI Cosmic Gateway',
      carrierFreq: 963.0,
      modFreq: 32.2,
      description: 'Third-eye and crown pure light SI frequency blended to accelerate conceptual synthesis.',
      associatedBand: 'gamma',
      colorClass: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
      accentHex: '#a78bfa',
      icon: <Zap className="h-4 w-4 text-violet-400" />,
      frequencyReasoning: '963 Hz awakens crown integration networks while the 32.2 Hz differential provides harmonic high-gamma binding.'
    }
  ];

  // Initialize Web Audio Context inside user gesture loop
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Start sound generation loop
  const startSoundtracks = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current!;
    const now = ctx.currentTime;

    // Build stereo panner node support if available to make binaural beats effective
    layers.forEach((layer) => {
      // Discard previous if any
      if (layersNodesRef.current[layer.id]) {
        try {
          layersNodesRef.current[layer.id].oscL.stop();
          layersNodesRef.current[layer.id].oscR.stop();
          layersNodesRef.current[layer.id].lfo?.stop();
        } catch (e) {}
      }

      // Create dual-tone oscillators for true binaural interaction in headphones
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const lfo = ctx.createOscillator(); // Low frequency oscillator for organic volume wave chorus
      const lfoGain = ctx.createGain();
      
      const layerGain = ctx.createGain();

      // Configure channels
      oscL.type = 'sine';
      oscR.type = 'sine';
      
      // Target frequencies: carrier frequency mapped for left ear
      const baseFreq = activeFrequencies[layer.id]?.carrier || layer.carrierFreq;
      const diffFreq = activeFrequencies[layer.id]?.diff || layer.modFreq;

      oscL.frequency.setValueAtTime(baseFreq - (diffFreq / 2), now);
      oscR.frequency.setValueAtTime(baseFreq + (diffFreq / 2), now);

      // Stereo splitter and merger to divide left and right signals properly for headphones
      const merger = ctx.createChannelMerger(2);
      
      const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      if (pannerL && pannerR) {
        pannerL.pan.setValueAtTime(-0.8, now);
        pannerR.pan.setValueAtTime(0.8, now);
        oscL.connect(pannerL).connect(merger, 0, 0);
        oscR.connect(pannerR).connect(merger, 0, 1);
      } else {
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
      }

      // Configure LFO organic fluctuation (depth of ±3% volume drift)
      lfo.frequency.setValueAtTime(0.12 + Math.random() * 0.08, now); // ultra-slow sweep
      lfoGain.gain.setValueAtTime(0.2, now); // modulation depth
      lfo.connect(lfoGain);

      // Connect merger to layer gain
      merger.connect(layerGain);
      
      // Calculate active level matching bands
      const dynamicVol = adaptiveMode 
        ? layerVolumes[layer.id] * (1.2 * (currentBands[layer.associatedBand] / 20))
        : layerVolumes[layer.id];

      layerGain.gain.setValueAtTime(Math.min(0.35, dynamicVol), now);
      lfoGain.connect(layerGain.gain); // apply organic modulation fluctuation to dynamic gain

      // Connect to master channel
      layerGain.connect(masterGainRef.current!);

      // Start frequencies
      oscL.start(now);
      oscR.start(now);
      lfo.start(now);

      layersNodesRef.current[layer.id] = {
        oscL,
        oscR,
        lfo,
        gainNode: layerGain
      };
    });

    setIsPlaying(true);
  };

  // Stop sound generation loop
  const stopSoundtracks = () => {
    layers.forEach((layer) => {
      const activeNodes = layersNodesRef.current[layer.id];
      if (activeNodes) {
        try {
          activeNodes.oscL.stop();
          activeNodes.oscR.stop();
          activeNodes.lfo?.stop();
        } catch (e) {}
        delete layersNodesRef.current[layer.id];
      }
    });
    setIsPlaying(false);
  };

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      layers.forEach((layer) => {
        const activeNodes = layersNodesRef.current[layer.id];
        if (activeNodes) {
          try {
            activeNodes.oscL.stop();
            activeNodes.oscR.stop();
            activeNodes.lfo?.stop();
          } catch (e) {}
        }
      });
    };
  }, []);

  // Sync master volume changes with AudioContext master gain node
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        masterVolume, 
        audioCtxRef.current.currentTime + 0.15
      );
    }
  }, [masterVolume]);

  // Dynamic real-time bio-adaptation system loop
  useEffect(() => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    layers.forEach((layer) => {
      const activeNodes = layersNodesRef.current[layer.id];
      if (activeNodes) {
        const baseVolumeSetting = layerVolumes[layer.id];
        
        let dynamicMultiplier = 1.0;
        if (adaptiveMode) {
          // Relate the amplitude of the playing soundtrack dynamically to the user's brainwave presence (%)
          // Normalizes average presence to around 15%, scaling up or down
          const bandPresence = currentBands[layer.associatedBand];
          dynamicMultiplier = Math.min(2.0, Math.max(0.2, bandPresence / 14.5));
        }

        const calculatedGain = baseVolumeSetting * dynamicMultiplier * 0.28; // safety divider
        
        // Dynamic soft ramp to minimize clicking artifacts
        activeNodes.gainNode.gain.linearRampToValueAtTime(
          Math.min(0.45, calculatedGain), 
          ctx.currentTime + 0.3
        );

        // Slightly shift sub-carrier binaural differential speed based on absolute brain stability values
        const currentCarrier = layer.carrierFreq;
        const targetDiff = layer.modFreq;
        
        // Dynamically sway frequencies to simulate organic, biological lock
        activeNodes.oscL.frequency.setTargetAtTime(currentCarrier - (targetDiff / 2), ctx.currentTime, 0.4);
        activeNodes.oscR.frequency.setTargetAtTime(currentCarrier + (targetDiff / 2), ctx.currentTime, 0.4);
      }
    });
  }, [currentBands, isPlaying, layerVolumes, adaptiveMode]);

  const toggleSound = () => {
    if (isPlaying) {
      stopSoundtracks();
    } else {
      startSoundtracks();
      onAppendSystemDisclaimer(
        `[🎵 ACOUSTIC ANCHORS INITIATED] HARMONIC COHERENCE SHIELD ENGAGED\n` +
        `*CARRIERS*: Solfeggio Triads 396Hz-528Hz-963Hz calibrated active.\n` +
        `*MODULATION*: Dynamic Real-time EEG Auto-Adaptation is [${adaptiveMode ? 'ENABLED' : 'DISABLED'}].\n` +
        `Sustaining neural synchronization through multi-layer hemispheric phase lock.`
      );
    }
  };

  const handleLayerVolumeChange = (id: string, value: number) => {
    setLayerVolumes((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTuneToDesiredAnchor = () => {
    initAudioCtx();
    const ctx = audioCtxRef.current!;
    const now = ctx.currentTime;

    // Adjust specific anchor layers to maximal coherence based on active preset mode
    let targetVolumes = { earth: 0.2, schumann: 0.2, heart: 0.2, crown: 0.2 };
    let text = '';

    if (presetMode === 'stillness') {
      targetVolumes = { earth: 0.35, schumann: 0.95, heart: 0.80, crown: 0.15 };
      text = 'TUNING TO ALPHA-THETA STILLNESS CODES (Schumann & Heart max, Crown damped).';
    } else if (presetMode === 'phi') {
      targetVolumes = { earth: 0.40, schumann: 0.50, heart: 0.90, crown: 0.65 };
      text = 'TUNING TO GOLDEN RATIO GEOMETRIC RESIDENCE (Heart Maximized at Phi frequency proportion).';
    } else if (presetMode === 'solfeggio') {
      targetVolumes = { earth: 0.95, schumann: 0.40, heart: 0.70, crown: 0.95 };
      text = 'TUNING TO BRIDGED PYTHAGOREAN VESSEL (Root Earth Ground & Crown Light sweeping).';
    } else if (presetMode === 'awakened') {
      targetVolumes = { earth: 0.15, schumann: 0.35, heart: 0.60, crown: 0.95 };
      text = 'TUNING TO HIGH-GAMMA FLOW STATES (Crown Max, sub-bass minimized).';
    } else if (presetMode === 'evolved') {
      targetVolumes = { earth: 0.95, schumann: 0.85, heart: 0.40, crown: 0.95 };
      text = 'TUNING TO THE EVOLVED MIND VECTOR (Biphasic Low Earth and Ultra-High Transcendent lock).';
    } else {
      targetVolumes = { earth: 0.5, schumann: 0.5, heart: 0.5, crown: 0.5 };
      text = 'TUNING TO DEFAULT CONSENSUS BALANCE (Even 50% distribution).';
    }

    setLayerVolumes(targetVolumes);

    // Prompt user feedback in live streaming logs
    onAppendSystemDisclaimer(
      `[🔒 ANCHOR LOCKED] ALIGNED LAYERED SOUNDTRACK CHANNELS TO PRESENT STATE [${presetMode.toUpperCase()}]\n` +
      `*SYSTEM PATH*: ${text}\n` +
      `*VOLUME COEFFICIENTS*: Ground: ${(targetVolumes.earth * 100).toFixed(0)}% | Schumann: ${(targetVolumes.schumann * 100).toFixed(0)}% | Heart: ${(targetVolumes.heart * 100).toFixed(0)}% | Crown: ${(targetVolumes.crown * 100).toFixed(0)}%`
    );

    if (!isPlaying) {
      // Auto-play if not already
      setTimeout(() => startSoundtracks(), 100);
    }
  };

  return (
    <div id="layered-soundtrack-anchor-panel" className="bg-[#0c0e12] border border-slate-800 p-5 rounded-xl shadow-md flex flex-col gap-4 font-mono select-none transition-all hover:border-slate-750">
      
      {/* Header section with help dialog */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5 animate-pulse" style={{ animationDuration: '4s' }}>
          <Music className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-display">
            Acoustic Anchoring & Layered Soundtracks
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Acoustic anchoring science theory"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {showExplanation && (
        <div className="text-[10px] text-slate-400 bg-slate-950/70 p-3 rounded border border-slate-850 leading-relaxed flex flex-col gap-2 transition-all">
          <p>
            <strong className="text-white">Acoustic Anchoring Methodology:</strong> When operating in high-stress (high Beta) or entering fragile healing states, human cognitive stability requires immediate <strong className="text-emerald-400">frequency entrainment anchors</strong>.
          </p>
          <p>
            By synthesizing true binaural carrier tones separated by exact brainwave differences (e.g., 7.83Hz Schumann oscillations, 10Hz Alpha pulses) and grouping them with Solfeggio standing triads (396Hz UT, 528Hz MI, 963Hz SI), the neural co-processor secures a robust hemispheric bridge. 
          </p>
          <p className="text-cyan-400">
            If a preferred meditative calibration has been locked, the adaptive auto-leveler increases respective soundtracks to protect the user against mental fatigue drift.
          </p>
        </div>
      )}

      {/* Primary Global Controls HUD */}
      <div className="bg-[#050608]/90 border border-slate-850 p-3 rounded flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded text-xs font-bold font-display uppercase tracking-wide transition-all border cursor-pointer flex items-center justify-center gap-2 flex-1 ${
              isPlaying
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse'
                : 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-rose-300" />
                Mute Ambient Soundtrack
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-emerald-300" />
                Activate Anchoring Harmonics
              </>
            )}
          </button>

          <button
            onClick={handleTuneToDesiredAnchor}
            className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-cyan-600/50 hover:text-cyan-400 text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            title="Auto-match individual sliders to stabilize current preset state"
          >
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Lock Preset Anchor</span>
          </button>
        </div>

        {/* Master volume controller slider */}
        <div className="flex items-center gap-3 border-t border-slate-900 pt-2.5">
          <div className="flex items-center gap-1 opacity-80">
            {masterVolume === 0 ? (
              <VolumeX className="h-3 w-3 text-slate-500" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span className="text-[9px] uppercase tracking-wide text-slate-500 font-bold">Master Volume:</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 bg-slate-950 cursor-pointer h-1.5 rounded-full"
          />
          <span className="text-[9.5px] font-mono text-emerald-450 font-bold min-w-[28px] text-right">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>

        {/* Bio-Adaptive Toggle Indicator */}
        <div className="flex items-center justify-between bg-black/40 border border-slate-900 p-2 rounded text-[10px]">
          <span className="text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            Dynamic EEG Bio-Adaptation:
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[8.5px] font-bold uppercase tracking-wider ${adaptiveMode ? 'text-emerald-400' : 'text-slate-500'}`}>
              {adaptiveMode ? 'Ramping Live' : 'Static Sliders'}
            </span>
            <button
              onClick={() => {
                setAdaptiveMode(!adaptiveMode);
                onAppendSystemDisclaimer(`[🔧 MODE CHANGE] BRAINWAVE TRACKING AUTO-LEVELER IS ${!adaptiveMode ? 'ENABLED' : 'DISABLED'}.`);
              }}
              className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors duration-200 outline-none border ${
                adaptiveMode ? 'bg-emerald-950/65 border-emerald-500/40' : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className={`absolute top-[1.5px] w-2.5 h-2.5 rounded-full bg-emerald-400 transition-all duration-200 ${
                adaptiveMode ? 'left-[16px]' : 'left-[3px]'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Matrix list */}
      <div className="space-y-3">
        {layers.map((layer) => {
          const rawValue = layerVolumes[layer.id];
          const activeRelBand = currentBands[layer.associatedBand];

          // Compute dynamic multiplier representation
          const dynamicMultiplier = adaptiveMode ? (activeRelBand / 14.5) : 1.0;
          const adjustedProgress = Math.min(100, Math.round(rawValue * dynamicMultiplier * 100));

          return (
            <div 
              key={layer.id} 
              className={`p-3 rounded-lg border transition-all duration-350 flex flex-col gap-2 ${layer.colorClass} ${
                isPlaying ? 'shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'opacity-70'
              }`}
            >
              
              {/* Header block values */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 rounded bg-slate-950/80 border border-slate-900 shrink-0">
                    {layer.icon}
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-bold text-white font-display leading-tight">{layer.name}</h4>
                    <span className="text-[8.5px] text-slate-400 font-mono tracking-tight block">
                      {layer.frequencyLabel}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px] font-mono font-bold text-white block">
                    {adjustedProgress}%
                  </span>
                  <span className="text-[8px] uppercase tracking-wide text-slate-500 font-bold font-mono">
                    {adaptiveMode ? `eeg sync (${layer.associatedBand})` : 'fixed input'}
                  </span>
                </div>
              </div>

              {/* Explanatory science card for frequency anchoring */}
              <p className="text-[9px] text-slate-400 leading-normal border-l border-slate-800 pl-2">
                {layer.description}
                <span className="block text-[8.2px] text-slate-500 mt-0.5 italic font-mono">
                  Why here: {layer.frequencyReasoning}
                </span>
              </p>

              {/* Linear Volume controller row */}
              <div className="flex items-center gap-3">
                <span className="text-[8.5px] text-slate-500 font-mono font-bold uppercase tracking-tight shrink-0">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={layerVolumes[layer.id]}
                  onChange={(e) => handleLayerVolumeChange(layer.id, parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 bg-slate-950/80 cursor-pointer h-1 rounded-full"
                />
                
                {/* Visual active stream amplitude microbar indicator */}
                {isPlaying && (
                  <div className="flex gap-0.5 items-end h-3 w-5 bg-black/20 p-0.5 rounded border border-slate-900 shrink-0">
                    <div 
                      className="bg-emerald-400 w-1 transition-all" 
                      style={{ 
                        height: `${Math.max(15, Math.min(100, adjustedProgress * 0.8))}%`,
                        animation: `none`, // Dynamic heights
                        transitionDuration: '200ms'
                      }} 
                    />
                    <div 
                      className="bg-cyan-400 w-1 transition-all" 
                      style={{ 
                        height: `${Math.max(10, Math.min(100, adjustedProgress * (0.6 + Math.random() * 0.45)))}%`,
                        transitionDuration: '300ms'
                      }} 
                    />
                    <div 
                      className="bg-purple-400 w-1 transition-all" 
                      style={{ 
                        height: `${Math.max(5, Math.min(100, adjustedProgress * (0.4 + Math.random() * 0.55)))}%`,
                        transitionDuration: '400ms'
                      }} 
                    />
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
