import sys
proj = sys.argv[1]
SUP = '<sup style="font-size: 0.6em; vertical-align: 0.7em; margin-left: 1px">'
def name(o):
    return f'{{{{{o}.root}}}}{SUP}{{{{{o}.ext}}}}</sup>'
def keyboard(K):
    return f'''<div aria-hidden="true" style="position: relative; flex: none; width: {{{{{K}.width}}}}px; height: {{{{{K}.height}}}}px; box-sizing: border-box; border: {{{{{K}.frame}}}}px solid #1A1612; border-radius: {{{{{K}.r}}}}px; overflow: hidden; background: #FFFFFF">
<sc-for list="{{{{{K}.whites}}}}" as="k" hint-placeholder-count="10">
<div style="position: absolute; left: {{{{k.x}}}}px; top: 0; bottom: 0; width: {{{{k.w}}}}px; box-sizing: border-box; border-right: 1px solid #1A1612; display: flex; align-items: flex-end; justify-content: center; padding-bottom: {{{{k.pad}}}}px">
<span style="display: {{{{k.dot}}}}; width: {{{{k.d}}}}px; height: {{{{k.d}}}}px; border-radius: 50%; background: #1A1612"></span>
</div>
</sc-for>
<sc-for list="{{{{{K}.blacks}}}}" as="k" hint-placeholder-count="7">
<div style="position: absolute; left: {{{{k.x}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; background: #1A1612; display: flex; align-items: flex-end; justify-content: center; padding-bottom: {{{{k.pad}}}}px">
<span style="display: {{{{k.dot}}}}; width: {{{{k.d}}}}px; height: {{{{k.d}}}}px; border-radius: 50%; background: #FFFFFF"></span>
</div>
</sc-for>
</div>'''
STRIP = f'''<div ref="{{{{stripRef}}}}" role="group" aria-label="Beats" style="flex: none; margin: 0 -{{{{padX}}}}px; height: {{{{stripH}}}}px; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; overscroll-behavior-x: contain">
<div style="display: flex; gap: 3px; width: max-content; height: 100%; padding: 0 {{{{padX}}}}px">
<sc-for list="{{{{strip}}}}" as="b" hint-placeholder-count="49">
<button type="button" aria-label="{{{{b.aria}}}}" aria-current="{{{{b.current}}}}" onClick="{{{{b.pick}}}}" style="position: relative; flex: none; width: {{{{cellW}}}}px; height: 100%; box-sizing: border-box; border: 0; border-left: {{{{b.line}}}}; border-radius: 3px; padding: 0; background: {{{{b.bg}}}}; color: {{{{b.fg}}}}; overflow: visible">
<span style="position: absolute; left: {{{{stripPad}}}}px; top: 50%; transform: translateY(-50%); z-index: 1; font-size: {{{{stripFs}}}}px; font-weight: 500; line-height: 1; white-space: nowrap">{name('b')}</span>
</button>
</sc-for>
</div>
</div>'''
VIEWS = f'''<sc-if value="{{{{isDiagrams}}}}" hint-placeholder-val="{{{{false}}}}">
<section aria-label="Chord diagrams" style="position: absolute; left: {{{{padX}}}}px; right: {{{{padX}}}}px; top: {{{{viewTop}}}}px; bottom: {{{{viewBottom}}}}px; display: flex; flex-direction: column; justify-content: center; gap: {{{{diagGap}}}}px">
<div ref="{{{{diagRef}}}}" onScroll="{{{{diagScroll}}}}" role="group" aria-label="Chords, one at a time" style="flex: none; margin: 0 -{{{{padX}}}}px; padding-left: {{{{padX}}}}px; scroll-padding-left: {{{{padX}}}}px; display: flex; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; scroll-snap-type: x mandatory; overscroll-behavior-x: contain">
<sc-for list="{{{{chordRow}}}}" as="c" hint-placeholder-count="14">
<button type="button" aria-label="{{{{c.aria}}}}" aria-current="{{{{c.current}}}}" onClick="{{{{c.pick}}}}" style="flex: none; width: {{{{slotW}}}}px; margin: 0; padding: 0; border: 0; background: transparent; color: #1A1612; scroll-snap-align: start; scroll-snap-stop: always; display: flex; flex-direction: column; align-items: center; gap: {{{{capGap}}}}px; opacity: {{{{c.opacity}}}}">
{keyboard('c.kb')}
<span style="font-size: {{{{nameSize}}}}px; font-weight: 500; line-height: 1">{name('c')}</span>
</button>
</sc-for>
<div aria-hidden="true" style="flex: none; width: {{{{tailW}}}}px"></div>
</div>
{STRIP}
<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">
<p style="margin: 0; font-size: {{{{lineFs}}}}px; font-weight: 700; line-height: 1.2; color: #1A1612">{{{{lineNow}}}}</p>
<div aria-hidden="true" style="width: {{{{progW}}}}px; height: 3px; border-radius: 2px; background: #E4DDD3; overflow: hidden"><div style="width: {{{{progFill}}}}%; height: 3px; background: #1A1612"></div></div>
<p style="margin: 0; font-size: {{{{lineFs}}}}px; font-weight: 500; line-height: 1.2; color: #A39A90">{{{{lineNext}}}}</p>
</div>
</section>
</sc-if>

<sc-if value="{{{{isGrid}}}}" hint-placeholder-val="{{{{false}}}}">
<section aria-label="Chord grid" style="position: absolute; left: {{{{padX}}}}px; right: {{{{padX}}}}px; top: {{{{viewTop}}}}px; bottom: {{{{viewBottom}}}}px; overflow: hidden; display: flex; flex-direction: column; gap: 3px">
<sc-for list="{{{{gridSections}}}}" as="g" hint-placeholder-count="2">
<h3 style="margin: {{{{g.mt}}}}px 0 6px {{{{gridIndent}}}}px; font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #6B6259">{{{{g.label}}}}</h3>
<sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="4">
<div style="display: flex; gap: 6px">
<span aria-hidden="true" style="flex: none; width: {{{{gutter}}}}px; padding-top: 5px; font-size: 10px; font-variant-numeric: tabular-nums; text-align: right; color: #A39A90">{{{{r.n}}}}</span>
<div style="flex: 1; min-width: 0; display: grid; grid-template-columns: repeat({{{{cols}}}}, minmax(0, 1fr)); gap: 3px">
<sc-for list="{{{{r.cells}}}}" as="c" hint-placeholder-count="12">
<button type="button" aria-label="{{{{c.aria}}}}" aria-current="{{{{c.current}}}}" onClick="{{{{c.pick}}}}" style="visibility: {{{{c.vis}}}}; height: {{{{cellH}}}}px; box-sizing: border-box; border: 0; border-left: {{{{c.line}}}}; border-radius: 3px; padding: 0 0 0 {{{{cellPad}}}}px; background: {{{{c.bg}}}}; box-shadow: {{{{c.mark}}}}; color: {{{{c.fg}}}}; display: flex; align-items: center; text-align: left; overflow: hidden">
<span style="font-size: {{{{gridFs}}}}px; font-weight: 500; line-height: 1; white-space: nowrap">{name('c')}</span>
</button>
</sc-for>
</div>
</div>
</sc-for>
</sc-for>
</section>
</sc-if>

<sc-if value="{{{{isLyrics}}}}" hint-placeholder-val="{{{{false}}}}">
<section aria-label="Lyrics and chords" style="position: absolute; left: 0; right: 0; padding: 0 {{{{padX}}}}px; box-sizing: border-box; top: {{{{viewTop}}}}px; bottom: {{{{viewBottom}}}}px; overflow: hidden; display: flex; flex-direction: column; gap: {{{{lyrTopGap}}}}px">
{STRIP}
<div role="group" aria-label="Chords in this song" style="flex: none; margin: 0 -{{{{padX}}}}px; overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: none; touch-action: pan-x"><div style="display: flex; gap: {{{{sumGap}}}}px; width: max-content; padding: 0 {{{{padX}}}}px">
<sc-for list="{{{{summary}}}}" as="c" hint-placeholder-count="6">
<button type="button" aria-label="{{{{c.aria}}}}" onClick="{{{{c.open}}}}" style="flex: none; border: 0; padding: 0; background: transparent; display: flex; flex-direction: column; align-items: center; gap: 6px; color: #1A1612">
{keyboard('c.kb')}
<span style="font-size: 14px; font-weight: {{{{c.weight}}}}">{name('c')}</span>
</button>
</sc-for>
</div></div>
<div role="group" aria-label="Lyrics" style="flex: 1; min-height: 0; width: 100%; max-width: {{{{lyricMax}}}}px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; padding-bottom: 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: {{{{lineGap}}}}px">
<sc-for list="{{{{lyricSections}}}}" as="g" hint-placeholder-count="2">
<h3 style="margin: {{{{g.mt}}}}px 0 0; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #6B6259">{{{{g.label}}}}</h3>
<sc-for list="{{{{g.lines}}}}" as="l" hint-placeholder-count="4">
<p style="margin: 0; display: flex; flex-wrap: wrap; align-items: flex-end; opacity: {{{{l.opacity}}}}">
<sc-for list="{{{{l.segs}}}}" as="sg" hint-placeholder-count="5">
<span style="display: inline-flex; flex-direction: column; align-items: flex-start; gap: 4px">
<sc-if value="{{{{sg.hasChord}}}}" hint-placeholder-val="{{{{true}}}}">
<button type="button" aria-label="{{{{sg.aria}}}}" aria-current="{{{{sg.current}}}}" onClick="{{{{sg.open}}}}" style="height: {{{{chipH}}}}px; box-sizing: border-box; border: 0; border-radius: 5px; padding: 0 7px; margin-right: 6px; background: {{{{sg.bg}}}}; color: {{{{sg.fg}}}}; font-size: {{{{chipFs}}}}px; font-weight: 700; line-height: 1">{name('sg')}</button>
</sc-if>
<sc-if value="{{{{sg.noChord}}}}" hint-placeholder-val="{{{{false}}}}">
<span aria-hidden="true" style="height: {{{{chipH}}}}px"></span>
</sc-if>
<span style="font-size: {{{{lyricFs}}}}px; font-weight: {{{{l.weight}}}}; line-height: 1.15; white-space: pre; min-width: {{{{sg.minW}}}}px">{{{{sg.text}}}}</span>
</span>
</sc-for>
</p>
</sc-for>
</sc-for>
</div>
</section>
</sc-if>
'''
SHEET = f'''
<sc-if value="{{{{isChord}}}}" hint-placeholder-val="{{{{false}}}}">
<section role="dialog" aria-label="{{{{sheet.name}}}} chord" style="position: absolute; left: {{{{sheetLeft}}}}; right: {{{{sheetRight}}}}; bottom: {{{{sheetBottom}}}}; width: {{{{sheetWidth}}}}; transform: {{{{sheetShift}}}}; box-sizing: border-box; padding: {{{{sheetPad}}}}; display: flex; flex-direction: column; align-items: center; gap: 20px; background: #FFFFFF; border-radius: {{{{sheetRadius}}}}; box-shadow: 0 2px 4px rgba(26,22,18,0.10), 0 18px 40px -12px rgba(26,22,18,0.30)">
<div aria-hidden="true" style="display: {{{{grabber}}}}; width: 36px; height: 5px; border-radius: 9999px; background: #D9D1C6"></div>
{keyboard('sheet.kb')}
<h2 style="margin: 0; font-size: 22px; font-weight: 700; line-height: 1">{name('sheet')} chord</h2>
<div style="width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
<button type="button" onClick="{{{{close}}}}" style="height: 52px; border: 0; border-radius: 14px; background: #F2EDE6; color: #1A1612; font-size: 16px; font-weight: 600">Close</button>
<button type="button" onClick="{{{{playChord}}}}" style="height: 52px; border: 0; border-radius: 14px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>Play</button>
</div>
</section>
</sc-if>
'''
JS_CONST = r'''const atStart = s.start ?? s.bar === undefined;
const beat = s.beat ?? 1;
const TONE = { G: [7, 11, 14], G7: [5, 7, 11, 14], C: [0, 4, 7], D: [2, 6, 9], D7: [2, 6, 9, 12], Em: [4, 7, 11] };
const chordAt = (n) => CHORDS[(n - 1) % 16];
const split = (c) => { const m = c.match(/^([A-G][♯♭]?m?)(.*)$/); return { root: m[1], ext: m[2] }; };
const none = { root: '', ext: '' };
const piano = (c, w, h) => {
const tones = c ? TONE[c] : [];
const whites = [];
const blacks = [];
const d = Math.max(3, Math.round(w * 0.5 * 10) / 10);
let wi = 0;
for (let n = 0; n < 17; n++) {
const dot = tones.includes(n) ? 'block' : 'none';
if ([1, 3, 6, 8, 10].includes(n % 12)) blacks.push({ x: wi * w - w * 0.3 - 1, w: w * 0.6, h: h * 0.6, dot, d: Math.max(3, w * 0.42), pad: h * 0.07 });
else { whites.push({ x: wi * w - 1, w, dot, d, pad: h * 0.09 }); wi++; }
}
return { whites, blacks, width: wi * w + 4, height: h, frame: w > 12 ? 2 : 1.5, r: w > 12 ? 6 : 4 };
};
const LYRICS = [
['Verse 1', [[['', 'A-'], [1, 'mazing '], [2, 'grace! How '], [3, 'sweet the '], [4, 'sound']], [['', 'That '], [5, 'saved a '], [6, 'wretch like '], [7, 'me! '], [8, '']], [['', 'I '], [9, 'once was '], [10, 'lost, but '], [11, 'now am '], [12, 'found']], [['', 'Was '], [13, 'blind, but '], [14, 'now I '], [15, 'see. '], [16, '']]]],
['Verse 2', [[['', '’Twas '], [1, 'grace that '], [2, 'taught my '], [3, 'heart to '], [4, 'fear']], [['', 'And '], [5, 'grace my '], [6, 'fears re-'], [7, 'lieved; '], [8, '']], [['', 'How '], [9, 'precious '], [10, 'did that '], [11, 'grace ap-'], [12, 'pear']], [['', 'The '], [13, 'hour I '], [14, 'first be-'], [15, 'lieved. '], [16, '']]]],
];
const lineOf = Math.floor((bar - 1) / 4);
const lineText = (segs) => segs.map(([, t]) => t).join('').trim();
const nowChord = atStart ? '' : now;
const nextChord = atStart ? CHORDS[0] : next;
const seek = (n, b) => pick({ start: false, bar: n > 16 ? n - 16 : n, beat: b });
const beatCell = (n, b, i) => {
const c = chordAt(n);
const here = !atStart && n === bar && b === beat;
const show = b === 1 && (n === 1 || chordAt(n - 1) !== c);
return { ...(show ? split(c) : none), line: b === 1 ? '3px solid #1A1612' : '0', bg: here ? '#1A1612' : '#FFFFFF', fg: here ? '#FFFFFF' : '#1A1612', current: here ? 'true' : 'false', aria: 'Bar ' + n + ', beat ' + b + ', ' + c, pick: seek(n, b) };
};
const pickupCell = { ...none, line: '0', bg: atStart ? '#1A1612' : '#FFFFFF', fg: '#1A1612', current: atStart ? 'true' : 'false', aria: 'Pickup, no chord', pick: pick({ start: true, bar: 1, beat: 1 }) };
const EVENTS = [{ c: '', bar: 0, at: 0, seek: { start: true, bar: 1, beat: 1 } }].concat(CHORDS.map((c, i) => ({ c, bar: i + 1, at: 1 + i * 3, seek: { start: false, bar: i + 1, beat: 1 } })).filter((ev, i) => i === 0 || CHORDS[i - 1] !== ev.c));
const posIndex = atStart ? 0 : 1 + (bar - 1) * 3 + (beat - 1);
const chordIndex = EVENTS.reduce((k, ev, i) => (ev.at <= posIndex ? i : k), 0);
this._vals = { key: view + '|' + keys + '|' + posIndex, posIndex, chordIndex, cellW: keys ? DEV.cellWKeys : DEV.cellW, slotW: DEV.slotW, padX: DEV.padX };
const VIEW_VALS = {
padX: DEV.padX, viewTop: keys ? DEV.topKeys : DEV.top, viewBottom: DEV.bottom,
diagGap: keys ? DEV.gapKeys : DEV.gap, capGap: keys ? 8 : 12, nameSize: keys ? DEV.nameKeys : DEV.name,
stripH: keys ? DEV.stripHKeys : DEV.stripH, stripFs: keys ? DEV.stripFsKeys : DEV.stripFs, stripPad: DEV.stripPad,
lineFs: keys ? DEV.lineFsKeys : DEV.lineFs, progW: DEV.progW,
progFill: atStart ? 0 : Math.round((((bar - 1) % 4) * 3 + beat - 1) / 12 * 100),
lineNow: lineText(LYRICS[0][1][lineOf]), lineNext: lineText(LYRICS[lineOf === 3 ? 1 : 0][1][(lineOf + 1) % 4]),
chordRow: EVENTS.map((ev, i) => ({ ...(ev.c ? split(ev.c) : { root: 'N.C.', ext: '' }), aria: ev.c ? 'Chord ' + ev.c + ', bar ' + ev.bar : 'No chord', current: i === chordIndex ? 'true' : 'false', opacity: i === chordIndex ? 1 : 0.38, kb: piano(ev.c, keys ? DEV.kbWKeys : DEV.kbW, keys ? DEV.kbHKeys : DEV.kbH), pick: pick(ev.seek) })),
slotW: DEV.slotW, cellW: keys ? DEV.cellWKeys : DEV.cellW, tailW: DEV.slotW + DEV.padX,
strip: [pickupCell].concat(Array.from({ length: 48 }, (_, i) => beatCell(1 + Math.floor(i / 3), (i % 3) + 1, i))),
stripRef: (el) => { this._strip = el; }, diagRef: (el) => { this._diag = el; },
diagScroll: (e) => {
if (this._auto) return;
const el = e.currentTarget;
clearTimeout(this._settle);
this._settle = setTimeout(() => { const i = Math.round(el.scrollLeft / DEV.slotW); const ev = EVENTS[i]; if (ev && i !== chordIndex) this.setState(ev.seek); }, 140);
},
gridIndent: DEV.gutter + 6, gutter: DEV.gutter, cols: DEV.perRow * 3, cellH: keys ? DEV.cellHKeys : DEV.cellH, cellPad: DEV.cellPad, gridFs: keys ? DEV.gridFsKeys : DEV.gridFs,
gridSections: [1, 2].map((v) => ({
label: 'Verse ' + v, mt: v === 1 ? 0 : 18,
rows: Array.from({ length: 16 / DEV.perRow }, (_, r) => {
const first = r * DEV.perRow + 1;
return {
n: first + (v - 1) * 16,
cells: Array.from({ length: DEV.perRow * 3 }, (_, i) => {
const n = first + Math.floor(i / 3);
const b = (i % 3) + 1;
const c = CHORDS[n - 1];
const live = !atStart && v === 1 && n === bar;
const here = live && b === beat;
const looped = live && loop;
const show = b === 1 && (i === 0 || CHORDS[n - 2] !== c);
return { ...(show ? split(c) : none), vis: 'visible', line: b === 1 ? '3px solid #1A1612' : '0', bg: here ? '#1A1612' : looped ? '#FBE4D4' : live ? '#EFE9E1' : '#FFFFFF', fg: here ? '#FFFFFF' : '#1A1612', mark: looped ? 'inset 0 3px 0 #E8762F, inset 0 -3px 0 #E8762F' : 'none', current: here ? 'true' : 'false', aria: 'Bar ' + (n + (v - 1) * 16) + ', beat ' + b + ', ' + c, pick: seek(n, b) };
}),
};
}),
})),
lyrTopGap: keys ? DEV.lyrGapKeys : DEV.lyrGap, sumGap: DEV.sumGap,
summary: ['G', 'G7', 'C', 'D', 'D7', 'Em'].map((c) => ({ ...split(c), aria: c + ' chord', weight: c === nowChord ? 700 : 500, kb: piano(c, DEV.sumW, keys ? DEV.sumHKeys : DEV.sumH), open: pick({ open: 'chord', chord: c }) })),
lyricMax: DEV.lyricMax, lineGap: keys ? DEV.lineGapKeys : DEV.lineGap, chipH: DEV.chipH, chipFs: DEV.chipFs, lyricFs: keys ? DEV.lyricFsKeys : DEV.lyricFs,
lyricSections: LYRICS.map(([label, lines], v) => ({
label, mt: v === 0 ? 0 : 10,
lines: lines.map((segs, li) => ({
opacity: v === 0 && li < lineOf ? 0.45 : 1,
weight: v === 0 && li === lineOf ? 700 : 400,
segs: segs.map(([n, text]) => {
const has = n !== '';
const here = has && !atStart && v === 0 && n === bar;
const c = has ? CHORDS[n - 1] : '';
return { text, hasChord: has, noChord: !has, ...(has ? split(c) : none), bg: here ? '#1A1612' : '#EFE9E1', fg: here ? '#FFFFFF' : '#1A1612', current: here ? 'true' : 'false', aria: has ? c + ', bar ' + (n + v * 16) : '', open: has ? seek(n, 1) : null, minW: text === '' ? 44 : 0 };
}),
})),
})),
isChord: open === 'chord',
sheet: (() => { const c = s.chord ?? (nowChord || nextChord); return { name: c, ...split(c), kb: piano(c, DEV.sheetW, DEV.sheetH) }; })(),
playChord: () => {},
sheetLeft: DEV.sheetLeft, sheetRight: DEV.sheetRight, sheetBottom: DEV.sheetBottom, sheetWidth: DEV.sheetWidth, sheetShift: DEV.sheetShift, sheetPad: DEV.sheetPad, sheetRadius: DEV.sheetRadius, grabber: DEV.grabber,
};
'''
LIFE = """componentDidMount() { this.follow(false); }
componentDidUpdate() { this.follow(true); }
follow(smooth) {
const v = this._vals;
if (!v || v.key === this._key) return;
this._key = v.key;
const behavior = smooth ? 'smooth' : 'auto';
if (this._strip) this._strip.scrollTo({ left: Math.max(0, v.padX + v.posIndex * (v.cellW + 3) - this._strip.clientWidth / 3), behavior });
if (this._diag) { this._auto = true; clearTimeout(this._autoT); this._diag.scrollTo({ left: v.chordIndex * v.slotW, behavior }); this._autoT = setTimeout(() => { this._auto = false; }, 700); }
}"""
DEVS = {
'R3Laptop': "const DEV = { padX: 120, top: 92, topKeys: 36, bottom: 108, gap: 44, gapKeys: 20, slotW: 735, cellW: 64, cellWKeys: 52, kbW: 42, kbH: 190, kbWKeys: 30, kbHKeys: 118, name: 30, nameKeys: 24, stripH: 64, stripHKeys: 52, stripFs: 26, stripFsKeys: 22, stripPad: 10, lineFs: 28, lineFsKeys: 22, progW: 72, gutter: 26, perRow: 4, cellH: 96, cellHKeys: 66, cellPad: 14, gridFs: 34, gridFsKeys: 28, lyrGap: 22, lyrGapKeys: 12, sumGap: 28, sumW: 14, sumH: 62, sumHKeys: 52, lyricMax: 1040, lineGap: 16, lineGapKeys: 8, chipH: 24, chipFs: 15, lyricFs: 26, lyricFsKeys: 22, sheetW: 40, sheetH: 170, sheetLeft: '50%', sheetRight: 'auto', sheetBottom: '100px', sheetWidth: '480px', sheetShift: 'translateX(-50%)', sheetPad: '28px 24px 24px', sheetRadius: '20px', grabber: 'none' };",
'R3Phone': "const DEV = { padX: 16, top: 136, topKeys: 16, bottom: 116, gap: 30, gapKeys: 16, slotW: 185, cellW: 40, cellWKeys: 36, kbW: 17, kbH: 96, kbWKeys: 15, kbHKeys: 72, name: 20, nameKeys: 17, stripH: 40, stripHKeys: 36, stripFs: 19, stripFsKeys: 17, stripPad: 6, lineFs: 18, lineFsKeys: 16, progW: 56, gutter: 16, perRow: 2, cellH: 52, cellHKeys: 42, cellPad: 8, gridFs: 21, gridFsKeys: 19, lyrGap: 16, lyrGapKeys: 10, sumGap: 16, sumW: 10, sumH: 48, sumHKeys: 42, lyricMax: 402, lineGap: 10, lineGapKeys: 6, chipH: 21, chipFs: 13, lyricFs: 18, lyricFsKeys: 16, sheetW: 33, sheetH: 150, sheetLeft: '0', sheetRight: '0', sheetBottom: '0', sheetWidth: 'auto', sheetShift: 'none', sheetPad: '8px 20px 34px', sheetRadius: '20px 20px 0 0', grabber: 'block' };",
}
for f, dev in DEVS.items():
    p = f'{proj}/{f}.dc.html'
    t = open(p).read()
    a = t.index('<sc-if value="{{isDiagrams}}"'); b = t.index('</main>')
    t = t[:a] + VIEWS + t[b:]
    m = t.index('<sc-if value="{{isMore}}"'); e = t.index('</sc-if>', m) + len('</sc-if>')
    t = t[:e] + '\n' + SHEET + t[e:]
    lines = t.split('\n')
    i = next(k for k, l in enumerate(lines) if l.startswith('viewTop: keys'))
    lines[i] = '...VIEW_VALS,'
    s0 = next(k for k, l in enumerate(lines) if l.startswith('nowNext: ['))
    s1 = next(k for k, l in enumerate(lines) if l.startswith('bar, loop, toggleLoop'))
    del lines[s0:s1]
    r = next(k for k, l in enumerate(lines) if l.startswith('const VIEWS = ['))
    lines[r:r] = (dev + '\n' + JS_CONST).rstrip('\n').split('\n')
    rv = next(k for k, l in enumerate(lines) if l.startswith('renderVals() {'))
    lines[rv:rv] = LIFE.split('\n')
    open(p, 'w').write('\n'.join(lines))
    print(f, 'ok')
