(() => { const o=[]; const seen={};
for (const e of document.querySelectorAll('body *')) {
  if (e.closest('[data-states],[aria-label="States"],.sr-only')) continue
  const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim(); if(!own) continue
  const tn=[...e.childNodes].find(n=>n.nodeType===3&&n.textContent.trim()); const rg=document.createRange(); rg.selectNodeContents(tn); const b=rg.getBoundingClientRect(); const eb=e.getBoundingClientRect(); if(eb.width<=1||eb.height<=1||b.width===0) continue
  const s=getComputedStyle(e); if(s.visibility==='hidden'||+s.opacity===0) continue
  const t=own.replace(/\s+/g,' ').slice(0,40); seen[t]=(seen[t]||0)+1; const k=seen[t]>1?t+'#'+seen[t]:t
  o.push([k,Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height),s.fontSize,s.fontWeight,s.color])
}
return JSON.stringify(o) })()
