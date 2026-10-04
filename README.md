# The Last Known Record — Aryan Singh

A portfolio built for **Silicon Maze — The Last Portfolio**. The idea: the Doomsday event has started, and you're opening the archived system of one engineer: **Aryan Singh**, B.Tech in Information Technology at IIIT Bhubaneswar (2026–2030).

The site works as a professional portfolio first and a doomsday archive second. The theme shows up in the art direction, copy and interactions, not in neon or constant glitching.

> All personal details, projects, experience and links are **fictional**. Every URL points to `example.com`, and the phone number is not a valid number.

---

## The solution

### Concept
The site is presented as a recovered personnel record, combining a personal website, a surviving computer system and an engineering notebook. It uses a warm near-black palette, off-white text and a single amber accent. There are only two typefaces: Space Grotesk for editorial headings and JetBrains Mono for system labels. A very faint grid, grain and scanlines sit in the background.

### Sections
| # | Section | What it shows |
|---|---|---|
| — | **Boot sequence** | A ~3 s system boot, an "identity recovered" step, then *Enter archive*. It can be skipped with `Esc`, and the choice is saved in `localStorage`. |
| — | **Hero** | Record header, the *"Building things that survive the demo."* headline, intro, an *Archive online* status, calls to action and a live cursor-coordinate readout. |
| 01 | **Survivor profile** | Personal statement, metadata, a connected evidence strip (education → experience → open source → competition) and *Field notes*. |
| 02 | **Arsenal** | A "system loadout" of skill modules instead of percentage bars. Hovering or selecting a module shows *why I use it*, *where I used it* and an experience level. |
| 03 | **Archives** | Three fictional projects, each with an animated SVG figure. Opening a record shows a full dossier: overview, motivation, contribution, architecture, highlights, lessons, stack and links. |
| 04 | **Build log** | A dated stream of explorations, newest first. |
| 05 | **Final transmission** | Contact channels and the *Archive end* footer. |

### Signature interaction: Archive integrity
A meter in the navigation starts at 40% ("identity recovered"). Each section you reach restores a fragment, the meter climbs to 100%, and a short system message confirms each recovery. Section titles decode from noise the first time their fragment is recovered.

### Projects (fictional)
- **Meshnote:** offline-first notes that sync directly between nearby devices. The figure is an animated device mesh where an edit spreads hop by hop.
- **Queueless:** a multilingual chat bot for ordering from the campus canteen. The figure is the order flow, with a confirmation gate.
- **Murmur:** a tiny wake-word model for a microcontroller. The figure is a pruning illustration. It's intentionally shown as a *partial record*: missing sections render as `[ SEGMENT NOT RECOVERED ]`.

### Motion and accessibility
- Animations are used where they express system behaviour: boot, section reveal, graph propagation, dossier switch. The glitch effect appears only when switching records.
- `prefers-reduced-motion` turns off movement. The site is designed to read fully without animation.
- Semantic HTML, a skip link, visible focus states, and real `<button>`s for every control.
- The dossier is a modal dialog: focus stays inside it, `Esc` closes it, `←/→` switch records, and focus returns to where you were when it closes.
- Responsive layouts are composed separately for desktop, tablet and mobile (≈1440 → 390 px), with a compact mobile menu.

---

## Tech stack
React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Lucide (icons, used sparingly). All visuals are hand-written SVG/CSS, with no image assets or 3D libraries.

---

## Running locally

**Requirements:** Node.js 20.19+ (22 LTS recommended) and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:5173
```

### Production build
```bash
npm run build      # type-check (tsc -b) + build into dist/
npm run preview    # serve the production build locally
```

`dist/` is a static site that can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## Testing / verification

There's no unit-test suite. The project is a presentational site, so verification is a type-check, a build, and a manual pass:

```bash
npm run typecheck  # TypeScript, strict mode, no unused locals/params
npm run build      # must complete without errors
```

## Project structure

```
src/
  components/
    BootSequence.tsx      Navigation.tsx       Hero.tsx
    SurvivorProfile.tsx   Arsenal.tsx          ProjectArchive.tsx
    ProjectDossier.tsx    ProjectFigure.tsx    BuildLog.tsx
    FinalTransmission.tsx SectionHeader.tsx    Environment.tsx
    RecoveryToast.tsx     ArchiveLabel.tsx     ArchiveLink.tsx
    SystemStatus.tsx      Reveal.tsx
    visuals/              MeshSync · OrderPipeline · KeywordPruning (SVG figures)
  hooks/                  useRecovery · useScramble · useInView
  data/                   profile · skills · projects · buildlog
  App.tsx  main.tsx  index.css
```

> Note: `vite.config.ts` sets `css.postcss: {}` on purpose, so Vite won't pick up unrelated `postcss.config` files from parent directories. Tailwind runs through its own Vite plugin.
