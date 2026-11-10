(() => { const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return [.2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]), m[3] ?? 1]; };
const bgOf = (e) => { while (e) { const b = getComputedStyle(e).backgroundColor; const m = b.match(/[\d.]+/g); if (m && (m[3] === undefined || +m[3] > .9)) return b; e = e.parentElement; } return 'rgb(246,243,238)'; };
const out = {};
const btn = [...document.querySelectorAll('button,a[href],[role=radio],[role=switch]')].filter(vis);
out.controls = btn.length;
out.small = btn.map((b) => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), (b.getAttribute('aria-label') || b.textContent).trim().slice(0, 30)]; }).filter((x) => x[0] < 44 || x[1] < 44);
out.noName = btn.filter((b) => !(b.getAttribute('aria-label') || b.textContent.trim())).length;
out.divClick = [...document.querySelectorAll('div,span')].filter((e) => vis(e) && getComputedStyle(e).cursor === 'pointer' && !e.closest('button,a')).length;
out.fonts = {}; const fam = {}; const low = [];
const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
while ((n = w.nextNode())) { const e = n.parentElement; if (!n.textContent.trim() || !vis(e) || e.closest('svg,[aria-hidden=true]')) continue; const cs = getComputedStyle(e); out.fonts[cs.fontSize] = (out.fonts[cs.fontSize] || 0) + 1; fam[cs.fontFamily.split(',')[0]] = 1;
  const [l1, a] = lum(cs.color), [l2] = lum(bgOf(e)); const cr = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); if (a > .9 && cr < 4.5) low.push([n.textContent.trim().slice(0, 28), cs.fontSize, cs.color, bgOf(e), cr.toFixed(2)]); }
out.fam = Object.keys(fam); out.lowContrast = low.slice(0, 12);
out.transAll = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).transitionProperty === 'all' && getComputedStyle(e).transitionDuration !== '0s').length;
const b0 = btn[0]; b0.focus(); const fs = getComputedStyle(b0); out.focus = [fs.outlineStyle, fs.outlineWidth, fs.outlineColor, b0.matches(':focus-visible')];
out.css = [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n'); out.focusRule = /focus-visible/.test(out.css); out.outlineNone = (out.css.match(/outline:\s*(none|0)/g) || []).length; out.reduced = /prefers-reduced-motion/.test(out.css); delete out.css;
const d = document.querySelector('[role=dialog]'); if (d) out.dialog = { modal: d.getAttribute('aria-modal'), label: d.getAttribute('aria-label'), focusInside: d.contains(document.activeElement) };
out.dsf = [innerWidth, document.documentElement.scrollWidth];
return JSON.stringify(out); })()
