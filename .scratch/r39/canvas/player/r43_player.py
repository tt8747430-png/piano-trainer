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
Run: python3 -I player/r43_player.py  (from .scratch/r39/canvas)"""
import re, pathlib

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

MOTION = ('<style data-r43>'
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
    return { s: LET[l] + ACCS[String(a2)], on, bg: on ? '#F6E3BC' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px #DAD1C8', fw: on ? 800 : 600,
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
    arrow = 'width: 40px; height: 48px; padding: 0; border: 0; border-radius: 20px; background: transparent; color: ' + INK + '; display: flex; align-items: center; justify-content: center'
    playst = 'width: 48px; height: 48px; padding: 0; border: 0; border-radius: 24px; background: transparent; color: ' + INK + '; display: flex; align-items: center; justify-content: center'
    back = restyle(back, arrow, svg(back), 'data-tip="A step back" data-tip-up ')
    fwd = restyle(fwd, arrow, svg(fwd), 'data-tip="A step forward" data-tip-up ')
    play = restyle(play, playst, svg(play))
    pace = pace.replace('aria-label="Pace: {{paceLabel}}"', 'aria-label="Practice: {{paceLabel}}"')
    if phone:
        cap = lambda bg='transparent', fg=INK: f'width: 48px; height: 48px; padding: 0; border: 0; border-radius: 24px; background: {bg}; color: {fg}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px'
        word = lambda v: f'<span style="font-size: 11px; font-weight: 600; line-height: 1; white-space: nowrap">{{{{{v}}}}}</span>'
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


for name, phone in (('PlayerApp', True), ('PlayerDesk', False)):
    t = patch((HERE / 'base' / f'{name}.dc.html').read_text(), phone)
    (OUT / f'{name}.dc.html').write_text(t)
# a board for the new page
w = (OUT / 'PlayerSettings.dc.html').read_text()
(OUT / 'PlayerKey.dc.html').write_text(w.replace('open="settings"', 'open="key"').replace('song settings</title>', 'Transpose</title>'))
print('r43 player ok')
