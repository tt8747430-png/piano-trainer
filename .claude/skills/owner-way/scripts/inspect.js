// The checks a still shot hides, run in the page (references/testing.md, "What the shots check").
// Returns one line for each thing found: text cut off, things on top of each other, a floating
// layer over text, a target under 44px on a touch screen. Read by shots.mjs; kept free of imports.
(at = 'top') => {
  const found = []
  const layered = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const p = getComputedStyle(e).position
      if (p === 'fixed' || p === 'sticky') return e
    }
    return null
  }
  const name = (el) => {
    const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 40) || ''
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${label ? ` “${label}”` : ''}`
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return false
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false
    const cs = getComputedStyle(el)
    return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05
  }
  const hidden = (el) => el.closest('[aria-hidden="true"], [inert], .sr-only')
  // A piano's keys sit on each other by design and are sized by the keyboard, not as targets.
  const isKey = (el) => /^[A-G]( sharp| flat)?\s?-?\d$|^Bar \d+|^Такт \d+/.test(el.getAttribute('aria-label') ?? '')
  const inScore = (el) => el.closest('svg') && el.closest('[data-slot="score"]')
  // 1. Text cut: a box narrower than its text with no ellipsis, or a line clamp hiding a word.
  const texts = [...document.querySelectorAll('body *')].filter(
    (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && visible(el) && !hidden(el),
  )
  for (const el of texts) {
    const cs = getComputedStyle(el)
    if (el.scrollWidth > el.clientWidth + 1 && cs.textOverflow !== 'ellipsis' && cs.overflowX !== 'visible')
      found.push(`CUT ${name(el)}: ${el.scrollWidth - el.clientWidth}px of text hidden`)
  }
  // 2. Text and controls on top of each other: two leaf boxes that cross, neither inside the other.
  const leaves = [
    ...texts,
    ...document.querySelectorAll('button, a, [role="button"], input, svg:not(svg svg)'),
  ].filter((el) => visible(el) && !hidden(el) && !inScore(el) && !isKey(el))
  const boxes = leaves.map((el) => [el, el.getBoundingClientRect()])
  const cross = (a, b, m = 2) =>
    a.left + m < b.right && b.left + m < a.right && a.top + m < b.bottom && b.top + m < a.bottom
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const [a, ra] = boxes[i]
      const [b, rb] = boxes[j]
      if (a.contains(b) || b.contains(a) || !cross(ra, rb)) continue
      // Content scrolling under a bar or a floating button is COVERED's question, not this one's.
      if (layered(a) !== layered(b)) continue
      // Only what is drawn on top counts: the topmost element at the crossing's centre must be one of them.
      const x = (Math.max(ra.left, rb.left) + Math.min(ra.right, rb.right)) / 2
      const y = (Math.max(ra.top, rb.top) + Math.min(ra.bottom, rb.bottom)) / 2
      const top = document.elementFromPoint(x, y)
      if (!top || !(a.contains(top) || b.contains(top) || top.contains(a) || top.contains(b))) continue
      found.push(`OVERLAP ${name(a)} × ${name(b)} at ${Math.round(x)},${Math.round(y)}`)
    }
  // 3. A floating layer (fixed or sticky) over text that is not its own: a pill over a title.
  const layers = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el)
    const p = cs.position
    // Bars and floating pills: fixed or sticky, or placed absolutely above the page (a z-index).
    const floats = p === 'fixed' || p === 'sticky' || (p === 'absolute' && Number(cs.zIndex) >= 10)
    return floats && visible(el) && !hidden(el)
  })
  for (const layer of layers) {
    const r = layer.getBoundingClientRect()
    if (r.width >= innerWidth - 2 && r.height >= innerHeight - 2) continue // a sheet's backdrop
    // What scrolls can be scrolled out from under a layer, except at the page's end (a layer low on
    // the screen) or at its start (a layer high on it): only there is it hidden for good.
    const low = r.top > innerHeight / 2
    // A layer that holds neither edge (a sticky preview in mid-page) is a fault at every scroll.
    const edged = r.top < 16 || r.bottom > innerHeight * 0.75
    if (edged && at !== 'only' && ((low && at !== 'end') || (!low && at !== 'top'))) continue
    for (const el of texts) {
      if (layer.contains(el) || el.contains(layer)) continue
      const t = el.getBoundingClientRect()
      if (!cross(r, t, 4)) continue
      const top = document.elementFromPoint((t.left + t.right) / 2, (t.top + t.bottom) / 2)
      if (top && layer.contains(top))
        found.push(`COVERED ${name(el)} under ${name(layer)}`)
    }
  }
  // 4. A backdrop that leaves a band of the page uncovered while a dialog is open.
  const dialog = document.querySelector('[role="dialog"], [role="alertdialog"]')
  if (dialog && visible(dialog)) {
    for (const y of [2, innerHeight * 0.25, innerHeight * 0.5]) {
      const top = document.elementFromPoint(innerWidth / 2, y)
      if (top && !dialog.contains(top) && !top.closest('[data-backdrop], [class*="backdrop"], [class*="overlay"]')) {
        const cs = getComputedStyle(top)
        if (!/blur/.test(cs.backdropFilter ?? '') && !top.closest('header')) found.push(`UNCOVERED page at y=${Math.round(y)} beside an open dialog: ${name(top)}`)
      }
    }
  }
  // 5. Touch targets.
  if (matchMedia('(pointer: coarse)').matches)
    for (const el of document.querySelectorAll('button, a[href], [role="button"], [role="tab"], [role="radio"]')) {
      if (!visible(el) || hidden(el) || isKey(el)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 40 || r.height < 40) found.push(`SMALL ${name(el)}: ${Math.round(r.width)}×${Math.round(r.height)}`)
    }
  return [...new Set(found)]
}
