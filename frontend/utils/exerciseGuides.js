// Comprehensive coaching, anatomical, and movement data for Webryxon FIT exercises

export const EXERCISE_GUIDES = {
  // 1. Barbell Bench Press
  'barbell-bench-press': {
    id: 1,
    name: 'Barbell Bench Press',
    equipment: 'Barbell',
    primaryMuscle: 'Chest',
    primaryMuscleScientific: 'Pectoralis Major (Sternal & Clavicular)',
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids', 'Serratus Anterior'],
    mechanics: 'Compound',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    animationType: 'bench_press',
    muscleActivation: {
      primary: { name: 'Chest (Pectorals)', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Front Deltoids', percent: 70, color: '#fa8c16' },
      secondary2: { name: 'Triceps', percent: 65, color: '#fadb14' },
      stabilizers: { name: 'Lats & Core', percent: 45, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Bench & Eye Alignment', text: 'Lie flat on the bench with your eyes directly under the racked barbell. Plant feet firmly flat on the floor.' },
      { step: 2, title: 'Scapular Retraction & Grip', text: 'Retract your shoulder blades and pinch them into the bench to form a solid shelf. Grip the bar slightly wider than shoulder-width with a full thumb-around grip.' },
      { step: 3, title: 'Unrack & Set Arch', text: 'Inhale deeply, squeeze lats, and unrack the bar by pushing up and pulling it directly over your mid-chest with arms locked.' },
      { step: 4, title: 'Controlled Descent (Eccentric)', text: 'Lower the bar under control over 2-3 seconds, tucking elbows at roughly 45-75 degrees until the bar touches your lower-mid sternum.' },
      { step: 5, title: 'Explosive Drive (Concentric)', text: 'Drive your feet into the floor (leg drive) and press the barbell forcefully back up along a slight diagonal arc to the starting lockout.' }
    ],
    breathing: {
      inhale: 'Take a huge belly breath into your diaphragm at the top and brace your core (Valsalva maneuver) before descending.',
      exhale: 'Exhale forcefully past the sticking point (about halfway up) or at full lockout.'
    },
    commonMistakes: [
      { mistake: 'Flaring elbows 90 degrees to torso', fix: 'Keep elbows tucked at roughly 45 to 70 degrees to protect the rotator cuff.' },
      { mistake: 'Bouncing the barbell off the sternum', fix: 'Pause for a brief fraction of a second at the chest to keep mechanical tension on the pecs.' },
      { mistake: 'Lifting glutes off the bench', fix: 'Keep hips firmly planted; generate leg drive forward rather than upward.' },
      { mistake: 'Limp or bent wrists', fix: 'Rest the bar in the heel of your palm so your knuckles point upward.' }
    ],
    proCue: 'Imagine bending the bar in half inward - this automatically fires your lats and creates unbreakable shoulder stability.',
    overloadProtocol: 'Add +2.5 kg when you hit all sets at your target reps with clean form and RPE <= 8.'
  },

  // 2. Incline Dumbbell Press
  'incline-dumbbell-press': {
    id: 2,
    name: 'Incline Dumbbell Press',
    equipment: 'Dumbbell',
    primaryMuscle: 'Upper Chest',
    primaryMuscleScientific: 'Pectoralis Major (Clavicular Head)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    mechanics: 'Compound',
    movementPattern: 'Incline Push',
    difficulty: 'Intermediate',
    animationType: 'incline_press',
    muscleActivation: {
      primary: { name: 'Upper Chest (Clavicular)', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Anterior Deltoid', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Triceps', percent: 60, color: '#fadb14' },
      stabilizers: { name: 'Rotator Cuff', percent: 50, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Bench Angle', text: 'Set an adjustable bench to a 30 to 45 degree incline (higher targets shoulders more than upper pecs).' },
      { step: 2, title: 'Kicking Up Weights', text: 'Sit with dumbbells on your knees. Kick one knee up, then the other, to hoist the dumbbells to shoulder height.' },
      { step: 3, title: 'Starting Position', text: 'Retract scapulae, arch your thoracic spine slightly, and hold dumbbells with palms angled 45 degrees.' },
      { step: 4, title: 'Press & Converge', text: 'Press upward and slightly inward along a natural arc without clanking the dumbbells at the top.' }
    ],
    breathing: {
      inhale: 'Inhale deeply on the way down as you feel a deep stretch in the upper pecs.',
      exhale: 'Exhale as you press the dumbbells to the top.'
    },
    commonMistakes: [
      { mistake: 'Incline angle too steep (>45 deg)', fix: 'Keep bench between 30 and 45 degrees to avoid shifting focus entirely to front delts.' },
      { mistake: 'Clanking dumbbells together at top', fix: 'Stop just short of touching to keep constant continuous tension on the muscle fibers.' }
    ],
    proCue: 'Think about bringing your biceps across your chest to meet each other at the peak of the movement.',
    overloadProtocol: 'Progress by +1.25 kg to +2 kg per dumbbell once you exceed rep target on all sets.'
  },

  // 3. Cable Chest Flyes
  'cable-chest-flyes': {
    id: 3,
    name: 'Cable Chest Flyes',
    equipment: 'Cable Machine',
    primaryMuscle: 'Chest',
    primaryMuscleScientific: 'Pectoralis Major (Sternal & Inner Squeeze)',
    secondaryMuscles: ['Anterior Deltoids', 'Biceps Brachii (Short Head)'],
    mechanics: 'Isolation',
    movementPattern: 'Horizontal Adduction',
    difficulty: 'Beginner',
    animationType: 'cable_flyes',
    muscleActivation: {
      primary: { name: 'Pectoralis Major', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Anterior Deltoids', percent: 45, color: '#fa8c16' },
      secondary2: { name: 'Core Stabilizers', percent: 50, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Cable Height', text: 'Set pulleys to chest or slightly above shoulder level with D-handles.' },
      { step: 2, title: 'Staggered Stance', text: 'Grasp both handles, step forward with one foot staggered for balance, with a slight torso forward lean.' },
      { step: 3, title: 'Arm Arc & Soft Elbows', text: 'Keep a slight 10-15 degree bend in your elbows throughout the entire movement.' },
      { step: 4, title: 'Hug the Tree Squeeze', text: 'Bring handles together in front of your chest in a hugging motion and hold the peak squeeze for 1 second.' }
    ],
    breathing: {
      inhale: 'Inhale as your arms open wide for the chest stretch.',
      exhale: 'Exhale during the closing squeeze.'
    },
    commonMistakes: [
      { mistake: 'Turning the fly into a press', fix: 'Lock elbow angle in place; do not push with your triceps.' }
    ],
    proCue: 'Imagine hugging a massive redwood tree trunk.',
    overloadProtocol: 'Increase by smallest cable pin increment (+1.25kg) or add +2 reps with slower tempo.'
  },

  // 4. Dips (Chest Focus)
  'dips-chest-focus': {
    id: 4,
    name: 'Dips (Chest Focus)',
    equipment: 'Bodyweight / Parallel Bars',
    primaryMuscle: 'Chest & Lower Pecs',
    primaryMuscleScientific: 'Pectoralis Major (Costal Head) & Triceps',
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids'],
    mechanics: 'Compound',
    movementPattern: 'Vertical Push',
    difficulty: 'Intermediate',
    animationType: 'dips',
    muscleActivation: {
      primary: { name: 'Lower Chest', percent: 90, color: '#ff4d4f' },
      secondary1: { name: 'Triceps', percent: 80, color: '#fa8c16' },
      secondary2: { name: 'Front Deltoids', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Mount & Grip', text: 'Mount the parallel bars and lock out elbows.' },
      { step: 2, title: 'Forward Torso Lean', text: 'Lean your torso forward at approximately 30 degrees and bend knees slightly.' },
      { step: 3, title: 'Descent Depth', text: 'Lower yourself until your shoulders are slightly below or parallel to your elbows.' },
      { step: 4, title: 'Press Up', text: 'Drive through your palms while maintaining the forward lean to keep emphasis on the pecs.' }
    ],
    breathing: {
      inhale: 'Inhale deeply as you descend into the stretch.',
      exhale: 'Exhale forcefully as you drive back to starting position.'
    },
    commonMistakes: [
      { mistake: 'Staying fully upright', fix: 'Staying vertical shifts workload to triceps; lean forward to hit the chest.' }
    ],
    proCue: 'Push the bars away from your ribs while keeping your elbows slightly flared.',
    overloadProtocol: 'Add a dip belt with +2.5kg to +5kg plates once you can do 3 sets of 12 bodyweight dips.'
  },

  // 5. Conventional Deadlift
  'conventional-deadlift': {
    id: 5,
    name: 'Conventional Deadlift',
    equipment: 'Barbell',
    primaryMuscle: 'Posterior Chain & Back',
    primaryMuscleScientific: 'Erector Spinae, Gluteus Maximus, Hamstrings',
    secondaryMuscles: ['Trapezius', 'Lats', 'Quadriceps', 'Forearms'],
    mechanics: 'Compound',
    movementPattern: 'Hip Hinge',
    difficulty: 'Advanced',
    animationType: 'deadlift',
    muscleActivation: {
      primary: { name: 'Glutes & Hamstrings', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Erectors / Lower Back', percent: 90, color: '#fa8c16' },
      secondary2: { name: 'Traps & Lats', percent: 75, color: '#fadb14' },
      stabilizers: { name: 'Grip & Core', percent: 85, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Foot Placement', text: 'Stand with feet hip-width apart, with the barbell cutting your mid-foot in half (about 1 inch from shins).' },
      { step: 2, title: 'Hinge to Bar', text: 'Hinge back at the hips without bending knees much until your hands reach the bar just outside your shins.' },
      { step: 3, title: 'Shins to Bar & Chest Proud', text: 'Bring shins forward to touch the bar, drop hips slightly, pull slack out of the barbell with a click, and lock lats.' },
      { step: 4, title: 'Leg Press the Floor', text: 'Take a deep belly breath, brace 360 degrees, and push the floor away with your legs until the bar passes knees.' },
      { step: 5, title: 'Lockout', text: 'Drive hips forward into the bar to finish tall without hyper-extending your lower back.' }
    ],
    breathing: {
      inhale: 'Deep diaphragmatic inhale and hard abdominal brace before the bar leaves the floor.',
      exhale: 'Exhale smoothly at lockout or after lowering back to dead stop.'
    },
    commonMistakes: [
      { mistake: 'Rounding the lumbar spine (cat back)', fix: 'Engage lats, keep chest high, and brace abs like you are preparing for a punch.' },
      { mistake: 'Bar drifting away from body', fix: 'Keep bar rolling against your socks/shins and thighs throughout the pull.' },
      { mistake: 'Jerking the bar off the floor', fix: 'Pull the slack out of the bar first until you hear a metallic click, then push into the floor.' }
    ],
    proCue: 'Do not think of pulling the bar up - think of leg pressing the earth away from you.',
    overloadProtocol: 'Add +2.5 kg to +5 kg weekly or bi-weekly while keeping back straight.'
  },

  // 6. Barbell Bent Over Row
  'barbell-bent-over-row': {
    id: 6,
    name: 'Barbell Bent Over Row',
    equipment: 'Barbell',
    primaryMuscle: 'Back',
    primaryMuscleScientific: 'Latissimus Dorsi, Rhomboids, Trapezius',
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoids', 'Erector Spinae'],
    mechanics: 'Compound',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Intermediate',
    animationType: 'barbell_row',
    muscleActivation: {
      primary: { name: 'Lats & Rhomboids', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Upper Traps & Rear Delts', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Biceps', percent: 65, color: '#fadb14' },
      stabilizers: { name: 'Spinal Erectors', percent: 70, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Stance & Grip', text: 'Feet hip-width apart. Grip barbell slightly wider than shoulder-width with pronated or supinated grip.' },
      { step: 2, title: 'Torso Angle', text: 'Hinge at the hips until your torso is approximately 45 degrees to the floor, spine rigid.' },
      { step: 3, title: 'Row to Belly Button', text: 'Pull your elbows back behind your torso, directing the barbell toward your lower abdomen/navel.' },
      { step: 4, title: 'Squeeze & Lower', text: 'Squeeze your shoulder blades together at the apex, then lower under control.' }
    ],
    breathing: {
      inhale: 'Inhale at the bottom as arms extend.',
      exhale: 'Exhale dynamically as you row the bar to your belly.'
    },
    commonMistakes: [
      { mistake: 'Standing too upright using body English', fix: 'Maintain your hinge angle; avoid turning it into a shrug.' }
    ],
    proCue: 'Drive your elbows back toward the ceiling rather than pulling with your hands.',
    overloadProtocol: 'Add +2.5 kg once all sets can be completed with minimal torso bobbing.'
  },

  // 7. Lat Pulldown
  'lat-pulldown': {
    id: 7,
    name: 'Lat Pulldown',
    equipment: 'Cable Machine',
    primaryMuscle: 'Lats (Back)',
    primaryMuscleScientific: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Rhomboids', 'Brachialis'],
    mechanics: 'Compound',
    movementPattern: 'Vertical Pull',
    difficulty: 'Beginner',
    animationType: 'lat_pulldown',
    muscleActivation: {
      primary: { name: 'Latissimus Dorsi', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Biceps & Brachialis', percent: 70, color: '#fa8c16' },
      secondary2: { name: 'Rhomboids & Mid-Traps', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Pad Adjustment', text: 'Adjust the thigh pad so your knees are firmly anchored with flat feet on the ground.' },
      { step: 2, title: 'Wide Grip', text: 'Grip the wide lat bar with hands just outside the bends, thumbs over the bar (thumbless grip reduces bicep recruitment).' },
      { step: 3, title: 'Chest Lean & Pull', text: 'Lean back slightly (10-15 degrees) with chest tall. Pull elbows down and back toward your back pockets until the bar touches your upper chest.' },
      { step: 4, title: 'Full Stretch Return', text: 'Release the bar upward smoothly allowing your lats and shoulder blades to fully elevate for a deep stretch.' }
    ],
    breathing: {
      inhale: 'Inhale deeply as the bar ascends into the full stretch.',
      exhale: 'Exhale forcefully as you drive elbows down to chest.'
    },
    commonMistakes: [
      { mistake: 'Pulling the bar behind the neck', fix: 'Always pull to your front upper chest to protect the cervical spine.' },
      { mistake: 'Swinging violently backwards', fix: 'Keep torso stationary; movement should come from scapulae and elbows.' }
    ],
    proCue: 'Think about pulling from your elbows down into your back pockets.',
    overloadProtocol: 'Add +2.5kg to +5kg pin stack increment once you hit 12 reps on all sets.'
  },

  // 8. Pull-Ups
  'pull-ups': {
    id: 8,
    name: 'Pull-Ups',
    equipment: 'Bodyweight / Pull-up Bar',
    primaryMuscle: 'Lats & Upper Back',
    primaryMuscleScientific: 'Latissimus Dorsi, Teres Major, Rhomboids',
    secondaryMuscles: ['Biceps Brachii', 'Forearms', 'Core'],
    mechanics: 'Compound',
    movementPattern: 'Vertical Pull',
    difficulty: 'Intermediate',
    animationType: 'pull_up',
    muscleActivation: {
      primary: { name: 'Lats', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Biceps & Forearms', percent: 80, color: '#fa8c16' },
      secondary2: { name: 'Core Stabilizers', percent: 65, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Overhand Grip', text: 'Grip the bar slightly wider than shoulder width with palms facing away from you (pronated).' },
      { step: 2, title: 'Dead Hang & Scapular Depression', text: 'Start from a dead hang, then depress your shoulder blades to activate the back before bending elbows.' },
      { step: 3, title: 'Drive Chin Over Bar', text: 'Pull elbows downward toward your ribs until your chin clears the bar cleanly.' },
      { step: 4, title: 'Lower to Full Extension', text: 'Lower yourself under strict control back to a full dead hang.' }
    ],
    breathing: {
      inhale: 'Inhale on the way down.',
      exhale: 'Exhale as you pull your chest toward the bar.'
    },
    commonMistakes: [
      { mistake: 'Kicking legs or kipping', fix: 'Cross ankles and squeeze glutes/core to keep legs still.' }
    ],
    proCue: 'Lead with your chest toward the ceiling.',
    overloadProtocol: 'Use a weight belt to add +2.5kg when you can do 3x10 strict reps.'
  },

  // 9. Seated Cable Row
  'seated-cable-row': {
    id: 9,
    name: 'Seated Cable Row',
    equipment: 'Cable Machine',
    primaryMuscle: 'Mid Back',
    primaryMuscleScientific: 'Rhomboids, Middle Trapezius, Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids', 'Erector Spinae'],
    mechanics: 'Compound',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Beginner',
    animationType: 'cable_row',
    muscleActivation: {
      primary: { name: 'Mid Back & Rhomboids', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Lats', percent: 85, color: '#fa8c16' },
      secondary2: { name: 'Biceps', percent: 60, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Foot Placement', text: 'Sit with feet on the platform, knees slightly bent (not locked).' },
      { step: 2, title: 'V-Bar Grip', text: 'Grasp the handle, push back into position with upright torso and slight natural arch.' },
      { step: 3, title: 'Pull to Abdomen', text: 'Pull handle into your lower ribs/upper abdomen, squeezing shoulder blades together firmly.' },
      { step: 4, title: 'Reach Forward', text: 'Extend arms forward allowing shoulder blades to protract for a complete stretch.' }
    ],
    breathing: {
      inhale: 'Inhale as you let the weight pull arms forward.',
      exhale: 'Exhale as you pull and retract your shoulder blades.'
    },
    commonMistakes: [
      { mistake: 'Swinging torso back and forth excessively', fix: 'Torso should remain almost perpendicular to the floor.' }
    ],
    proCue: 'Pinch a pencil between your shoulder blades at peak contraction.',
    overloadProtocol: 'Increase weight by +2.5kg to +5kg.'
  },

  // 10. Overhead Barbell Press (OHP)
  'overhead-barbell-press-ohp': {
    id: 10,
    name: 'Overhead Barbell Press (OHP)',
    equipment: 'Barbell',
    primaryMuscle: 'Shoulders',
    primaryMuscleScientific: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core Stabilizers'],
    mechanics: 'Compound',
    movementPattern: 'Vertical Push',
    difficulty: 'Intermediate',
    animationType: 'ohp',
    muscleActivation: {
      primary: { name: 'Anterior & Side Delts', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Triceps', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Upper Traps & Core', percent: 70, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Rack Height & Grip', text: 'Barbell at collarbone height. Grip just outside shoulders with vertical forearms.' },
      { step: 2, title: 'Front Rack & Glute Squeeze', text: 'Unrack bar onto front delts/clavicles. Squeeze glutes and quads tight to create a solid pillar.' },
      { step: 3, title: 'Head Path & Press', text: 'Tilt head slightly back to clear chin path, and press the bar vertically in a straight line.' },
      { step: 4, title: 'Head Through Window', text: 'Once the bar clears your forehead, push head forward into neutral and lock out directly over mid-foot.' }
    ],
    breathing: {
      inhale: 'Inhale and brace core at bottom.',
      exhale: 'Exhale forcefully past the top of your head to lockout.'
    },
    commonMistakes: [
      { mistake: 'Excessive lower back arch', fix: 'Squeeze glutes and brace abs tightly to prevent hyperextending lumbar.' }
    ],
    proCue: 'Push your head through the window created by your arms at lockout.',
    overloadProtocol: 'Use micro-plates (+1.25 kg total) for the OHP as shoulders adapt in smaller steps.'
  },

  // 11. Dumbbell Lateral Raise
  'dumbbell-lateral-raise': {
    id: 11,
    name: 'Dumbbell Lateral Raise',
    equipment: 'Dumbbell',
    primaryMuscle: 'Side Delts',
    primaryMuscleScientific: 'Lateral Deltoid',
    secondaryMuscles: ['Anterior Deltoids', 'Trapezius', 'Supraspinatus'],
    mechanics: 'Isolation',
    movementPattern: 'Shoulder Abduction',
    difficulty: 'Beginner',
    animationType: 'lateral_raise',
    muscleActivation: {
      primary: { name: 'Lateral Deltoids', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Upper Trapezius', percent: 40, color: '#fa8c16' },
      secondary2: { name: 'Rotator Cuff', percent: 35, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Stance & Posture', text: 'Stand tall with feet hip-width, holding dumbbells at sides or slightly in front of thighs.' },
      { step: 2, title: 'Slight Elbow Bend & Lean', text: 'Bend elbows 10-15 degrees and maintain a subtle 5-degree forward torso tilt.' },
      { step: 3, title: 'Raise to Sides', text: 'Raise arms out to sides in the scapular plane until elbows reach shoulder height.' },
      { step: 4, title: 'Slow 2-Second Lower', text: 'Lower slowly under resistance back to thighs.' }
    ],
    breathing: {
      inhale: 'Inhale as dumbbells descend.',
      exhale: 'Exhale as you raise outward.'
    },
    commonMistakes: [
      { mistake: 'Shrugging shoulders with upper traps', fix: 'Keep shoulder blades down; lead with elbows, not wrists.' },
      { mistake: 'Using heavy momentum swinging', fix: 'Pick lighter dumbbells; prioritize strict lateral delt contraction.' }
    ],
    proCue: 'Think about pushing the walls away from you rather than lifting the dumbbells up.',
    overloadProtocol: 'Progress by +1 kg dumbbells or adding reps (e.g. from 12 reps to 15 reps).'
  },

  // 12. Face Pulls
  'face-pulls': {
    id: 12,
    name: 'Face Pulls',
    equipment: 'Cable Machine',
    primaryMuscle: 'Rear Delts & Rotator Cuff',
    primaryMuscleScientific: 'Posterior Deltoid, Infraspinatus, Teres Minor, Lower Traps',
    secondaryMuscles: ['Rhomboids', 'Biceps'],
    mechanics: 'Compound / Isolation',
    movementPattern: 'Horizontal Pull + External Rotation',
    difficulty: 'Beginner',
    animationType: 'face_pull',
    muscleActivation: {
      primary: { name: 'Rear Deltoids', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Rotator Cuff & Lower Traps', percent: 85, color: '#fa8c16' },
      secondary2: { name: 'Mid Traps', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Rope Attachment', text: 'Set cable pulley slightly above eye level with a long rope attachment.' },
      { step: 2, title: 'Thumbs-Back Grip', text: 'Grasp rope with thumbs pointing toward you and palms facing downward.' },
      { step: 3, title: 'Pull & Externally Rotate', text: 'Pull rope directly toward your forehead/eyes while rotating your hands backward so knuckles face the ceiling at completion.' },
      { step: 4, title: 'Hold Squeeze', text: 'Hold the double-bicep pose at the top for 1 full second.' }
    ],
    breathing: {
      inhale: 'Inhale as arms extend forward.',
      exhale: 'Exhale as you pull and spread the rope apart.'
    },
    commonMistakes: [
      { mistake: 'Going too heavy and turning into a row', fix: 'Keep elbows high and focus on external rotation of shoulder.' }
    ],
    proCue: 'Finish each rep looking like you are hitting a front double bicep pose.',
    overloadProtocol: 'Add +1.25kg to +2.5kg cable pin or perform 15-20 clean reps.'
  },

  // 13. Barbell Back Squat
  'barbell-back-squat': {
    id: 13,
    name: 'Barbell Back Squat',
    equipment: 'Barbell',
    primaryMuscle: 'Quads & Glutes',
    primaryMuscleScientific: 'Quadriceps Femoris, Gluteus Maximus, Adductor Magnus',
    secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Calves', 'Core'],
    mechanics: 'Compound',
    movementPattern: 'Knee Extension / Squat',
    difficulty: 'Intermediate',
    animationType: 'squat',
    muscleActivation: {
      primary: { name: 'Quadriceps', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Gluteus Maximus', percent: 90, color: '#fa8c16' },
      secondary2: { name: 'Hamstrings & Adductors', percent: 70, color: '#fadb14' },
      stabilizers: { name: 'Spinal Erectors & Core', percent: 85, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Bar Placement', text: 'Set bar at armpit height. Position barbell across upper traps (high bar) or across rear delts (low bar).' },
      { step: 2, title: 'Unrack & Step Back', text: 'Stand tall to unrack. Take three deliberate steps back: 1 back with dominant foot, 1 back with other foot, 1 adjust width.' },
      { step: 3, title: 'Stance & Rooting', text: 'Feet shoulder-width apart, toes turned out 15-30 degrees. Grip floor with tripod foot (heel, big toe, pinky toe).' },
      { step: 4, title: 'Breathe & Descend', text: 'Take a huge belly breath, break at hips and knees simultaneously, driving knees out in line with toes until crease of hip is below top of knee (below parallel).' },
      { step: 5, title: 'Drive to Stand', text: 'Drive mid-foot through the floor, keeping chest proud and knees out, standing up to full extension.' }
    ],
    breathing: {
      inhale: 'Belly breath and brace hard at the top before descending.',
      exhale: 'Exhale through pursed lips past the sticking point on the ascent.'
    },
    commonMistakes: [
      { mistake: 'Knees caving inward (valgus collapse)', fix: 'Actively push knees out to the sides along your toe angles.' },
      { mistake: 'Heels lifting off the ground', fix: 'Center balance over the middle of your foot; work on ankle dorsiflexion.' },
      { mistake: 'Good-morning squat (hips shoot up first)', fix: 'Keep chest angle constant by driving upper back into the bar.' }
    ],
    proCue: 'Screw your feet into the floor outward to engage hips and create pelvic torque.',
    overloadProtocol: 'Add +2.5 kg to +5 kg every week you hit your target reps with clean depth.'
  },

  // 14. Romanian Deadlift (RDL)
  'romanian-deadlift-rdl': {
    id: 14,
    name: 'Romanian Deadlift (RDL)',
    equipment: 'Barbell',
    primaryMuscle: 'Hamstrings & Glutes',
    primaryMuscleScientific: 'Biceps Femoris, Semitendinosus, Gluteus Maximus',
    secondaryMuscles: ['Erector Spinae', 'Trapezius', 'Forearms'],
    mechanics: 'Compound',
    movementPattern: 'Hip Hinge',
    difficulty: 'Intermediate',
    animationType: 'rdl',
    muscleActivation: {
      primary: { name: 'Hamstrings', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Glutes', percent: 85, color: '#fa8c16' },
      secondary2: { name: 'Lower Back', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Starting Position', text: 'Stand tall with barbell at hip height, feet hip-width apart, soft bend in knees.' },
      { step: 2, title: 'Hinge Backward', text: 'Push your hips straight back as if trying to touch the wall behind you with your glutes.' },
      { step: 3, title: 'Bar Along Legs', text: 'Keep the barbell sliding down your thighs and shins until you feel an intense stretch in hamstrings (around mid-shin).' },
      { step: 4, title: 'Drive Hips Forward', text: 'Squeeze hamstrings and glutes to snap hips back to standing position.' }
    ],
    breathing: {
      inhale: 'Inhale and brace core as you hinge back.',
      exhale: 'Exhale as you drive hips forward to lockout.'
    },
    commonMistakes: [
      { mistake: 'Bending knees too much turning it into a squat', fix: 'Knee angle stays fixed at a soft 15-20 degree bend throughout.' }
    ],
    proCue: 'Imagine your hips are on a rail sliding directly backwards.',
    overloadProtocol: 'Add +2.5 kg once you complete 3 sets of 10 with hamstrings controlling the weight.'
  },

  // 15. Leg Press
  'leg-press': {
    id: 15,
    name: 'Leg Press',
    equipment: 'Machine',
    primaryMuscle: 'Quads',
    primaryMuscleScientific: 'Quadriceps Femoris & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    mechanics: 'Compound',
    movementPattern: 'Leg Extension Sled',
    difficulty: 'Beginner',
    animationType: 'leg_press',
    muscleActivation: {
      primary: { name: 'Quadriceps', percent: 92, color: '#ff4d4f' },
      secondary1: { name: 'Glutes', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Adductors', percent: 60, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Seat & Foot Placement', text: 'Sit back firmly with lower back and hips pressed against pad. Place feet shoulder-width on platform.' },
      { step: 2, title: 'Disengage Safety', text: 'Press sled up and release safety handles with hands gripping side rails.' },
      { step: 3, title: 'Controlled Descent', text: 'Lower sled until knees reach approximately 90 degrees without allowing hips to curl off pad.' },
      { step: 4, title: 'Drive Without Locking Knees', text: 'Drive through whole foot to press platform away, stopping just short of hyperextending knees.' }
    ],
    breathing: {
      inhale: 'Inhale on the way down.',
      exhale: 'Exhale on the push.'
    },
    commonMistakes: [
      { mistake: 'Locking knees aggressively at top', fix: 'Keep a micro-bend at the top of every rep to protect joint cartilage.' },
      { mistake: 'Lower back peeling off the back pad', fix: 'Stop descent before pelvis rolls (butt-wink).' }
    ],
    proCue: 'Pull yourself down into the seat using the handles so your pelvis never leaves the cushion.',
    overloadProtocol: 'Add 5 kg to 10 kg total plates when you exceed target reps.'
  },

  // 16. Bulgarian Split Squat
  'bulgarian-split-squat': {
    id: 16,
    name: 'Bulgarian Split Squat',
    equipment: 'Dumbbell',
    primaryMuscle: 'Quads & Glutes',
    primaryMuscleScientific: 'Quadriceps Femoris & Gluteus Medius/Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core Balance'],
    mechanics: 'Compound (Unilateral)',
    movementPattern: 'Single Leg Lunge / Squat',
    difficulty: 'Intermediate',
    animationType: 'split_squat',
    muscleActivation: {
      primary: { name: 'Front Leg Quads', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Gluteus Medius & Maximus', percent: 90, color: '#fa8c16' },
      secondary2: { name: 'Adductors', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Rear Foot Elevation', text: 'Rest top of back foot on a bench about 2-3 feet behind you.' },
      { step: 2, title: 'Forward Stride', text: 'Step front foot forward enough so that your front knee stays stacked roughly over ankle during descent.' },
      { step: 3, title: 'Drop Back Knee', text: 'Lower straight down until back knee is an inch off the floor.' },
      { step: 4, title: 'Drive Through Front Mid-Foot', text: 'Push straight up through your front heel and mid-foot to starting position.' }
    ],
    breathing: {
      inhale: 'Inhale on descent.',
      exhale: 'Exhale driving upward.'
    },
    commonMistakes: [
      { mistake: 'Front foot placed too close to bench', fix: 'Hop forward slightly until knee angle is comfortable at bottom.' }
    ],
    proCue: 'Treat the back leg as a kickstand purely for balance; 90% of your weight is on front foot.',
    overloadProtocol: 'Add +1kg to +2kg per dumbbell.'
  },

  // 17. Standing Calf Raise
  'standing-calf-raise': {
    id: 17,
    name: 'Standing Calf Raise',
    equipment: 'Machine',
    primaryMuscle: 'Calves',
    primaryMuscleScientific: 'Gastrocnemius & Soleus',
    secondaryMuscles: ['Tibialis Posterior', 'Foot Stabilizers'],
    mechanics: 'Isolation',
    movementPattern: 'Plantarflexion',
    difficulty: 'Beginner',
    animationType: 'calf_raise',
    muscleActivation: {
      primary: { name: 'Gastrocnemius (Calves)', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Soleus', percent: 75, color: '#fa8c16' },
    },
    setup: [
      { step: 1, title: 'Balls of Feet on Step', text: 'Place balls of feet on block with heels hanging completely off edge.' },
      { step: 2, title: 'Deep Stretch (2s Pause)', text: 'Lower heels down as deep as possible for a full 2-second stretch to eliminate Achilles bounce.' },
      { step: 3, title: 'Explode on Toes', text: 'Rise onto the balls of your big toes as high as possible and squeeze calves for 1 full second.' }
    ],
    breathing: {
      inhale: 'Inhale on descent.',
      exhale: 'Exhale pressing up.'
    },
    commonMistakes: [
      { mistake: 'Bouncing up and down fast using Achilles tendon', fix: 'Hold bottom stretch for 2 seconds to make the muscle do 100% of the work.' }
    ],
    proCue: 'Push through the big toe knuckle, not the outside of the foot.',
    overloadProtocol: 'Add +2.5kg to +5kg on machine stack.'
  },

  // 18. Barbell Bicep Curl
  'barbell-bicep-curl': {
    id: 18,
    name: 'Barbell Bicep Curl',
    equipment: 'Barbell',
    primaryMuscle: 'Biceps',
    primaryMuscleScientific: 'Biceps Brachii (Short & Long Head)',
    secondaryMuscles: ['Brachialis', 'Brachioradialis', 'Forearms'],
    mechanics: 'Isolation',
    movementPattern: 'Elbow Flexion',
    difficulty: 'Beginner',
    animationType: 'bicep_curl',
    muscleActivation: {
      primary: { name: 'Biceps Brachii', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Brachialis', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Forearms', percent: 60, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Grip & Stance', text: 'Stand tall holding barbell with shoulder-width underhand (supinated) grip. Pin elbows to ribs.' },
      { step: 2, title: 'Curl to Shoulders', text: 'Curl barbell upward by contracting biceps while keeping elbows stationary.' },
      { step: 3, title: 'Peak Squeeze', text: 'Squeeze biceps hard at top of contraction.' },
      { step: 4, title: 'Controlled Lowering', text: 'Lower under full control for 2 seconds until elbows are fully extended.' }
    ],
    breathing: {
      inhale: 'Inhale as bar lowers.',
      exhale: 'Exhale as you curl up.'
    },
    commonMistakes: [
      { mistake: 'Swinging torso and throwing elbows forward', fix: 'Keep upper arms glued to your ribcage.' }
    ],
    proCue: 'Keep your pinkies turned upward to maximize bicep peak contraction.',
    overloadProtocol: 'Add +1.25 kg to +2.5 kg.'
  },

  // 19. Incline Dumbbell Curl
  'incline-dumbbell-curl': {
    id: 19,
    name: 'Incline Dumbbell Curl',
    equipment: 'Dumbbell',
    primaryMuscle: 'Biceps (Long Head)',
    primaryMuscleScientific: 'Biceps Brachii (Long Head Stretch)',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    mechanics: 'Isolation',
    movementPattern: 'Elbow Flexion in Extension',
    difficulty: 'Beginner',
    animationType: 'incline_curl',
    muscleActivation: {
      primary: { name: 'Biceps Long Head', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Brachialis', percent: 70, color: '#fa8c16' },
    },
    setup: [
      { step: 1, title: 'Bench Angle', text: 'Set bench to 45-60 degree incline. Sit back with arms hanging directly down.' },
      { step: 2, title: 'Deep Stretch', text: 'Let dumbbells hang behind torso to put long head of bicep into maximum pre-stretch.' },
      { step: 3, title: 'Supinated Curl', text: 'Curl dumbbells upward while supinating wrists (palms facing up).' },
      { step: 4, title: 'Slow Return', text: 'Lower back into full hang stretch.' }
    ],
    breathing: {
      inhale: 'Inhale on the stretch down.',
      exhale: 'Exhale on the curl.'
    },
    commonMistakes: [
      { mistake: 'Pulling elbows forward', fix: 'Keep elbows pointing at the floor behind you throughout.' }
    ],
    proCue: 'Feel the stretch pull all the way into the front of the shoulder capsule before curling.',
    overloadProtocol: 'Add +1 kg dumbbells once you reach 12 reps on all sets.'
  },

  // 20. Tricep Rope Pushdown
  'tricep-rope-pushdown': {
    id: 20,
    name: 'Tricep Rope Pushdown',
    equipment: 'Cable Machine',
    primaryMuscle: 'Triceps',
    primaryMuscleScientific: 'Triceps Brachii (Lateral & Medial Heads)',
    secondaryMuscles: ['Anconeus', 'Forearms'],
    mechanics: 'Isolation',
    movementPattern: 'Elbow Extension',
    difficulty: 'Beginner',
    animationType: 'tricep_pushdown',
    muscleActivation: {
      primary: { name: 'Triceps Brachii', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Forearms', percent: 40, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Attachment & Stance', text: 'Set cable to top. Attach rope. Take a step back with a slight torso lean.' },
      { step: 2, title: 'Pin Elbows', text: 'Lock elbows tightly at your sides.' },
      { step: 3, title: 'Push & Spread', text: 'Push down by extending elbows, and spread the rope ends outward at the bottom of the rep.' },
      { step: 4, title: 'Controlled Rise to 90 deg', text: 'Allow forearms to rise to 90 degrees or slightly higher without letting elbows drift.' }
    ],
    breathing: {
      inhale: 'Inhale as hands rise.',
      exhale: 'Exhale pressing and spreading at the bottom.'
    },
    commonMistakes: [
      { mistake: 'Letting elbows move forward and backward', fix: 'Glue elbows to your ribs as if they are pinned by a hinge.' }
    ],
    proCue: 'Rip the rope apart at the very bottom and flex your triceps like rocks.',
    overloadProtocol: 'Increase cable weight by +2.5kg.'
  },

  // 21. Skull Crushers (Lying Triceps Extension)
  'skull-crushers-lying-triceps-extension': {
    id: 21,
    name: 'Skull Crushers',
    equipment: 'Barbell / EZ Bar',
    primaryMuscle: 'Triceps (Long Head)',
    primaryMuscleScientific: 'Triceps Brachii (Long Head)',
    secondaryMuscles: ['Triceps Medial & Lateral Heads', 'Forearms'],
    mechanics: 'Isolation',
    movementPattern: 'Elbow Extension',
    difficulty: 'Intermediate',
    animationType: 'skull_crushers',
    muscleActivation: {
      primary: { name: 'Triceps Long Head', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Lateral Head', percent: 75, color: '#fa8c16' },
    },
    setup: [
      { step: 1, title: 'Lie Flat & Arm Angle', text: 'Lie on bench holding EZ bar with narrow overhand grip. Tilt arms backward about 10-15 degrees from vertical.' },
      { step: 2, title: 'Bend at Elbows Only', text: 'Lower the bar toward your forehead or just past top of your head by bending only your elbows.' },
      { step: 3, title: 'Extend to Lockout', text: 'Drive the bar back up along that same angled arc until triceps are fully contracted.' }
    ],
    breathing: {
      inhale: 'Inhale lowering to forehead/crown.',
      exhale: 'Exhale extending arms.'
    },
    commonMistakes: [
      { mistake: 'Flaring elbows wide', fix: 'Keep elbows pointing toward your feet and parallel.' }
    ],
    proCue: 'Lower the bar toward the crown of your head or the bench behind you for maximum long-head stretch without elbow strain.',
    overloadProtocol: 'Add +1.25kg to +2.5kg.'
  },

  // 22. Hanging Leg Raise
  'hanging-leg-raise': {
    id: 22,
    name: 'Hanging Leg Raise',
    equipment: 'Bodyweight / Pull-up Bar',
    primaryMuscle: 'Core & Lower Abs',
    primaryMuscleScientific: 'Rectus Abdominis & Iliopsoas',
    secondaryMuscles: ['Obliques', 'Forearms (Grip)'],
    mechanics: 'Compound',
    movementPattern: 'Spinal Flexion / Hip Flexion',
    difficulty: 'Intermediate',
    animationType: 'leg_raise',
    muscleActivation: {
      primary: { name: 'Lower Rectus Abdominis', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Hip Flexors', percent: 80, color: '#fa8c16' },
      secondary2: { name: 'Obliques', percent: 65, color: '#fadb14' },
    },
    setup: [
      { step: 1, title: 'Dead Hang', text: 'Hang from pull-up bar with overhand grip, shoulders engaged.' },
      { step: 2, title: 'Curl Pelvis Up', text: 'Raise straight legs (or bent knees for progression) by curling your pelvis up toward your sternum.' },
      { step: 3, title: 'Controlled Descent', text: 'Lower legs slowly without swinging.' }
    ],
    breathing: {
      inhale: 'Inhale on the way down.',
      exhale: 'Exhale forcefully as your knees/toes curl upward.'
    },
    commonMistakes: [
      { mistake: 'Swinging using momentum', fix: 'Pause for 1 second at the bottom dead stop before the next rep.' }
    ],
    proCue: 'Do not just lift your legs; roll your pelvis toward your chest.',
    overloadProtocol: 'Progress from knee tucks -> straight leg raises -> toes to bar -> holding a dumbbell between feet.'
  },

  // 23. Cable Woodchopper
  'cable-woodchopper': {
    id: 23,
    name: 'Cable Woodchopper',
    equipment: 'Cable Machine',
    primaryMuscle: 'Obliques & Core',
    primaryMuscleScientific: 'Internal & External Obliques, Transverse Abdominis',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    mechanics: 'Compound',
    movementPattern: 'Transverse Core Rotation',
    difficulty: 'Intermediate',
    animationType: 'woodchopper',
    muscleActivation: {
      primary: { name: 'Internal & External Obliques', percent: 95, color: '#ff4d4f' },
      secondary1: { name: 'Transverse Abdominis', percent: 85, color: '#fa8c16' },
      secondary2: { name: 'Shoulders & Hips', percent: 60, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'High Pulley Setup', text: 'Attach single handle to high pulley. Stand sideways to machine with feet wider than shoulders.' },
      { step: 2, title: 'Two-Hand Grip', text: 'Grasp handle with both hands, arms extended.' },
      { step: 3, title: 'Diagonal Chop', text: 'Rotate torso and pull handle downward across your body toward your opposite knee while pivoting back foot.' },
      { step: 4, title: 'Controlled Return', text: 'Control the cable back to top under abdominal tension.' }
    ],
    breathing: {
      inhale: 'Inhale as you return to the high starting position.',
      exhale: 'Exhale forcefully with the downward rotational chop.'
    },
    commonMistakes: [
      { mistake: 'Pulling with arms rather than rotating core', fix: 'Keep arms relatively straight and pivot from the hips and torso.' }
    ],
    proCue: 'Feel your obliques act like a coil spring snapping down across your midsection.',
    overloadProtocol: 'Add +1.25kg to +2.5kg.'
  },

  // 24. Plank
  'plank': {
    id: 24,
    name: 'Plank',
    equipment: 'Bodyweight',
    primaryMuscle: 'Core & Abdominals',
    primaryMuscleScientific: 'Transverse Abdominis, Rectus Abdominis, Internal Obliques',
    secondaryMuscles: ['Glutes', 'Quadriceps', 'Shoulders'],
    mechanics: 'Isometric',
    movementPattern: 'Anti-Extension',
    difficulty: 'Beginner',
    animationType: 'plank',
    muscleActivation: {
      primary: { name: 'Deep Core & Transverse Abs', percent: 98, color: '#ff4d4f' },
      secondary1: { name: 'Glutes & Quads', percent: 75, color: '#fa8c16' },
      secondary2: { name: 'Shoulders', percent: 60, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Forearm Placement', text: 'Place forearms on the floor with elbows directly under shoulders, forearms parallel.' },
      { step: 2, title: 'Straight Spine', text: 'Extend legs back, resting on balls of feet. Body should form a flat straight line from head to heels.' },
      { step: 3, title: 'Glute & Core Clench', text: 'Squeeze glutes hard, tuck pelvis slightly (posterior pelvic tilt), and pull belly button toward spine.' },
      { step: 4, title: 'Hold & Tension', text: 'Push floor away through elbows and hold tension without letting lower back sag.' }
    ],
    breathing: {
      inhale: 'Take steady, shallow diaphragmatic breaths into your nose.',
      exhale: 'Exhale through your mouth while maintaining constant 360-degree core tension.'
    },
    commonMistakes: [
      { mistake: 'Lower back sagging down (banana back)', fix: 'Squeeze glutes and raise hips slightly until spine is perfectly neutral.' },
      { mistake: 'Hips piked too high in the air', fix: 'Keep shoulders, hips, and ankles in one direct line.' }
    ],
    proCue: 'Actively pull your elbows toward your toes and your toes toward your elbows - this creates intense maximum contraction.',
    overloadProtocol: 'Progress from 45s -> 60s -> 90s -> elevate feet on bench or place a 10kg plate on upper back.'
  }
};

// Helper lookup by exercise ID or Slug
export function getExerciseGuide(identifier) {
  if (!identifier) return null;

  // Direct key lookup
  if (typeof identifier === 'string' && EXERCISE_GUIDES[identifier]) {
    return EXERCISE_GUIDES[identifier];
  }

  // Lookup by ID or slug property
  const values = Object.values(EXERCISE_GUIDES);
  const found = values.find(
    (g) => g.id === identifier || g.name.toLowerCase() === String(identifier).toLowerCase() || (g.slug && g.slug === identifier)
  );

  if (found) return found;

  // Fallback match by muscle group if specific guide not defined
  return {
    id: typeof identifier === 'number' ? identifier : 999,
    name: typeof identifier === 'string' ? identifier : 'Exercise Guide',
    equipment: 'Fitness Equipment',
    primaryMuscle: 'Target Muscle',
    primaryMuscleScientific: 'Primary Muscle Group',
    secondaryMuscles: ['Synergist Muscles', 'Stabilizers'],
    mechanics: 'Compound',
    movementPattern: 'Strength Movement',
    difficulty: 'Intermediate',
    animationType: 'bench_press',
    muscleActivation: {
      primary: { name: 'Primary Muscle', percent: 90, color: '#ff4d4f' },
      secondary1: { name: 'Secondary Synergist', percent: 65, color: '#fa8c16' },
      stabilizers: { name: 'Core Stabilizers', percent: 50, color: '#288474' },
    },
    setup: [
      { step: 1, title: 'Setup', text: 'Position equipment properly and align your body with correct posture.' },
      { step: 2, title: 'Execution', text: 'Initiate movement smoothly with targeted muscle contraction.' },
      { step: 3, title: 'Eccentric Control', text: 'Control the eccentric phase for 2-3 seconds to maximize hypertrophy.' }
    ],
    breathing: {
      inhale: 'Inhale on the negative / eccentric phase.',
      exhale: 'Exhale on the concentric drive.'
    },
    commonMistakes: [
      { mistake: 'Rushing reps with excessive momentum', fix: 'Control tempo and maintain tension throughout the range of motion.' }
    ],
    proCue: 'Focus on mind-muscle connection and feel the target muscle stretch and contract.',
    overloadProtocol: 'Increase weight by +2.5kg when all sets reach your upper rep ceiling.'
  };
}
