import type { Lesson } from '@/types';

/**
 * Open Water learning pathway — educational content that supports, but never replaces,
 * a course with a qualified instructor from a recognised training agency.
 */
export const OPEN_WATER_LESSONS: Lesson[] = [
  {
    id: 'ow-01', course: 'open-water', order: 1, title: 'Introduction to scuba diving', duration: 10, illustration: 'diver',
    summary: 'What scuba is, how certification works and the mindset of a safe diver.',
    objectives: ['Explain what “scuba” stands for', 'Describe what an entry-level certification qualifies you to do', 'Recall the core safety rules every diver follows'],
    sections: [
      { heading: 'What is scuba?', body: ['SCUBA stands for Self-Contained Underwater Breathing Apparatus. You carry your own gas supply, which lets you move freely underwater instead of being tethered to the surface.', 'Recreational scuba is designed for no-decompression diving within defined depth limits, with a buddy, in conditions equal to or better than those you trained in.'] },
      { heading: 'How certification works', body: ['Entry-level courses combine knowledge development, confined-water (pool-like) skill sessions and open-water training dives with an instructor. Agencies such as PADI, SSI, NAUI, BSAC, CMAS and others set standards that instructors follow.', 'An Open Water certification typically qualifies you to dive with a buddy to around 18 m (60 ft) without direct professional supervision, in conditions similar to your training. Exact limits depend on your agency and local regulations.'] },
      { heading: 'Safe-diver habits', body: ['Good divers stay within their training and experience, dive with a buddy, plan every dive and keep their skills current.'], bullets: ['Never hold your breath', 'Ascend slowly and make a safety stop', 'Monitor gas and depth frequently', 'Any diver can end any dive at any time, for any reason'] },
    ],
    realWorld: 'A newly certified diver who hasn’t dived for a year books a short refresher with a local dive centre before a holiday reef trip — a simple step that rebuilds confidence and catches rusty skills.',
    keyTakeaways: ['Scuba = self-contained breathing apparatus', 'Certification limits are real limits', 'Training plus regular practice keeps you safe'],
    check: [
      { question: 'What does an entry-level certification typically allow?', options: ['Diving anywhere at any depth', 'Diving with a buddy within training limits, in similar conditions', 'Teaching others', 'Solo cave diving'], correctIndex: 1, explanation: 'Entry-level certification permits buddy diving within the depth and conditions you trained for.' },
      { question: 'Who can call off a dive?', options: ['Only the instructor', 'Only the boat captain', 'Any diver, at any time', 'Nobody once in the water'], correctIndex: 2, explanation: 'Any diver can end any dive for any reason — without argument.' },
    ],
  },
  {
    id: 'ow-02', course: 'open-water', order: 2, title: 'How scuba equipment works', duration: 15, illustration: 'regulator',
    summary: 'Masks, fins, BCDs, regulators, gauges and computers — and how they fit together.',
    objectives: ['Name the main parts of a scuba system', 'Describe the job of the first and second stages', 'Explain why an alternate air source and SPG are essential'],
    sections: [
      { heading: 'Basic equipment', body: ['A mask creates an air space so your eyes can focus underwater. Fins convert leg power into efficient propulsion. A snorkel lets you breathe at the surface without lifting your head.'] },
      { heading: 'The regulator system', body: ['The first stage attaches to the cylinder valve and reduces high cylinder pressure (often 200–230 bar) to an intermediate pressure. The second stage — the part in your mouth — reduces that to ambient pressure and delivers gas only when you inhale.', 'An alternate air source (often yellow, the “octopus”) gives a buddy a second regulator to breathe from in an emergency.'] },
      { heading: 'BCD, gauges and computer', body: ['The buoyancy control device (BCD) holds the cylinder and has an inflatable bladder you control with the power inflator and dump valves.', 'The submersible pressure gauge (SPG) shows how much gas remains. A dive computer tracks depth, time and an estimate of nitrogen loading, showing remaining no-decompression time and ascent rate.'] },
    ],
    realWorld: 'During set-up, a diver notices the SPG needle dipping each time they breathe — a sign the cylinder valve is only partly open. Opening the valve fully fixes it before entering the water.',
    keyTakeaways: ['First stage: high → intermediate pressure', 'Second stage: delivers gas on demand at ambient pressure', 'Check gas often — your SPG is your fuel gauge'],
    check: [
      { question: 'Which component reduces cylinder pressure to intermediate pressure?', options: ['Second stage', 'First stage', 'SPG', 'BCD'], correctIndex: 1, explanation: 'The first stage is the pressure reducer attached to the cylinder valve.' },
      { question: 'What is the purpose of an alternate air source?', options: ['To inflate the BCD', 'To give a buddy gas in an emergency', 'To measure depth', 'To clear the mask'], correctIndex: 1, explanation: 'It is a spare second stage for gas sharing.' },
    ],
  },
  {
    id: 'ow-03', course: 'open-water', order: 3, title: 'Physics of diving', duration: 12, illustration: 'pressure',
    summary: 'Pressure, density, light, sound and heat — the physics that shapes every dive.',
    objectives: ['Explain why pressure increases with depth', 'Describe how light, sound and heat behave in water', 'Relate physics to everyday diving decisions'],
    sections: [
      { heading: 'Water is dense', body: ['Water is about 800 times denser than air. Every 10 m of sea water adds roughly 1 bar of pressure on top of the 1 bar of atmosphere at the surface.'] },
      { heading: 'Light and sound', body: ['Light refracts at the mask lens, so objects look about a third larger and a quarter closer. Colours are absorbed with depth — reds disappear first, which is why photographers use lights.', 'Sound travels about four times faster in water, making it hard to tell which direction it comes from.'] },
      { heading: 'Heat loss', body: ['Water conducts heat roughly 20–25 times faster than air. Even in tropical water, long or repeated dives can chill you. Choose exposure protection for the water temperature at depth, not just at the surface.'] },
    ],
    realWorld: 'A diver in 28 °C water gets cold on the third dive of the day. Adding a hood and a thicker suit for later dives makes the difference.',
    keyTakeaways: ['+1 bar every 10 m of sea water', 'Colours fade with depth; red goes first', 'Water steals heat fast'],
    check: [
      { question: 'Which colour is absorbed first with depth?', options: ['Blue', 'Green', 'Red', 'Violet'], correctIndex: 2, explanation: 'Red light has the longest wavelength and is absorbed in the first few metres.' },
      { question: 'Why is it hard to locate sound underwater?', options: ['Sound doesn’t travel in water', 'Sound travels faster, so both ears hear it almost simultaneously', 'Masks block sound', 'Bubbles absorb it'], correctIndex: 1, explanation: 'The faster speed reduces the time difference our brains use to locate sound.' },
    ],
  },
  {
    id: 'ow-04', course: 'open-water', order: 4, title: 'Pressure and volume', duration: 12, illustration: 'pressure',
    summary: 'Boyle’s law and what it means for your lungs, ears, mask and buoyancy.',
    objectives: ['Apply Boyle’s law to air spaces', 'Explain why the shallowest 10 m are the most critical', 'Connect gas volume changes to lung over-expansion risk'],
    sections: [
      { heading: 'Boyle’s law', body: ['At constant temperature, the volume of a gas is inversely proportional to its pressure. Double the pressure and the volume halves; halve the pressure and the volume doubles.', 'A balloon with 1 L of air at the surface shrinks to ½ L at 10 m, ⅓ L at 20 m and ¼ L at 30 m.'] },
      { heading: 'Air spaces in your body and equipment', body: ['Your lungs, sinuses, middle ears, mask and BCD all contain air. On descent their volume decreases unless you add air; on ascent it increases unless you release it.'], bullets: ['Lungs: breathe continuously so expanding air can escape', 'Ears and sinuses: equalise early and often', 'Mask: exhale through your nose', 'BCD: add air going down, vent going up'] },
      { heading: 'Why the shallows matter', body: ['The biggest relative change happens between the surface and 10 m. That is where buoyancy changes fastest and where lung over-expansion is a real risk even in shallow pools.'] },
    ],
    realWorld: 'During a safety stop at 5 m a diver forgets to vent their BCD and starts rising. Because the air expands most in the shallows, a small delay becomes a fast, uncontrolled ascent — so experienced divers vent early.',
    keyTakeaways: ['P × V stays constant', 'Volume changes are largest near the surface', 'Never hold your breath'],
    check: [
      { question: 'A 2 L bag at the surface is taken to 10 m. Its volume becomes…', options: ['4 L', '2 L', '1 L', '0.5 L'], correctIndex: 2, explanation: 'Pressure doubles (1 → 2 bar), so volume halves to 1 L.' },
      { question: 'Where are relative volume changes greatest?', options: ['30–40 m', '0–10 m', '20–30 m', 'Equal everywhere'], correctIndex: 1, explanation: 'Pressure doubles in the first 10 m.' },
    ],
  },
  {
    id: 'ow-05', course: 'open-water', order: 5, title: 'Equalisation techniques', duration: 10, illustration: 'equalize',
    summary: 'How to keep your ears, sinuses and mask comfortable on descent.',
    objectives: ['Describe how the Eustachian tubes work', 'Perform gentle equalisation techniques', 'Recognise when to stop and abort'],
    sections: [
      { heading: 'Why equalise?', body: ['As you descend, water pressure pushes on your eardrum. Air must enter the middle ear through the Eustachian tubes to balance it. If it doesn’t, you feel pain and risk barotrauma.'] },
      { heading: 'Techniques', body: ['Equalise at the surface, then every metre or so on the way down — before you feel discomfort. Descend feet-first, which many divers find easier.'], bullets: ['Gentle Valsalva: pinch your nose and gently blow against it', 'Swallow or wiggle your jaw', 'Toynbee: pinch your nose and swallow', 'Frenzel: use your tongue to push air up (practise with an instructor)'] },
      { heading: 'When it won’t clear', body: ['Stop, ascend a little and try again. Never force it. If you still can’t equalise, end the dive. Pain, vertigo or hearing changes after a dive warrant medical evaluation.'] },
    ],
    realWorld: 'A diver feels pressure at 3 m, rises half a metre, swallows and gently equalises — then completes the descent comfortably.',
    keyTakeaways: ['Early and often', 'Gentle, never forceful', 'Can’t clear? Don’t dive'],
    check: [
      { question: 'When should you first equalise?', options: ['At 10 m', 'At the surface, before descending', 'When it hurts', 'At the bottom'], correctIndex: 1, explanation: 'Start before you descend and continue frequently.' },
      { question: 'An ear won’t equalise after ascending slightly and retrying. You should…', options: ['Force a hard Valsalva', 'End the dive', 'Descend quickly', 'Hold your breath'], correctIndex: 1, explanation: 'Aborting avoids ear injury.' },
    ],
  },
  {
    id: 'ow-06', course: 'open-water', order: 6, title: 'Breathing underwater', duration: 8, illustration: 'regulator',
    summary: 'Slow, deep, continuous breathing — for comfort, buoyancy and gas efficiency.',
    objectives: ['Describe ideal underwater breathing', 'Recognise signs of overexertion', 'Respond to breathing difficulties'],
    sections: [
      { heading: 'Breathe slowly and deeply', body: ['Dense gas at depth requires slower, deeper breaths. Rapid shallow breathing increases dead-air space and CO₂ build-up, leading to breathlessness.'] },
      { heading: 'Never hold your breath', body: ['Holding your breath while changing depth — especially ascending — risks lung over-expansion injuries. Breathe continuously throughout the dive.'] },
      { heading: 'Overexertion', body: ['If you feel short of breath, stop, rest and breathe slowly. Hold on to something non-living if needed and signal your buddy. Avoid swimming hard against currents.'] },
    ],
    realWorld: 'A new diver finds their gas lasts longer once they relax, slow their kicks and breathe slowly — their air consumption improves dramatically over a few dives.',
    keyTakeaways: ['Slow, deep, continuous', 'Stop and rest if breathless', 'Relaxed divers use less gas'],
    check: [
      { question: 'What is the ideal breathing pattern underwater?', options: ['Quick and shallow', 'Slow, deep and continuous', 'Skip-breathing to save air', 'Holding between breaths'], correctIndex: 1, explanation: 'Slow, deep, continuous breaths are efficient and safe.' },
      { question: 'You feel breathless after swimming hard. First step?', options: ['Ascend fast', 'Stop, rest and breathe slowly', 'Kick harder', 'Remove the regulator'], correctIndex: 1, explanation: 'Stopping activity allows recovery.' },
    ],
  },
  {
    id: 'ow-07', course: 'open-water', order: 7, title: 'Buoyancy fundamentals', duration: 14, illustration: 'buoyancy',
    summary: 'Archimedes’ principle, weighting and how to hover effortlessly.',
    objectives: ['Explain positive, neutral and negative buoyancy', 'Perform a surface weight check', 'Use the BCD and breathing to control buoyancy'],
    sections: [
      { heading: 'Archimedes’ principle', body: ['An object in water is buoyed up by a force equal to the weight of water it displaces. If you displace more than you weigh you float; less and you sink; equal and you hover.'] },
      { heading: 'Weighting', body: ['Use just enough weight. A common check: with an empty BCD and a normal breath held, you float at eye level and sink slowly as you exhale. Remember a cylinder gets lighter as you breathe from it.'] },
      { heading: 'Control underwater', body: ['Add small amounts of air as you descend, vent as you ascend, and fine-tune with your breathing. Make one adjustment, wait a few seconds, then reassess.'], bullets: ['Small inputs, wait, observe', 'Horizontal trim reduces drag', 'Vent before you start to rise'] },
    ],
    realWorld: 'A diver drops 2 kg after a weight check and finds they use less gas, kick less and stay off the reef more easily.',
    keyTakeaways: ['Neutral buoyancy is the goal', 'Correct weighting makes everything easier', 'Adjust little and often'],
    check: [
      { question: 'You displace exactly your own weight in water. You are…', options: ['Positively buoyant', 'Negatively buoyant', 'Neutrally buoyant', 'Overweighted'], correctIndex: 2, explanation: 'Equal forces = neutral buoyancy.' },
      { question: 'What happens to your buoyancy as your cylinder empties?', options: ['You become heavier', 'You become lighter (more buoyant)', 'Nothing', 'It depends on the colour'], correctIndex: 1, explanation: 'Gas has weight; using it makes the cylinder lighter.' },
    ],
  },
  {
    id: 'ow-08', course: 'open-water', order: 8, title: 'Mask clearing', duration: 8, illustration: 'mask',
    summary: 'Clear water from your mask calmly — and handle mask removal and replacement.',
    objectives: ['Clear a partially and fully flooded mask', 'Breathe without a mask', 'Prevent fogging'],
    sections: [
      { heading: 'Partial and full flood', body: ['Look slightly up, press the top of the mask frame against your forehead and exhale steadily through your nose. Air displaces water out of the bottom of the skirt. Repeat if necessary.'] },
      { heading: 'Breathing without a mask', body: ['Water on your nose can feel strange. Breathe slowly through your mouth and exhale through your nose to keep water out. Practising this in confined water builds confidence.'] },
      { heading: 'Fog prevention', body: ['Clean new masks to remove manufacturing residue (follow the manufacturer’s guidance) and use defog before each dive. Keep hair out of the skirt seal.'] },
    ],
    realWorld: 'A buddy’s fin knocks a diver’s mask. Because they practised, they calmly re-seat it and clear it in seconds.',
    keyTakeaways: ['Press the top, exhale through the nose, look up', 'Stay calm — it’s just water', 'Prepare masks to prevent fog'],
    check: [
      { question: 'To clear a mask, press the top of the frame and…', options: ['Inhale through the nose', 'Exhale through the nose while looking slightly up', 'Hold your breath', 'Shake your head'], correctIndex: 1, explanation: 'Exhaled air pushes water out the bottom.' },
      { question: 'Without a mask, you should…', options: ['Breathe through your nose', 'Breathe through your mouth and exhale through your nose', 'Hold your breath', 'Surface immediately'], correctIndex: 1, explanation: 'Exhaling through the nose keeps water out.' },
    ],
  },
  {
    id: 'ow-09', course: 'open-water', order: 9, title: 'Regulator recovery', duration: 8, illustration: 'regulator',
    summary: 'Find and clear your regulator if it leaves your mouth.',
    objectives: ['Perform the arm-sweep recovery', 'Clear a regulator by exhaling or purging', 'Keep exhaling whenever the regulator is out'],
    sections: [
      { heading: 'Arm-sweep method', body: ['Lean slightly to your right, extend your right arm down to your hip, then sweep it forward. The hose will fall across your arm and the regulator comes back to your hand.'] },
      { heading: 'Clearing', body: ['Exhale into the regulator to push out water, or press the purge button while blocking the mouthpiece with your tongue. Take the first breath cautiously.'] },
      { heading: 'Keep a slow exhale', body: ['While the regulator is out, exhale slowly with a small stream of bubbles. This keeps your airway open and prevents breath-holding.'] },
    ],
    realWorld: 'A regulator is knocked out of a diver’s mouth by a strong surge. They exhale gently, sweep, recover, clear and continue — all in under 10 seconds.',
    keyTakeaways: ['Exhale slowly while it’s out', 'Sweep from hip forward', 'Purge or exhale to clear'],
    check: [
      { question: 'While the regulator is out of your mouth you should…', options: ['Hold your breath', 'Exhale slowly', 'Inhale through your nose', 'Swim to the surface'], correctIndex: 1, explanation: 'Slow exhalation avoids breath-holding.' },
      { question: 'Which arm is used for the arm-sweep method?', options: ['Left', 'Right', 'Either, randomly', 'Neither'], correctIndex: 1, explanation: 'The regulator hose normally comes over the right shoulder.' },
    ],
  },
  {
    id: 'ow-10', course: 'open-water', order: 10, title: 'Basic underwater communication', duration: 10, illustration: 'signals',
    summary: 'Standard hand signals, slates and surface signals.',
    objectives: ['Use and respond to core hand signals', 'Communicate gas pressure', 'Use surface signals'],
    sections: [
      { heading: 'Core signals', body: ['Signals are only useful if both buddies agree on them. Review them before every dive with a new buddy.'], bullets: ['OK — thumb and index finger ring (always answer it)', 'Something wrong — flat hand rocking, then point', 'Up — thumbs-up (not “good”)', 'Down — thumbs-down', 'Out of air — flat hand across throat', 'Share air — fingers pointing to the mouth', 'Stop / hold — flat palm facing buddy'] },
      { heading: 'Gas pressure', body: ['Agencies and regions use different signals for pressure (finger counts, fist on palm, etc.). Agree yours in the briefing — especially the “low on air” and “reserve” signals.'] },
      { heading: 'At the surface', body: ['A large OK over the head (or a hand on the head) means “OK”. Waving an arm means “help”. Whistles, horns and inflatable SMBs attract attention.'] },
    ],
    realWorld: 'Two divers from different countries discover they use different pressure signals. Reviewing them in the briefing prevents a dangerous misunderstanding.',
    keyTakeaways: ['Always answer an OK', 'Thumbs-up means ascend', 'Agree signals pre-dive'],
    check: [
      { question: 'A thumbs-up underwater means…', options: ['Great!', 'Ascend / end the dive', 'Descend', 'Low on air'], correctIndex: 1, explanation: 'Use “OK” for good; thumbs-up is “go up”.' },
      { question: 'Waving an arm at the surface typically means…', options: ['Hello', 'I need help', 'OK', 'Pick me up last'], correctIndex: 1, explanation: 'It is the distress signal — don’t wave casually.' },
    ],
  },
  {
    id: 'ow-11', course: 'open-water', order: 11, title: 'The buddy system', duration: 10, illustration: 'buddy',
    summary: 'Why buddies matter, pre-dive checks and staying together.',
    objectives: ['Describe buddy responsibilities', 'Perform a pre-dive safety check', 'Follow lost-buddy procedures'],
    sections: [
      { heading: 'Why dive with a buddy?', body: ['A buddy can help with equipment issues, share gas in an emergency, and make diving more fun. Good buddies stay close, communicate and agree on the plan.'] },
      { heading: 'Pre-dive safety check', body: ['A common mnemonic is BWRAF: BCD, Weights, Releases, Air, Final OK. Inflate and deflate BCDs, check weights and releases, confirm air is on, breathe from both second stages and do a final head-to-toe look.'] },
      { heading: 'Staying together', body: ['Agree on position (e.g. side by side), check each other often and decide what to do if separated: commonly a brief search (about a minute), then ascend and reunite at the surface.'] },
    ],
    realWorld: 'During the buddy check, a diver notices their buddy’s cylinder valve is closed — a potentially serious problem caught on the surface.',
    keyTakeaways: ['BWRAF before every dive', 'Stay within reach', 'Agree lost-buddy procedure'],
    check: [
      { question: 'In BWRAF, the “A” stands for…', options: ['Alternate', 'Air', 'Ascent', 'Anchor'], correctIndex: 1, explanation: 'Air: valves open, gauges checked, regulators breathed.' },
      { question: 'If separated from your buddy, the common procedure is…', options: ['Continue alone', 'Search briefly then ascend to reunite', 'Wait at the bottom', 'Descend'], correctIndex: 1, explanation: 'Search about a minute, then surface and reunite.' },
    ],
  },
  {
    id: 'ow-12', course: 'open-water', order: 12, title: 'Underwater navigation basics', duration: 12, illustration: 'compass',
    summary: 'Natural navigation and simple compass use.',
    objectives: ['Use natural cues to navigate', 'Follow a compass heading and its reciprocal', 'Estimate distance underwater'],
    sections: [
      { heading: 'Natural navigation', body: ['Notice depth contours, sand ripples (often parallel to shore), reef features, the direction of light and current. Note landmarks at turns.'] },
      { heading: 'Compass basics', body: ['Hold the compass level with the lubber line aligned to your body’s centre. Set the bezel marks on the heading, keep the needle between them and swim. To return, add or subtract 180° for the reciprocal.'] },
      { heading: 'Distance', body: ['Count kick cycles or time at a steady pace. Calibrate your kick cycles over a known distance in calm water.'] },
    ],
    realWorld: 'At the end of a shore dive, a diver follows the reciprocal heading back and surfaces right next to the entry point instead of a long surface swim.',
    keyTakeaways: ['Reciprocal = heading ± 180°', 'Lubber line on your centre line', 'Combine natural and compass navigation'],
    check: [
      { question: 'The reciprocal of 300° is…', options: ['120°', '150°', '210°', '330°'], correctIndex: 0, explanation: '300 − 180 = 120°.' },
      { question: 'Sand ripples usually run…', options: ['Parallel to shore', 'Perpendicular to shore', 'In circles', 'Toward the boat'], correctIndex: 0, explanation: 'Waves usually create ripples parallel to the shoreline.' },
    ],
  },
  {
    id: 'ow-13', course: 'open-water', order: 13, title: 'Dive planning fundamentals', duration: 14, illustration: 'profile',
    summary: 'Depth, time, gas, conditions and contingency — planning every dive.',
    objectives: ['Plan depth and time within limits', 'Set gas turn and reserve pressures', 'Include contingencies in the plan'],
    sections: [
      { heading: 'Plan the dive, dive the plan', body: ['Agree on maximum depth, maximum time, route, gas limits and signals. Choose sites and conditions within your training and experience.'] },
      { heading: 'Depth and time', body: ['Use your dive computer (or agency tables, as trained) to stay well within no-decompression limits. Plan the deepest part first and work shallower. Remember that repetitive dives carry residual nitrogen.'] },
      { heading: 'Gas management', body: ['Agree the pressure at which you will begin the ascent so you surface with a reserve. Many divers use guidelines taught by their agency; your instructor will explain the method appropriate to your diving.'] },
      { heading: 'Contingencies', body: ['What if you get separated, the current changes or visibility drops? Decide in advance. Know where emergency oxygen and help are located.'] },
    ],
    realWorld: 'A pair plan a 40-minute dive to 16 m, agree to turn at 100 bar and ascend at 70 bar. When one diver’s gas use is higher than expected, they end the dive early as agreed — no drama.',
    keyTakeaways: ['Agree depth, time, gas and procedures', 'Deepest first', 'Plan for what might go wrong'],
    check: [
      { question: 'On multilevel dives, you should generally…', options: ['Start shallow and go deeper', 'Start deep and work shallower', 'Stay at max depth all dive', 'Alternate'], correctIndex: 1, explanation: 'Deep-to-shallow profiles reduce nitrogen loading.' },
      { question: 'Why set an ascent pressure?', options: ['To save money', 'To surface with a reserve for emergencies', 'Because the computer requires it', 'To impress the buddy'], correctIndex: 1, explanation: 'A reserve covers unexpected events.' },
    ],
  },
  {
    id: 'ow-14', course: 'open-water', order: 14, title: 'Safe ascent procedures', duration: 12, illustration: 'ascent',
    summary: 'Slow ascents, safety stops and emergency ascent options.',
    objectives: ['Perform a controlled ascent', 'Make a safety stop', 'Describe emergency ascent options in order of preference'],
    sections: [
      { heading: 'Normal ascent', body: ['Signal, agree with your buddy, look up, reach up and ascend slowly — no faster than your computer and training allow (commonly 9–18 m per minute, slower is better). Vent your BCD and keep breathing.'] },
      { heading: 'Safety stop', body: ['On no-decompression dives, many agencies recommend a stop of about 3 minutes at around 5 m (15 ft). It adds a margin of conservatism and helps control the final ascent.'] },
      { heading: 'Out-of-gas options', body: ['Prevention comes first: monitor your gas. If it happens, options taught include: ascending with your buddy’s alternate air source; a controlled emergency swimming ascent (exhaling continuously) when shallow and no buddy is near; and, as a last resort, a buoyant emergency ascent. Your instructor will train these in context.'] },
    ],
    realWorld: 'A diver’s computer flashes an ascent-rate warning at 8 m. They stop, vent their BCD, stabilise and continue more slowly to their safety stop.',
    keyTakeaways: ['Slow ascents, always', 'Safety stop ≈ 3 min at 5 m', 'Prevention beats emergency procedures'],
    check: [
      { question: 'A typical recreational safety stop is…', options: ['1 min at 10 m', '3 min at about 5 m', '10 min at 3 m', 'Not necessary'], correctIndex: 1, explanation: '3 minutes at about 5 m is the most common recommendation.' },
      { question: 'During any emergency ascent you must…', options: ['Hold your breath', 'Keep exhaling / breathing', 'Remove your mask', 'Inflate your BCD fully'], correctIndex: 1, explanation: 'Never hold your breath while ascending.' },
    ],
  },
  {
    id: 'ow-15', course: 'open-water', order: 15, title: 'Diving environment awareness', duration: 12, illustration: 'reef',
    summary: 'Currents, waves, visibility, temperature, marine life — and protecting it all.',
    objectives: ['Recognise how conditions affect a dive', 'Interact responsibly with marine life', 'Practise reef-friendly diving habits'],
    sections: [
      { heading: 'Conditions', body: ['Waves and surge affect entries and exits. Currents can be stronger than you can swim against — start dives into the current where possible. Visibility and temperature vary with season, tide and weather. Ask local professionals.'] },
      { heading: 'Marine life', body: ['Most aquatic animals are not dangerous unless touched or harassed. Look but don’t touch, keep your distance and never chase or ride animals.'] },
      { heading: 'Protect what you came to see', body: ['Good buoyancy, streamlined equipment and careful fin technique protect fragile reefs. Take only pictures, leave only bubbles, and support conservation efforts.'] },
    ],
    realWorld: 'Briefed about a mild current, a group begins the dive swimming gently against it and returns effortlessly with it at the end.',
    keyTakeaways: ['Respect conditions — ask locals', 'Look, don’t touch', 'Buoyancy protects reefs'],
    check: [
      { question: 'If there is a mild current, it’s usually best to…', options: ['Start with the current', 'Start into the current so it helps you return', 'Ignore it', 'Dive deeper'], correctIndex: 1, explanation: 'Swimming into the current first makes the return easier.' },
      { question: 'Most marine-life injuries occur because…', options: ['Animals hunt divers', 'Divers touch or harass animals', 'Water is cold', 'Masks fog'], correctIndex: 1, explanation: 'Defensive reactions cause most injuries.' },
    ],
  },
];
