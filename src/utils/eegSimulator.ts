import { BrainwaveBands, BiometricMetrics, PresetMode } from '../types';

/**
 * Generates relative brainwave band distributions (percentages summing to 100%)
 * based on selected state presets, with optional small-scale temporal fluctuations.
 */
export function generateWaveBands(
  mode: PresetMode,
  customSliders?: BrainwaveBands,
  timeOffset: number = 0
): BrainwaveBands {
  // CRITICAL FIX: Evaluate custom slider adjustments first so manual overrides work smoothly
  if (customSliders) {
    const epsilon = clamp(customSliders.epsilon + Math.sin(timeOffset * 1.1) * 0.4, 0, 100);
    const delta = clamp(customSliders.delta + Math.sin(timeOffset * 2.0) * 0.4, 0, 100);
    const theta = clamp(customSliders.theta + Math.cos(timeOffset * 1.8) * 0.4, 0, 100);
    const alpha = clamp(customSliders.alpha + Math.sin(timeOffset * 1.6) * 0.4, 0, 100);
    const beta = clamp(customSliders.beta + Math.cos(timeOffset * 1.2) * 0.4, 0, 100);
    const gamma = clamp(customSliders.gamma + Math.sin(timeOffset * 2.2) * 0.4, 0, 100);
    const lambda = clamp(customSliders.lambda + Math.cos(timeOffset * 2.5) * 0.4, 0, 100);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'baseline') {
    const epsilon = clamp(5 + Math.sin(timeOffset * 0.3) * 1, 1, 15);
    const delta = clamp(15 + Math.sin(timeOffset * 0.5) * 2, 5, 30);
    const theta = clamp(18 + Math.cos(timeOffset * 0.7) * 2, 8, 30);
    const alpha = clamp(25 + Math.sin(timeOffset * 0.9) * 3, 10, 45);
    const beta = clamp(30 + Math.cos(timeOffset * 1.1) * 3, 10, 45);
    const gamma = clamp(10 + Math.sin(timeOffset * 1.3) * 1.5, 3, 25);
    const lambda = clamp(2 + Math.sin(timeOffset * 1.6) * 0.5, 0.5, 10);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'stillness') {
    const epsilon = clamp(20 + Math.sin(timeOffset * 0.25) * 3, 15, 35);
    const delta = clamp(10 + Math.sin(timeOffset * 0.3) * 1, 5, 20);
    const theta = clamp(35 + Math.cos(timeOffset * 0.5) * 4, 25, 55);
    const alpha = clamp(32 + Math.sin(timeOffset * 0.8) * 5, 20, 50);
    const beta = clamp(8 + Math.cos(timeOffset * 1.2) * 1.5, 2, 18);
    const gamma = clamp(3 + Math.sin(timeOffset * 1.5) * 0.5, 1, 8);
    const lambda = clamp(1 + Math.sin(timeOffset * 1.8) * 0.5, 0.2, 5);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'chaos') {
    const epsilon = clamp(1 + Math.sin(timeOffset * 0.2) * 0.2, 0.1, 5);
    const delta = clamp(8 + Math.sin(timeOffset * 0.4) * 2, 2, 18);
    const theta = clamp(12 + Math.cos(timeOffset * 0.6) * 2, 5, 20);
    const alpha = clamp(8 + Math.sin(timeOffset * 1.0) * 1.5, 3, 18);
    const beta = clamp(52 + Math.cos(timeOffset * 1.5) * 6, 40, 75);
    const gamma = clamp(18 + Math.sin(timeOffset * 2.0) * 3, 10, 35);
    const lambda = clamp(6 + Math.sin(timeOffset * 2.5) * 1.5, 2, 15);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'awakened') {
    const epsilon = clamp(2 + Math.sin(timeOffset * 0.3) * 0.5, 0.5, 8);
    const delta = clamp(5 + Math.sin(timeOffset * 0.4) * 1, 2, 12);
    const theta = clamp(14 + Math.cos(timeOffset * 0.7) * 2, 5, 25);
    const alpha = clamp(20 + Math.sin(timeOffset * 1.1) * 3, 10, 30);
    const beta = clamp(22 + Math.cos(timeOffset * 1.6) * 4, 15, 35);
    const gamma = clamp(32 + Math.sin(timeOffset * 2.4) * 5, 20, 50);
    const lambda = clamp(15 + Math.sin(timeOffset * 3.0) * 3, 8, 25);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'evolved') {
    const epsilon = clamp(45 + Math.sin(timeOffset * 0.2) * 4, 40, 60);
    const delta = clamp(10 + Math.sin(timeOffset * 0.3) * 1.5, 5, 20);
    const theta = clamp(12 + Math.cos(timeOffset * 0.5) * 1.5, 8, 20);
    const alpha = clamp(8 + Math.sin(timeOffset * 0.7) * 1, 4, 15);
    const beta = clamp(3 + Math.cos(timeOffset * 0.9) * 0.5, 1, 6);
    const gamma = clamp(8 + Math.sin(timeOffset * 1.3) * 1, 4, 15);
    const lambda = clamp(14 + Math.sin(timeOffset * 1.8) * 2, 10, 22);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'phi') {
    const basePhi = 1.618034;
    const breathe = Math.sin(timeOffset * 0.35);
    const epsilon = clamp(12 * Math.pow(basePhi, 0.5) * (1 + breathe * 0.08), 1, 25);
    const delta = clamp(12 * Math.pow(basePhi, 1.0) * (1 - breathe * 0.08), 1, 30);
    const theta = clamp(12 * Math.pow(basePhi, 1.5) * (1 + breathe * 0.08), 1, 35);
    const alpha = clamp(12 * Math.pow(basePhi, 2.0) * (1 - breathe * 0.08), 1, 40);
    const beta = clamp(12 * Math.pow(basePhi, 2.5) * (1 + breathe * 0.08), 1, 45);
    const gamma = clamp(12 * Math.pow(basePhi, 3.0) * (1 - breathe * 0.08), 1, 50);
    const lambda = clamp(12 * Math.pow(basePhi, 3.5) * (1 + breathe * 0.08), 1, 55);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'solfeggio') {
    const pulse = 1.0 + Math.sin(timeOffset * 0.25) * 0.05;
    const epsilon = 9 * pulse;
    const delta = 18 * (2 - pulse);
    const theta = 27 * pulse;
    const alpha = 18 * (2 - pulse);
    const beta = 9 * pulse;
    const gamma = 18 * (2 - pulse);
    const lambda = 9 * pulse;
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'microsleep') {
    const epsilon = clamp(1 + Math.sin(timeOffset * 0.1) * 0.2, 0.5, 3);
    const delta = clamp(65 + Math.sin(timeOffset * 0.3) * 4, 55, 75);
    const theta = clamp(25 + Math.cos(timeOffset * 0.4) * 3, 18, 30);
    const alpha = clamp(4 + Math.sin(timeOffset * 0.6) * 1, 2, 7);
    const beta = clamp(2 + Math.cos(timeOffset * 0.8) * 0.5, 1, 4);
    const gamma = clamp(1 + Math.sin(timeOffset * 1.0) * 0.2, 0.5, 2);
    const lambda = clamp(1 + Math.sin(timeOffset * 1.2) * 0.2, 0.2, 2);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'disorganization') {
    const epsilon = clamp(2 + Math.sin(timeOffset * 0.1) * 0.3, 0.5, 4);
    const delta = clamp(12 + Math.sin(timeOffset * 0.4) * 2, 8, 16);
    const theta = clamp(10 + Math.cos(timeOffset * 0.5) * 1.5, 6, 14);
    const alpha = clamp(3 + Math.sin(timeOffset * 0.7) * 1, 1, 5);
    const beta = clamp(38 + Math.cos(timeOffset * 1.1) * 4, 30, 48);
    const gamma = clamp(28 + Math.sin(timeOffset * 1.6) * 3, 22, 35);
    const lambda = clamp(7 + Math.sin(timeOffset * 2.1) * 1.5, 4, 12);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  if (mode === 'overload') {
    const epsilon = clamp(1 + Math.sin(timeOffset * 0.1) * 0.1, 0.2, 2);
    const delta = clamp(2 + Math.sin(timeOffset * 0.3) * 0.5, 1, 4);
    const theta = clamp(3 + Math.cos(timeOffset * 0.5) * 0.5, 1, 5);
    const alpha = clamp(20 + Math.sin(timeOffset * 0.8) * 2, 12, 26);
    const beta = clamp(15 + Math.cos(timeOffset * 1.1) * 2, 10, 20);
    const gamma = clamp(42 + Math.sin(timeOffset * 1.8) * 5, 34, 55);
    const lambda = clamp(17 + Math.sin(timeOffset * 2.4) * 3, 12, 25);
    return normalizeBands({ epsilon, delta, theta, alpha, beta, gamma, lambda });
  }

  return { epsilon: 10, delta: 15, theta: 15, alpha: 20, beta: 25, gamma: 10, lambda: 5 };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function normalizeBands(bands: BrainwaveBands): BrainwaveBands {
  const sum = bands.epsilon + bands.delta + bands.theta + bands.alpha + bands.beta + bands.gamma + bands.lambda;
  if (sum <= 0) return { epsilon: 10, delta: 15, theta: 15, alpha: 20, beta: 25, gamma: 10, lambda: 5 };
  return {
    epsilon: (bands.epsilon / sum) * 100,
    delta: (bands.delta / sum) * 100,
    theta: (bands.theta / sum) * 100,
    alpha: (bands.alpha / sum) * 100,
    beta: (bands.beta / sum) * 100,
    gamma: (bands.gamma / sum) * 100,
    lambda: (bands.lambda / sum) * 100,
  };
}

export function computeBiometrics(
  bands: BrainwaveBands,
  calibration: { chaosFloor: number; stillnessCeiling: number }
): BiometricMetrics {
  const focusRaw = (bands.beta * 0.8 + bands.gamma * 1.0 + bands.lambda * 1.2) - (bands.delta * 0.4 + bands.epsilon * 0.6);
  const attention = clamp(((focusRaw + 15) / 75) * 100, 5, 100);

  const calmRaw = (bands.alpha * 1.1 + bands.theta * 0.9 + bands.epsilon * 1.3) - (bands.beta * 0.8);
  const stillnessScaled = (calmRaw / calibration.stillnessCeiling) * 100;
  const meditation = clamp(stillnessScaled, 5, 100);

  const betaExcess = Math.max(0, bands.beta - calibration.chaosFloor);
  const chaosRaw = (betaExcess * 2.0) + (bands.delta * 0.2) - (bands.alpha * 0.6 - bands.lambda * 0.5);
  const chaos = clamp(((chaosRaw + 15) / 60) * 100, 5, 100);

  let epsilon_carrier_amplitude = bands.epsilon / 100;
  epsilon_carrier_amplitude = parseFloat(clamp(epsilon_carrier_amplitude, 0.01, 0.98).toFixed(3));

  return {
    attention: Math.round(attention),
    meditation: Math.round(meditation),
    chaos: Math.round(chaos),
    epsilon_carrier_amplitude,
  };
}
