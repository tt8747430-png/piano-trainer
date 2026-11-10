(() => { const c = { text: {}, bg: {}, radius: {}, shadow: {}, weight: {} }; const add = (o, k) => { o[k] = (o[k] || 0) + 1; };
[...document.querySelectorAll('main *, main, [role=dialog] *, [role=dialog], button')].forEach((e) => { if (e.closest('svg') || !e.getBoundingClientRect().width) return; const s = getComputedStyle(e);
  if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) { add(c.text, s.color); add(c.weight, s.fontWeight); }
  if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') add(c.bg, s.backgroundColor);
  if (s.borderRadius !== '0px') add(c.radius, s.borderRadius + ' @' + Math.round(e.getBoundingClientRect().height));
  if (s.boxShadow !== 'none') add(c.shadow, s.boxShadow); });
return JSON.stringify(c); })()
