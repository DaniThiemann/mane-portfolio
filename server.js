// ─────────────────────────────────────────────────────
//  PORTFOLIO LOCAL SERVER
//  Run: node server.js
//  Portfolio → http://localhost:3000/
//  Dashboard → http://localhost:3000/admin/
// ─────────────────────────────────────────────────────
const express = require('express');
const multer  = require('multer');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3000;
const ROOT = __dirname;
const PROJECTS_FILE = path.join(ROOT, 'projects.json');

// Mosaic position metadata (based on CSS nth-child rules)
const MOSAIC_META = {
  1: { label: 'Top left (large)',      rec: '900×600px',  ratio: '3:2',  cssWidth: '38%', cssHeight: '360px' },
  2: { label: 'Top right',             rec: '800×500px',  ratio: '16:10',cssWidth: '32%', cssHeight: '280px' },
  3: { label: 'Mid left (small)',      rec: '800×480px',  ratio: '5:3',  cssWidth: '26%', cssHeight: '220px' },
  4: { label: 'Mid center',            rec: '800×600px',  ratio: '4:3',  cssWidth: '30%', cssHeight: '320px' },
  5: { label: 'Mid right (narrow)',    rec: '600×560px',  ratio: '1:1',  cssWidth: '18%', cssHeight: '240px' },
  6: { label: 'Lower left',            rec: '640×560px',  ratio: '8:7',  cssWidth: '22%', cssHeight: '280px' },
  7: { label: 'Lower center (wide)',   rec: '1000×510px', ratio: '2:1',  cssWidth: '36%', cssHeight: '260px' },
  8: { label: 'Lower right',           rec: '600×580px',  ratio: '1:1',  cssWidth: '24%', cssHeight: '320px' }
};

// ── Middleware ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(ROOT));

// ── Data helpers ──────────────────────────────────────
function loadProjects() {
  try { return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8')); }
  catch { return { projects: [] }; }
}
function saveProjects(data) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}
function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

// ── HTML card generators ──────────────────────────────
function mosaicCard(project, pos) {
  const tone = `t${((pos - 1) % 5) + 1}`;
  const num  = String(pos).padStart(2, '0');
  const media = thumbMedia(project.mosaicImage, project.title);
  return `      <a href="projects/${project.id}.html" class="project-card">
        <div class="card-thumb ${tone}">${media}</div>
        <div class="card-overlay"></div>
        <span class="card-num">${num}</span>
        <div class="card-info">
          <p class="card-cat">${escHtml(project.category)}</p>
          <h3 class="card-title">${escHtml(project.title)}</h3>
        </div>
      </a>`;
}
function placeholderCard(pos) {
  const tone = `t${((pos - 1) % 5) + 1}`;
  const num  = String(pos).padStart(2, '0');
  return `      <a href="#" class="project-card" style="pointer-events:none;opacity:0.28;">
        <div class="card-thumb ${tone}"></div>
        <div class="card-overlay"></div>
        <span class="card-num">${num}</span>
        <div class="card-info"><p class="card-cat">—</p><h3 class="card-title">—</h3></div>
      </a>`;
}
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function isVideo(filepath) {
  return /\.(mp4|webm|mov|ogg)$/i.test(filepath || '');
}
function thumbMedia(src, alt) {
  if (!src) return '';
  return isVideo(src)
    ? `<video autoplay muted loop playsinline src="${src}"></video>`
    : `<img src="${src}" alt="${escHtml(alt)}">`;
}

// ── Gallery layout engine ─────────────────────────────
// Groups items into rows; the taller proportion dominates each row so
// heights are always uniform (tall 3:4 wins over standard 4:3).
function makeGalleryItem(item, cssClass, project) {
  const cls = cssClass ? `project-mosaic-item ${cssClass}` : 'project-mosaic-item';
  const src = `../${item.file}`;
  const media = isVideo(src)
    ? `<video autoplay muted loop playsinline src="${src}"></video>`
    : `<img src="${src}" alt="${escHtml(project.title)} — ${escHtml(item.caption)}">`;
  return `      <div class="${cls}">\n        ${media}\n      </div>`;
}

function buildGalleryHtml(project) {
  const items = project.gallery || [];
  const parts = [];
  let i = 0;

  while (i < items.length) {
    const a = items[i];

    if (a.layout === 'full-width') {
      parts.push(makeGalleryItem(a, 'full-width', project));
      i++;
      continue;
    }

    const b = (i + 1 < items.length && items[i + 1].layout !== 'full-width')
      ? items[i + 1] : null;

    if (b) {
      // Taller proportion dominates — tall (3:4) beats standard (4:3)
      const rowClass = (a.layout === 'tall' || b.layout === 'tall') ? 'tall' : '';
      parts.push(makeGalleryItem(a, rowClass, project));
      parts.push(makeGalleryItem(b, rowClass, project));
      i += 2;
    } else {
      const cls = a.layout === 'tall' ? 'tall' : '';
      parts.push(makeGalleryItem(a, cls, project));
      i++;
    }
  }

  return parts.join('\n');
}

// ── Project page generator ────────────────────────────
function generateProjectPage(project) {
  const galleryHtml = buildGalleryHtml(project);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(project.title)} — Name Surname</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body>
  <div id="cur"></div>
  <div class="menu-collapse">
    <nav class="menu-list">
      <a href="../index.html">Index</a>
      <a href="../index.html">Archive</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#services">Services</a>
      <a href="../index.html#contact">Contact</a>
    </nav>
  </div>
  <a href="../index.html" class="float-logo">N/S</a>
  <span class="float-status">Available for projects</span>
  <main class="project-page">
    <section class="project-hero">
      <img src="../${escHtml(project.hero)}" alt="${escHtml(project.title)}">
    </section>
    <section class="project-info">
      <h1 class="project-title type" data-text="${escHtml(project.title)}">${escHtml(project.title)}</h1>
      <p class="project-description reveal">${escHtml(project.description)}</p>
      <div class="project-meta">
        <div class="project-meta-row reveal">
          <span class="project-meta-label">client</span>
          <span class="project-meta-value">${escHtml(project.client)}</span>
        </div>
        <div class="project-meta-row reveal">
          <span class="project-meta-label">year</span>
          <span class="project-meta-value">${escHtml(String(project.year))}</span>
        </div>
        <div class="project-meta-row reveal">
          <span class="project-meta-label">category</span>
          <span class="project-meta-value">${escHtml(project.category)}</span>
        </div>
        <div class="project-meta-row reveal">
          <span class="project-meta-label">role</span>
          <span class="project-meta-value">${escHtml(project.role)}</span>
        </div>
        ${project.website ? `
        <div class="project-meta-row reveal">
          <span class="project-meta-label">website</span>
          <span class="project-meta-value"><a href="${escHtml(project.website)}" target="_blank" rel="noopener">${escHtml(project.website)}</a></span>
        </div>` : ''}
      </div>
    </section>
    <div class="project-gallery-bar text-hover">gallery</div>
    <section class="project-mosaic">
${galleryHtml}
    </section>
    <nav class="project-nav">
      <a href="../index.html">[← all work]</a>
    </nav>
  </main>
  <footer>
    <span class="footer-copy">© ${new Date().getFullYear()} N/S</span>
    <a href="../index.html" class="footer-link">[top ↑]</a>
  </footer>
  <script src="../js/main.js"></script>
</body>
</html>`;
}

// ── HTML section updaters ─────────────────────────────
function rebuildIndexMosaic(projects) {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  const byPos = {};
  projects.filter(p => p.status === 'online' && p.mosaicPosition)
          .forEach(p => { byPos[p.mosaicPosition] = p; });

  const cards = [];
  for (let i = 1; i <= 8; i++) {
    cards.push(byPos[i] ? mosaicCard(byPos[i], i) : placeholderCard(i));
  }

  const realCount = Object.keys(byPos).length;
  const countStr  = `[ ${String(realCount).padStart(2, '0')} ]`;

  html = html.replace(
    /<!-- MOSAIC_START -->[\s\S]*?<!-- MOSAIC_END -->/,
    `<!-- MOSAIC_START -->\n${cards.join('\n')}\n      <!-- MOSAIC_END -->`
  );
  html = html.replace(/<span class="section-count">\[.*?\]<\/span>/, `<span class="section-count">${countStr}</span>`);

  fs.writeFileSync(indexPath, html, 'utf8');
}

// ── Multer (file uploads) ─────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const slug = req.body.slug || 'temp';
    const dir  = path.join(ROOT, 'assets', 'perproject', slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    // multer receives filenames as latin1; re-interpret as utf-8
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, name);
  }
});
const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'heroImage',     maxCount: 1  },
  { name: 'mosaicImage',   maxCount: 1  },
  { name: 'galleryImages', maxCount: 30 }
]);

// ── API: pages ────────────────────────────────────────
app.get('/api/pages', (req, res) => {
  const data = loadProjects();
  const byId = {};
  data.projects.forEach(p => { byId[p.id] = p; });

  const pages = [];

  // Root pages
  for (const file of ['index.html']) {
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    const src   = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const title = (src.match(/<title>(.*?)<\/title>/) || [])[1] || file;
    pages.push({ file, url: `/${file}`, title, status: 'online', type: 'page' });
  }

  // Project pages
  const projDir = path.join(ROOT, 'projects');
  if (fs.existsSync(projDir)) {
    const skip = new Set(['template.html', 'project-01.html']);
    fs.readdirSync(projDir)
      .filter(f => f.endsWith('.html') && !skip.has(f))
      .sort()
      .forEach(file => {
        const id = file.replace('.html', '');
        const p  = byId[id];
        pages.push({
          file: `projects/${file}`,
          url:  `/projects/${file}`,
          title:          p?.title    || id,
          category:       p?.category || '—',
          status:         p?.status   || 'online',
          mosaicPosition: p?.mosaicPosition ?? null,
          id,
          type: 'project'
        });
      });
  }

  res.json(pages);
});

// ── API: projects ─────────────────────────────────────
app.get('/api/projects', (req, res) => res.json(loadProjects()));
app.get('/api/mosaic-meta', (req, res) => res.json(MOSAIC_META));

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const data = loadProjects();
  const p    = data.projects.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Toggle status
app.patch('/api/projects/:id/status', (req, res) => {
  const data = loadProjects();
  const p    = data.projects.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.status = req.body.status === 'online' ? 'online' : 'offline';
  saveProjects(data);
  rebuildIndexMosaic(data.projects);
  res.json({ ok: true, status: p.status });
});

// Add project
app.post('/api/projects', uploadFields, (req, res) => {
  try {
    const { title, client, year, category, role, website, description,
            mosaicPosition, conflictAction, swapTarget, status } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required.' });

    const id   = slugify(title);
    const data = loadProjects();
    const pos  = parseInt(mosaicPosition) || null;

    // Conflict handling
    if (pos) {
      const conflict = data.projects.find(p => p.mosaicPosition === pos && p.status === 'online');
      if (conflict) {
        if (conflictAction === 'replace') {
          conflict.mosaicPosition = null;
        } else if (conflictAction === 'swap' && swapTarget) {
          conflict.mosaicPosition = parseInt(swapTarget);
        } else if (!conflictAction) {
          // Return conflict info so the client can ask
          return res.status(409).json({
            conflict: true,
            existingId:    conflict.id,
            existingTitle: conflict.title,
            position: pos
          });
        }
      }
    }

    // Build file paths
    const assetBase = `assets/perproject/${id}`;
    const heroFile    = (req.files?.heroImage    || [])[0];
    const mosaicFile  = (req.files?.mosaicImage  || [])[0];
    const galleryFiles = req.files?.galleryImages || [];

    const hero         = heroFile   ? `${assetBase}/${heroFile.originalname}`  : '';
    const mosaicImage  = mosaicFile ? `${assetBase}/${mosaicFile.originalname}` : hero;

    let layouts  = [];
    let captions = [];
    try { layouts  = JSON.parse(req.body.galleryLayouts  || '[]'); } catch {}
    try { captions = JSON.parse(req.body.galleryCaptions || '[]'); } catch {}

    const gallery = galleryFiles.map((f, i) => ({
      file:    `${assetBase}/${f.originalname}`,
      caption: captions[i] || '',
      layout:  layouts[i]  || 'standard'
    }));

    const project = {
      id, title, client,
      year:     parseInt(year) || new Date().getFullYear(),
      category, role, website: website || '',
      description,
      status:         status === 'offline' ? 'offline' : 'online',
      mosaicPosition: pos,
      mosaicImage,
      hero,
      gallery,
      created: new Date().toISOString().split('T')[0]
    };

    data.projects.push(project);
    saveProjects(data);

    // Write project HTML page
    fs.writeFileSync(
      path.join(ROOT, 'projects', `${id}.html`),
      generateProjectPage(project),
      'utf8'
    );

    rebuildIndexMosaic(data.projects);

    const heicFiles = [
      ...(req.files?.heroImage    || []),
      ...(req.files?.mosaicImage  || []),
      ...(req.files?.galleryImages || [])
    ].filter(f => /\.(heic|heif)$/i.test(f.originalname || '')).map(f => f.originalname);

    res.json({ ok: true, id, url: `/projects/${id}.html`, heicWarning: heicFiles.length ? heicFiles : null });
  } catch (err) {
    console.error('[POST /api/projects]', err);
    res.status(500).json({ error: err.message });
  }
});

// Update project
app.put('/api/projects/:id', uploadFields, (req, res) => {
  try {
    const data = loadProjects();
    const p    = data.projects.find(x => x.id === req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });

    const { title, client, year, category, role, website, description,
            mosaicPosition, conflictAction, swapTarget, status } = req.body;

    const pos = parseInt(mosaicPosition) || null;

    if (pos) {
      const conflict = data.projects.find(
        x => x.mosaicPosition === pos && x.status === 'online' && x.id !== req.params.id
      );
      if (conflict) {
        if (conflictAction === 'replace') {
          conflict.mosaicPosition = null;
        } else if (conflictAction === 'swap' && swapTarget) {
          conflict.mosaicPosition = parseInt(swapTarget);
        } else if (!conflictAction) {
          return res.status(409).json({
            conflict: true, existingId: conflict.id,
            existingTitle: conflict.title, position: pos
          });
        }
      }
    }

    const assetBase   = `assets/perproject/${p.id}`;
    const heroFile    = (req.files?.heroImage    || [])[0];
    const mosaicFile  = (req.files?.mosaicImage  || [])[0];
    const galleryFiles = req.files?.galleryImages || [];

    if (title)                 p.title       = title;
    if (client !== undefined)  p.client      = client;
    if (year)                  p.year        = parseInt(year) || p.year;
    if (category !== undefined) p.category   = category;
    if (role !== undefined)    p.role        = role;
    if (website !== undefined) p.website     = website;
    if (description !== undefined) p.description = description;
    p.status         = status === 'offline' ? 'offline' : 'online';
    p.mosaicPosition = pos;

    if (heroFile)   p.hero        = `${assetBase}/${heroFile.originalname}`;
    if (mosaicFile) p.mosaicImage = `${assetBase}/${mosaicFile.originalname}`;
    else if (!p.mosaicImage) p.mosaicImage = p.hero;

    let keepGallery = [];
    let newLayouts  = [];
    let newCaptions = [];
    try { keepGallery = JSON.parse(req.body.keepGallery      || '[]'); } catch {}
    try { newLayouts  = JSON.parse(req.body.galleryLayouts   || '[]'); } catch {}
    try { newCaptions = JSON.parse(req.body.galleryCaptions  || '[]'); } catch {}

    const newItems = galleryFiles.map((f, i) => ({
      file:    `${assetBase}/${f.originalname}`,
      caption: newCaptions[i] || '',
      layout:  newLayouts[i]  || 'standard'
    }));

    p.gallery = [...keepGallery, ...newItems];

    saveProjects(data);
    fs.writeFileSync(
      path.join(ROOT, 'projects', `${p.id}.html`),
      generateProjectPage(p),
      'utf8'
    );
    rebuildIndexMosaic(data.projects);

    const heicFiles = [
      ...(req.files?.heroImage    || []),
      ...(req.files?.mosaicImage  || []),
      ...(req.files?.galleryImages || [])
    ].filter(f => /\.(heic|heif)$/i.test(f.originalname || '')).map(f => f.originalname);

    res.json({ ok: true, id: p.id, url: `/projects/${p.id}.html`, heicWarning: heicFiles.length ? heicFiles : null });
  } catch (err) {
    console.error('[PUT /api/projects/:id]', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const data = loadProjects();
  const idx  = data.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  data.projects.splice(idx, 1);
  saveProjects(data);

  const htmlPath = path.join(ROOT, 'projects', `${req.params.id}.html`);
  if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);

  rebuildIndexMosaic(data.projects);
  res.json({ ok: true });
});

// Rebuild all project HTML pages from current data
app.post('/api/rebuild', (req, res) => {
  const data = loadProjects();
  data.projects.forEach(p => {
    fs.writeFileSync(path.join(ROOT, 'projects', `${p.id}.html`), generateProjectPage(p), 'utf8');
  });
  rebuildIndexMosaic(data.projects);
  res.json({ ok: true, rebuilt: data.projects.length });
});

// ── Start ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Portfolio  →  http://localhost:${PORT}/`);
  console.log(`  Dashboard  →  http://localhost:${PORT}/admin/\n`);
});
