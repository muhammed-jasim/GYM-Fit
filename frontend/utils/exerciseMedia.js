/**
 * exerciseMedia.js: Canonical asset and media helper for Webryxon FIT.
 * Directs exercises to the official 60FPS hardware-accelerated MP4 videos
 * and crisp 3D anatomical thumbnails downloaded from Hevy.
 */

const KNOWN_SLUGS = [
  'barbell-back-squat',
  'barbell-bench-press',
  'barbell-bent-over-row',
  'barbell-bicep-curl',
  'bulgarian-split-squat',
  'cable-chest-flyes',
  'cable-woodchopper',
  'conventional-deadlift',
  'dips-chest-focus',
  'dumbbell-lateral-raise',
  'face-pulls',
  'hanging-leg-raise',
  'incline-dumbbell-curl',
  'incline-dumbbell-press',
  'lat-pulldown',
  'leg-press',
  'overhead-barbell-press-ohp',
  'plank',
  'pull-ups',
  'romanian-deadlift-rdl',
  'seated-cable-row',
  'skull-crushers-lying-triceps-extension',
  'standing-calf-raise',
  'tricep-rope-pushdown',
];

const ALIASES = {
  // Bench press
  'bench-press': 'barbell-bench-press',
  'bench-press-barbell': 'barbell-bench-press',
  'flat-bench-press': 'barbell-bench-press',
  'barbell-flat-bench-press': 'barbell-bench-press',

  // Squats
  'squat': 'barbell-back-squat',
  'squats': 'barbell-back-squat',
  'back-squat': 'barbell-back-squat',
  'squat-barbell': 'barbell-back-squat',

  // Deadlift
  'deadlift': 'conventional-deadlift',
  'deadlift-barbell': 'conventional-deadlift',
  'barbell-deadlift': 'conventional-deadlift',

  // Overhead press
  'overhead-press': 'overhead-barbell-press-ohp',
  'ohp': 'overhead-barbell-press-ohp',
  'military-press': 'overhead-barbell-press-ohp',
  'barbell-overhead-press': 'overhead-barbell-press-ohp',

  // Rows & Pulls
  'bent-over-row': 'barbell-bent-over-row',
  'barbell-row': 'barbell-bent-over-row',
  'pullup': 'pull-ups',
  'pull-up': 'pull-ups',
  'pullups': 'pull-ups',
  'cable-row': 'seated-cable-row',
  'seated-row': 'seated-cable-row',
  'cable-lat-pulldown': 'lat-pulldown',

  // Incline press
  'incline-press': 'incline-dumbbell-press',
  'incline-bench-press': 'incline-dumbbell-press',
  'incline-dumbbell-bench-press': 'incline-dumbbell-press',

  // Curls
  'bicep-curl': 'barbell-bicep-curl',
  'barbell-curl': 'barbell-bicep-curl',
  'dumbbell-curl': 'incline-dumbbell-curl',
  'dumbbell-bicep-curl': 'incline-dumbbell-curl',

  // Triceps
  'tricep-pushdown': 'tricep-rope-pushdown',
  'triceps-pushdown': 'tricep-rope-pushdown',
  'cable-tricep-pushdown': 'tricep-rope-pushdown',
  'skull-crushers': 'skull-crushers-lying-triceps-extension',
  'skullcrusher': 'skull-crushers-lying-triceps-extension',
  'lying-triceps-extension': 'skull-crushers-lying-triceps-extension',
  'dips': 'dips-chest-focus',
  'chest-dips': 'dips-chest-focus',

  // Shoulders & Chest
  'lateral-raise': 'dumbbell-lateral-raise',
  'side-lateral-raise': 'dumbbell-lateral-raise',
  'face-pull': 'face-pulls',
  'cable-fly': 'cable-chest-flyes',
  'chest-flyes': 'cable-chest-flyes',
  'cable-crossover': 'cable-chest-flyes',

  // Legs & Core
  'rdl': 'romanian-deadlift-rdl',
  'romanian-deadlift': 'romanian-deadlift-rdl',
  'split-squat': 'bulgarian-split-squat',
  'calf-raise': 'standing-calf-raise',
  'leg-raise': 'hanging-leg-raise',
  'woodchopper': 'cable-woodchopper',
};

/**
 * Normalizes any exercise identifier/name into one of the 24 canonical slugs.
 */
export function getCanonicalExerciseSlug(input) {
  if (!input) return 'barbell-bench-press';

  // If already an exercise object
  let raw = '';
  if (typeof input === 'object') {
    raw = input.slug || input.name || '';
  } else {
    raw = String(input);
  }

  const normalized = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (KNOWN_SLUGS.includes(normalized)) {
    return normalized;
  }

  if (ALIASES[normalized]) {
    return ALIASES[normalized];
  }

  // Substring match heuristic
  for (const slug of KNOWN_SLUGS) {
    const slugKeywords = slug.split('-');
    if (slugKeywords.every((kw) => normalized.includes(kw))) {
      return slug;
    }
  }

  for (const [alias, target] of Object.entries(ALIASES)) {
    if (normalized.includes(alias)) {
      return target;
    }
  }

  return 'barbell-bench-press';
}

/**
 * Returns paths for MP4 video, thumbnail PNG, and GIF fallback.
 */
export function getExerciseMediaUrls(input) {
  const slug = getCanonicalExerciseSlug(input);
  return {
    slug,
    mp4Url: `/exercises/${slug}.mp4`,
    gifUrl: `/exercises/${slug}.gif`,
    thumbUrl: `/exercises/${slug}_thumb.png`,
  };
}
