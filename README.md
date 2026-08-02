# mane-portfolio

Static one-page graphic design portfolio — magazine/poster layout. No
framework, no build step, no server — `index.html` is the whole site: header
bar, one highlighted project, a cover grid of the rest, footer bar. Every
project opens as a draggable modal on that page.

## Structure

```
index.html          ← the entire site: header, highlight, cover grid, footer, all modals
css/style.css       ← design system — all styles live here
js/main.js          ← modal system, cursor, f. maeda cover animation
js/gsap.min.js      ← used only by the f. maeda logo animation

assets/             ← PUBLISHED — web-ready, committed, deployed
├── site/
│   ├── favicon/favicon-dark.png, favicon-white.png
│   └── portrait.png
└── projects/<slug>/
    ├── cover.jpg       ← homepage cover / modal hero
    └── gallery/01.jpg… ← modal gallery, in display order

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

No server needed — open `index.html` in a browser.

If you want proper paths (recommended, matches production):

```bash
python -m http.server 8000
```

→ http://localhost:8000/

## Adding or editing a project

Edit `content/projects/<slug>/project.md`, drop media in `inbox/`, and ask
Claude to publish it. Published images are resized to 2000px and compressed;
originals stay in `source/`.

## Deployment

Static hosting on Netlify from `main`. Everything in the repo root is the
site — `content/` and `MOCKUPS/` are gitignored and never deployed.

## Conventions

- All styles go in `css/style.css` — never inline, except JS-set values
- Published filenames are lowercase ASCII, no spaces or accents
  (hosting is case-sensitive; `Vector.svg` and `vector.svg` are different files)
- One slug per project, used for the folder name and the modal id
