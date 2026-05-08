# Forest-Tram Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Three.js alpine mountain scene with the forest-tram design: a CSS/React two-screen portfolio with a landing hero and a two-column topo-map navigator + sliding content panels.

**Architecture:** Pure CSS + React, no 3D. Landing screen slides up on enter, revealing a fixed-width left column (topo SVG map with animated tram car) and a flex-fill right column (7 slides, slide transitions). All content is data-driven from `stations.js`; per-station SVG illustrations live in a single `illustrations.jsx` file.

**Tech Stack:** React 19, Vite, plain CSS (no Tailwind), Google Fonts, `@vercel/analytics`. Remove `three`, `@react-three/fiber`, `@react-three/drei`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `public/photos/` | Create + copy | Static photo assets for hero + hobby slide |
| `src/data/stations.js` | Rewrite | 7 station entries (VI→I→Hobby) |
| `src/index.css` | Rewrite | All CSS: tokens, layout, components, animations, mobile |
| `src/illustrations.jsx` | Create | 7 animated SVG fig-box components, exported as array |
| `src/components/LandingScreen.jsx` | Create | Hero photo, tree SVG, enter button, footer strip |
| `src/components/MapColumn.jsx` | Create | Topo SVG, tram car rAF lerp, node click, contact footer |
| `src/components/Slide.jsx` | Create | Generic slide renderer from station data + illustration |
| `src/components/ContentColumn.jsx` | Create | Slide window (active/leaving CSS states) + bottom nav bar |
| `src/components/MainLayout.jsx` | Create | Two-column wrapper, passes curSlide + navigate to children |
| `src/App.jsx` | Rewrite | Screen state (landing\|main), curSlide, enter/back handlers |
| `src/App.css` | Delete | Unused |
| `src/utils/terrain.js` | Delete | Unused |
| `src/components/Monitor.jsx` | Delete | Unused |
| `src/components/MonitorWithTexture.jsx` | Delete | Unused |
| `src/components/ServerCase.jsx` | Delete | Unused |
| `src/components/ServerRack.jsx` | Delete | Unused |
| `package.json` | Modify | Remove three, @react-three/fiber, @react-three/drei |

---

## Task 1: Copy photos and clean up unused files

**Files:**
- Create: `public/photos/` (copy from `Photos/` at repo root)
- Delete: `src/App.css`, `src/utils/terrain.js`, `src/components/Monitor.jsx`, `src/components/MonitorWithTexture.jsx`, `src/components/ServerCase.jsx`, `src/components/ServerRack.jsx`

- [ ] **Step 1: Copy photos into public**

From the repo root (`D:\Cooperfolio`), run:
```bash
mkdir -p my-portfolio/public/photos
cp "Photos/Me_Personally.jpeg" my-portfolio/public/photos/
cp "Photos/meHiking.jpg" my-portfolio/public/photos/
cp "Photos/Travel 1_Mexico.jpeg" my-portfolio/public/photos/
cp "Photos/Hobby 1.jpeg" my-portfolio/public/photos/
```

- [ ] **Step 2: Delete unused source files**

```bash
rm my-portfolio/src/App.css
rm my-portfolio/src/utils/terrain.js
rm my-portfolio/src/components/Monitor.jsx
rm my-portfolio/src/components/MonitorWithTexture.jsx
rm my-portfolio/src/components/ServerCase.jsx
rm my-portfolio/src/components/ServerRack.jsx
```

- [ ] **Step 3: Remove Three.js deps from package.json**

Edit `my-portfolio/package.json`. Remove from `"dependencies"`:
- `"@react-three/drei": "^10.6.1"`
- `"@react-three/fiber": "^9.3.0"`
- `"three": "^0.178.0"`

Final `"dependencies"` block:
```json
"dependencies": {
  "@vercel/analytics": "^1.5.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0"
}
```

- [ ] **Step 4: Reinstall deps**

```bash
cd my-portfolio && npm install
```

Expected: clean install, no three.js in node_modules.

- [ ] **Step 5: Commit**

```bash
git add my-portfolio/public/photos/ my-portfolio/package.json my-portfolio/package-lock.json
git rm my-portfolio/src/App.css my-portfolio/src/utils/terrain.js my-portfolio/src/components/Monitor.jsx my-portfolio/src/components/MonitorWithTexture.jsx my-portfolio/src/components/ServerCase.jsx my-portfolio/src/components/ServerRack.jsx
git commit -m "chore: add photos, remove three.js files and deps"
```

---

## Task 2: Rewrite index.css

**Files:**
- Modify: `src/index.css` (full rewrite)

- [ ] **Step 1: Replace index.css entirely**

Write the following to `my-portfolio/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root {
  --cream: #f3ede0; --paper: #ebe4ce;
  --f1: #162a12; --f2: #224618; --f3: #356828;
  --f4: #4e8a3c; --f5: #72ac58; --f6: #a0cc84; --f7: #cce4b4;
  --fog: #c0d8a4; --mist: #dceacc;
  --ink: #182814; --ink-mid: #445c38;
  --ink-dim: #708060; --ink-faint: #9eae90;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Inter', system-ui, sans-serif;
  --mono: 'JetBrains Mono', monospace;
}

html, body { height: 100%; font-family: var(--sans); background: var(--cream); color: var(--ink); overflow: hidden; }
#root { height: 100%; }

/* ── Screens wrapper ── */
.screens { width: 100%; height: 100%; position: relative; overflow: hidden; }

/* ── LANDING ── */
.landing {
  position: absolute; inset: 0; display: flex; flex-direction: column; z-index: 2;
  transition: transform .95s cubic-bezier(.77,0,.18,1), opacity .6s;
}
.landing.out { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.hero { flex: 1; position: relative; overflow: hidden; background: #1a3214; }
.hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; z-index: 1; }
.hero-overlay {
  position: absolute; inset: 0; z-index: 2;
  background:
    radial-gradient(ellipse at 18% 25%, rgba(160,204,132,.12) 0%, transparent 55%),
    linear-gradient(to top, rgba(22,42,18,.9) 0%, rgba(22,42,18,.25) 50%, transparent 80%);
}
.hero-trees { position: absolute; bottom: 0; left: 0; right: 0; height: 44%; z-index: 3; pointer-events: none; }
.hero-name { position: absolute; bottom: 0; left: 0; right: 0; z-index: 5; padding: 0 48px 48px; }
.hero-name h1 { font-family: var(--serif); font-size: clamp(40px,6vw,68px); font-weight: 300; line-height: 1; color: #f3ede0; text-shadow: 0 2px 28px rgba(0,0,0,.4); }
.hero-name h1 em { font-style: italic; color: #c0dea0; }
.hero-name .tag { font-family: var(--mono); font-size: clamp(9px,1.2vw,10px); letter-spacing: .38em; color: #9ec87e; text-transform: uppercase; margin-top: 9px; }
.enter-zone { position: absolute; inset: 0; z-index: 6; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.enter-btn { pointer-events: auto; background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 12px; animation: breathe 3.2s ease-in-out infinite; }
.ring {
  width: 72px; height: 72px; border-radius: 50%;
  border: 1.5px solid rgba(192,222,160,.5); background: rgba(22,42,18,.35);
  backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
  position: relative; transition: border-color .3s, background .3s;
}
.ring::before { content: ''; position: absolute; inset: -10px; border-radius: 50%; border: 1px solid rgba(192,222,160,.2); animation: ripple 3s ease-out infinite; }
.ring::after  { content: ''; position: absolute; inset: -22px; border-radius: 50%; border: 1px solid rgba(192,222,160,.1); animation: ripple 3s ease-out .6s infinite; }
.enter-btn:hover .ring { border-color: rgba(192,222,160,.95); background: rgba(22,42,18,.55); }
.enter-label { font-family: var(--mono); font-size: 9.5px; letter-spacing: .34em; color: rgba(192,222,160,.75); text-transform: uppercase; transition: color .3s; }
.enter-btn:hover .enter-label { color: rgba(192,222,160,1); }
.land-foot { background: var(--cream); border-top: 1px solid var(--fog); padding: 13px 48px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.foot-meta { font-family: var(--mono); font-size: 9px; letter-spacing: .22em; color: var(--ink-dim); text-transform: uppercase; }

/* ── MAIN ── */
.main { position: absolute; inset: 0; display: flex; transform: translateY(100%); transition: transform .95s cubic-bezier(.77,0,.18,1); z-index: 1; background: var(--cream); }
.main.in { transform: translateY(0); z-index: 3; }

/* ── MAP COLUMN ── */
.map-col { width: 320px; flex-shrink: 0; background: var(--paper); border-right: 1.5px solid var(--fog); display: flex; flex-direction: column; overflow: hidden; }
.map-head { padding: 18px 20px 13px; border-bottom: 1px solid var(--fog); flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; }
.back-btn { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 8px; letter-spacing: .22em; color: var(--ink-dim); text-transform: uppercase; display: flex; align-items: center; gap: 5px; transition: color .2s; padding: 0; }
.back-btn:hover { color: var(--f2); }
.map-title-wrap { text-align: right; }
.map-title { font-family: var(--serif); font-size: 15px; font-weight: 400; color: var(--ink); }
.map-sub { font-family: var(--mono); font-size: 7.5px; letter-spacing: .2em; color: var(--ink-dim); text-transform: uppercase; margin-top: 2px; }
.topo-wrap { flex: 1; position: relative; overflow: hidden; }
#topoSvg { width: 100%; height: 100%; }
.map-foot { border-top: 1px solid var(--fog); padding: 12px 20px; display: flex; flex-direction: column; gap: 5px; flex-shrink: 0; }
.clink { display: flex; gap: 10px; align-items: baseline; text-decoration: none; color: inherit; transition: color .2s; }
.clink:hover { color: var(--f2); }
.ck { font-family: var(--mono); font-size: 7.5px; letter-spacing: .2em; color: var(--ink-dim); text-transform: uppercase; width: 26px; flex-shrink: 0; }
.cv { font-size: 11px; color: var(--ink-mid); }

/* ── CONTENT COLUMN ── */
.content-col { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.slide-win { flex: 1; position: relative; overflow: hidden; }
.slide { position: absolute; inset: 0; overflow-y: auto; padding: 36px 48px 24px; opacity: 0; pointer-events: none; transform: translateY(28px); transition: opacity .48s cubic-bezier(.4,0,.2,1), transform .48s cubic-bezier(.4,0,.2,1); }
.slide.active { opacity: 1; pointer-events: auto; transform: translateY(0); }
.slide.leaving { opacity: 0; transform: translateY(-28px); transition: opacity .3s cubic-bezier(.4,0,.2,1), transform .3s cubic-bezier(.4,0,.2,1); }

/* watermark */
.wm { position: absolute; right: 32px; top: 24px; font-family: var(--serif); font-size: 130px; font-weight: 600; font-style: italic; color: rgba(53,104,40,.045); line-height: 1; pointer-events: none; user-select: none; }

/* slide header */
.sl-badge { display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px; }
.sl-num { font-family: var(--mono); font-size: 9.5px; letter-spacing: .3em; color: var(--f3); text-transform: uppercase; }
.sl-elev { font-family: var(--mono); font-size: 8.5px; letter-spacing: .2em; color: var(--ink-faint); margin-left: auto; }
.sl-title { font-family: var(--serif); font-size: clamp(28px,3.5vw,38px); font-weight: 300; color: var(--ink); line-height: 1.12; margin-bottom: 3px; }
.sl-title em { font-style: italic; color: var(--f2); }
.sl-sub { font-family: var(--mono); font-size: 8.5px; letter-spacing: .16em; color: var(--ink-dim); text-transform: uppercase; }

/* fig-box */
.fig-box { width: 100%; height: 150px; border: 1px solid var(--fog); background: linear-gradient(135deg, var(--mist) 0%, var(--paper) 100%); display: flex; align-items: center; justify-content: center; margin: 16px 0; overflow: hidden; position: relative; }
.fig-box svg { max-width: 100%; max-height: 100%; }

/* photo grid */
.photo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin: 16px 0; height: 160px; }
.photo-grid img { width: 100%; height: 100%; object-fit: cover; display: block; }
.photo-label { position: relative; }
.photo-label::after { content: attr(data-label); position: absolute; bottom: 0; left: 0; right: 0; background: rgba(22,42,18,.6); color: #d8eccc; font-family: var(--mono); font-size: 7.5px; letter-spacing: .16em; text-transform: uppercase; padding: 4px 7px; text-align: center; }

/* lede */
.sl-lede { font-family: var(--serif); font-size: clamp(15px,1.8vw,17.5px); font-weight: 300; font-style: italic; color: var(--ink-mid); line-height: 1.8; margin-bottom: 20px; border-left: 2px solid var(--f5); padding-left: 16px; }

/* highlights grid */
.sl-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--fog); margin-bottom: 20px; }
.sl-hl { background: var(--cream); padding: 10px 11px; }
.hl-k { font-family: var(--mono); font-size: 7.5px; letter-spacing: .2em; color: var(--ink-dim); text-transform: uppercase; margin-bottom: 3px; }
.hl-v { font-family: var(--serif); font-size: 16px; color: var(--ink); }
.hl-v em { font-style: italic; color: var(--f2); }

/* section head */
.sh { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
.sh-line { flex: 1; height: 1px; background: var(--fog); }
.sh-text { font-family: var(--mono); font-size: 8px; letter-spacing: .28em; color: var(--ink-dim); text-transform: uppercase; white-space: nowrap; }
.sh-icon { flex-shrink: 0; opacity: .5; }

/* moments */
.sl-moments { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.sl-moments li { font-size: clamp(12px,1.4vw,13px); color: var(--ink-mid); line-height: 1.72; padding-left: 18px; position: relative; }
.sl-moments li::before { content: ''; position: absolute; left: 0; top: 8px; width: 7px; height: 7px; border-top: 1.5px solid var(--f4); border-right: 1.5px solid var(--f4); transform: rotate(45deg) scale(.6); }

/* projects */
.sl-projects { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.sl-proj { background: var(--paper); border: 1px solid var(--fog); padding: 13px 15px; }
.proj-hd { display: flex; align-items: baseline; gap: 9px; margin-bottom: 5px; }
.proj-t { font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--ink); }
.proj-st { font-family: var(--mono); font-size: 8px; letter-spacing: .14em; color: var(--ink-dim); text-transform: uppercase; }
.proj-d { font-size: 12px; color: var(--ink-mid); line-height: 1.65; margin-bottom: 8px; }
.proj-stack { display: flex; flex-wrap: wrap; gap: 3px; }
.ptag { font-family: var(--mono); font-size: 7.5px; letter-spacing: .12em; padding: 2px 6px; border: 1px solid var(--fog); color: var(--ink-dim); text-transform: uppercase; }

/* skills */
.sl-skills { display: flex; flex-direction: column; gap: 11px; margin-bottom: 20px; }
.sg-h { font-family: var(--mono); font-size: 7.5px; letter-spacing: .2em; color: var(--f3); text-transform: uppercase; margin-bottom: 5px; }
.sg-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.sg-tag { font-size: 11px; color: var(--ink-mid); padding: 3px 9px; background: var(--paper); border: 1px solid var(--fog); }

/* tags */
.sl-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.sl-tag { font-family: var(--mono); font-size: 8px; letter-spacing: .12em; padding: 2px 8px; border: 1px solid var(--f7); color: var(--ink-dim); text-transform: uppercase; background: rgba(78,138,60,.06); }

/* hobby cards */
.hobby-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.hc { background: var(--paper); border: 1px solid var(--fog); padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
.hc-icon { font-size: 22px; margin-bottom: 2px; }
.hc-t { font-family: var(--serif); font-size: 15px; color: var(--ink); }
.hc-d { font-size: 11px; color: var(--ink-mid); line-height: 1.6; }

/* bottom nav */
.content-nav { border-top: 1.5px solid var(--fog); padding: 12px 48px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.nav-arr { background: none; border: none; cursor: pointer; font-family: var(--mono); font-size: 9px; letter-spacing: .22em; color: var(--ink-dim); text-transform: uppercase; display: flex; align-items: center; gap: 7px; transition: color .2s; padding: 0; }
.nav-arr:hover { color: var(--f2); }
.nav-arr:disabled { opacity: .18; cursor: default; }
.nav-center { display: flex; flex-direction: column; align-items: center; gap: 7px; }
.nav-dots { display: flex; gap: 6px; }
.ndot { width: 5px; height: 5px; border-radius: 50%; background: var(--fog); cursor: pointer; border: none; padding: 0; transition: background .25s, transform .25s; }
.ndot.on { background: var(--f2); transform: scale(1.55); }
.nav-sname { font-family: var(--mono); font-size: 8px; letter-spacing: .16em; color: var(--ink-dim); text-transform: uppercase; }

/* mobile */
.mobile-map-btn { display: none; }
@media (max-width: 768px) {
  .map-col { display: none; position: fixed; inset: 0; z-index: 10; width: 100%; border-right: none; }
  .map-col.mob-open { display: flex; }
  .mobile-map-btn { display: block; position: fixed; bottom: 74px; right: 16px; z-index: 8; background: var(--f2); color: var(--cream); border: none; cursor: pointer; width: 44px; height: 44px; border-radius: 50%; font-size: 18px; box-shadow: 0 3px 12px rgba(22,42,18,.3); transition: background .2s; }
  .mobile-map-btn:hover { background: var(--f3); }
  .hero-name { padding: 0 24px 32px; }
  .hero-name h1 { font-size: 40px; }
  .land-foot { padding: 12px 24px; }
  .slide { padding: 24px 24px 16px; }
  .wm { font-size: 90px; right: 16px; top: 16px; }
  .content-nav { padding: 11px 24px; }
  .sl-grid { grid-template-columns: repeat(2,1fr); }
  .photo-grid { height: 120px; }
  .hobby-cards { grid-template-columns: 1fr; }
}

/* animations */
@keyframes breathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes ripple  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.35);opacity:0} }
@keyframes pulse   { 0%,100%{opacity:.7} 50%{opacity:1} }
@keyframes blink   { 50%{opacity:0} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes dash    { to{stroke-dashoffset:-20} }
@keyframes glow    { 0%,100%{opacity:.4} 50%{opacity:.9} }
@keyframes wave    { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
```

- [ ] **Step 2: Start dev server and verify no CSS errors**

```bash
cd my-portfolio && npm run dev
```

Expected: Vite starts on `http://localhost:5173` with no CSS parse errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio/src/index.css
git commit -m "style: replace index.css with forest-tram design tokens and layout"
```

---

## Task 3: Rewrite stations.js (7 entries)

**Files:**
- Modify: `src/data/stations.js` (full rewrite)

- [ ] **Step 1: Replace stations.js**

Write the following to `my-portfolio/src/data/stations.js`:

```js
export const STATIONS = [
  {
    idx: 0,
    node: 'VI', name: 'FIRST Tech Challenge', elev: '6,643 ft',
    stationLabel: 'Station VI · The Summit',
    title: 'FIRST', titleEm: 'Tech Challenge',
    sub: 'Mentor · Grundy Center, IA · 2023 — Present',
    lede: '"The summit is paying it forward — thirty-plus students, three robotics teams, and a season that ends in February with something that actually works."',
    highlights: [
      { k: 'Students', v: null, vEm: '30+' },
      { k: 'Teams',    v: '3 squads', vEm: null },
      { k: 'Focus',    v: 'Mech · ', vEm: 'Java' },
      { k: 'Seasons',  v: null, vEm: '3' , vSuffix: ' years' },
    ],
    sectionHead: 'Notable moments',
    moments: [
      'Mentoring FTC Teams 13186, 14375, and 10069 across mechanical design, Java robot programming, and match strategy.',
      'Coaching students from rough prototype to competition-ready robot — debugging, documentation, engineering communication included.',
      'Helping students learn to think like engineers: identify root causes, communicate clearly, iterate fast under pressure.',
    ],
    tags: ['30+ students','Java robotics','Mechanical design','Match strategy'],
  },
  {
    idx: 1,
    node: 'V', name: 'The Kit', elev: '5,540 ft',
    stationLabel: 'Station V · The Cache',
    title: 'The', titleEm: 'kit',
    sub: 'Tools used in earnest — not just listed',
    lede: '"A working inventory of languages, platforms, and tools that have actually shipped something, hardened something, or fixed something in the real world."',
    skillGroups: [
      { h: 'Programming & Development', tags: ['Python','Java','Spring Boot','PowerShell','Git','LangChain','OpenCV'] },
      { h: 'Systems & Infrastructure',  tags: ['Windows Server 2025','Linux','VMware','Hyper-V','Active Directory','Group Policy','Exchange'] },
      { h: 'Security & Networking',     tags: ['Cryptography','Server Hardening','Network Config','Auth Systems','Pen Testing'] },
      { h: 'Embedded & Hardware',       tags: ['Raspberry Pi','RISC-V','Assembly','Environmental Sensors'] },
    ],
  },
  {
    idx: 2,
    node: 'IV', name: 'Side Projects', elev: '4,910 ft',
    stationLabel: 'Station IV · The Atelier',
    title: 'Three', titleEm: 'side builds',
    sub: 'Personal projects · 2025',
    lede: '"A workshop hewn into the rock — where the small, weird, useful things get built around real problems."',
    projects: [
      {
        t: 'Nerd Market', st: 'Full-stack · 2025',
        d: 'A stock-ticker-style price tracker for Pokémon, Magic: The Gathering, and other TCG markets. Spring Boot backend, MariaDB, OpenCV card recognition, and TCGPlayer/Scryfall APIs.',
        stack: ['Java','Spring Boot','MariaDB','OpenCV','TCGPlayer API'],
      },
      {
        t: 'Outpost', st: 'Hardware · 2025',
        d: 'A portable offline survival computer on a Raspberry Pi 5 — Wikipedia, survival manuals, maps, environmental sensors, and a local Ollama Phi-3 model. Zero internet dependency.',
        stack: ['Raspberry Pi 5','Ollama','Phi-3','Linux','Sensors'],
      },
      {
        t: 'HelpLlama', st: 'ML · 2025',
        d: 'A Python helpdesk chatbot that parses DOCX, PDF, and TXT docs and ticket history to answer IT questions in context. Built around a real pain point: useful info exists — nobody can find it.',
        stack: ['Python','LangChain','RAG','Local LLM'],
      },
    ],
  },
  {
    idx: 3,
    node: 'III', name: 'Cambridge Investments', elev: '3,840 ft',
    stationLabel: 'Station III · The Highland',
    title: 'Cambridge', titleEm: 'Investments',
    sub: 'IT Infrastructure Engineer · HCI Team · 2024 — 2025',
    lede: '"A year above the treeline. Enterprise infrastructure that quietly keeps everything alive — until something breaks and everyone suddenly remembers it exists."',
    highlights: [
      { k: 'Stint',    v: null, vEm: '2024–25' },
      { k: 'Stack',    v: 'Win ', vEm: '2025' },
      { k: 'Exchange', v: null, vEm: '99.9%', vSuffix: ' up' },
      { k: 'Location', v: 'Fairfield, ', vEm: 'IA' },
    ],
    sectionHead: 'Notable moments',
    moments: [
      'Configured and deployed Windows Server 2025 inside VMware to support Active Directory and file-sharing services.',
      'Built an isolated AD sandbox for safely testing new products before touching production.',
      'Developed Group Policy hardening baselines that set a new endpoint security standard across the environment.',
      'Managed Exchange, monitored infrastructure health, and assisted with outage response and root cause analysis.',
    ],
    tags: ['Win Server 2025','VMware','Active Directory','Group Policy','Exchange'],
  },
  {
    idx: 4,
    node: 'II', name: 'ISU IT Solution Center', elev: '2,280 ft',
    stationLabel: 'Station II · The Crossing',
    title: 'ISU', titleEm: 'IT Solution Center',
    sub: 'Team Lead · Senior Technical Support · 2023 — Present',
    lede: '"Frontline IT for a campus of tens of thousands. The first crossing — where a student learns to lead a team and own a process."',
    highlights: [
      { k: 'Role',     v: null, vEm: 'Team Lead' },
      { k: 'Since',    v: '2023 — ', vEm: 'now' },
      { k: 'Manages',  v: null, vEm: '10–15', vSuffix: ' techs' },
      { k: 'Onboard',  v: '6 wk → ', vEm: '2 wk' },
    ],
    sectionHead: 'Notable moments',
    moments: [
      'Rebuilt new-hire onboarding from scratch, cutting ramp time from six weeks to two.',
      'Standardized ticket templates for the highest-volume issue categories across the team.',
      'Authored knowledge-base articles that measurably improved first-call resolution rates.',
      'Managed daily operations, scheduling, and technical escalations for a rotating team of 10–15 student technicians.',
    ],
    tags: ['Team Lead','10–15 Techs','Onboarding 6→2wk','Knowledge Base'],
  },
  {
    idx: 5,
    node: 'I', name: 'Iowa State University', elev: '1,460 ft',
    stationLabel: 'Station I · The Trailhead',
    title: 'Iowa State', titleEm: 'University',
    sub: "B.S. Cyber Security Engineering · Class of '27",
    lede: '"Where the path begins. Systems, networks, cryptography, and the math that makes secure infrastructure behave."',
    highlights: [
      { k: 'Program',   v: null, vEm: 'B.S.', vSuffix: ' CSE' },
      { k: 'Since',     v: 'Fall ', vEm: '2023' },
      { k: 'Graduates', v: 'Spring ', vEm: '2027' },
      { k: 'Campus',    v: null, vEm: 'Ames', vSuffix: ', Iowa' },
    ],
    sectionHead: 'Notable moments',
    moments: [
      'Built a hardware-scheduled, five-stage pipelined RISC-V processor at the assembly level.',
      'Deployed enterprise LDAP, DNS, web, mail, and security servers in hardening labs.',
      'Completed penetration testing environments and networked systems coursework.',
      'Coursework: cryptography, computer architecture, data structures, embedded systems, networking protocols, software project management.',
    ],
    tags: ['Cryptography','RISC-V','Pen Testing','Networking','Embedded Systems'],
  },
  {
    idx: 6,
    node: '🌿', name: 'Off the Trail', elev: '800 ft',
    stationLabel: 'Off the Trail',
    title: 'Life', titleEm: 'beyond the work',
    sub: 'Hiking · Travel · Interests · 2023 — Present',
    lede: '"The ridge runs further than the résumé. Trails hiked, countries visited, and hours logged chasing things that have nothing to do with a job description."',
    photos: [
      { src: '/photos/meHiking.jpg',               label: 'Hiking' },
      { src: '/photos/Travel%201_Mexico.jpeg',      label: 'Travel' },
      { src: '/photos/Hobby%201.jpeg',              label: 'Hobbies' },
    ],
    hobbyCards: [
      { icon: '🏔️', t: 'Hiking & Outdoors', d: 'Logging miles on Iowa trails and beyond. Prefers ridgelines to parking lots.' },
      { icon: '✈️', t: 'Travel',             d: 'Mexico, Hong Kong, and wherever else fits a long weekend. Perpetual packing-light student.' },
      { icon: '🃏', t: 'TCG & Gaming',       d: 'Pokémon, Magic: The Gathering. Nerd Market started here — treating collections like portfolios.' },
    ],
    tags: ['Hiking','Travel','TCG','Photography','Outdoor Adventures'],
  },
];

export const NODE_POS = [
  { x: 160, y: 82  },  // VI
  { x: 173, y: 200 },  // V
  { x: 177, y: 256 },  // IV
  { x: 165, y: 310 },  // III
  { x: 155, y: 368 },  // II
  { x: 116, y: 476 },  // I
  { x: 102, y: 530 },  // Hobby
];
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/data/stations.js
git commit -m "data: rewrite stations.js with 7 forest-tram entries"
```

---

## Task 4: Build LandingScreen component

**Files:**
- Create: `src/components/LandingScreen.jsx`

- [ ] **Step 1: Create LandingScreen.jsx**

Write `my-portfolio/src/components/LandingScreen.jsx`:

```jsx
export default function LandingScreen({ onEnter }) {
  return (
    <div className="landing" id="landing">
      <div className="hero">
        <img src="/photos/Me_Personally.jpeg" alt="Cooper Hoy" />
        <div className="hero-overlay" />
        <svg className="hero-trees" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax meet" fill="none">
          <g fill="#162a12" opacity=".5">
            <polygon points="0,200 22,132 44,200"/><polygon points="10,200 28,112 46,200"/>
            <polygon points="64,200 86,138 108,200"/><polygon points="74,200 92,118 110,200"/>
            <polygon points="130,200 152,134 174,200"/><polygon points="140,200 158,116 176,200"/>
            <polygon points="194,200 216,130 238,200"/><polygon points="204,200 222,112 240,200"/>
            <polygon points="258,200 280,136 302,200"/><polygon points="268,200 286,118 304,200"/>
            <polygon points="322,200 344,128 366,200"/><polygon points="332,200 350,112 368,200"/>
            <polygon points="386,200 408,134 430,200"/><polygon points="396,200 414,116 432,200"/>
            <polygon points="450,200 472,130 494,200"/><polygon points="460,200 478,114 496,200"/>
            <polygon points="514,200 536,136 558,200"/><polygon points="524,200 542,118 560,200"/>
            <polygon points="578,200 600,128 622,200"/><polygon points="588,200 606,112 624,200"/>
            <polygon points="642,200 664,134 686,200"/><polygon points="652,200 670,116 688,200"/>
            <polygon points="706,200 728,130 750,200"/><polygon points="716,200 734,114 752,200"/>
            <polygon points="770,200 792,136 814,200"/><polygon points="780,200 798,118 816,200"/>
            <polygon points="834,200 856,128 878,200"/><polygon points="844,200 862,112 880,200"/>
            <polygon points="898,200 920,134 942,200"/><polygon points="908,200 926,116 944,200"/>
            <polygon points="962,200 984,130 1006,200"/><polygon points="972,200 990,114 1008,200"/>
            <polygon points="1026,200 1048,136 1070,200"/><polygon points="1036,200 1054,118 1072,200"/>
            <polygon points="1090,200 1112,128 1134,200"/><polygon points="1100,200 1118,112 1136,200"/>
            <polygon points="1154,200 1176,134 1198,200"/><polygon points="1164,200 1182,116 1200,172 1200,200"/>
          </g>
        </svg>
        <div className="hero-name">
          <h1>Cooper <em>Hoy</em></h1>
          <div className="tag">Cyber Security Engineering · Ames, Iowa</div>
        </div>
        <div className="enter-zone">
          <button className="enter-btn" onClick={onEnter}>
            <div className="ring">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polyline points="4,8 10,14 16,8" stroke="rgba(192,222,160,.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="enter-label">Enter the ascent</span>
          </button>
        </div>
      </div>
      <div className="land-foot">
        <span className="foot-meta">An illustrated curriculum vitæ</span>
        <span className="foot-meta">Plate I · 2025</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/components/LandingScreen.jsx
git commit -m "feat: add LandingScreen component"
```

---

## Task 5: Build illustrations (animated SVG fig-boxes)

**Files:**
- Create: `src/illustrations.jsx`

- [ ] **Step 1: Create illustrations.jsx**

Write `my-portfolio/src/illustrations.jsx`:

```jsx
/* Animated SVG illustrations, one per slide index 0-6 */

function IllustrationVI() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <line x1="20" y1="105" x2="260" y2="105" stroke="#c0d8a4" strokeWidth="1"/>
        <g style={{animation:'float 3s ease-in-out infinite'}}>
          <circle cx="80" cy="45" r="12" fill="none" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="57" x2="80" y2="85" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="65" x2="62" y2="78" stroke="#356828" strokeWidth="1.5" style={{transformOrigin:'80px 65px',animation:'wave 1.8s ease-in-out infinite'}}/>
          <line x1="80" y1="65" x2="98" y2="75" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="85" x2="68" y2="105" stroke="#356828" strokeWidth="1.5"/>
          <line x1="80" y1="85" x2="92" y2="105" stroke="#356828" strokeWidth="1.5"/>
          <text x="80" y="125" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">Mentor</text>
        </g>
        <g opacity=".6" style={{animation:'pulse 2s ease-in-out infinite'}}>
          <line x1="115" y1="68" x2="145" y2="68" stroke="#a0cc84" strokeWidth="1.5"/>
          <polyline points="140,63 147,68 140,73" stroke="#a0cc84" strokeWidth="1.5" fill="none"/>
        </g>
        <g style={{animation:'float 3s ease-in-out .5s infinite'}}>
          <rect x="158" y="34" width="28" height="24" rx="3" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <rect x="165" y="38" width="6" height="6" rx="1" fill="#4e8a3c" opacity=".4" style={{animation:'blink 1.2s step-end infinite'}}/>
          <rect x="175" y="38" width="6" height="6" rx="1" fill="#4e8a3c" opacity=".4" style={{animation:'blink 1.2s step-end .4s infinite'}}/>
          <rect x="161" y="58" width="36" height="20" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="172" y1="58" x2="172" y2="78" stroke="#4e8a3c" strokeWidth=".8" opacity=".4"/>
          <line x1="183" y1="58" x2="183" y2="78" stroke="#4e8a3c" strokeWidth=".8" opacity=".4"/>
          <line x1="150" y1="65" x2="161" y2="68" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="197" y1="65" x2="208" y2="62" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="172" y1="78" x2="168" y2="105" stroke="#4e8a3c" strokeWidth="1.5"/>
          <line x1="186" y1="78" x2="190" y2="105" stroke="#4e8a3c" strokeWidth="1.5"/>
          <text x="179" y="125" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">Robot</text>
        </g>
        <g style={{animation:'glow 2s ease-in-out infinite'}}>
          <circle cx="128" cy="40" r="2" fill="#a0cc84"/>
          <circle cx="135" cy="52" r="1.5" fill="#a0cc84"/>
          <circle cx="122" cy="55" r="1.5" fill="#a0cc84"/>
        </g>
      </svg>
    </div>
  )
}

function IllustrationV() {
  return (
    <div className="fig-box" style={{background:'linear-gradient(135deg,#1a3214 0%,#243c1c 100%)'}}>
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="20" y="10" width="240" height="100" rx="4" fill="#0d1a0a" stroke="#4e8a3c" strokeWidth="1"/>
        <rect x="20" y="10" width="240" height="18" rx="4" fill="#1a3214"/>
        <circle cx="34" cy="19" r="4" fill="#a0cc84" opacity=".6"/>
        <circle cx="48" cy="19" r="4" fill="#6aa058" opacity=".5"/>
        <circle cx="62" cy="19" r="4" fill="#356828" opacity=".45"/>
        <text x="32" y="42" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#a0cc84">$ python exploit.py</text>
        <text x="32" y="56" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#6aa058">[+] scanning targets...</text>
        <text x="32" y="70" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#4e8a3c">[✓] AD enumerated</text>
        <text x="32" y="84" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="#a0cc84">$ git commit -m "hardened"</text>
        <rect x="32" y="92" width="6" height="10" fill="#a0cc84" style={{animation:'blink 1s step-end infinite'}}/>
      </svg>
    </div>
  )
}

function IllustrationIV() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        {[{x:20,n:'Nerd Market',d:0},{x:104,n:'Outpost',d:.8},{x:188,n:'HelpLlama',d:1.6}].map(({x,n,d})=>(
          <g key={n} style={{animation:`float 3s ease-in-out ${d}s infinite`}}>
            <rect x={x} y="22" width="72" height="72" rx="4" fill="var(--mist)" stroke="#4e8a3c" strokeWidth="1.2"/>
            <rect x={x+8} y="30" width="56" height="8" rx="2" fill="#a0cc84" opacity=".5"/>
            <rect x={x+8} y="44" width="40" height="4" rx="1" fill="#c0d8a4" opacity=".4"/>
            <rect x={x+8} y="52" width="50" height="4" rx="1" fill="#c0d8a4" opacity=".3"/>
            <rect x={x+8} y="60" width="34" height="4" rx="1" fill="#c0d8a4" opacity=".3"/>
            <text x={x+36} y="106" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">{n}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function IllustrationIII() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="22" y="20" width="36" height="70" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        {[26,36,46,56,66].map((y,i)=>(
          <g key={y}>
            <rect x="26" y={y} width="28" height="6" rx="1" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".8"/>
            <circle cx="50" cy={y+3} r="2" fill="#a0cc84" style={{animation:`blink ${1+i*.2}s ease-in-out ${i*.3}s infinite`}}/>
          </g>
        ))}
        <rect x="116" y="50" width="48" height="24" rx="3" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        {[128,140,152].map((cx,i)=>(
          <circle key={cx} cx={cx} cy="62" r="2" fill="#a0cc84" style={{animation:`pulse 1.5s ease-in-out ${i*.3}s infinite`}}/>
        ))}
        <line x1="58" y1="55" x2="116" y2="62" stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{animation:'dash 2s linear infinite'}}/>
        {[{y:26,t:'AD'},{y:52,t:'Exchange'},{y:78,t:'GPO'}].map(({y,t},i)=>(
          <g key={t}>
            <rect x="198" y={y} width="60" height="18" rx="2" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
            <text x="228" y={y+12} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">{t}</text>
            <line x1="164" y1={60+i*2} x2="198" y2={y+9} stroke="#a0cc84" strokeWidth=".9" strokeDasharray="4,3" style={{animation:`dash ${2+i*.3}s linear ${i*.4}s infinite`}}/>
          </g>
        ))}
      </svg>
    </div>
  )
}

function IllustrationII() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <g style={{animation:'float 3s ease-in-out infinite'}}>
          <path d="M 90,30 A 35,35 0 0,1 160,30" stroke="#4e8a3c" strokeWidth="2" fill="none"/>
          <rect x="78" y="30" width="14" height="22" rx="4" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <rect x="160" y="30" width="14" height="22" rx="4" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <circle cx="125" cy="68" r="14" fill="none" stroke="#4e8a3c" strokeWidth="1.5"/>
          <circle cx="125" cy="64" r="4" fill="#4e8a3c" opacity=".5"/>
          <circle cx="125" cy="68" r="20" fill="none" stroke="#a0cc84" strokeWidth=".8" opacity=".5" style={{animation:'ripple 2s ease-out infinite'}}/>
          <circle cx="125" cy="68" r="28" fill="none" stroke="#a0cc84" strokeWidth=".5" opacity=".3" style={{animation:'ripple 2s ease-out .5s infinite'}}/>
        </g>
        {[{y:18,w:32},{y:34,w:44},{y:50,w:28},{y:66,w:40}].map(({y,w},i)=>(
          <g key={y}>
            <rect x="190" y={y} width="68" height="12" rx="2" fill="var(--mist)" stroke="#4e8a3c" strokeWidth=".9"/>
            <rect x="195" y={y+3} width={w} height="4" rx="1" fill="#a0cc84" opacity=".5"/>
          </g>
        ))}
        <text x="224" y="90" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7" fill="#6aa058">ticket queue</text>
      </svg>
    </div>
  )
}

function IllustrationI() {
  return (
    <div className="fig-box">
      <svg viewBox="0 0 280 120" fill="none">
        <rect x="60" y="40" width="100" height="65" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
        <rect x="75" y="45" width="20" height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="103" y="45" width="20" height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="131" y="45" width="20" height="20" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="75" y="72" width="20" height="33" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="131" y="72" width="20" height="33" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="100" y="78" width="20" height="27" rx="10" fill="none" stroke="#4e8a3c" strokeWidth=".9"/>
        <rect x="98" y="18" width="24" height="22" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <polygon points="98,18 110,6 122,18" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
        <g style={{animation:'float 3s ease-in-out infinite'}}>
          <rect x="188" y="36" width="48" height="5" rx="1" fill="none" stroke="#4e8a3c" strokeWidth="1.2"/>
          <polygon points="212,22 236,36 212,36 188,36" fill="none" stroke="#4e8a3c" strokeWidth="1"/>
          <line x1="236" y1="36" x2="240" y2="52" stroke="#4e8a3c" strokeWidth="1.2"/>
          <circle cx="240" cy="54" r="3" fill="#a0cc84"/>
        </g>
        <g style={{animation:'float 3s ease-in-out .8s infinite'}}>
          <rect x="185" y="62" width="52" height="36" rx="2" fill="none" stroke="#6aa058" strokeWidth="1"/>
          <line x1="193" y1="70" x2="229" y2="70" stroke="#a0cc84" strokeWidth=".8"/>
          <line x1="193" y1="78" x2="220" y2="78" stroke="#a0cc84" strokeWidth=".8"/>
          <line x1="193" y1="86" x2="215" y2="86" stroke="#a0cc84" strokeWidth=".8"/>
          <circle cx="211" cy="88" r="6" fill="none" stroke="#6aa058" strokeWidth=".8"/>
          <text x="211" y="91" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="5" fill="#4e8a3c">ISU</text>
        </g>
      </svg>
    </div>
  )
}

function IllustrationHobby({ photos }) {
  return (
    <div className="photo-grid" style={{margin:'16px 0'}}>
      {photos.map(p => (
        <div key={p.src} className="photo-label" data-label={p.label}>
          <img src={p.src} alt={p.label} style={{width:'100%',height:'160px',objectFit:'cover',display:'block'}}/>
        </div>
      ))}
    </div>
  )
}

export const ILLUSTRATIONS = [
  IllustrationVI,
  IllustrationV,
  IllustrationIV,
  IllustrationIII,
  IllustrationII,
  IllustrationI,
  IllustrationHobby,
]
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/illustrations.jsx
git commit -m "feat: add per-station animated SVG illustrations"
```

---

## Task 6: Build Slide component

**Files:**
- Create: `src/components/Slide.jsx`

- [ ] **Step 1: Create Slide.jsx**

Write `my-portfolio/src/components/Slide.jsx`:

```jsx
import { ILLUSTRATIONS } from '../illustrations'

const PinIcon = () => (
  <svg className="sh-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6,11 C6,11 1,8 1,4.5 C1,2.5 3.2,1 6,1 C8.8,1 11,2.5 11,4.5 C11,8 6,11 6,11Z" stroke="#4e8a3c" strokeWidth=".9"/>
    <line x1="6" y1="11" x2="6" y2="4" stroke="#4e8a3c" strokeWidth=".7"/>
  </svg>
)

function HighlightCell({ k, v, vEm, vSuffix }) {
  return (
    <div className="sl-hl">
      <div className="hl-k">{k}</div>
      <div className="hl-v">
        {v}{vEm ? <em>{vEm}</em> : null}{vSuffix}
      </div>
    </div>
  )
}

export default function Slide({ station, isActive, isLeaving }) {
  const Illustration = ILLUSTRATIONS[station.idx]
  const cls = ['slide', isActive ? 'active' : '', isLeaving ? 'leaving' : ''].filter(Boolean).join(' ')

  return (
    <div className={cls} data-i={station.idx}>
      <div className="wm">{station.node}</div>
      <div className="sl-badge">
        <span className="sl-num">{station.stationLabel}</span>
        <span className="sl-elev">{station.elev}</span>
      </div>
      <div className="sl-title">{station.title} <em>{station.titleEm}</em></div>
      <div className="sl-sub">{station.sub}</div>

      {station.idx === 6
        ? <Illustration photos={station.photos} />
        : <Illustration />
      }

      <div className="sl-lede">{station.lede}</div>

      {station.highlights && (
        <>
          <div className="sl-grid">
            {station.highlights.map(h => <HighlightCell key={h.k} {...h} />)}
          </div>
          <div className="sh">
            <span className="sh-text">{station.sectionHead}</span>
            <div className="sh-line" />
            <PinIcon />
          </div>
          <ul className="sl-moments">
            {station.moments.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
          <div className="sl-tags">
            {station.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
          </div>
        </>
      )}

      {station.skillGroups && (
        <>
          <div className="sl-skills">
            {station.skillGroups.map(g => (
              <div key={g.h}>
                <div className="sg-h">{g.h}</div>
                <div className="sg-tags">
                  {g.tags.map(t => <span key={t} className="sg-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {station.projects && (
        <>
          <div className="sl-projects">
            {station.projects.map(p => (
              <div key={p.t} className="sl-proj">
                <div className="proj-hd">
                  <span className="proj-t">{p.t}</span>
                  <span className="proj-st">{p.st}</span>
                </div>
                <div className="proj-d">{p.d}</div>
                <div className="proj-stack">
                  {p.stack.map(s => <span key={s} className="ptag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {station.hobbyCards && (
        <>
          <div className="hobby-cards">
            {station.hobbyCards.map(c => (
              <div key={c.t} className="hc">
                <div className="hc-icon">{c.icon}</div>
                <div className="hc-t">{c.t}</div>
                <div className="hc-d">{c.d}</div>
              </div>
            ))}
          </div>
          <div className="sl-tags">
            {station.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/components/Slide.jsx
git commit -m "feat: add generic Slide component"
```

---

## Task 7: Build MapColumn component

**Files:**
- Create: `src/components/MapColumn.jsx`

- [ ] **Step 1: Create MapColumn.jsx**

Write `my-portfolio/src/components/MapColumn.jsx`:

```jsx
import { useRef, useEffect, useState } from 'react'
import { NODE_POS } from '../data/stations'

const TRAM_PATH = "M 160,82 C 167,102 175,120 181,142 C 187,164 179,180 173,200 C 167,220 173,236 177,256 C 181,276 172,290 165,310 C 158,330 158,348 155,368 C 152,388 144,402 136,422 C 128,442 122,456 116,476 C 110,496 106,510 102,530"

export default function MapColumn({ curSlide, onSelect, onBack, mapOpen }) {
  const tramRef = useRef(null)
  const ringRef = useRef(null)
  const ringAnimRef = useRef(null)
  const posRef = useRef({ x: NODE_POS[0].x, y: NODE_POS[0].y })
  const rafRef = useRef(null)

  function moveTram(targetIdx) {
    const target = NODE_POS[targetIdx]
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    function step() {
      const p = posRef.current
      const dx = target.x - p.x, dy = target.y - p.y
      if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
        posRef.current = { x: target.x, y: target.y }
        tramRef.current?.setAttribute('transform', `translate(${target.x},${target.y})`)
        return
      }
      posRef.current = { x: p.x + dx * 0.1, y: p.y + dy * 0.1 }
      tramRef.current?.setAttribute('transform', `translate(${posRef.current.x.toFixed(2)},${posRef.current.y.toFixed(2)})`)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  function moveRing(idx) {
    const p = NODE_POS[idx]
    if (!ringRef.current) return
    ringRef.current.setAttribute('cx', p.x)
    ringRef.current.setAttribute('cy', p.y)
    if (ringAnimRef.current) {
      ringAnimRef.current.setAttribute('from', `0 ${p.x} ${p.y}`)
      ringAnimRef.current.setAttribute('to',   `360 ${p.x} ${p.y}`)
    }
  }

  useEffect(() => {
    moveTram(curSlide)
    moveRing(curSlide)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [curSlide])

  const LABELS = ['FIRST Tech Challenge','The Kit','Side Projects','Cambridge Investments','ISU IT Solution Center','Iowa State University','Off the Trail']

  return (
    <div className={`map-col${mapOpen ? ' mob-open' : ''}`} id="mapCol">
      <div className="map-head">
        <button className="back-btn" onClick={onBack}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <polyline points="5,1 2,4 5,7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Back
        </button>
        <div className="map-title-wrap">
          <div className="map-title">Ascent Map</div>
          <div className="map-sub">Summit → Valley · 7 stations</div>
        </div>
      </div>

      <div className="topo-wrap">
        <svg id="topoSvg" viewBox="0 0 320 580" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="tF" cx="50%" cy="18%" r="52%">
              <stop offset="0%" stopColor="#356828" stopOpacity=".22"/>
              <stop offset="60%" stopColor="#4e8a3c" stopOpacity=".08"/>
              <stop offset="100%" stopColor="#a0cc84" stopOpacity=".02"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="320" height="580" fill="var(--paper)"/>
          {/* grid */}
          <g stroke="#c0d8a4" strokeWidth=".45" opacity=".5">
            {[82,164,246,328,410,492].map(y=><line key={y} x1="0" y1={y} x2="320" y2={y}/>)}
            {[80,160,240].map(x=><line key={x} x1={x} y1="0" x2={x} y2="580"/>)}
          </g>
          {/* contours */}
          {[{rx:130,ry:60,s:'#c0d8a4',sw:.65,o:.4},{rx:108,ry:50,s:'#aacca0',sw:.75,o:.45},{rx:88,ry:40,s:'#8ab870',sw:.85,o:.5},{rx:66,ry:30,s:'#6aa058',sw:.95,o:.55},{rx:46,ry:21,s:'#4a8040',sw:1.05,o:.6},{rx:28,ry:13,s:'#306030',sw:1.15,o:.65},{rx:13,ry:6,s:'#1e4820',sw:1.25,o:.7}].map(({rx,ry,s,sw,o})=>(
            <ellipse key={rx} cx="160" cy="82" rx={rx} ry={ry} stroke={s} strokeWidth={sw} opacity={o} fill="none"/>
          ))}
          <ellipse cx="160" cy="82" rx="5" ry="2.5" fill="#1e3318" opacity=".85"/>
          <ellipse cx="160" cy="82" rx="130" ry="60" fill="url(#tF)"/>
          {/* elevation labels */}
          <g fontFamily="'JetBrains Mono',monospace" fontSize="5.8" fill="#8aaa78" opacity=".6">
            {[{y:85,t:"6,643'"},{y:204,t:"5,540'"},{y:262,t:"4,910'"},{y:320,t:"3,840'"},{y:377,t:"2,280'"},{y:454,t:"1,460'"},{y:527,t:"800'"}].map(({y,t})=>(
              <text key={y} x="283" y={y}>{t}</text>
            ))}
          </g>
          {/* tree symbols left */}
          <g fill="none" stroke="#4e8a3c" strokeWidth="1" opacity=".45">
            {[145,163,183,204,224,245,265,285,308,330,352,374,396,418,440,462,484,506].map((y,i)=>(
              <g key={y} transform={`translate(${i%2===0?44:58},${y})`}>
                <polygon points={`0,${i%2===0?-9:-8} ${i%2===0?7:6},${i%2===0?5:4} ${i%2===0?-7:-6},${i%2===0?5:4}`}/>
                <line x1="0" y1={i%2===0?5:4} x2="0" y2={i%2===0?10:9}/>
              </g>
            ))}
          </g>
          {/* tree symbols right */}
          <g fill="none" stroke="#4e8a3c" strokeWidth="1" opacity=".45">
            {[148,168,190,212,234,256,278,300,322,344,366,388,410,432,454,476,498,520].map((y,i)=>(
              <g key={y} transform={`translate(${i%2===0?258:272},${y})`}>
                <polygon points={`0,${i%2===0?-9:-8} ${i%2===0?7:6},${i%2===0?5:4} ${i%2===0?-7:-6},${i%2===0?5:4}`}/>
                <line x1="0" y1={i%2===0?5:4} x2="0" y2={i%2===0?10:9}/>
              </g>
            ))}
          </g>
          {/* tram path */}
          <path d={TRAM_PATH} fill="none" stroke="#356828" strokeWidth="2" strokeOpacity=".28"/>
          <path d={TRAM_PATH} fill="none" stroke="#4e8a3c" strokeWidth=".9" strokeOpacity=".55" strokeDasharray="5,4"/>
          {/* tower marks */}
          <g stroke="#356828" strokeWidth="1.2" opacity=".4">
            {[[179,132,145],[175,192,204],[176,248,260],[162,302,315],[155,360,372],[120,468,480]].map(([x,y1,y2])=>(
              <line key={x+'-'+y1} x1={x} y1={y1} x2={x} y2={y2}/>
            ))}
          </g>
          {/* active ring */}
          <circle ref={ringRef} id="activeRing" cx={NODE_POS[0].x} cy={NODE_POS[0].y} r="14" fill="none" stroke="#4e8a3c" strokeWidth="1.1" strokeOpacity=".4" strokeDasharray="3,3">
            <animateTransform ref={ringAnimRef} attributeName="transform" attributeType="XML" type="rotate" from={`0 ${NODE_POS[0].x} ${NODE_POS[0].y}`} to={`360 ${NODE_POS[0].x} ${NODE_POS[0].y}`} dur="12s" repeatCount="indefinite"/>
          </circle>
          {/* station nodes */}
          {NODE_POS.map((p, i) => (
            <g key={i} onClick={() => onSelect(i)} style={{cursor:'pointer'}}>
              <circle id={`nc${i}`} cx={p.x} cy={p.y} r="9" fill="var(--paper)" stroke={i === curSlide ? '#224618' : '#6aa058'} strokeWidth={i === curSlide ? 1.5 : 1}/>
              <text id={`nt${i}`} x={p.x} y={p.y + 3.5} textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize={i === 6 ? 9 : 8} fill="#224618" fontWeight="600">
                {['VI','V','IV','III','II','I','🌿'][i]}
              </text>
            </g>
          ))}
          {/* labels */}
          <g fontFamily="'JetBrains Mono',monospace" fontSize="6.8" fill="#506048">
            {NODE_POS.map((p, i) => (
              <text key={i} x={p.x + 13} y={p.y + 3}>{LABELS[i]}</text>
            ))}
          </g>
          {/* compass */}
          <g transform="translate(24,548)" fill="none" stroke="#8aaa78" strokeWidth=".9" opacity=".55">
            <line x1="0" y1="-12" x2="0" y2="12"/><line x1="-12" y1="0" x2="12" y2="0"/>
            <polygon points="0,-12 3,-4 0,-8 -3,-4" fill="#4e8a3c" stroke="none"/>
            <text x="0" y="-15" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6" fill="#4e8a3c" stroke="none">N</text>
          </g>
          {/* scale */}
          <g transform="translate(196,560)" stroke="#8aaa78" strokeWidth=".8" fill="none" opacity=".5">
            <line x1="0" y1="0" x2="64" y2="0"/>
            <line x1="0" y1="-3" x2="0" y2="3"/><line x1="64" y1="-3" x2="64" y2="3"/>
            <text x="32" y="-6" textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="6" fill="#8aaa78">0.5 mi</text>
          </g>
          {/* tram car */}
          <g ref={tramRef} id="tramCar" transform={`translate(${NODE_POS[0].x},${NODE_POS[0].y})`}>
            <ellipse cx="1" cy="17" rx="10" ry="3" fill="rgba(22,42,18,.16)"/>
            <line x1="-7" y1="-14" x2="-10" y2="-8" stroke="#224618" strokeWidth=".9" opacity=".65"/>
            <line x1="7"  y1="-14" x2="10"  y2="-8" stroke="#224618" strokeWidth=".9" opacity=".65"/>
            <circle cx="0" cy="-17" r="3.5" fill="none" stroke="#224618" strokeWidth="1.2"/>
            <circle cx="0" cy="-17" r="1.2" fill="#224618"/>
            <line x1="0" y1="-13" x2="0" y2="-9" stroke="#356828" strokeWidth="1.4"/>
            <path d="M -11,-9 Q -12,0 -11,8 L 11,8 Q 12,0 11,-9 Z" fill="#f3ede0" stroke="#224618" strokeWidth="1.3"/>
            <path d="M -11,-9 Q 0,-15 11,-9" fill="#d4e8c0" stroke="#224618" strokeWidth="1"/>
            <rect x="-8" y="-5" width="4.5" height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <rect x="-2" y="-5" width="4" height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <rect x="3.5" y="-5" width="4.5" height="5" rx="1" fill="rgba(53,104,40,.12)" stroke="#356828" strokeWidth=".8"/>
            <line x1="-11" y1="8" x2="11" y2="8" stroke="#224618" strokeWidth=".8" opacity=".4"/>
          </g>
          {/* border */}
          <rect x="1" y="1" width="318" height="578" fill="none" stroke="#b8d89a" strokeWidth="1" opacity=".35"/>
          <g stroke="#8aaa78" strokeWidth=".8" opacity=".4">
            <polyline points="1,1 13,1 13,13"/><polyline points="307,1 319,1 319,13"/>
            <polyline points="1,567 1,579 13,579"/><polyline points="319,567 319,579 307,579"/>
          </g>
        </svg>
      </div>

      <div className="map-foot">
        <a href="mailto:cjhoy@iastate.edu" className="clink"><span className="ck">mail</span><span className="cv">cjhoy@iastate.edu</span></a>
        <a href="tel:+13192403504" className="clink"><span className="ck">tel</span><span className="cv">319.240.3504</span></a>
        <a href="https://linkedin.com/in/cooperhoy" className="clink"><span className="ck">in</span><span className="cv">linkedin.com/in/cooperhoy</span></a>
        <a href="https://github.com/34coopatroopa" className="clink"><span className="ck">gh</span><span className="cv">34coopatroopa</span></a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/components/MapColumn.jsx
git commit -m "feat: add MapColumn with topo SVG and animated tram car"
```

---

## Task 8: Build ContentColumn component

**Files:**
- Create: `src/components/ContentColumn.jsx`

- [ ] **Step 1: Create ContentColumn.jsx**

Write `my-portfolio/src/components/ContentColumn.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { STATIONS } from '../data/stations'
import Slide from './Slide'

export default function ContentColumn({ curSlide, onNavigate }) {
  const [leavingSlide, setLeavingSlide] = useState(null)

  function go(dir) {
    const next = curSlide + dir
    if (next < 0 || next >= STATIONS.length) return
    setLeavingSlide(curSlide)
    setTimeout(() => setLeavingSlide(null), 320)
    onNavigate(next)
  }

  return (
    <div className="content-col">
      <div className="slide-win">
        {STATIONS.map(s => (
          <Slide
            key={s.idx}
            station={s}
            isActive={s.idx === curSlide}
            isLeaving={s.idx === leavingSlide}
          />
        ))}
      </div>
      <div className="content-nav">
        <button className="nav-arr" disabled={curSlide === 0} onClick={() => go(-1)}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <polyline points="1,6 4.5,2 8,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Higher
        </button>
        <div className="nav-center">
          <div className="nav-dots">
            {STATIONS.map((_, i) => (
              <button key={i} className={`ndot${i === curSlide ? ' on' : ''}`} onClick={() => onNavigate(i)}/>
            ))}
          </div>
          <div className="nav-sname">{STATIONS[curSlide].name}</div>
        </div>
        <button className="nav-arr" disabled={curSlide === STATIONS.length - 1} onClick={() => go(1)}>
          Lower
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <polyline points="1,3 4.5,7 8,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add my-portfolio/src/components/ContentColumn.jsx
git commit -m "feat: add ContentColumn with slide transitions and nav bar"
```

---

## Task 9: Build MainLayout and App, wire everything up

**Files:**
- Create: `src/components/MainLayout.jsx`
- Modify: `src/App.jsx` (full rewrite)
- Modify: `src/main.jsx` (remove stale createRoot duplicate if present)

- [ ] **Step 1: Create MainLayout.jsx**

Write `my-portfolio/src/components/MainLayout.jsx`:

```jsx
import { useState } from 'react'
import MapColumn from './MapColumn'
import ContentColumn from './ContentColumn'

export default function MainLayout({ visible, onBack }) {
  const [curSlide, setCurSlide] = useState(0)
  const [mapOpen, setMapOpen]   = useState(false)

  return (
    <div className={`main${visible ? ' in' : ''}`} id="main">
      <MapColumn
        curSlide={curSlide}
        onSelect={i => { setCurSlide(i); setMapOpen(false) }}
        onBack={onBack}
        mapOpen={mapOpen}
      />
      <ContentColumn
        curSlide={curSlide}
        onNavigate={setCurSlide}
      />
      <button className="mobile-map-btn" id="mapToggle" onClick={() => setMapOpen(o => !o)}>🗺</button>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite App.jsx**

Write `my-portfolio/src/App.jsx`:

```jsx
import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import LandingScreen from './components/LandingScreen'
import MainLayout from './components/MainLayout'

export default function App() {
  const [screen, setScreen] = useState('landing')

  return (
    <div className="screens">
      <LandingScreen
        onEnter={() => setScreen('main')}
        out={screen === 'main'}
      />
      <MainLayout
        visible={screen === 'main'}
        onBack={() => setScreen('landing')}
      />
      <Analytics />
    </div>
  )
}
```

- [ ] **Step 3: Update LandingScreen to accept `out` prop**

Edit `my-portfolio/src/components/LandingScreen.jsx` — change the opening `<div>` from:
```jsx
<div className="landing" id="landing">
```
to:
```jsx
<div className={`landing${out ? ' out' : ''}`} id="landing">
```

And update the function signature from:
```jsx
export default function LandingScreen({ onEnter }) {
```
to:
```jsx
export default function LandingScreen({ onEnter, out }) {
```

- [ ] **Step 4: Check main.jsx has no stale createRoot call**

Read `my-portfolio/src/main.jsx`. It should look like:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
If there is a second `createRoot` call anywhere (leftover from the old terminal build), remove it.

- [ ] **Step 5: Open browser and verify the full flow**

```bash
cd my-portfolio && npm run dev
```

Open `http://localhost:5173`. Verify:
1. Landing hero photo renders with tree silhouette
2. "Enter the ascent" button pulses, ripple rings animate
3. Click enter → landing slides up, main layout slides up from below
4. Left column shows topo map with tram car at Station VI
5. Right column shows Station VI (FTC) slide with animated mentor+robot SVG
6. Click "Lower" → tram car glides to Station V, slide transitions
7. Click any map node → tram jumps to that station
8. Click "Back" → returns to landing

- [ ] **Step 6: Commit**

```bash
git add my-portfolio/src/App.jsx my-portfolio/src/components/MainLayout.jsx my-portfolio/src/components/LandingScreen.jsx my-portfolio/src/main.jsx
git commit -m "feat: wire up App, MainLayout, and landing transition"
```

---

## Task 10: Final check and production build

- [ ] **Step 1: Run lint**

```bash
cd my-portfolio && npm run lint
```

Fix any errors reported. Common ones: missing `key` props, unused imports.

- [ ] **Step 2: Run production build**

```bash
cd my-portfolio && npm run build
```

Expected: `dist/` created, no errors. Warnings about bundle size are fine.

- [ ] **Step 3: Preview production build**

```bash
cd my-portfolio && npm run preview
```

Open `http://localhost:4173`. Verify photos load (they come from `/photos/` — check network tab if blank). Verify all 7 slides render. Verify tram animation works.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: forest-tram portfolio complete — replace 3D scene with topo map navigator"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Landing screen with hero photo, tree SVG, enter button, footer — Task 4
- ✅ Landing transition (slides up) — Task 9 (`out` class)
- ✅ Map column: topo SVG, contours, tram path, nodes, tram car lerp animation — Task 7
- ✅ Active ring around current node — Task 7
- ✅ Contact links in map footer — Task 7
- ✅ 7 slides with per-station content (highlights, moments, projects, skills, hobby) — Task 6
- ✅ Animated SVG illustrations per slide — Task 5
- ✅ Hobby photo grid (3 photos) — Task 5 (IllustrationHobby)
- ✅ Slide transitions (active/leaving CSS classes) — Task 8
- ✅ Bottom nav: Higher/Lower arrows, dots, station name — Task 8
- ✅ Click map node to jump — Task 7 + Task 9
- ✅ Back button returns to landing — Task 9
- ✅ Mobile: floating map button, responsive styles — Task 2 (CSS) + Task 9 (mapOpen state)
- ✅ Photos copied to public/ — Task 1
- ✅ Three.js deps removed — Task 1
- ✅ stations.js 7 entries with NODE_POS — Task 3

**No placeholders found.**

**Type consistency:** `NODE_POS` exported from `stations.js`, imported in `MapColumn.jsx`. `STATIONS` exported from `stations.js`, imported in `ContentColumn.jsx` and `Slide.jsx`. `ILLUSTRATIONS` array exported from `illustrations.jsx`, imported in `Slide.jsx` by `station.idx`. All consistent.
