// Shared by the decision comps: draws a keyboard from C3 to B4 with role-marked keys.
function keyboard(el, marks) {
  const whites = [], blacks = []
  for (let m = 48; m <= 71; m++) ([1, 3, 6, 8, 10].includes(m % 12) ? blacks : whites).push(m)
  const w = 100 / whites.length
  let html = ''
  whites.forEach((m, i) => {
    const mk = marks[m]
    html += `<div class="wk ${mk ? 'r-' + mk[0] : ''}" style="left:${i * w}%;width:${w}%">${mk ? `<span>${mk[1]}</span>` : ''}</div>`
  })
  blacks.forEach((m) => {
    const i = whites.indexOf(m - 1), mk = marks[m]
    html += `<div class="bk ${mk ? 'r-' + mk[0] : ''}" style="left:${(i + 1) * w - w * 0.3}%;width:${w * 0.6}%">${mk ? `<span>${mk[1]}</span>` : ''}</div>`
  })
  el.innerHTML = html
}
const D_OVER_FSHARP = { 54: ['3rd', '3'], 62: ['root', '1'], 66: ['3rd', '3'], 69: ['5th', '5'] }
document.querySelectorAll('[data-kb]').forEach((el) => keyboard(el, D_OVER_FSHARP))
