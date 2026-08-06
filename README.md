# mane-portfolio

Static one-page graphic design portfolio. No framework, no build step, no
server — `index.html` is the whole site: header bar, a two-column grid of
equally sized project covers, footer bar. Every project opens as a draggable
modal on that page.

## Structure

```
index.html          ← the entire site: header, cover grid, footer, all modals
css/style.css       ← design system — all styles live here
js/main.js          ← modal system, cursor, hover-play cover, footer count

assets/             ← PUBLISHED — web-ready, committed, deployed
├── site/
│   ├── favicon/favicon-dark.png, favicon-white.png
│   └── portrait.png
└── projects/<slug>/
    ├── cover.jpg       ← homepage cover (443:346)
    │                     z-hive also has cover.mp4 — a hover-played animation,
    │                     with cover.jpg as its final-frame poster
    └── gallery/01…     ← modal gallery, SQUARE, in display order
                          .jpg, .mp4 and animated .svg all supported

content/            ← AUTHORING — source media and copy, gitignored, local only
└── projects/<slug>/
    ├── project.md      ← the words
    ├── inbox/          ← drop new files here
    ├── source/         ← full-quality originals
    └── notes/          ← briefs, prompts, references
```

The split is the whole point: `assets/` holds only what ships, at web weight,
under predictable names. `content/` holds everything else. See
`content/README.md` for the day-to-day workflow.

## Running locally

Use a static server that sends **no-cache** headers and supports **HTTP Range**.
Plain `python -m http.server` does neither, and both failures are silent:
stale CSS hides your changes, and no Range means `<video>` cannot seek, which
breaks the z-hive cover's rest-on-last-frame. Netlify does both correctly, so
these are local-only traps.

A suitable dev server lives in `tools/devserver.py`:

```bash
python tools/devserver.py     # → http://localhost:8000/
```

## Adding or editing a project

Edit `content/projects/<slug>/project.md`, drop media in `inbox/`, and ask
Claude to publish it. Published images are resized to 2000px and compressed;
originals stay in `source/`.

**Gallery images must be square** — the modal grid uses 1:1 slots so the rows
line up. Supply squares and nothing gets cropped.

## Deployment

Static hosting on Netlify from `main`. Everything in the repo root is the
site — `content/`, `temporary/` and `MOCKUPS/` are gitignored and never deployed.

## Conventions

- All styles go in `css/style.css` — never inline, except JS-set values
- Published filenames are lowercase ASCII, no spaces or accents
  (hosting is case-sensitive; `Vector.svg` and `vector.svg` are different files)
- One slug per project, used for the folder name and the modal id
