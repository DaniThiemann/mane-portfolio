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
   BUILD-ON COVER ANIMATION
   A cover that is a video of the mark assembling: it sits
   frozen on its final frame (the finished symbol) and
   replays from the start while the card is hovered.
   ───────────────────────────────────────────────────── */
(function initCoverAnim() {
  // No hover means the animation is unreachable, and seeking a video the
  // browser never preloaded paints black — the CSS shows a still instead.
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.cover-anim').forEach(v => {
    const card = v.closest('.project-card');
    if (!card) return;

    // Park on the last frame once metadata is known. Seeking to exactly
    // `duration` doesn't stick in Chrome, so land just short of it.
    const rest = () => {
      v.pause();
      if (v.duration && isFinite(v.duration)) {
        v.currentTime = Math.max(0, v.duration - 0.05);
      }
    };
    if (v.readyState >= 1) rest();
    else v.addEventListener('loadedmetadata', rest, { once: true });
    v.addEventListener('ended', rest);

    card.addEventListener('mouseenter', () => {
      v.currentTime = 0;
      const p = v.play();
      if (p) p.catch(() => {});   // autoplay policy — stays on the poster frame
    });
    card.addEventListener('mouseleave', rest);
  });
})();

/* ─────────────────────────────────────────────────────
   TOUCH — HOLD A COVER TO PLAY IT
   Touch has no hover, so the reveal desktop gets on
   mouseenter — colour, scale, the build-on animation —
   is bound to a press-and-hold instead. A tap still opens
   the project; a hold that matures previews it and
   swallows the click that would otherwise follow.
   ───────────────────────────────────────────────────── */
(function initCoverPress() {
  if (window.matchMedia('(hover: hover)').matches) return;

  const HOLD_MS = 350;   // the hold the modal drag already uses
  const SLOP    = 10;    // px of drift that still counts as holding still

  document.querySelectorAll('.project-card').forEach(card => {
    const vid = card.querySelector('.cover-anim');
    let timer = null, held = false, sx = 0, sy = 0;

    function engage() {
      held = true;
      card.classList.add('is-pressed');
      if (!vid) return;
      vid.currentTime = 0;
      const p = vid.play();
      if (p) p.catch(() => {});   // no data yet — the still just stays up
    }

    function release() {
      clearTimeout(timer); timer = null;
      if (!held) return;
      held = false;
      card.classList.remove('is-pressed');
      // The still is the animation's final frame, so hiding the video lands on
      // exactly the rest state desktop parks at.
      if (vid) { vid.pause(); vid.classList.remove('is-live'); }
    }

    // Reveal the video only once it is actually painting. Mobile browsers skip
    // preload freely, and an unbuffered video would flash black over the still.
    if (vid) vid.addEventListener('playing', () => {
      if (held) vid.classList.add('is-live');
    });

    card.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      timer = setTimeout(engage, HOLD_MS);
    }, { passive: true });

    // Passive, and nothing is ever cancelled here: a press that moves is a
    // scroll, so it stands the hold down and lets the page scroll untouched.
    card.addEventListener('touchmove', e => {
      const t = e.touches[0];
      if (!t) return;
      if (Math.hypot(t.clientX - sx, t.clientY - sy) > SLOP) release();
    }, { passive: true });

    card.addEventListener('touchend', e => {
      // A matured hold was a preview, not a tap — don't let it open the modal,
      // which would bury the animation the hold just asked for.
      if (held && e.cancelable) e.preventDefault();
      release();
    });
    card.addEventListener('touchcancel', release);
  });
})();

/* ── Footer project count — one per cover on the grid ── */
(function initProjectCount() {
  const el = document.getElementById('sf-count');
  if (!el) return;
  const n = document.querySelectorAll('.mag-cover').length;
  el.textContent = String(n).padStart(2, '0');
})();

/* ─────────────────────────────────────────────────────
   GALLERY LIGHTBOX
   A gallery slot crops its media to 1:1; clicking one
   re-shows it whole, over a dimmed page. The project
   modal stays open behind it.
   ───────────────────────────────────────────────────── */
(function initLightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const stage = box.querySelector('.lb-stage');

  function open(media) {
    const clone = media.cloneNode(true);
    clone.removeAttribute('class');
    if (clone.tagName === 'VIDEO') {
      // Muted autoplay so the expanded copy runs on its own; looping is left to
      // the source, so a one-shot animation ends on its final frame.
      clone.controls = true;
      clone.muted = clone.autoplay = clone.playsInline = true;
    }
    stage.replaceChildren(clone);
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
  }

  function close() {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    stage.replaceChildren();   // drops the clone, so any video stops with it
  }

  document.querySelectorAll('.mp-item').forEach(item => {
    item.addEventListener('click', e => {
      const media = item.querySelector('img, video');
      if (!media) return;
      e.stopPropagation();
      open(media);
    });
  });

  // Anywhere on the overlay dismisses it — and never reaches the
  // click-outside handler, which would close the modal behind it too.
  box.addEventListener('click', e => { e.stopPropagation(); close(); });

  // Capture phase: ESC closes the lightbox first and leaves the modals alone.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !box.classList.contains('is-open')) return;
    e.stopPropagation();
    close();
  }, true);
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

  const isNarrow = () => window.matchMedia('(max-width: 760px)').matches;

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
      // The trigger sits at the far right of the header, so the panel hangs
      // leftwards from it — right edges aligned — instead of running off screen.
      const rect = trigger.getBoundingClientRect();
      panel.style.left = Math.max(8, rect.right - panel.offsetWidth) + 'px';
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
    } else if (panel.dataset.centered || isNarrow()) {
      // Loose panels are hand-placed for the desktop layout (the contact panel
      // sits at 140/350), which runs them off a phone screen. Center instead.
      centerPanel(panel);
    }

    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');

    // A gallery video is a piece the visitor should see run, not a still they
    // have to poke — start it from the top every time the modal is opened.
    panel.querySelectorAll('.mp-item video').forEach(v => {
      v.currentTime = 0;
      const p = v.play();
      if (p) p.catch(() => {});   // autoplay refused — it rests on its poster
    });
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

  // Drag from chrome bar; bump z on grab.
  // Desktop only: on touch the browser synthesises mousedown, and the
  // preventDefault() below cancels the panel's own scroll gesture.
  const canHover = window.matchMedia('(hover: hover)').matches;
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
      if (!canHover) return;
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

    /* ── Touch: hold to pick the panel up, then drag ──────────────
       A press that stays put is a grab; a press that moves is a scroll.
       Nothing is preventDefault()ed until the hold completes, so normal
       scrolling is untouched. */
    const HOLD_MS = 350;   // how long to hold before the panel is grabbed
    const SLOP    = 10;    // px of movement that still counts as "held still"

    let holdTimer = null, held = false, sxT = 0, syT = 0, bx = 0, by = 0;
    const scroller = panel.querySelector('.modal-proj-scroll');

    function releaseTouch() {
      clearTimeout(holdTimer); holdTimer = null;
      if (!held) return;
      held = false;
      panel.classList.remove('is-grabbed');
      document.body.classList.remove('modal-dragging');
      panel.style.transition = '';
      if (scroller) scroller.style.touchAction = '';
      panel.style.touchAction = '';
    }

    panel.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('a, button')) return;   // let taps and closes work
      const t = e.touches[0];
      sxT = t.clientX; syT = t.clientY; bx = tx; by = ty;
      holdTimer = setTimeout(() => {
        held = true;
        bumpZ(panel);
        panel.classList.add('is-grabbed');
        document.body.classList.add('modal-dragging');
        panel.style.transition = 'none';
        // The finger hasn't moved, so no scroll has been claimed yet — dropping
        // touch-action now keeps the following touchmoves cancelable.
        if (scroller) scroller.style.touchAction = 'none';
        panel.style.touchAction = 'none';
      }, HOLD_MS);
    }, { passive: true });

    panel.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - sxT, dy = t.clientY - syT;
      if (!held) {
        // Moved before the hold matured → treat it as a scroll and stand down.
        if (Math.hypot(dx, dy) > SLOP) { clearTimeout(holdTimer); holdTimer = null; }
        return;                       // no preventDefault: the page still scrolls
      }
      tx = bx + dx; ty = by + dy;
      panel.style.transform = `translate(${tx}px, ${ty}px)`;
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    panel.addEventListener('touchend', releaseTouch);
    panel.addEventListener('touchcancel', releaseTouch);
  });
})();
