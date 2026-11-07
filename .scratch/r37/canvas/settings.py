import sys
proj = sys.argv[1]

def once(t, a, b, f):
    assert t.count(a) == 1, (f, a[:80], t.count(a))
    return t.replace(a, b)

def cut_sc_if(t, cond):
    a = t.index('<sc-if value="{{%s}}"' % cond)
    i = a; depth = 0
    while True:
        o = t.find('<sc-if', i); c = t.find('</sc-if>', i)
        if o != -1 and o < c: depth += 1; i = o + 6
        else:
            depth -= 1; i = c + 8
            if depth == 0: break
    return t[:a] + t[i:].lstrip('\n')

GEAR = ('M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'
        'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z')

JS = r'''const EYE = 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
const EYE_OFF = 'M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 0 1-4.2-4.2';
const SHOW_NEXT = { show: 'dim', dim: 'hide', hide: 'show' };
const showTurn = (key, cur) => ({ sub: { show: 'On the score and keys', dim: 'Faint on the score and keys', hide: 'Off the score and keys' }[cur], word: { show: 'Enabled', dim: 'Dimmed', hide: 'Disabled' }[cur], hint: { show: 'Tap to dim', dim: 'Tap to disable', hide: 'Tap to enable' }[cur],
d: cur === 'hide' ? EYE_OFF : EYE, op: cur === 'dim' ? 0.45 : 1, turn: () => this.setState({ [key]: SHOW_NEXT[cur] }),
// the switch: the hand on or off (off is silent, and turning it on brings back its dimming and volume);
// the Dim button: an on hand shown faint
on: cur !== 'hide' ? 'true' : 'false', track: cur !== 'hide' ? '#E8762F' : '#D9D1C6', knob: cur !== 'hide' ? 21 : 3,
flip: () => this.setState(cur === 'hide' ? { [key]: s[key + 'Dim'] ? 'dim' : 'show', ['mute' + key.slice(4)]: false } : { [key]: 'hide', [key + 'Dim']: cur === 'dim', ['mute' + key.slice(4)]: true }),
dimOn: cur === 'dim' ? 'true' : 'false', dimIconOp: cur === 'dim' ? 0.3 : 1, dimOff: cur === 'hide' ? 'true' : 'false', dimBg: cur === 'dim' ? '#FBE1CF' : 'transparent', dimFg: cur === 'dim' ? '#B4501A' : '#6B6259', dimLine: cur === 'dim' ? '#F0B58F' : '#D9D1C6', dimOp: cur === 'hide' ? 0.4 : 1,
dim: () => { if (cur !== 'hide') this.setState({ [key]: cur === 'dim' ? 'show' : 'dim' }); } });
// a hand's volume: Hidden reads 0 and keeps the one it had, which comes back when it shows again;
// moving the slider or a speaker of a Hidden hand shows it
// a hand's volume, as every player's: the left speaker mutes and unmutes, bringing back the level it had;
// the slider sets the level and unmutes, and at 0 it mutes, keeping the level; the right speaker steps it up.
// Switching a hand off mutes it and on unmutes it; while off its volume can still be set and heard.
const SPK_MUTED = 'M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6', SPK_1 = 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7', SPK_2 = 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14';
const volOf = (H, dflt) => { const key = 'vol' + H, mk = 'mute' + H, hand = H === 'R' ? 'right hand' : 'left hand', v = s[key] ?? dflt, muted = s[mk] ?? (s['show' + H] ?? 'show') === 'hide';
return { [key]: muted ? 0 : v, [key + 'Icon']: muted ? SPK_MUTED : v < 50 ? SPK_1 : SPK_2, [key + 'Muted']: muted ? 'true' : 'false', [key + 'MuteLabel']: (muted ? 'Unmute the ' : 'Mute the ') + hand,
['setVol' + H]: (e) => { const n = Number(e.target.value); this.setState(n > 0 ? { [key]: n, [mk]: false } : { [mk]: true }); },
[key + 'Down']: () => this.setState({ [mk]: !muted }), [key + 'Up']: () => this.setState({ [key]: muted ? v : Math.min(100, v + 10), [mk]: false }) }; };
const handsSeen = (ghost) => { const r = ghost ? showOf.rh !== 'hide' : showOf.rh === 'show', l = ghost ? showOf.lh !== 'hide' : showOf.lh === 'show'; return r && l ? 'both' : r ? 'rh' : l ? 'lh' : 'none'; };
const SET_VALS = {
kbImg: KB_IMG[kbView][kbHands ? handsSeen(false) : 'none'], kbGhost: KB_IMG[kbView][handsSeen(true)], kbGhostOn: kbHands && (showOf.rh === 'dim' || showOf.lh === 'dim'),
showR: showTurn('showR', s.showR ?? 'show'), showL: showTurn('showL', s.showL ?? 'show'),
...volOf('R', 80), ...volOf('L', 60),
isView: open === 'view',
viewPopX: { sheet: -168, diagrams: -56, grid: 56, lyrics: 168 }[view],
setBg: open === 'settings' ? (DARK ? 'rgba(255, 255, 255, 0.26)' : '#E7E0D6') : (DARK ? 'rgba(26, 22, 18, 0.55)' : 'rgba(255, 255, 255, 0.9)'),
};
// a view's button: a tap shows its view; a tap on the view showing opens its settings
const viewPress = (id) => ({
pick: () => (id !== view ? this.setState({ view: id, open: 'none' }) : this.setState({ open: open === 'view' ? 'none' : 'view' })),
});
'''

for f, dark in (('R3Laptop', 'glassDark'), ('R3Phone', 'dark')):
    p = f'{proj}/{f}.dc.html'
    t = open(p).read()
    # the toolbar: Close · the four views · Settings. One gear holds every setting of the Player's
    # screen, in three tabs: the view's own, the keyboard's, the song's
    g0 = t.index('<button type="button" aria-label="View options"')
    g1 = t.index('</button>', g0) + len('</button>\n')
    t = t[:g0] + t[g1:]
    m0 = t.index('<button type="button" aria-label="More"')
    m1 = t.index('</button>', m0)
    btn = t[m0:m1]
    btn = btn.replace('aria-label="More" aria-expanded="{{isMore}}"', 'aria-label="Settings" title="Settings" aria-expanded="{{isMore}}"')
    btn = btn.replace('background: {{glass}};', 'background: {{setBg}};')
    b0 = btn.index('<svg'); b1 = btn.index('</svg>') + len('</svg>')
    btn = btn[:b0] + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg>' % GEAR + btn[b1:]
    t = t[:m0] + btn + t[m1:]
    t = cut_sc_if(t, 'isKeyboard')
    # the views stay above a sheet's backdrop: a tap on one still switches, or closes its settings
    # the hands you play are the hands that show: no switch of its own
    t = once(t, "const hands = s.hands ?? 'both';", "const hands = (s.showR ?? 'show') === 'hide' ? ((s.showL ?? 'show') === 'hide' ? 'both' : 'lh') : (s.showL ?? 'show') === 'hide' ? 'rh' : 'both';", f)
    t = once(t, '<nav aria-label="View" style="position: absolute;', '<nav aria-label="View" style="z-index: 48; position: absolute;', f)
    t = once(t, "const hint = 'Show ' + name;", "const hint = !on ? 'Show ' + name : sheet ? (pano ? 'Show as pages' : 'Show as one line') : name + ' settings';", f)
    t = once(t, "const label = name;", "const label = sheet && on ? (pano ? 'Sheet, one line' : 'Sheet, pages') : name;", f)
    t = once(t, "pick: pick({ view: id, open: open === 'view' ? 'none' : open }) }; }),", "...viewPress(id) }; }),", f)
    t = once(t, "isKeyboard: open === 'keyboard', openKeyboard: toggleOpen('keyboard'), ", '', f)
    t = once(t, "dispBg: open === 'keyboard' ? (%s ? 'rgba(255, 255, 255, 0.26)' : '#E7E0D6') : (%s ? 'rgba(26, 22, 18, 0.55)' : 'rgba(255, 255, 255, 0.9)'), dispFg: %s ? '#FFFFFF' : '#1A1612', " % (dark, dark, dark), '', f)
    # each hand shown, dimmed or hidden on the keys, its own choice
    t = once(t, "const otherOn = otherShow !== 'hide';", "const showOf = { rh: s.showR ?? 'show', lh: s.showL ?? 'show' };", f)
    t = once(t, "const otherShow = s.otherShow ?? 'dim';\n", '', f)
    t = once(t, "const hand = played && (mine || otherOn) ? played : null;", "const hand = played && showOf[played[0]] !== 'hide' ? played : null;", f)
    t = once(t, "const faint = hand && !mine && otherShow === 'dim';", "const faint = hand && showOf[played[0]] === 'dim';", f)
    t = once(t, "otherShowOpts: lopt('otherShow', s.otherShow ?? 'dim', [['show', 'Show'], ['dim', 'Dim'], ['hide', 'Hide']]),", '', f)
    # a hand dimmed or hidden: its staff on the sheet, its 3D hand and its keys alike
    im = t.index('<img src="{{kbImg}}"'); ie = t.index('>', im) + 1
    t = t[:ie] + '\n<sc-if value="{{kbGhostOn}}" hint-placeholder-val="{{false}}">\n<img src="{{kbGhost}}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: {{kbTop}}px; display: block; width: {{kbW}}px; height: {{kbH}}px; object-fit: cover; opacity: 0.4">\n</sc-if>' + t[ie:]
    t = once(t, "isMore: open === 'more',", "isMore: open === 'settings',", f)
    t = once(t, "openMore: toggleOpen('more'),", "openMore: toggleOpen('settings'),", f)
    r = t.index('const VIEWS = [')
    t = t[:r] + JS.replace('DARK', dark) + t[r:]
    t = once(t, '...LOOP_VALS,', '...LOOP_VALS,\n...SET_VALS,', f)
    open(p, 'w').write(t)
    print(f, 'settings ok')
