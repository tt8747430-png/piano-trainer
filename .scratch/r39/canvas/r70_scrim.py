# One scrim (loop round 42; Material 3's scrim, 32%): every modal layer, a sheet or a dialog, dims what is under it
# by the same amount, and on a laptop it dims the whole window, the sidebar too (a scrim drawn inside the main column
# reaches back over the 248px sidebar; where its box is already the window, the frame's own clip cuts the reach).
# Runs after every generator.
import os, re
_d = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
_scr = re.compile(r'position: absolute; inset: 0; z-index: (\d+); background: rgba\(51,41,33,\.(?:24|28|32)\)')
for _f in os.listdir(_d):
    if not _f.endswith('.dc.html'):
        continue
    _h = open(_d + _f).read()
    _inset = '0 0 0 -248px' if 'Laptop' in _f else '0'
    _n = _scr.sub(lambda m: 'position: absolute; inset: %s; z-index: %s; background: rgba(51,41,33,.32)' % (_inset, m.group(1)), _h)
    if _n != _h:
        open(_d + _f, 'w').write(_n)
