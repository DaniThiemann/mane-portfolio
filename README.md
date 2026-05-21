# Portfolio — File Structure & How to Use

## Folder layout

```
my-portfolio/
├── index.html              ← Homepage (selected works mosaic)
├── work.html               ← Full archive (2-column grid, all projects)
├── projects/
│   ├── template.html       ← Master template — duplicate this for new projects
│   └── project-01.html     ← Example project page
├── css/
│   └── style.css           ← All styles, shared across every page
├── js/
│   └── main.js             ← All scripts (cursor, scroll, filters)
└── assets/
    ├── images/             ← Drop your project images here
    └── videos/             ← Drop your videos here
```

---

## How to add a new project

1. **Duplicate** `projects/template.html`
2. **Rename** it (e.g. `project-09.html`)
3. **Open the file** and edit:
   - The `<title>` tag at the top
   - The cover image — change the background in the `.project-cover` div  
     Example: `style="background: url('../assets/images/my-cover.jpg') center/cover;"`
   - The title and year in `.project-caption`
   - The "Next Project" link at the bottom
4. **Add the project to the homepage and archive:**
   - In `index.html` → add a new `<a>` card in the mosaic (if it's a selected work)
   - In `work.html` → add a new `<a>` card in the archive grid

---

## How to preview locally

Just **double-click `index.html`** — it opens in your browser. No server needed.

(For a slightly nicer dev experience, you can use VS Code's "Live Server" extension, but it's optional.)

---

## How to upload to the web

When ready to publish:

1. **Free option:** drag the entire `my-portfolio` folder onto [Netlify Drop](https://app.netlify.com/drop) — instant live site
2. **Or:** push to GitHub and connect to Netlify/Vercel for automatic deploys

---

## What's where

- **Change colors / fonts / spacing** → `css/style.css` (top of file: `:root` block)
- **Change cursor / animation behavior** → `js/main.js`
- **Change menu links / footer text** → edit each HTML file (or, later, automate with a build tool)
