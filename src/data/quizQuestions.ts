import type { QuizCategory, QuizQuestion } from '@/types';

/**
 * Educational question bank. Content reflects widely taught recreational diving principles
 * (e.g. PADI, SSI, NAUI, BSAC, RSTC-aligned curricula) but this is NOT an official
 * certification examination. Agency procedures may differ in detail — follow your instructor.
 */

export const QUIZ_CATEGORIES: { id: QuizCategory; label: string; description: string }[] = [
  { id: 'fundamentals', label: 'Diving fundamentals', description: 'Core rules and how the body responds underwater.' },
  { id: 'equipment', label: 'Scuba equipment', description: 'Regulators, BCDs, gauges and computers.' },
  { id: 'communication', label: 'Underwater communication', description: 'Hand signals and buddy communication.' },
  { id: 'buoyancy', label: 'Buoyancy control', description: 'Weighting, trim and fine control.' },
  { id: 'pressure', label: 'Pressure & equalisation', description: 'Gas laws, air spaces and barotrauma.' },
  { id: 'planning', label: 'Dive planning', description: 'Gas, depth, time and repetitive dives.' },
  { id: 'emergency', label: 'Emergency procedures', description: 'Out-of-air, ascents and first aid.' },
  { id: 'marine-life', label: 'Marine life awareness', description: 'Identification and hazards.' },
  { id: 'navigation', label: 'Navigation', description: 'Compass and natural navigation.' },
  { id: 'decompression', label: 'Decompression awareness', description: 'Nitrogen, DCS and safe ascents.' },
  { id: 'environment', label: 'Environmental protection', description: 'Diving without harming the reef.' },
];

const TF = ['True', 'False'];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ---------------- Fundamentals ----------------
  {
    id: 'fun-1', category: 'fundamentals', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What is widely taught as the most important rule in scuba diving?',
    options: ['Always dive with a camera', 'Breathe continuously and never hold your breath', 'Always descend head-first', 'Stay deeper than your buddy'],
    correctIndex: 1,
    explanation: 'Holding your breath while ascending lets expanding air over-expand the lungs, which can cause lung over-expansion injuries including arterial gas embolism. Breathing slowly and continuously keeps the airways open.',
  },
  {
    id: 'fun-2', category: 'fundamentals', difficulty: 'beginner', kind: 'true-false',
    prompt: 'True or false: You should hold your breath during ascent to conserve air.',
    options: TF, correctIndex: 1,
    explanation: 'False. Air in the lungs expands as pressure decreases. Holding your breath on ascent is the leading cause of lung over-expansion injuries.',
  },
  {
    id: 'fun-3', category: 'fundamentals', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Why is diving with a cold or congestion discouraged?',
    options: ['Mucus makes the mask fog', 'Blocked Eustachian tubes can prevent equalisation and cause ear or sinus barotrauma', 'Cold medicine improves gas consumption', 'It makes you more buoyant'],
    correctIndex: 1,
    explanation: 'Congestion can block the passages that let you equalise. Decongestants may wear off during the dive, causing a reverse block on ascent. If you are congested, do not dive.',
  },
  {
    id: 'fun-4', category: 'fundamentals', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'Compared with air, water conducts heat away from the body approximately…',
    options: ['At the same rate', 'Twice as fast', 'About 20 times faster', 'Slower'],
    correctIndex: 2,
    explanation: 'Water conducts heat roughly 20–25 times faster than air, so divers can get cold even in warm water. Exposure protection matters on every dive.',
  },
  {
    id: 'fun-5', category: 'fundamentals', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Through a flat mask underwater, objects typically appear…',
    options: ['Smaller and farther away', 'About a third larger and a quarter closer', 'Exactly as they are', 'Upside down'],
    correctIndex: 1,
    explanation: 'Light refracts as it passes from water through the mask’s air space, so objects look roughly 33% larger and 25% closer. Divers learn to account for this when reaching for objects or judging size.',
  },
  {
    id: 'fun-6', category: 'fundamentals', difficulty: 'advanced', kind: 'scenario',
    prompt: 'Mid-dive you feel you can’t get enough air after swimming hard against a current. What should you do first?',
    options: ['Bolt for the surface', 'Stop, hold on to something safe if available, rest and breathe slowly and deeply, and signal your buddy', 'Remove your regulator to breathe easier', 'Swim harder to escape the current'],
    correctIndex: 1,
    explanation: 'This is overexertion. Stopping all activity and slowing your breathing lets you recover. Tell your buddy and consider ending the dive. A rapid ascent would add an even greater risk.',
  },

  // ---------------- Equipment ----------------
  {
    id: 'eq-1', category: 'equipment', difficulty: 'beginner', kind: 'identify-equipment',
    prompt: 'Identify the highlighted component (marker 2).',
    options: ['Second stage', 'First stage', 'Submersible pressure gauge', 'Power inflator'],
    correctIndex: 1,
    explanation: 'The first stage attaches to the cylinder valve and reduces high cylinder pressure to an intermediate pressure that feeds the hoses.',
    visual: {
      key: 'regulator-set', highlight: 'first-stage',
      annotations: [
        { label: '1 · Cylinder valve', detail: 'Opens and closes the supply from the cylinder.' },
        { label: '2 · First stage', detail: 'Reduces cylinder pressure to intermediate pressure (roughly 9–10 bar above ambient).' },
        { label: '3 · Primary second stage', detail: 'Delivers gas at ambient pressure on demand when you inhale.' },
      ],
    },
  },
  {
    id: 'eq-2', category: 'equipment', difficulty: 'beginner', kind: 'identify-equipment',
    prompt: 'What is the brightly coloured component at marker 4?',
    options: ['Primary second stage', 'Alternate air source (octopus)', 'Low-pressure inflator', 'Dive computer'],
    correctIndex: 1,
    explanation: 'The alternate air source is a spare second stage for a buddy in an out-of-air situation. It is often yellow and should be secured in the “triangle” between your chin and lower ribs so it is easy to find.',
    visual: {
      key: 'regulator-set', highlight: 'octopus',
      annotations: [
        { label: '4 · Alternate air source', detail: 'High-visibility spare second stage, usually on a longer hose.' },
        { label: '5 · SPG', detail: 'Shows remaining cylinder pressure.' },
        { label: '6 · LPI hose', detail: 'Feeds gas to the BCD power inflator.' },
      ],
    },
  },
  {
    id: 'eq-3', category: 'equipment', difficulty: 'beginner', kind: 'identify-equipment',
    prompt: 'What is the control at marker 1 on this BCD?',
    options: ['Shoulder dump valve', 'Power (low-pressure) inflator', 'Weight release', 'Cylinder band'],
    correctIndex: 1,
    explanation: 'The power inflator has an inflate button (adds gas from the cylinder) and a deflate button (vents gas when the hose is raised). It also lets you oral-inflate at the surface.',
    visual: {
      key: 'bcd', highlight: 'inflator',
      annotations: [
        { label: '1 · Power inflator', detail: 'Inflate and deflate buttons on the corrugated hose.' },
        { label: '2 · Shoulder dump', detail: 'Vents air when you are upright.' },
        { label: '3 · Lower dump', detail: 'Vents air when you are head-down or horizontal.' },
      ],
    },
  },
  {
    id: 'eq-4', category: 'equipment', difficulty: 'intermediate', kind: 'image',
    prompt: 'Which valve is highlighted (marker 2), and when is it most effective?',
    options: ['Lower dump — when head-down', 'Shoulder dump — when you are upright, because air rises to the highest point', 'Inflator — when horizontal', 'Cylinder valve — at any time'],
    correctIndex: 1,
    explanation: 'Air always moves to the highest point in the BCD. Shoulder dumps vent effectively when you are upright; the lower dump works when your hips are higher than your shoulders.',
    visual: {
      key: 'bcd', highlight: 'shoulder-dump',
      annotations: [
        { label: '2 · Shoulder dump', detail: 'Pull cord or tug on the hose to vent when upright.' },
        { label: '3 · Lower dump', detail: 'Use when trim is head-down.' },
      ],
    },
  },
  {
    id: 'eq-5', category: 'equipment', difficulty: 'intermediate', kind: 'image',
    prompt: 'Your SPG reads as shown and your agreed reserve is 50 bar. What should you do?',
    options: ['Continue the dive — there is plenty left', 'Signal your pressure to your buddy and begin your planned ascent so you surface with your reserve intact', 'Switch off your computer', 'Descend to save air'],
    correctIndex: 1,
    explanation: 'The gauge shows about 60 bar, close to the red reserve zone. Begin your ascent with your buddy, including your safety stop, so that you reach the surface with the reserve still in the cylinder.',
    visual: {
      key: 'spg', highlight: 'needle',
      annotations: [
        { label: '1 · Needle ≈ 60 bar', detail: 'Remaining cylinder pressure.' },
        { label: '2 · Red zone', detail: 'Reserve pressure — not intended to be used under normal conditions.' },
      ],
    },
  },
  {
    id: 'eq-6', category: 'equipment', difficulty: 'intermediate', kind: 'image',
    prompt: 'What does the highlighted value (marker 3) on this dive computer represent?',
    options: ['Water temperature', 'Remaining no-decompression time at the current depth', 'Total time underwater', 'Cylinder pressure'],
    correctIndex: 1,
    explanation: 'The NDL (no-decompression limit) shows how long the computer’s model says you can stay at the current depth without a mandatory decompression stop. Recreational divers should stay well within it.',
    visual: {
      key: 'dive-computer', highlight: 'ndl',
      annotations: [
        { label: '1 · Depth', detail: 'Current depth.' },
        { label: '2 · Dive time', detail: 'Elapsed time since descent began.' },
        { label: '3 · NDL', detail: 'Remaining no-decompression time per the computer’s algorithm.' },
        { label: '5 · Ascent rate', detail: 'Bar graph that warns when you ascend too fast.' },
      ],
    },
  },
  {
    id: 'eq-7', category: 'equipment', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What does a regulator’s second stage do?',
    options: ['Stores compressed gas', 'Reduces intermediate pressure to ambient pressure and delivers it when you inhale', 'Measures depth', 'Inflates the BCD'],
    correctIndex: 1,
    explanation: 'The second stage is a demand valve: it opens when you inhale and supplies gas at the surrounding (ambient) pressure.',
  },
  {
    id: 'eq-8', category: 'equipment', difficulty: 'advanced', kind: 'true-false',
    prompt: 'True or false: Diving with a computer eliminates the risk of decompression sickness.',
    options: TF, correctIndex: 1,
    explanation: 'False. Computers use mathematical models that reduce but cannot eliminate risk. Individual factors such as dehydration, fatigue, cold and exertion still matter.',
  },

  // ---------------- Communication ----------------
  {
    id: 'com-1', category: 'communication', difficulty: 'beginner', kind: 'image',
    prompt: 'What does this hand signal mean?',
    options: ['Out of air', 'OK / Are you OK?', 'Go up', 'Low on air'],
    correctIndex: 1,
    explanation: 'Thumb and index finger form a circle with the other fingers extended. It is both a question and an answer — it must always be answered.',
    visual: { key: 'signal-ok', annotations: [{ label: 'OK', detail: 'Thumb and index finger form a ring; other fingers extended.' }] },
  },
  {
    id: 'com-2', category: 'communication', difficulty: 'beginner', kind: 'image',
    prompt: 'A diver makes this signal. What are they telling you?',
    options: ['I am cold', 'I am out of air', 'Look at that', 'Stop'],
    correctIndex: 1,
    explanation: 'A flat hand moved across the throat signals “out of air”. Respond immediately by offering your alternate air source.',
    visual: { key: 'signal-out-of-air', annotations: [{ label: 'Out of air', detail: 'Flat hand slicing across the throat.' }] },
  },
  {
    id: 'com-3', category: 'communication', difficulty: 'beginner', kind: 'image',
    prompt: 'What does a thumbs-up mean underwater?',
    options: ['Everything is great', 'Go up / end the dive', 'Go down', 'Take a photo'],
    correctIndex: 1,
    explanation: 'Underwater, thumbs-up means “ascend / end the dive”, not “good”. Use the OK signal for “good”.',
    visual: { key: 'signal-up', annotations: [{ label: 'Up', detail: 'Closed fist, thumb pointing up.' }] },
  },
  {
    id: 'com-4', category: 'communication', difficulty: 'beginner', kind: 'image',
    prompt: 'This rocking flat-hand signal means…',
    options: ['Something is wrong (then point to the problem)', 'Level off', 'Slow down', 'Fish nearby'],
    correctIndex: 0,
    explanation: 'A flat hand rocking side to side means “something is not right”. Follow it by pointing to the source, e.g. your ear.',
    visual: { key: 'signal-problem', annotations: [{ label: 'Problem', detail: 'Flat hand rocked side to side, then point to the issue.' }] },
  },
  {
    id: 'com-5', category: 'communication', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'At the surface, at a distance from the boat, how do you commonly signal “OK”?',
    options: ['Wave both arms', 'Form a large ring over your head with your arm(s) or touch the top of your head', 'Blow a whistle repeatedly', 'Give a thumbs-up'],
    correctIndex: 1,
    explanation: 'A large “O” over the head is visible from far away. Waving an arm is usually the distress signal at the surface — so avoid waving casually.',
  },
  {
    id: 'com-6', category: 'communication', difficulty: 'intermediate', kind: 'scenario',
    prompt: 'You lose sight of your buddy in moderate visibility. What is the commonly taught procedure?',
    options: ['Keep diving and meet at the boat', 'Search briefly (about a minute) while rotating and looking for bubbles, then ascend carefully to reunite at the surface', 'Descend deeper to look', 'Wait on the bottom until the end of the dive'],
    correctIndex: 1,
    explanation: 'Agree the procedure before the dive. Most agencies teach a short search, then a normal ascent to reunite at the surface. Then decide together whether to continue.',
  },

  // ---------------- Buoyancy ----------------
  {
    id: 'buo-1', category: 'buoyancy', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'As you descend, your wetsuit compresses. What happens to your buoyancy?',
    options: ['You become more positively buoyant', 'You become more negatively buoyant, so you add small amounts of air to your BCD', 'Nothing changes', 'Your weights get lighter'],
    correctIndex: 1,
    explanation: 'Neoprene and BCD air compress with depth, reducing your volume. Add small bursts of air to remain neutral.',
  },
  {
    id: 'buo-2', category: 'buoyancy', difficulty: 'beginner', kind: 'true-false',
    prompt: 'True or false: Using the BCD inflator to lift you to the surface is good ascent technique.',
    options: TF, correctIndex: 1,
    explanation: 'False. Ascend slowly by swimming upward and venting expanding air from the BCD. Inflating to ascend causes uncontrolled, accelerating ascents.',
  },
  {
    id: 'buo-3', category: 'buoyancy', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'A common surface weight check: with an empty BCD and holding a normal breath, you should…',
    options: ['Sink immediately', 'Float at about eye level, and sink slowly when you exhale', 'Float with your shoulders out of the water', 'Be unable to stay at the surface'],
    correctIndex: 1,
    explanation: 'This indicates roughly neutral weighting. Overweighting makes buoyancy control harder and increases gas use and fatigue.',
  },
  {
    id: 'buo-4', category: 'buoyancy', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'While neutrally buoyant, how can you rise slightly without using the BCD?',
    options: ['Exhale fully and hold', 'Take slightly deeper inhalations', 'Kick downward', 'Drop a weight'],
    correctIndex: 1,
    explanation: 'Your lungs act as a fine-tuning buoyancy device: a fuller breath raises you slightly; a longer exhale lowers you. Never hold your breath.',
  },
  {
    id: 'buo-5', category: 'buoyancy', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'Why should weighting be checked with a near-empty cylinder?',
    options: ['Steel cylinders get heavier as you breathe', 'The cylinder becomes lighter as gas is used, so you must still be able to hold a safety stop at the end of the dive', 'Weights compress with depth', 'It is not necessary'],
    correctIndex: 1,
    explanation: 'Compressed gas has weight — a full 12 L cylinder at 200 bar holds about 3 kg of air. If you are weighted only for a full cylinder you may be unable to hold your safety stop.',
  },
  {
    id: 'buo-6', category: 'buoyancy', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What body position (trim) is generally preferred while swimming?',
    options: ['Vertical', 'Horizontal and streamlined', 'Head-down at 45°', 'On your back'],
    correctIndex: 1,
    explanation: 'Horizontal trim reduces drag, improves efficiency and keeps fins away from the reef.',
  },

  // ---------------- Pressure ----------------
  {
    id: 'pre-1', category: 'pressure', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What is the absolute pressure at 10 m in sea water?',
    options: ['1 bar', '2 bar', '3 bar', '10 bar'],
    correctIndex: 1,
    explanation: '1 bar of atmosphere plus about 1 bar for every 10 m of sea water: 2 bar absolute at 10 m.',
  },
  {
    id: 'pre-2', category: 'pressure', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Where do the largest relative volume changes occur?',
    options: ['Between 30 and 40 m', 'Between 0 and 10 m', 'Between 20 and 30 m', 'They are the same at every depth'],
    correctIndex: 1,
    explanation: 'Pressure doubles from 1 to 2 bar in the first 10 m, halving gas volume. That is why buoyancy and equalisation demand the most attention near the surface.',
  },
  {
    id: 'pre-3', category: 'pressure', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'When should you equalise your ears during descent?',
    options: ['Only when they hurt', 'Early and often — before discomfort, roughly every metre', 'Only at the bottom', 'Never, it happens automatically'],
    correctIndex: 1,
    explanation: 'Equalise at the surface before descending and frequently thereafter. Waiting for pain means a pressure difference has already built up.',
  },
  {
    id: 'pre-4', category: 'pressure', difficulty: 'intermediate', kind: 'scenario',
    prompt: 'You feel ear pain while descending and can’t equalise. What should you do?',
    options: ['Keep descending — it will pop', 'Ascend a little until the discomfort eases, try to equalise again, and abort the dive if you still can’t', 'Do a forceful Valsalva', 'Ignore it'],
    correctIndex: 1,
    explanation: 'Reducing the pressure difference allows the tubes to open. Forcing it risks inner-ear injury. Aborting a dive is always acceptable.',
  },
  {
    id: 'pre-5', category: 'pressure', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'A flexible bag holds 6 L of air at 20 m. Ignoring temperature, what is its volume at the surface?',
    options: ['6 L', '12 L', '18 L', '24 L'],
    correctIndex: 2,
    explanation: 'Boyle’s law: P₁V₁ = P₂V₂. At 20 m pressure is 3 bar, so 3 × 6 = 1 × V₂ → V₂ = 18 L.',
  },
  {
    id: 'pre-6', category: 'pressure', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'How do you prevent mask squeeze?',
    options: ['Tighten the strap', 'Exhale gently through your nose into the mask', 'Inhale through your nose', 'Lift the mask skirt'],
    correctIndex: 1,
    explanation: 'The mask is an air space. Exhaling through your nose adds air to balance pressure as you descend.',
  },
  {
    id: 'pre-7', category: 'pressure', difficulty: 'advanced', kind: 'true-false',
    prompt: 'True or false: If an ear won’t equalise, a harder Valsalva manoeuvre is the safest fix.',
    options: TF, correctIndex: 1,
    explanation: 'False. Forceful Valsalva attempts can injure the inner ear (e.g. round-window rupture). Ascend slightly, try gentle techniques, or end the dive.',
  },

  // ---------------- Planning ----------------
  {
    id: 'pla-1', category: 'planning', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'Which phrase best captures good dive-planning practice?',
    options: ['Go with the flow', 'Plan the dive, dive the plan', 'The deeper the better', 'Follow the fish'],
    correctIndex: 1,
    explanation: 'Agree depth, time, gas limits, route and procedures with your buddy before entering — then stick to them.',
  },
  {
    id: 'pla-2', category: 'planning', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'On a day with several dives, conventional recreational guidance is to…',
    options: ['Make the deepest dive last', 'Make the deepest dive first, with later dives shallower', 'Keep all dives at the same depth', 'Skip surface intervals'],
    correctIndex: 1,
    explanation: 'Diving deepest first and progressively shallower is the traditionally taught approach for repetitive dives. Follow your computer and agency guidance.',
  },
  {
    id: 'pla-3', category: 'planning', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'When should you start your ascent with respect to gas?',
    options: ['When the SPG reads zero', 'At the pre-agreed turn/ascent pressure, so you surface with your reserve intact', 'Whenever your buddy is low', 'When you feel tired'],
    correctIndex: 1,
    explanation: 'Planning ascent pressures ensures you have gas for the ascent, the safety stop and an emergency reserve.',
  },
  {
    id: 'pla-4', category: 'planning', difficulty: 'intermediate', kind: 'true-false',
    prompt: 'True or false: A safety stop is the same as a required decompression stop.',
    options: TF, correctIndex: 1,
    explanation: 'False. A safety stop (often 3 minutes at about 5 m) is a recommended precaution on no-decompression dives. Decompression stops are mandatory and require specific training.',
  },
  {
    id: 'pla-5', category: 'planning', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Widely cited guidance (e.g. DAN/UHMS) for flying after multiple dives per day or multiple days of diving recommends a minimum surface interval of…',
    options: ['2 hours', '6 hours', '12 hours', '18 hours'],
    correctIndex: 3,
    explanation: 'The commonly cited minimum is 12 hours after a single no-decompression dive and 18 hours after multiple dives per day or multiple days. Longer is more conservative.',
  },
  {
    id: 'pla-6', category: 'planning', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'Your SAC rate is 20 L/min. Roughly how much gas per minute will you use at 20 m?',
    options: ['20 L/min', '40 L/min', '60 L/min', '80 L/min'],
    correctIndex: 2,
    explanation: 'Consumption scales with absolute pressure. At 20 m (3 bar) you use about 3 × 20 = 60 L/min — more with exertion, cold or stress.',
  },
  {
    id: 'pla-7', category: 'planning', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'For EANx32 and a maximum ppO₂ of 1.4, the maximum operating depth is approximately…',
    options: ['24 m', '29 m', '34 m', '40 m'],
    correctIndex: 2,
    explanation: 'MOD = (ppO₂ ÷ FO₂ − 1) × 10 = (1.4 ÷ 0.32 − 1) × 10 ≈ 33.75 m. Requires Enriched Air training.',
  },
  {
    id: 'pla-8', category: 'planning', difficulty: 'advanced', kind: 'scenario',
    prompt: 'On a multilevel dive, how should depths generally be sequenced?',
    options: ['Shallowest first', 'Deepest part first, then progressively shallower', 'Alternate deep and shallow', 'It doesn’t matter'],
    correctIndex: 1,
    explanation: 'Starting deep and working shallower reduces nitrogen loading and avoids “reverse” profiles.',
  },

  // ---------------- Emergency ----------------
  {
    id: 'em-1', category: 'emergency', difficulty: 'beginner', kind: 'scenario',
    prompt: 'You run out of air and your buddy is close by. What is the preferred response?',
    options: ['Make an emergency swimming ascent', 'Signal out-of-air and breathe from your buddy’s alternate air source, then ascend together', 'Drop your weights', 'Hold your breath and swim up'],
    correctIndex: 1,
    explanation: 'With a nearby buddy, an alternate-air-source ascent is generally preferred over a solo emergency ascent.',
  },
  {
    id: 'em-2', category: 'emergency', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'During a controlled emergency swimming ascent (CESA), you should…',
    options: ['Hold your breath', 'Swim upward at a normal rate while exhaling continuously, keeping the regulator in your mouth', 'Inflate the BCD fully', 'Remove your mask'],
    correctIndex: 1,
    explanation: 'Continuous exhalation (e.g. a long “ahh”) vents expanding air from the lungs. Keep the regulator in — you may get breaths as pressure drops.',
  },
  {
    id: 'em-3', category: 'emergency', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Your regulator starts to free-flow. How can you keep breathing from it?',
    options: ['Seal your lips tightly', 'Hold it slightly away from your lips and “sip” air, letting the excess escape', 'Bite down hard', 'Switch off the cylinder'],
    correctIndex: 1,
    explanation: 'Never seal your mouth on a free-flowing regulator. Sip from it and begin a controlled ascent with your buddy.',
  },
  {
    id: 'em-4', category: 'emergency', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Recommended first aid for suspected decompression illness includes…',
    options: ['Hot shower and rest', 'Oxygen in the highest available concentration, contact emergency services / dive emergency hotline, monitor the diver', 'Re-enter the water to recompress', 'Wait for symptoms to pass'],
    correctIndex: 1,
    explanation: 'Give oxygen as trained, call for help early and arrange evacuation to medical care. In-water recompression is not a recreational procedure.',
  },
  {
    id: 'em-5', category: 'emergency', difficulty: 'advanced', kind: 'image',
    prompt: 'Compare the two ascent profiles. Which shows the safer ascent?',
    options: ['Diver A', 'Diver B', 'Both are equally safe', 'Neither matters if the dive was short'],
    correctIndex: 1,
    explanation: 'Diver A shoots straight up from depth. Diver B ascends slowly, pauses for a safety stop near 5 m and surfaces gently. Rapid ascents increase DCS and lung over-expansion risk.',
    visual: {
      key: 'unsafe-ascent', highlight: 'fast',
      annotations: [
        { label: '1 · Near-vertical ascent', detail: 'Too fast — no time for controlled off-gassing or lung venting.' },
        { label: '2 · Controlled ascent + stop', detail: 'Slow ascent with a safety stop at about 5 m.' },
      ],
    },
  },
  {
    id: 'em-6', category: 'emergency', difficulty: 'intermediate', kind: 'true-false',
    prompt: 'True or false: Symptoms of decompression sickness always appear immediately after surfacing.',
    options: TF, correctIndex: 1,
    explanation: 'False. Most symptoms appear within hours, but onset can be delayed up to 24 hours or more, especially after flying or altitude exposure.',
  },
  {
    id: 'em-7', category: 'emergency', difficulty: 'advanced', kind: 'scenario',
    prompt: 'A diver at the surface is panicking and struggling. As a trained rescuer, what is the first priority once safe to approach?',
    options: ['Remove their mask', 'Establish positive buoyancy for them (inflate their BCD or drop their weights) while keeping yourself safe', 'Push them underwater to calm them', 'Swim them straight to shore immediately'],
    correctIndex: 1,
    explanation: 'Making the diver buoyant removes the immediate drowning threat. Rescuer safety comes first — approach cautiously and use a flotation aid if possible.',
  },

  // ---------------- Marine life ----------------
  {
    id: 'ml-1', category: 'marine-life', difficulty: 'beginner', kind: 'image',
    prompt: 'Identify this reef fish.',
    options: ['Butterflyfish', 'Clownfish (anemonefish)', 'Parrotfish', 'Grouper'],
    correctIndex: 1,
    explanation: 'Orange body with white bands edged in black — characteristic of clownfish, which live symbiotically with sea anemones.',
    visual: { key: 'clownfish', annotations: [{ label: 'Key features', detail: 'Orange body, three white bands, rounded fins; found in anemones.' }] },
  },
  {
    id: 'ml-2', category: 'marine-life', difficulty: 'beginner', kind: 'image',
    prompt: 'What animal is shown here?',
    options: ['Sea turtle', 'Stingray', 'Octopus', 'Moray eel'],
    correctIndex: 0,
    explanation: 'Flippers, a scaled head and a shell (carapace) identify a sea turtle. Keep your distance and never block its path to the surface — turtles need to breathe air.',
    visual: { key: 'sea-turtle', annotations: [{ label: 'Carapace', detail: 'Shell plates (scutes) help identify species.' }] },
  },
  {
    id: 'ml-3', category: 'marine-life', difficulty: 'intermediate', kind: 'image',
    prompt: 'Identify this large ray.',
    options: ['Southern stingray', 'Manta ray', 'Eagle ray', 'Guitarfish'],
    correctIndex: 1,
    explanation: 'Mantas have wide triangular pectoral fins and paired cephalic lobes in front of the mouth. They are filter feeders with no stinging barb.',
    visual: { key: 'manta', annotations: [{ label: 'Cephalic lobes', detail: 'The “horns” in front of the mouth funnel plankton.' }] },
  },
  {
    id: 'ml-4', category: 'marine-life', difficulty: 'intermediate', kind: 'image',
    prompt: 'Why should divers keep their distance from this fish?',
    options: ['It bites aggressively', 'It has venomous dorsal, pelvic and anal spines', 'It is electric', 'It sprays ink'],
    correctIndex: 1,
    explanation: 'Lionfish spines deliver painful venom. Treatment usually involves hot (non-scalding) water immersion and medical evaluation.',
    visual: { key: 'lionfish', annotations: [{ label: 'Spines', detail: 'Long venomous spines; striped red/white pattern.' }] },
  },
  {
    id: 'ml-5', category: 'marine-life', difficulty: 'beginner', kind: 'true-false',
    prompt: 'True or false: Most marine-life injuries to divers are defensive reactions by the animal.',
    options: TF, correctIndex: 0,
    explanation: 'True. Injuries usually happen when animals are touched, stepped on or cornered. Look, don’t touch.',
  },
  {
    id: 'ml-6', category: 'marine-life', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'What is “fire coral”?',
    options: ['A true hard coral that glows', 'A hydrozoan that can cause a painful sting on contact', 'A harmless soft coral', 'A type of algae'],
    correctIndex: 1,
    explanation: 'Fire coral (Millepora) is a hydrozoan with stinging cells. Good buoyancy keeps you clear.',
  },
  {
    id: 'ml-7', category: 'marine-life', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'In the western Atlantic and Caribbean, lionfish are considered…',
    options: ['Endangered natives', 'Invasive, harming native reef fish populations', 'Extinct', 'Protected keystone species'],
    correctIndex: 1,
    explanation: 'Indo-Pacific lionfish were introduced to the Atlantic and spread rapidly, preying on native fish. Some areas run licensed culling programmes.',
  },

  // ---------------- Navigation ----------------
  {
    id: 'nav-1', category: 'navigation', difficulty: 'intermediate', kind: 'image',
    prompt: 'You swim out on a heading of 060°. What is the reciprocal heading to return?',
    options: ['120°', '180°', '240°', '300°'],
    correctIndex: 2,
    explanation: 'Add or subtract 180°: 60 + 180 = 240°.',
    visual: {
      key: 'nav-reciprocal', highlight: 'reciprocal',
      annotations: [
        { label: '1 · Outbound 060°', detail: 'Initial heading.' },
        { label: '2 · Reciprocal 240°', detail: 'Heading ± 180° returns you to the start.' },
      ],
    },
  },
  {
    id: 'nav-2', category: 'navigation', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'How do you calculate a reciprocal heading?',
    options: ['Add 90°', 'Add or subtract 180°', 'Subtract 45°', 'Double the heading'],
    correctIndex: 1,
    explanation: 'If the heading is less than 180°, add 180°; if more, subtract 180°.',
  },
  {
    id: 'nav-3', category: 'navigation', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'A square navigation pattern uses…',
    options: ['Three 120° turns in the same direction', 'Four 90° turns in the same direction with equal legs', 'Two 180° turns', 'Random turns'],
    correctIndex: 1,
    explanation: 'Four equal legs with 90° turns in the same direction bring you back to the start.',
  },
  {
    id: 'nav-4', category: 'navigation', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Sand ripples on the bottom typically run…',
    options: ['Perpendicular to the shore', 'Parallel to the shore', 'In circles', 'Toward deeper water only'],
    correctIndex: 1,
    explanation: 'Wave action usually forms ripples parallel to the shoreline — a useful natural navigation cue, though local features can vary.',
  },
  {
    id: 'nav-5', category: 'navigation', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'For accurate compass navigation, the compass lubber line should be…',
    options: ['Pointing at the nearest fish', 'Aligned with the centre line of your body', 'Held at an angle', 'Pointed toward the surface'],
    correctIndex: 1,
    explanation: 'Keep the compass level and the lubber line aligned with your body’s centre line so you swim in the direction it indicates.',
  },
  {
    id: 'nav-6', category: 'navigation', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'Which method estimates distance underwater?',
    options: ['Counting kick cycles or timing at a known pace', 'Watching the SPG', 'Checking the water temperature', 'Counting bubbles'],
    correctIndex: 0,
    explanation: 'Calibrate your kick cycles over a known distance, or use time at a steady pace. Current affects both.',
  },

  // ---------------- Decompression ----------------
  {
    id: 'dec-1', category: 'decompression', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What is the underlying cause of decompression sickness?',
    options: ['Breathing too much oxygen', 'Dissolved nitrogen forming bubbles in the body when pressure is reduced too quickly', 'Cold water', 'Carbon monoxide'],
    correctIndex: 1,
    explanation: 'At depth the body absorbs nitrogen. If pressure falls faster than it can be eliminated, bubbles can form in tissues and blood.',
  },
  {
    id: 'dec-2', category: 'decompression', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Which factor is associated with increased DCS risk?',
    options: ['Slow ascents', 'Heavy exertion during or right after the dive', 'Good hydration', 'Shallower dives'],
    correctIndex: 1,
    explanation: 'Exertion, dehydration, fatigue, cold, alcohol and rapid ascents are commonly cited risk factors.',
  },
  {
    id: 'dec-3', category: 'decompression', difficulty: 'intermediate', kind: 'identify-equipment',
    prompt: 'What does the highlighted bar graph on this dive computer (marker 5) show?',
    options: ['Battery level', 'Ascent rate', 'Nitrogen loading', 'Cylinder pressure'],
    correctIndex: 1,
    explanation: 'The ascent-rate indicator warns when you rise too quickly. Slow down if it fills or alarms.',
    visual: { key: 'dive-computer', highlight: 'ascent-rate', annotations: [{ label: '5 · Ascent-rate bars', detail: 'More bars = faster ascent.' }] },
  },
  {
    id: 'dec-4', category: 'decompression', difficulty: 'beginner', kind: 'true-false',
    prompt: 'True or false: Staying within your computer’s no-decompression limit guarantees you won’t get DCS.',
    options: TF, correctIndex: 1,
    explanation: 'False. DCS can occur within limits. Staying well within them, ascending slowly and making safety stops reduce risk.',
  },
  {
    id: 'dec-5', category: 'decompression', difficulty: 'beginner', kind: 'image',
    prompt: 'Which phase of the dive is highlighted (marker 4)?',
    options: ['Descent', 'Bottom phase', 'Safety stop', 'Surface interval'],
    correctIndex: 2,
    explanation: 'A safety stop — commonly about 3 minutes at around 5 m — adds a margin of conservatism on no-decompression dives.',
    visual: {
      key: 'dive-profile', highlight: 'safety-stop',
      annotations: [
        { label: '1 · Descent', detail: 'Controlled descent with frequent equalisation.' },
        { label: '2 · Bottom phase', detail: 'Deepest part of the dive.' },
        { label: '3 · Ascent', detail: 'Slow, controlled ascent.' },
        { label: '4 · Safety stop', detail: 'Pause near 5 m before surfacing.' },
      ],
    },
  },
  {
    id: 'dec-6', category: 'decompression', difficulty: 'advanced', kind: 'scenario',
    prompt: 'You accidentally exceed your computer’s no-decompression limit. What should you do?',
    options: ['Ascend directly to the surface quickly', 'Follow your computer’s decompression instructions and your agency’s emergency procedures, then observe the recommended no-dive period', 'Ignore it if you feel fine', 'Descend to reset the computer'],
    correctIndex: 1,
    explanation: 'Recreational divers should never plan to exceed NDLs. If it happens, follow the computer and your training, report to the dive professional and watch for symptoms.',
  },

  // ---------------- Environment ----------------
  {
    id: 'env-1', category: 'environment', difficulty: 'beginner', kind: 'multiple-choice',
    prompt: 'What is the single most effective way a diver can protect coral reefs?',
    options: ['Wear gloves to touch coral safely', 'Maintain excellent buoyancy and trim, and secure dangling equipment', 'Dive only at night', 'Feed the fish'],
    correctIndex: 1,
    explanation: 'Fin kicks, knees and dangling gauges damage fragile coral. Good buoyancy keeps you and your equipment off the reef.',
  },
  {
    id: 'env-2', category: 'environment', difficulty: 'beginner', kind: 'true-false',
    prompt: 'True or false: It’s fine to take shells home if they look empty.',
    options: TF, correctIndex: 1,
    explanation: 'False. “Empty” shells can house hermit crabs and other life, and collection is illegal in many marine parks. Take only pictures.',
  },
  {
    id: 'env-3', category: 'environment', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Why is feeding fish discouraged?',
    options: ['Fish don’t eat', 'It changes natural behaviour and diets and can make animals aggressive', 'It costs too much', 'It attracts too many divers'],
    correctIndex: 1,
    explanation: 'Feeding disrupts ecosystems, encourages unnatural dependence and can provoke bites.',
  },
  {
    id: 'env-4', category: 'environment', difficulty: 'intermediate', kind: 'scenario',
    prompt: 'A photographer wants to move a nudibranch onto a prettier sponge for a better shot. What is the right approach?',
    options: ['Gently move it with a stick', 'Photograph the animal where it is without handling or relocating it', 'Use a muck stick to pin it', 'Blow it with a regulator'],
    correctIndex: 1,
    explanation: 'Relocating animals stresses them and may separate them from food. Responsible photographers never manipulate subjects.',
  },
  {
    id: 'env-5', category: 'environment', difficulty: 'advanced', kind: 'multiple-choice',
    prompt: 'What should you do if you find marine debris such as fishing line on a reef?',
    options: ['Always pull it free immediately', 'Remove it only if safe and no life is attached or entangled in a way that removal would cause more harm; report large or entangled debris', 'Leave everything', 'Cut the coral to free it'],
    correctIndex: 1,
    explanation: 'Debris removal helps, but carelessly pulling line can break coral or entangle you. Some programmes teach safe removal and reporting.',
  },
  {
    id: 'env-6', category: 'environment', difficulty: 'intermediate', kind: 'multiple-choice',
    prompt: 'Why do responsible operators use mooring buoys rather than anchoring?',
    options: ['Anchors are expensive', 'Anchors and chains can destroy large areas of reef', 'Moorings are faster', 'Anchoring is always illegal'],
    correctIndex: 1,
    explanation: 'Fixed moorings concentrate impact in one engineered point and prevent repeated anchor damage.',
  },
];
