# Builds the Practice overview's phone and laptop artboards. Run: python3 -I practice.py
OUT = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
INK, HONEY, SAND, LINE = '#1A1612', '#E8762F', '#F3EEE7', '#CFC6BA'
PHONE_FRAME, LAPTOP_FRAME = '/_blob/2fd798458923e267dd22b7a996a98294', '/_blob/0526d4830b1e952a0ab4ba3ffc2765fc'
WALL, BARIMG = '/_blob/f871bb10e202ef4d610c06d6f5fa0603', '/_blob/f266599616a3d0c813d8daf482613b7f'
SH = '0 0 0 1px rgba(26,22,18,0.05), 0 1px 2px rgba(26,22,18,0.06), 0 3px 10px -4px rgba(26,22,18,0.10)'

def kb(lit_w=(), lit_b=(), n=8):
    w = 48 / n
    s = ''.join('<rect x="%.1f" y="12" width="%.1f" height="32" rx="1.5" fill="%s" stroke="%s" stroke-width="0.8"></rect>' % (4 + i * w, w, HONEY if i in lit_w else '#FFFFFF', LINE) for i in range(n))
    for j, i in enumerate([0, 1, 3, 4, 5, 7, 8][:n - 1]):
        if i >= n - 1: continue
        s += '<rect x="%.1f" y="12" width="%.1f" height="19" rx="1" fill="%s"></rect>' % (4 + (i + 1) * w - w * 0.3, w * 0.6, HONEY if i in lit_b else INK)
    return s

def staff(y0=16, step=6, x1=4, x2=52):
    return ''.join('<line x1="%d" x2="%d" y1="%d" y2="%d" stroke="%s" stroke-width="0.8"></line>' % (x1, x2, y0 + i * step, y0 + i * step, INK) for i in range(5))

def note(x, y, up=True, fill=INK):
    st = '<line x1="%.1f" x2="%.1f" y1="%.1f" y2="%.1f" stroke="%s" stroke-width="1"></line>' % (x + 2.6 if up else x - 2.6, x + 2.6 if up else x - 2.6, y, y - 15 if up else y + 15, fill)
    return '<ellipse cx="%.1f" cy="%.1f" rx="3" ry="2.2" transform="rotate(-20 %.1f %.1f)" fill="%s"></ellipse>%s' % (x, y, x, y, fill, st)

SERIF = "font-family=\"Instrument Serif, Georgia, serif\""
PIC = {
 'chords': kb((0, 2, 4)),
 'scales': staff() + ''.join(note(10 + i * 7.5, 43 - i * 3, True, HONEY if i == 0 else INK) for i in range(6)),
 'intervals': kb((0, 4)) + '<path d="M7 9 C 14 1, 30 1, 37 9" fill="none" stroke="%s" stroke-width="1.6" stroke-linecap="round"></path>' % HONEY,
 'progressions': '<text x="28" y="26" text-anchor="middle" %s font-size="15" fill="%s">I · IV</text><text x="28" y="44" text-anchor="middle" %s font-size="15" fill="%s">V · I</text>' % (SERIF, INK, SERIF, HONEY),
 'accompaniment': staff() + ''.join(note(10 + i * 7.5, y, True) for i, y in enumerate([43, 31, 37, 31, 43, 31])) + '<path d="M12.6 16 H50.1" stroke="%s" stroke-width="2.4"></path>' % INK,
 'chordplayer': ''.join('<rect x="%d" y="%d" width="22" height="18" rx="5" fill="%s"></rect><text x="%d" y="%d" text-anchor="middle" %s font-size="12" fill="%s">%s</text>' % (x, y, HONEY if c == 'Am' else SAND, x + 11, y + 13, SERIF, '#FFFFFF' if c == 'Am' else INK, c) for (x, y, c) in [(5, 8, 'C'), (29, 8, 'Am'), (5, 30, 'F'), (29, 30, 'G')]),
 'exercises': staff() + ''.join(note(8 + i * 6, y, True) for i, y in enumerate([43, 40, 37, 34, 31, 34, 37, 40])),
 'quiz': '<rect x="9" y="8" width="38" height="40" rx="7" fill="#FFFFFF" stroke="%s"></rect><text x="28" y="33" text-anchor="middle" %s font-size="18" fill="%s">Dm?</text>' % (LINE, SERIF, INK),
 'metronome': '<path d="M20 46 L25 10 H31 L36 46 Z" fill="%s" stroke="%s" stroke-width="1.2" stroke-linejoin="round"></path><line x1="28" x2="38" y1="40" y2="12" stroke="%s" stroke-width="2" stroke-linecap="round"></line><circle cx="35.5" cy="19" r="2.6" fill="%s"></circle>' % (SAND, INK, HONEY, HONEY),
 'tuner': '<path d="M10 38 A 18 18 0 0 1 46 38" fill="none" stroke="%s" stroke-width="3" stroke-linecap="round"></path><path d="M24 21 A 18 18 0 0 1 32 21" fill="none" stroke="%s" stroke-width="3"></path><line x1="28" x2="31" y1="38" y2="18" stroke="%s" stroke-width="2" stroke-linecap="round"></line><circle cx="28" cy="38" r="2.6" fill="%s"></circle><text x="28" y="52" text-anchor="middle" font-size="8" font-weight="700" fill="%s" font-family="Instrument Sans, sans-serif">A4</text>' % (LINE, HONEY, INK, INK, INK),
 'finder': kb((1, 3, 5)) + '<circle cx="42" cy="40" r="7" fill="#FFFFFF" stroke="%s" stroke-width="2"></circle><line x1="47" x2="52" y1="45" y2="50" stroke="%s" stroke-width="2.4" stroke-linecap="round"></line>' % (INK, INK),
 'circle': '<circle cx="28" cy="28" r="20" fill="none" stroke="%s"></circle>' % LINE + ''.join('<text x="%.1f" y="%.1f" text-anchor="middle" %s font-size="10" fill="%s">%s</text>' % (28 + 15 * __import__('math').sin(a * 0.5236), 31.5 - 15 * __import__('math').cos(a * 0.5236), SERIF, HONEY if k == 'C' else INK, k) for a, k in enumerate(['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'])),
}

GROUPS = [
 ('Harmony', [('chords', 'Chords', 'Every chord, its inversions and fingering', '12 of 48'), ('scales', 'Scales and keys', 'Scales as the books finger them, their chords', '5 of 24'), ('intervals', 'Intervals', 'Every interval, seen and heard', ''), ('progressions', 'Progressions', 'Known progressions in any key', '')]),
 ('Playing', [('accompaniment', 'Accompaniment', 'Left-hand patterns for any chord sheet', ''), ('chordplayer', 'Chord player', 'Your chord sheet, played by a band', ''), ('exercises', 'Exercises', 'Five-finger drills, Hanon, a tempo ladder', ''), ('quiz', 'Quiz', 'Chords, keys and intervals by ear and eye', '')]),
 ('Tools', [('metronome', 'Metronome', 'Clicks or drums, any meter', ''), ('tuner', 'Tuner', 'How in tune a note is', ''), ('finder', 'Chord finder', 'Play a chord, see its name', ''), ('circle', 'Circle of fifths', 'Every key, its signature and chords', '')]),
]
TOOLS_MENU = GROUPS[2][1]

def pic(k, size, bg='#FFFFFF'):
    return '<span aria-hidden="true" style="flex: none; width: %dpx; height: %dpx; border-radius: %dpx; background: %s; box-shadow: inset 0 0 0 1px #E9E2D8; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 56 56" width="%d" height="%d">%s</svg></span>' % (size, size, size // 4, bg, size, size, PIC[k])

CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B3A99E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>'
TOOLS_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8L13.5 3h-3ZM12 15l5-7"></path></svg>'
SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>'

def row(k, name, line, meta, first):
    m = '<span style="font-size: 13px; color: #6B6259; font-variant-numeric: tabular-nums">%s</span>' % meta if meta else ''
    return '<a href="#" style="min-height: 72px; box-sizing: border-box; padding: 10px 12px; display: flex; align-items: center; gap: 14px; color: inherit; text-decoration: none; border-top: %s">%s<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px"><span style="font-size: 17px; font-weight: 600">%s</span><span style="font-size: 14px; color: #6B6259; line-height: 1.3">%s</span></span>%s%s</a>' % ('0' if first else '1px solid #E9E2D8', pic(k, 52), name, line, m, CHEV)

def menu(pos):
    items = ''.join('<a href="#" role="menuitem" onClick="{{closeMenu}}" style="min-height: 52px; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 4px 8px; color: #1A1612; text-decoration: none">%s<span style="display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 600">%s</span><span style="font-size: 13px; color: #6B6259">%s</span></span></a>' % (pic(k, 40), n, l) for k, n, l, _ in TOOLS_MENU)
    return '<sc-if value="{{menu}}" hint-placeholder-val="{{false}}"><div onClick="{{closeMenu}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" aria-label="Tools" style="position: absolute; %s; z-index: 61; width: 300px; border-radius: 16px; background: #FFFFFF; padding: 6px; box-shadow: 0 0 0 1px rgba(26,22,18,0.05), 0 2px 4px rgba(26,22,18,0.08), 0 18px 40px -12px rgba(26,22,18,0.28)">%s</div></sc-if>' % (pos, items)

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>%s</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&amp;family=Instrument+Serif&amp;display=swap">
<style>
body{margin:0}
button{font:inherit;cursor:pointer}
.nos{scrollbar-width:none}.nos::-webkit-scrollbar{display:none}
main>*,[role=dialog]>*{flex:none}
.card:hover{transform:translateY(-1px)}
</style>
</helmet>
'''
SCRIPT = '''</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":%d,"height":%d}}'>
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const menu = st.menu ?? false;
    return { menu, toggleMenu: () => this.setState({ menu: !menu }), closeMenu: () => this.setState({ menu: false }) };
  }
}
</script>
</body>
</html>
'''
STATUS = '<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 402px; height: 54px; z-index: 50; background: #F7F3EE; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 6px 34px 0 50px; font: 600 17px -apple-system, system-ui, sans-serif"><span>9:41</span><span style="display: flex; align-items: center; gap: 6px"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"></rect><rect x="5" y="5.5" width="3" height="6.5" rx="1"></rect><rect x="10" y="3" width="3" height="9" rx="1"></rect><rect x="15" y="0" width="3" height="12" rx="1"></rect></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4"></rect><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"></rect><rect x="25" y="4.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"></rect></svg></span></div>'

def tabbar(active):
    tabs = [('Learn', 'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 2 9 2 12 0v-5'), ('Songs', 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'), ('Practice', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'), ('Profile', 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0')]
    return '<nav aria-label="Main" style="position: absolute; left: 0; right: 0; bottom: 0; height: 83px; z-index: 40; box-sizing: border-box; padding: 6px 12px 0; background: rgba(251,248,243,0.96); box-shadow: 0 -1px 0 #E9E2D8; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: start">' + ''.join('<a href="#"%s style="height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: %s; text-decoration: none; font-size: 11px; font-weight: %d"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg>%s</a>' % (' aria-current="page"' if n == active else '', INK if n == active else '#6B6259', 700 if n == active else 600, '2.1' if n == active else '1.9', d, n) for n, d in tabs) + '</nav>'

def upnext(big):
    s = 64 if not big else 96
    return f'''<section aria-labelledby="next" style="display: flex; flex-direction: column; gap: 10px">
<h2 id="next" style="margin: 0; font-size: 20px; font-weight: 700">Up next</h2>
<div style="{'display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 20px; align-items: stretch' if big else 'display: flex; flex-direction: column; gap: 10px'}">
<div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; padding: 16px; display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; gap: 14px; align-items: center">{pic('chords', s, '#FDF1E8')}<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 600; color: #B4541A">From Amazing Grace</span><span style="font-size: {22 if big else 19}px; font-weight: 700; line-height: 1.2">D7 and its inversions</span><span style="font-size: 14px; color: #6B6259">The chord before bar 12 · about 5 minutes</span></span></div>
<a href="#" style="height: 48px; border-radius: 12px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; font-size: 16px; font-weight: 700"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>Start</a>
</div>
<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{row('scales', 'G major scale, hands together', 'Step 3 of the tempo ladder · 72 BPM', '', True)}{row('quiz', 'Name the triad', 'Yesterday 14 of 20 · five minutes', '', False)}{row('accompaniment', 'Waltz pattern in G', 'For Amazing Grace, in 3/4', '', False) if big else ''}</div>
</div>
</section>'''

# ---------- phone ----------
groups_phone = ''.join(f'''<section aria-labelledby="g{i}" style="display: flex; flex-direction: column; gap: 10px"><h2 id="g{i}" style="margin: 0; font-size: 20px; font-weight: 700">{g}</h2><div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{''.join(row(k, n, l, m, j == 0) for j, (k, n, l, m) in enumerate(items))}</div></section>''' for i, (g, items) in enumerate(GROUPS))
phone = HEAD % 'Practice, phone' + f'''<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612">
{STATUS}
<main class="nos" style="position: absolute; left: 0; right: 0; top: 54px; bottom: 83px; overflow-y: auto; box-sizing: border-box; padding: 6px 16px 32px; display: flex; flex-direction: column; gap: 24px">
<header style="display: flex; align-items: center; gap: 8px; padding-top: 6px"><h1 style="flex: 1; margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.015em">Practice</h1>
<button type="button" aria-expanded="{{{{menu}}}}" onClick="{{{{toggleMenu}}}}" style="flex: none; height: 44px; padding: 0 14px 0 12px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600">{TOOLS_ICON}Tools</button>
<button type="button" aria-label="Search Practice" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; display: flex; align-items: center; justify-content: center">{SEARCH}</button></header>
{upnext(False)}
{groups_phone}
</main>
{tabbar('Practice')}
{menu('right: 68px; top: 112px')}
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #1A1612; z-index: 90"></div>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
''' + SCRIPT % (450, 920)
open(OUT + 'Main.dc.html', 'w').write(phone)

# ---------- laptop ----------
def card(k, n, l, m):
    meta = '<span style="font-size: 13px; color: #6B6259">%s</span>' % m if m else ''
    return f'''<a href="#" class="card" style="min-width: 0; border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; padding: 14px; display: flex; flex-direction: column; gap: 12px; color: inherit; text-decoration: none; transition: transform 0.15s"><span aria-hidden="true" style="height: 112px; border-radius: 12px; background: #FBF8F3; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 56 56" width="96" height="96">{PIC[k]}</svg></span><span style="display: flex; align-items: baseline; gap: 8px"><span style="flex: 1; font-size: 17px; font-weight: 600">{n}</span>{meta}</span><span style="font-size: 14px; color: #6B6259; line-height: 1.35; margin-top: -6px">{l}</span></a>'''
SIDE = '''<nav aria-label="Main" style="background: #FBF8F3; box-shadow: 1px 0 0 #E9E2D8; padding: 24px 14px; display: flex; flex-direction: column; gap: 6px">
<div style="height: 44px; display: flex; align-items: center; padding: 0 10px; font-family: 'Instrument Serif', Georgia, serif; font-size: 27px">Piano Trainer</div>
<label style="margin: 10px 0; height: 44px; box-sizing: border-box; padding: 0 12px; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; display: flex; align-items: center; gap: 8px; color: #6B6259">%s<span style="flex: 1; font-size: 15px">Search</span><kbd style="font: 500 12px 'Instrument Sans', sans-serif; color: #8A8178; padding: 2px 6px; border-radius: 6px; background: #F3EEE7">Ctrl K</kbd></label>
%s
<span style="flex: 1"></span>
<a href="#" style="min-height: 52px; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 0 10px; color: #1A1612; text-decoration: none"><span aria-hidden="true" style="width: 32px; height: 32px; border-radius: 9999px; background: #E9D8C4; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">G</span><span style="display: flex; flex-direction: column"><span style="font-size: 15px; font-weight: 600">Guest</span><span style="font-size: 13px; color: #6B6259">Profile</span></span></a>
</nav>''' % (SEARCH, ''.join('<a href="#"%s style="height: 44px; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 0 12px; background: %s; color: %s; text-decoration: none; font-size: 16px; font-weight: %d"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg>%s</a>' % (' aria-current="page"' if n == 'Practice' else '', '#EAE2D7' if n == 'Practice' else 'transparent', INK if n == 'Practice' else '#4A433C', 600 if n == 'Practice' else 500, d, n) for n, d in [('Learn', 'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 2 9 2 12 0v-5'), ('Songs', 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'), ('Practice', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z')]))
groups_lap = ''.join(f'''<section aria-labelledby="g{i}" style="display: flex; flex-direction: column; gap: 12px"><h2 id="g{i}" style="margin: 0; font-size: 20px; font-weight: 700">{g}</h2><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px">{''.join(card(*it) for it in items)}</div></section>''' for i, (g, items) in enumerate(GROUPS))
laptop = HEAD % 'Practice, laptop' + f'''<div style="width: 2143px; height: 1299px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div aria-hidden="true" style="position: absolute; left: 217.7px; top: 36.6px; width: 1710px; height: 1112px; background: url({WALL}) 0 0 / 1710px 1112px no-repeat"></div>
<div aria-hidden="true" style="position: absolute; left: 217.7px; top: 36.6px; width: 1710px; height: 37px; background: rgba(255,255,255,0.28)"></div>
<div aria-hidden="true" style="position: absolute; left: 217.7px; top: 73.6px; width: 1710px; height: 51px; background: url({BARIMG}) 0 0 / 100% 100%; border-radius: 16px 16px 0 0; font: 500 14px/51px -apple-system, system-ui, sans-serif; color: #3C3C43; text-align: center">pianotrainer.app</div>
<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr)">
{SIDE}
<main class="nos" style="position: relative; overflow-y: auto; padding: 28px 40px 48px 40px; display: flex; flex-direction: column; gap: 28px">
<header style="display: flex; align-items: center; gap: 10px; height: 44px"><h1 style="flex: 1; margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.015em">Practice</h1>
<button type="button" aria-expanded="{{{{menu}}}}" onClick="{{{{toggleMenu}}}}" style="flex: none; height: 44px; padding: 0 16px 0 14px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600">{TOOLS_ICON}Tools</button></header>
{upnext(True)}
{groups_lap}
</main>
{menu('right: 40px; top: 80px')}
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
''' + SCRIPT % (2143, 1299)
open(OUT + 'Laptop.dc.html', 'w').write(laptop)
print('ok')
