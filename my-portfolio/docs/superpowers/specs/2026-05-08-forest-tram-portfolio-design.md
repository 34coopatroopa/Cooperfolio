# Forest-Tram Portfolio — Design Spec
**Date:** 2026-05-08  
**Source:** `.superpowers/brainstorm/99-1778172160/content/forest-tram-v4.html`  
**Status:** Approved for implementation

---

## Overview

Replace the current Three.js alpine mountain scene with a flat CSS/React implementation based on the forest-tram-v4.html prototype. Two-screen app: a landing hero that transitions into a two-column main layout with a topo map navigator on the left and sliding content panels on the right.

---

## Screens

### 1. Landing

- Full-bleed hero photo: `Me_Personally.jpeg`
- SVG pine tree silhouette row along the bottom of the hero
- Gradient overlay: dark green at bottom fading to transparent at top
- Name: `Cooper` (roman) `Hoy` (italic, green accent)
- Monospace tag: `Cyber Security Engineering · Ames, Iowa`
- Centered animated "Enter the ascent" button: pulsing ring with two ripple rings + down-chevron icon
- Footer strip (cream): left "An illustrated curriculum vitæ" / right "Plate I · 2025" in monospace
- On click: landing slides up (`translateY(-100%)`) revealing main layout below

### 2. Main Layout

Two columns, full viewport height.

#### Left — Map Column (320px, fixed width)

- Header: "← Back" button (returns to landing) | "Ascent Map" title + "Summit → Valley · 7 stations" sub
- Topo SVG (`viewBox="0 0 320 580"`):
  - Grid lines (subtle)
  - Concentric ellipse contour rings (summit at top ~y=82)
  - Winding tram path from VI (y≈82) down to Hobby (y≈530)
  - Tower tick marks at path waypoints
  - Tree symbols left and right of path
  - Elevation labels (right side): 6,643′ → 800′
  - 7 clickable station nodes (roman numerals I–VI + 🌿) along the path
  - Spinning dashed active ring around current node
  - Animated SVG tram car that glides (lerp, rAF) between nodes on navigate
  - Compass rose (bottom-left) and scale bar (bottom-right)
  - Corner bracket decorations
- Footer: contact links (mail, tel, in, gh) in mono key/value rows

#### Right — Content Column (flex: 1)

- Slide window: 7 absolutely-positioned slides, only one `active` at a time
- Slide transitions: `opacity` + `translateY` (enter from below, exit upward)
- Large italic watermark numeral (top-right, 130px, very faint)
- Each slide contains:
  - Badge row: station name (mono, green) + elevation (mono, faint) right-aligned
  - Title: serif 28–38px, italic `<em>` in dark green
  - Sub: mono uppercase small
  - Animated SVG illustration (150px fig-box, unique per station)
  - Italic lede quote (serif, border-left green)
  - 4-cell highlights grid
  - Section header with line divider
  - Moments list (chevron bullets) OR project cards OR skill groups
  - Tag pills at bottom
- Bottom nav bar: "Higher ↑" / "Lower ↓" arrow buttons + dot indicators + current station name

---

## Slides (VI → I → Hobby, top of map → bottom)

| # | Map node | Station | Content type |
|---|---|---|---|
| 0 | VI | FIRST Tech Challenge (Summit, 6,643ft) | Moments + highlights |
| 1 | V | The Kit / Skills (Cache, 5,540ft) | Skill groups |
| 2 | IV | Side Projects (Atelier, 4,910ft) | Project cards |
| 3 | III | Cambridge Investments (Highland, 3,840ft) | Moments + highlights |
| 4 | II | ISU IT Solution Center (Crossing, 2,280ft) | Moments + highlights |
| 5 | I | Iowa State University (Trailhead, 1,460ft) | Moments + highlights |
| 6 | 🌿 | Off the Trail (Valley, 800ft) | 3-photo grid + hobby cards |

---

## Animated SVG Illustrations (per slide)

Each slide has a 150px-tall `fig-box` with a unique inline SVG using CSS keyframe animations:
- `float`: gentle bob up/down
- `pulse` / `glow`: opacity flicker
- `blink`: step-end cursor/LED blink
- `wave`: rotating arm
- `dash`: stroke-dashoffset scroll (network lines)
- `spin`: rotation
- `ripple`: scale + fade rings

Illustrations:
- VI: stick-figure mentor + arrow + robot with blinking eyes
- V: terminal window with typed commands + blinking cursor
- IV: three floating project cards
- III: server rack + network switch + AD/Exchange/GPO nodes with dashed animated lines
- II: headset + pulse rings + ticket queue
- I: campus building + tower + floating mortarboard + diploma
- 🌿: 3-photo grid (meHiking.jpg, Travel 1_Mexico.jpeg, Hobby 1.jpeg)

---

## Photos

Source: `Photos/` at repo root. Copy all photos to `my-portfolio/public/photos/`.

Photos used:
- Landing hero: `Me_Personally.jpeg`
- Hobby slide grid: `meHiking.jpg`, `Travel 1_Mexico.jpeg`, `Hobby 1.jpeg`

---

## Typography & Colors

**Fonts** (Google Fonts, same as current):
- `Cormorant Garamond` 300/400/600 + italic — serif display
- `Inter` 300/400/500 — body sans
- `JetBrains Mono` 300/400 — mono labels/tags

**Color tokens:**
```
--cream: #f3ede0   --paper: #ebe4ce
--f1: #162a12      --f2: #224618   --f3: #356828
--f4: #4e8a3c      --f5: #72ac58   --f6: #a0cc84   --f7: #cce4b4
--fog: #c0d8a4     --mist: #dceacc
--ink: #182814     --ink-mid: #445c38
--ink-dim: #708060 --ink-faint: #9eae90
```

---

## Mobile

- Map column hidden by default on ≤768px
- Floating map button (bottom-right, 44px circle, green) toggles map overlay
- Hero padding reduces, slide padding reduces
- Highlights grid: 4-col → 2-col
- Photo grid: maintains 3-col at 120px height
- Hobby cards: 3-col → 1-col

---

## React Architecture

```
App.jsx                  — state: screen (landing|main), curSlide
  LandingScreen.jsx      — hero photo, tree SVG, enter button, footer
  MainLayout.jsx         — two-column wrapper
    MapColumn.jsx        — topo SVG, tram car animation (rAF lerp), node click
    ContentColumn.jsx    — slide window + bottom nav
      Slide.jsx          — per-station slide (receives station data)
        FigBox.jsx       — animated SVG illustration (per station)
```

All station content stays in `data/stations.js` (7 entries).  
No Three.js dependency. Remove `@react-three/fiber`, `@react-three/drei`.  
Keep `@vercel/analytics`.

---

## Files to Change

| File | Action |
|---|---|
| `src/App.jsx` | Replace entirely |
| `src/index.css` | Replace with forest-tram tokens + layout |
| `src/data/stations.js` | Update to 7 entries (add Hobby slide) |
| `src/App.css` | Delete (unused) |
| `src/utils/terrain.js` | Delete (unused) |
| `src/components/` | Delete all (unused) |
| `public/photos/` | Create, copy from `Photos/` at root |
| `package.json` | Remove three.js, @react-three/* deps |

---

## Out of Scope

- No tour/auto-play mode (simpler navigation only)
- No day/night toggle
- No 3D scene
- No keyboard navigation (can add later)
