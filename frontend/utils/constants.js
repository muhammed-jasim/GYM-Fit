export const APP_CONFIG = {
  appName: 'FIT',
  companyName: 'Webryxon',
  appUrl: 'https://fit.webryxon.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  primaryColor: '#288474',
};

export const MUSCLE_GROUPS = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs / Quads / Hamstrings' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms / Biceps / Triceps' },
  { value: 'core', label: 'Core / Abs' },
  { value: 'full_body', label: 'Full Body' },
  { value: 'cardio', label: 'Cardio' },
];

export const EQUIPMENT_OPTIONS = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'cable', label: 'Cable Machine' },
  { value: 'machine', label: 'Machine' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'bands', label: 'Resistance Bands' },
  { value: 'other', label: 'Other' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const BARBELL_WEIGHT_KG = 20;
export const BARBELL_WEIGHT_LBS = 45;

export const STANDARD_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
export const STANDARD_PLATES_LBS = [45, 35, 25, 10, 5, 2.5];
