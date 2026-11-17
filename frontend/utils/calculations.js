import { BARBELL_WEIGHT_KG, BARBELL_WEIGHT_LBS, STANDARD_PLATES_KG, STANDARD_PLATES_LBS } from './constants';

/**
 * Calculates estimated 1 Rep Max using Epley formula.
 * Epley: 1RM = weight * (1 + reps / 30)
 */
export function calculate1RM(weight, reps) {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return w;
  return Math.round((w * (1 + r / 30)) * 10) / 10;
}

/**
 * Calculates plate breakdown per side for a barbell exercise.
 */
export function calculateBarbellPlates(totalWeight, unit = 'kg') {
  const isLbs = unit === 'lbs';
  const barbell = isLbs ? BARBELL_WEIGHT_LBS : BARBELL_WEIGHT_KG;
  const availablePlates = isLbs ? STANDARD_PLATES_LBS : STANDARD_PLATES_KG;

  const target = parseFloat(totalWeight) || 0;
  if (target <= barbell) {
    return {
      barbellWeight: barbell,
      perSideWeight: 0,
      platesPerSide: [],
      remainingWeight: 0,
    };
  }

  let weightPerSide = (target - barbell) / 2;
  const platesPerSide = [];

  for (const plate of availablePlates) {
    while (weightPerSide >= plate) {
      platesPerSide.push(plate);
      weightPerSide = Math.round((weightPerSide - plate) * 100) / 100;
    }
  }

  return {
    barbellWeight: barbell,
    perSideWeight: (target - barbell) / 2,
    platesPerSide,
    remainingWeight: weightPerSide * 2,
  };
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(totalSeconds) {
  const s = parseInt(totalSeconds, 10) || 0;
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatShortDuration(totalSeconds) {
  const s = parseInt(totalSeconds, 10) || 0;
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Convert kg to lbs or vice versa
 */
export function convertWeight(val, fromUnit, toUnit) {
  const v = parseFloat(val) || 0;
  if (fromUnit === toUnit) return v;
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round((v * 2.20462) * 10) / 10;
  }
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round((v / 2.20462) * 10) / 10;
  }
  return v;
}
