# mane-portfolio

Static one-page graphic design portfolio. No framework, no build step, no
server — `index.html` is the whole site. Every project opens as a draggable
modal on that page.

## Structure

```
index.html          ← the entire site: home, archive, curriculum, project modals
css/style.css       ← design system — all styles live here
js/main.js          ← modal system, cursor, scroll reveal, filters
js/gsap.min.js      ← used only by the f. maeda logo animation

assets/             ← PUBLISHED — web-ready, committed, deployed
├── site/
│   ├── favicon/favicon-dark.png, favicon-white.png
│   └── portrait.png
└── projects/<slug>/
    ├── preview.png     ← homepage hover image
    ├── cover.jpg       ← archive card thumbnail
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
