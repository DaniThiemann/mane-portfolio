# mane-portfolio

Static HTML/CSS/JS graphic design portfolio with a local Node/Express admin dashboard.

## Structure

```
portfolio/
├── index.html              ← Site entry point — mosaic, all modals (archive, curriculum, projects)
├── projects/               ← Hand-crafted project pages (brunge, nextplay, fmaeda-keiei, zhive)
├── css/style.css           ← Single design system — all styles live here
├── js/main.js              ← All scripts (modal system, cursor, scroll, filters)
├── assets/
│   ├── favicon/            ← FavIconDark.png / FavIconWhite.png
│   ├── perproject/         ← Per-project images and videos
│   └── references/         ← Reference docs and source PDFs
├── admin/index.html        ← Local admin dashboard UI
└── server.js               ← Local admin server (Node/Express + multer)
```

## Running locally

```bash
node server.js
```

- Portfolio → http://localhost:3000/
- Admin dashboard → http://localhost:3000/admin/

## Adding / editing projects

Use the admin dashboard at `/admin/`. It handles:
- Adding new projects (uploads assets, writes the project page, updates the homepage mosaic)
- Editing existing projects
- Toggling online/offline status
- Reordering the homepage mosaic

## Stack

- Plain HTML, CSS, vanilla JS — no framework
- Node.js + Express + multer for the local admin only
- Fonts: Inter (UI), Courier Prime (display)
- Hosted as a static site (Netlify)
