/* ─────────────────────────────────────────────────────
   PORTFOLIO — SHARED SCRIPTS
   ───────────────────────────────────────────────────── */

/* ── Custom cursor ─────────────────────────────────── */
const cur = document.getElementById('cur');
if (cur) {
  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
  });
}


/* ── Scroll reveal ─────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ─────────────────────────────────────────────────────
   TYPEWRITER ANIMATION on page load
   Any element with .type and a data-text attribute
   will type its text out character by character.
   Multiple .type elements run in sequence (staggered).
   ───────────────────────────────────────────────────── */
function typeText(el, text, speed = 28, done = () => {}) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      // tiny natural irregularity
      const jitter = Math.random() * 14;
      setTimeout(tick, speed + jitter);
    } else {
      el.classList.add('typed');
      done();
    }
  };
  tick();
}

window.addEventListener('load', () => {
  const typers = Array.from(document.querySelectorAll('.type'));
  if (!typers.length) return;

  // Run in sequence; each element waits for the previous to finish
  let chain = Promise.resolve();
  typers.forEach((el) => {
    const text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    el.textContent = '';
    chain = chain.then(() => new Promise(resolve => {
      typeText(el, text, 22, resolve);
    }));
  });
});

/* ─────────────────────────────────────────────────────
   TEXT HOVER WIGGLE
   Wraps every character in a span so each can animate
   independently. Keeps spaces intact.
   ───────────────────────────────────────────────────── */
document.querySelectorAll('.text-hover').forEach(el => {
  // Don't re-wrap already wrapped elements
  if (el.dataset.wrapped) return;
  const text = el.textContent;
  el.textContent = '';
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = ch === ' ' ? 'ch space' : 'ch';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  }
  el.dataset.wrapped = '1';
});

/* ─────────────────────────────────────────────────────
   MODAL SYSTEM
   Multiple modals can be open simultaneously.
   Each open/drag bumps the panel to the top z-layer.
   Shared backdrop captures "click outside → close all".
   ───────────────────────────────────────────────────── */
(function initModals() {
  let zTop = 500;

  function bumpZ(panel) { panel.style.zIndex = ++zTop; }

  function centerPanel(panel) {
    panel.style.left = Math.max(0, (window.innerWidth  - panel.offsetWidth)  / 2) + 'px';
    panel.style.top  = Math.max(0, (window.innerHeight - panel.offsetHeight) / 2) + 'px';
  }

  function openModal(id, trigger) {
    const panel = document.getElementById(id);
    if (!panel) return;
    bumpZ(panel);

    if (id === 'modal-photo' && trigger) {
      if (panel._resetDrag) panel._resetDrag();
      const rect = trigger.getBoundingClientRect();
      panel.style.left = (rect.right + 4)  + 'px';
      panel.style.top  = (rect.top  + 2) + 'px';
    } else if (panel.classList.contains('modal-wip') && trigger) {
      if (panel._resetDrag) panel._resetDrag();
      const rect = trigger.getBoundingClientRect();
      panel.style.left = (rect.right + 20) + 'px';
      panel.style.top  = (rect.top  + 4) + 'px';
    } else if (panel.classList.contains('modal-project')) {
      let lastPanel = null, highestZ = 0;
      document.querySelectorAll('.modal-project.is-open').forEach(function (p) {
        const z = parseInt(p.style.zIndex) || 0;
        if (z > highestZ) { highestZ = z; lastPanel = p; }
      });
      if (lastPanel) {
        const rect = lastPanel.getBoundingClientRect();
        panel.style.left = (rect.left + 20) + 'px';
        panel.style.top  = (rect.top  + 4) + 'px';
      } else {
        centerPanel(panel);
      }
    } else if (panel.dataset.centered) {
      centerPanel(panel);
    }

    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');

    if (id === 'modal-archive') {
      const frame = document.getElementById('fm-anim-modal');
      const thumb = document.getElementById('fm-card-thumb-modal');
      if (frame && frame.dataset.src && !frame.dataset.loaded) {
        frame.dataset.loaded = '1';
        const scaleModalAnim = function () {
          if (!thumb) return;
          const scale = thumb.offsetWidth / 1920;
          frame.style.transform = 'scale(' + scale + ')';
        };
        frame.src = frame.dataset.src;
        frame.addEventListener('load', scaleModalAnim, { once: true });
        window.addEventListener('resize', scaleModalAnim);
      }
    }
  }

  function closeModal(id) {
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    if (panel._resetDrag) panel._resetDrag();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-panel.is-open').forEach(p => closeModal(p.id));
  }

  // Expose globally so inline scripts can trigger modals
  window._openModal = openModal;

  // Open triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openModal(btn.dataset.modal, btn); });
  });

  // Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  // Click outside any open modal → close all
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.modal-panel')) closeAllModals();
  });

  // ESC → close all
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

  // Drag from chrome bar; bump z on grab
  document.querySelectorAll('.modal-panel').forEach(panel => {
    let dragging = false, sx = 0, sy = 0, tx = 0, ty = 0;

    panel._resetDrag = function () {
      tx = 0; ty = 0;
      panel.style.transition = 'none';
      panel.style.transform  = '';
      document.body.classList.remove('modal-dragging');
      requestAnimationFrame(() => { panel.style.transition = ''; });
    };

    panel.addEventListener('mousedown', e => {
      if (e.target.closest('.modal-inner') || e.target.closest('.modal-close')) return;
      bumpZ(panel);
      dragging = true;
      sx = e.clientX - tx;
      sy = e.clientY - ty;
      panel.style.transition = 'none';
      document.body.classList.add('modal-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      tx = e.clientX - sx;
      ty = e.clientY - sy;
      panel.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = '';
      document.body.classList.remove('modal-dragging');
    });
  });

  // Archive modal filter
  (function () {
    const filterBtns = document.querySelectorAll('#modal-archive .filter-btn');
    const cards      = document.querySelectorAll('.archive-modal-grid .project-card');
    const countEl   = document.querySelector('#modal-archive .archive-count');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
          const show = filter === 'all' || (card.dataset.cat || '').split(' ').includes(filter);
          card.style.display = show ? '' : 'none';
          if (show) visible++;
        });
        if (countEl) countEl.textContent = '[ 0' + visible + ' ]';
      });
    });
  })();
})();

/* ─────────────────────────────────────────────────────
   COLLAPSING MENU + CYLINDER ROLL
   - Menu starts expanded
   - Once user scrolls > 100px, it collapses into a single
     rolling label that reads "› current section"
   - As user scrolls into a different section, the label
     rolls (cylinder transition) to the new section
   - On hover, the full list returns
   - Scrolling back to top expands the menu permanently
   ───────────────────────────────────────────────────── */
(function initMenu() {
  const menu = document.querySelector('.menu-collapse');
  if (!menu) return;

  // Build the roller track: one slot per menu item, in order
  const items = Array.from(menu.querySelectorAll('.menu-list a'));
  const labels = items.map(a => a.textContent.trim());

  const roller = document.createElement('div');
  roller.className = 'menu-roller';
  const track = document.createElement('div');
  track.className = 'menu-roller-track';

  // Triple the labels so we can fake an infinite cylinder roll either direction
  // For the use case we only need labels in their order, but we duplicate a
  // copy at top + bottom so the visual roll has space to slide.
  labels.forEach(label => {
    const s = document.createElement('span');
    s.textContent = label;
    track.appendChild(s);
  });
  roller.appendChild(track);
  menu.appendChild(roller);

  // Map sections to menu items
  // Each menu link's href maps to a target section.
  // For #anchor links → element with that id.
  // For full-page links (work.html, project pages) → only the current page item is "active"; we don't roll.
  const sectionMap = items.map(a => {
    // Prefer data-section if present (allows external page links to still
    // be tracked against an on-page section). Otherwise use href if it's an anchor.
    const dataSec = a.getAttribute('data-section');
    const href = a.getAttribute('href') || '';
    let target = null;
    if (dataSec && dataSec.startsWith('#')) {
      target = document.querySelector(dataSec);
    } else if (href.startsWith('#')) {
      target = document.querySelector(href);
    }
    return { item: a, target };
  });

  // Determine which menu item is the "current" one
  // 1. Always defaults to the .active item
  // 2. If on the homepage, we update it based on which section is in view.
  const initialActive = items.findIndex(a => a.classList.contains('active'));
  let currentIndex = initialActive >= 0 ? initialActive : 0;

  // Set the roller to the current label initially
  function setRollerTo(index) {
    track.style.transform = `translateY(-${index * 14}px)`;
  }
  setRollerTo(currentIndex);

  // Collapse / expand toggle based on scroll
  function updateCollapse() {
    if (window.scrollY > 100) {
      menu.classList.add('collapsed');
    } else {
      menu.classList.remove('collapsed');
    }
  }
  updateCollapse();
  window.addEventListener('scroll', updateCollapse, { passive: true });

  // Section tracking — only meaningful if at least one menu item targets a section on this page
  const trackable = sectionMap.filter(s => s.target);
  if (trackable.length > 0) {
    // Use IntersectionObserver to know which section is in view
    const visible = new Map();

    const sectionIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        visible.set(entry.target, entry.intersectionRatio);
      });

      // Find the section with the highest intersection ratio
      let bestEl = null;
      let bestRatio = 0;
      visible.forEach((ratio, el) => {
        if (ratio > bestRatio) { bestRatio = ratio; bestEl = el; }
      });

      if (bestEl && bestRatio > 0.15) {
        const idx = sectionMap.findIndex(s => s.target === bestEl);
        if (idx >= 0 && idx !== currentIndex) {
          currentIndex = idx;
          setRollerTo(currentIndex);
          // Also update active state on links (visual)
          items.forEach(a => a.classList.remove('active'));
          items[idx].classList.add('active');
        }
      }
    }, {
      threshold: [0, 0.15, 0.3, 0.5, 0.75, 1]
    });

    trackable.forEach(s => sectionIO.observe(s.target));
  }
})();

