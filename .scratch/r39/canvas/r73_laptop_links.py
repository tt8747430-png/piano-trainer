# ════ The last pass: a laptop board links only to laptop boards ════
# A board's phone link (Settings.dc.html) inside a *Laptop board opens the phone frame on a laptop; every link to a
# phone board that has a laptop board is pointed at it, so the two sizes never cross.
import os, re
_P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project'
_have = {f[:-8] for f in os.listdir(_P) if f.endswith('.dc.html')}
_lap = lambda stem: 'Laptop' if stem == 'Main' else stem + 'Laptop'
_n = 0
for f in sorted(os.listdir(_P)):
    if not f.endswith('Laptop.dc.html') and f != 'Laptop.dc.html':
        continue
    src = open(os.path.join(_P, f)).read()
    def _fix(m):
        global _n
        stem = m.group(1)
        if stem.endswith('Laptop') or stem == 'Laptop' or _lap(stem) not in _have:
            return m.group(0)
        _n += 1
        return f'href="{_lap(stem)}.dc.html"'
    out = re.sub(r'href="([A-Za-z]+)\.dc\.html"', _fix, src)
    if out != src:
        open(os.path.join(_P, f), 'w').write(out)
print('laptop links', _n)
