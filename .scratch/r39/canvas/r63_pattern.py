# R63: a pattern's page in the Chords page's shape (loop, 2026-11-14). Run from r41.py after r62 (it replaces the
# Pattern boards r54 writes; PatternNew stays). The keys edge to edge under a bar of glass buttons (Back · Pattern ·
# Piano · More); the pattern's name in the serif with its ♡, its book and level; one card of its bar on the staff and
# what it is; the two hands; where it is used; and one floating bar as a progression's: Loop · Play ⌄ (Over: a bar of
# C major, Amazing Grace) · Practise (the Player). The editor stays r54's; Publish is a window over
# the pattern (THINGWIN), with no address of its own, as a song's and a progression's.
PA63 = PA_SRC.replace("return { ...common(st, set), isPattern:", r'''const loop = !!st.loop, over = st.over63 ?? 'A bar of C major';
    const marks = { 36: [ROLE[1], 'C'], 48: [ROLE[1], 'C'], 60: [ROLE[1], 'C'], 64: [ROLE[3], 'E'], 67: [ROLE[5], 'G'] };
    return { ...common(st, set), kbE: calmKeys(43, 67, marks, 402, 150), kbLE: calmKeys(29, 84, marks, 1462, 180),
      loop, toggleLoop: () => S({ loop: !loop }), loopTint: loop ? '#332921' : 'rgba(254,253,251,.86)', loopInk: loop ? '#FEFDFB' : '#332921',
      playMenu: st.menu === 'play', closeMenu: () => S({ menu: null }), openPlay: () => S({ menu: st.menu === 'play' ? null : 'play' }),
      states: [{ l: 'Looping', bg: st.loop ? '#332921' : '#EEE9E2', pick: () => set({ loop: !st.loop }) }], playing: !!st.playing, notPlaying: !st.playing, toggle: () => S({ playing: !st.playing, menu: null }),
      overs: ['A bar of C major', 'Amazing Grace'].map((d) => ({ d, on: d === over, mark: d === over ? '✓' : '', pick: () => S({ over63: d, menu: null }) })),
      descOn: st.sheet === 'desc', openDesc: () => S({ sheet: 'desc' }), keysOn: st.sheet === 'keys', openKeys: () => S({ sheet: 'keys' }), openMore: () => S({ sheet: 'more' }), moreOn: st.sheet === 'more', isPattern:''')
assert PA63 != PA_SRC, 'PA return not found'
PA63 = PA63.replace("goPub: () => S({ page: 'publish', sheet: null })", "goPub: () => S({ pubWin: true, sheet: null }), pubWin: !!st.pubWin, closePub: () => S({ pubWin: false })")
PA63 = PA63.replace("favOn: fav, heartFill: fav ? '#B3261E' : 'none'", "favOn: fav, favFill: fav ? '#C2554A' : 'none', heartFill: fav ? '#B3261E' : 'none'")
TOP63 = TOP60.replace('Scales and keys</span>', 'Pattern</span>').replace('href="Main.dc.html" aria-label="Back to Practice"', 'href="Accompaniment.dc.html" aria-label="Back to Accompaniment"').replace(ROUND60("Settings", COG, "openSet"), '') + ''
TOP63 = TOP63.replace('</div></header>', ROUND60('More', MORE, 'openMore') + '</div></header>')
TITLE63 = (SHOWSTATES() + f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 2px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.01em; text-wrap: balance">{{{{name}}}}</h2>'
           f'<button type="button" aria-label="Favourite" aria-pressed="{{{{favOn}}}}" onClick="{{{{toggleFav}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{HEARTI}</button></div>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}">{IF("builtIn", "Called to Play", "true")}{IF("own", "Your pattern · from Broken chords")}</p></div>')
from bravura_glyphs import BRAVURA

def _staff63():
    """The bar as the app engraves it (PatternStaff: a 254-unit view at 7 units a space, measured at 370): the brace,
    both clefs at four spaces, Bravura's 4/4, the staves six spaces apart, the 8ths where Verovio spaces them, the
    chord's name on the bar's band over it in the app's display face at its own 14px."""
    y = lambda d: 49 - d * 3.5          # treble: d=0 is E4 on the bottom line
    yb = lambda d: 119 - d * 3.5        # bass: d=0 is G2 on the bottom line
    s = ''.join(f'<path d="M43.5 {21 + i * 7}H273.5" stroke="{INK}" stroke-width=".9"></path><path d="M43.5 {91 + i * 7}H273.5" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    s += f'<path d="M43.5 21V119" stroke="{INK}" stroke-width="1.4"></path><path d="M273.5 21V119" stroke="{INK}" stroke-width="1"></path>'
    s += f'<path d="M40.5 21C32.5 29 40.5 61 33.5 70C40.5 79 32.5 111 40.5 119" fill="none" stroke="{INK}" stroke-width="1.6" stroke-linecap="round"></path>'
    s += f'<text x="48" y="49" font-size="28" font-family="Noto Music, serif" fill="{INK}">𝄞</text><text x="48" y="119" font-size="31" font-family="Noto Music, serif" fill="{INK}">𝄢</text>'
    s += ''.join(f'<path transform="translate(74.5 {v}) scale(.028 -.028)" d="{BRAVURA["t4"][0]}" fill="{INK}"></path>' for v in (28, 42, 98, 112))
    # the right hand rocks in eighths, as the app plays M2: the upper notes together (E4 G4), then the lowest
    # alone (C4, on a ledger line below the staff), four times; stems up to a flat beam over the staff
    steps = [(0, 2), (-2,)] * 4
    xs = [round(103.0 + i * 21.83, 2) for i in range(8)]
    for x, ds in zip(xs, steps):
        for d in ds:
            cy = y(d)
            s += f'<path transform="translate({x - 4.13:.2f} {cy:.1f}) scale(.028 -.028)" d="{BRAVURA["black"][0]}" fill="{INK}"></path>'
        s += f'<path d="M{x + 3.7:.2f} {y(min(ds)):.1f}V20.3" stroke="{INK}" stroke-width=".9"></path>'
        if min(ds) <= -2: s += f'<path d="M{x - 7.7} 56H{x + 7.7}" stroke="{INK}" stroke-width="1"></path>'
    for a, b in ((0, 3), (4, 7)):
        s += f'<path d="M{xs[a] + 3.35} 19.6H{xs[b] + 4.25}V23.1H{xs[a] + 3.35}Z" fill="{INK}"></path>'
    # the left hand: an octave, C2 and C3, a whole note
    for d in (-4, 3):
        cy = yb(d)
        s += f'<path transform="translate(99 {cy:.1f}) scale(.028 -.028)" d="{BRAVURA["whole"][0]}" fill="{INK}"></path>'
    s += f'<path d="M97.2 126H112.6M97.2 133H112.6" stroke="{INK}" stroke-width="1"></path>'
    svg = f'<svg viewBox="20 0 254 141" width="100%" role="img" aria-label="Broken chords over a bar of C major" style="display: block; overflow: visible">{s}</svg>'
    return (f'<div style="position: relative; width: 100%; max-width: 560px; margin: 0 auto">{svg}'
            f'<span style="position: absolute; left: calc(9.24% + 4px); top: 0; height: 24px; font-family: {SERIF}; font-size: 14px; font-weight: 600; color: {INK}">C</span></div>')
# the pattern at reading size (10 a space on a phone), framed to its bar, on the paper: no card round the page's own
# music (laws, "The page's subject is its largest thing")
MUSIC63 = (f'<figure style="flex: none; margin: 0; display: flex; flex-direction: column; gap: 12px">' + _staff63() + f'<figcaption style="margin: 0 4px; max-width: 65ch; font-size: 15px; line-height: 1.4; color: {SOFT}; text-wrap: pretty">Over a held octave, the right hand rocks between the chord’s upper notes and its lowest note.</figcaption></figure>')
H3_63 = lambda t: f'<h3 style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3>'
DESC63 = 'The left hand holds the octave. The right hand keeps its chord under the fingers and rocks in 8ths: the upper notes together, then the lowest note alone. For a G chord after C, that is D and G together, then B.'
# The hands' ⓘ (loop, 2026-11-15): the pattern's longer description, out of the way until asked for, as InfoTip draws it.
INFO63 = INFOB('About the hands', 'openDesc', 'descOn') + INFOTIP('descOn', 'closeSheet', 'The hands', DESC63, 'left: 0; top: 36px')
HANDS63 = f'<section style="flex: none; position: relative; display: flex; flex-direction: column; gap: 8px"><div style="display: flex; align-items: center; gap: 8px">{H3_63("The hands")}{INFO63}</div>' + GROUP(('val', 'Right hand', '{{rhT}}'), ('val', 'Left hand', '{{lhT}}'), bg=SHEET) + '</section>'
PRACT63 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_63("Practise in the Player")}'
           f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">'
           + ''.join(f'<a href="Player.dc.html" style="min-height: 76px; box-sizing: border-box; padding: 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}">'
                     f'<span style="flex: none; width: 36px; height: 36px; border-radius: 18px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAYM}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{d}</span></span>{CHEV_RS}</a>'
                     for t, d in [('In C major', 'C G Am F, round and round'), ('Chromatically, rising', 'C G Am F · D♭ A♭ B♭m G♭ …'), ('Chromatically, falling', 'C G Am F · B F♯ G♯m E …'), ('In whole steps, rising', 'C G Am F · D A Bm G …'), ('Circle of fifths, falling', 'C G Am F · F C Dm B♭ …'), ('In minor thirds', 'C G Am F · E♭ B♭ Cm A♭ …')]) + '</div></section>')
USED63 = f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_63("Used in")}' + GROUP(('link', 'Amazing Grace', 'Verse', 'Player.dc.html'), ('link', 'Called to Play, lesson 12', '', 'Lesson.dc.html'), bg=SHEET) + '</section>'
HIDDEN63 = IF('hidden', CARD(f'<span style="font-size: 15px; line-height: 1.45">Hidden from the Player’s list and from its book. You can still find it under Hidden.</span>'))
PLAYPA = PLAYPR.replace('aria-label="What it plays"', 'aria-label="Play over"')
BAR63 = lambda pos: f'<div role="toolbar" aria-label="Loop and play" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{LOOPP}{PLAYPA}<span></span></div>'
def PMENU63(pos):
    item = f'<sc-for list="{{{{overs}}}}" as="o" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; text-align: left"><span style="flex: 1">{{{{o.d}}}}</span><span style="font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span></button></sc-for>'
    return (f'<sc-if value="{{{{playMenu}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeMenu}}}}" style="position: absolute; inset: 0; z-index: 50"></div><div role="menu" aria-label="Play over" style="position: absolute; {pos}; z-index: 51; width: 240px; display: flex; flex-direction: column; padding: 6px; border-radius: 16px; {GLASSFX}">'
            f'<p style="margin: 6px 12px 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Play over</p>' + item + '</div></sc-if>')
SHEETS63 = THINGWIN(False, 'pubWin', 'closePub', 'Publish', PATPUB, shown='false') + BSHEET('moreOn', '{{name}}', PA_MORE) + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS63 = THINGWIN(True, 'pubWin', 'closePub', 'Publish', LPA(PATPUB), shown='false') + POPOVER('moreOn', '{{name}}', LPA(PA_MORE), 'right: 40px; top: 64px', 320) + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 90px; top: 64px')
DELETED63 = IF('deleted', EMPTY('deleted', '♪', 'Pattern deleted', 'It left your patterns and the Player’s list. Undo brings it back.'))
ph63 = (IF('isPattern', TOP63 + DELETED63 + IF('notDeleted', f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; margin: 8px -16px 0">{KB60("kbE", 150)}</div>'
        + TITLE63 + HIDDEN63 + MUSIC63 + PRACT63 + USED63 + '</main>' + BAR63('left: 12px; right: 12px; bottom: 34px') + PMENU63('left: 50%; translate: -50% 0; bottom: 104px')), 'true')
        + IF('notPattern', TOP('', '{{pageT}}', '', 'Back', IB('Back', CHEV_L, 'back')) + NARROW(IF('isEditor', PATED))) + TOASTS)
lm63 = (IF('isPattern', f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP63).replace('Accompaniment.dc.html', 'AccompanimentLaptop.dc.html')
        + DELETED63 + IF('notDeleted', f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 8px 40px 120px 40px">'
        + f'<div style="flex: none; margin: 0 -40px 0 -40px">{KB60("kbLE", 180)}</div>'
        + f'<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE63}{HIDDEN63}{MUSIC63}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{LPA(PRACT63)}{LPA(USED63)}</div></div></div>'
        + BAR63('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + PMENU63('left: 50%; translate: -50% 0; bottom: 100px')) + '</div>', 'true')
        + IF('notPattern', LTITLEBAR('{{pageT}}', backact='back') + LCOL(LPA(IF('isEditor', PATED)), 640)) + TOASTL)
phone('Pattern', 'A pattern, phone', ph63, js(PA63.replace('__ROOT__', "'pattern'")), SHEETS63)
laptop('PatternLaptop', 'A pattern, laptop', lm63, '', js(PA63.replace('__ROOT__', "'pattern'")), POPS63, 'Practice')
print('r63 pattern ok')
