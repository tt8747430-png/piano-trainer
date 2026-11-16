# One tooltip (loop round 49; scan-first 8, HIG "help tags", Material 3 plain tooltips): every icon-only control names
# itself on a pointer after a short wait, on every board, with the one style the Chords page set (canvas 99). A
# control is icon-only when it holds an icon and no words; piano keys and beat cells hold no icon and get none.
# Runs after every generator.
import os, re
_d = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
_TIPCSS = ('<style data-tips>@media (hover: hover) { [data-tip]::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 8px); z-index: 90;'
           ' translate: -50% 4px; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; font: 500 12px/16px Onest, system-ui, sans-serif;'
           ' white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 120ms ease-out, translate 120ms ease-out }'
           ' [data-tip-up]::after { top: auto; bottom: calc(100% + 8px); translate: -50% -4px }'
           ' body:not(:has([role=dialog])) [data-tip]:hover::after { opacity: 1; translate: -50% 0; transition-delay: 500ms } }'
           '[data-tip]:not([style*="position: absolute"]) { position: relative } body:not(:has([role=dialog])) [data-tip]:hover { z-index: 95 }</style>')
_ctl = re.compile(r'<(button|a)\b([^>]*)>(.*?)</\1>', re.S)
def _tip(m):
    tag, attrs, inner = m.groups()
    if 'data-tip' in attrs or '<svg' not in inner or re.sub(r'<svg.*?</svg>|<[^>]+>', '', inner, flags=re.S).strip():
        return m.group(0)
    if re.search(r'role="(radio|switch|tab|option|menuitem)"', attrs):
        return m.group(0)
    al = re.search(r'aria-label="([^"]+)"', attrs)
    if not al:
        return m.group(0)
    # what sits low on the screen (the floating actions, a bar at the foot) names itself above
    up = ' data-tip-up' if re.search(r'bottom: \d+px', attrs) else ''
    return '<%s%s data-tip="%s"%s>%s</%s>' % (tag, attrs, al.group(1), up, inner, tag)
_n_ctl = 0
for _f in sorted(os.listdir(_d)):
    if not _f.endswith('.dc.html'):
        continue
    _h = open(_d + _f).read()
    _n = _ctl.sub(_tip, _h)
    if 'content: attr(data-tip)' not in _n and 'data-tip=' in _n:
        _n = _n.replace('</style>', '</style>' + _TIPCSS, 1) if '</style>' in _n else _n.replace('</head>', _TIPCSS + '</head>', 1)
    if _n != _h:
        _n_ctl += _n.count('data-tip=') - _h.count('data-tip=')
        open(_d + _f, 'w').write(_n)
print('tips added:', _n_ctl)
