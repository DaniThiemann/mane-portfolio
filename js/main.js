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

/* ─────────────────────────────────────────────────────
   F. MAEDA ANIMATION COVER
   The grid card is a live GSAP animation in an iframe
   (1920×1080 canvas) scaled to cover the card cell.
   ───────────────────────────────────────────────────── */
(function initFmCover() {
  const frame = document.getElementById('fm-anim');
  const thumb = document.getElementById('fm-card-thumb');
  if (!frame || !thumb) return;

  function scaleToCover() {
    const w = thumb.offsetWidth;
    const h = thumb.offsetHeight;
    if (!w || !h) return;
    const s = Math.max(w / 1920, h / 1080);
    const x = (w - 1920 * s) / 2;
    const y = (h - 1080 * s) / 2;
    frame.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }

  frame.src = frame.dataset.src;
  frame.addEventListener('load', scaleToCover, { once: true });
  window.addEventListener('load', scaleToCover);
  window.addEventListener('resize', scaleToCover);
})();

/* ── Footer project count — one per cover on the grid ── */
(function initProjectCount() {
  const el = document.getElementById('sf-count');
  if (!el) return;
  const n = document.querySelectorAll('.mag-cover').length;
  el.textContent = String(n).padStart(2, '0');
})();

/* ─────────────────────────────────────────────────────
   MODAL SYSTEM
   Multiple modals can be open simultaneously.
   Each open/drag bumps the panel to the top z-layer.
   Click outside any panel → close all. ESC → close all.
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
      panel.style.left = Math.min(rect.right + 4, window.innerWidth - panel.offsetWidth - 8) + 'px';
      panel.style.top  = (rect.top + 2) + 'px';
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
})();
