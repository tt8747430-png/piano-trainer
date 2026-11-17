# The adaptable laptop window (owner, 2026-11-15: "make the ui very adaptable like the main focus of the page and the
# other things can be easily hide or show … for every screen"). Every laptop board with the app's sidebar gets:
# the sidebar's toggle at its leading top (Apple HIG, Sidebars: "let people hide the sidebar"; macOS's toggle sits at
# the window's top leading edge), folding it to a 76px rail of the same places (Material 3, Navigation rail);
# and Focus, which hides the sidebar and every side panel so the page's one thing fills the window (macOS full-screen
# and Notes' focus, Ulysses' distraction-free mode), left by Esc or by Exit focus, the bar's first button while Focus
# is on, before Back or the title, where the sidebar's own toggle stood (owner, 2026-11-17: "the focus mode … improve
# them"; a capsule at the foot lay over the keys and the floating transports).
# Focus hides the side panels of content (a song list's library pane, the Chord player's chords and styles), never
# a page's own list of sections (Settings', Admin's, Takes'), which carries its Back and title.
# No letter shortcut: a letter alone is the piano's (CLAUDE.md, Keys).
import re

_PANEL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path></svg>'
_FOCUS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>'
_EXIT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"></path></svg>'
_LAPHEAD_OLD = '<div style="height: 44px; display: flex; align-items: center; padding: 0 12px; font-family: \'Instrument Serif\', Georgia, serif; font-size: 27px">Piano Trainer</div>'
_LAPBTN = 'width: 44px; height: 44px; flex: none; border: 0; border-radius: 22px; background: transparent; color: inherit; display: flex; align-items: center; justify-content: center'
_LAPHEAD = ('<div data-sidehead style="height: 44px; display: flex; align-items: center; gap: 2px; padding: 0 0 0 12px">'
         '<span data-sidetext style="flex: 1; min-width: 0; font-family: \'Instrument Serif\', Georgia, serif; font-size: 24px; white-space: nowrap">Piano Trainer</span>'
         '<div data-sidebtns style="flex: none; display: flex; border-radius: 22px; background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)">'
         '<button type="button" data-lapbtn aria-label="{{lapSideL}}" data-tip="{{lapSideL}}" aria-expanded="{{lapSideOn}}" onClick="{{lapSideT}}" style="' + _LAPBTN + '">' + _PANEL + '</button>'
         '<button type="button" data-lapbtn aria-label="Focus" data-tip="Focus: hide the sidebar and panels" onClick="{{lapFocusT}}" style="' + _LAPBTN + '">' + _FOCUS + '</button></div></div>')
# the runtime writes each style back as the browser serialises it (minmax(0px, …))
_LAPCOLS = ['minmax(0px, 1fr) 420px', 'minmax(0px, 1fr) 400px', 'minmax(0px, 1fr) 380px', 'minmax(0px, 1fr) 440px', 'minmax(0px, 3fr) minmax(0px, 2fr)']
_LAPFIRST = ['240px minmax(0px, 1fr)', '280px minmax(0px, 1fr)']
_LAPCSS = ('<style data-lapcss>'
        '[data-lapwin][data-side="off"] { grid-template-columns: 76px minmax(0, 1fr) !important }'
        ' [data-side="off"] > nav { padding-left: 14px !important; padding-right: 14px !important; align-items: center }'
        ' [data-side="off"] [data-sidetext], [data-side="off"] > nav > label > span, [data-side="off"] > nav > label > kbd, [data-side="off"] > nav a > span:not([aria-hidden]) { display: none !important }'
        ' [data-side="off"] [data-sidehead] { flex-direction: column; height: auto !important; padding: 0 !important; gap: 4px !important }'
        ' [data-side="off"] > nav > label { width: 48px; padding: 0 !important; justify-content: center }'
        ' [data-side="off"] > nav a { width: 48px; padding: 0 !important; justify-content: center; font-size: 0 !important; gap: 0 !important }'
        ' [data-side="off"] [data-sidebtns] { flex-direction: column }'
        ' [data-lapbtn]:hover { background: rgba(128, 110, 90, 0.12) !important }'
        ' [data-lapbtn]:focus-visible, [data-focusexit]:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }'
        ' [data-focusexit] { display: none }'
        ' [data-lapwin] > nav { position: relative }'
        ' [data-acct]:hover { background: #EFE8DF !important }'
        ' [data-acctmenu] [role=menuitem]:hover { background: #F2ECE4 }'
        ' [data-side="off"] [data-acctmenu] { right: auto !important; width: 248px }'
        ' [data-side="off"] [data-acct] { width: 48px !important; padding: 0 !important; justify-content: center }'
        ' [data-lapwin][data-focus="on"] { grid-template-columns: minmax(0, 1fr) !important }'
        ' [data-focus="on"] > nav, [data-focus="on"] aside.nos { display: none !important }'
        ' [data-focus="on"] [data-focusexit] { display: flex }'
        + ''.join(' [data-focus="on"] [style*="grid-template-columns: %s"] { grid-template-columns: minmax(0, 1fr) !important }'
                  ' [data-focus="on"] [style*="grid-template-columns: %s"] > :last-child { display: none !important }' % (c, c) for c in _LAPCOLS)
        + ''.join(' [data-focus="on"] [style*="grid-template-columns: %s"] { grid-template-columns: minmax(0, 1fr) !important }'
                  ' [data-focus="on"] [style*="grid-template-columns: %s"] > :first-child { display: none !important }' % (c, c) for c in _LAPFIRST)
        # a reading page's contents column (Legal's On this page, a lesson's In this lesson) folds and leaves its reading column
        + ''.join(' [data-focus="on"] [style*="grid-template-columns: %s %s"] { grid-template-columns: %s !important }'
                  ' [data-focus="on"] [style*="grid-template-columns: %s %s"] > :first-child { display: none !important }' % (a, b, b, a, b) for a, b in (('240px', '680px'), ('260px', '704px')))
        + '</style>')
_LAPJS = ('\n{ const R = Component.prototype.renderVals; Component.prototype.renderVals = function () {\n'
       '  const v = R.call(this), st = this.state || {}, set = (o) => this.setState(o);\n'
       '  const side = st.lapSide || "on", focus = st.lapFocus || "off";\n'
       '  if (!window.__lapEsc) { window.__lapEsc = true; document.addEventListener("keydown", (e) => { if (e.key === "Escape" && window.__lapExit) window.__lapExit(); }); }\n'
       '  window.__lapExit = focus === "on" ? () => set({ lapFocus: "off" }) : null;\n'
       '  return Object.assign({}, v, { lapSide: side, lapFocus: focus, lapSideOn: side === "on" ? "true" : "false",\n'
       '    lapSideL: side === "on" ? "Hide sidebar" : "Show sidebar", lapSideT: () => set({ lapSide: side === "on" ? "off" : "on" }),\n'
       '    lapFocusT: () => set({ lapFocus: focus === "on" ? "off" : "on" }),\n'
       '    lapAcctOn: !!st.lapAcct, lapAcctAria: st.lapAcct ? "true" : "false", lapAcctBg: st.lapAcct ? "#EAE2D7" : "transparent", lapAcctT: () => set({ lapAcct: !st.lapAcct }) });\n'
       '}; }\n')

# The account row as Claude's (owner, 2026-11-05 and 2026-11-17: "the side bar is not done like the for example claude
# sidebar"): the sidebar's foot is one row, the learner's picture, name and ⌃⌄, that opens a menu above it: who is
# signed in, Profile, Settings, Language, Help, then Sign out apart. Nothing else sits at the foot (no gear).
_ACCT_OLD = re.compile(r'<a href="ProfileLaptop\.dc\.html"( aria-current="page")? style="min-height: 52px; border-radius: 10px[^"]*">(<span aria-hidden="true" style="width: 32px[^>]*>[^<]*</span>)<span style="display: flex; flex-direction: column"><span style="font-size: 15px; font-weight: 600">([^<]*)</span><span[^>]*>[^<]*</span></span></a>')
_UPDOWN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>'
_MI = 'min-height: 40px; box-sizing: border-box; padding: 0 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #332921; text-decoration: none; font-size: 15px'
def _acct(m):
    cur, pic, name = m.group(1) or '', m.group(2), m.group(3)
    row = ('<button type="button" data-acct aria-haspopup="menu" aria-expanded="{{lapAcctAria}}" onClick="{{lapAcctT}}" style="width: 100%; min-height: 52px; border: 0; border-radius: 10px; '
           'background: {{lapAcctBg}}; display: flex; align-items: center; gap: 12px; padding: 0 12px; color: #1A1612; font: inherit; text-align: left">'
           + pic + '<span data-sidetext style="flex: 1; min-width: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">' + name + '</span>'
           '<span data-sidetext style="display: flex; color: #6B6259">' + _UPDOWN + '</span></button>')
    menu = ('<sc-if value="{{lapAcctOn}}" hint-placeholder-val="{{false}}"><div onClick="{{lapAcctT}}" style="position: fixed; inset: 0; z-index: 70"></div>'
            '<div role="menu" data-acctmenu aria-label="' + name + '" style="position: absolute; left: 12px; right: 12px; bottom: 76px; z-index: 71; '
            'display: flex; flex-direction: column; gap: 2px; padding: 6px; border-radius: 16px; background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)">'
            '<div style="padding: 8px 12px 10px; font-size: 13px; color: #685E56; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">ana@example.com</div>'
            '<a role="menuitem" href="ProfileLaptop.dc.html" style="' + _MI + '">Profile</a>'
            '<a role="menuitem" href="SettingsLaptop.dc.html" style="' + _MI + '">Settings</a>'
            '<a role="menuitem" href="SettingsLaptop.dc.html" style="' + _MI + '">Language<span style="color: #6B6259">English</span></a>'
            '<div style="height: 1px; margin: 4px 12px; background: #DAD1C8"></div>'
            '<a role="menuitem" href="SignInLaptop.dc.html" style="' + _MI + '">Sign out</a></div></sc-if>')
    return '<div data-acctwrap' + (' data-current' if cur else '') + ' style="position: relative">' + row + '</div>' + menu


def lapwin(h):
    # Help opened Legal (a misleading link); the User guide's home is Settings › Support (one home)
    h = re.sub(r'<a role="menuitem" href="LegalLaptop\.dc\.html" style="[^"]*">Help</a>', '', h).replace('<div style="height: 1px; margin: 4px 12px; background: #E4DCD2"></div><a role="menuitem" href="SignInLaptop', '<div style="height: 1px; margin: 4px 12px; background: #DAD1C8"></div><a role="menuitem" href="SignInLaptop')
    # the account menu wears the kit's one menu shell (MENUSHELL: 6 in, 16 corners, glass), on boards wrapped before it did
    h = h.replace('position: absolute; left: 12px; right: 12px; bottom: 76px; z-index: 71; padding: 6px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 0 0 1px rgba(26,22,18,0.06), 0 2px 4px rgba(26,22,18,0.08), 0 18px 40px -12px rgba(26,22,18,0.28); display: flex; flex-direction: column; gap: 2px', 'position: absolute; left: 12px; right: 12px; bottom: 76px; z-index: 71; display: flex; flex-direction: column; gap: 2px; padding: 6px; border-radius: 16px; background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)').replace('font-size: 13px; color: #6B6259; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">ana@', 'font-size: 13px; color: #685E56; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">ana@')
    if 'data-lapwin' in h or _LAPHEAD_OLD not in h:
        return h
    m = re.search(r'<div (style="[^"]*grid-template-columns: 248px minmax\(0, 1fr\)[^"]*")>', h)
    if not m:
        return h
    glass = ('background: rgba(254,253,251,.86); color: #332921; box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)')
    exitb = ('<button type="button" data-focusexit aria-label="Exit focus" data-tip="Exit focus (Esc)" onClick="{{lapFocusT}}" style="flex: none; width: 44px; height: 44px; '
             'margin-right: 8px; padding: 0; border: 0; border-radius: 22px; %s; backdrop-filter: blur(24px) saturate(1.8); -webkit-backdrop-filter: blur(24px) saturate(1.8); '
             'align-items: center; justify-content: center; font: inherit">%s</button>' % (glass, _EXIT))
    h = h[:m.start()] + '<div ' + m.group(1) + ' data-lapwin data-side="{{lapSide}}" data-focus="{{lapFocus}}">' + h[m.end():]
    # Exit focus stands first in the page's bar: before Back, or before the title on a page with none.
    nav = h.find('</nav>', m.start())
    back, title = h.find('aria-label="Back"', nav), h.find('<h1', nav)
    at = h.rfind('<', nav, back) if back > 0 and (title < 0 or back < title) else title
    if at > 0:
        h = h[:at] + exitb + h[at:]
    h = h.replace(_LAPHEAD_OLD, _LAPHEAD, 1).replace('</head>', _LAPCSS + '</head>', 1)
    h = _ACCT_OLD.sub(_acct, h, count=1)
    k = h.rindex('</script>')
    return h[:k] + _LAPJS + h[k:]
