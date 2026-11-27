# One motion for the Player and the editor (the loop, 2026-11-26): every Player and editor board, phone and laptop,
# carries the kit's PE_MOTION and PE_FOCUS once. Runs after every generator.
import os
_d = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
for _f in sorted(os.listdir(_d)):
    if not (_f.startswith('Player') or _f.startswith('Editor')) or not _f.endswith('.dc.html'):
        continue
    _h = open(_d + _f).read()
    if 'role="dialog"' not in _h and 'role="menu"' not in _h:
        continue  # a redirect to its layer's board
    if '<style data-motion>' in _h or '<style data-focus>' in _h:
        raise SystemExit(f'{_f} already has a motion or focus layer: fold it into PE_MOTION or PE_FOCUS')
    open(_d + _f, 'w').write(_h.replace('</head>', PE_MOTION + PE_FOCUS + '</head>', 1))
