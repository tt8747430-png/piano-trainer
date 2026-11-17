# Loop 63 (owner, 2026-11-17: "refactor the lessons and courses … not correctly aligned … all the features from the
# insert … the keyboard so that it follows the player new floating keyboard style"; "the drag handle reserves space"):
# the lesson's column starts on the 16 gutter in both modes; a block's Move and ··· are the floating toolbar's, for
# the selected block (Craft and Notion on iOS), so nothing waits in a margin; the keys are the Player's (the dark
# frame, the felt line, keys rounded at their foot); every kind in Insert is drawn as the block it adds.
from r41_kit import *

FRAME = 'background: #2A1F18; border-radius: 20px; box-shadow: 0 0 0 1px rgba(51,41,33,.10), 0 2px 6px rgba(51,41,33,.14)'
FELT = '<div aria-hidden="true" style="position: absolute; left: 0; right: 0; top: 0; height: 5px; background: #8E2A22"></div>'
WK = 'position: absolute; top: 5px; box-sizing: border-box; border: 1px solid #CFC6BA; border-top: 0; border-radius: 0 0 5px 5px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; font-size: 12px'
BK = 'position: absolute; top: 5px; box-sizing: border-box; border-radius: 0 0 4px 4px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; font-size: 10px; font-weight: 700'

def PKEYS(lst, h):
    """The Player's keys, driven by the board's calmKeys list."""
    return (f'<div role="img" aria-label="The keys" style="position: relative; flex: none; width: 100%; height: {h + 5}px; overflow: hidden; {FRAME}">{FELT}'
            f'<sc-for list="{{{{{lst}.whites}}}}" as="k" hint-placeholder-count="14"><span style="{WK}; left: {{{{k.left}}}}px; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; background: {{{{k.bg}}}}; color: {{{{k.ink}}}}; font-weight: {{{{k.fw}}}}">{{{{k.label}}}}</span></sc-for>'
            f'<sc-for list="{{{{{lst}.blacks}}}}" as="k" hint-placeholder-count="10"><span style="{BK}; left: {{{{k.left}}}}px; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; background: {{{{k.bg}}}}; color: {INK}">{{{{k.label}}}}</span></sc-for></div>')

NAT = [0, 2, 4, 5, 7, 9, 11]
def SKEYS(lit, lo=60, hi=76, h=96, label='The keys'):
    """The same keys drawn still (a block's picture), in percentages, so one drawing fits phone and laptop."""
    ws = [m for m in range(lo, hi + 1) if m % 12 in NAT]
    w = 100 / len(ws)
    out = [f'<div role="img" aria-label="{label}" style="position: relative; flex: none; width: 100%; height: {h + 5}px; overflow: hidden; {FRAME}">{FELT}']
    for i, m in enumerate(ws):
        p = lit.get(m)
        out.append(f'<span style="{WK}; left: {i * w:.3f}%; width: {w:.3f}%; height: {h}px; background: {p[0] if p else "#FEFDFA"}; color: {INK if p else "#6B6259"}; font-weight: {700 if p else 500}">{p[1] if p else ("C" + str(m // 12 - 1) if m % 12 == 0 else "")}</span>')
    for m in range(lo, hi + 1):
        if m % 12 in NAT: continue
        i = ws.index(m - 1); p = lit.get(m)
        out.append(f'<span style="{BK}; left: {(i + 1) * w - w * 0.3:.3f}%; width: {w * 0.6:.3f}%; height: {round(h * 0.62)}px; background: {p[0] if p else "#332C28"}; color: {INK}">{p[1] if p else ""}</span>')
    return ''.join(out) + '</div>'

def ICON(d, extra=''):
    return f'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{extra}<path d="{d}"></path></svg>'
PLUS_S = ICON('M12 5v14M5 12h14').replace('width="20" height="20"', 'width="16" height="16"')
G, Y, B = '#9BC093', '#E8C67D', '#85B8DC'
PLAYB = f'<button type="button" aria-label="Play" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAY.replace("width=\"22\" height=\"22\"", "width=\"20\" height=\"20\"")}</button>'
def HEAD(t, play=True):
    return f'<div style="display: flex; align-items: center; gap: 8px; min-height: 44px"><span style="flex: 1; font-size: 17px; font-weight: 700">{t}</span>{PLAYB if play else ""}</div>'
TILE = lambda top, name, sub='': (f'<span style="flex: 1; min-width: 0; min-height: 64px; border-radius: 12px; background: {FILL}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px">'
                                  + (f'<span style="font-size: 13px; color: {SOFT}">{top}</span>' if top else '') + f'<span style="font-size: 17px; font-weight: 700">{name}</span>'
                                  + (f'<span style="font-size: 13px; color: {SOFT}">{sub}</span>' if sub else '') + '</span>')
ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
# a staff: four quarter notes C D E F in the treble
def STAFF():
    ys = [40 + 8 * i for i in range(5)]
    lines = ''.join(f'<line x1="0" x2="100%" y1="{y}" y2="{y}" stroke="#332921" stroke-width="1"></line>' for y in ys)
    notes = ''
    for i, y in enumerate([80, 76, 72, 68]):
        x = 88 + i * 64
        notes += (f'<ellipse cx="{x}" cy="{y}" rx="6" ry="4.4" transform="rotate(-20 {x} {y})" fill="#332921"></ellipse><line x1="{x + 5.5}" x2="{x + 5.5}" y1="{y - 1}" y2="{y - 30}" stroke="#332921" stroke-width="1.3"></line>'
                  + (f'<line x1="{x - 10}" x2="{x + 10}" y1="80" y2="80" stroke="#332921" stroke-width="1"></line>' if y == 80 else ''))
    return (f'<svg viewBox="0 0 370 100" preserveAspectRatio="xMinYMid meet" role="img" aria-label="C D E F on the staff" style="width: 100%; height: 100px">{lines}'
            f'<text x="4" y="78" font-size="52" fill="#332921" style="font-family: serif">𝄞</text><text x="44" y="56" font-size="18" font-weight="700" fill="#332921">4</text><text x="44" y="72" font-size="18" font-weight="700" fill="#332921">4</text>{notes}</svg>')
def ROLL():
    rows = [('G', [1, 3, 5, 7]), ('E', [2, 6]), ('C', [0, 4])]
    out = '<div role="img" aria-label="Alberti bass: C G E G" style="display: grid; grid-template-columns: 24px repeat(8, minmax(0, 1fr)); gap: 4px">'
    for n, on in rows:
        out += f'<span style="font-size: 13px; color: {SOFT}; display: flex; align-items: center">{n}</span>' + ''.join(f'<span style="height: 24px; border-radius: 6px; background: {Y if i in on else FILL}"></span>' for i in range(8))
    return out + '</div>'
LINKROW = (f'<a href="Lesson.dc.html" style="min-height: 56px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">'
           f'<span style="flex: none; width: 44px; height: 44px; border-radius: 22px; background: {FILL}; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center">6</span>'
           f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">Half steps, whole steps, sharps and flats</span><span style="font-size: 13px; color: {SOFT}">Lesson 6 · Foundations</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>')
CHIP = lambda t, on=False: f'<span style="flex: none; height: 44px; padding: 0 16px; border-radius: 22px; background: {INK if on else FILL}; color: {SHEET if on else INK}; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px">{t}</span>'
P17 = 'margin: 0; max-width: 65ch; font-size: 17px; line-height: 1.55; outline: none'

BLOCKS = {
    'Text': f'<p contenteditable="true" style="{P17}; color: {SOFT}">Write here, or type / for music.</p>',
    'Steps': f'<ol style="margin: 0; padding-left: 24px; font-size: 17px; line-height: 1.55; display: flex; flex-direction: column; gap: 4px"><li contenteditable="true" style="outline: none">Start on any key.</li><li contenteditable="true" style="outline: none; color: {SOFT}">The next step</li></ol>',
    'Note': f'<aside style="padding: 12px 16px; border-radius: 12px; background: {FILL}; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">Note</span><span contenteditable="true" style="font-size: 16px; line-height: 1.45; outline: none">A sharp raises a note by a half step; a flat lowers it.</span></aside>',
    'Rule': f'<hr style="margin: 8px 0; border: 0; height: 1px; background: {LINE}">',
    'Chords': HEAD('C · F · G') + '<div style="display: flex; gap: 8px">' + TILE('', 'C', 'C E G') + TILE('', 'F', 'F A C') + TILE('', 'G', 'G B D') + '</div>',
    'One chord on every root': HEAD('Major on every root') + '<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px">' + ''.join(f'<span style="height: 44px; border-radius: 12px; background: {INK if r == "C" else FILL}; color: {SHEET if r == "C" else INK}; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center">{r}</span>' for r in ROOTS) + '</div>' + SKEYS({60: (G, 'C'), 64: (G, 'E'), 67: (G, 'G')}),
    'Scale': HEAD('D major') + SKEYS({62: (G, 'D'), 64: (G, 'E'), 66: (Y, 'F♯'), 67: (G, 'G'), 69: (G, 'A'), 71: (G, 'B'), 73: (Y, 'C♯'), 74: (G, 'D')}),
    'Interval': HEAD('Perfect fifth · C–G') + SKEYS({60: (B, 'C'), 67: (B, 'G')}),
    'Notes': HEAD('C D E F') + STAFF(),
    'Voicings': HEAD('Cmaj7 · rootless') + '<div style="display: flex; gap: 8px">' + CHIP('Close', True) + CHIP('Rootless') + CHIP('Drop 2') + '</div>' + SKEYS({64: (G, 'E'), 67: (G, 'G'), 71: (G, 'B'), 74: (G, 'D')}, 60, 76),
    'Pattern': HEAD('Alberti bass') + ROLL(),
    'Progression': HEAD('I – IV – V – I in C') + '<div style="display: flex; gap: 8px">' + TILE('I', 'C') + TILE('IV', 'F') + TILE('V', 'G') + TILE('I', 'C') + '</div>',
    'Versions': f'<span style="font-size: 15px; font-weight: 700">Versions</span><div role="group" aria-label="Versions" style="display: flex; gap: 8px; flex-wrap: wrap">' + CHIP('C major', True) + CHIP('G major') + CHIP(PLUS_S + 'Add') + '</div>',
    'Question': HEAD('Which key is F♯?', False) + f'<span style="font-size: 14px; color: {SOFT}">Choose on the keys</span>' + SKEYS({}),
    'Link': LINKROW,
    'Picture': f'<div style="height: 160px; border-radius: 14px; box-shadow: inset 0 0 0 1.5px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: {SOFT}">{{PIC}}<button type="button" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 700">Add a picture</button></div>',
}

for k in BLOCKS: BLOCKS[k] = BLOCKS[k].replace('{PIC}', '')
ICONS = {
    'Text': ICON('M4 7V4h16v3M9 20h6M12 4v16'),
    'Steps': ICON('M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'),
    'Note': ICON('M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5ZM15 3v6h6'),
    'Rule': ICON('M5 12h14'),
    'Chords': ICON('M14 4v14', '<circle cx="11" cy="6" r="2.5"></circle><circle cx="11" cy="12" r="2.5"></circle><circle cx="11" cy="18" r="2.5"></circle>'),
    'One chord on every root': ICON('m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3'),
    'Scale': ICON('M3 20h4v-4h4v-4h4V8h4V4'),
    'Interval': ICON('M2 12h20M6 8l-4 4 4 4M18 8l4 4-4 4'),
    'Notes': ICON('M9 18V5l12-2v13', '<circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>'),
    'Voicings': ICON('m12 2 10 5-10 5L2 7Zm-10 15 10 5 10-5M2 12l10 5 10-5'),
    'Pattern': ICON('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'),
    'Progression': ICON('M5 12h14M12 5l7 7-7 7'),
    'Versions': ICON('M8 8h12v12H8zM4 16V4h12'),
    'Question': ICON('M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01', '<circle cx="12" cy="12" r="10"></circle>'),
    'Link': ICON('M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'),
    'Picture': ICON('M3 3h18v18H3zM21 15l-5-5L5 21', '<circle cx="9" cy="9" r="2"></circle>'),
}
BLOCKS['Picture'] = BLOCKS['Picture'].replace('gap: 8px; color: ' + SOFT + '">', 'gap: 8px; color: ' + SOFT + '">' + ICONS['Picture'].replace('width="20" height="20"', 'width="28" height="28"'), 1)
KINDS = list(BLOCKS)
# Insert as a list (Notion's / menu, Craft's +): each kind its glyph and its name, in groups; a tap adds the block
INSROW = (f'<button type="button" onClick="{{{{k.add}}}}" style="width: 100%; min-height: 52px; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 12px; padding: 4px 16px; text-align: left; box-shadow: {{{{k.sep}}}}">'
          f'<span style="flex: none; width: 36px; height: 36px; border-radius: 10px; background: {FILL}; display: flex; align-items: center; justify-content: center">'
          + ''.join(f'<sc-if value="{{{{k.i{n}}}}}" hint-placeholder-val="{{{{{"true" if n == 0 else "false"}}}}}">{ICONS[k]}</sc-if>' for n, k in enumerate(KINDS))
          + '</span><span style="flex: 1; font-size: 16px">{{k.k}}</span></button>')
def INSLIST(label_fn):
    return (f'<label style="height: 44px; border-radius: 12px; background: {FILL}; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: {SOFT}">{SEARCH}<input placeholder="Insert" aria-label="Insert" style="flex: 1; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>'
            f'<sc-for list="{{{{ins}}}}" as="g" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px">{label_fn("{{g.g}}")}'
            f'<div style="border-radius: 14px; background: {SHEET}; overflow: hidden"><sc-for list="{{{{g.ks}}}}" as="k" hint-placeholder-count="4">{INSROW}</sc-for></div></section></sc-for>')
ADDED = ('<sc-for list="{{added}}" as="b" hint-placeholder-count="0"><div data-added onClick="{{b.pick}}" style="position: relative; display: flex; flex-direction: column; gap: 12px; border-radius: 8px; outline: 2px solid {{b.ring}}; outline-offset: 6px">'
         + ''.join(f'<sc-if value="{{{{b.k{n}}}}}" hint-placeholder-val="{{{{false}}}}">{BLOCKS[k]}</sc-if>' for n, k in enumerate(KINDS)) + '</div></sc-for>')
INS_JS = r'''
    const KINDS = __KINDS__, added = (st.added || []).map((k, i) => { const o = { pick: () => editing && set({ sel: 'a' + i }), ring: editing && st.sel === 'a' + i ? '#E2A63B' : 'transparent' }; KINDS.forEach((n, j) => { o['k' + j] = n === k; }); return o; });
    const ins2 = INS.map(([g, ks]) => ({ g, ks: ks.map((k, i) => { const o = { k, sep: i ? 'inset 0 1px 0 #EEE9E2' : 'none', add: () => { const a = [...(st.added || []), k]; set({ sheet: null, added: a, sel: 'a' + (a.length - 1), toast: k + ' added' }); setTimeout(() => { const els = document.querySelectorAll('[data-added]'); const el = els[els.length - 1]; el && el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60); } }; KINDS.forEach((n, j) => { o['i' + j] = n === k; }); return o; }) }));
'''.replace('__KINDS__', __import__('json').dumps(KINDS, ensure_ascii=False))
