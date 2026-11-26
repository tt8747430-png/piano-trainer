(() => { const out = { checked: 0, inside_gt_outside: [], heading_far_from_own: [] };
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.position !== 'absolute' && s.position !== 'fixed'; };
  const card = (e) => { const s = getComputedStyle(e); return s.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(s.borderRadius) >= 10 && e.getBoundingClientRect().height > 48 && e.children.length; };
  const label = (e) => (e.getAttribute('aria-label') || e.tagName.toLowerCase() + ':' + (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24));
  const heading = (e) => { if (/^H[1-6]$/.test(e.tagName)) return true; const s = getComputedStyle(e); const t = (e.textContent || '').trim(); return e.children.length <= 2 && t.length && t.length < 40 && (s.textTransform === 'uppercase' || (parseFloat(s.fontSize) >= 17 && +s.fontWeight >= 600)) && e.getBoundingClientRect().height < 48; };
  const root = document.querySelector('main') || document.body;
  [...root.querySelectorAll('*')].forEach((p) => { if (p.closest('svg')) return; const ps = getComputedStyle(p); if (ps.display !== 'flex' || !ps.flexDirection.startsWith('column')) return;
    const kids = [...p.children].filter(vis); if (kids.length < 2) return;
    kids.forEach((k, i) => { const r = k.getBoundingClientRect(); const prev = kids[i - 1], next = kids[i + 1];
      const above = prev ? Math.round(r.top - prev.getBoundingClientRect().bottom) : null, below = next ? Math.round(next.getBoundingClientRect().top - r.bottom) : null;
      out.checked++;
      if (card(k)) { const s = getComputedStyle(k); const pad = Math.max(parseFloat(s.paddingTop), parseFloat(s.paddingLeft)); const gap = Math.min(...[[above, prev], [below, next]].filter(([v, sib]) => v !== null && v >= 0 && sib && card(sib)).map(([v]) => v));
        if (isFinite(gap) && pad > gap + 0.5 && gap > 0) out.inside_gt_outside.push(`${label(k)} pad ${pad} > gap ${gap}`); }
      if (heading(k) && above !== null && below !== null && above >= 0 && below >= 0 && above < below) out.heading_far_from_own.push(`${label(k)} above ${above} < below ${below}`); }); });
  out.inside_gt_outside = [...new Set(out.inside_gt_outside)].slice(0, 12); out.heading_far_from_own = [...new Set(out.heading_far_from_own)].slice(0, 12);
  return JSON.stringify(out); })()
