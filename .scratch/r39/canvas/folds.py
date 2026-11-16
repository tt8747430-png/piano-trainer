# Sections fold on the overview pages (owner, 2026-11-15: "the main focus of the page and the other things can be easily
# hide or show … for every screen"): each section's heading is a disclosure (Apple HIG, Disclosure controls; Material 3
# lists' expandable sections), its chevron down when open and turned to the side when folded; the content goes, the
# heading stays where it was, so a folded page is a short list of what the learner can open again.
import re

FOLD_BOARDS = ('Learn', 'LearnLaptop', 'Main', 'Laptop', 'Profile', 'ProfileLaptop')
_FOLDROW = '<div style="display: flex; align-items: baseline; justify-content: space-between; margin: 0 4px"><h2 style="margin: 0; font-size: 20px; font-weight: 700">'
_FOLDCHEV = ('<svg data-foldchev viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" '
         'stroke-linejoin="round" aria-hidden="true" style="flex: none; opacity: 0.55"><path d="m6 9 6 6 6-6"></path></svg>')
_FOLDCSS = ('<style data-foldcss>[data-foldhead][data-folded="true"] + * { display: none !important }'
        ' [data-foldchev] { transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1) }'
        ' [data-folded="true"] [data-foldchev] { transform: rotate(-90deg) }'
        ' [data-foldbtn]:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 6px }'
        ' @media (prefers-reduced-motion: reduce) { [data-foldchev] { transition: none } }</style>')


def folds(h, stem):
    if stem not in FOLD_BOARDS or 'data-foldhead' in h or _FOLDROW not in h:
        return h
    n = [0]
    def one(m):
        i = n[0]; n[0] += 1
        return ('<div data-foldhead data-folded="{{fold%d}}" style="display: flex; align-items: center; justify-content: space-between; margin: 0 4px">'
                '<h2 style="margin: 0; font-size: 20px; font-weight: 700"><button type="button" data-foldbtn aria-expanded="{{foldOpen%d}}" onClick="{{foldT%d}}" '
                'style="min-height: 44px; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; display: inline-flex; align-items: center; gap: 6px; cursor: pointer">'
                '%s%s</button></h2>' % (i, i, i, m.group(1), _FOLDCHEV))
    h = re.sub(re.escape(_FOLDROW) + r'([^<]*)</h2>', one, h)
    js = ('\n{ const R = Component.prototype.renderVals; Component.prototype.renderVals = function () {\n'
          '  const v = R.call(this), st = this.state || {}, f = st.folds || {}, o = {};\n'
          '  for (let i = 0; i < %d; i++) { o["fold" + i] = f[i] ? "true" : "false"; o["foldOpen" + i] = f[i] ? "false" : "true";\n'
          '    o["foldT" + i] = () => this.setState({ folds: Object.assign({}, f, { [i]: !f[i] }) }); }\n'
          '  return Object.assign({}, v, o);\n}; }\n') % n[0]
    h = h.replace('</head>', _FOLDCSS + '</head>', 1)
    k = h.rindex('</script>')
    return h[:k] + js + h[k:]
