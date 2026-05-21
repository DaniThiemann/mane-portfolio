# Portfolio — Project Instructions

## Project Overview
Static HTML/CSS/JS graphic design portfolio website with a local Node.js/Express admin dashboard.
- **Stack:** HTML, CSS, vanilla JS, Node/Express (server.js), multer for uploads
- **Design system:** `css/style.css` — single source of truth for all styles
- **Aesthetic:** Printed form / risograph / zine — ink on paper, Courier Prime mono, Roboto display
- **Colors:** `--paper: #F4F1EC`, `--ink: #0A0A0A`, muted tones, dashed dividers
- **Server:** `node server.js` → http://localhost:3000 | Admin → http://localhost:3000/admin/

## Active Projects

### F. Maeda Keiei (`projects/fmaeda-keiei.html`)
**Brand identity project — Branding, 2026, Role: Brand Designer**

#### Logo & Brand
- **Mark:** Five white circles in an exact pentagon: 1 circle at top-center, 2 circles in the middle row (left and right), 2 circles at the bottom row (left and right). ALWAYS 5 circles, NEVER 4.
- **Wordmark:** "F. Maeda" bold + "keiei" light — same sans-serif, weight contrast as design device
- **Palette:** Pure black (`#0A0A0A`) and pure white (`#FFFFFF`) only — no grays, no tints
- **Reference assets:** `assets/perproject/fmaedakeiei/`
  - `image2.jpg` — isolated mark (5-circle pentagon), the canonical logo reference
  - `appleicon.png` — square app icon version of the mark
  - `brand.jpg` — horizontal + stacked logo lockup on black
  - `businesscards.jpg` — dual card mockup (black back + white front)
  - `slide.jpg` — alternate lockup variants
  - `dark_2 (1).jpg` — live site in browser screenshot
  - `hf-mark-overhead.png` — Higgsfield generated: 5 discs overhead studio
  - `hf-desk-scene.png` — Higgsfield generated: executive desk scene
  - `hf-card-macro.png` — Higgsfield generated: card macro (mosaic cover)
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

## Interactive Elements — Button & Link Hover Rule

Every clickable text element (nav buttons, contact button, modal close `( x )`, email/instagram links, filter buttons, footer links, project meta links, and all future buttons/links) uses a single unified hover pattern:

- **Hover state:** `background: var(--ink); color: var(--paper)` — dark ink fill behind the text, light paper text
- **Box coverage:** the dark box covers only the text's own width and height (like a text selection). Achieve this by keeping the element `inline-block` or, in flex containers, using `align-items: flex-start` on the parent so items don't stretch to a shared width
- **Transition:** `transition: background 0.12s, color 0.12s` on the base element
- **Pseudo-elements** (`::before`, `::after`) that carry decorative characters (parentheses, arrows) must use `color: inherit` so they flip together with the text on hover
- **No wiggle animation** — the `.text-hover` / `chJitter` wiggle effect has been retired. Do not add `.text-hover` class to any element
- **Active/selected states** (e.g. active filter) use `color: var(--ink)` only — no background fill — to distinguish selection from hover

Apply this pattern to every new interactive text element. Reference `.home-logo`, `.home-nav a/button`, `.home-contact`, `.modal-close`, `.filter-btn`, `.footer-link`, `.project-meta-link`, `.modal-inner p a` in `css/style.css` as canonical examples.

## Project Modal Layout Rules

All project pages are implemented as modals in `index.html`, not as separate navigable pages. Each project modal follows this exact structure:

### Structure
```html
<div id="modal-[project]" class="modal-panel modal-project" role="dialog" aria-hidden="true" data-centered="true">
  <button class="modal-close" data-close="modal-[project]">( x )</button>
  <span class="modal-bal">( ... )</span>
  <div class="modal-proj-scroll">
    <!-- Box 1: Info -->
    <div class="modal-inner">
      <p class="modal-proj-title">&lt;project name&gt;</p>
      <p class="modal-proj-desc">project description text here.</p>
    </div>
    <!-- Box 2: Gallery -->
    <div class="modal-inner">
      <p class="modal-proj-marker">&gt;</p>
      <div class="modal-proj-mosaic">
        <!-- images here -->
      </div>
    </div>
  </div>
</div>
```

### Layout rules
- **No hero image** — projects open directly into the two-box layout
- **Two separate white boxes** inside a scrollable container — the `--paper-2` chrome shows as an `0.5rem` gap between them
- **Box 1 — Info:** project title (`.modal-proj-title`) with `2.5rem` margin-bottom, then description in smaller text (`.modal-proj-desc`: 14px, weight 400)
- **Box 2 — Gallery:** `>` marker (`.modal-proj-marker`) with `2.5rem` margin-bottom, then images in a 2-column grid (`.modal-proj-mosaic`)
- **Images:** full natural height (`width: 100%; height: auto`), never cropped, never forced aspect-ratio
- **Scroll:** only the two white boxes scroll (`modal-proj-scroll`); the `( x )` chrome stays fixed at the top
- **Width:** `min(820px, 92vw)`; **max-height:** `88vh`

### Triggering the modal
Wire up every entry point that would normally link to the project page:
1. **Home project list item** — add `data-modal="modal-[project]"` to the `<li>`; the inline click handler already skips navigation when `data-modal` is present
2. **Archive modal card** — add `data-modal="modal-[project]"` to the `<a>` (keep `href` for fallback); `e.preventDefault()` in the `[data-modal]` handler stops navigation
3. **Preview image link** — already handled: clicks open the modal if the active list item has `data-modal`

### CSS classes (defined in `css/style.css`)
- `.modal-project` — width/max-height for all project modals
- `.modal-proj-scroll` — flex column scroll container, gap between boxes
- `.modal-inner .modal-proj-title` — title spacing
- `.modal-inner .modal-proj-desc` — smaller description text
- `.modal-inner .modal-proj-marker` — `>` spacing before mosaic
- `.modal-proj-mosaic` — 2-col image grid

## Project Page Gallery Rules
When building project page mosaics:
1. **Never crop images** — always release forced `aspect-ratio` on mosaic items and set `height: auto; object-fit: fill` on images so the full image height flows naturally.
2. **Always top-align images** — set `object-position: top` on all mosaic `img` and `video` elements. If two images in the same row have different heights, any leftover empty space falls to the bottom of the shorter item, never to the top.
3. These two rules apply in the per-page `<style>` block override AND are now the default in `css/style.css` (`object-position: top` on `.project-mosaic-item img, video`).

## AI Image Generation Rules
When generating images for any project:
1. Always read the brand reference images in `assets/perproject/[project]/` before writing prompts
2. Always read the website copy from this file for the relevant project
3. Upload brand mark reference images to Higgsfield as `image` role media inputs
4. Be hyper-specific about circle/shape counts — never assume, always state the exact number
5. Use `flux_2` model (defaults to `pro`) at `resolution: 2k` for static images

## Token Usage
Announce token usage at every 10% milestone proactively (60%, 70%, 80%, 90%).
Format: _(~XX% of context used)_ as a short inline note.
