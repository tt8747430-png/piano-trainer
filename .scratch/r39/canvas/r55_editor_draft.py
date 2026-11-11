# Canvas 135: the editor's draft of a built-in song (editors only, ADR 0116): Publishing, Versions, Discard, and its states
DS_JS = TOAST_JS.replace('S(', 'set(') + r'''
    const ds = st.ds ?? 'Editing', chg = st.chg ?? true, live = ['Editing', 'Saving', 'Offline', 'Not saved'].includes(ds);
    const VERS = [['Published 3 November 2026', true], ['Published 12 October 2026', false], ['Published 1 September 2026', false]];'''
DS_KEYS = r'''
      dsDemo: demoOf(['Editing', 'Saving', 'Offline', 'Not saved', 'Opening', 'Opening offline', 'Can’t open', 'Not an editor'], ds, 'ds'),
      isLive: live, isOpening: ds === 'Opening', isOpenOff: ds === 'Opening offline', isFailed: ds === 'Can’t open', isLearner: ds === 'Not an editor',
      saveT: { Editing: chg ? 'Saved · not published' : 'Published · no changes', Saving: 'Saving…', Offline: 'Offline: not saved yet', 'Not saved': 'Not saved. It will retry with your next change.' }[ds] || '',
      saveC: ds === 'Not saved' ? '#B3261E' : '#685E56',
      pubOn: st.sheet === 'pub', openPub: () => set({ sheet: 'pub' }), closeSheet: () => set({ sheet: st.sheet === 'rest' ? 'vers' : null }),
      askPub: () => { if (ds === 'Offline') { set({ sheet: null }); toast('You’re offline. Try again when you reconnect.'); } else if (!chg) { set({ sheet: null }); toast('No changes since the last publication.'); } else set({ sheet: 'pubAsk' }); },
      pubAskOn: st.sheet === 'pubAsk', doPub: () => { set({ sheet: null, chg: false }); toast('Published. Learners will receive it the next time they open the app.'); },
      versOn: st.sheet === 'vers', openVers: () => set({ sheet: 'vers' }),
      vers: VERS.map(([t, n], i) => ({ t, newest: n, older: !n, restore: () => set({ sheet: 'rest', rv: i }) })),
      restOn: st.sheet === 'rest', doRest: () => { set({ sheet: null, chg: false }); toast('Restored. Learners will receive it the next time they open the app.'); },
      askDisc: () => { if (!chg) { set({ sheet: null }); toast('No changes since the last publication.'); } else set({ sheet: 'disc' }); },
      discOn: st.sheet === 'disc', doDisc: () => { set({ sheet: null, chg: false }); toast('Changes discarded'); },
      retry: () => set({ ds: 'Editing' }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, undo: () => set({ toast: null }),'''
DJS = ED4.replace("    return { ...common(st, set),", DS_JS + "\n    return { ...common(st, set)," + DS_KEYS, 1)
assert DJS != ED4

PUBPILL = (f'<button type="button" onClick="{{{{openPub}}}}" aria-haspopup="dialog" style="flex: none; height: 36px; padding: 0 10px 0 14px; border: 0; border-radius: 18px; background: {HONEY}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 4px">Publishing{CHEV_D}</button>')
SAVET = f'<span role="status" style="min-width: 0; font-size: 13px; color: {{{{saveC}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{saveT}}}}</span>'
DROW = f'<div style="flex: none; display: flex; align-items: center; gap: 10px; padding: 0 16px 8px">{PUBPILL}{SAVET}</div>'
ASKP = lambda c, t, b, ok, go: ASK(c, t, b, ok, go).replace('background: #B3261E', f'background: {INK}')
VROW = (f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{vers}}}}" as="v" hint-placeholder-count="3"><div style="min-height: 60px; display: flex; align-items: center; gap: 10px; padding: 6px 6px 6px 16px; box-shadow: inset 0 -1px 0 {FILL}">'
        f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-variant-numeric: tabular-nums">{{{{v.t}}}}</span>{IF("v.newest", f"<span style=\"font-size: 13px; font-weight: 600; color: {SOFT}\">Newest · what learners have</span>")}</span>'
        + IF('v.older', f'<button type="button" onClick="{{{{v.restore}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 22px; background: {FILL}; font: inherit; font-size: 15px; font-weight: 600; color: {INK}">Restore</button>') + '</div></sc-for></div>')
PUBBODY = (f'<div style="display: flex; flex-direction: column; gap: 2px; padding: 0 4px"><span style="font-size: 16px; font-weight: 600">Amazing Grace · the original</span>{SAVET}</div>'
           + GROUP(('link', 'Publish…', '', 'askPub'), ('link', 'Versions', '3', 'openVers'), ('action', 'Discard changes', 'askDisc', RED), bg=SHEET)
           + f'<p style="margin: 0; padding: 0 4px; font-size: 13px; line-height: 1.45; color: {SOFT}">Only editors see this draft. Learners keep the published version until you publish.</p>')
VERSBODY = f'<p style="margin: 0; padding: 0 4px; font-size: 15px; line-height: 1.45; color: {SOFT}">Every published version is kept. Restoring a version republishes it for all learners.</p>' + VROW
DASKS = (ASKP('pubAskOn', 'Publish Amazing Grace?', 'All learners will receive this version the next time they open the app. The previous version is kept and can be restored.', 'Publish', 'doPub')
         + ASKP('restOn', 'Restore this version?', 'This version will be republished for all learners, replacing the current one.', 'Restore', 'doRest')
         + ASK('discOn', 'Discard changes?', 'The score will revert to its published version, and your changes will be lost.', 'Discard', 'doDisc'))
def GATES(back):
    return (EMPTY('isOpening', '…', 'Opening…', 'The original is fetched from the server, so this draft is the one other editors see.')
            + EMPTY('isOpenOff', '⌁', 'You’re offline.', 'It will open when you reconnect.', f'<div style="display: flex; margin-top: 6px">{BTN("Back to Songs", "", back, "quiet", 48, False)}</div>')
            + EMPTY('isFailed', '!', 'It couldn’t be opened.', 'Check your connection, then try again.', f'<div style="display: flex; gap: 8px; margin-top: 6px">{BTN("Try again", "retry", "", "primary", 48, False)}</div>')
            + EMPTY('isLearner', '✎', 'Only editors can modify this.', 'A built-in song is changed by the app’s editors. Make your own copy from its ··· menu.', f'<div style="display: flex; margin-top: 6px">{BTN("Back to Songs", "", back, "primary", 48, False)}</div>'))
GHEAD = lambda back: f'<header style="flex: none; height: 60px; display: flex; align-items: center; padding: 8px 16px"><a href="{back}" aria-label="Close the editor" style="width: 44px; height: 44px; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{XI}</a></header>'

edph = (IF('isLive', eph4.replace('</header>', '</header>' + DROW, 1), 'true')
        + IF('notLive', GHEAD('Song.dc.html') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("Songs.dc.html")}</main>')
        + STRIP('dsDemo') + '<div style="height: 22px; flex: none"></div>' + TOASTS)
DJS = DJS.replace("isLive: live,", "isLive: live, notLive: !live,", 1)
LTITLE = f'<span style="font-size: 13px; color: {SOFT}">Saved on this device</span>'
assert LTITLE in elm4
edlm = (IF('isLive', elm4.replace(LTITLE, f'<span style="display: flex; align-items: center; gap: 8px">{PUBPILL.replace("height: 36px", "height: 30px").replace("font-size: 14px", "font-size: 13px")}{SAVET}</span>', 1), 'true')
        + IF('notLive', GHEAD('SongLaptop.dc.html').replace('padding: 8px 16px', 'padding: 12px 24px') + f'<main style="flex: 1; display: flex; flex-direction: column; justify-content: center">{GATES("SongsLaptop.dc.html")}</main>')
        + f'<div style="position: absolute; left: 24px; bottom: 148px; z-index: 40; width: 760px; padding-top: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 4px 14px -6px rgba(51,41,33,.25)">{STRIP("dsDemo")}</div>' + TOASTL)
DSH = BSHEET('pubOn', 'Publishing', PUBBODY) + BSHEET('versOn', 'Versions of Amazing Grace', VERSBODY) + DASKS
DSL = POPOVER('pubOn', 'Publishing', PUBBODY, 'left: 80px; top: 80px', 380) + LAPSHEET(BSHEET('versOn', 'Versions of Amazing Grace', VERSBODY), 480) + DASKS
phone('EditorDraft', 'Score editor, a built-in song’s draft (editors)', edph, DJS, DSH)
full_laptop('EditorDraftLaptop', 'Score editor, a built-in song’s draft (editors), laptop', edlm, DJS, DSL)
print('r55 editor draft ok')
