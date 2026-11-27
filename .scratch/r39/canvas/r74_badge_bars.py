# Badges show how near the next tier is as a bar under their line (loop round 62; Tiny Instrument's
# locked-badge progress, scan-first 3: a picture where one exists): Profile's three and the Badges page,
# both sizes, in the learned paint, no count beside it (the line says it). Run after r50_profile.py.
import re

OUT74 = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
src74 = open('/home/user/piano-trainer/.scratch/r39/canvas/r50_profile.py').read()
ns = {}
exec(re.search(r'^BADGES9 = \[.*?\n(?=[A-Z_0-9]+ = )', src74, re.S | re.M).group(0), ns)
BAR = ('<span aria-hidden="true" style="display: block; height: 6px; margin-top: 4px; border-radius: 9999px; background: #EEE9E2; overflow: hidden">'
       '<span style="display: block; height: 100%; width: WW; border-radius: 9999px; background: #44684A"></span></span>')


def pct(b):
    nx = next((t for t in b[4] if not t[2].startswith('Reached')), None)
    return None if not nx else round(100 * int(b[5].split()[0]) / int(nx[1].split()[0]))


for f in ('Profile.dc.html', 'ProfileLaptop.dc.html'):
    s = open(OUT74 + f).read()
    if 'width: {{x.pct}}%' in s:
        continue
    a = 'font-size: 14px; color: #685E56">{{x.sub}}</span>'
    s = s.replace(a, a + BAR.replace('WW', '{{x.pct}}%').replace('display: block; height: 6px', 'display: {{x.barShow}}; height: 6px', 1))
    s = s.replace("med: MEDC[tier], open: () => S({ page: n }) }));",
                  "med: MEDC[tier], ...((b) => { const nx = b[4].find((x) => !x[2].startsWith('Reached')); return nx ? { pct: Math.round(100 * parseInt(b[5], 10) / parseInt(nx[1], 10)), barShow: 'block' } : { pct: 100, barShow: 'none' }; })(BADGES.find((b) => b[0] === n)), open: () => S({ page: n }) }));")
    for b in ns['BADGES9']:
        p = pct(b)
        k = 'font-weight: 600">' + b[0] + '</span><span style="font-size: 14px; color: #685E56">'
        i = s.find(k)
        if p is None or i < 0:
            continue
        j = s.index('</span>', i + len(k)) + 7
        s = s[:j] + BAR.replace('WW', f'{p}%') + s[j:]
    open(OUT74 + f, 'w').write(s)
print('badge bars ok')
