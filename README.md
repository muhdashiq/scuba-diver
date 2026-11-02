# ScubaDive: Smart Diving Companion & Learning Platform

A responsive, mobile-first scuba diving web app built with React and TypeScript. It covers learning (Open Water, Advanced Open Water, 17 specialties), self-testing (an image-based quiz engine), pre-dive readiness checks, an educational dive planner, live weather and marine conditions, nearby dive shops with WhatsApp contact, and a marine-life library.

> **Safety first.** ScubaDive is an educational companion. It does not replace training by a qualified instructor, a dive computer, or the procedures of a recognised training agency. The planner never calculates decompression schedules or no-decompression limits, and nothing in the app clears anyone to dive.

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | Animated underwater hero, diver profile and certification, dives logged, learning progress, readiness status, upcoming plans, live conditions, nearby shops, quick links, recent quizzes |
| **Learning Center** | 15 Open Water lessons (objectives, explanations, diagrams, real-world examples, knowledge checks, completion tracking) and 10 Advanced Open Water modules (theory, equipment, planning, skills, safety, quizzes) |
| **Specialties** | 17 specialty previews: overview, prerequisites, equipment, theory, skills, risks, learning pathway and quiz, each with a clear "not certification" notice |
| **Knowledge Quiz** | 73 questions across 11 categories and 3 difficulty levels. Multiple choice, true/false, image-based, identify-the-equipment and scenario questions. Timed and untimed modes, randomisation, instant feedback with annotated diagrams, a results breakdown, answer review and progress over time |
| **Dive Readiness** | 37 checks in four categories (personal, equipment, buddy, site), critical-item warnings, per-category progress, saved state. It never declares a diver "safe" |
| **Dive Planner** | Unit-aware inputs, validation, an illustrative depth profile (descent, bottom, ascent, safety-stop reminder), an educational gas estimate, MOD/ppO₂ for nitrox, the forecast for the dive day, buddy/entry/emergency considerations, advisories, save/print/export |
| **Weather & Conditions** | Open-Meteo forecast and marine data: current, hourly and 7-day weather, wind, gusts, rain, cloud, sea temperature, waves. Favourable/caution/unfavourable indicators with explanations. Pick a place by search, your location or the map |
| **Nearby Dive Shops** | OpenStreetMap (Overpass) results in map and card views, distance, contact details, opening hours, directions, and WhatsApp click-to-chat with an editable message |
| **Marine Life Library** | 26 entries across 9 groups with habitat, ID features, facts and conservation status, plus an image ID quiz |
| **Profile & Settings** | Profile, completed lessons, quiz history, saved plans, light/dark/system theme, metric/imperial units, backup export/import |

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui-style components (Radix primitives) · Lucide React · Framer Motion · Recharts · Leaflet / React-Leaflet · Zustand (LocalStorage persistence) · Vitest + Testing Library

All illustrations (equipment diagrams, hand signals, marine life, the hero scene) are original SVG artwork made for this project, so the app has no image-licensing issues and works offline once loaded.

## Getting started

Requires Node.js 18+ (20 recommended).

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit and component tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript only |

## Environment variables and API keys

**You don't need any API keys.** Every data source is free and key-less:

| Service | Used for | Key |
| --- | --- | --- |
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | Weather | None |
| [Open-Meteo Marine](https://open-meteo.com/en/docs/marine-weather-api) | Waves, sea surface temperature | None |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | Place search | None |
| [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) | Dive shops from OpenStreetMap | None |
| [Nominatim](https://nominatim.org/) | Naming the place at your current location | None |
| OpenStreetMap tiles | Map | None |

Optional overrides go in a `.env.local` file. Copy `.env.example` to get started:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_BASE_PATH` | `/` | Base path for the build. The deploy workflow sets it to `/<repo-name>/` |
| `VITE_OPEN_METEO_FORECAST_URL` | Open-Meteo public endpoint | Self-hosted or commercial Open-Meteo |
| `VITE_OPEN_METEO_MARINE_URL` | Open-Meteo public endpoint | As above |
| `VITE_OPEN_METEO_GEOCODING_URL` | Open-Meteo public endpoint | As above |
| `VITE_OVERPASS_URL` | `https://overpass-api.de/api/interpreter` | Alternative Overpass instance |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | unset | Reserved for future Supabase sync |

**Configuring paid or keyed APIs.** If you move to a commercial Open-Meteo plan (it needs an `apikey` parameter) or swap in Google Places for shops:

1. Add the key to `.env.local` locally, e.g. `VITE_OPEN_METEO_API_KEY=...`.
2. Read it in `src/services/config.ts` and append it in the relevant service.
3. For deployment, add it under **Settings → Secrets and variables → Actions** and pass it to the Build step in `.github/workflows/deploy.yml` with `env:`.

Anything prefixed `VITE_` is bundled into the public JavaScript. Use only keys that are designed to be public and restricted by HTTP referrer.

Open-Meteo's free tier is for non-commercial use. Check its terms, and the [Overpass](https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances) and [OSM tile](https://operations.osmfoundation.org/policies/tiles/) usage policies, before running heavy traffic.

## Data and privacy

- All user data (profile, progress, quiz history, checklist, plans, theme) lives in the browser's LocalStorage. Nothing is sent to a server.
- Location is requested only when the user taps **My location**, and the coordinates go only to the weather and map services.
- Dive-shop listings are shown exactly as OpenStreetMap has them. WhatsApp is offered only when a listing has an international-format number. Local numbers are never "fixed up" with a guessed country code.
- No fake weather or shop data ships in production. Mock data exists only in the tests.

### Supabase-ready architecture

Persistence goes through the `PersistenceAdapter` interface in `src/services/storage/adapter.ts`. `src/services/storage/supabaseAdapter.example.ts` shows the table, the row-level-security notes, and an adapter you can enable with `setPersistenceAdapter(...)` once authentication is added.

## Project structure

```
src/
  components/
    common/        ThemeProvider, ThemeToggle, PageHeader, LocationSearch, MapView, states…
    ui/            shadcn-style primitives (button, card, dialog, tabs, checkbox…)
    navigation/    Sidebar, mobile header, menu sheet, bottom tab bar, layout
    dashboard/ checklist/ quiz/ learning/ dive-planner/ weather/ dive-shops/ marine-life/
    illustrations/ original SVG diagrams, hand signals, marine art, animated scene
  pages/           Dashboard, Learning, OpenWater, LessonPage, AdvancedOpenWater, Specialties,
                   SpecialtyPage, Quiz, DiveReadiness, DivePlanner, Weather, DiveShops,
                   MarineLife, Profile, Settings, NotFound
  hooks/           useAsync, useWeather, useDiveShops, useCurrentLocation, useLearningProgress
  services/        weatherService, locationService, diveShopService, http, storage/
  store/           Zustand app store with persistence
  data/            lessons, modules, specialties, quiz bank, checklist, marine life, navigation
  utils/           divePlanner, planSummary, quizEngine, checklist, units, weather, geo, whatsapp
  types/           shared TypeScript interfaces
```

## Testing

```bash
npm test
```

The suite covers unit conversion, dive-planner validation, profile and gas logic, advisories, quiz scoring and shuffling, checklist progress (including that it never declares a diver safe), WhatsApp number handling, weather condition rating, weather API parsing and error handling (HTTP, 429, network, missing marine data), Overpass parsing (including that no contact details are invented), content integrity, theme switching and persistence, and navigation (sidebar, mobile bottom bar, mobile menu, active route, skip link).

## Deploying to GitHub Pages

The app uses **hash routing** (`/#/planner`), so deep links and page refreshes work on GitHub Pages without server rewrites or a `404.html` workaround.

1. Push the code to GitHub (see below).
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow at `.github/workflows/deploy.yml`:
   - installs dependencies with `npm ci`
   - runs the tests
   - builds with `VITE_BASE_PATH=/<repository-name>/`, so assets resolve correctly
   - uploads `dist/` and deploys it to Pages
4. The site is published at `https://<your-username>.github.io/<repository-name>/`.

You can also start a deployment by hand from the **Actions** tab (**Deploy to GitHub Pages → Run workflow**).

To build locally for a custom domain or the root of a user site, set `VITE_BASE_PATH=/` (or leave it unset).

### Setting up the repository

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/<your-username>/<repository-name>.git
```

```bash
git push -u origin main
```

## Accessibility and performance

- Semantic landmarks, a skip link, labelled form controls, keyboard-operable controls and an accessible location combobox
- Visible focus rings, colour tokens with sufficient contrast in both themes, and `aria-live` feedback for quizzes and checklists
- `prefers-reduced-motion` is respected everywhere: Framer Motion `MotionConfig reducedMotion="user"`, plus CSS fallbacks
- Pages are code-split, maps load lazily, API responses are cached in memory, and skeleton loaders, error and empty states are in place
- Educational content is bundled with the app, so it stays readable even when the live APIs are unreachable

## Content disclaimer

Lessons and quiz questions reflect widely taught recreational diving principles (as found in PADI, SSI, NAUI, BSAC and RSTC-aligned curricula). They are not official certification material, and agency procedures differ in detail: your instructor and training agency take precedence. Conservation statuses reflect the IUCN Red List when written; check [iucnredlist.org](https://www.iucnredlist.org) for current assessments.

## Licence and attribution

- Weather data: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0)
- Map data: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL)
- Illustrations: original artwork created for this project
