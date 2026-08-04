# Portfolio — Project Instructions

## Project Overview
Static one-page HTML/CSS/JS graphic design portfolio. No build step, no server.
- **Stack:** HTML, CSS, vanilla JS. `index.html` is the entire site — every project is a modal on it.
- **Design system:** `css/style.css` — single source of truth for all styles
- **Aesthetic:** Printed form / risograph / zine — ink on paper, Courier Prime mono, Roboto display
- **Colors:** `--paper: #F4F1EC`, `--ink: #0A0A0A`, muted tones, dashed dividers
- **Local preview:** `python -m http.server 8000`

## Asset Structure — two zones

**`assets/` is published.** Only web-ready files, committed and deployed. Fixed names per project:

```
assets/projects/<slug>/cover.jpg       homepage cover / modal hero
assets/projects/<slug>/gallery/01.jpg  modal gallery, numbered in display order
assets/site/favicon/, assets/site/portrait.png
```
(f. maeda has no cover.jpg — its homepage cover is the live `logo-anim.html` iframe.)

**`content/` is authoring.** Gitignored, never deployed. Per project: `project.md` (copy),
`inbox/` (unsorted drops), `source/` (full-quality originals), `notes/` (briefs, prompts).

When publishing new media: read `content/projects/<slug>/inbox/`, confirm the selection with
the user, file originals into `source/`, then write compressed copies into `assets/` under the
naming contract above and wire them into `index.html`.

- Resize published images to max 2000px wide, JPEG q3 via ffmpeg. Keep PNG only for real transparency
  (check first — several source PNGs carry an all-opaque alpha channel and should become JPEG).
- Published filenames must be lowercase ASCII, no spaces or accents. Hosting is case-sensitive.
- One slug per project — folder name, modal id (`modal-<slug>`), and `project.md` all agree.

## Active Projects

### F. Maeda Keiei (`modal-fmaeda` in `index.html`)
**Brand identity project — Branding, 2026, Role: Brand Designer**

#### Logo & Brand
- **Mark:** Five white circles in an exact pentagon: 1 circle at top-center, 2 circles in the middle row (left and right), 2 circles at the bottom row (left and right). ALWAYS 5 circles, NEVER 4.
- **Wordmark:** "F. Maeda" bold + "keiei" light — same sans-serif, weight contrast as design device
- **Palette:** Pure black (`#0A0A0A`) and pure white (`#FFFFFF`) only — no grays, no tints
- **Reference assets:** `content/projects/fmaeda-keiei/source/`
  - `image2.jpg` — isolated mark (5-circle pentagon), the canonical logo reference
  - `appleicon.png` — square app icon version of the mark
  - `brand.jpg` — horizontal + stacked logo lockup on black
  - `businesscards.jpg` — dual card mockup (black back + white front)
  - `slide.jpg` — alternate lockup variants
  - `dark_2 (1).jpg` — live site in browser screenshot
  - `hf-mark-overhead.png` — Higgsfield generated: 5 discs overhead studio
  - `hf-desk-scene.png` — Higgsfield generated: executive desk scene
  - `hf-card-macro.png` — Higgsfield generated: card macro
- **Archive card:** a live GSAP animation, not an image —
  `assets/projects/fmaeda-keiei/logo-anim.html`, loaded in an iframe. It references
  `js/gsap.min.js` via `../../../` — that relative depth must be preserved if the file moves.
- **Live site:** https://www.fmaeda.co

#### Website Copy (fmaeda.co)
```
F. MAEDA KEIEI
Strategic Expansion & Operational Structure
We help consumer and operator-led brands structure and execute international expansion
in Europe and LatAm — with operational discipline and long-term sustainability.

Expansion creates risk.
Poorly structured growth creates fragility.
Market entry decisions carry operational consequences.
We bring clarity before scale — and structure during it.
Decisions over deliverables.
Execution over slides.

Who We Work With
Consumer brands with physical or hybrid operations.
Food & beverage, coffee, QSR and replicable multi-unit models.
Structured SMEs and scale-ups (€2M–€50M revenue).
Founders and CEOs navigating international expansion.
Where expansion mistakes are expensive.

Situations We Step Into
"We want to expand, but we're not sure we're ready."
Growth is outpacing operational control.
Uncertainty between franchising, owned stores or partnerships.
Entry into a new country without structural clarity.
Founders becoming the bottleneck for every decision.

How We Engage
1. Expansion Diagnosis — Clarity before commitment.
   Go / No-Go assessment. Entry model definition. Risk mapping. 6–12 month structural roadmap.
2. Expansion & Operational Structuring — Hands-on support to design and stabilize operational architecture.
   Franchise and multi-unit alignment. SOP review and execution framework.
3. Interim Leadership — Temporary operational ownership during critical growth phases.
   Execution without premature hiring. Clear handover and structural continuity.

Our Method
Diagnosis → Structural Design → Execution Framework → Performance Oversight
Grounded in operational reality. Built for sustainability.

Selected Expansion Experience
The Coffee — European multi-country expansion in a high-growth coffee brand.
Entry model definition, franchise and owned-unit alignment, supplier network coordination,
cross-border operational execution, leadership support during accelerated growth.

Founder: Frank Maeda
10+ years in international operations, expansion, and franchise structuring.
Led European multi-country expansion for a fast-growing coffee brand.

"Expansion is not about opening markets.
It is about sustaining decisions after the excitement fades."
```

#### Key Visual Concepts for AI Generation
- "Structure forming from chaos" — the 5 circles assembling into a pentagon
- Bonsai tree motif on the website = controlled growth under deliberate constraint
- Binary palette: black and white only, no compromise
- Executive restraint: sparse desks, deliberate objects, no visual noise
- Japanese-Western duality: precision meets operational discipline

### Z-Hive (`modal-zhive` in `index.html`)
**Brand identity + website — automação residencial, Curitiba, 2026**

**The identity was redesigned in 2026. Ignore anything describing the old one.**
The old assets (Vector.svg, the teal "Zhive" screens, hf-lighting/hf-blinds videos)
are superseded and live only in `content/projects/zhive/source/`.

- **Mark:** one continuous ribbon folding back on itself — a single path routing through
  a structure. Two interlocking angular strokes with rounded terminals. Source of truth:
  `content/projects/zhive/inbox/simbolo1logo.svg`; a clean render for AI reference is
  `content/projects/zhive/source/zhive-mark-sq.jpg`.
- **Palette:** navy-black `#0A1420`, ice blue `#8EC5F5`, warm amber `#E8A552`, white.
  **Rule: cool signal-white is the system, warm amber is the home — never mix them in one surface.**
- **Tagline:** "Rotina em Fluxo". Positioning: local processing, 0ms latency, zero cloud,
  zero subscriptions.
- **Live site:** https://website-delta-lemon-kcmfovjt1z.vercel.app/ — signature moments are
  the isometric blueprint ("um ecossistema, um fluxo": hub + LUZ/CAM/TV/PERSIANA/CLIMA nodes
  with light pulsing along the connections) and the CENAS scene simulator (Bom Dia / Chegando /
  Cinema / Jantar / Boa Noite / Férias driving a live vector room).
- `inbox/04_appsplash.png` is unused — it contains a hand.

## Interactive Elements — Button & Link Hover Rule

Every clickable text element (nav buttons, contact button, modal close `( x )`, email/instagram links, filter buttons, footer links, project meta links, and all future buttons/links) uses a single unified hover pattern:

- **Hover state:** `background: var(--ink); color: var(--paper)` — dark ink fill behind the text, light paper text
- **Box coverage:** the dark box covers only the text's own width and height (like a text selection). Achieve this by keeping the element `inline-block` or, in flex containers, using `align-items: flex-start` on the parent so items don't stretch to a shared width
- **Transition:** `transition: background 0.12s, color 0.12s` on the base element
- **Pseudo-elements** (`::before`, `::after`) that carry decorative characters (parentheses, arrows) must use `color: inherit` so they flip together with the text on hover
- **No wiggle animation** — the `.text-hover` / `chJitter` wiggle effect has been retired. Do not add `.text-hover` class to any element
- **Active/selected states** (e.g. active filter) use `color: var(--ink)` only — no background fill — to distinguish selection from hover

Apply this pattern to every new interactive text element. Reference `.sh-item`, `.sf-link`, `.mag-hero-name`, `.sf-contact a`, `.modal-close`, `.modal-inner p a` in `css/style.css` as canonical examples.

## Homepage — Magazine Layout (Figma Page 2, node 34:83)

`index.html` is the entire site. Structure, top to bottom:
1. **Header bar** (white, `.site-header`): `<dani ;)>` `<contact>` `<curriculum>` `( ... )`
2. **Highlight** (`.mag-hero`): one featured project — big cover image (aspect `1021/628`) + right column 329px: name / `<highlight>` flag / description / tags pinned to bottom
3. **Cover grid** (`.mag-grid`): remaining projects — 3-up row (aspect `443/346`), then a 2-up row (aspect `674/484`) that stays commented out until a 5th project publishes
4. **Footer bar** (white, `.site-footer`): left = `( ) all projects` (anchors to `#projects`) + the highlight's question paragraph; right = `( ) available for work` + email / instagram / ©

The archive and gallery modals are **retired** — the homepage grid is the archive. Covers open project modals via `data-modal`. The f. maeda cover is the live GSAP iframe (`#fm-anim`), scaled to cover its cell by `initFmCover()` in `js/main.js`.

## Grid Law — fixed gutters

**Gutters are ALWAYS `--gutter` (20px), at every breakpoint, in the homepage grid AND modal galleries.** When a row doesn't fit, columns drop (3→1, 2→1) or slots rescale — spacing never compresses. Page margins are `--margin` (36px, 20px ≤520px). Breakpoints: hero stacks ≤1100px; grids drop to 1 column ≤760px.

## Project Modal Fill (Figma node 34:153)

Modal chassis is unchanged (draggable `.modal-panel`, `( x )`, `( ... )`, `min(820px, 92vw)`, max-height `88vh`). The fill:

```html
<div class="modal-proj-scroll">
  <div class="modal-inner">                 <!-- Box 1: info -->
    <p class="mp-title">&lt;name&gt;</p>     <!-- 36px margin-bottom (needs .modal-inner prefix in CSS) -->
    <p class="mp-tags">&gt; tag<br>&gt; tag</p>
    <div class="mp-desc"><p>&gt; …</p></div>
  </div>
  <div class="modal-inner">                 <!-- Box 2: gallery -->
    <div class="mp-gallery">                <!-- CSS multicol masonry -->
      <div class="mp-item"><img …></div>    <!-- cover first, then gallery/01… -->
      <div class="mp-item"><img …></div>
    </div>
  </div>
</div>
```

Curriculum modal uses the same chassis with `.cv-intro-row` / `.cv-section` fill (Figma 34:125 — no star ratings).

## Gallery Rules
1. **Modal galleries never crop.** `.mp-gallery` is a 2-column CSS multicol masonry: 20px between columns, 20px between stacked images, every image at its own natural aspect (`width: 100%; height: auto`). The two columns may end at different heights — that's fine. 1 column ≤600px.
2. **Homepage covers DO crop** — fixed-ratio grid slots (`object-fit: cover`), that's the magazine look. If a cover crops badly, derive a better crop from `content/<slug>/source/`.
3. Each project's modal gallery lists `cover.jpg` first (where it exists), then `gallery/01…` in order.

## AI Image Generation Rules
When generating images or video for any project:
1. Always read the brand reference images in `content/projects/[slug]/source/` before writing prompts
2. Always read the website copy from this file for the relevant project
3. Upload the brand mark as a reference (`nano_banana_pro` uses role `image`, `flux_2` uses `image_references`)
4. Be hyper-specific about circle/shape counts — never assume, always state the exact number
5. **Model choice:** `nano_banana_pro` at 2k when the logo must be reproduced exactly (best mark
   fidelity, ~2 credits); `flux_2` pro at 2k for atmosphere where the mark isn't the subject (~1.5).
   Video: `seedance_2_0`, 5s, `mode: fast`, 720p, `generate_audio: false` (~17.5 credits).
5b. **Composite, don't prompt, for complex marks.** No image model reliably reproduces a logo with
   internal cut-outs — it redraws them. Simple geometry (the f. maeda five circles) survives a good
   reference; the next play badge did not, twice. For those: generate a deliberately EMPTY plate
   ("nothing on the wall, no signage, no logo, no text — plate for compositing"), then composite the
   real PNG with PIL and fake the glow with stacked GaussianBlur passes screened over the plate.
   See `content/projects/nextplay/source/gen2/badge-sign.png`. Guarantees pixel-exact identity.
6. **Never put hex codes in a video prompt** — Seedance renders them as literal on-screen text
   (a `#0A0A0A` in the prompt printed "0A.0A.03" across the bottom of a clip). Name colours in words
   for video; hex is safe for stills.
7. **No humans and no faces in any generation** — say so explicitly in the prompt, and also exclude
   silhouettes, hands and crowds, which slip in otherwise.
8. Seedance may answer with a `preset_recommendation`; when the prompt is deliberate art direction,
   resend with `declined_preset_id` rather than accepting the preset, which overrides the direction.
9. Check `unlim.available` before assuming free generations — on this account it is **false**,
   so every generation costs credits.

## Token Usage
Announce token usage at every 10% milestone proactively (60%, 70%, 80%, 90%).
Format: _(~XX% of context used)_ as a short inline note.
