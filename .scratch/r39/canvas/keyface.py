"""The one piano (canvas 167, owner 2026-11-13: "this piano doesn't look like the piano be design from the piano
player or chords play"): every 2D keyboard on every board wears the app's keys (src/styles/theme.css key-face-*,
key-felt; src/shared/ui/piano-keyboard/Key.tsx): the felt along the far end, ivory keys lit from the player's side
with a lip, ebony keys bevelled with a sheen and a sloped front, both with rounded feet, on the key bed. A board's
keyboard only names its keys (sc-for over *.whites / *.blacks, kbw / kbb); this pass gives them their faces, once,
for every board, Day and Night."""
import re
KEYCSS = ('<style data-keys>'
  '.pk { background: #CBC2B9 !important; isolation: isolate }'
  '.pk::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 4px; z-index: 5; pointer-events: none;'
  ' background: linear-gradient(to bottom, #7C302C, #57211F); box-shadow: 0 2px 3px rgba(51,41,33,.22) }'
  '.pk-w { border-radius: 0 0 5px 5px !important; border-right: 1px solid #CBC2B9 !important;'
  ' box-shadow: inset 1px 0 0 rgba(255,255,255,.6), inset -1px 0 0 rgba(51,41,33,.12), 0 1px 2px rgba(51,41,33,.22) !important }'
  '.pk-w::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;'
  ' background: linear-gradient(to bottom, rgba(51,41,33,.16) 0, transparent 16%, transparent 80%, rgba(51,41,33,.06) 100%) }'
  '.pk-w::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 6px; border-radius: 0 0 5px 5px; pointer-events: none;'
  ' background: linear-gradient(to bottom, rgba(255,255,255,.6), rgba(51,41,33,.14)) }'
  '.pk-b { z-index: 2; border-radius: 0 0 3px 3px !important;'
  ' box-shadow: inset 2px 0 0 rgba(255,255,255,.12), inset -2px 0 0 rgba(51,41,33,.22), 1px 3px 4px rgba(51,41,33,.22) !important }'
  '.pk-b::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;'
  ' background: linear-gradient(to bottom, rgba(51,41,33,.22) 0, transparent 10%, rgba(255,255,255,.12) 84%, transparent 100%) }'
  '.pk-b::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 8px; border-radius: 0 0 3px 3px; pointer-events: none;'
  ' background: linear-gradient(to bottom, rgba(255,255,255,.12), rgba(51,41,33,.3)) }'
  '.pk-w > *, .pk-b > * { position: relative; z-index: 1 }'
  '[data-night] .pk { background: #787069 !important } [data-night] .pk-w { border-right-color: #787069 !important;'
  ' box-shadow: inset 1px 0 0 rgba(255,255,255,.22), inset -1px 0 0 rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.45) !important }'
  '[data-night] .pk::before { background: linear-gradient(to bottom, #5A2422, #3A1716); box-shadow: 0 2px 3px rgba(0,0,0,.45) }'
  '[data-night] .pk-w::before { background: linear-gradient(to bottom, rgba(0,0,0,.35) 0, transparent 16%, transparent 80%, rgba(0,0,0,.12) 100%) }'
  '[data-night] .pk-w::after { background: linear-gradient(to bottom, rgba(255,255,255,.22), rgba(0,0,0,.3)) }'
  '[data-night] .pk-b { box-shadow: inset 2px 0 0 rgba(255,255,255,.1), inset -2px 0 0 rgba(0,0,0,.45), 1px 3px 4px rgba(0,0,0,.45) !important }'
  '</style>')
LIST = r'\{\{[\w.]*?(?:\.|\b)(whites|blacks|kbw|kbb)\}\}'
FELT = re.compile(r'<div style="position: absolute; left: 0; right: 0; top: 0; height: [34]px; background: #(?:7C302C|5A2422)"></div>')
def keyface(h):
    if 'data-keys' in h or not re.search(LIST, h): return h
    # each key's face: the first element inside the sc-for over the white or black keys
    h = re.sub(r'(<sc-for list="' + LIST + r'" as="k"[^>]*>)<(span|button)',
               lambda m: m.group(1) + '<' + m.group(3) + ' class="' + ('pk-w' if m.group(2) in ('whites', 'kbw') else 'pk-b') + '"', h)
    # the keyboard: the element that holds the white keys' sc-for
    h = re.sub(r'<div( role="img"[^>]*?| aria-hidden="true")? style="(position: relative;[^"]*)">(?=<sc-for list="' + LIST + ')',
               lambda m: '<div class="pk"' + (m.group(1) or '') + ' style="' + m.group(2) + '">', h)
    h = FELT.sub('', h)
    return h.replace('</head>', KEYCSS + '</head>', 1)
