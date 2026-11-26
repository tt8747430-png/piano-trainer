# Canvas 135: the editor's draft of a built-in song (editors only, ADR 0116): Publishing, Versions, Discard, and its states
DS_JS = TOAST_JS.replace('S(', 'set(') + r'''
    const ds = st.ds ?? 'Editing', chg = st.chg ?? true, live = ['Editing', 'Saving', 'Offline', 'Not saved'].includes(ds);
    const VERS = [['Published 3 November 2026', true], ['Published 12 October 2026', false], ['Published 1 September 2026', false]];'''
DS_KEYS = r'''
      dsDemo: demoOf(['Editing', 'Saving', 'Offline', 'Not saved', 'Opening', 'Opening offline', 'Can’t open', 'Not an editor'], ds, 'ds'),
      isLive: live, isOpening: ds === 'Opening', isOpenOff: ds === 'Opening offline', isFailed: ds === 'Can’t open', isLearner: ds === 'Not an editor',
      saveT: { Editing: chg ? 'Saved · not published' : 'Published · no changes', Saving: 'Saving…', Offline: 'Offline: not saved yet', 'Not saved': 'Not saved. It will retry with your next change.' }[ds] || '',
      saveC: ds === 'Not saved' ? '#B3261E' : '#685E56',
      closeSheet: () => set({ sheet: st.sheet === 'rest' ? 'vers' : null }),
      askPub: () => { if (ds === 'Offline') { set({ sheet: null }); toast('You’re offline. Try again when you reconnect.'); } else if (!chg) { set({ sheet: null }); toast('No changes since the last publication'); } else set({ sheet: 'pubAsk' }); },
      pubAskOn: st.sheet === 'pubAsk', doPub: () => { set({ sheet: null, chg: false }); toast('Published. Learners will receive it the next time they open the app.'); },
      versOn: st.sheet === 'vers', openVers: () => set({ sheet: 'vers' }),
      vers: VERS.map(([t, n], i) => ({ t, newest: n, older: !n, restore: () => set({ sheet: 'rest', rv: i }) })),
      restOn: st.sheet === 'rest', doRest: () => { set({ sheet: null, chg: false }); toast('Restored. Learners will receive it the next time they open the app.'); },
      askDisc: () => { if (!chg) { set({ sheet: null }); toast('No changes since the last publication'); } else set({ sheet: 'disc' }); },
      discOn: st.sheet === 'disc', doDisc: () => { set({ sheet: null, chg: false }); toast('Changes discarded'); },
      retry: () => set({ ds: 'Editing' }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, undo: () => set({ toast: null }),'''
DJS = ED4.replace("    return { ...common(st, set),", DS_JS + "\n    return { ...common(st, set)," + DS_KEYS, 1)
assert DJS != ED4

SAVET = f'<span role="status" style="min-width: 0; font-size: 13px; color: {{{{saveC}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{saveT}}}}</span>'
def DMENU(sfx):
    # nothing hangs under the bar (loop round 60): the draft's status and its publishing acts live in the bar's ··· menu
    return ED_MENU(sfx, 'openVers') + GROUP(('link', 'Publish…', '', 'askPub'), ('action', 'Discard changes', 'askDisc', RED), bg=SHEET)
DSAVED = f'<p role="status" style="margin: -8px 0 0; text-align: center; font-size: 13px; color: {{{{saveC}}}}">{{{{saveT}}}}</p>'
ASKP = lambda c, t, b, ok, go: ASK(c, t, b, ok, go, danger=False)
VROW = (f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{vers}}}}" as="v" hint-placeholder-count="3"><div style="min-height: 72px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 6px 6px 6px 16px; box-shadow: inset 0 -1px 0 {FILL}">'
        f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-variant-numeric: tabular-nums">{{{{v.t}}}}</span>{IF("v.newest", f"<span style=\"font-size: 13px; font-weight: 600; color: {SOFT}\">Newest</span>")}</span>'
        + IF('v.older', f'<button type="button" onClick="{{{{v.restore}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {FILL}; font: inherit; font-size: 15px; font-weight: 600; color: {INK}">Restore</button>') + '</div></sc-for></div>')
VERSBODY = f'' + VROW
DASKS = (ASKP('pubAskOn', 'Publish Amazing Grace?', 'All learners will receive this version the next time they open the app. The previous version is kept and can be restored.', 'Publish', 'doPub')
         + ASKP('restOn', 'Restore this version?', 'This version will be republished for all learners, replacing the current one.', 'Restore', 'doRest')
         + ASK('discOn', 'Discard changes?', 'The score will revert to its published version, and your changes will be lost.', 'Discard', 'doDisc'))
def GATES(back):
    return (EMPTY('isOpening', '…', 'Opening…', 'The original is fetched from the server, so this draft is the one other editors see.')
            + EMPTY('isOpenOff', '⌁', 'You’re offline.', 'It will open when you reconnect.', f'{BTN("Back to Songs", "", back, "quiet", 48, False)}')
            + EMPTY('isFailed', '!', 'It couldn’t be opened.', 'Check your connection, then try again.', f'{BTN("Try again", "retry", "", "primary", 48, False)}')
            + EMPTY('isLearner', '✎', 'Only editors can modify this.', 'A built-in song is changed by the app’s editors. Make your own copy from its ··· menu.', f'{BTN("Back to Songs", "", back, "primary", 48, False)}'))
# the gates' Close is the editor bar's own glass Close, so the way out looks the same in every state
GHEAD = lambda back: f'<header style="flex: none; height: 60px; display: flex; align-items: center; padding: 8px 16px"><a href="{back}" aria-label="Close the editor" style="width: 44px; height: 44px; border-radius: 22px; background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, 0 1px 2px rgba(51,41,33,.10), 0 2px 6px -2px rgba(51,41,33,.10); color: {INK}; display: flex; align-items: center; justify-content: center">{XI}</a></header>'

edph = (IF('isLive', eph4.replace(MODESW('edit', 'Player.dc.html'), MODESW('edit', 'Player.dc.html', 'Accompaniment')), 'true')
        + IF('notLive', GHEAD('Songs.dc.html') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("Songs.dc.html")}</main>')
        + STRIP('dsDemo') + STRIP('states') + '<div style="height: 22px; flex: none"></div>' + TOASTS)
DJS = DJS.replace("isLive: live,", "isLive: live, notLive: !live,", 1)
LTITLE = f'<span role="status" style="font-size: 13px; color: {SOFT}; white-space: nowrap">Saved on this device</span>'
assert LTITLE in elm4
edlm = (IF('isLive', elm4.replace(LTITLE, SAVET, 1).replace(MODESW('edit', 'PlayerLaptop.dc.html'), MODESW('edit', 'PlayerLaptop.dc.html', 'Accompaniment')), 'true')
        + IF('notLive', GHEAD('SongsLaptop.dc.html').replace('padding: 8px 16px', 'padding: 12px 24px') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("SongsLaptop.dc.html")}</main>')
        + f'<div style="position: absolute; right: 24px; bottom: 188px; z-index: 40; width: 760px; padding-top: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 4px 14px -6px rgba(51,41,33,.25)">{STRIP("dsDemo")}{STRIP("states")}</div>' + TOASTL)
DSH = (BSHEET('moreOn', 'Amazing Grace', DSAVED + DMENU('.dc.html')) + THINGPAGE('creditsOn', 'closeSheet', 'Credits', ED_CREDITS, False) + BSHEET('instOn', 'Instruments', ED_INST) + BSHEET('pickInstOn', 'Add an instrument', ED_PICK, 'Cancel')).replace('max-height: 86%', 'max-height: calc(100% - 124px)', 1) + BSHEET('versOn', 'Versions of Amazing Grace', VERSBODY) + DASKS
DSL = POPOVER('moreOn', 'Amazing Grace', DMENU('Laptop.dc.html'), 'right: 24px; top: 76px') + THINGPAGE('creditsOn', 'closeSheet', 'Credits', ED_CREDITS, True) + POPOVER('instOn', 'Instruments', ED_INST, 'right: 24px; top: 76px') + POPOVER('pickInstOn', 'Add an instrument', ED_PICK, 'right: 24px; top: 76px') + LAPSHEET(BSHEET('versOn', 'Versions of Amazing Grace', VERSBODY), 480) + DASKS
phone('EditorDraft', 'Score editor, a built-in song’s draft (editors)', edph, DJS.replace("const M = 'music'", "const VIEW0 = 'pano', FIT = 378 / 794; const M = 'music'", 1), DSH)
full_laptop('EditorDraftLaptop', 'Score editor, a built-in song’s draft (editors), laptop', edlm, DJS.replace("const M = 'music'", "const VIEW0 = 'page', FIT = (pal, pw) => (pal ? 1710 - pw - 76 : 1646) / 794; const M = 'music'", 1), DSL)
print('r55 editor draft ok')
