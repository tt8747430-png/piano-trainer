"""R43: the Player in the Chords page's language (owner, 2026-11-10: "now read all the skills and instructions and
update the player with the same style updates and instructions").

Reads the merged Player pages from player/base/ (written by merge_player.py) and writes PlayerApp and PlayerDesk:
- the bar's Close, views and gear in the Chords page's light glass, the chosen view ink, tooltips on icon-only controls;
- the transport as the Chords bar's glass groups: Practice and Loop · ‹ Play › (the one tinted group) · Hands and
  Keyboard; on a phone each symbol over the word for what it is set to (Wait, Loop, Both, 3D), the hands drawn;
- Transpose as the Chords page's Key: a page in the song's settings with − [signature, key] +, the seven letters and
  ♭ ♮ ♯ on the chosen letter only, every key spelled the way it moves (up in sharps, down in flats), Back to the
  written key;
- the chord names over the staff in the Chords page's book serif; the Chords page's tap, focus and tooltip rules.
Run: python3 -I player/r43_player.py  (from .scratch/r39/canvas)

Careful: the built PlayerApp and PlayerDesk boards carry passes made after this script (the States
tool, the keys' faces), which a fresh run drops; for a small change, patch the two built boards in place too."""
import re, pathlib
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_kit.py').read())  # MODESW, MODEBAR_P/L, GLASSFX: the bar shared with the editor

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / 'practice' / 'project'
INK, SOFT, FILL, LINE, SHEET = '#332921', '#685E56', '#EEE9E2', '#DAD1C8', '#FEFDFB'
GLASS = 'rgba(254,253,251,.86)'
SHADOW = '0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)'
SERIF = "'Iowan Old Style', 'Palatino', Georgia, serif"
GLASSGRP = (f'height: 56px; box-sizing: border-box; padding: 4px; display: flex; align-items: center; border-radius: 28px; '
            f'background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; pointer-events: auto')
TINTGRP = (f'height: 56px; box-sizing: border-box; padding: 4px; display: flex; align-items: center; border-radius: 28px; '
           f'background: rgba(237,198,132,.82); backdrop-filter: blur(24px) saturate(1.8); '
           f'box-shadow: inset 0 1px 0 rgba(255,255,255,.55), 0 0 0 1px rgba(176,122,42,.28), {SHADOW}; pointer-events: auto')
I = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
HANDI = (f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path>'
         '<path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>')
HANDL = HANDI.replace('<svg ', '<svg style="transform: scaleX(-1)" ', 1)
HANDS2 = ('<span style="display: flex; margin: 0 -3px">' + HANDL.replace('width="20" height="20"', 'width="16" height="16"')
          + HANDI.replace('width="20" height="20"', 'width="16" height="16"') + '</span>')
HANDSI = ('<span style="height: 20px; display: flex; align-items: center"><sc-if value="{{hB}}" hint-placeholder-val="{{true}}">' + HANDS2
          + '</sc-if><sc-if value="{{hR}}" hint-placeholder-val="{{false}}">' + HANDI + '</sc-if><sc-if value="{{hL}}" hint-placeholder-val="{{false}}">'
          + HANDL + '</sc-if></span>')

MOTION = ('<style data-r43>[role=dialog] > * { flex: none } '
          'div[role=group] > sc-for > button, [aria-label="View"] button { position: relative }'
          ' div[role=group] > sc-for > button::before { content: ""; position: absolute; inset: -7px -1px } [aria-label="View"] button::before { content: ""; position: absolute; inset: -5px 0 }'
  'button, a[href] { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none }'
  ':focus-visible { outline: 2px solid #356890; outline-offset: 2px }'
  '@media (hover: hover) { [data-tip]::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 8px); z-index: 90;'
  ' translate: -50% 4px; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; font: 500 12px/16px \'Instrument Sans\', system-ui, sans-serif;'
  ' white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 120ms ease-out, translate 120ms ease-out }'
  ' [data-tip-up]::after { top: auto; bottom: calc(100% + 8px); translate: -50% -4px }'
  ' [data-tip]:hover::after { opacity: 1; translate: -50% 0; transition-delay: 500ms } }'
  '[data-tip]:not([style*="position: absolute"]) { position: relative } [data-tip]:hover { z-index: 95 }'
  '[role=toolbar] button { transition: scale 120ms ease-out, filter 120ms ease-out }'
  '@media (hover: hover) { [role=toolbar] button:hover { filter: brightness(.96) } } [role=toolbar] button:active { scale: .96 }'
  '@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important } }</style>')

# the Chords page's key logic (r42_chords.py, v115), for a song: major keys only, since transposing keeps the mode
KEYJS = r'''
const LET = 'CDEFGAB', NATPC = [0, 2, 4, 5, 7, 9, 11], KFIF = [0, 2, 4, -1, 1, 3, 5], SKIP = ['C-1', 'F-1', 'E1', 'B1'];
const ACCS = { '-1': '♭', '0': '', '1': '♯' };
const rootPc = (l, a) => (NATPC[l] + a + 12) % 12;
const keyOk = (l, a) => !SKIP.includes(LET[l] + a) && Math.abs(KFIF[l] + 7 * a) <= 7;
const spellPc = (pc, dir) => { const n = NATPC.indexOf(pc); if (n >= 0) return [n, 0];
  const sh = [NATPC.indexOf((pc + 11) % 12), 1], fl = [NATPC.indexOf((pc + 1) % 12), -1], o = dir > 0 ? [sh, fl] : [fl, sh];
  return o.find(([l, a]) => keyOk(l, a)) || o[0]; };
const WRIT = { l: 4, a: 0 };
const KEY = s.songKey || WRIT;
const keyPc = rootPc(KEY.l, KEY.a), keyF = KFIF[KEY.l] + 7 * KEY.a;
const keyLabel = (k) => LET[k.l] + ACCS[String(k.a)] + ' major';
const setKey = (l, a) => this.setState({ songKey: { l, a } });
const stepKey = (dir) => setKey(...spellPc((keyPc + dir + 12) % 12, dir));
const KEYPICK = (curL, curA, pick) => ({
  lets: [0, 1, 2, 3, 4, 5, 6].map((l) => { const on = l === curL, a2 = on ? curA : 0;
    return { s: LET[l] + ACCS[String(a2)], on, bg: on ? '#DAD1C8' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px #DAD1C8', fw: on ? 800 : 600,
      aria: 'Key of ' + LET[l] + (a2 ? (a2 > 0 ? ' sharp' : ' flat') : '') + ' major', pick: () => { if (!on) pick(l, 0); } }; }),
  accs: [[-1, '♭', 'Flat'], [0, '♮', 'Natural'], [1, '♯', 'Sharp']].map(([a, g, w]) => { const on = a === curA, good = keyOk(curL, a);
    return { l: g, aria: w + ' ' + LET[curL], on, dis: !good, op: good ? 1 : 0.35, bg: on ? '#FEFDFB' : 'transparent',
      sh: on ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', pick: () => { if (good && !on) pick(curL, a); } }; }) });
'''
KEYVALS = ("keyName: keyLabel(KEY), writtenKey: keyLabel(WRIT), keyMoved: KEY.l !== WRIT.l || KEY.a !== WRIT.a, "
           "keyBack: () => this.setState({ songKey: null }), openKey: pick({ open: 'key' }), isKey: open === 'key', "
           "trDown: () => stepKey(-1), trUp: () => stepKey(1), trPick: KEYPICK(KEY.l, KEY.a, setKey), "
           "keyMini: Array.from({ length: Math.abs(keyF) }, (_, k) => ({ x: 52 + k * 11, y: (keyF > 0 ? [30, 45, 25, 40, 55, 35, 50] : [50, 35, 55, 40, 60, 45, 65])[k] + 5, sharp: keyF > 0, flat: keyF < 0 })), ")

KEYHEAD = ('<div style="display: flex; align-items: center; gap: 12px"><button type="button" aria-label="Down a half step" data-tip="Down a half step" onClick="{{trDown}}" style="flex: none; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 26px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 26px; font-weight: 500; line-height: 1">−</button>'
           '<div style="flex: 1; min-width: 0; display: flex; justify-content: center"><div role="img" aria-label="{{keyName}}" style="display: flex; align-items: center; gap: 10px"><svg viewBox="0 12 136 72" aria-hidden="true" style="display: block; height: 52px; width: auto; overflow: visible"><path d="M2 30H134M2 40H134M2 50H134M2 60H134M2 70H134" stroke="' + INK + '" stroke-width="1"></path><text x="6" y="69" font-family="Noto Music" font-size="42" fill="' + INK + '">𝄞</text>'
           '<sc-for list="{{keyMini}}" as="g" hint-placeholder-count="1"><sc-if value="{{g.sharp}}" hint-placeholder-val="{{true}}"><text x="{{g.x}}" y="{{g.y}}" font-family="Noto Music" font-size="22" fill="' + INK + '">♯</text></sc-if><sc-if value="{{g.flat}}" hint-placeholder-val="{{false}}"><text x="{{g.x}}" y="{{g.y}}" font-family="Noto Music" font-size="22" fill="' + INK + '">♭</text></sc-if></sc-for></svg>'
           '<span style="font-family: ' + SERIF + '; font-size: 24px; font-weight: 700; line-height: 1.1; white-space: nowrap">{{keyName}}</span></div></div>'
           '<button type="button" aria-label="Up a half step" data-tip="Up a half step" onClick="{{trUp}}" style="flex: none; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 26px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 26px; font-weight: 500; line-height: 1">+</button></div>')
KEYPICK_HTML = ('<div style="display: flex; flex-direction: column; gap: 12px"><div role="radiogroup" aria-label="Key" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px"><sc-for list="{{trPick.lets}}" as="o" hint-placeholder-count="7">'
                '<button type="button" role="radio" aria-checked="{{o.on}}" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 56px; min-width: 0; padding: 0; border: 0; border-radius: 12px; background: {{o.bg}}; box-shadow: {{o.ring}}; color: ' + INK + '; font-family: ' + SERIF + '; font-size: 22px; font-weight: {{o.fw}}">{{o.s}}</button></sc-for></div>'
                '<div role="radiogroup" aria-label="Accidental" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; padding: 2px; border-radius: 12px; background: ' + FILL + '"><sc-for list="{{trPick.accs}}" as="o" hint-placeholder-count="3">'
                '<button type="button" role="radio" aria-checked="{{o.on}}" aria-disabled="{{o.dis}}" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 44px; min-width: 0; padding: 0; border: 0; border-radius: 10px; background: {{o.bg}}; box-shadow: {{o.sh}}; opacity: {{o.op}}; color: ' + INK + '; font-family: ' + SERIF + '; font-size: 26px; line-height: 1">{{o.l}}</button></sc-for></div></div>')
KEYBACK = ('<sc-if value="{{keyMoved}}" hint-placeholder-val="{{false}}"><button type="button" onClick="{{keyBack}}" style="align-self: center; height: 44px; padding: 0 18px; border: 0; border-radius: 22px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 15px; font-weight: 600">Back to {{writtenKey}}</button></sc-if>')


def sub(t, pat, rep, n=1, flags=0):
    t2, k = re.subn(pat, rep, t, count=0 if n == 0 else n, flags=flags)
    assert k >= 1 and (n == 0 or k == n), (pat[:80], k)
    return t2


def patch(t, phone):
    darkv = 'dark' if phone else 'glassDark'
    # ── fonts and the Chords page's interaction rules ──
    t = t.replace('family=Instrument+Serif&amp;display=swap', 'family=Instrument+Serif&amp;family=Noto+Music&amp;display=swap', 1)
    t = t.replace('</style>', '</style>' + MOTION, 1)
    # ── the score keeps its page width and centres when the phone layout is wider (an iPad upright, 744) ──
    t = t.replace('tabindex="0" ref="{{scoreRef}}" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0;', 'tabindex="0" ref="{{scoreRef}}" style="position: absolute; left: max(0px, calc(50% - 201px)); right: max(0px, calc(50% - 201px)); top: 0; bottom: 0;') if phone else t
    t = t.replace('<main style="position: absolute; left: 0; right: 0; top: {{areaTop}}px; bottom: 0; overflow: hidden">', '<main style="position: absolute; left: 0; right: 0; top: {{areaTop}}px; bottom: 0; overflow: hidden; background: #F7F3EE">') if phone else t
    # ── the bar in light glass; the chosen view ink ──
    t = sub(t, r"glass: \w+ \? '[^']*' : '[^']*', glassFg: \w+ \? '[^']*' : '[^']*', glassLine: \w+ \? '[^']*' : '[^']*',", f"glass: '{GLASS}', glassFg: '{INK}', glassLine: '{LINE}',")
    t = sub(t, r"setBg: open === 'settings' \? \(\w+ \? '[^']*' : '[^']*'\) : \(\w+ \? '[^']*' : '[^']*'\),", f"setBg: open === 'settings' ? '{FILL}' : '{GLASS}',")
    t = sub(t, r"bg: on \? \(" + darkv + r" \? '#FFFFFF' : '#332921'\) : 'transparent', fg: on \? \(" + darkv + r" \? '#332921' : '#FFFFFF'\) : \(" + darkv + r" \? '#FFFFFF' : '#332921'\),",
            f"bg: on ? '{INK}' : 'transparent', fg: on ? '{SHEET}' : '{INK}',")
    t = sub(t, r'aria-label="Close" style="', 'aria-label="Close" data-tip="Close" style="')
    t = sub(t, r'aria-label="Settings" title="Settings" ', 'aria-label="Settings" data-tip="Settings" ')
    if phone:
        t = sub(t, r'<button type="button" aria-label="\{\{v.label\}\}" title="\{\{v.hint\}\}" ', '<button type="button" aria-label="{{v.label}}" data-tip="{{v.hint}}" ')
    # ── the chord names over the staff in the book serif ──
    t = sub(t, r"font-family: Georgia, 'Times New Roman', serif; font-size: (\d+)px; font-weight: 700; line-height: 1; color: #332921; visibility: \{\{chordVis\}\}",
            lambda m: f"font-family: {SERIF}; font-size: {m.group(1)}px; font-weight: 700; line-height: 1; color: {INK}; visibility: {{{{chordVis}}}}", n=0)
    # ── the transport as three groups ──
    m = re.search(r'<div style="position: absolute; left: 50%; top: \{\{capTop\}\}px;.*?\n</div>\n(?=</sc-if>\n\n\n<sc-if value="\{\{anyOpen)', t, flags=re.S)
    assert m, 'transport'
    btns = re.findall(r'<button\b.*?</button>', m.group(0), flags=re.S)
    assert len(btns) == 7, len(btns)
    pace, loop, back, play, fwd, hands, keys = btns
    svg = lambda b: re.search(r'<svg\b.*?</svg>', b, flags=re.S).group(0)
    def restyle(b, style, inner, extra=''):
        b = re.sub(r' style="[^"]*"', ' style="' + style + '"', b, count=1)
        head = b[:b.index('>') + 1]
        return head.replace('<button ', '<button ' + extra, 1) + inner + '</button>'
    small = lambda s: re.sub(r'width="\d+" height="\d+"', 'width="20" height="20"', s, count=1)
    arrow = 'width: 44px; height: 48px; padding: 0; border: 0; border-radius: 22px; background: transparent; color: ' + INK + '; display: flex; align-items: center; justify-content: center'
    playst = 'width: 48px; height: 48px; padding: 0; border: 0; border-radius: 24px; background: transparent; color: ' + INK + '; display: flex; align-items: center; justify-content: center'
    back = restyle(back, arrow, svg(back), 'data-tip="A step back" data-tip-up ')
    fwd = restyle(fwd, arrow, svg(fwd), 'data-tip="A step forward" data-tip-up ')
    play = restyle(play, playst, svg(play))
    pace = pace.replace('aria-label="Pace: {{paceLabel}}"', 'aria-label="Practice: {{paceLabel}}"')
    if phone:
        cap = lambda bg='transparent', fg=INK: f'width: 48px; height: 48px; padding: 0; border: 0; border-radius: 24px; background: {bg}; color: {fg}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px'
        word = lambda v: f'<span style="font-size: 12px; font-weight: 600; line-height: 1; white-space: nowrap">{{{{{v}}}}}</span>'
        pace = restyle(pace, cap(), small(svg(pace)) + word('paceCap'))
        loop = restyle(loop, cap('{{loopBg}}', '{{loopFg}}'), small(svg(loop)) + word('loopCap'))
        hands = restyle(hands, cap(), HANDSI + word('handsCap'))
        keys = restyle(keys, cap(), small(svg(keys)) + word('kbCap'))
        keys = keys.replace('aria-label="Keyboard"', 'aria-label="Keyboard: {{kbCap}}"')
        lift, side = 4, 'left: 12px; right: 12px'
    else:
        row = lambda bg='transparent', fg=INK: f'height: 48px; padding: 0 14px 0 12px; border: 0; border-radius: 24px; background: {bg}; color: {fg}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap'
        inner = lambda b: b[b.index('>') + 1:b.rindex('</button>')]
        pace = restyle(pace, row(), inner(pace).strip())
        loop = restyle(loop, row('{{loopBg}}', '{{loopFg}}'), inner(loop).strip())
        hands = restyle(hands, row(), HANDSI + '<span>{{handsLabel}}</span>')
        keys = restyle(keys, row(), inner(keys).strip())
        lift, side = 6, 'left: 0; right: 0'
    dock = (f'<div role="toolbar" aria-label="Transport" style="position: absolute; z-index: 40; {side}; top: calc({{{{capTop}}}}px + {lift}px); display: flex; justify-content: center; align-items: center; gap: 8px; pointer-events: none">\n'
            f'<div role="group" aria-label="Practice and loop" style="{GLASSGRP}">{pace}{loop}</div>\n'
            f'<div role="group" aria-label="Play" style="{TINTGRP}">{back}{play}{fwd}</div>\n'
            f'<div role="group" aria-label="Hands and keyboard" style="{GLASSGRP}">{hands}{keys}</div>\n</div>\n')
    t = t[:m.start()] + dock + t[m.end():]
    t = sub(t, r"(handsLabel: \{[^}]*\}\[hands\],)",
            r"\1 handsCap: { lh: 'Left', both: 'Both', rh: 'Right' }[hands], hB: hands === 'both', hR: hands === 'rh', hL: hands === 'lh', "
            r"paceCap: mode === 'wait' ? 'Wait' : 'Play', loopCap: loop ? loopA + '–' + loopB : 'Loop', kbCap: keys ? (kbStyle === '2d' ? '2D' : '3D') : 'Off',")
    # ── Transpose: the Chords page's Key, as a page of the song's settings ──
    t = sub(t, r"(const key = s\.key \?\? 4;?\n)", lambda mm: mm.group(1) + KEYJS)
    t = sub(t, r"const semi = key - 4", "const semi = ((keyPc - 7 + 18) % 12) - 6")
    t = sub(t, r"keyName: KEYS\[key\], keyDown: [^\n]*?keyUp: pick\(\{ key: Math\.min\(KEYS\.length - 1, key \+ 1\) \}\),", KEYVALS.rstrip(', ') + ',')
    row = re.search(r'<div style="min-height: 48px;[^>]*><span>Transpose</span>.*?</button></div></div>', t, flags=re.S)
    assert row, 'transpose row'
    rowst = re.search(r'style="([^"]*)"', row.group(0)).group(1)
    link = (f'<button type="button" onClick="{{{{openKey}}}}" style="{rowst}; width: 100%; border-left: 0; border-right: 0; border-bottom: 0; background: transparent; font: inherit; text-align: left">'
            f'<span>Transpose</span><span style="display: flex; align-items: center; gap: 6px"><span style="font-weight: 600">{{{{keyName}}}}</span><span aria-hidden="true" style="color: #A39A90; font-size: 18px">›</span></span></button>')
    t = t[:row.start()] + link + t[row.end():]
    pat = re.search(r'<sc-if value="\{\{isPattern\}\}" hint-placeholder-val="\{\{false\}\}">\n(<section role="dialog" aria-label="Pattern" [^>]*>)\n(<div aria-hidden="true" style="display: \{\{sheetGrab\}\}[^\n]*\n)?(<div style="display: flex; align-items: center; gap: 6px; margin: 0 0 2px">.*?</h2></div>)', t, flags=re.S)
    assert pat, 'pattern page'
    sec = pat.group(1).replace('aria-label="Pattern"', 'aria-label="Transpose"')
    head = pat.group(3).replace('>Pattern</h2>', '>Transpose</h2>')
    page = ('<sc-if value="{{isKey}}" hint-placeholder-val="{{false}}">\n' + sec + '\n' + (pat.group(2) or '') + head + '\n'
            + '<div style="display: flex; flex-direction: column; gap: 16px; padding: 4px 0 8px">' + KEYHEAD + KEYPICK_HTML + KEYBACK + '</div>\n</section>\n</sc-if>\n')
    t = t[:pat.start()] + page + t[pat.start():]
    return t


CHEV_R = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
CHEV_L = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>'
CARD = 'background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px rgba(51,41,33,.07)'
ROW = 'min-height: 48px; box-sizing: border-box; padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 16px; color: #332921'
SEP = 'border-top: 1px solid #E9E2D8; margin-top: -1px'
def SWITCH(v):  # the Chords page's switch (R42 v85): 51 by 31, green when on
    return f'<span aria-hidden="true" style="position: relative; flex: none; width: 51px; height: 31px; border-radius: 16px; background: {{{{{v}.track}}}}"><span style="position: absolute; top: 2px; left: {{{{{v}.knob}}}}px; width: 27px; height: 27px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 2px 4px rgba(51,41,33,.2)"></span></span>'
def VCARD(v, icon, name, inner=''):
    dot = (f'<span aria-hidden="true" style="flex: none; width: 22px; height: 22px; border-radius: 11px; background: {{{{{v}.dot}}}}; box-shadow: {{{{{v}.dotRing}}}}; color: #FEFDFB; display: flex; align-items: center; justify-content: center">'
           f'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: {{{{{v}.mk}}}}"><path d="m5 12 5 5 9-10"></path></svg></span>')
    return (f'<div style="border-radius: 14px; background: {{{{{v}.bg}}}}; box-shadow: {{{{{v}.ring}}}}; overflow: hidden"><button type="button" role="radio" aria-checked="{{{{{v}.on}}}}" onClick="{{{{{v}.pick}}}}" style="{ROW}; width: 100%; padding: 8px 16px 8px 8px; border: 0; background: transparent; font: inherit; text-align: left">'
            f'<span style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="flex: none; width: 52px; height: 40px; border-radius: 6px; background: #FEFDFB; box-shadow: 0 0 0 1px #DAD1C8; display: flex; align-items: center; justify-content: center">{icon}</span><span style="font-weight: 600">{name}</span></span>{dot}</button>{inner}</div>')
def SEGROW(label, lst, w):
    return (f'<div style="{ROW}; {SEP}"><span>{label}</span><div role="group" style="flex: none; width: {w}px; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 2px; padding: 2px; border-radius: 9px; background: #EEE9E2">'
            f'<sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="2"><button type="button" aria-pressed="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 30px; padding: 0 6px; border: 0; border-radius: 7px; background: {{{{o.bg}}}}; box-shadow: {{{{o.shadow}}}}; color: #332921; font: inherit; font-size: 13px; font-weight: 600; white-space: nowrap">{{{{o.name}}}}</button></sc-for></div></div>')
# one Piano sheet, the very markup the Chords page uses (piano_sheet.py; owner, canvas 121: "merge them and make proper
# one piano settings"). Only its choices follow the page: a song fits the song or the learner's own piano.
import sys; sys.path.insert(0, str(HERE.parent)); import piano_sheet as PS
KBBODY = PS.PIANO_SHEET(False, 4, 3)
SEGF = '(' + PS.SEG_JS + ')'
KBVALS = ("pianoSw: " + PS.SW_JS('keys', '() => this.setState({ keys: !keys })') + ", kbDimOp: keys ? 1 : 0.4, kbPE: keys ? 'auto' : 'none', "
          "kbHandsSw: " + PS.SW_JS('kbHands', '() => this.setState({ kbHands: !kbHands })') + ", "
          "kb3c: " + PS.CARD_JS("kbStyle === '3d'", "() => this.setState({ keys: true, kbStyle: '3d' })") + ", "
          "kb2c: " + PS.CARD_JS("kbStyle === '2d'", "() => this.setState({ keys: true, kbStyle: '2d' })") + ", "
          "kbAngleSeg: " + SEGF + "([['seat', 'Seat'], ['above', 'Above']], kbView, (id) => this.setState({ kbView: id })), "
          "kbRangeSeg: " + SEGF + "([['song', 'Fit the song'], ['61', '61 keys'], ['76', '76 keys'], ['88', '88 keys']], kbRange, (id) => this.setState({ kbRange: id })), "
          "kbLabelSeg: " + SEGF + "([['names', 'Note names'], ['degrees', 'Degrees'], ['none', 'None']], kbLabel, (id) => this.setState({ kbLabel: id })), "
          "soundSub: '', soundSubOn: false, soundSubVal: 'Grand piano', soundSubValC: '#685E56', midiSub: '', midiSubOn: false, midiSubVal: 'None', midiSubValC: '#685E56', "
          "kbStrip: (() => { const [lo, hi] = RANGES[kbRange] ?? KB.song, NAT = [0, 2, 4, 5, 7, 9, 11], W = 340, w = W / 52; let i = 0, x0 = null, x1 = 0, bl = ''; "
          "for (let m = 21; m <= 108; m++) { if (NAT.includes(m % 12)) { if (m >= lo && m <= hi) { if (x0 === null) x0 = i * w; x1 = (i + 1) * w; } i++; } else bl += 'M' + (i * w - w * 0.3).toFixed(1) + ' 0h' + (w * 0.6).toFixed(1) + 'v15h-' + (w * 0.6).toFixed(1) + 'z'; } "
          "const nm = (m) => NOTE[m % 12] + (Math.floor(m / 12) - 1); return { bl, x: (x0 || 0).toFixed(1), w: (x1 - (x0 || 0)).toFixed(1), cap: nm(lo) + ' – ' + nm(hi) }; })(), ")


def kit(t, phone):
    """Every sheet in the Chords page's kit (R42 v85, v91): the page's sand, plain white groups with a hairline, rows of
    16px text, the green switch, sentence-case captions, a centred title with Done, Back as a chevron."""
    t = t.replace('background: #F3EEE7; box-shadow: 0 2px 4px rgba(26,22,18,0.10), 0 18px 40px -12px rgba(26,22,18,0.30)',
                  'background: #F7F3EE; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 -8px 30px -12px rgba(51,41,33,.28)')
    t = t.replace('border-radius: 20px 20px 0 0;', 'border-radius: 22px 22px 0 0;')
    t = t.replace('border-radius: 9999px; background: #D9D1C6"></div>', 'border-radius: 9999px; background: #DAD1C8"></div>')
    t = t.replace('background: #FFFFFF; overflow: hidden; box-shadow: 0 0 0 1px rgba(26,22,18,0.05), 0 1px 2px rgba(26,22,18,0.06), 0 3px 10px -4px rgba(26,22,18,0.10)', CARD)
    t = t.replace(', 0 0 0 1px rgba(26,22,18,0.05), 0 1px 2px rgba(26,22,18,0.06), 0 3px 10px -4px rgba(26,22,18,0.10)', ', 0 0 0 1px rgba(51,41,33,.07)')
    t = t.replace('padding: 6px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 15px; color: #332921',
                  'padding: 8px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 16px; color: #332921')
    t = t.replace('border-radius: 9px; background: #E7E0D6', 'border-radius: 9px; background: #EEE9E2')
    t = t.replace('<p style="margin: 6px 14px -4px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #685E56">',
                  '<p style="margin: 6px 4px -4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #685E56">')  # the kit's CAPS, as every group label (rounds 15, 25)
    # the next lyric line reads at 4.5:1 in soft ink (was #A39A90, 2.5:1); its lighter weight keeps it second (loop 63)
    t = t.replace('line-height: 1.2; color: #A39A90">{{lineNext}}', 'line-height: 1.2; color: #685E56">{{lineNext}}')
    t = t.replace('<span aria-hidden="true" style="color: #A39A90; font-size: 18px">›</span>', '<span aria-hidden="true" style="display: flex; color: #685E56">' + CHEV_R + '</span>')
    # the switch
    t = re.sub(r'width: 44px; height: 26px; (padding: 0; border: 0; )?border-radius: 9999px; background: \{\{([\w.]+)\}\}',
               r'width: 51px; height: 31px; \1border-radius: 16px; background: {{\2}}', t)
    t = re.sub(r'top: 3px; left: \{\{([\w.]+)\}\}px; width: 20px; height: 20px; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 1px 2px rgba\(26,22,18,0\.3\)',
               r'top: 2px; left: {{\1}}px; width: 27px; height: 27px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 2px 4px rgba(51,41,33,.2)', t)
    t = sub(t, r"track: ([^?,]+)\? '#B07A2A' : '#D9D1C6', knob: ([^?,]+)\? 21 : 3", r"track: \1? '#7FB685' : '#DAD1C8', knob: \2? 22 : 2", n=0)
    # a sheet's title: centred, with Done on a phone (the Chords sheets); left on a laptop's popover
    if phone:
        t = re.sub(r'<h2 style="margin: 4px 14px 2px; font-size: 17px; font-weight: 700; line-height: 1.2">(.*?)</h2>',
                   r'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 40px"><h2 style="margin: 0; font-size: 17px; font-weight: 600">\1</h2><button type="button" onClick="{{close}}" style="position: absolute; right: -4px; height: 44px; padding: 0 4px; border: 0; background: transparent; color: #356890; font: inherit; font-size: 17px; font-weight: 600">Done</button></div>', t)
    else:
        t = t.replace('<h2 style="margin: 4px 14px 2px; font-size: 17px; font-weight: 700; line-height: 1.2">', '<h2 style="margin: 0; font-size: 17px; font-weight: 600; line-height: 1.2">')  # on the cards' edge, as every popover's title (loop round 67, the lines)
    # a page inside a sheet: Back as the chevron, the title centred
    t = re.sub(r'<div style="display: flex; align-items: center; gap: 6px; margin: 0 0 2px"><button type="button" aria-label="Back" onClick="\{\{(\w+)\}\}" style="[^"]*"><svg[^>]*><path d="M19 12H5M12 19l-7-7 7-7"></path></svg></button><h2 style="margin: 0; font-size: 17px; font-weight: 700; line-height: 1.2">(.*?)</h2></div>',
               lambda m: f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 40px"><button type="button" aria-label="Back" onClick="{{{{{m.group(1)}}}}}" style="position: absolute; left: -10px; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: #332921; display: flex; align-items: center; justify-content: center">{CHEV_L}</button><h2 style="margin: 0; font-size: 17px; font-weight: 600">{m.group(2)}</h2></div>', t)
    # Keyboard as the Chords page's (v85): Show the piano, then 3D piano (its Angle inside) or 2D keys, Keys and Note names, Sound and MIDI
    m = re.search(r'(<section role="dialog" aria-label="Keyboard" [^>]*>.*?</h2>(?:<button[^>]*>Done</button></div>)?\n)(.*?)(</section>)', t, flags=re.S)
    assert m, 'keyboard sheet'
    t = t[:m.start(2)] + KBBODY + '\n' + t[m.end(2):]
    t = sub(t, r"(kb3d: keys && kbStyle === '3d', kb2d: keys && kbStyle === '2d',)", lambda mm: 'kbOn: !!keys, ' + mm.group(1) + ' ' + KBVALS)
    t = sub(t, r"const kbNames = s\.kbNames \?\? true;", "const kbLabel = s.kbLabel ?? 'names', kbNames = kbLabel !== 'none';\nconst DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'], labelOf = (m) => kbLabel === 'degrees' ? DEG[(m - keyPc + 120) % 12] : NOTE[m % 12];")
    t = lit(t, "t: mine ? NOTE[k.m % 12] :", "t: mine ? labelOf(k.m) :")
    t = lit(t, "const name = NOTE[m % 12];", "const name = labelOf(m);")
    t = t.replace('aria-label="Keyboard', 'aria-label="Piano').replace('>Keyboard</h2>', '>Piano</h2>').replace('data-tip="Keyboard"', 'data-tip="Piano"').replace('<span>Keyboard</span></button>', '<span>{{kbCap}}</span></button>')
    # a phone's sheet stops below the bar (Close, the views, the gear), never under it (owner, canvas 122: "the piano
    # settings in the player are not correct height")
    if phone:
        t = t.replace('max-height: 88%', 'max-height: calc(100% - 124px)')
    t = t.replace('#B4531A', '#7A5418')  # the old orange's last use: the loop's word when on
    # the remaining white surfaces and lifted cards take the warm white and the hairline
    t = t.replace('box-shadow: 0 0 0 1px rgba(26,22,18,0.05), 0 1px 2px rgba(26,22,18,0.06), 0 3px 10px -4px rgba(26,22,18,0.10)', 'box-shadow: 0 0 0 1px rgba(51,41,33,.07)')
    t = t.replace('background: #FFFFFF;', 'background: #FEFDFB;')
    # − and + as the Chords page's filled circles
    t = t.replace('border: 1px solid #DDD5CA; border-radius: 9999px; background: #FEFDFB;', 'border: 0; border-radius: 9999px; background: #EEE9E2;')
    # Played through's bars are four-bar buttons (owner, canvas 122: "3. 2. yes"): a bar alone was 18 by 34 and a tap
    # practised its four anyway, so the four are the button, each bar a cell inside it; the weakest four ringed
    t = sub(t, r'<div style="flex: none; border-radius: 12px; background: #(?:FFFFFF|FEFDFB); padding: 12px 14px 10px;.*?\{\{doneBarsLine\}\}</span></div>',
            '<div role="group" aria-label="Slips, four bars at a time" style="flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px">'
            '<sc-for list="{{doneGroups}}" as="g" hint-placeholder-count="4"><button type="button" aria-label="{{g.aria}}" onClick="{{g.pick}}" style="min-width: 0; min-height: 72px; box-sizing: border-box; padding: 8px; border: 0; border-radius: 12px; background: {{g.bg}}; box-shadow: {{g.ring}}; color: #332921; font: inherit; display: flex; flex-direction: column; align-items: stretch; gap: 4px; text-align: left">'
            '<span style="font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums">{{g.l}}</span>'
            '<span aria-hidden="true" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2px"><sc-for list="{{g.cells}}" as="c" hint-placeholder-count="4"><span style="height: 12px; border-radius: 3px; background: {{c.bg}}"></span></sc-for></span>'
            '<span style="font-size: 12px; color: {{g.subC}}; font-variant-numeric: tabular-nums">{{g.sub}}</span>'
            '<span style="display: {{g.pauseShow}}; margin-top: -4px; font-size: 12px; color: #685E56; font-variant-numeric: tabular-nums">{{g.pause}}</span></button></sc-for></div>'
            '', flags=re.S)
    t = t.replace('>Each bar</p>', '>Bars</p>')
    t = lit(t, "doneBarsLine: 'Most slips in bars 5–8 (5 of 7). Tap a bar to practise its four.',",
            ""
            "doneGroups: [0, 1, 2, 3].map((g) => { const n4 = [0, 0, 1, 0, 0, 3, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0].slice(g * 4, g * 4 + 4), a = g * 4 + 1, n = n4.reduce((x, y) => x + y, 0), weak = a === 5, p = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0].slice(g * 4, g * 4 + 4).reduce((x, y) => x + y, 0);\n"
            "  return { l: a + '–' + (a + 3), cells: n4.map((k) => ({ bg: k === 0 ? '#E4DDD3' : k === 1 ? '#F8D9C2' : k === 2 ? '#F0A877' : '#B07A2A' })), sub: n === 0 ? 'No slips' : n === 1 ? '1 slip' : n + ' slips', subC: n ? '#332921' : '#685E56', pause: p === 1 ? '1 pause' : p + ' pauses', pauseShow: p ? 'block' : 'none',\n"
            "    aria: 'Bars ' + a + '–' + (a + 3) + ': ' + (n === 0 ? 'no slips' : n === 1 ? '1 slip' : n + ' slips') + (p ? ', ' + (p === 1 ? '1 pause' : p + ' pauses') : '') + '. Practise them', bg: weak ? '#FBF1DD' : '#FEFDFB', ring: weak ? '0 0 0 2px #B07A2A' : '0 0 0 1px rgba(51,41,33,.07)',\n"
            "    pick: () => { this.setState({ loop: true, loopA: a, loopB: a + 3, bar: a, beat: 1 }); togglePlayNow(); } }; }),")
    # Played through's text stacks on the 4 scale, and its buttons without the browser's 1 by 6 padding (canvas 122)
    t = t.replace('flex-direction: column; gap: 2px', 'flex-direction: column; gap: 4px')
    t = t.replace('flex-direction: column; gap: 8px; padding-top: 2px"><button type="button" onClick="{{doneLoop}}"', 'flex-direction: column; gap: 8px; padding-top: 4px"><button type="button" onClick="{{doneLoop}}"', 1)
    for act in ('doneLoop', 'doneAgain', 'doneStep'):
        t = t.replace(f'onClick="{{{{{act}}}}}" style="height:', f'onClick="{{{{{act}}}}}" style="padding: 0; height:', 1)
    # Played through ends with Done, as every sheet does
    t = sub(t, r'<button type="button" aria-label="Close" onClick="\{\{doneClose\}\}" style="[^"]*">.*?</button>',
            '<button type="button" onClick="{{doneClose}}" style="flex: none; height: 44px; margin: -6px -4px 0 0; padding: 0 4px; border: 0; background: transparent; color: #356890; font: inherit; font-size: 17px; font-weight: 600">Done</button>', flags=re.S)
    # Wait or Play as the Chords page's radio cards: a picture, the name, the check
    m = re.search(r'<div role="group" aria-label="Mode" style="[^"]*"><sc-for list="\{\{modeTiles\}\}" as="o" hint-placeholder-count="2">.*?</sc-for></div>', t, flags=re.S)
    assert m, 'mode tiles'
    icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{o.d}}"></path></svg>'
    card = VCARD('o', icon, '{{o.name}}').replace('width: 52px; height: 40px;', 'width: 44px; height: 40px;')
    t = t[:m.start()] + '<div role="radiogroup" aria-label="Mode" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px"><sc-for list="{{modeTiles}}" as="o" hint-placeholder-count="2">' + card + '</sc-for></div>' + t[m.end():]
    t = sub(t, r"line: on \? '#B07A2A' : 'transparent', bg: on \? '#FBF1DD' : '#FFFFFF', pick: \(\) => this\.setState\(\{ mode",
            "line: on ? '#B07A2A' : 'transparent', bg: on ? '#FBF1DD' : '#FEFDFB', ring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1px rgba(51,41,33,.07)', dot: on ? '#B07A2A' : 'transparent', dotRing: on ? 'none' : 'inset 0 0 0 2px #DAD1C8', mk: on ? 1 : 0, pick: () => this.setState({ mode")
    return t


def lit(t, a, b):  # a literal, exactly once
    assert t.count(a) == 1, a[:60]
    return t.replace(a, b)


def icons(t):
    # One picture per mode (owner, canvas 118): the toolbar and the Practice sheet read the same map.
    t = lit(t, "const WAVES = 'M2 5q2.5 2 5 0t5 0 5 0 5 0M2 12q2.5 2 5 0t5 0 5 0 5 0M2 19q2.5 2 5 0t5 0 5 0 5 0';\n", '')  # Follow is gone (R37-1)
    t = lit(t, "const GAUGE = 'm12 14 4-4M3.34 19a10 10 0 1 1 17.32 0';",
            "const METRO = 'M9 3h6l4 18H5L9 3ZM12 15l6-9M7.5 15h9'\nconst MODE_ICON = { wait: HOURGLASS, listen: METRO };")
    t = lit(t, "modeTiles: [['wait', 'Wait', HOURGLASS], ['play', 'Play', 'M9 3h6l4 18H5L9 3ZM12 15l6-9M7.5 15h9']]",
            "modeTiles: [['wait', 'Wait', MODE_ICON.wait], ['play', 'Play', MODE_ICON.listen]]")
    t = lit(t, "paceIcon: mode === 'wait' ? HOURGLASS : mode === 'follow' ? WAVES : GAUGE,",
            "paceIcon: MODE_ICON[mode === 'wait' ? 'wait' : 'listen'],")
    return t



# R43 canvas 119: Hands becomes Parts (Yamaha's right-hand and left-hand parts, Synthesia's Parts, Flat's mixer),
# each part a card in the Chords kit with its hand's picture, the same picture the toolbar wears.
SPK_UP = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#685E56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path></svg>'
ICOBTN = 'flex: none; width: 44px; height: 44px; margin: -6px; padding: 0; border: 0; border-radius: 9999px; background: transparent; display: flex; align-items: center; justify-content: center'
def PART(H, name, icon, tile, ink):
    low = name.lower()
    return ('<div style="border-radius: 12px; ' + CARD + '">'
            f'<button type="button" role="switch" aria-label="{name}" aria-checked="{{{{part{H}.on}}}}" aria-disabled="{{{{part{H}.lock}}}}" onClick="{{{{part{H}.flip}}}}" style="{ROW}; width: 100%; padding: 8px 16px 8px 8px; border: 0; background: transparent; font: inherit; text-align: left">'
            f'<span style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px"><span aria-hidden="true" style="flex: none; width: 40px; height: 40px; border-radius: 4px; background: {tile}; color: {ink}; display: flex; align-items: center; justify-content: center">{icon}</span>'
            f'<span style="font-weight: 600">{name}</span></span>' + SWITCH(f'part{H}') + '</button>'
            f'<div style="opacity: {{{{part{H}.op}}}}; pointer-events: {{{{part{H}.pe}}}}">'
            f'<div style="{ROW}; {SEP}"><button type="button" aria-label="{{{{vol{H}MuteLabel}}}}" data-tip="{{{{vol{H}MuteLabel}}}}" aria-pressed="{{{{vol{H}Muted}}}}" onClick="{{{{vol{H}Down}}}}" style="{ICOBTN}">'
            f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#685E56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{{{vol{H}Icon}}}}"></path></svg></button>'
            f'<input type="range" aria-label="{name} volume" min="0" max="100" step="5" value="{{{{vol{H}}}}}" onChange="{{{{setVol{H}}}}}" style="flex: 1; min-width: 0; margin: 0; accent-color: #332921">'
            f'<button type="button" aria-label="{name} louder" data-tip="Louder" onClick="{{{{vol{H}Up}}}}" style="{ICOBTN}">{SPK_UP}</button>'
            f'<span style="min-width: 40px; text-align: right; font-size: 15px; font-variant-numeric: tabular-nums; color: #332921">{{{{vol{H}}}}}%</span></div>'
            f'<button type="button" role="switch" aria-label="Dim the {low}" aria-checked="{{{{dim{H}.on}}}}" onClick="{{{{dim{H}.flip}}}}" style="{ROW}; {SEP}; width: 100%; border-left: 0; border-right: 0; border-bottom: 0; background: transparent; font: inherit; text-align: left"><span>Dim</span>' + SWITCH(f'dim{H}') + '</button>'
            '</div></div>')
HAND_R = HANDI.replace('width="20" height="20"', 'width="24" height="24"')
HAND_L = HANDL.replace('width="20" height="20"', 'width="24" height="24"')
PARTS_BODY = (PART('R', 'Right hand', HAND_R, '#F8E3DC', '#8E4532') + '\n' + PART('L', 'Left hand', HAND_L, '#ECE6F5', '#5B4B86') + '\n')
PARTVALS = ("...(() => { const one = (H, O) => { const cur = s['show' + H] ?? 'show', other = s['show' + O] ?? 'show', st = showTurn('show' + H, cur), on = cur !== 'hide', lock = on && other === 'hide';"
            " return { ['part' + H]: { on: on ? 'true' : 'false', lock: lock ? 'true' : 'false', track: !on ? '#DAD1C8' : lock ? '#B5D4B9' : '#7FB685', knob: on ? 22 : 2, flip: lock ? () => {} : st.flip, op: on ? 1 : 0.4, pe: on ? 'auto' : 'none' },"
            " ['dim' + H]: { on: cur === 'dim' ? 'true' : 'false', track: cur === 'dim' ? '#7FB685' : '#DAD1C8', knob: cur === 'dim' ? 22 : 2, flip: st.dim } }; }; return { ...one('R', 'L'), ...one('L', 'R') }; })(), ")
SHOWROWS = ('<div style="padding: 0 4px; font-size: 13px; color: #685E56">Show</div>'
            '<div style="border-radius: 12px; ' + CARD + '"><sc-for list="{{showChips}}" as="c" hint-placeholder-count="6">'
            '<button type="button" role="switch" aria-checked="{{c.on}}" onClick="{{c.pick}}" style="' + ROW + '; border-top: {{c.sep}}; width: 100%; border-left: 0; border-right: 0; border-bottom: 0; margin-top: -1px; background: transparent; font: inherit; text-align: left"><span>{{c.name}}</span>' + SWITCH('c') + '</button></sc-for></div>')


def parts(t, phone):
    i = t.index('<section role="dialog" aria-label="Hands"'); j = t.index('</section>', i)
    sec = t[i:j]
    k = sec.index('</h2>'); k = sec.index('\n', k) + 1
    head = sec[:k].replace('aria-label="Hands"', 'aria-label="Parts"').replace('>Hands</h2>', '>Parts</h2>')
    t = t[:i] + head + PARTS_BODY + t[j:]
    t = lit(t, "...volOf('L', 60),", "...volOf('L', 60), " + PARTVALS)
    # the toolbar's button names the menu it opens; it shows which hands sound
    if 'aria-label="Hands: {{handsLabel}}"' in t:
        t = lit(t, 'aria-label="Hands: {{handsLabel}}"', 'aria-label="Parts: {{handsLabel}}" data-tip="Parts"')
    else:
        t = lit(t, '<button type="button" aria-expanded="{{isHands}}" onClick="{{openHands}}"', '<button type="button" aria-label="Parts: {{handsLabel}}" data-tip="Parts" aria-expanded="{{isHands}}" onClick="{{openHands}}"')
    # Sheet › Show: one switch row each, as every other on/off in the kit (no honey chips)
    a = t.index('<span>Show</span><div role="group" aria-label="Show"'); a = t.rfind('<div style="', 0, a)
    b = t.index('</sc-for></div></div>', a) + len('</sc-for></div></div>')
    t = t[:a] + '</div>' + SHOWROWS + '<div style="display: none">' + t[b:]
    t = lit(t, "return { name, on: on ? 'true' : 'false', line: on ? '#B07A2A' : '#DDD5CA', bg: on ? '#FBF1DD' : '#FFFFFF', fg: '#332921', pick:",
            "return { name, on: on ? 'true' : 'false', track: on ? '#7FB685' : '#DAD1C8', knob: on ? 22 : 2, sep: id === 'chords' ? '0' : '1px solid #E9E2D8', pick:")
    return t



def grid4(t, phone):
    """R43 canvas 120 (owner: "did you check the paddings, the spacing and all other?"): every padding and gap in the
    Player's sheets on the 4 scale, every target 44, the transport's middle on the centre line."""
    def swap(a, b):
        nonlocal t
        assert a in t, a[:70]
        t = t.replace(a, b)
    swap('<p style="margin: 6px 4px -4px; font-size: 13px', '<p style="margin: 8px 4px -4px; font-size: 13px')
    swap('display: flex; align-items: center; justify-content: center; gap: 14px"', 'display: flex; align-items: center; justify-content: center; gap: 16px"')
    swap('margin-top: 3px; font-size: 12px', 'margin-top: 4px; font-size: 12px')
    swap('display: inline-flex; align-items: center; gap: 6px">{{c.name}}', 'display: inline-flex; align-items: center; gap: 4px">{{c.name}}')
    # the transport: three columns, so the tinted middle sits on the centre line whatever the sides say
    i = t.index('role="toolbar" aria-label="Transport" style="'); j = t.index('"', i + 46)
    t = t[:i] + t[i:j].replace('display: flex; justify-content: center; align-items: center; gap: 8px;', 'display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px;') + t[j:]
    assert 'grid-template-columns: minmax(0, 1fr) auto' in t[i:i + 400]
    swap('<div role="group" aria-label="Practice and loop" style="', '<div role="group" aria-label="Practice and loop" style="justify-self: end; ')
    swap('<div role="group" aria-label="Hands and keyboard" style="', '<div role="group" aria-label="Hands and keyboard" style="justify-self: start; ')
    # targets: a segment (30 tall in its 48 row) and a 40 control reach 44 with a pseudo-element; the mark keeps its size
    swap("<style data-r43>", "<style data-r43>button[style*=\"height: 30px\"], button[style*=\"height: 40px\"]:not([style*=\"position: absolute\"]) { position: relative }"
         " button[style*=\"height: 30px\"]::before { content: \"\"; position: absolute; inset: -7px -1px }"
         " button[style*=\"height: 40px\"]::before { content: \"\"; position: absolute; inset: -2px }")
    # every remaining off-scale padding and gap inside a style attribute, to the nearest step of 4 (the score's own
    # engraving margins, the negative margins that keep a mark small inside its 44px target, and the two hands'
    # optical overlap stay as they are)
    SNAP = {'gap: 3px': 'gap: 4px', 'gap: 6px': 'gap: 8px', 'gap: 10px': 'gap: 8px', 'padding: 0 6px': 'padding: 0 8px',
            'padding: 0 14px': 'padding: 0 16px', 'padding: 12px 14px': 'padding: 12px 16px', 'padding: 14px': 'padding: 16px',
            'padding: 28px 14px': 'padding: 28px 16px', 'padding: 0 18px': 'padding: 0 16px', 'padding: 0 14px 0 10px': 'padding: 0 16px 0 12px',
            'padding: 0 14px 0 12px': 'padding: 0 16px 0 12px', 'padding: 8px 4px 8px 10px': 'padding: 8px 4px 8px 12px',
            'padding-top: 6px': 'padding-top: 8px', 'margin-right: 6px': 'margin-right: 8px', 'margin-left: 6px': 'margin-left: 8px',
            'padding: 3px': 'padding: 4px', 'padding: 0 6px 0 12px': 'padding: 0 8px 0 12px', 'padding: 2px 2px 0 6px': 'padding: 4px 4px 0 8px'}
    def snap(m):
        st = m.group(1)
        st = re.sub(r'(?<![-\w])(gap|padding|padding-top|margin-right|margin-left): [^;"]*', lambda k: SNAP.get(k.group(0), k.group(0)), st)
        return 'style="' + st + '"'
    t = re.sub(r'style="([^"]*)"', snap, t)
    # the loop's grips: a 24px handle reaches 44 to the side away from the bars it holds
    t = t.replace("<style data-r43>", "<style data-r43>button[type][aria-label^=\"Loop starts\"]::before, button[type][aria-label^=\"Loop ends\"]::before { content: \"\"; position: absolute; inset: -2px -12px } ", 1)
    swap('width: 170px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))', 'width: 188px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr))')  # Repeats: 44 a segment
    # Arrangement · Accompaniment drawn as Practice's Wait · Play: the card tints when chosen and its check sits at the
    # right (owner, canvas 117: "Wait · Play as radio cards"; one choice, one drawing)
    for v in ('arr', 'acc'):
        swap(f"{v}: ((on) => ({{ on: on ? 'true' : 'false', line: on ? '#B07A2A' : 'transparent', ring: on ? '#B07A2A' : '#BDB3A7', dot: on ? 1 : 0,",
             f"{v}: ((on) => ({{ on: on ? 'true' : 'false', line: on ? '#B07A2A' : 'transparent', ring: on ? '#B07A2A' : '#BDB3A7', dot: on ? 1 : 0, bg: on ? '#FBF1DD' : '#FEFDFB', fill: on ? '#B07A2A' : 'transparent', fRing: on ? 'none' : 'inset 0 0 0 2px #DAD1C8',")
        a = t.index(f'role="radio" aria-checked="{{{{{v}.on}}}}"'); a = t.rfind('<div style="border-radius: 12px; background: #FEFDFB;', 0, a)
        t = t[:a] + t[a:].replace('<div style="border-radius: 12px; background: #FEFDFB;', f'<div style="border-radius: 12px; background: {{{{{v}.bg}}}};', 1)
        a = t.index(f'role="radio" aria-checked="{{{{{v}.on}}}}"'); b = t.index('</button>', a)
        btn = t[a:b]
        i = btn.index('<span aria-hidden="true" style="flex: none; width: 20px'); j = btn.index('</span></span>', i) + len('</span></span>')
        name = btn[j:]
        dot = (f'<span aria-hidden="true" style="flex: none; width: 22px; height: 22px; border-radius: 11px; background: {{{{{v}.fill}}}}; box-shadow: {{{{{v}.fRing}}}}; color: #FEFDFB; display: flex; align-items: center; justify-content: center">'
               f'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity: {{{{{v}.dot}}}}"><path d="m5 12 5 5 9-10"></path></svg></span>')
        btn = btn[:i].replace('justify-content: flex-start; gap: 12px;', 'gap: 12px;') + '<span style="flex: 1; min-width: 0">' + name + '</span>' + dot
        t = t[:a] + btn + t[b:]
    return t



def headed(t, phone):
    """Loop round 24 (owner, IMG_6045–6056: "the titles doesnt look good and should be in the headers ... no settings in
    the view buttons. floating buttons with backroung doesnt make sense"): the bar is a band of paper with a hairline,
    Close and the gear plain icons on it, the song's title and its credit beside Close; the score prints no title
    under it. A view button only shows its view; its settings are the gear's. On a phone the views are one button
    with the view shown, opening a menu of the four."""
    top = 66 if phone else 16
    left = 60 if phone else 68
    plain = 'border: 0; background: transparent; color: #332921'
    t = re.sub(r'(aria-label="Close" data-tip="Close" style="[^"]*?)border: 1px solid \{\{glassLine\}\}; border-radius: 9999px; background: \{\{glass\}\}; backdrop-filter: blur\(12px\); color: \{\{glassFg\}\}',
               r'\1border: 0; border-radius: 9999px; background: transparent; color: #332921', t, count=1)
    t = re.sub(r'(aria-label="Settings" data-tip="Settings" aria-expanded="\{\{isMore\}\}" onClick="\{\{openMore\}\}" style="[^"]*?)border: 1px solid \{\{glassLine\}\}; border-radius: 9999px; background: \{\{setBg\}\}; backdrop-filter: blur\(12px\); color: \{\{glassFg\}\}',
               r'\1border: 0; border-radius: 9999px; background: {{setBgPlain}}; color: #332921', t, count=1)
    # each view button only shows its view
    t = t.replace("pick: () => (id !== view ? this.setState({ view: id, open: 'none' }) : this.setState({ open: open === 'view' ? 'none' : 'view' })),",
                  "pick: () => this.setState({ view: id, open: 'none' }),", 1)
    t = t.replace("const hint = !on ? 'Show ' + name : sheet ? (pano ? 'Show as pages' : 'Show as one line') : name + ' settings';", "const hint = name;", 1)
    t = t.replace("const label = sheet && on ? (pano ? 'Sheet, one line' : 'Sheet, pages') : name;", "const label = name;", 1)
    t = t.replace("isMore: open === 'settings',", "isMore: open === 'settings', isViews: open === 'views', openViews: toggleOpen('views'), setBgPlain: open === 'settings' ? '#EEE9E2' : 'transparent', viewNowD: (VIEWS.find((v) => v[0] === view) || VIEWS[0])[2], viewNowName: (VIEWS.find((v) => v[0] === view) || VIEWS[0])[1],", 1)
    if phone:
        nav0 = t.index('<nav aria-label="View"')
        nav1 = t.index('</nav>', nav0) + len('</nav>')
        menu = ('<button type="button" aria-label="View: {{viewNowName}}" data-tip="View" aria-expanded="{{isViews}}" onClick="{{openViews}}" '
                f'style="position: absolute; z-index: 48; right: 60px; top: {top}px; width: 44px; height: 44px; border: 0; border-radius: 9999px; background: transparent; color: #332921; display: flex; align-items: center; justify-content: center">'
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{viewNowD}}"></path></svg></button>'
                '<sc-if value="{{isViews}}" hint-placeholder-val="{{false}}"><div onClick="{{openViews}}" style="position: absolute; inset: 0; z-index: 55"></div>'
                f'<div role="menu" aria-label="View" style="position: absolute; z-index: 56; right: 12px; top: {top + 50}px; width: 220px; box-sizing: border-box; padding: 6px; border-radius: 16px; background: #FEFDFB; '
                'box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 2px 4px rgba(51,41,33,.08), 0 18px 40px -12px rgba(51,41,33,.28)">'
                '<sc-for list="{{views}}" as="v" hint-placeholder-count="4"><button type="button" role="menuitemradio" aria-checked="{{v.on}}" onClick="{{v.pick}}" '
                'style="width: 100%; height: 44px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 12px; padding: 0 10px; color: #332921; font: inherit; font-size: 16px; text-align: left">'
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{v.d}}"></path></svg>'
                '<span style="flex: 1">{{v.label}}</span><span aria-hidden="true" style="opacity: {{v.tick}}; font-weight: 700">✓</span></button></sc-for></div></sc-if>')
        t = t[:nav0] + menu + t[nav1:]
        t = t.replace("on: on ? 'true' : 'false', bg: on ? '#332921' : 'transparent',", "on: on ? 'true' : 'false', tick: on ? 1 : 0, bg: on ? '#332921' : 'transparent',", 1)
    # with the keys shown the views still start under the bar (they started at 16, from before the bar was a band)
    old, new = ('topKeys: 16', 'topKeys: 128') if phone else ('topKeys: 36', 'topKeys: 80')
    assert old in t
    t = t.replace(old, new, 1)
    return t


def onebar(t, phone):
    """Loop round 61 (owner, 2026-11-16: "the headers should be properly with no background and glass buttons … proper way
    to switch from the player to editor not like this two different controls in the editor and in the player"): the
    Player's bar is the editor's, from the kit: no band; Close a glass circle leading; the Play · Edit switch (Play
    chosen) where the editor's stands; the Player's own controls one glass group trailing (on a phone View and
    Settings, on a laptop the four views beside Settings). The title is the score's, printed on the page as the editor
    prints it; the other views print the same head above their content."""
    close = re.search(r'<a href="(Song(?:Laptop)?\.dc\.html)" aria-label="Close" data-tip="Close" style="[^"]*">\s*(<svg.*?</svg>)\s*</a>\n?', t, re.S)
    sett = re.search(r'<div style="position: absolute; right: \d+px; top: \d+px; display: flex; gap: 8px">\s*(<button type="button" aria-label="Settings".*?</button>)\s*</div>\n?', t, re.S)
    assert close and sett, 'bar parts'
    gear = re.sub(r'style="width: 44px; height: 44px; border: 0; border-radius: 9999px;', 'style="position: relative; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 22px;', sett.group(1), count=1)
    if phone:
        vb = re.search(r'<button type="button" aria-label="View: \{\{viewNowName\}\}".*?</button>', t, re.S)
        view = vb.group(0).replace('position: absolute; z-index: 48; right: 60px; top: 66px; ', 'position: relative; padding: 0; ').replace('border-radius: 9999px', 'border-radius: 22px')
        t = t[:vb.start()] + t[vb.end():]
        # the views' menu hangs from the bar's foot, at its trailing edge
        t = t.replace('right: 12px; top: 116px; width: 220px;', 'right: 16px; top: 120px; width: 220px;', 1)
        right = f'<div style="display: flex; justify-content: flex-end; min-width: 132px"><div role="group" aria-label="View and settings" style="flex: none; display: flex; border-radius: 22px; {GLASSFX}; pointer-events: auto">{view}{gear}</div></div>'
    else:
        nb = re.search(r'<nav aria-label="View".*?</nav>\n?', t, re.S)
        nav = re.sub(r'style="z-index: 48; position: absolute; left: 50%; top: 16px; transform: translateX\(-50%\); height: 44px; box-sizing: border-box; padding: 4px; display: flex; gap: 2px; border-radius: 9999px; border: 1px solid \{\{glassLine\}\}; background: \{\{glass\}\}; backdrop-filter: blur\(12px\)"',
                     f'style="flex: none; height: 44px; box-sizing: border-box; padding: 4px; display: flex; gap: 2px; border-radius: 22px; {GLASSFX}; pointer-events: auto"', nb.group(0), count=1)
        assert nav != nb.group(0), 'nav'
        t = t[:nb.start()] + t[nb.end():]
        right = f'<div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; min-width: 132px">{nav}<div style="flex: none; display: flex; border-radius: 22px; {GLASSFX}; pointer-events: auto">{gear}</div></div>'
    sett = re.search(r'<div style="position: absolute; right: \d+px; top: \d+px; display: flex; gap: 8px">\s*<button type="button" aria-label="Settings".*?</button>\s*</div>\n?', t, re.S)
    t = t[:sett.start()] + t[sett.end():]
    href, xsvg = close.group(1), close.group(2)
    x = (f'<a href="{href}" aria-label="Close" data-tip="Close · Esc" style="flex: none; position: relative; width: 44px; height: 44px; border-radius: 22px; {GLASSFX}; '
         f'color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none; pointer-events: auto">{xsvg}</a>')
    bar = (f'<header style="position: absolute; z-index: 48; left: 0; right: 0; top: {54 if phone else 0}px; {MODEBAR_P if phone else MODEBAR_L}; pointer-events: none">'
           f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{x}</div>'
           f'{MODESW("play", "Editor.dc.html" if phone else "EditorLaptop.dc.html")}{right}</header>\n')
    close = re.search(r'<a href="Song(?:Laptop)?\.dc\.html" aria-label="Close" data-tip="Close" style="[^"]*">\s*<svg.*?</svg>\s*</a>\n?', t, re.S)
    t = t[:close.start()] + bar + t[close.end():]
    # the title prints as the editor prints it: the book serif at its regular weight (the editor's page, scaled to the Player's staves)
    t = re.sub(r"(<h2 style=\"position: absolute; left: 0; right: 0; top: \d+px; margin: 0; text-align: center; )font-family: Georgia, 'Times New Roman', serif; font-size: (26|40)px; font-weight: 700;",
               lambda m: m.group(1) + f"font-family: {SERIF}; font-size: {24 if phone else 36}px; font-weight: 400;", t)
    # one way to the editor: the bar's Edit (the song sheet's Edit score went with it, "one way to each action")
    t, n = re.subn(r'<button type="button" style="flex: 1 1 100%; order: 1;[^"]*"><svg[^>]*><path d="M12 20h9M16\.5[^"]*"></path></svg>Edit score</button>', '', t)
    assert n == 1, 'edit score'
    # the other views print the score's head, and start under it
    h2 = re.search(r'<h2 style="position: absolute; left: 0; right: 0; top: \d+px; ([^"]*)">Amazing Grace</h2><p style="position: absolute; left: 0; right: 0; top: \d+px; ([^"]*)">Words: John Newton · Music: New Britain</p>', t)
    assert h2, 'title'
    headH = 52 if phone else 72
    head = (f'<sc-if value="{{{{notSheet}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; left: 16px; right: 16px; top: {{{{viewHeadTop}}}}px; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none">'
            f'<h2 style="{h2.group(1)}">Amazing Grace</h2><p style="{h2.group(2)}">Words: John Newton · Music: New Britain</p></div></sc-if>\n')
    t = t.replace('<sc-if value="{{isDiagrams}}"', head + '<sc-if value="{{isDiagrams}}"', 1)
    old = 'viewTop: keys ? DEV.topKeys : DEV.top,'
    assert old in t, 'viewTop'
    t = t.replace(old, f"viewTop: (keys ? DEV.topKeys : DEV.top) + {headH}, viewHeadTop: keys ? DEV.topKeys : DEV.top, notSheet: view !== 'sheet',", 1)
    return t


def floating(t, phone):
    """Loop round 24 (owner, IMG_6045–6056: "piano should also be floating and draggabble and resizeble from all the
    angles"): the keys are a window over the music, at the foot above the transport until moved: rounded, lifted,
    a grip along its top to move it and handles at its four corners and four edges to size it from any side. The
    music takes the whole screen under the bar; nothing is docked at the top."""
    left, w, bottom = (8, 386, 762) if phone else (305, 1100, 800)
    t = t.replace("const KB = { top: 62, w: 402," if phone else "const KB = { top: 0, w: 1710,", f"const KB = {{ top: 0, w: {w},", 1)
    t = t.replace("kbTop: KB.top, kbW: KB.w,", f"kbTop: {bottom} - bandH, kbLeft: {left}, kbW: KB.w,", 1)
    t = t.replace("areaTop: keys ? KB.top + bandH : 0,", "areaTop: 0,", 1)
    t = t.replace('<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 402px; height: 62px; background: #2A1F18"></div>\n', '', 1)
    t = t.replace('left: 0; top: {{kbTop}}px;', 'left: {{kbLeft}}px; top: {{kbTop}}px;')
    lift = 'border-radius: 20px; box-shadow: 0 0 0 1px rgba(51,41,33,.10), 0 2px 6px rgba(51,41,33,.14), 0 18px 40px -12px rgba(51,41,33,.40)'
    t = t.replace('height: {{kbH}}px; object-fit: cover">', 'height: {{kbH}}px; object-fit: cover; ' + lift + '">', 1)
    t = t.replace('height: {{kbH}}px; overflow: hidden; background: #2A1F18">', 'height: {{kbH}}px; overflow: hidden; background: #2A1F18; ' + lift + '">', 1)
    if phone:
        t = t.replace("sheetTop: keys ? 40 : 116,", "sheetTop: 124,", 1).replace("statusFg: keys ? '#FFFFFF' : '#332921',", "statusFg: '#332921',", 1).replace("panoTop: keys ? 191 : 376,", "panoTop: 376,", 1)
    else:
        t = t.replace("sheetTop: keys ? 44 : 64, bandTop: (keys ? 44 : 64) + 100,", "sheetTop: 76, bandTop: 176,", 1).replace("panoTop: keys ? 166 : 340,", "panoTop: 340,", 1)
    h = 'position: absolute; z-index: 21; background: rgba(254,253,251,.92); box-shadow: 0 0 0 1px rgba(51,41,33,.25)'
    chrome = (
        # only while the piano shows (round 41: the grips stood on a bare score with the piano off)
        '<sc-if value="{{kbOn}}" hint-placeholder-val="{{false}}">'
        '<div aria-hidden="true" style="position: absolute; z-index: 20; left: {{kbLeft}}px; top: {{kbTop}}px; width: {{kbW}}px; height: {{kbH}}px; border-radius: 20px; pointer-events: none">'
        # the grip along the top: hold and move
        '<span data-tip="Move the piano" style="position: absolute; left: 50%; top: 0; width: 88px; height: 24px; margin-left: -44px; display: flex; align-items: center; justify-content: center; cursor: grab; pointer-events: auto">'
        '<span style="width: 44px; height: 5px; border-radius: 3px; background: rgba(254,253,251,.92); box-shadow: 0 0 0 1px rgba(51,41,33,.25)"></span></span>'
        # the four corners
        f'<span style="{h}; left: 6px; top: 6px; width: 14px; height: 4px; border-radius: 2px; cursor: nwse-resize"></span><span style="{h}; left: 6px; top: 6px; width: 4px; height: 14px; border-radius: 2px; cursor: nwse-resize"></span>'
        f'<span style="{h}; right: 6px; top: 6px; width: 14px; height: 4px; border-radius: 2px; cursor: nesw-resize"></span><span style="{h}; right: 6px; top: 6px; width: 4px; height: 14px; border-radius: 2px; cursor: nesw-resize"></span>'
        f'<span style="{h}; left: 6px; bottom: 6px; width: 14px; height: 4px; border-radius: 2px; cursor: nesw-resize"></span><span style="{h}; left: 6px; bottom: 6px; width: 4px; height: 14px; border-radius: 2px; cursor: nesw-resize"></span>'
        f'<span style="{h}; right: 6px; bottom: 6px; width: 14px; height: 4px; border-radius: 2px; cursor: nwse-resize"></span><span style="{h}; right: 6px; bottom: 6px; width: 4px; height: 14px; border-radius: 2px; cursor: nwse-resize"></span>'
        # the four edges
        f'<span style="{h}; left: 3px; top: 50%; width: 4px; height: 28px; margin-top: -14px; border-radius: 2px; cursor: ew-resize"></span>'
        f'<span style="{h}; right: 3px; top: 50%; width: 4px; height: 28px; margin-top: -14px; border-radius: 2px; cursor: ew-resize"></span>'
        f'<span style="{h}; left: 50%; bottom: 3px; width: 28px; height: 4px; margin-left: -14px; border-radius: 2px; cursor: ns-resize"></span>'
        '</div></sc-if>')
    anchor = '<sc-if value="{{showControls}}" hint-placeholder-val="{{true}}">\n\n</sc-if>\n</sc-if>'
    assert anchor in t, 'anchor'
    t = t.replace(anchor, chrome + '\n' + anchor, 1)
    return t

for name, phone in (('PlayerApp', True), ('PlayerDesk', False)):
    t = floating(onebar(headed(grid4(parts(icons(kit(patch((HERE / 'base' / f'{name}.dc.html').read_text(), phone), phone)), phone), phone), phone), phone), phone)
    # Played through: its title on the sheet's 16 column, as its cards and buttons (the lines, 2026-11-18)
    t = t.replace('gap: 8px; padding: 4px 4px 0 8px"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><h2', 'gap: 8px; padding: 4px 0 0 0"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><h2')
    # Played through: its two and four columns stand 12 apart, more than a card's own inset, so each reads alone (the lines' proximity)
    i = t.find('aria-label="Played through"')
    if i >= 0:
        j = t.index('</section>', i)
        t = t[:i] + t[i:j].replace('minmax(0, 1fr)); gap: 8px', 'minmax(0, 1fr)); gap: 12px') + t[j:]
    if phone:  # the floating piano keeps its place over the centred score when the phone layout is wider (744)
        t = t.replace('left: {{kbLeft}}px', 'left: calc({{kbLeft}}px + max(0px, 50% - 201px))')
        t = t.replace('position: absolute; left: 0; top: 0; width: 402px; height: 874px; border: 0; padding: 0; background: rgba(26, 22, 18, 0.32)', 'position: absolute; inset: 0; border: 0; padding: 0; background: rgba(26, 22, 18, 0.32)')
        # the keys and the transport hang from the screen's foot, so a shorter screen (a phone on its side) keeps them (round 66)
        t = t.replace('top: {{kbTop}}px', 'top: calc(100% - 874px + {{kbTop}}px)').replace('calc({{capTop}}px', 'calc(100% - 874px + {{capTop}}px')
    (OUT / f'{name}.dc.html').write_text(t)
# a board for the new page
w = (OUT / 'PlayerSettings.dc.html').read_text()
(OUT / 'PlayerKey.dc.html').write_text(w.replace('open="settings"', 'open="key"').replace('song settings</title>', 'Transpose</title>'))
# R43 canvas 119: the view settings and Parts on boards of their own
ph = (OUT / 'PlayerSettings.dc.html').read_text()
(OUT / 'PlayerHands.dc.html').write_text(ph.replace('open="settings"', 'open="hands"').replace('song settings</title>', 'Parts</title>'))
for v, name in (('sheet', 'Sheet'), ('diagrams', 'Diagrams'), ('grid', 'Grid'), ('lyrics', 'Lyrics')):
    (OUT / f'PlayerView{name}.dc.html').write_text(ph.replace('view="sheet" open="settings"', f'view="{v}" open="view"').replace('song settings</title>', f'{name} settings</title>'))
lk = (OUT / 'PlayerLaptopKeyboard.dc.html').read_text()
(OUT / 'PlayerLaptopParts.dc.html').write_text(lk.replace('open="keys"', 'open="hands"').replace('Keyboard</title>', 'Parts</title>'))
(OUT / 'PlayerLaptopSheet.dc.html').write_text(lk.replace('open="keys"', 'open="view"').replace('Keyboard</title>', 'Sheet settings</title>'))
print('r43 player ok')
