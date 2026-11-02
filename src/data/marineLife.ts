import type { MarineEntry, MarineGroup } from '@/types';

/**
 * Marine-life library. Scientific names are only given where the entry refers to a
 * specific, well-established species; group entries use the family or genus.
 * IUCN categories are included only where we are confident of the current global listing —
 * always check the IUCN Red List for the latest assessment.
 */

export const MARINE_GROUPS: { id: MarineGroup; label: string }[] = [
  { id: 'tropical-fish', label: 'Tropical fish' },
  { id: 'sharks-rays', label: 'Sharks & rays' },
  { id: 'turtles', label: 'Turtles' },
  { id: 'coral', label: 'Coral reefs' },
  { id: 'nudibranchs', label: 'Nudibranchs' },
  { id: 'seahorses', label: 'Seahorses' },
  { id: 'crustaceans', label: 'Crustaceans' },
  { id: 'wrecks', label: 'Wrecks' },
  { id: 'environments', label: 'Underwater environments' },
];

export const IUCN_LABELS: Record<NonNullable<MarineEntry['iucn']>, string> = {
  LC: 'Least Concern',
  NT: 'Near Threatened',
  VU: 'Vulnerable',
  EN: 'Endangered',
  CR: 'Critically Endangered',
  DD: 'Data Deficient',
  NE: 'Not Evaluated',
};

export const MARINE_LIFE: MarineEntry[] = [
  {
    id: 'clownfish', group: 'tropical-fish', commonName: 'Ocellaris clownfish', scientificName: 'Amphiprion ocellaris', art: 'clownfish', palette: ['#0891b2', '#164e63'],
    habitat: 'Shallow lagoons and reefs of the eastern Indian Ocean and western Pacific, living among host sea anemones.',
    identification: ['Bright orange body', 'Three white bands edged with thin black lines', 'Rounded fins with black margins'],
    facts: ['A protective mucus coating lets it live among the anemone’s stinging tentacles.', 'Clownfish are born male; the dominant fish in a group can change to female.'],
    conservation: 'Popular in the aquarium trade; anemone bleaching from warming seas also affects clownfish habitat. Never touch anemones.',
  },
  {
    id: 'queen-angelfish', group: 'tropical-fish', commonName: 'Queen angelfish', scientificName: 'Holacanthus ciliaris', art: 'angelfish', palette: ['#0284c7', '#0c4a6e'], iucn: 'LC',
    habitat: 'Reefs of the tropical western Atlantic, including the Caribbean and Gulf of Mexico.',
    identification: ['Blue-green body with yellow rim scales', 'Electric-blue “crown” spot on the forehead', 'Bright yellow tail'],
    facts: ['Feeds largely on sponges.', 'Juveniles look different and may act as cleaners.'],
    conservation: 'Collected for the aquarium trade in some areas. Reef protection benefits populations.',
  },
  {
    id: 'butterflyfish', group: 'tropical-fish', commonName: 'Threadfin butterflyfish', scientificName: 'Chaetodon auriga', art: 'butterflyfish', palette: ['#06b6d4', '#155e75'], iucn: 'LC',
    habitat: 'Indo-Pacific and Red Sea reefs and lagoons.',
    identification: ['White body with diagonal chevron lines', 'Yellow rear body', 'Black bar through the eye and a dark spot near the dorsal fin with a trailing filament'],
    facts: ['Often seen in pairs.', 'The eye bar and false eyespot may confuse predators.'],
    conservation: 'Many butterflyfish depend on healthy coral; they are used as indicators of reef health.',
  },
  {
    id: 'parrotfish', group: 'tropical-fish', commonName: 'Parrotfishes', scientificName: 'Family Scaridae', art: 'parrotfish', palette: ['#0d9488', '#134e4a'],
    habitat: 'Coral reefs and seagrass beds worldwide in tropical waters.',
    identification: ['Fused, beak-like teeth', 'Often vivid greens, blues and pinks', 'Swim with their pectoral fins'],
    facts: ['They scrape algae from coral and grind it, producing fine sand.', 'Some species sleep in a mucus “sleeping bag”.'],
    conservation: 'Important grazers that keep algae in check; protected from fishing in some reef management areas.',
  },
  {
    id: 'lionfish', group: 'tropical-fish', commonName: 'Red lionfish', scientificName: 'Pterois volitans', art: 'lionfish', palette: ['#0e7490', '#082f49'], iucn: 'LC',
    habitat: 'Native to the Indo-Pacific; invasive in the western Atlantic, Caribbean and parts of the Mediterranean.',
    identification: ['Red/maroon and white stripes', 'Long, fan-like pectoral fins', 'Long venomous dorsal spines'],
    facts: ['Venomous spines can cause intense pain; hot-water immersion and medical care are usually recommended.', 'A voracious predator of small reef fish.'],
    conservation: 'In its invasive range, authorised culling programmes help protect native fish.',
  },
  {
    id: 'moorish-idol', group: 'tropical-fish', commonName: 'Moorish idol', scientificName: 'Zanclus cornutus', art: 'moorish-idol', palette: ['#0891b2', '#0c4a6e'], iucn: 'LC',
    habitat: 'Reefs across the Indo-Pacific and eastern Pacific.',
    identification: ['Bold black, white and yellow vertical bands', 'Very long white dorsal fin filament', 'Small, tubular snout'],
    facts: ['The only species in its family, Zanclidae.', 'Often confused with bannerfish.'],
    conservation: 'Hard to keep in aquariums — best enjoyed in the wild.',
  },
  {
    id: 'blacktip-reef-shark', group: 'sharks-rays', commonName: 'Blacktip reef shark', scientificName: 'Carcharhinus melanopterus', art: 'reef-shark', palette: ['#0ea5e9', '#0c4a6e'], iucn: 'VU',
    habitat: 'Shallow reefs and lagoons of the Indo-Pacific.',
    identification: ['Prominent black tips on fins, especially the first dorsal', 'Light grey-brown body with a white belly', 'Usually under 1.8 m'],
    facts: ['Often seen in very shallow water over reef flats.', 'Typically timid around divers.'],
    conservation: 'Threatened by fishing; sharks play a key role as predators in reef ecosystems.',
  },
  {
    id: 'whale-shark', group: 'sharks-rays', commonName: 'Whale shark', scientificName: 'Rhincodon typus', art: 'whale-shark', palette: ['#38bdf8', '#075985'], iucn: 'EN',
    habitat: 'Tropical and warm-temperate oceans worldwide, often near plankton-rich coastal areas.',
    identification: ['Huge size — the largest fish', 'Checkerboard of pale spots and stripes', 'Wide, flat head with a terminal mouth'],
    facts: ['A filter feeder that eats plankton and small fish.', 'Each individual’s spot pattern is unique, used for photo-ID research.'],
    conservation: 'Endangered. Follow local codes of conduct: keep distance, no touching, no flash where prohibited.',
  },
  {
    id: 'manta', group: 'sharks-rays', commonName: 'Giant oceanic manta ray', scientificName: 'Mobula birostris', art: 'manta', palette: ['#38bdf8', '#0c4a6e'], iucn: 'EN',
    habitat: 'Tropical and temperate oceans; visits cleaning stations on reefs.',
    identification: ['Wingspan that can exceed 5 m', 'Cephalic lobes either side of a wide, front-facing mouth', 'Dark back with pale shoulder patches'],
    facts: ['Has one of the largest brain-to-body ratios of any fish.', 'Belly spot patterns identify individuals.'],
    conservation: 'Endangered due to fishing and bycatch. Never touch — it damages their protective mucus.',
  },
  {
    id: 'ribbontail-ray', group: 'sharks-rays', commonName: 'Bluespotted ribbontail ray', scientificName: 'Taeniura lymma', art: 'stingray', palette: ['#14b8a6', '#134e4a'],
    habitat: 'Indo-Pacific reefs and sandy patches, often under ledges.',
    identification: ['Oval brownish disc with bright blue spots', 'Blue stripes along the tail', 'Venomous tail spine(s)'],
    facts: ['Moves into shallow water at high tide to feed.', 'Usually flees when approached.'],
    conservation: 'Affected by habitat degradation and fishing. Don’t crowd rays resting under ledges.',
  },
  {
    id: 'green-turtle', group: 'turtles', commonName: 'Green sea turtle', scientificName: 'Chelonia mydas', art: 'turtle', palette: ['#0e7490', '#083344'], iucn: 'EN',
    habitat: 'Tropical and subtropical seas worldwide, feeding in seagrass meadows and reefs.',
    identification: ['Smooth, oval carapace', 'Single pair of scales in front of the eyes', 'Rounded, beak-like jaw'],
    facts: ['Named for the green colour of its body fat, from a herbivorous diet.', 'Females return to the region where they hatched to nest.'],
    conservation: 'Endangered globally. Never block a turtle’s path to the surface; avoid touching or chasing.',
  },
  {
    id: 'hawksbill-turtle', group: 'turtles', commonName: 'Hawksbill turtle', scientificName: 'Eretmochelys imbricata', art: 'turtle', palette: ['#0891b2', '#082f49'], iucn: 'CR',
    habitat: 'Tropical coral reefs worldwide.',
    identification: ['Narrow, pointed bird-like beak', 'Overlapping carapace scutes', 'Serrated rear edge of the shell'],
    facts: ['Feeds heavily on sponges.', 'Historically hunted for “tortoiseshell”.'],
    conservation: 'Critically Endangered. International trade in hawksbill products is prohibited under CITES.',
  },
  {
    id: 'staghorn', group: 'coral', commonName: 'Staghorn coral', scientificName: 'Acropora cervicornis', art: 'coral-branching', palette: ['#0891b2', '#0c4a6e'], iucn: 'CR',
    habitat: 'Shallow Caribbean and western Atlantic reefs.',
    identification: ['Antler-like cylindrical branches', 'Golden-brown colour', 'Fast-growing thickets'],
    facts: ['One of the fastest-growing Caribbean corals.', 'Widely used in coral restoration nurseries.'],
    conservation: 'Critically Endangered after disease and bleaching events. Restoration projects outplant nursery-grown fragments.',
  },
  {
    id: 'brain-coral', group: 'coral', commonName: 'Brain corals', scientificName: 'Various genera (e.g. Diploria, Platygyra)', art: 'coral-brain', palette: ['#0e7490', '#164e63'],
    habitat: 'Reefs worldwide in tropical waters.',
    identification: ['Rounded, dome-shaped colonies', 'Maze-like grooves resembling a brain'],
    facts: ['Large colonies can be centuries old.', 'Polyps extend tentacles to feed at night.'],
    conservation: 'Slow growth means damage from fins or anchors takes decades to recover.',
  },
  {
    id: 'sea-fan', group: 'coral', commonName: 'Common sea fan', scientificName: 'Gorgonia ventalina', art: 'coral-fan', palette: ['#0284c7', '#082f49'],
    habitat: 'Caribbean reefs, often in areas with water movement.',
    identification: ['Flat, lace-like fan', 'Purple to yellowish colour', 'Oriented across the prevailing current'],
    facts: ['A soft coral (gorgonian) with a flexible protein skeleton.', 'Orientation maximises plankton capture.'],
    conservation: 'Vulnerable to disease and physical damage. Keep fins and gauges clear.',
  },
  {
    id: 'spanish-dancer', group: 'nudibranchs', commonName: 'Spanish dancer', scientificName: 'Hexabranchus sanguineus', art: 'nudibranch', palette: ['#7c3aed', '#1e1b4b'],
    habitat: 'Indo-Pacific and Red Sea reefs; often seen at night.',
    identification: ['Large, red to orange body', 'Unfurls a flamenco-like mantle when swimming'],
    facts: ['One of the largest nudibranchs, reaching over 30 cm.', 'Its egg ribbons look like red roses.'],
    conservation: 'Like all nudibranchs, sensitive to handling. Photograph without touching.',
  },
  {
    id: 'chromodorid', group: 'nudibranchs', commonName: 'Chromodorid nudibranchs', scientificName: 'Family Chromodorididae', art: 'nudibranch', palette: ['#0891b2', '#312e81'],
    habitat: 'Reefs worldwide, especially the Indo-Pacific.',
    identification: ['Vivid colours and patterns', 'Paired rhinophores on the head', 'Gill plume on the back'],
    facts: ['Bright colours warn predators of chemical defences, often from the sponges they eat.', 'Hermaphrodites — each has both male and female organs.'],
    conservation: 'Indicators of biodiversity; popular with macro photographers.',
  },
  {
    id: 'seahorse', group: 'seahorses', commonName: 'Seahorses', scientificName: 'Genus Hippocampus', art: 'seahorse', palette: ['#0d9488', '#134e4a'],
    habitat: 'Seagrass beds, mangroves and reefs in tropical and temperate waters.',
    identification: ['Horse-like head and upright posture', 'Prehensile tail used to grip', 'Bony plates instead of scales'],
    facts: ['Males carry and give birth to the young.', 'Can move each eye independently.'],
    conservation: 'All seahorse species are listed in CITES Appendix II; many are threatened by trade and habitat loss.',
  },
  {
    id: 'spiny-lobster', group: 'crustaceans', commonName: 'Caribbean spiny lobster', scientificName: 'Panulirus argus', art: 'lobster', palette: ['#0e7490', '#082f49'],
    habitat: 'Western Atlantic reefs, rock crevices and seagrass.',
    identification: ['No large claws', 'Long spiny antennae', 'Mottled brown body with spots on the tail'],
    facts: ['Undertakes mass migrations in single-file “queues”.', 'Makes a rasping sound to deter predators.'],
    conservation: 'Commercially important; fisheries are regulated by season and size limits.',
  },
  {
    id: 'cleaner-shrimp', group: 'crustaceans', commonName: 'Pacific cleaner shrimp', scientificName: 'Lysmata amboinensis', art: 'shrimp', palette: ['#0891b2', '#0c4a6e'],
    habitat: 'Indo-Pacific and Red Sea reefs, at cleaning stations.',
    identification: ['Red stripes bordered by white along the back', 'Long white antennae'],
    facts: ['Removes parasites from fish, even inside moray eels’ mouths.', 'May “clean” a still diver’s hand.'],
    conservation: 'Collected for aquariums. Observe without disturbing cleaning stations.',
  },
  {
    id: 'hermit-crab', group: 'crustaceans', commonName: 'Hermit crabs', scientificName: 'Superfamily Paguroidea', art: 'crab', palette: ['#0e7490', '#083344'],
    habitat: 'Worldwide from shallow shores to the deep sea.',
    identification: ['Soft abdomen hidden in a borrowed shell', 'Often one claw larger than the other'],
    facts: ['Swap to larger shells as they grow — sometimes in “vacancy chains”.', 'A reason never to collect “empty” shells.'],
    conservation: 'Shell collecting reduces available homes. Leave shells where they are.',
  },
  {
    id: 'thistlegorm', group: 'wrecks', commonName: 'SS Thistlegorm', art: 'wreck', palette: ['#155e75', '#020617'],
    habitat: 'Northern Red Sea, Egypt (Strait of Gubal), roughly 30 m deep.',
    identification: ['British armed merchant ship, about 126 m long', 'Holds containing WWII cargo such as trucks and motorcycles'],
    facts: ['Sunk by German aircraft in October 1941.', 'One of the world’s best-known wreck dives.'],
    conservation: 'A historic site: removing artefacts is prohibited. Avoid touching fragile structures and mind your bubbles in enclosed spaces.',
  },
  {
    id: 'artificial-reef', group: 'wrecks', commonName: 'Wrecks as artificial reefs', art: 'wreck', palette: ['#0e7490', '#082f49'],
    habitat: 'Worldwide; includes accidental wrecks and deliberately sunk, cleaned vessels.',
    identification: ['Hard structures colonised by corals, sponges and fish', 'Often attract pelagic species'],
    facts: ['Purpose-sunk ships are cleaned of pollutants first.', 'Can relieve diving pressure on natural reefs.'],
    conservation: 'Penetration requires wreck training; respect war graves and heritage laws.',
  },
  {
    id: 'kelp-forest', group: 'environments', commonName: 'Kelp forests', scientificName: 'e.g. giant kelp, Macrocystis pyrifera', art: 'kelp', palette: ['#15803d', '#052e16'],
    habitat: 'Cool, nutrient-rich coastal waters (e.g. California, South Africa, Tasmania).',
    identification: ['Tall brown algae with gas-filled floats', 'Canopy that filters sunlight'],
    facts: ['Giant kelp can grow up to around 60 cm in a day under ideal conditions.', 'Sea otters help protect kelp by eating sea urchins.'],
    conservation: 'Threatened by warming water and urchin overgrazing. Dive with care to avoid entanglement.',
  },
  {
    id: 'seagrass', group: 'environments', commonName: 'Seagrass meadows', art: 'seagrass', palette: ['#0d9488', '#064e3b'],
    habitat: 'Shallow, sheltered coastal waters worldwide.',
    identification: ['Flowering plants (not algae) with roots and leaves', 'Soft sandy or muddy bottoms'],
    facts: ['Nursery habitat for many fish and home to seahorses and turtles.', 'Stores significant amounts of carbon (“blue carbon”).'],
    conservation: 'Damaged by anchoring, dredging and pollution. Avoid kicking up sediment.',
  },
  {
    id: 'caves', group: 'environments', commonName: 'Underwater caves & cenotes', art: 'cave', palette: ['#0c4a6e', '#020617'],
    habitat: 'Limestone regions such as Mexico’s Yucatán, Florida and the Bahamas.',
    identification: ['Overhead rock with no direct access to the surface', 'Clear freshwater, sometimes layered over salt water (haloclines)'],
    facts: ['Cavern zones remain within sight of daylight.', 'Haloclines create shimmering visual effects.'],
    conservation: 'Fragile formations break easily. Overhead diving beyond the cavern zone requires specialised cave training.',
  },
];
