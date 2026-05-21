# Design System

> Single source of truth for the portfolio site.
> Aesthetic reference: printed assessment forms, risograph zines, typewriter receipts.
> Every value below maps to a CSS variable or class in `css/style.css`.

---

## 0. Aesthetic Principles

1. **Printed, not digital.** The site should feel like a photocopied form, not a designer template. Hairline rules, dashed lines, ink bleed, off-axis layout.
2. **Type is hierarchy.** Bold black Helvetica = display. Courier Prime = data, meta, structural text. No decorative typefaces.
3. **Tiny is fine.** Body sits at 10–11px. Meta at 9px. Designed for close reading, not scanning.
4. **Off-grid by intent.** Cards are positioned with deliberate vertical and horizontal asymmetry. Nothing locks to a perfect grid.
5. **Ink bleed is a texture.** A subtle multi-direction text-shadow simulates the imperfection of risograph or photocopy printing on bold display text.
6. **Grayscale only.** No accent colors. The work itself is the color.

---

## 1. Colors

| Token       | Hex       | Use                                          | CSS variable    |
|-------------|-----------|----------------------------------------------|-----------------|
| Paper       | `#F4F1EC` | Page background — slightly warm off-white    | `--paper`       |
| Paper-2     | `#ECE8E1` | Card / placeholder backgrounds               | `--paper-2`     |
| Ink         | `#0A0A0A` | Primary type, display text (with bleed)      | `--ink`         |
| Ink-soft    | `#1A1A1A` | Body copy                                    | `--ink-soft`    |
| Ink-mid     | `#555555` | Meta labels, secondary text                  | `--ink-mid`     |
| Rule        | `#D5D1C8` | Solid hairline dividers                      | `--rule`        |
| Dash        | `#888888` | Dashed-line dividers (form-field style)      | `--dash`        |

**Card placeholder tones:** `--tone-1` to `--tone-5` (close-range warm grays).

---

## 2. Typography

### Two typefaces, no exceptions.

#### Helvetica Neue (system stack)
Used for: display headlines, project titles, bold labels, body copy.
- Body weight: `400`
- Display weight: `700` + ink-bleed text-shadow
- Letter-spacing: tightly negative (`-0.005em` to `-0.015em`)

#### Courier Prime (Google Fonts)
Used for: meta data, navigation, footer, numerals, labels, dashed-field text — everything that should feel "typed".
- Single weight: `400` (occasionally `700`)
- No letter-spacing adjustment
- Frequently wrapped in `( parentheses )` to reinforce the form aesthetic

### Type Scale

| Role                | Size     | Weight | Family    | Notes                     |
|---------------------|----------|--------|-----------|---------------------------|
| Hero title          | clamp(1.8 → 3rem) | 700 | Helvetica | UPPERCASE, ink bleed      |
| Project title       | clamp(1.4 → 2rem) | 700 | Helvetica | UPPERCASE, ink bleed      |
| Archive title       | clamp(1.6 → 2.4rem)| 700| Helvetica | UPPERCASE, ink bleed      |
| Logo (N/S)          | 14px     | 700    | Helvetica | UPPERCASE, ink bleed      |
| Section / block label | 11px   | 700    | Helvetica | lowercase                 |
| Project description | 11px     | 400    | Helvetica | line-height 1.7           |
| Body / about text   | 10px     | 400    | Helvetica | line-height 1.7           |
| Service description | 10px     | 400    | Helvetica | line-height 1.65          |
| Card title          | 12px     | 700    | Helvetica | UPPERCASE                 |
| Service name        | 11px     | 700    | Helvetica | UPPERCASE                 |
| Hero field label    | 10px     | 700    | Helvetica | UPPERCASE                 |
| Stat number         | 1.4rem   | 400    | Courier   | mono digits               |
| Hero field value    | 11px     | 400    | Courier   | dashed underline          |
| Menu link           | 10px     | 400    | Courier   | UPPERCASE                 |
| Filter button       | 10px     | 400    | Courier   | wrapped in `( )`          |
| Project meta row    | 9px      | 400    | Courier   | UPPERCASE, dashed value   |
| Card category       | 9px      | 400    | Courier   | UPPERCASE, white on hover |
| Card number         | 9px      | 400    | Courier   | wrapped in `( )`          |
| Footer              | 9px      | 400    | Courier   | UPPERCASE                 |

### Ink-Bleed Effect

Reusable as the `.ink-bleed` class — applied automatically to display text:

```css
text-shadow:
  0.4px 0 0 var(--ink),
  -0.4px 0 0 var(--ink),
  0 0.4px 0 var(--ink),
  0 -0.4px 0 var(--ink),
  0.5px 0.5px 0.6px rgba(0,0,0,0.18);
```

The multi-direction shadow simulates ink swelling outward from a letter on absorbent paper.

---

## 3. Spacing

| Context                          | Value     |
|----------------------------------|-----------|
| Page horizontal padding          | `1.8rem`  |
| Section vertical padding         | `3rem`    |
| Hero top padding                 | `5.5rem`  |
| Section header padding           | `1.2rem 1.8rem` |
| Card inner padding               | `0.9rem 1rem` |
| Project info padding             | `2.5rem 1.8rem 6rem` (extra bottom for meta) |
| Project gallery padding          | `2rem 1.8rem 3rem` |
| Footer padding                   | `1.2rem 1.8rem 1.8rem` |
| Floating element offset          | `1.6rem / 1.8rem` |

**Mobile breakpoint adjustment:** all `1.8rem` horizontals become `1.2rem` below 860px.

---

## 4. Layout & Grid

### Page width
- **Full bleed.** No max-width container.
- All structure handled internally via grid + absolute positioning.

### Grids in use

| Grid                  | Type                                | Where             |
|-----------------------|-------------------------------------|-------------------|
| Hero                  | `1.2fr 1fr` (asymmetric 2-col)      | Homepage top      |
| Selected work mosaic  | **absolute positioning** (off-grid) | Homepage          |
| Archive grid          | `1fr 1fr` + per-row Y offset        | Work page         |
| Stats row             | `repeat(3, 1fr)` + dashed top rule  | About             |
| Services grid         | `repeat(3, 1fr)` + per-item offset  | Services          |
| Project meta          | absolute, bottom-right corner       | Project pages     |
| Project gallery       | `1fr 1fr` + alternating Y offsets   | Project pages     |

### Off-grid mechanics

- **Homepage mosaic** uses absolute positioning. Each card has unique `top` / `left` / `width` / `height`. No two cards align horizontally.
- **Archive grid** stays in 2 columns but applies `translateY(0/14/28/40px)` per row to break the grid's perfect rhythm.
- **Services and project gallery** use `nth-child` translate offsets for the same purpose.

### Borders
- **Solid `--rule`** under section headers and gallery bars.
- **Dashed `--dash`** between sections, around fields, and underneath form-style values.
- Never both at once.

---

## 5. Components

### `.menu-collapse` — top-left scroll-aware navigation
Wraps the menu list. Behavior driven by JS in `main.js`:
- **Default (top of page):** full vertical list of links, like a form's label column. Active page link gets a `›` prefix.
- **After scrolling >100px:** collapses into a single rolling label showing only the current section (e.g. `› work`).
- **On hover (collapsed):** full list smoothly returns.
- **Section change:** as the user scrolls between sections (Hero/Work/About/Services/Contact), the label rolls vertically like a cylinder using a 0.55s cubic-bezier transition.

### `.menu-roller` & `.menu-roller-track`
Built dynamically by `main.js` from the menu links. The track is a stacked column of labels; only one is visible through a 14px-tall window. Translating the track by `-N * 14px` reveals the Nth label.

### `.float-logo` — top-right mark
Bold "N/S" with ink bleed. Acts as the home link.

### `.float-status` — bottom-left status
Mono uppercase, prefixed with `( )` like a checkbox.

### `.hero-fields` — form-style intro block
Right side of the homepage hero. Each row is a `LABEL` + dashed-underline value, mimicking a paper form's name/date fields.

### `.section-header` — bar above project listings
Left side: lowercase label + count in `[ 08 ]`. Right side: filter buttons or "view all".

### `.filter-btn` — filter chip
Mono uppercase wrapped in parentheses: `(branding)`. Active state turns ink-black.

### `.project-card` — universal card
Used in both mosaic and archive. Hover behavior:
- Image scales `1.04` over `0.6s`
- Black overlay fades to `0.55` opacity
- Title + category fade up from below
- Number badge fades faintly visible

### `.mosaic` — homepage off-grid layout
Container with absolute-positioned cards. Each `nth-child` has unique coordinates.

### `.archive-grid` — work page 2-column
2 equal columns with per-row vertical translate offsets to prevent perfect alignment.

### `.stats-row` — 3 stats with mono digits
Numbers in Courier, labels in mono uppercase. Sits under a dashed top rule.

### `.service-item` — service block
Number `(01)` + UPPERCASE name + small description. Each item nudged vertically off the others.

### `.project-hero` — full viewport image/video
100vh tall. Supports `<img>` or `<video>` with `object-fit: cover`.

### `.project-info` — title, description, discrete meta
Title and description on the left. Meta sits absolutely positioned in the **bottom-right corner**, in tiny mono with dashed-underline values.

### `.project-meta` — bottom-right meta block
Stack of `LABEL: VALUE` rows. Labels in mid-gray, values in ink with dashed underline. 9px Courier.

### `.project-mosaic` — 2-column gallery on project pages
Standard items 4:3. Modifiers:
- `.full-width` → spans both columns at 16:9
- `.tall` → 3:4 vertical
Off-axis vertical translate on every 2nd and 3rd item.

### `.project-nav` — prev / next at bottom
2-column block. Hover tints the cell with `--paper-2` background.

---

## 6. Animation & Interaction

### Custom cursor (`#cur`)
- Default: 7px solid ink dot
- On hover: expands to 36px hollow ink circle
- Transition: 0.22s

### Card hover
- Image scale: `1` → `1.04` over 0.6s
- Overlay opacity: `0` → `0.55` over 0.32s
- Info reveal: opacity + 4px translateY in 0.28s

### Scroll reveal (`.reveal`)
- Initial: opacity 0, translateY 12px
- End: opacity 1, translateY 0
- Duration: 0.55s
- IntersectionObserver at 10% threshold

### Filter buttons
- Default: `--ink-mid`
- Hover / active: `--ink`
- Transition: 0.18s

### Typewriter on load (`.type`)
Any element with class `.type` gets typed out character-by-character on page load.
- Source text comes from `data-text` attribute (auto-set from initial textContent if missing)
- Speed: ~22ms/char + small jitter for natural feel
- A blinking caret `_` sits at the end during typing; removed when finished (`.typed` class added)
- Multiple `.type` elements run **in sequence** (not in parallel) so the page assembles like a typewriter from top to bottom

### Text hover wiggle (`.text-hover`)
Each character of a `.text-hover` element jitters subtly upward then back when the element is hovered.
- Each char is auto-wrapped in a `<span class="ch">` by JS on page load
- Animation cascades left-to-right with 25ms stagger between chars
- Single keyframe `chJitter`: 0 → -2px → 0.5px → 0 over 0.6s
- Used on labels, service names, contact email, and any text that should feel "alive"

---

## 7. Responsive Behavior

**Breakpoint:** `860px`

Below 860px:
- Hero collapses to single column
- Mosaic abandons absolute positioning → flex column with 200px-tall cards
- Archive grid becomes single column, removes Y-offsets
- Service cards lose vertical offsets
- Project gallery becomes single column
- Filter row hides
- Floating elements move closer to edges (`1.2rem`)
- Page horizontal padding shrinks to `1.2rem`

---

## 8. File Structure

```
my-portfolio/
├── index.html              ← Homepage
├── work.html               ← Full archive (2-col, off-axis)
├── projects/
│   ├── template.html       ← Master — duplicate for new projects
│   └── project-XX.html     ← One file per project
├── css/style.css           ← All styles, source of truth
├── js/main.js              ← Cursor, reveal, filters
├── assets/
│   ├── images/
│   └── videos/
├── README.md               ← How to use the project
└── DESIGN_SYSTEM.md        ← This file
```

---

## 9. How to Make Global Changes

| Want to change…                     | Edit this                                |
|-------------------------------------|------------------------------------------|
| All colors                          | `css/style.css` → `:root` block          |
| Body / display font                 | `css/style.css` → `body` selector        |
| Mono font (data, labels)            | All HTML `<head>` (Google Fonts link)    |
| Ink bleed strength                  | `css/style.css` → search `text-shadow`   |
| Cursor size                         | `css/style.css` → `#cur`                 |
| Card hover intensity                | `css/style.css` → `.project-card:hover`  |
| Mosaic layout (homepage)            | `css/style.css` → `.mosaic .project-card:nth-child(N)` |
| Archive Y-offset rhythm             | `css/style.css` → `.archive-grid .project-card:nth-child(4n+N)` |
| Mobile breakpoint                   | `css/style.css` → `@media (max-width: 860px)` |
| Project meta corner position        | `css/style.css` → `.project-meta`        |

---

## 10. Adding New Pages

1. Start from any existing HTML file as a base.
2. Always include:
   - `<div id="cur">` cursor element
   - `.float-menu`, `.float-logo`, `.float-status` floating corners
   - The Courier Prime Google Fonts link in `<head>`
   - `<footer>` at the bottom
3. Link to the same `css/style.css` and `js/main.js`.
4. Mark the matching menu link with `class="active"`.
5. Build content using **only existing tokens and components**.

If a new pattern is genuinely needed: add it to this doc first → then to the CSS → then use it.

---

## 11. Page Inventory

| Page              | File                       | Status     |
|-------------------|----------------------------|------------|
| Homepage          | `index.html`               | ✅ Built   |
| Work archive      | `work.html`                | ✅ Built   |
| Project page      | `projects/template.html`   | ✅ Built (hero + info + gallery) |
| Standalone About  | `about.html`               | ⬜ Not built |
| Standalone Contact| `contact.html`             | ⬜ Not built |
| Dashboard         | `admin/`                   | ⬜ Not built |
