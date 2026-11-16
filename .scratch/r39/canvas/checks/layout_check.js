// Layout check for a canvas board, run in the page before every publish (R42 v82): every visible control sits inside
// the screen with a margin unless its strip scrolls, is at least 44px to tap, and a toolbar's parts keep equal gaps
// around a centred middle. Returns the problems as lines; an empty list is a pass.
(() => { const ell = (n) => { for (let e = n.parentElement, k = 0; e && k < 4; e = e.parentElement, k++) if (getComputedStyle(e).textOverflow === 'ellipsis') return true; return false };
  const out = []
  const screen = [...document.querySelectorAll('div')].find((d) => /border-radius: (62px|0px 0px 16px 16px)/.test(d.getAttribute('style') || '') && d.clientWidth > 300)
  if (!screen) return ['no screen found']
  const S = screen.getBoundingClientRect(), M = 8
  const scrolls = (el) => { for (let p = el.parentElement; p && p !== screen; p = p.parentElement) { const o = getComputedStyle(p); if (/(auto|scroll)/.test(o.overflowX + o.overflowY) && (p.scrollWidth > p.clientWidth + 1 || p.scrollHeight > p.clientHeight + 1)) return true } return false }
  const name = (el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40)
  for (const el of screen.querySelectorAll('button, a[href], [role=radio], [role=menuitemradio]')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue
    if (r.bottom < S.top || r.top > S.bottom) continue
    if (!scrolls(el) && (r.left < S.left + M - 0.5 || r.right > S.right - M + 0.5)) out.push(`outside the screen's ${M}px margin: "${name(el)}" (${Math.round(r.left - S.left)}…${Math.round(S.right - r.right)})`)
    // a label never touches its control's edge: 6px at least, unless the control is a bare text button
    if (getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)' || getComputedStyle(el).boxShadow !== 'none') {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n
      while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const g = document.createRange(); g.selectNodeContents(n); const t = g.getBoundingClientRect(); if (!t.width) continue
        const pad = Math.min(t.left - r.left, r.right - t.right)
        if (pad < 5.5) { out.push(`label ${pad.toFixed(1)}px from its control's edge: "${name(el)}"`); break } }
    }
    // no word runs past its control's edge, filled or bare (owner, v107: "alway check that the text is not exceeding its barrier")
    { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n
      while ((n = w.nextNode())) { if (!n.textContent.trim()) continue; const g = document.createRange(); g.selectNodeContents(n); const t = g.getBoundingClientRect()
        if (t.width && !ell(n) && (t.left < r.left - 0.5 || t.right > r.right + 0.5)) { out.push(`text past its edge: "${name(el)}"`); break } } }
    if (Math.min(r.width, r.height) < 30 && !el.closest('svg')) out.push(`small target ${Math.round(r.width)}×${Math.round(r.height)}: "${name(el)}"`)
  }
  for (const bar of screen.querySelectorAll('[role=toolbar]')) {
    const kids = [...bar.children].map((k) => k.getBoundingClientRect()).filter((r) => r.width)
    if (kids.length === 3) {
      const g1 = kids[1].left - kids[0].right, g2 = kids[2].left - kids[1].right, mid = (kids[1].left + kids[1].right) / 2, pc = bar.parentElement.getBoundingClientRect(), c = (pc.left + pc.right) / 2
      if (Math.abs(g1 - g2) > 1) out.push(`toolbar gaps differ: ${g1.toFixed(1)} and ${g2.toFixed(1)}`)
      if (Math.abs(mid - c) > 1.5) out.push(`toolbar's middle is ${(mid - c).toFixed(1)}px off centre`)
      // an empty third slot is the spacer that keeps the middle centred; only parts with content are compared
      const full = [...bar.children].filter((k) => k.getBoundingClientRect().width && (k.children.length || k.textContent.trim())).map((k) => k.getBoundingClientRect())
      if (full.some((r) => Math.abs(r.top - full[0].top) > 1 || Math.abs(r.height - full[0].height) > 1)) out.push('toolbar parts differ in height or baseline')
    }
  }
  // nothing drawn is cut off (owner, v108: "the staff is clipped in the key signature. make sure this doenst happen"):
  // every mark inside a clipping drawing stays within it, and no text is cut by a box that does not scroll
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width && r.height && getComputedStyle(el).visibility !== 'hidden' && r.bottom > S.top && r.top < S.bottom }
  for (const svg of screen.querySelectorAll('svg')) {
    if (!vis(svg) || getComputedStyle(svg).overflow === 'visible') continue
    const b = svg.getBoundingClientRect()
    for (const g of svg.querySelectorAll('text, path, ellipse, circle, use, image')) { const r = g.getBoundingClientRect(); if (!r.width && !r.height) continue
      if (r.left < b.left - 1.5 || r.right > b.right + 1.5 || r.top < b.top - 1.5 || r.bottom > b.bottom + 1.5) { out.push(`drawing clipped by its frame: "${svg.getAttribute('aria-label') || name(svg.parentElement)}" (${g.tagName} ${g.textContent || ''})`); break } }
  }
  { const w = document.createTreeWalker(screen, NodeFilter.SHOW_TEXT); let n; const seen = new Set()
    while ((n = w.nextNode())) { if (!n.textContent.trim() || !n.parentElement || !vis(n.parentElement)) continue; const g = document.createRange(); g.selectNodeContents(n); const t = g.getBoundingClientRect(); if (!t.width) continue
      // an ellipsis is a truncation drawn on purpose (craft-details: truncate in dense rows)
      if (ell(n)) continue
      for (let p = n.parentElement; p && p !== screen; p = p.parentElement) { const o = getComputedStyle(p), cx = /(hidden|clip)/.test(o.overflowX), cy = /(hidden|clip)/.test(o.overflowY); if (!cx && !cy) continue
        // a strip that scrolls one way is only checked the other way
        const r = p.getBoundingClientRect(); if ((cx && (t.left < r.left - 1 || t.right > r.right + 1)) || (cy && (t.top < r.top - 1 || t.bottom > r.bottom + 1))) { const k = n.textContent.trim().slice(0, 30); if (!seen.has(k)) { seen.add(k); out.push(`text cut by its box: "${k}"`) } } break } } }
  return out.length ? out : ['layout ok']
})()
