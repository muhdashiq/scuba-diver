import type { AdventureModule } from '@/types';

export const AOW_NOTE =
  'The number and selection of adventure dives in an Advanced Open Water course depend on your training agency and course requirements. Many agencies require specific dives (often Deep and Underwater Navigation) plus electives — confirm details with your instructor.';

export const AOW_MODULES: AdventureModule[] = [
  {
    id: 'aow-deep', title: 'Deep Diving', illustration: 'profile',
    summary: 'Planning and managing dives deeper than 18 m within recreational limits.',
    theory: ['Gas consumption scales with absolute pressure — at 30 m you use about four times as much as at the surface.', 'Nitrogen narcosis can impair judgement from around 30 m (individual and day-to-day variation is large). Ascending a few metres usually relieves it.', 'No-decompression limits shorten dramatically with depth; monitor your computer closely.'],
    equipment: ['Dive computer (and an understanding of its warnings)', 'Reliable regulator serviced as recommended', 'Surface marker buoy and signalling devices', 'A light to restore colour and read gauges at depth'],
    planning: ['Agree a maximum depth within training limits (commonly 30 m for AOW)', 'Plan conservative turn and ascent pressures', 'Consider a descent line or reference, and plan the safety stop'],
    skills: ['Controlled descent with a reference', 'Monitoring gauges more frequently', 'Recognising narcosis in yourself and your buddy', 'Slow ascent and safety stop'],
    safety: ['Never exceed your training limits', 'Watch for narcosis and ascend if affected', 'Leave a larger gas reserve than for shallow dives'],
    check: [
      { question: 'At 30 m, approximately how much faster do you use gas than at the surface?', options: ['Same', '2×', '3×', '4×'], correctIndex: 3, explanation: 'Absolute pressure at 30 m is 4 bar.' },
      { question: 'The first response to suspected narcosis is to…', options: ['Descend', 'Ascend a few metres with your buddy', 'Hold your breath', 'Remove your mask'], correctIndex: 1, explanation: 'Narcosis is depth-related and eases on ascent.' },
    ],
  },
  {
    id: 'aow-nav', title: 'Underwater Navigation', illustration: 'compass',
    summary: 'Compass patterns, natural navigation and distance estimation.',
    theory: ['Compass headings, reciprocals and patterns (out-and-back, square, triangle).', 'Natural cues: depth contours, sand ripples, light, current, landmarks.', 'Distance estimation using kick cycles or time.'],
    equipment: ['Wrist or console compass', 'Slate for notes', 'Optional distance line or reel for practice'],
    planning: ['Brief the route with landmarks and headings', 'Agree who navigates and who monitors depth/gas', 'Account for current drift'],
    skills: ['Calibrating kick cycles', 'Out-and-back on a heading', 'Square pattern', 'Combining compass and natural navigation'],
    safety: ['Navigation tasks are task-loading — keep monitoring depth and gas', 'Stay within visibility range of your buddy'],
    check: [
      { question: 'A triangle navigation pattern uses turns of…', options: ['90°', '120°', '180°', '45°'], correctIndex: 1, explanation: 'Three 120° turns with equal legs return you to start.' },
      { question: 'Why calibrate kick cycles?', options: ['To save gas', 'To estimate distance', 'To equalise', 'To trim'], correctIndex: 1, explanation: 'Known kick cycles per distance let you estimate how far you’ve swum.' },
    ],
  },
  {
    id: 'aow-ppb', title: 'Peak Performance Buoyancy', illustration: 'buoyancy',
    summary: 'Refined weighting, trim and hovering for effortless diving.',
    theory: ['Precise weighting through structured weight checks.', 'Trim: weight distribution affects body angle.', 'Breathing control for fine buoyancy adjustments.'],
    equipment: ['Trim weights or pockets to adjust weight distribution', 'Streamlined hoses and clipped accessories'],
    planning: ['Choose a site with a sandy bottom for practice', 'Carry out a weight check at the start and at the end of the dive'],
    skills: ['Hovering motionless in horizontal trim', 'Fin-pivot and controlled vertical changes', 'Swimming through hoops or past references without contact', 'Frog kick and reverse kick (introduction)'],
    safety: ['Avoid contact with the bottom and marine life', 'Be ready to vent quickly during depth changes'],
    check: [
      { question: 'Correct weighting at the end of the dive lets you…', options: ['Sink fast', 'Hold a safety stop with a near-empty cylinder', 'Skip the safety stop', 'Avoid using a BCD'], correctIndex: 1, explanation: 'Cylinders become lighter as gas is used.' },
      { question: 'Trim refers to…', options: ['Mask fit', 'Body position/angle in the water', 'Fin length', 'Hose routing'], correctIndex: 1, explanation: 'Trim is your attitude in the water — ideally horizontal.' },
    ],
  },
  {
    id: 'aow-night', title: 'Night Diving', illustration: 'night',
    summary: 'Lights, communication and orientation after dark.',
    theory: ['Many nocturnal animals emerge at night; others shelter.', 'Light signals replace hand signals (circle = OK, rapid side-to-side = attention/problem).', 'Orientation is harder — use known sites and compass references.'],
    equipment: ['Primary light and backup light', 'Tank marker / chemical light or strobe', 'Shore or boat exit light', 'Signalling devices'],
    planning: ['Dive the site in daylight first', 'Mark entry/exit clearly', 'Agree light signals and lost-buddy procedure'],
    skills: ['Light handling without blinding buddies', 'Navigation at night', 'Communicating with lights', 'Controlled descents and ascents with reference'],
    safety: ['Never shine lights in eyes', 'Stay closer to your buddy than in the day', 'Carry backups'],
    check: [
      { question: 'Sweeping a light in a slow circle usually means…', options: ['Help', 'OK', 'Go up', 'Look here'], correctIndex: 1, explanation: 'A circle is the common OK light signal; rapid side-to-side sweeps attract attention.' },
      { question: 'Why dive a night site in daylight first?', options: ['Better photos', 'Familiarity with layout and hazards', 'It’s required by law', 'Saves gas'], correctIndex: 1, explanation: 'Knowing the site reduces navigation stress.' },
    ],
  },
  {
    id: 'aow-search', title: 'Search and Recovery', illustration: 'search',
    summary: 'Search patterns and safe lifting of small objects.',
    theory: ['Search patterns: expanding square, U-pattern, circular (using a line).', 'Lift bags and controlled lifts; lifting principles (Archimedes).', 'Limits: recreational divers recover small objects only.'],
    equipment: ['Reel/line and marker', 'Small lift bag rated for the load', 'Compass and slate', 'Cutting tool'],
    planning: ['Gather info about the lost item’s last known position', 'Choose a pattern for bottom type and visibility', 'Agree lift procedures and roles'],
    skills: ['Running a search pattern', 'Attaching a lift bag correctly', 'Controlled lift with venting'],
    safety: ['Never attach a lift bag to yourself', 'Beware of runaway ascents', 'Entanglement awareness'],
    check: [
      { question: 'You should never attach a lift bag…', options: ['To the object', 'To yourself', 'With a knot', 'In clear water'], correctIndex: 1, explanation: 'A runaway bag could drag you to the surface.' },
      { question: 'A circular search uses…', options: ['A fixed pivot and line', 'Random swimming', 'A compass only', 'A lift bag'], correctIndex: 0, explanation: 'The diver sweeps around an anchored line, increasing radius each lap.' },
    ],
  },
  {
    id: 'aow-photo', title: 'Underwater Photography', illustration: 'camera',
    summary: 'Composition, light and responsible photography.',
    theory: ['Water absorbs colour and reduces contrast; get close to minimise water between lens and subject.', 'Strobes/video lights restore colour; positioning reduces backscatter.', 'Composition: shoot slightly upward, fill the frame, focus on the eyes.'],
    equipment: ['Camera and housing (inspect O-rings!)', 'Strobe or video light', 'Lanyard/clip'],
    planning: ['Check housing seals before the dive', 'Agree with your buddy how photo stops will work', 'Choose subjects suited to conditions'],
    skills: ['Buoyancy while composing', 'Approaching subjects without disturbing them', 'Basic exposure and white balance'],
    safety: ['Photography is task-loading — keep monitoring gas and depth', 'Never touch or move subjects', 'Keep buddy contact'],
    check: [
      { question: 'To improve colour and clarity, you should…', options: ['Shoot from far away', 'Get closer to reduce the water column', 'Use zoom only', 'Shoot downward'], correctIndex: 1, explanation: 'Less water = more colour and contrast.' },
      { question: 'Backscatter is caused by…', options: ['Fogged lenses', 'Light reflecting off particles in front of the lens', 'Low battery', 'Cold water'], correctIndex: 1, explanation: 'Angling strobes outward reduces it.' },
    ],
  },
  {
    id: 'aow-wreck', title: 'Wreck Diving', illustration: 'wreck',
    summary: 'Exploring wrecks safely — from the outside.',
    theory: ['Wrecks are artificial reefs and often historical or legally protected sites.', 'Hazards: sharp metal, entanglement (lines, nets), silt, collapse, overhead environments.', 'Penetration requires specialised Wreck training and equipment.'],
    equipment: ['Cutting tool', 'Light (even in daytime)', 'Reel for training contexts', 'Gloves only where permitted'],
    planning: ['Research the wreck’s layout and legal status', 'Plan non-penetration routes', 'Agree depth/gas limits'],
    skills: ['Mapping a wreck', 'Buoyancy and finning to avoid silt', 'Line handling (introduction)'],
    safety: ['No penetration without specific training', 'Watch for entanglement', 'Respect laws — take nothing'],
    check: [
      { question: 'Entering a wreck’s interior requires…', options: ['Nothing special', 'Wreck specialty training and equipment', 'A camera', 'Night training'], correctIndex: 1, explanation: 'Overhead environments need specialised training.' },
      { question: 'Why carry a cutting tool on a wreck?', options: ['To collect souvenirs', 'To free yourself from entanglement', 'To mark the route', 'To open hatches'], correctIndex: 1, explanation: 'Fishing line and nets are common hazards.' },
    ],
  },
  {
    id: 'aow-drift', title: 'Drift Diving', illustration: 'drift',
    summary: 'Going with the flow — safely.',
    theory: ['Currents are driven by tides, wind and ocean circulation.', 'Group procedures and boat pick-ups are central to drift diving.', 'Control buoyancy to stay with the group and away from the reef.'],
    equipment: ['Surface marker buoy (DSMB) and reel/spool', 'Audible signal (whistle/horn)', 'Reef hook only where appropriate and permitted'],
    planning: ['Brief entry (often negative entry), group stays together', 'Agree who deploys the SMB and when', 'Boat crew tracks the group'],
    skills: ['Negative entry and descent', 'Staying together in current', 'Deploying an SMB from depth'],
    safety: ['Never try to swim against a strong current', 'Always carry surface signalling devices', 'Stay with the group and SMB'],
    check: [
      { question: 'Why carry an SMB on drift dives?', options: ['For buoyancy', 'So the boat can track and find you', 'To mark fish', 'For photography'], correctIndex: 1, explanation: 'Boats follow SMBs to pick divers up.' },
      { question: 'In a strong current you should…', options: ['Fight it', 'Go with it and stay with the group', 'Descend', 'Remove fins'], correctIndex: 1, explanation: 'Fighting currents causes exhaustion.' },
    ],
  },
  {
    id: 'aow-boat', title: 'Boat Diving', illustration: 'boat',
    summary: 'Etiquette, entries, exits and procedures on dive boats.',
    theory: ['Boat terminology: bow, stern, port, starboard.', 'Roll counts and entry/exit procedures vary by boat type.', 'Seasickness prevention and management.'],
    equipment: ['Gear bag organised for limited space', 'SMB and signalling devices', 'Seasickness remedy (consult a physician)'],
    planning: ['Listen carefully to the boat briefing', 'Know where emergency equipment (oxygen, first aid, radio) is', 'Agree pickup procedures'],
    skills: ['Giant stride and back-roll entries', 'Using descent/mooring lines', 'Ladder exits — fins off safely'],
    safety: ['Stay clear of propellers', 'Check the roll call', 'Keep gear secured'],
    check: [
      { question: 'Port is the… side of a boat when facing the bow.', options: ['Right', 'Left', 'Front', 'Back'], correctIndex: 1, explanation: 'Port is left; starboard is right.' },
      { question: 'Why do boats perform a roll call?', options: ['Formality', 'To ensure nobody is left behind', 'To count weights', 'To log fish'], correctIndex: 1, explanation: 'Head counts prevent missing divers.' },
    ],
  },
  {
    id: 'aow-fishid', title: 'Fish Identification', illustration: 'fish',
    summary: 'Recognising fish families by shape, behaviour and markings.',
    theory: ['Identify families first (butterflyfish, angelfish, wrasse, parrotfish, grouper…) using body shape.', 'Use colour, markings, fins and behaviour to narrow down species.', 'Juveniles and males/females may look very different.'],
    equipment: ['Fish ID slate or guide', 'Optional camera'],
    planning: ['Study local species before the dive', 'Agree signals for common fish'],
    skills: ['Observing without disturbing', 'Recording sightings', 'Participating in citizen-science surveys'],
    safety: ['Maintain buoyancy while observing', 'Keep monitoring gas and depth'],
    check: [
      { question: 'Fish ID usually starts with…', options: ['Exact species', 'Family characteristics such as body shape', 'Colour only', 'Size only'], correctIndex: 1, explanation: 'Families first, then species details.' },
      { question: 'Why can colour alone mislead?', options: ['Fish change colour with age, sex and mood', 'Fish are colourless', 'Masks distort colour', 'It never misleads'], correctIndex: 0, explanation: 'Colour varies within species.' },
    ],
  },
];
