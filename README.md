# ScubaDive: Smart Diving Companion & Learning Platform

A responsive, mobile-first scuba diving web app built with React and TypeScript. It covers learning (Open Water, Advanced Open Water, 17 specialties), self-testing (an image-based quiz engine), pre-dive readiness checks, an educational dive planner, live weather and marine conditions, nearby dive shops with WhatsApp contact, and a marine-life library.

> **Safety first.** ScubaDive is an educational companion. It does not replace training by a qualified instructor, a dive computer, or the procedures of a recognised training agency. The planner never calculates decompression schedules or no-decompression limits, and nothing in the app clears anyone to dive.

## Design

ScubaDive is designed as a premium consumer app following the Apple Human Interface Guidelines. It takes cues from Apple Health, Wallet and Weather.

- **Navigation:** five tabs (**Home · Learn · Dive · Explore · Profile**) in a bottom tab bar on phones, and an iPad-style sidebar on desktop. Secondary screens use a translucent nav bar with a back button, and the large title collapses into the bar as you scroll.
- **Visual language:** system blue, grouped light-gray backgrounds with white surfaces (true black in dark mode), and charcoal and muted-gray text. Status colours are soft green, warm amber and muted red, all tuned for WCAG AA contrast. Type uses SF Pro via the system font stack (Inter elsewhere) on an iOS Dynamic Type scale.
- **Components:** inset grouped lists with Settings-style icon tiles, segmented controls, iOS switches, round checkmarks, bottom sheets with grabbers, action-sheet confirmations, banner toasts with Undo, skeletons and pull-to-refresh.
- **First run:** a welcome screen, an "About you" step and a location permission pre-prompt that explains why before the browser asks. Every empty state explains what to do next and offers one clear action, and dismissible tips give contextual guidance.
- **Mobile first:** primary actions stay within thumb reach (sticky action bars sit above the tab bar), touch targets are at least 44 px, safe areas are respected, and nothing scrolls sideways except intentional chip rows and the hourly forecast. This is checked automatically at 320–412 px.
- **Motion:** quick, subtle and purposeful: press states, page fades, sliding segmented thumbs, spring toasts and sheets. Everything respects `prefers-reduced-motion`.

## Features

| Tab | What's there |
| --- | --- |
| **Home** | Greeting with avatar and a notifications bell, a Wallet-style "next dive" card, quick actions, Health-style summary tiles (readiness, conditions, learning, quizzes), continue learning, nearby dive shops, recent activity |
| **Learn** | 15 Open Water lessons, 10 Advanced Open Water modules, 17 specialty previews (objectives, diagrams, knowledge checks, completion tracking), and a 73-question quiz with image and scenario questions, timed mode, instant feedback, review and history |
| **Dive** | Dive Planner (iOS form; Plan/Summary views; profile chart, gas estimate, nitrox MOD, forecast for the dive day, advisories; save, edit, share, print, export, delete with undo), Readiness Check (37 checks with round checkmarks; never declares a diver "safe"), Weather & Conditions (Apple-Weather-style live forecast and marine data with favourable/caution/unfavourable explanations) |
| **Explore** | Offline search across lessons, specialties and marine life, dive shops from OpenStreetMap (list/map, detail sheet with Directions, Call, WhatsApp, Website), and a 26-entry marine-life library with an ID quiz |
| **Profile** | Avatar and stats, an edit-profile sheet, Favourites, History (quizzes, lessons, plans), Settings (appearance, units, welcome tour, tips, backup/restore, erase data) |

**In-app notifications** are derived from your own data: upcoming dives, outstanding critical checks, rough forecasts and learning reminders. They are never fabricated.

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
    common/        ScreenHeader (large title + nav bar), List (inset grouped lists), Avatar,
                   Toaster, ConfirmHost, PullToRefresh, TipCard, SearchField, StickyActions,
                   favourite/share buttons, ThemeProvider, LocationSearch, MapView, states…
    ui/            shadcn-style primitives restyled as iOS controls (button, segmented, switch…)
    navigation/    TabBar, Sidebar, AppLayout
    onboarding/ notifications/ checklist/ quiz/ learning/ dive-planner/ weather/ dive-shops/
    illustrations/ original SVG diagrams, hand signals, marine art, animated scene
  pages/           Dashboard (Home), Learning, OpenWater, LessonPage, AdvancedOpenWater,
                   Specialties, SpecialtyPage, Quiz, Dive, DiveReadiness, DivePlanner, Weather,
                   Explore, DiveShops, MarineLife, Profile, Favorites, History, Settings, NotFound
  hooks/           useAsync, useWeather, useDiveShops, useCurrentLocation, useLearningProgress,
                   useNotifications
  lib/             toast, confirm, share, cn
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

The suite covers unit conversion, dive-planner validation, profile and gas logic, advisories, quiz scoring and shuffling, checklist progress (including that it never declares a diver safe), WhatsApp number handling, weather condition rating, weather API parsing and error handling (HTTP, 429, network, missing marine data), Overpass parsing (including that no contact details are invented), content integrity, theme switching and persistence, navigation (five-tab bar, tab mapping for secondary screens, nested sidebar, active states, skip link), the onboarding flow, content search, favourites, plan editing and deletion, store migration, and class merging for the custom type scale.

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

- Semantic landmarks, a skip link, labelled form controls, keyboard-operable controls, an accessible location combobox, and radio semantics on segmented controls
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
