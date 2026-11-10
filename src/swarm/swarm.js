/**
 * Swarm build — an original, dependency-free re-imagining of the "swarm of
 * cursors rebuilds the page" idea (inspired by the Swarmline concept; no code
 * from it is used). Triggered only by the visitor via the header "Motion" button.
 *
 * Every element in the current viewport marked with `data-build="text|image|box"`
 * is hidden, then a small team of cursors drags out a selection for it (with
 * handles, a live size badge and alignment guides) and brings it back:
 *   text  → typed in left-to-right behind an I-beam
 *   image → placeholder, then scanned in top-to-bottom
 *   box   → faded in
 * When everything is rebuilt the cursors orbit the pointer and fly off.
 *
 * Esc or the "Skip" button finishes immediately. Nothing on the page is changed
 * permanently; all classes/inline styles added here are removed on finish.
 */

const LABELS = ['spring', 'fastapi', 'socket.io', 'react', 'kotlin', 'redis', 'rag', 'docker', 'electron'];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function rgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function collectTargets() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const items = [];
  for (const el of document.querySelectorAll('[data-build]')) {
    if (el.parentElement?.closest('[data-build]')) continue; // never nest
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) continue;
    const x = Math.max(0, r.left);
    const y = Math.max(0, r.top);
    items.push({
      el,
      kind: el.dataset.build || 'box',
      rect: { x, y, w: Math.min(r.right, vw) - x, h: Math.min(r.bottom, vh) - y },
    });
  }
  items.sort((a, b) => (Math.abs(a.rect.y - b.rect.y) < 24 ? a.rect.x - b.rect.x : a.rect.y - b.rect.y));
  return items.slice(0, 48);
}

function setClip(el, dir, k) {
  const rest = `${((1 - k) * 100).toFixed(2)}%`;
  el.style.clipPath = dir === 'right' ? `inset(-12% ${rest} -12% -2%)` : `inset(-2% -2% ${rest} -2%)`;
}

let running = null;

export const isSwarmRunning = () => running !== null;

/**
 * @param {{ accent?: string, ink?: string, background?: string, reduced?: boolean, onFinish?: () => void }} opts
 * @returns {{ stop: () => void } | null}
 */
export function startSwarm(opts = {}) {
  if (running) return running;
  const { accent = '#e32b3c', ink = '#f2efeb', background = '#090909', reduced = false, onFinish } = opts;

  const tasks = collectTargets();
  if (!tasks.length) {
    onFinish?.();
    return null;
  }

  const speed = reduced ? 3 : 1;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const html = document.documentElement;
  const prevOverflow = html.style.overflow;
  html.style.overflow = 'hidden';
  html.classList.add('swarm-active');
  tasks.forEach((t) => t.el.classList.add('swarm-hidden'));

  const canvas = document.createElement('canvas');
  canvas.className = 'swarm-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const panel = document.createElement('div');
  panel.className = 'swarm-panel';
  panel.innerHTML =
    '<span class="swarm-panel__dot" aria-hidden="true"></span>' +
    '<span class="swarm-panel__label" role="status">Rebuilding this view…</span>' +
    '<button type="button" class="swarm-panel__btn">Skip <kbd>Esc</kbd></button>';
  document.body.append(canvas, panel);
  const statusEl = panel.querySelector('.swarm-panel__label');
  const skipBtn = panel.querySelector('.swarm-panel__btn');
  const returnFocus = document.activeElement;
  skipBtn.focus({ preventScroll: true });

  const palette = [accent, ink, '#f2a33a'];
  const count = reduced ? 3 : clamp(Math.round(tasks.length / 3), 4, 9);
  const cursors = Array.from({ length: count }, (_, i) => {
    const side = i % 4;
    return {
      x: side === 0 ? -40 : side === 1 ? W + 40 : Math.random() * W,
      y: side === 2 ? -40 : side === 3 ? H + 40 : Math.random() * H,
      mode: 'arrow',
      label: LABELS[i % LABELS.length],
      color: palette[i % palette.length],
      job: null,
      si: 0,
      t: 0,
      wp: null,
    };
  });

  const selections = [];
  const guides = [];
  const placeholders = [];
  const queue = tasks.slice();
  const pointer = { x: W / 2, y: H / 2 };
  let phase = 'build';
  let phaseT = 0;
  let raf = 0;
  let last = performance.now();
  let finished = false;

  /* ── steps ─────────────────────────────────────────────── */

  function moveStep(toX, toY, base = 1) {
    let fx = 0;
    let fy = 0;
    let cx = 0;
    let cy = 0;
    return {
      dur: 0,
      start(c) {
        fx = c.x;
        fy = c.y;
        const d = Math.hypot(toX - fx, toY - fy);
        this.dur = (clamp(d * 0.85, 160, 680) * base) / speed;
        const nx = -(toY - fy);
        const ny = toX - fx;
        const len = Math.hypot(nx, ny) || 1;
        const bend = (Math.random() - 0.5) * Math.min(140, d * 0.35);
        cx = (fx + toX) / 2 + (nx / len) * bend;
        cy = (fy + toY) / 2 + (ny / len) * bend;
        c.mode = 'arrow';
      },
      update(c, k) {
        const e = easeInOut(k);
        const a = 1 - e;
        c.x = a * a * fx + 2 * a * e * cx + e * e * toX;
        c.y = a * a * fy + 2 * a * e * cy + e * e * toY;
      },
    };
  }

  function jobFor(task) {
    const { x, y, w, h } = task.rect;
    const sel = { x, y, w: 0, h: 0, alpha: 1, fade: false };
    const steps = [moveStep(x, y)];

    steps.push({
      dur: clamp((w + h) * 0.5, 200, 640) / speed,
      start(c) {
        c.mode = 'cross';
        selections.push(sel);
      },
      update(c, k) {
        const e = easeOut(k);
        sel.w = w * e;
        sel.h = h * e;
        c.x = x + sel.w;
        c.y = y + sel.h;
      },
      end() {
        guides.push({ o: 'h', p: y, life: 0, max: 720 / speed });
        guides.push({ o: 'h', p: y + h, life: 0, max: 720 / speed });
        guides.push({ o: 'v', p: x, life: 0, max: 720 / speed });
      },
    });

    if (task.kind === 'text') {
      const chars = (task.el.textContent || '').trim().length;
      const lineY = y + Math.min(h / 2, 36);
      steps.push(moveStep(x + 2, lineY, 0.45));
      steps.push({
        dur: clamp(chars * 15, 260, 1150) / speed,
        start(c) {
          c.mode = 'beam';
          task.el.classList.remove('swarm-hidden');
          setClip(task.el, 'right', 0);
        },
        update(c, k) {
          setClip(task.el, 'right', k);
          c.x = x + w * k;
          c.y = lineY;
        },
        end() {
          task.el.style.clipPath = '';
        },
      });
    } else if (task.kind === 'image') {
      const ph = { rect: task.rect, alpha: 1, scan: -1, fade: false };
      steps.push({
        dur: 240 / speed,
        start(c) {
          c.mode = 'arrow';
          placeholders.push(ph);
        },
      });
      steps.push({
        dur: 640 / speed,
        start() {
          task.el.classList.remove('swarm-hidden');
          setClip(task.el, 'bottom', 0);
        },
        update(c, k) {
          const e = easeInOut(k);
          setClip(task.el, 'bottom', e);
          ph.scan = y + h * e;
          c.x = x + w - 10;
          c.y = ph.scan;
        },
        end() {
          task.el.style.clipPath = '';
          ph.fade = true;
        },
      });
    } else {
      steps.push({
        dur: 260 / speed,
        start(c) {
          c.mode = 'arrow';
          task.el.classList.remove('swarm-hidden');
          task.el.classList.add('swarm-fade-in');
        },
      });
    }

    steps.push({
      dur: 0,
      start() {
        sel.fade = true;
      },
    });
    return steps;
  }

  function nextStep(c) {
    c.si += 1;
    c.t = 0;
    if (c.si >= c.job.length) {
      c.job = null;
      return;
    }
    c.job[c.si].start?.(c);
  }

  function advance(c, dt) {
    const step = c.job[c.si];
    c.t += dt;
    const k = step.dur > 0 ? Math.min(1, c.t / step.dur) : 1;
    step.update?.(c, k);
    if (k >= 1) {
      step.end?.(c);
      nextStep(c);
    }
  }

  function wander(c, dt) {
    if (!c.wp || Math.hypot(c.wp.x - c.x, c.wp.y - c.y) < 10) {
      const left = Math.random() < 0.5;
      c.wp = { x: left ? Math.random() * W * 0.12 : W - Math.random() * W * 0.12, y: 60 + Math.random() * (H - 120) };
    }
    const f = Math.min(1, dt / 520);
    c.x += (c.wp.x - c.x) * f;
    c.y += (c.wp.y - c.y) * f;
    c.mode = 'arrow';
  }

  /* ── drawing ───────────────────────────────────────────── */

  function drawCursor(c) {
    ctx.save();
    ctx.translate(Math.round(c.x), Math.round(c.y));
    ctx.lineJoin = 'round';
    if (c.mode === 'cross') {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();
    } else if (c.mode === 'beam') {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(0, 11);
      ctx.moveTo(-4, -12);
      ctx.lineTo(4, -12);
      ctx.moveTo(-4, 12);
      ctx.lineTo(4, 12);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 17);
      ctx.lineTo(4.6, 13);
      ctx.lineTo(7.6, 19.8);
      ctx.lineTo(10.6, 18.5);
      ctx.lineTo(7.7, 11.9);
      ctx.lineTo(13.3, 11.9);
      ctx.closePath();
      ctx.fillStyle = c.color;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = c.color === ink ? background : '#ffffff';
      ctx.stroke();
    }
    ctx.font = '700 11px Manrope, system-ui, sans-serif';
    const tw = ctx.measureText(c.label).width;
    roundRectPath(ctx, 12, 16, tw + 12, 18, 9);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.fillStyle = c.color === ink ? background : '#ffffff';
    ctx.fillText(c.label, 18, 29);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.lineWidth = 1;
    for (const g of guides) {
      ctx.strokeStyle = rgba(accent, 0.5 * (1 - g.life / g.max));
      ctx.beginPath();
      if (g.o === 'h') {
        ctx.moveTo(0, Math.round(g.p) + 0.5);
        ctx.lineTo(W, Math.round(g.p) + 0.5);
      } else {
        ctx.moveTo(Math.round(g.p) + 0.5, 0);
        ctx.lineTo(Math.round(g.p) + 0.5, H);
      }
      ctx.stroke();
    }

    for (const p of placeholders) {
      const { x, y, w, h } = p.rect;
      const a = Math.max(0, p.alpha);
      ctx.fillStyle = rgba(ink, 0.05 * a);
      ctx.fillRect(x, y, w, h);
      if (p.scan < 0) {
        const s = Math.min(36, w / 4, h / 4);
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.strokeStyle = rgba(ink, 0.5 * a);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - s, cy - s * 0.75, s * 2, s * 1.5);
        ctx.beginPath();
        ctx.moveTo(cx - s, cy + s * 0.55);
        ctx.lineTo(cx - s * 0.3, cy - s * 0.1);
        ctx.lineTo(cx + s * 0.2, cy + s * 0.35);
        ctx.lineTo(cx + s * 0.55, cy + s * 0.05);
        ctx.lineTo(cx + s, cy + s * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + s * 0.45, cy - s * 0.35, s * 0.14, 0, Math.PI * 2);
        ctx.stroke();
      } else if (!p.fade) {
        ctx.fillStyle = rgba(accent, 0.9);
        ctx.fillRect(x, p.scan - 1, w, 2);
        const grad = ctx.createLinearGradient(0, p.scan - 40, 0, p.scan);
        grad.addColorStop(0, rgba(accent, 0));
        grad.addColorStop(1, rgba(accent, 0.18));
        ctx.fillStyle = grad;
        ctx.fillRect(x, p.scan - 40, w, 40);
      }
    }

    for (const s of selections) {
      const a = Math.max(0, s.alpha);
      if (a <= 0) continue;
      ctx.globalAlpha = a;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.25;
      ctx.strokeRect(Math.round(s.x) + 0.5, Math.round(s.y) + 0.5, Math.round(s.w), Math.round(s.h));
      const pts = [
        [s.x, s.y],
        [s.x + s.w, s.y],
        [s.x, s.y + s.h],
        [s.x + s.w, s.y + s.h],
      ];
      for (const [hx, hy] of pts) {
        ctx.fillStyle = background;
        ctx.fillRect(Math.round(hx) - 3, Math.round(hy) - 3, 7, 7);
        ctx.strokeRect(Math.round(hx) - 2.5, Math.round(hy) - 2.5, 6, 6);
      }
      if (!s.fade && s.w > 30) {
        const text = `${Math.round(s.w)} × ${Math.round(s.h)}`;
        ctx.font = '700 10.5px Manrope, system-ui, sans-serif';
        const tw = ctx.measureText(text).width + 12;
        const bx = s.x + s.w / 2 - tw / 2;
        const by = Math.min(H - 22, s.y + s.h + 8);
        roundRectPath(ctx, bx, by, tw, 17, 4);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, bx + 6, by + 12);
      }
      ctx.globalAlpha = 1;
    }

    for (const c of cursors) drawCursor(c);
  }

  /* ── loop ──────────────────────────────────────────────── */

  function tick(now) {
    const dt = Math.min(48, now - last);
    last = now;

    if (phase === 'build') {
      for (const c of cursors) {
        if (c.job) {
          advance(c, dt);
        } else if (queue.length) {
          c.job = jobFor(queue.shift());
          c.si = -1;
          nextStep(c);
        } else {
          wander(c, dt);
        }
      }
      if (!queue.length && cursors.every((c) => !c.job)) {
        phase = 'orbit';
        phaseT = 0;
        statusEl.textContent = 'Rebuilt';
      }
    } else if (phase === 'orbit') {
      phaseT += dt;
      cursors.forEach((c, i) => {
        const ang = phaseT / 520 + (i / cursors.length) * Math.PI * 2;
        const r = 44 + (i % 3) * 16;
        const f = Math.min(1, dt / 130);
        c.x += (pointer.x + Math.cos(ang) * r - c.x) * f;
        c.y += (pointer.y + Math.sin(ang) * r - c.y) * f;
        c.mode = 'arrow';
      });
      if (phaseT > 1500 / Math.sqrt(speed)) {
        phase = 'leave';
        phaseT = 0;
        const far = Math.max(W, H);
        cursors.forEach((c) => {
          const a = Math.atan2(c.y - pointer.y, c.x - pointer.x);
          c.fx = c.x;
          c.fy = c.y;
          c.tx = c.x + Math.cos(a) * far;
          c.ty = c.y + Math.sin(a) * far;
        });
      }
    } else if (phase === 'leave') {
      phaseT += dt;
      const k = Math.min(1, phaseT / (650 / Math.sqrt(speed)));
      const e = easeInOut(k);
      cursors.forEach((c) => {
        c.x = lerp(c.fx, c.tx, e);
        c.y = lerp(c.fy, c.ty, e);
      });
      canvas.style.opacity = String(1 - e * 0.6);
      if (k >= 1) {
        finish();
        return;
      }
    }

    for (const s of selections) if (s.fade) s.alpha -= dt / (280 / speed);
    for (let i = selections.length - 1; i >= 0; i -= 1) if (selections[i].alpha <= 0) selections.splice(i, 1);
    for (const g of guides) g.life += dt;
    for (let i = guides.length - 1; i >= 0; i -= 1) if (guides[i].life >= guides[i].max) guides.splice(i, 1);
    for (const p of placeholders) if (p.fade) p.alpha -= dt / 220;
    for (let i = placeholders.length - 1; i >= 0; i -= 1) if (placeholders[i].alpha <= 0) placeholders.splice(i, 1);

    draw();
    raf = requestAnimationFrame(tick);
  }

  /* ── lifecycle ─────────────────────────────────────────── */

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      finish();
    }
  }
  function onPointer(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    tasks.forEach(({ el }) => {
      el.classList.remove('swarm-hidden', 'swarm-fade-in');
      el.style.clipPath = '';
    });
    canvas.remove();
    panel.remove();
    html.style.overflow = prevOverflow;
    html.classList.remove('swarm-active');
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', finish);
    if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
      returnFocus.focus({ preventScroll: true });
    }
    running = null;
    onFinish?.();
  }

  skipBtn.addEventListener('click', finish);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('resize', finish);

  raf = requestAnimationFrame((t) => {
    last = t;
    tick(t);
  });

  running = { stop: finish };
  return running;
}
