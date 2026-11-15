# R63: a pattern's page in the Chords page's shape (loop, 2026-11-14). Run from r41.py after r62 (it replaces the
# Pattern boards r54 writes; PatternNew stays). The keys edge to edge under a bar of glass buttons (Back · Pattern ·
# Piano · More); the pattern's name in the serif with its ♡, its book and level; one card of its bar on the staff and
# what it is; the two hands; where it is used; and one floating bar as a progression's: Loop · Play ⌄ (Over: a bar of
# C major, Amazing Grace) · Practise (the Player). The editor and Publish stay r54's.
PA63 = PA_SRC.replace("return { ...common(st, set), isPattern:", r'''const loop = !!st.loop, over = st.over63 ?? 'A bar of C major';
    const marks = { 36: [ROLE[1], 'C'], 48: [ROLE[1], 'C'], 60: [ROLE[1], 'C'], 64: [ROLE[3], 'E'], 67: [ROLE[5], 'G'] };
    return { ...common(st, set), kbE: calmKeys(36, 69, marks, 402, 150), kbLE: calmKeys(29, 84, marks, 1462, 180),
      loop, toggleLoop: () => S({ loop: !loop }), loopTint: loop ? '#332921' : 'rgba(254,253,251,.86)', loopInk: loop ? '#FEFDFB' : '#332921',
      playMenu: st.menu === 'play', closeMenu: () => S({ menu: null }), openPlay: () => S({ menu: st.menu === 'play' ? null : 'play' }),
      states: [{ l: 'Looping', bg: st.loop ? '#332921' : '#EEE9E2', pick: () => set({ loop: !st.loop }) }], playing: !!st.playing, notPlaying: !st.playing, toggle: () => S({ playing: !st.playing, menu: null }),
      overs: ['A bar of C major', 'Amazing Grace'].map((d) => ({ d, on: d === over, mark: d === over ? '✓' : '', pick: () => S({ over63: d, menu: null }) })),
      descOn: st.sheet === 'desc', openDesc: () => S({ sheet: 'desc' }), keysOn: st.sheet === 'keys', openKeys: () => S({ sheet: 'keys' }), openMore: () => S({ sheet: 'more' }), moreOn: st.sheet === 'more', isPattern:''')
assert PA63 != PA_SRC, 'PA return not found'
PA63 = PA63.replace("favOn: fav, heartFill: fav ? '#B3261E' : 'none'", "favOn: fav, favFill: fav ? '#C2554A' : 'none', heartFill: fav ? '#B3261E' : 'none'")
TOP63 = TOP60.replace('Scales and keys</span>', 'Pattern</span>').replace('href="Main.dc.html" aria-label="Back to Practice"', 'href="Accompaniment.dc.html" aria-label="Back to Accompaniment"').replace(ROUND60("Settings", COG, "openSet"), '') + ''
TOP63 = TOP63.replace('</div></header>', ROUND60('More', MORE, 'openMore') + '</div></header>')
TITLE63 = (SHOWSTATES() + f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 2px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance">{{{{name}}}}</h2>'
           f'<button type="button" aria-label="Favourite" aria-pressed="{{{{favOn}}}}" onClick="{{{{toggleFav}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{HEARTI}</button></div>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}">{IF("builtIn", "Called to Play, level 2 · Built-in", "true")}{IF("own", "Your pattern · from Broken chords")}</p></div>')
def _staff63():
    y = lambda d: 58 - d * 3.5          # treble: d=0 is E4 on the bottom line
    yb = lambda d: 112 - d * 3.5        # bass: d=0 is G2 on the bottom line
    s = ''.join(f'<path d="M24 {30 + i * 7}H350" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    s += ''.join(f'<path d="M24 {84 + i * 7}H350" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    s += f'<path d="M24 30V112" stroke="{INK}" stroke-width="1.2"></path><path d="M350 30V112" stroke="{INK}" stroke-width="1"></path>'
    s += f'<text x="27" y="62" font-size="42" font-family="Noto Music, serif" fill="{INK}">𝄞</text><text x="28" y="104" font-size="30" font-family="Noto Music, serif" fill="{INK}">𝄢</text>'
    s += f'<text x="62" y="16" font-size="13" font-weight="700" fill="{INK}">C</text>'
    # the right hand: C4 then G4 E4 G4, twice, in eighths (C4 on a ledger line below the staff)
    steps = [-2, 2, 0, 2, -2, 2, 0, 2]
    xs = [92 + i * 31 for i in range(8)]
    for i, (x, d) in enumerate(zip(xs, steps)):
        cy = y(d)
        s += f'<ellipse cx="{x}" cy="{cy:.1f}" rx="5.2" ry="3.8" transform="rotate(-20 {x} {cy:.1f})" fill="{INK}"></ellipse>'
        s += f'<path d="M{x + 4.6} {cy:.1f}V{y(9):.1f}" stroke="{INK}" stroke-width="1.1"></path>'
        if d <= -2: s += f'<path d="M{x - 9} {y(-2):.1f}H{x + 9}" stroke="{INK}" stroke-width="1"></path>'
    for a, b in ((0, 3), (4, 7)):
        s += f'<path d="M{xs[a] + 4.6} {y(9):.1f}L{xs[b] + 4.6} {y(9):.1f}" stroke="{INK}" stroke-width="4"></path>'
    # the left hand: an octave, C2 and C3, a whole note
    for d in (-4, 3):
        cy = yb(d)
        s += f'<ellipse cx="96" cy="{cy:.1f}" rx="6.4" ry="4.2" transform="rotate(-20 96 {cy:.1f})" fill="none" stroke="{INK}" stroke-width="1.8"></ellipse>'
    s += f'<path d="M86 {yb(-2):.1f}H106M86 {yb(-4):.1f}H106" stroke="{INK}" stroke-width="1"></path>'
    return f'<svg viewBox="0 0 360 132" width="100%" role="img" aria-label="Broken chords over a bar of C major" style="display: block; max-width: 460px; margin: 0 auto">{s}</svg>'
MUSIC63 = CARD(_staff63() + f'<p style="margin: 12px 4px 0; font-size: 15px; line-height: 1.4; color: {SOFT}; text-wrap: pretty">Over a held octave, the right hand rocks between the chord’s upper notes and its lowest note.</p>', '16px 16px 14px')
H3_63 = lambda t: f'<h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3>'
DESC63 = 'The left hand holds the octave. The right hand keeps its chord under the fingers and rocks in 8ths: the upper notes together, then the lowest note alone. For a G chord after C, that is D and G together, then B.'
# The hands' ⓘ (loop, 2026-11-15): the pattern's longer description, out of the way until asked for, as InfoTip draws it.
INFO63 = INFOB('About the hands', 'openDesc', 'descOn') + INFOTIP('descOn', 'closeSheet', 'The hands', DESC63, 'left: 0; top: 36px')
HANDS63 = f'<section style="flex: none; position: relative; display: flex; flex-direction: column; gap: 8px"><div style="display: flex; align-items: center; gap: 6px">{H3_63("The hands")}{INFO63}</div>' + GROUP(('val', 'Right hand', '{{rhT}}'), ('val', 'Left hand', '{{lhT}}'), bg=SHEET) + '</section>'
USED63 = f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_63("Used in")}' + GROUP(('link', 'Amazing Grace', 'Verse', 'Song.dc.html'), ('link', 'Called to Play, lesson 12', '', 'Lesson.dc.html'), bg=SHEET) + '</section>'
HIDDEN63 = IF('hidden', CARD(f'<span style="font-size: 15px; line-height: 1.45">Hidden from the Player’s list and from its book. You can still find it under Hidden.</span>'))
PRACTP63 = PRACTP.replace('href="PlayProgression.dc.html"', 'href="Player.dc.html"')
PLAYPA = PLAYPR.replace('aria-label="What it plays"', 'aria-label="Play over"')
BAR63 = lambda pos: f'<div role="toolbar" aria-label="Loop, play and practise" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{LOOPP}{PLAYPA}{PRACTP63}</div>'
def PMENU63(pos):
    item = f'<sc-for list="{{{{overs}}}}" as="o" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; text-align: left"><span style="flex: 1">{{{{o.d}}}}</span><span style="font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span></button></sc-for>'
    return (f'<sc-if value="{{{{playMenu}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeMenu}}}}" style="position: absolute; inset: 0; z-index: 50"></div><div role="menu" aria-label="Play over" style="position: absolute; {pos}; z-index: 51; width: 240px; padding: 6px; border-radius: 18px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column">'
            f'<p style="margin: 6px 12px 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Play over</p>' + item + '</div></sc-if>')
SHEETS63 = BSHEET('moreOn', '{{name}}', PA_MORE) + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS63 = POPOVER('moreOn', '{{name}}', LPA(PA_MORE), 'right: 40px; top: 64px', 320) + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 90px; top: 64px')
DELETED63 = IF('deleted', EMPTY('deleted', '♪', 'Pattern deleted', 'It left your patterns and the Player’s list. Undo brings it back.'))
ph63 = (IF('isPattern', TOP63 + DELETED63 + IF('notDeleted', f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; margin: 4px -16px 0">{KB60("kbE", 150)}</div>'
        + TITLE63 + HIDDEN63 + MUSIC63 + HANDS63 + USED63 + '</main>' + BAR63('left: 12px; right: 12px; bottom: 30px') + PMENU63('left: 50%; translate: -50% 0; bottom: 104px')), 'true')
        + IF('notPattern', TOP('', '{{pageT}}', '', 'Back', IB('Back', CHEV_L, 'back')) + NARROW(IF('isEditor', PATED) + IF('isPublish', PATPUB))) + TOASTS)
lm63 = (IF('isPattern', f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP63).replace('Accompaniment.dc.html', 'AccompanimentLaptop.dc.html')
        + DELETED63 + IF('notDeleted', f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 8px 40px 120px 56px">'
        + f'<div style="flex: none; margin: -8px -40px 0 -56px">{KB60("kbLE", 180)}</div>'
        + f'<div style="display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 40px; align-items: start">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE63}{HIDDEN63}{MUSIC63}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{LPA(HANDS63)}{LPA(USED63)}</div></div></div>'
        + BAR63('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + PMENU63('left: 50%; translate: -50% 0; bottom: 100px')) + '</div>', 'true')
        + IF('notPattern', PAGEHEAD_L('back', 'Back') + WIDE(H1('{{pageT}}') + LPA(IF('isEditor', PATED) + IF('isPublish', PATPUB)), 640)) + TOASTL)
phone('Pattern', 'A pattern, phone', ph63, js(PA63.replace('__ROOT__', "'pattern'")), SHEETS63)
laptop('PatternLaptop', 'A pattern, laptop', lm63, '', js(PA63.replace('__ROOT__', "'pattern'")), POPS63, 'Practice')
for f in ('Pattern', 'PatternLaptop'):
    open(OUT + f + 'Night.dc.html', 'w').write(night(open(OUT + f + '.dc.html').read()))
print('r63 pattern ok')
