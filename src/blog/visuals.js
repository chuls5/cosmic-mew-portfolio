import { prefersReducedMotion } from '../utils.js';

// Canvas animations used as blog-post thumbnails.
// To add a new one: write `function animateFoo(ctx, W, H, reduced)`, register it in VISUALS
// below, then set `visual: 'foo'` on the blog post in src/blog/posts.js.

// Animation runner: starts/stops the rAF loop based on viewport visibility.
// Reduced-motion users get a single static frame.
function runCanvasAnimation(canvas, draw, reduced) {
  if (reduced) {
    draw();
    return;
  }
  let raf;
  const obs = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    },
    { threshold: 0.1 }
  );
  obs.observe(canvas);
  function loop() {
    draw();
    raf = requestAnimationFrame(loop);
  }
  draw();
}

function makeBgStars(W, H, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    s: Math.random() * 0.9 + 0.2,
  }));
}

function drawBgStars(ctx, stars, alpha = 0.4) {
  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
}

function animateGalaxy(ctx, W, H, reduced) {
  let t = 0;
  const ARMS = 3,
    SPR = 130;
  const stars = [];
  for (let a = 0; a < ARMS; a++) {
    for (let i = 0; i < SPR; i++) {
      const f = i / SPR;
      const angle = f * Math.PI * 4.5 + (a / ARMS) * Math.PI * 2;
      const r = f * Math.min(W, H) * 0.42;
      stars.push({
        bx: Math.cos(angle) * r + (Math.random() - 0.5) * r * 0.22,
        by: Math.sin(angle) * r + (Math.random() - 0.5) * r * 0.22,
        sz: Math.random() * 1.5 + 0.3,
        al: 0.4 + Math.random() * 0.6,
        hue: 180 + a * 70 + Math.random() * 40,
      });
    }
  }
  const bg = makeBgStars(W, H, 60);
  function draw() {
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, W, H);
    drawBgStars(ctx, bg, 0.45);
    const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.2);
    grd.addColorStop(0, 'rgba(255,210,240,0.95)');
    grd.addColorStop(0.35, 'rgba(220,130,200,0.45)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(t);
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.bx, s.by, s.sz, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue},80%,78%,${s.al})`;
      ctx.fill();
    });
    ctx.restore();
    if (!reduced) t += 0.0025;
  }
  runCanvasAnimation(ctx.canvas, draw, reduced);
}

function drawNebula(ctx, W, H) {
  ctx.fillStyle = '#06001a';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * W,
      y = Math.random() * H;
    const s = Math.random() * 1.1 + 0.2;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.65})`;
    ctx.fill();
  }
  [
    [W * 0.42, H * 0.48, H * 0.38, 280, 0.18],
    [W * 0.62, H * 0.28, H * 0.26, 200, 0.16],
    [W * 0.28, H * 0.62, H * 0.28, 330, 0.14],
    [W * 0.55, H * 0.55, H * 0.22, 245, 0.22],
    [W * 0.75, H * 0.45, H * 0.18, 190, 0.12],
  ].forEach(([bx, by, r, h, a]) => {
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    g.addColorStop(0, `hsla(${h},90%,68%,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
  [
    [W * 0.22, H * 0.28],
    [W * 0.72, H * 0.62],
    [W * 0.5, H * 0.18],
    [W * 0.82, H * 0.38],
  ].forEach(([x, y]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 7, y - 7, 14, 14);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.6;
    [
      [x - 12, y, x + 12, y],
      [x, y - 12, x, y + 12],
    ].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  });
}

function animateBinary(ctx, W, H, reduced) {
  let t = 0;
  const cx = W / 2,
    cy = H / 2;
  const a1 = W * 0.23,
    b1 = H * 0.22;
  const a2 = W * 0.14,
    b2 = H * 0.13;
  const bg = makeBgStars(W, H, 70);
  function gstar(x, y, hr, col1, col2) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, hr);
    g.addColorStop(0, col1);
    g.addColorStop(0.45, col2);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, hr, 0, Math.PI * 2);
    ctx.fill();
  }
  function draw() {
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, W, H);
    drawBgStars(ctx, bg, 0.45);
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, a1, b1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, a2, b2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const x1 = cx + Math.cos(t) * a1,
      y1 = cy + Math.sin(t) * b1;
    const x2 = cx - Math.cos(t) * a2,
      y2 = cy - Math.sin(t) * b2;
    gstar(x1, y1, 22, 'rgba(120,180,255,0.32)', 'rgba(100,150,255,0)');
    gstar(x2, y2, 18, 'rgba(255,170,90,0.32)', 'rgba(255,130,60,0)');
    gstar(x1, y1, 5, '#fff', 'rgba(190,220,255,0.95)');
    gstar(x2, y2, 4, '#fff', 'rgba(255,210,160,0.95)');
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();
    if (!reduced) t += 0.013;
  }
  runCanvasAnimation(ctx.canvas, draw, reduced);
}

function animateWormhole(ctx, W, H, reduced) {
  let t = 0;
  const cx = W / 2,
    cy = H / 2;
  const bg = makeBgStars(W, H, 55);
  function draw() {
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, W, H);
    drawBgStars(ctx, bg);
    const RINGS = 14;
    for (let i = RINGS; i >= 1; i--) {
      const prog = i / RINGS;
      const rx = prog * W * 0.45;
      const ry = prog * H * 0.37;
      const rot = t * (0.6 + prog * 0.8) + i * 0.28;
      const hue = 260 + (1 - prog) * 80;
      const alpha = 0.08 + (1 - prog) * 0.55;
      const lw = 0.8 + (1 - prog) * 1.2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue},92%,72%,${alpha})`;
      ctx.lineWidth = lw;
      ctx.stroke();
      ctx.restore();
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.13);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.25, 'rgba(210,160,255,0.65)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    if (!reduced) t += 0.009;
  }
  runCanvasAnimation(ctx.canvas, draw, reduced);
}

function animatePulsar(ctx, W, H, reduced) {
  let t = 0;
  const cx = W / 2,
    cy = H / 2;
  const beamLen = Math.sqrt(W * W + H * H);
  const bg = makeBgStars(W, H, 60);
  function draw() {
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, W, H);
    drawBgStars(ctx, bg);
    for (let i = 0; i < 4; i++) {
      const phase = (t * 0.28 + i * 0.25) % 1;
      const r = phase * beamLen * 0.55;
      const alpha = (1 - phase) * 0.28;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,200,255,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    const beamAngle = t * 2.2;
    for (let b = 0; b < 2; b++) {
      const angle = beamAngle + b * Math.PI;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const grad = ctx.createLinearGradient(0, 0, beamLen, 0);
      grad.addColorStop(0, 'rgba(160,215,255,0.75)');
      grad.addColorStop(0.25, 'rgba(160,215,255,0.2)');
      grad.addColorStop(1, 'rgba(160,215,255,0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(beamLen, -beamLen * 0.038);
      ctx.lineTo(beamLen, beamLen * 0.038);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.3, 'rgba(180,225,255,0.85)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(cx - 22, cy - 22, 44, 44);
    if (!reduced) t += 0.018;
  }
  runCanvasAnimation(ctx.canvas, draw, reduced);
}

function animateOrbit(ctx, W, H, reduced) {
  let t = 0;
  const cx = W / 2,
    cy = H / 2;
  const planets = [
    { a: W * 0.11, b: H * 0.09, speed: 0.048, size: 2.8, color: '#e8c4a0', phase: 0.4 },
    { a: W * 0.2, b: H * 0.15, speed: 0.028, size: 4.2, color: '#7ec8e3', phase: 1.8 },
    { a: W * 0.3, b: H * 0.22, speed: 0.016, size: 3.4, color: '#ff6b9d', phase: 3.0 },
    { a: W * 0.41, b: H * 0.3, speed: 0.009, size: 5.0, color: '#f4a261', phase: 0.9 },
  ];
  const bg = makeBgStars(W, H, 55);
  function draw() {
    ctx.fillStyle = '#06001a';
    ctx.fillRect(0, 0, W, H);
    drawBgStars(ctx, bg);
    planets.forEach((p) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.a, p.b, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    const sunG = ctx.createRadialGradient(cx, cy, 0, cx, cy, H * 0.14);
    sunG.addColorStop(0, 'rgba(255,245,180,1)');
    sunG.addColorStop(0.18, 'rgba(255,200,70,0.75)');
    sunG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sunG;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e0';
    ctx.fill();
    planets.forEach((p) => {
      const angle = t * p.speed + p.phase;
      const px = cx + Math.cos(angle) * p.a;
      const py = cy + Math.sin(angle) * p.b;
      const halo = ctx.createRadialGradient(px, py, 0, px, py, p.size + 5);
      halo.addColorStop(0, p.color + 'cc');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(px, py, p.size + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    if (!reduced) t += 1;
  }
  runCanvasAnimation(ctx.canvas, draw, reduced);
}

// Registry: visual name → drawing function. Add to this map to register a new animation.
const VISUALS = {
  galaxy: animateGalaxy,
  nebula: (ctx, W, H) => drawNebula(ctx, W, H),
  binary: animateBinary,
  wormhole: animateWormhole,
  pulsar: animatePulsar,
  orbit: animateOrbit,
};

export function initBlogVisuals() {
  const reduced = prefersReducedMotion();
  document.querySelectorAll('.blog-canvas').forEach((cv) => {
    cv.width = cv.offsetWidth || 300;
    cv.height = cv.offsetHeight || 160;
    const ctx = cv.getContext('2d');
    const type = cv.dataset.visual;
    const fn = VISUALS[type];
    if (fn) fn(ctx, cv.width, cv.height, reduced);
  });
}
