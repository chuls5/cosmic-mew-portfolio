#!/usr/bin/env node
/**
 * WCAG AA color-contrast check for the design tokens in src/styles/base.css.
 *
 *   npm run check-contrast              # both themes
 *   npm run check-contrast -- --nebula  # nebula theme only
 *   npm run check-contrast -- --default # default theme only
 *
 * Exits 1 if any pair fails its threshold.
 *
 * Thresholds:
 *   body  text (< 18px or < 14px bold): 4.5:1
 *   large text (>= 18px or >= 14px bold): 3:1
 *
 * To add a check, append to buildPairs(). Composited alpha colors are
 * flattened onto their backdrop before computing luminance.
 */

// Design tokens (mirror src/styles/base.css). If you change a token there, change it here too.
const TOKENS = {
  deep: [10, 0, 31],
  deepNebula: [26, 0, 48],
  text: [224, 212, 255],
  pink: [255, 105, 180],
  pinkBright: [255, 143, 208],
  purple: [168, 85, 247],
  white: [255, 255, 255],
};
const TEXT_DIM_ALPHA = 0.65;
const CARD_BG_RGB = [10, 2, 35];
const CARD_BG_NEBULA_RGB = [30, 5, 60];
const CARD_BG_ALPHA = 0.78;

function srgbToLin(c8) {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance([r, g, b]) {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

function contrast(c1, c2) {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function composite(fgRgb, alpha, bgRgb) {
  return fgRgb.map((c, i) => Math.round(c * alpha + bgRgb[i] * (1 - alpha)));
}

function hex([r, g, b]) {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function buildPairs(nebula) {
  const deep = nebula ? TOKENS.deepNebula : TOKENS.deep;
  const cardBg = composite(
    nebula ? CARD_BG_NEBULA_RGB : CARD_BG_RGB,
    CARD_BG_ALPHA,
    deep
  );
  const textDimOnDeep = composite(TOKENS.text, TEXT_DIM_ALPHA, deep);
  const textDimOnCard = composite(TOKENS.text, TEXT_DIM_ALPHA, cardBg);

  return [
    ['text on deep — body paragraphs',                  TOKENS.text,       deep,           'body'],
    ['text on card-bg — modal readme body',             TOKENS.text,       cardBg,         'body'],
    ['text-dim on deep — subtitle/tagline/footer',      textDimOnDeep,     deep,           'body'],
    ['text-dim on card-bg — card descriptions',         textDimOnCard,     cardBg,         'body'],
    ['pink on deep — links/active nav/accent text',     TOKENS.pink,       deep,           'body'],
    ['pink on card-bg — project-card h3',               TOKENS.pink,       cardBg,         'body'],
    ['pink-bright on card-bg — modal h2, code',         TOKENS.pinkBright, cardBg,         'body'],
    ['purple on card-bg — blog-date',                   TOKENS.purple,     cardBg,         'body'],
    ['white on deep — section h2, glitch hero',         TOKENS.white,      deep,           'large'],
    ['deep on pink — cta-btn (pink end)',               deep,              TOKENS.pink,    'body'],
    ['deep on purple — cta-btn (purple end)',           deep,              TOKENS.purple,  'body'],
  ];
}

function checkOne([label, fg, bg, kind]) {
  const ratio = contrast(fg, bg);
  const threshold = kind === 'large' ? 3 : 4.5;
  return { label, fg, bg, ratio, threshold, kind, pass: ratio >= threshold };
}

function report(modeLabel, results) {
  console.log(`\n=== ${modeLabel} ===`);
  const labelW = 50;
  for (const r of results) {
    const tag = r.pass ? 'PASS' : 'FAIL';
    const label = r.label.padEnd(labelW);
    const ratio = (r.ratio.toFixed(2) + ':1').padStart(8);
    const need = `(${r.kind} ≥ ${r.threshold}:1)`.padEnd(17);
    console.log(`  ${tag}  ${label} ${ratio}  ${need}  ${hex(r.fg)} on ${hex(r.bg)}`);
  }
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n  ${passed}/${results.length} passed.`);
  return results.filter((r) => !r.pass);
}

const args = new Set(process.argv.slice(2));
const modes = [];
if (args.has('--nebula')) modes.push({ label: 'Nebula theme', nebula: true });
else if (args.has('--default')) modes.push({ label: 'Default theme', nebula: false });
else {
  modes.push({ label: 'Default theme', nebula: false });
  modes.push({ label: 'Nebula theme', nebula: true });
}

let totalFails = 0;
for (const { label, nebula } of modes) {
  const results = buildPairs(nebula).map(checkOne);
  totalFails += report(label, results).length;
}

console.log('');
if (totalFails === 0) {
  console.log('All checks pass WCAG AA. ✓');
  process.exit(0);
} else {
  console.log(`${totalFails} check(s) failed WCAG AA.`);
  process.exit(1);
}
