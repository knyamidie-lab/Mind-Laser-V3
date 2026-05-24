export interface BrainwaveBands {
  epsilon: number;
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
  lambda: number;
}

export interface BiometricMetrics {
  attention: number;
  meditation: number;
  chaos: number;
  epsilon_carrier_amplitude?: number;
}

export type EEGConnectionState = 'disconnected' | 'connecting' | 'connected';

export type PresetMode = 'baseline' | 'stillness' | 'chaos' | 'awakened' | 'evolved' | 'phi' | 'solfeggio' | 'microsleep' | 'disorganization' | 'overload';

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  load: number;
  status: 'idle' | 'active' | 'dampened' | 'overloaded';
  x: number;
  y: number;
}

export interface AgentLink {
  source: string;
  target: string;
  strength: number; // 0 to 1
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  telemetrySnapshot?: {
    bands: BrainwaveBands;
    metrics: BiometricMetrics;
    stateLabel: string;
  };
}

export interface CalibrationProfile {
  chaosFloor: number; // Threshold past which High Beta constitutes chaos (µV or relative scale)
  stillnessCeiling: number; // Threshold past which High Alpha/Theta constitutes deep meditation
  gammaThresh: number; // Threshold for flow trigger
}

export const BandColors = {
  epsilon: { bg: 'bg-slate-505', text: 'text-slate-400', border: 'border-slate-800', shadow: 'shadow-[0_0_8px_rgba(100,116,139,0.5)]', glow: 'rgba(100, 116, 139, 0.65)' },
  delta: { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-900', shadow: 'shadow-[0_0_8px_rgba(220,38,38,0.5)]', glow: 'rgba(220, 38, 38, 0.65)' },
  theta: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-900', shadow: 'shadow-[0_0_8px_rgba(249,115,22,0.5)]', glow: 'rgba(249, 115, 22, 0.65)' },
  alpha: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-900', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]', glow: 'rgba(16, 185, 129, 0.65)' },
  beta: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-900', shadow: 'shadow-[0_0_8px_rgba(37,99,235,0.5)]', glow: 'rgba(37, 99, 235, 0.65)' },
  gamma: { bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-900', shadow: 'shadow-[0_0_8px_rgba(139,92,246,0.5)]', glow: 'rgba(139, 92, 246, 0.65)' },
  lambda: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-900', shadow: 'shadow-[0_0_8px_rgba(236,72,153,0.5)]', glow: 'rgba(236, 72, 153, 0.65)' },
};
