# Canvas 135: the editor's draft of a built-in song (editors only, ADR 0116): Publishing, Versions, Discard, and its states
DS_JS = TOAST_JS.replace('S(', 'set(') + r'''
    const ds = st.ds ?? 'Editing', chg = st.chg ?? true, live = ['Editing', 'Saving', 'Offline', 'Not saved'].includes(ds);
    const VERS = [['Published 3 Nov 2026, 17:45', true], ['Published 12 Oct 2026, 10:20', false], ['Published 1 Sept 2026, 19:05', false]];'''
DS_KEYS = r'''
      dsDemo: demoOf(['Editing', 'Saving', 'Offline', 'Not saved', 'Opening', 'Opening offline', 'Can’t open', 'Not an editor'], ds, 'ds'),
      isLive: live, isOpening: ds === 'Opening', isOpenOff: ds === 'Opening offline', isFailed: ds === 'Can’t open', isLearner: ds === 'Not an editor',
      saveT: { Editing: chg ? 'Saved · not published' : 'Published · no changes', Saving: 'Saving…', Offline: 'Offline: not saved yet', 'Not saved': 'Not saved. It will retry with your next change.' }[ds] || '',
      saveC: ds === 'Not saved' ? '#B3261E' : '#685E56',
      closeSheet: () => set({ sheet: null }),
      askPub: () => { if (ds === 'Offline') { set({ sheet: null }); toast('You’re offline. Try again when you reconnect.'); } else if (!chg) { set({ sheet: null }); toast('No changes since the last publication'); } else set({ sheet: 'pubAsk' }); },
      pubAskOn: st.sheet === 'pubAsk', doPub: () => { set({ sheet: null, chg: false }); toast('Published. Learners will receive it the next time they open the app.'); },
      versOn: st.sheet === 'vers', openVers: () => set({ sheet: 'vers' }),
      vers: VERS.map(([t, n], i) => ({ t, newest: n, on: (st.rv ?? 0) === i ? 'true' : 'false', bg: (st.rv ?? 0) === i ? '#F6E7C8' : 'transparent', pick: () => set({ rv: i }) })), versOld: (st.rv ?? 0) > 0, restAsk: () => set({ restAsk: true }), restNo: () => set({ restAsk: false }),
      restOn: !!st.restAsk, doRest: () => { set({ restAsk: false, sheet: null, chg: false, rv: 0 }); toast('Restored. Learners will receive it the next time they open the app.'); },
      askDisc: () => { if (!chg) { set({ sheet: null }); toast('No changes since the last publication'); } else set({ sheet: 'disc' }); },
      discOn: st.sheet === 'disc', doDisc: () => { set({ sheet: null, chg: false }); toast('Changes discarded'); },
      retry: () => set({ ds: 'Editing' }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, undo: () => set({ toast: null }),'''
DJS = ED4.replace("    return { ...common(st, set),", DS_JS + "\n    return { ...common(st, set)," + DS_KEYS, 1)
assert DJS != ED4

DSAVED = f'<p role="status" style="margin: -8px 0 0; text-align: center; font-size: 13px; color: {{{{saveC}}}}">{{{{saveT}}}}</p>'
ASKP = lambda c, t, b, ok, go: ASK(c, t, b, ok, go, danger=False)
# the published versions as Version history's saved moments (PHHIST, one model): a row picks a version, the newest
# marked Current, and the one Restore at the foot (owner, 2026-11-26: "i dont like these buttons in these cards")
VROW = (f'<div role="listbox" aria-label="Published versions" style="display: flex; flex-direction: column; overflow: hidden; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}"><div style="display: flex; flex-direction: column; margin-top: -1px"><sc-for list="{{{{vers}}}}" as="v" hint-placeholder-count="3">'
        f'<button type="button" role="option" aria-selected="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="width: 100%; min-height: 48px; box-sizing: border-box; padding: 12px 16px; border: 0; box-shadow: inset 0 1px 0 {LINE}; background: {{{{v.bg}}}}; color: {INK}; font: inherit; text-align: left; display: flex; align-items: baseline; gap: 8px; cursor: pointer">'
        f'<span style="flex: 1; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{v.t}}}}</span>{IF("v.newest", f"<span style=\"font-size: 13px; color: {SOFT}\">Current</span>")}</button></sc-for></div></div>'
        + IF('versOld', f'<button type="button" onClick="{{{{restAsk}}}}" style="height: 48px; border: 0; border-radius: 24px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer">Restore this version</button>'))
VERSBODY = '<div style="display: flex; flex-direction: column; gap: 16px">' + VROW + '</div>'
DASKS = (ASKP('pubAskOn', 'Publish Amazing Grace?', 'All learners will receive this version the next time they open the app. The previous version is kept and can be restored.', 'Publish', 'doPub')
         + ASK('restOn', 'Restore this version?', 'This version will be republished for all learners, replacing the current one.', 'Restore', 'doRest', danger=False, cancel='restNo')
         + ASK('discOn', 'Discard changes?', 'The score will revert to its published version, and your changes will be lost.', 'Discard', 'doDisc'))
def GATES(back):
    return (EMPTY('isOpening', '…', 'Opening…', 'The original is fetched from the server, so this draft is the one other editors see.')
            + EMPTY('isOpenOff', '⌁', 'You’re offline.', 'It will open when you reconnect.', f'{BTN("Back to Songs", "", back, "quiet", 48, False)}')
            + EMPTY('isFailed', '!', 'It couldn’t be opened.', 'Check your connection, then try again.', f'{BTN("Try again", "retry", "", "primary", 48, False)}')
            + EMPTY('isLearner', '✎', 'Only editors can modify this.', 'A built-in song is changed by the app’s editors. Make your own copy from its ··· menu.', f'{BTN("Back to Songs", "", back, "primary", 48, False)}'))
# the gates' Close is the editor bar's own glass Close, so the way out looks the same in every state
GHEAD = lambda back: f'<header style="flex: none; height: 60px; display: flex; align-items: center; padding: 8px 16px"><a href="{back}" aria-label="Close the editor" style="width: 44px; height: 44px; border-radius: 22px; background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, 0 1px 2px rgba(51,41,33,.10), 0 2px 6px -2px rgba(51,41,33,.10); color: {INK}; display: flex; align-items: center; justify-content: center">{XI}</a></header>'

# an editor edits the built-in song's Original (melody, chords and words), so the version says Original and the page
# prints the melody alone, as the Player's Original; its Accompaniment starts at None (a regex: the kit's parts are
# redefined between r44 and here, so the exact string no longer matches)
# the draft's publishing acts join the song menu, editors only, after the song's own (nothing hangs under the bar)
_DUP = '<span style="flex: 1">Print</span></button>'
_pit = lambda lab, act, fg='#332921': f'<button type="button" role="menuitem" onClick="{{{{{act}}}}}" style="{_SMROW}; color: {fg}">{_SMSLOT()}<span style="flex: 1">{lab}</span></button>'
assert elm4.count(_DUP) == 1
elm4 = CREDBTN(elm4).replace(_DUP, _DUP + _SMSEP + _pit('Publish…', 'askPub') + _pit('Publishing history', 'openVers') + _SMSEP + _pit('Discard changes', 'askDisc', RED), 1)
assert elm4.count('href="EditorLaptop.dc.html" role="tab"') == 1
elm4 = elm4.replace('href="EditorLaptop.dc.html" role="tab"', 'href="EditorDraftLaptop.dc.html" role="tab"', 1)
# the draft's save state heads the song's menu, as the phone's menu says it under the song's name (one model)
_SMOPEN = re.compile(r'(<div role="menu" aria-label="Amazing Grace" style="[^"]*">)')
assert len(_SMOPEN.findall(elm4)) == 1
elm4 = _SMOPEN.sub(lambda m: m.group(1) + f'<p role="status" style="margin: 0; padding: 4px 10px 8px 34px; font-size: 13px; line-height: 18px; color: {{{{saveC}}}}">{{{{saveT}}}}</p><div role="separator" style="height: 1px; margin: 0 6px 6px; background: {LINE}"></div>', elm4, count=1)
DJS = DJS.replace("?? 'mine'; const VCID", "?? 'orig'; const VCID", 1)
for k in ('askPub: () => {', 'askDisc: () => {'): DJS = DJS.replace(k, k + " set({ sm: false });", 1)
DJS = DJS.replace("openVers: () => set({ sheet: 'vers' })", "openVers: () => set({ sm: false, sheet: 'vers' })", 1)
edph = (IF('isLive', eph4, 'true')
        + IF('notLive', GHEAD('Songs.dc.html') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("Songs.dc.html")}</main>')
        + STRIP('dsDemo') + STRIP('states') + '<div style="height: 22px; flex: none"></div>' + TOASTS)
DJS = DJS.replace("isLive: live,", "isLive: live, notLive: !live,", 1)
edlm = (IF('isLive', elm4, 'true')
        + IF('notLive', GHEAD('SongsLaptop.dc.html').replace('padding: 8px 16px', 'padding: 12px 24px') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("SongsLaptop.dc.html")}</main>')
        + f'<div style="position: absolute; right: 24px; bottom: 188px; z-index: 40; width: 760px; padding-top: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 4px 14px -6px rgba(51,41,33,.25)">{STRIP("dsDemo")}{STRIP("states")}</div>' + TOASTL)
# the draft's acts in ☰ as Flat's: Publishing history (the Globe, as the app publishes) a row, Discard changes the loss,
# last after its own hairline (ROWMENU's rule), Publish as its card at the foot
# (flat-score-editor 083: "Publish Score" over its Publish button)
# Publish… and Publishing history are rows of their own group, as the laptop's name menu lists them (a card at the
# menu's foot fell under the fold, 164 below the screen at rest)
DSH = PHLAYERS(DSAVED, (), '', 'EditorDraft.dc.html', pub=(('Pub', 'Publish…', '', 'askPub', INK, False), ('Hist', 'Publishing history', '', 'openVers')), loss=(('Disc', 'Discard changes', '', 'askDisc', RED, False),)) + FSHEET('versOn', 'Publishing history', VERSBODY, back='phToMenu') + DASKS
DSL = LAPLAYERS('Laptop.dc.html') + LAPSHEET(BSHEET('versOn', 'Publishing history', VERSBODY), 480) + DASKS
# the draft's views stay the draft's, in Edit (EditorDraftDiagrams, …), as the editor's
phone('EditorDraft', 'Score editor, a built-in song’s draft (editors)', edph, PHJS(DJS).replace("href: 'Editor' + label + '.dc.html', pick", "href: 'EditorDraft' + label + '.dc.html', pick", 1), DSH, bar=SHEET)
full_laptop('EditorDraftLaptop', 'Score editor, a built-in song’s draft (editors), laptop', edlm, DJS.replace("href: 'EditorLaptop' + label + '.dc.html', pick", "href: 'EditorDraftLaptop' + label + '.dc.html', pick", 1).replace("const M = 'music'", "const VIEW0 = 'page', FIT = (pal, pw) => (pal ? 1710 - 76 - pw - 76 : 1710 - 76 - 64) / 794; const M = 'music'", 1), DSL)
print('r55 editor draft ok')
