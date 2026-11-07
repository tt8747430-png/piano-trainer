import sys, re, json
proj = sys.argv[1]
def seg(label, lst, n):
    return f'''<div role="group" aria-label="{label}" style="display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 13px; font-weight: 600; color: #6B6259">{label}</span>
<div style="display: grid; grid-template-columns: repeat({n}, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 12px; background: #F2EDE6">
<sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="{n}">
<button type="button" aria-pressed="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 36px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.shadow}}}}; color: #1A1612; font-size: 14px; font-weight: 600; white-space: nowrap">{{{{o.name}}}}</button>
</sc-for>
</div>
</div>'''
def flatkeys(kind):
    if kind == 'w':
        return '''<sc-for list="{{flat.whites}}" as="k" hint-placeholder-count="36">
<div style="position: absolute; left: {{k.x}}px; top: 0; width: {{k.w}}px; height: 100%; box-sizing: border-box; border: 1px solid #CFC6BA; border-top: 0; border-radius: 0 0 {{k.r}}px {{k.r}}px; background: {{k.fill}}; box-shadow: {{k.ring}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: {{k.pad}}px; font-size: {{k.fs}}px; font-weight: {{k.weight}}; line-height: 1.15; text-align: center; white-space: pre-line; color: {{k.fg}}">{{k.label}}</div>
</sc-for>'''
    return '''<sc-for list="{{flat.blacks}}" as="k" hint-placeholder-count="25">
<div style="position: absolute; left: {{k.x}}px; top: 0; width: {{k.w}}px; height: {{k.h}}px; box-sizing: border-box; border-radius: 0 0 {{k.r}}px {{k.r}}px; background: {{k.fill}}; box-shadow: {{k.ring}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: {{k.pad}}px; font-size: {{k.fs}}px; font-weight: 700; line-height: 1.15; text-align: center; white-space: pre-line; color: {{k.fg}}">{{k.label}}</div>
</sc-for>'''
KEYS = f'''<sc-if value="{{{{kb3d}}}}" hint-placeholder-val="{{{{true}}}}">
<img src="{{{{kbImg}}}}" alt="{{{{kbAlt}}}}" style="position: absolute; left: 0; top: {{{{kbTop}}}}px; display: block; width: {{{{kbW}}}}px; height: {{{{kbH}}}}px; object-fit: cover">
</sc-if>
<sc-if value="{{{{kb2d}}}}" hint-placeholder-val="{{{{false}}}}">
<div role="img" aria-label="{{{{kbAlt}}}}" style="position: absolute; left: 0; top: {{{{kbTop}}}}px; width: {{{{kbW}}}}px; height: {{{{kbH}}}}px; overflow: hidden; background: #2A1F18">
<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: {{{{flat.h}}}}px; height: 5px; background: #8E2A22"></div>
<div aria-hidden="true" style="position: absolute; left: {{{{flat.left}}}}px; bottom: 0; width: {{{{flat.width}}}}px; height: {{{{flat.h}}}}px">
{flatkeys('w')}
{flatkeys('b')}
</div>
</div>
</sc-if>
<sc-if value="{{{{showControls}}}}" hint-placeholder-val="{{{{true}}}}">
<button type="button" aria-label="Keyboard settings" aria-expanded="{{{{isKeyboard}}}}" onClick="{{{{openKeyboard}}}}" style="position: absolute; right: {{{{gearRight}}}}px; top: {{{{gearTop}}}}px; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.22); border-radius: 9999px; background: rgba(26, 22, 18, 0.55); backdrop-filter: blur(12px); color: #FFFFFF; display: flex; align-items: center; justify-content: center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"></path></svg></button>
</sc-if>'''
PANEL = f'''
<sc-if value="{{{{isKeyboard}}}}" hint-placeholder-val="{{{{false}}}}">
<section role="dialog" aria-label="Keyboard" style="position: absolute; left: {{{{kp.left}}}}; right: {{{{kp.right}}}}; top: {{{{kp.top}}}}; bottom: {{{{kp.bottom}}}}; width: {{{{kp.width}}}}; box-sizing: border-box; padding: {{{{kp.pad}}}}; display: flex; flex-direction: column; gap: 14px; background: #FFFFFF; border-radius: {{{{kp.radius}}}}; box-shadow: 0 2px 4px rgba(26,22,18,0.10), 0 18px 40px -12px rgba(26,22,18,0.30)">
<div aria-hidden="true" style="display: {{{{kp.grabber}}}}; width: 36px; height: 5px; margin: 0 auto; border-radius: 9999px; background: #D9D1C6"></div>
<p style="margin: 0; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6259">Keyboard</p>
{seg('Keys', 'kbStyleOpts', 2)}
<sc-if value="{{{{kb3d}}}}" hint-placeholder-val="{{{{true}}}}">
{seg('Camera', 'kbViewOpts', 2)}
<label style="min-height: 40px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 15px"><span>Hands</span><input type="checkbox" checked="{{{{kbHandsOn}}}}" onChange="{{{{toggleKbHands}}}}" style="width: 20px; height: 20px; accent-color: #E8762F"></label>
</sc-if>
<sc-if value="{{{{kb2d}}}}" hint-placeholder-val="{{{{false}}}}">
{seg('Key labels', 'kbLabelOpts', 3)}
</sc-if>
<a href="#" style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #ECE6DD; color: #1A1612; font-size: 15px; text-decoration: none"><span>All keyboard settings</span><span aria-hidden="true">›</span></a>
</section>
</sc-if>
'''
JS = r'''const kbStyle = s.kbStyle ?? p.kbstyle ?? '3d';
const kbView = s.kbView ?? p.kbview ?? 'seat';
const kbHands = s.kbHands !== undefined ? s.kbHands : p.kbhands !== 'off';
const skin = s.skin ?? 1;
const kbNames = s.kbNames ?? true;
const kbFingers = s.kbFingers ?? false;
const otherOn = s.other ?? true;
const kbRange = s.kbRange ?? 'song';
const RANGES = { 61: [36, 96], 76: [28, 103], 88: [21, 108] };
const PLAYED = { 59: ['rh', 1], 62: ['rh', 2], 67: ['rh', 5], 43: ['lh', 5] };
const NOTE = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const flatBoard = () => {
const [lo, hi] = RANGES[kbRange] ?? KB.song;
let count = 0;
for (let m = lo; m <= hi; m++) if (![1, 3, 6, 8, 10].includes(m % 12)) count++;
const w = KB.w / count;
const h = Math.round(Math.min(KB.h - 5, Math.max(w * 5.2, KB.h * 0.55)));
const fs = Math.round(Math.min(15, Math.max(8, w * 0.38)));
const whites = [];
const blacks = [];
let wi = 0;
for (let m = lo; m <= hi; m++) {
const played = PLAYED[m];
const mine = played && (hands === 'both' || played[0] === hands);
const hand = played && (mine || otherOn) ? played : null;
const faint = hand && !mine;
const name = NOTE[m % 12];
const label = !mine ? (kbNames && m % 12 === 0 && w >= 14 ? 'C' + (Math.floor(m / 12) - 1) : '') : [kbNames ? name : '', kbFingers ? String(hand[1]) : ''].filter(Boolean).join('\n');
const fill = hand && hand[0] === 'rh' ? (faint ? '#F0D3CA' : '#E19E8C') : null;
const ring = hand && hand[0] === 'lh' ? 'inset 0 0 0 ' + (w > 12 ? 3 : 2) + 'px ' + (faint ? '#DDD4EC' : '#B8A8D8') : 'none';
if ([1, 3, 6, 8, 10].includes(m % 12)) blacks.push({ x: Math.round(wi * w - w * 0.31), w: Math.round(w * 0.62), h: Math.round(h * 0.62), r: w > 12 ? 3 : 1, fill: fill ?? 'linear-gradient(#3A332D, #14110E)', ring, fg: fill ? '#1A1612' : '#FFFFFF', label, fs: fs - 1, pad: 4 });
else { whites.push({ x: Math.round(wi * w), w: Math.round(w) + 1, r: w > 12 ? 4 : 1, fill: fill ?? 'linear-gradient(#FFFFFF 85%, #EDE6DC)', ring, fg: mine ? '#1A1612' : '#9A9086', weight: mine ? 700 : 500, label, fs: mine ? fs : fs - 2, pad: Math.round(h * 0.06) + 2 }); wi++; }
}
return { whites, blacks, width: KB.w, h, left: 0 };
};
const KB_IMG = { seat: { both: KB.seat, rh: KB.seatRh, lh: KB.seatLh, none: KB.seatBare }, above: { both: KB.above, rh: KB.aboveRh, lh: KB.aboveLh, none: KB.aboveBare } };
const opt = (list, cur, key) => list.map(([id, name]) => ({ name, on: id === cur ? 'true' : 'false', ...chip(id === cur), pick: pick({ [key]: id }) }));
const KB_VALS = {
kb3d: kbStyle === '3d', kb2d: kbStyle === '2d', kbTop: KB.top, kbW: KB.w, kbH: KB.h,
kbImg: KB_IMG[kbView][kbHands ? hands : 'none'],
kbAlt: kbStyle === '2d' ? 'The keys, flat, with the notes to play marked' : (kbHands ? { both: 'The hands at the keys, seen ', rh: 'The right hand at the keys, seen ', lh: 'The left hand at the keys, seen ' }[hands] : 'The keys, seen ') + (kbView === 'seat' ? 'from the seat' : 'from above'),
flat: flatBoard(), gearRight: KB.gearRight, gearTop: KB.gearTop,
isKeyboard: open === 'keyboard', openKeyboard: toggleOpen('keyboard'), kp: KB.panel,
kbStyleOpts: opt([['3d', '3D'], ['2d', '2D']], kbStyle, 'kbStyle'),
kbViewOpts: opt([['seat', 'Seat'], ['above', 'Above']], kbView, 'kbView'),
kbHandsOn: kbHands, toggleKbHands: () => this.setState({ kbHands: !kbHands }),
skins: [['Light', '#F3D9C4'], ['Medium light', '#E2B48F'], ['Medium dark', '#A8714A'], ['Dark', '#5E3D2A']].map(([name, color], i) => ({ name, color, on: i === skin ? 'true' : 'false', ring: i === skin ? '0 0 0 2px #FFFFFF, 0 0 0 4px #1A1612' : 'inset 0 0 0 1px rgba(26,22,18,0.15)', pick: pick({ skin: i }) })),
kbRangeOpts: opt([['song', 'Song'], ['61', '61'], ['76', '76'], ['88', '88']], kbRange, 'kbRange'),
};
'''
DEVS = {
'R3Laptop': ("const KB = { top: 0, w: 1710, h: 288, song: [36, 96], gearRight: 16, gearTop: 232, seat: '/_blob/ef706b1410b2c2d3e52329538f47da1b', seatBare: '/_blob/f0b0e3541a77fb9d730338690275ecd0', above: '/_blob/e4105c238636fb0dc4f5b3b5e775e756', aboveBare: '/_blob/d2b1476a5925429311f0813dac6ae837', seatRh: '/_blob/765830e19bd4ed9f31a081c1e71a078c', seatLh: '/_blob/8e2488fa050df8e8e7a5d50a4f270d42', aboveRh: '/_blob/f76e88b0576acf57aabc615f7431c697', aboveLh: '/_blob/e2d9fb6af010fb1b265a20d1c8979354', panel: { left: 'auto', right: '16px', top: '284px', bottom: 'auto', width: '340px', pad: '16px', radius: '16px', grabber: 'none' } };", '/_blob/663fcd1fa4b3cff6fd4188d8e7f4d8f2'),
'R3Phone': ("const KB = { top: 62, w: 402, h: 198, song: [41, 71], gearRight: 12, gearTop: 208, seat: '/_blob/ab00b18a02a9802a7331bbd6cc56ae1a', seatBare: '/_blob/07be3525ecd3619582e73be4e6084536', above: '/_blob/8a25e38d20444f7db9a325ae07bf264c', aboveBare: '/_blob/6b8dc6785ed528e1cb2ca9d05bbcaf04', seatRh: '/_blob/719e027e1798c893b4462e28a3fd8b34', seatLh: '/_blob/655e39b1f8d852beed4240efe7fc2503', aboveRh: '/_blob/3e8458992d7263f75f04dadf3eace033', aboveLh: '/_blob/3ae0751fd2abba00436662a58bea37cf', panel: { left: '0', right: '0', top: 'auto', bottom: '0', width: 'auto', pad: '8px 20px 34px', radius: '20px 20px 0 0', grabber: 'block' } };", '/_blob/26111798dc921611eaf5270d25a0fb72'),
}
for f, (dev, blob) in DEVS.items():
    pth = f'{proj}/{f}.dc.html'
    t = open(pth).read()
    lines = t.split('\n')
    i = next(k for k, l in enumerate(lines) if l.startswith(f'<img src="{blob}"'))
    lines[i] = KEYS
    t = '\n'.join(lines)
    c = t.index('<sc-if value="{{isChord}}"')
    t = t[:c] + PANEL.lstrip('\n') + '\n' + t[c:]
    t = t.replace('...VIEW_VALS,', '...VIEW_VALS,\n...KB_VALS,')
    r = t.index('const VIEWS = [')
    t = t[:r] + dev + '\n' + JS + t[r:]
    m = re.search(r"data-props='(.*?)'", t)
    props = json.loads(m.group(1))
    props['open']['options'] = ['none', 'pace', 'hands', 'more', 'keyboard']
    props = {k: v for k, v in props.items() if k != '$preview'} | {'kbstyle': {'editor': 'enum', 'options': ['3d', '2d'], 'default': '3d'}, 'kbview': {'editor': 'enum', 'options': ['seat', 'above'], 'default': 'seat'}, 'kbhands': {'editor': 'enum', 'options': ['on', 'off'], 'default': 'on'}, '$preview': props['$preview']}
    t = t[:m.start(1)] + json.dumps(props, ensure_ascii=False, separators=(',', ':')) + t[m.end(1):]
    open(pth, 'w').write(t)
    print(f, 'ok')
