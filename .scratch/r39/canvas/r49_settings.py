# R49: Settings with every page drawn and working (wave 3 and 4 of coverage.md): the Account with Editorial access,
# Sync, Sign out and Delete account; Edit profile, Change password, Privacy; General; Storage and backup; On-screen
# piano; MIDI devices with its log and timing; Selection toolbar; Swipe actions; User guide; Report a problem; About.
# Exact labels from inventory.md (src/shared/i18n/locales/en). Rebuilds the Settings boards drawn by r45_places.
# Exec'd by r41.py after r48_course.

INFOI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 7.5h.01"></path></svg>'
EYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
RED = '#B3261E'
GREEN = '#44684A'

def S9CAPS(t, tip=''):
    """A group's heading; with tip, an ⓘ that opens the explanation in place (no line under a control)."""
    if not tip:
        return CAPS(t)
    return (f'<div style="position: relative; display: flex; align-items: center; justify-content: space-between; margin-bottom: -6px">{CAPS(t)}'
            f'<button type="button" aria-label="About {t}" onClick="{{{{tip_{tip}}}}}" style="width: 44px; height: 44px; margin: -12px -8px -12px 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{INFOI}</button></div>')
def TIPCARD(key, text):
    return (f'<sc-if value="{{{{tipOn_{key}}}}}" hint-placeholder-val="{{{{false}}}}"><div role="note" style="border-radius: 12px; background: {INK}; color: {SHEET}; padding: 10px 12px; font-size: 14px; line-height: 1.45; display: flex; gap: 8px; align-items: flex-start">'
            f'<span style="flex: 1">{text}</span><button type="button" aria-label="Close" onClick="{{{{tip_{key}}}}}" style="flex: none; width: 32px; height: 32px; margin: -6px -6px -6px 0; border: 0; background: transparent; color: {SHEET}; font: inherit; font-size: 18px">×</button></div></sc-if>')
SEC = lambda *parts: f'<section style="display: flex; flex-direction: column; gap: 6px">{"".join(parts)}</section>'
FOOT = lambda t: f'<p style="margin: 0 4px; font-size: 13px; line-height: 1.4; color: {SOFT}; text-wrap: pretty">{t}</p>'
def FIELD(label, val, key='', typ='text', note='', noteC=SOFT, eye=False):
    inp = f'<input type="{{{{{key}Type}}}}" ' if eye else f'<input type="{typ}" '
    inp += f'value="{val}" aria-label="{label}" style="flex: 1; min-width: 0; height: 48px; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none">'
    e = f'<button type="button" aria-label="{{{{{key}EyeL}}}}" onClick="{{{{{key}Eye}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{EYE}</button>' if eye else ''
    n = f'<span style="margin: 0 4px; font-size: 13px; color: {noteC}">{note}</span>' if note else ''
    return (f'<label style="display: flex; flex-direction: column; gap: 6px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{label}</span>'
            f'<span style="display: flex; align-items: center; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 4px 0 12px">{inp}{e}</span>{n}</label>')
AVA = lambda s, fs: f'<span style="flex: none; width: {s}px; height: {s}px; border-radius: {s // 2}px; background: #E9D8C4; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: {fs}px; color: {INK}">{{{{avatar}}}}</span>'
DOT = lambda c: f'<span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {c}"></span>'
ROWBTN = lambda label, act, val='', color=INK: (f'<button type="button" onClick="{{{{{act}}}}}" style="min-height: 52px; width: 100%; border: 0; background: transparent; color: {color}; font: inherit; text-align: left; display: flex; align-items: center; gap: 10px; padding: 6px 12px 6px 16px">'
                                              f'<span style="flex: 1; font-size: 16px">{label}</span><span style="font-size: 16px; color: {SOFT}">{val}</span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></button>')
BOXG = lambda *rows: '<div style="border-radius: 14px; background: ' + SHEET + '; box-shadow: 0 0 0 1px ' + LINE + '; overflow: hidden">' + ''.join(f'<div style="box-shadow: inset 0 {"-1px" if i < len(rows) - 1 else "0"} 0 {FILL}">{r}</div>' for i, r in enumerate(rows)) + '</div>'
REDBTN = lambda label, act: GROUP(('action', label, act, RED), bg=SHEET)

# ── Account ──
ACC_IN = (f'<button type="button" onClick="{{{{go_Edit_profile}}}}" style="width: 100%; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; text-align: left; display: flex; align-items: center; gap: 16px; padding: 12px 12px 12px 16px">{AVA(56, 26)}'
          f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 18px; font-weight: 700">{{{{name}}}}</span><span style="font-size: 15px; color: {LINK}; font-weight: 600">Edit profile</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></button>'
          + SEC(GROUP(('val', 'Email', 'ana@example.com'), ('link', 'Change password', '', 'go_Change_password'), ('link', 'Privacy', '{{privV}}', 'go_Privacy'), bg=SHEET))
          + f'<sc-if value="{{{{editorial}}}}" hint-placeholder-val="{{{{true}}}}">' + SEC(S9CAPS('Editorial access', 'prev'), TIPCARD('prev', 'Hides every editing and administration control for this session. Nothing is changed; the preview ends when you exit it, reload or sign out.'),
                GROUP(('val', 'Role', 'Administrator'), ('toggle', 'Preview as learner', 'prevOn', 'prevT'), bg=SHEET)) + '</sc-if>'
          + SEC(S9CAPS('Sync', 'sync'), TIPCARD('sync', 'Your songs, folders, takes, progress and settings sync while you are signed in.'),
                BOXG(f'<div style="min-height: 52px; display: flex; align-items: center; gap: 10px; padding: 6px 16px">{DOT("{{syncDot}}")}<span style="flex: 1; font-size: 16px; font-weight: 600">{{{{syncT}}}}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">Last synced {{{{synced}}}}</span></div>',
                     f'<div style="min-height: 48px; display: flex; align-items: center; padding: 6px 16px"><span style="flex: 1; font-size: 16px">Changes pending</span><span style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{pending}}}}</span></div>',
                     f'<button type="button" onClick="{{{{syncNow}}}}" style="min-height: 52px; width: 100%; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600; text-align: left; padding: 6px 16px">{{{{syncBtn}}}}</button>'))
          + SEC(REDBTN('Sign out', 'askSignOut'))
          + SEC(REDBTN('Delete account…', 'askDelete'), FOOT('Your account and synced data are deleted after 30 days.')))
ACC_OUT = (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px 16px 8px; text-align: center">{AVA(64, 28).replace("{{avatar}}", "?")}<span style="font-size: 18px; font-weight: 700">You are not signed in.</span><span style="font-size: 15px; color: {SOFT}; max-width: 300px">Your songs and progress stay on this device.</span></div>'
           + GROUP(('link', 'Sign in', '', 'SignIn.dc.html'), ('link', 'Create account', '', 'SignIn.dc.html'), bg=SHEET)
           + FOOT('Sign in to sync your library across your devices.'))
P_ACCOUNT = f'<sc-if value="{{{{signedIn}}}}" hint-placeholder-val="{{{{true}}}}">{ACC_IN}</sc-if><sc-if value="{{{{signedOut}}}}" hint-placeholder-val="{{{{false}}}}">{ACC_OUT}</sc-if>'

_SV = lambda d: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'
PICS = [('Note', '♪'), ('Quavers', '♫'), ('Beamed notes', '♬'), ('Semiquavers', _SV('<path d="M9 18V5l10-2v3M9 9l10-2"></path><circle cx="6.5" cy="18" r="2.5" fill="currentColor"></circle>')),
        ('Piano', _SV('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v8M12 5v14M16 5v8"></path>')), ('Guitar', _SV('<path d="m14 10 6-6M17 3l4 4"></path><path d="M10.5 9.5a4 4 0 0 0-5.7 1.1L3.4 13a4 4 0 0 0 7.6 4.8l1.2-1.5a4 4 0 0 0-1.7-6.8z"></path><circle cx="8.5" cy="14.5" r="1.2"></circle>')),
        ('Drum', _SV('<ellipse cx="12" cy="8" rx="8" ry="3"></ellipse><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8M8 3l3 5M16 3l-3 5"></path>')), ('Microphone', _SV('<rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path>')),
        ('Headphones', _SV('<path d="M4 15v-3a8 8 0 0 1 16 0v3"></path><rect x="3" y="14" width="4" height="6" rx="1.5"></rect><rect x="17" y="14" width="4" height="6" rx="1.5"></rect>')), ('Sound wave', _SV('<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2"></path>')),
        ('Record', _SV('<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle>')), ('Radio', _SV('<rect x="3" y="8" width="18" height="12" rx="2"></rect><path d="M7 8 17 3"></path><circle cx="15" cy="14" r="2.5"></circle><path d="M6 12h4M6 15h4"></path>'))]
PHOTOBODY = (GROUP(('action', 'Upload photo', 'closeSheet'), bg=SHEET) + CAPS('Pictures')
             + '<div role="radiogroup" aria-label="Pictures" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">'
             + ''.join(f'<button type="button" role="radio" aria-label="{n}" onClick="{{{{pickPic_{i}}}}}" style="aspect-ratio: 1; border: 0; border-radius: 16px; background: {SHEET}; box-shadow: {{{{picRing_{i}}}}}; font: inherit; font-size: 26px; color: {INK}; display: flex; align-items: center; justify-content: center">{g}</button>' for i, (n, g) in enumerate(PICS))
             + '</div>' + GROUP(('action', 'Remove photo', 'removePhoto', RED), bg=SHEET))
P_EDITPROFILE = (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 0">{AVA(96, 42)}<button type="button" onClick="{{{{openPhoto}}}}" style="height: 44px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600">Change photo</button></div>'
                 + FIELD('Name', 'Ana Popescu') + FIELD('Username', 'ana', note='Available', noteC=GREEN)
                 + f'<label style="display: flex; flex-direction: column; gap: 6px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Bio</span><textarea aria-label="Bio" rows="3" style="border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 12px; font: inherit; font-size: 16px; line-height: 1.45; color: {INK}; resize: none; outline: none">Church pianist, learning jazz voicings.</textarea><span style="align-self: flex-end; margin: 0 4px; font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">38 of 160</span></label>'
                 + SEC(CAPS('Email'), GROUP(('val', 'Email', 'ana@example.com'), ('link', 'New email', '', 'toggleNewEmail'), bg=SHEET))
                 + f'<sc-if value="{{{{newEmailOn}}}}" hint-placeholder-val="{{{{false}}}}">{FIELD("New email", "", typ="email")}<div style="display: flex">{BTN("Send link", "sendLink", "", "quiet", 44, False)}</div><sc-if value="{{{{linkSent}}}}" hint-placeholder-val="{{{{false}}}}">{FOOT("Check your inbox to confirm the new address.")}</sc-if></sc-if>'
                 + f'<div style="display: flex; margin-top: 8px">{BTN("{{saveT}}", "saveProfile", "", "primary", 50)}</div>')
P_PASSWORD = (FIELD('Current password', 'oldpassword', 'pw1', eye=True) + FIELD('New password', 'a longer phrase', 'pw2', eye=True, note='At least 8 characters.')
              + FIELD('Confirm new password', '{{pw3V}}', 'pw3', eye=True) + f'<sc-if value="{{{{pwErr}}}}" hint-placeholder-val="{{{{false}}}}"><span role="alert" style="margin: -6px 4px 0; font-size: 14px; color: {RED}">The new passwords don’t match.</span></sc-if>'
              + f'<div style="display: flex; margin-top: 8px">{BTN("Update password", "updatePw", "", "primary", 50)}</div>')
P_PRIVACY = (SEC(S9CAPS('Profile', 'priv'), TIPCARD('priv', 'Your name and picture on songs you publish, and your profile in Explore. Off: published songs show “Piano Trainer learner”.'), GROUP(('toggle', 'Show my profile', 'showOn', 'showT'), bg=SHEET))
             + SEC(CAPS('How your published songs show you'), CARD(f'<div style="display: flex; align-items: center; gap: 12px"><span style="flex: none; width: 52px; height: 52px; border-radius: 10px; background: {SKY}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 22px">𝄞</span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">Amazing Grace</span><span style="display: flex; align-items: center; gap: 6px; font-size: 14px; color: {SOFT}"><span style="width: 20px; height: 20px; border-radius: 10px; background: #E9D8C4; font-size: 11px; display: flex; align-items: center; justify-content: center; color: {INK}">{{{{byInit}}}}</span>{{{{byName}}}}</span></span></div>')))

P_GENERAL = THEMES

# ── Storage and backup ──
BAR = lambda w, c=GREEN: f'<span style="display: block; height: 8px; border-radius: 4px; background: {FILL}; overflow: hidden"><span style="display: block; width: {w}; height: 8px; border-radius: 4px; background: {c}"></span></span>'
P_STORAGE = (SEC(S9CAPS('Device storage', 'store'), TIPCARD('store', 'This browser manages storage itself. Install the app or save a backup to keep your data safe.'),
                 BOXG(f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 14px 16px"><span style="font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums">48 MB used on this device</span>{BAR("38%", "#5B8DB8")}<span style="display: flex; gap: 16px; font-size: 13px; color: {SOFT}"><span style="display: flex; align-items: center; gap: 6px">{DOT("#5B8DB8")}Songs and takes 18 MB</span><span style="display: flex; align-items: center; gap: 6px">{DOT(GREEN)}Piano 30 MB</span></span></div>',
                      GROUP(('toggle', 'Protect from clearing', 'protOn', 'protT'), bg=SHEET)), f'<sc-if value="{{{{protOn}}}}" hint-placeholder-val="{{{{true}}}}">{FOOT("Protected: the browser will not clear this data to free up space")}</sc-if>')
             + SEC(S9CAPS('Offline piano', 'offl'), TIPCARD('offl', 'The full sampled piano plays without a connection once it is downloaded.'),
                   BOXG(f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 14px 16px"><span style="display: flex; justify-content: space-between; font-size: 16px; font-variant-numeric: tabular-nums"><span style="font-weight: 600">{{{{offT}}}}</span><span style="color: {SOFT}">{{{{offN}}}}</span></span>{BAR("{{offW}}")}</div>',
                        f'<sc-if value="{{{{offCan}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{download}}}}" style="min-height: 52px; width: 100%; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600; text-align: left; padding: 6px 16px">Download for offline use</button></sc-if>'))
             + SEC(CAPS('Backup'), GROUP(('action', 'Save a backup', 'saveBackup'), ('action', 'Restore from a file', 'askRestore'), bg=SHEET))
             + SEC(GROUP(('action', 'Reset progress', 'askReset', RED), ('action', 'Remove downloaded piano samples', 'askRemove', RED), bg=SHEET),
                   FOOT('Resetting clears learned steps, practised songs and quiz results on this device. Removing the samples frees their space; a lighter piano plays offline until you download them again.')))

# ── On-screen piano: a picture of the keys that answers each choice ──
def MINIKEYS(names):
    W, wk = 336, 14
    xs = W / wk
    out = [f'<svg viewBox="0 0 {W} 92" width="100%" role="img" aria-label="The on-screen piano" style="display: block">']
    WN = 'CDEFGAB'
    for i in range(wk):
        out.append(f'<rect x="{i * xs + .5:.1f}" y="0.5" width="{xs - 1:.1f}" height="90" rx="4" fill="#FFFFFF" stroke="#DAD1C8"></rect>')
        lab = WN[i % 7] + str(4 + i // 7)
        if names == 'every' or (names == 'c' and i % 7 == 0):
            out.append(f'<text x="{i * xs + xs / 2:.1f}" y="80" text-anchor="middle" font-size="10" font-weight="600" fill="#685E56">{lab}</text>')
    for i in range(wk - 1):
        if i % 7 in (0, 1, 3, 4, 5):
            out.append(f'<rect x="{(i + 1) * xs - xs * .3:.1f}" y="0" width="{xs * .6:.1f}" height="56" rx="3" fill="#332921"></rect>')
    out.append('</svg>')
    return ''.join(out)
KEYPIC = CARD(f'<sc-if value="{{{{nnC}}}}" hint-placeholder-val="{{{{true}}}}">{MINIKEYS("c")}</sc-if><sc-if value="{{{{nnEvery}}}}" hint-placeholder-val="{{{{false}}}}">{MINIKEYS("every")}</sc-if><sc-if value="{{{{nnHidden}}}}" hint-placeholder-val="{{{{false}}}}">{MINIKEYS("")}</sc-if>', '12px 12px')
SHORTBODY = BOXG(*[f'<div style="min-height: 48px; display: flex; align-items: center; gap: 12px; padding: 6px 16px"><span style="flex: 1; font-size: 16px">{a}</span><span style="display: flex; gap: 4px">' + ''.join(f'<kbd style="min-width: 28px; height: 28px; padding: 0 8px; box-sizing: border-box; border-radius: 6px; background: {FILL}; box-shadow: inset 0 -1px 0 {LINE}; font: inherit; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center">{k}</kbd>' for k in ks) + '</span></div>'
                   for a, ks in [('Play the white keys', ['A', 'S', 'D', 'F', '…']), ('Play the black keys', ['W', 'E', 'T', 'Y', 'U']), ('Octave down', ['Z']), ('Octave up', ['X']), ('Hold the sustain pedal', ['Space'])]])
P_PIANO = (KEYPIC + SEC(CAPS('Keys and sound'), GROUP(('seg', 'Key size', 'keySize'), ('seg', 'Note names', 'noteNames'), ('raw', f'<div style="min-height: 52px; display: flex; align-items: center; gap: 12px; padding: 6px 16px"><span style="font-size: 16px">Volume</span><input type="range" aria-label="Volume" min="0" max="100" value="80" style="flex: 1; min-width: 0; accent-color: {INK}"></div>'), ('seg', 'Pedals', 'pedals'), bg=SHEET))
           + SEC(CAPS('Display'), GROUP(('toggle', 'Chord symbol', 'chordOn', 'chordT'), ('toggle', 'Note names on highlighted keys', 'hlOn', 'hlT'), bg=SHEET))
           + SEC(CAPS('While you play'), GROUP(('seg', 'Swipe gesture', 'swipeG'), ('toggle', 'Play on selection', 'posOn', 'posT'), bg=SHEET))
           + SEC(CAPS('Placement'), GROUP(('seg', 'Position', 'place'), bg=SHEET))
           + SEC(S9CAPS('Computer keyboard', 'ckb'), TIPCARD('ckb', 'The letter keys play the on-screen piano. Z and X shift the octave · Space holds the sustain pedal.'), GROUP(('toggle', 'Play with computer keyboard', 'ckbOn', 'ckbT'), ('link', 'Shortcuts', '', 'openShort'), bg=SHEET)))

# ── MIDI devices, its log and timing ──
DEV = (f'<div style="min-height: 60px; display: flex; align-items: center; gap: 12px; padding: 8px 16px"><span style="flex: none; width: 36px; height: 36px; border-radius: 10px; background: {SAGE}; color: #2F5A35; display: flex; align-items: center; justify-content: center">{KEYSI.replace("22", "20")}</span>'
       f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">Roland FP-30X</span><span style="display: flex; align-items: center; gap: 6px; font-size: 14px; color: {SOFT}">{DOT(GREEN)}Keys · Speaker</span></span></div>')
DEV2 = f'<div style="min-height: 52px; display: flex; align-items: center; gap: 12px; padding: 6px 16px"><span style="flex: 1; font-size: 16px; color: {SOFT}">Yamaha P-125</span><span style="font-size: 15px; color: {SOFT}">Not connected</span></div>'
BTSTEPS = ''.join(f'<li style="display: flex; gap: 12px; align-items: flex-start"><span style="flex: none; width: 28px; height: 28px; border-radius: 14px; background: {FILL}; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center">{i + 1}</span><span style="font-size: 15px; line-height: 1.45; padding-top: 3px"><b>{h}</b> {t}</span></li>'
                  for i, (h, t) in enumerate([('Power.', 'Turn the keyboard on and put it in pairing mode (see its manual).'), ('Mac.', 'Audio MIDI Setup › Window › Show MIDI Studio › Bluetooth, then Connect.'), ('Windows.', 'Settings › Bluetooth and devices › Add device.'), ('Android.', 'Chrome finds it by itself: press a key once paired.'), ('iPhone and iPad.', 'Safari cannot reach Bluetooth MIDI; use a USB adapter.'), ('Back here.', 'Press a key: the device appears under Connected devices.')]))
BTBODY = f'<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px">{BTSTEPS}</ol>'
P_MIDI = (SEC(CAPS('MIDI keyboard'), GROUP(('toggle', 'MIDI input', 'minOn', 'minT'), ('toggle', 'MIDI output', 'moutOn', 'moutT'), ('toggle', 'MIDI input plays sound', 'mplayOn', 'mplayT'), bg=SHEET))
          + SEC(S9CAPS('Connected devices', 'dev'), TIPCARD('dev', 'Any MIDI keyboard works: plug it in by USB, or pair it by Bluetooth, then press a key.'),
                f'<sc-if value="{{{{minOn}}}}" hint-placeholder-val="{{{{true}}}}">{BOXG(DEV, DEV2)}</sc-if><sc-if value="{{{{minOff}}}}" hint-placeholder-val="{{{{false}}}}">{CARD(f"<span style=\"font-size: 15px; color: {SOFT}\">Turn on MIDI input to see your devices</span>")}</sc-if>')
          + SEC(CAPS('Playing'), GROUP(('step', 'Octave shift', 'oct', 'octDn', 'octUp'), ('seg', 'Touch', 'touch'), ('seg', 'Pedal', 'pedal'), ('link', 'Calibrate timing', '{{latV}}', 'go_Calibrate_timing'), bg=SHEET))
          + SEC(CAPS('Bluetooth'), GROUP(('link', 'Connect a Bluetooth MIDI keyboard', '', 'openBt'), bg=SHEET))
          + SEC(CAPS('Troubleshooting'), GROUP(('link', 'MIDI log', '{{logN}}', 'go_MIDI_log'), bg=SHEET)))
LOGROW = (f'<div style="min-height: 48px; display: flex; align-items: center; gap: 12px; padding: 6px 16px; box-shadow: inset 0 -1px 0 {FILL}"><span style="flex: none; width: 64px; font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{m.t}}}}</span>'
          f'<span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><span style="font-size: 15px; font-weight: 600">{{{{m.a}}}}</span><span style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{m.b}}}}</span></span></div>')
P_LOG = (f'<div style="display: flex; gap: 8px">{BTN("{{pauseT}}", "pauseLog", "", "quiet", 44)}{BTN("Clear", "clearLog", "", "quiet", 44)}</div>'
         + f'<sc-if value="{{{{logPaused}}}}" hint-placeholder-val="{{{{false}}}}">{CARD(f"<span style=\"font-size: 15px\">Paused: new messages are kept but not shown</span>", "10px 14px", f"background: {HONEY}; box-shadow: none")}</sc-if>'
         + f'<sc-if value="{{{{logAny}}}}" hint-placeholder-val="{{{{true}}}}"><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{log}}}}" as="m" hint-placeholder-count="6">{LOGROW}</sc-for></div></sc-if>'
         + f'<sc-if value="{{{{logNone}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 16px; text-align: center"><span style="width: 56px; height: 56px; border-radius: 28px; background: {FILL}; color: {SOFT}; display: flex; align-items: center; justify-content: center">{KEYSI}</span><span style="font-size: 16px; color: {SOFT}">Play a key or a pedal: each message shows here</span></div></sc-if>')
P_TIMING = (CARD(f'<div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 12px 0"><div role="img" aria-label="{{{{calA}}}}" style="display: flex; gap: 8px"><sc-for list="{{{{clicks}}}}" as="c" hint-placeholder-count="8"><span style="width: 22px; height: 22px; border-radius: 11px; background: {{{{c.bg}}}}"></span></sc-for></div>'
                 f'<span style="font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; text-align: center">{{{{calT}}}}</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}; text-align: center; max-width: 420px">{{{{calS}}}}</span>'
                 f'<div style="display: flex; width: 100%; max-width: 320px">{BTN("{{calBtn}}", "calGo", "", "primary", 50)}</div></div>', '20px 16px')
            + GROUP(('val', 'Kept', '{{latV}}'), bg=SHEET))

# ── Selection toolbar and Swipe actions ──
ACTIC = {'Edit': PENCIL, 'Favourite': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>',
         'Move': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h6l2 2h10v10H3z"></path></svg>',
         'Export': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 15v5h14v-5"></path></svg>',
         'Archive': ARCHIVE.replace('22', '18'), 'Delete': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>'}
TBPREVIEW = (f'<div role="img" aria-label="The selection toolbar" style="display: flex; justify-content: center; padding: 8px 0"><div style="height: 60px; padding: 0 8px; border-radius: 30px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, 0 6px 18px -8px rgba(51,41,33,.3); display: flex; align-items: center; gap: 4px">'
             f'<span style="padding: 0 10px; font-size: 15px; font-weight: 700">2 selected</span><sc-for list="{{{{tbOn}}}}" as="a" hint-placeholder-count="4"><span style="width: 44px; height: 44px; border-radius: 22px; color: {{{{a.ink}}}}; display: flex; align-items: center; justify-content: center; background-image: {{{{a.ic}}}}; background-size: 20px; background-position: center; background-repeat: no-repeat"></span></sc-for></div></div>')
TBROW_ON = (f'<div style="min-height: 52px; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 8px; box-shadow: inset 0 -1px 0 {FILL}"><button type="button" aria-label="Remove {{{{a.l}}}}" onClick="{{{{a.rm}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 22px; height: 22px; border-radius: 11px; background: {RED}; color: #FFFFFF; font-size: 18px; line-height: 22px; text-align: center">−</span></button>'
            f'<span style="flex: 1; font-size: 16px">{{{{a.l}}}}</span><span role="button" aria-label="{{{{a.l}}}}: drag to reorder" style="flex: none; width: 44px; height: 44px; color: {SOFT}; display: flex; align-items: center; justify-content: center">{GRIP}</span></div>')
TBROW_OFF = (f'<div style="min-height: 52px; display: flex; align-items: center; gap: 8px; padding: 4px 16px 4px 8px; box-shadow: inset 0 -1px 0 {FILL}"><button type="button" aria-label="Add {{{{a.l}}}}" aria-disabled="{{{{a.full}}}}" onClick="{{{{a.add}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; opacity: {{{{a.op}}}}"><span style="width: 22px; height: 22px; border-radius: 11px; background: {GREEN}; color: #FFFFFF; font-size: 18px; line-height: 22px; text-align: center">+</span></button>'
             f'<span style="flex: 1; font-size: 16px; color: {{{{a.ink}}}}">{{{{a.l}}}}</span></div>')
P_TOOLBAR = (TBPREVIEW + SEC(CAPS('Songs and folders'), f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{tbOn}}}}" as="a" hint-placeholder-count="4">{TBROW_ON}</sc-for></div>')
             + SEC(CAPS('Available'), f'<sc-if value="{{{{tbFull}}}}" hint-placeholder-val="{{{{false}}}}">{FOOT("All slots are in use. Remove an action to add another.")}</sc-if><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{tbOff}}}}" as="a" hint-placeholder-count="2">{TBROW_OFF}</sc-for></div>')
             + SEC(GROUP(('action', 'Restore defaults', 'tbReset'), bg=SHEET), FOOT('Up to four actions appear in the toolbar when you select songs or folders.')))
SWPREVIEW = (f'<div role="img" aria-label="A swiped row" style="position: relative; height: 64px; border-radius: 14px; overflow: hidden; background: {{{{swBg}}}}; box-shadow: 0 0 0 1px {LINE}">'
             f'<span style="position: absolute; left: 0; top: 0; bottom: 0; width: 96px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 14px; font-weight: 700">{{{{swL}}}}</span>'
             f'<div style="position: absolute; left: 96px; right: -96px; top: 0; bottom: 0; background: {SHEET}; display: flex; align-items: center; gap: 12px; padding: 0 16px; box-shadow: -1px 0 0 {LINE}"><span style="width: 40px; height: 40px; border-radius: 8px; background: {SKY}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 20px">𝄞</span><span style="display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 600">{{{{swName}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{swSub}}}}</span></span></div></div>')
P_SWIPE = (f'<div style="display: grid">{SEGC("swKind", 44, 15)}</div>' + SWPREVIEW
           + SEC(CAPS('Leading swipe (right)'), GROUP(('link', 'First', '{{swR1}}', 'pickR1'), ('link', 'Second', '{{swR2}}', 'pickR2'), bg=SHEET))
           + SEC(CAPS('Trailing swipe (left)'), GROUP(('link', 'First', '{{swL1}}', 'pickL1'), ('link', 'Second', '{{swL2}}', 'pickL2'), bg=SHEET))
           + FOOT('Up to two actions on each side. Archive and Delete always ask for confirmation.'))
SWPICK = f'<div role="radiogroup" style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{swOpts}}}}" as="o" hint-placeholder-count="5"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="width: 100%; min-height: 52px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {FILL}; color: {INK}; font: inherit; font-size: 16px; text-align: left; display: flex; align-items: center; gap: 10px; padding: 6px 16px"><span style="flex: 1">{{{{o.l}}}}</span><sc-if value="{{{{o.on}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if></button></sc-for></div>'

# ── User guide, Report a problem, About ──
GUIDE = [('Organise your library', ['Songs holds your library: folders first, then songs. Search finds a song by title; Filters narrow the list by key, level or favourites.', 'New folder groups songs. Folders can contain folders of their own.', 'Select, or a long press on a row, chooses several songs at once.', 'Move to… places the selected songs in a folder. Undo in the message reverses it.', 'Archive puts songs away without deleting them. The Archive button at the top of Songs restores them.', 'The heart marks a song as a favourite.']),
         ('Play a song', ['View sets how the music is shown: sheet music, chords over lyrics, chord diagrams or a chord grid.', 'Transpose shifts the song up or down by semitones. Reset restores the original key.', 'Simplify plays each chord as a plain major or minor triad.', 'Sound holds the count-in, the metronome and each part’s volume.', 'Loop repeats a passage. Select it with Shift and a click, or hold a note and drag.', 'In the tempo menu, Wait mode pauses until you play each note.']),
         ('Learn a song', ['A song’s page shows its key, time signature, tempo, chords and sections.', 'A section’s page holds its lessons: its chords, its chord changes and its patterns.', 'A lesson opens the Player looping its bars. Play them through in Wait mode to complete it.', 'Learned marks a song once you know it.']),
         ('Edit a score', ['Edit opens the score editor at the current bar; Practise returns to the Player.', 'Replace overwrites the note at the caret, Insert shifts the following notes, Chord adds a note to the chord there.', 'The palette holds note values, articulations, clefs, key and time signatures and barlines. The ⓘ beside a section explains it.', 'Transpose shifts the whole song, its key or its chords in a single step that Undo reverses.']),
         ('Play a MIDI keyboard', ['Connect a keyboard by USB or Bluetooth, then choose it with the MIDI button.', 'Settings › MIDI devices: MIDI input and output, local sound, the device the app listens to, octave shift and a MIDI log of incoming messages.', 'In Wait mode the Player listens for the notes you play; the Chord finder names the chord you hold.']),
         ('Keep time', ['Practice › Metronome. Set the tempo with − and +, the slider or Tap tempo.', 'Choose clicks, beeps or a drum pattern, and the time signature. The downbeat of each bar is accented.', 'Space starts and stops it; ↑ and ↓ change the tempo.'])]
GUIDEB = ''.join(f'<section style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><button type="button" aria-expanded="{{{{gOpen_{i}}}}}" onClick="{{{{gT_{i}}}}}" style="width: 100%; min-height: 56px; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left; display: flex; align-items: center; gap: 10px; padding: 8px 16px"><span style="flex: 1; font-size: 17px; font-weight: 600">{h}</span><span style="color: {SOFT}; display: flex; transform: {{{{gRot_{i}}}}}">{CHEV_D}</span></button>'
                 f'<sc-if value="{{{{gOpen_{i}}}}}" hint-placeholder-val="{{{{false}}}}"><div style="padding: 0 16px 14px; display: flex; flex-direction: column; gap: 8px">' + ''.join(f'<p style="margin: 0; font-size: 16px; line-height: 1.5; text-wrap: pretty; max-width: 65ch">{p}</p>' for p in ps) + '</div></sc-if></section>' for i, (h, ps) in enumerate(GUIDE))
P_GUIDE = GUIDEB
P_REPORT = (f'<label style="display: flex; flex-direction: column; gap: 6px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Description</span><textarea aria-label="Description" rows="7" onInput="{{{{setRep}}}}" placeholder="What were you doing, and what happened?" style="border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 12px; font: inherit; font-size: 16px; line-height: 1.45; color: {INK}; resize: none; outline: none"></textarea></label>'
            + FOOT('Include what you were doing and what you expected. Reports are anonymous: they carry the app’s version and your device, never your songs.')
            + f'<div style="display: flex; margin-top: 4px"><button type="button" onClick="{{{{sendRep}}}}" aria-disabled="{{{{repEmpty}}}}" style="flex: 1; height: 50px; border: 0; border-radius: 25px; background: {{{{repBg}}}}; color: {{{{repInk}}}}; font: inherit; font-size: 16px; font-weight: 700">Send report</button></div>')
APPICON = f'<span style="flex: none; width: 64px; height: 64px; border-radius: 16px; background: {INK}; color: {ACCENT}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 36px">𝄞</span>'
P_ABOUT = (f'<div style="display: flex; align-items: center; gap: 16px; padding: 4px">{APPICON}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 20px; font-weight: 700">Piano Trainer</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">Version 3.8.0 (2026.11.10)</span></span></div>'
           + SEC(CAPS('Software update'), BOXG(f'<div style="min-height: 52px; display: flex; align-items: center; gap: 10px; padding: 6px 16px">{DOT("{{updDot}}")}<span style="flex: 1; font-size: 16px">{{{{updT}}}}</span></div>',
                                                f'<button type="button" onClick="{{{{updGo}}}}" style="min-height: 52px; width: 100%; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600; text-align: left; padding: 6px 16px">{{{{updBtn}}}}</button>'))
           + SEC(GROUP(('val', 'Licence', 'All rights reserved'), bg=SHEET))
           + SEC(CAPS('Legal'), GROUP(('link', 'Privacy Policy', '', 'Legal.dc.html'), ('link', 'Terms of Service', '', 'Legal.dc.html'), bg=SHEET))
           + SEC(CAPS('Acknowledgements'), GROUP(*[('val', a, b) for a, b in [('Music engraving', 'Verovio'), ('The 3D piano', 'three.js'), ('The hands at the keys', 'WebXR generic hand'), ('Piano samples', 'Salamander Grand Piano'), ('Offline piano samples', 'Splendid Grand Piano'), ('Drum samples', 'Virtuosity Drums'), ('Electric bass samples', 'Growlybass'), ('Double bass samples', 'Meatbass'), ('Text and music fonts', 'Noto'), ('The method the lessons follow', '«Боже, спасибо»'), ('The Studies', 'Public domain')]], bg=SHEET)))

PAGES = [('Account', P_ACCOUNT), ('Edit profile', P_EDITPROFILE), ('Change password', P_PASSWORD), ('Privacy', P_PRIVACY), ('General', P_GENERAL), ('Storage and backup', P_STORAGE), ('On-screen piano', P_PIANO),
         ('MIDI devices', P_MIDI), ('MIDI log', P_LOG), ('Calibrate timing', P_TIMING), ('Selection toolbar', P_TOOLBAR), ('Swipe actions', P_SWIPE), ('User guide', P_GUIDE), ('Report a problem', P_REPORT), ('About', P_ABOUT)]
SLUG = lambda p: p.replace(' ', '_')
PARENT = {'Edit profile': 'Account', 'Change password': 'Account', 'Privacy': 'Account', 'MIDI log': 'MIDI devices', 'Calibrate timing': 'MIDI devices'}
def PAGEBODIES(pre, lap=False):
    out = []
    for p, body in PAGES:
        b = body.replace('aspect-ratio: 0.72', 'aspect-ratio: 1.4').replace('SignIn.dc.html', 'SignInLaptop.dc.html').replace('Legal.dc.html', 'LegalLaptop.dc.html') if lap else body
        out.append(f'<sc-if value="{{{{{pre}{SLUG(p)}}}}}" hint-placeholder-val="{{{{{"true" if (lap and p == "General") else "false"}}}}}">{b}</sc-if>')
    return ''.join(out)

SETTINGS_JS = js('const GROUPS = ' + json.dumps(SETGROUPS, ensure_ascii=False) + ', ICONS = ' + json.dumps({k: {'c': v[0], 'u': SQURI(v[1])} for k, v in IC.items()}) + ', PAGES = ' + json.dumps([p for p, _ in PAGES]) + ', PARENT = ' + json.dumps(PARENT) + ', PICS = ' + json.dumps([g if len(g) < 3 else '♪' for n, g in PICS], ensure_ascii=False)
                 + ', ACTS = ' + json.dumps(list(ACTIC)) + ', ACTIC = ' + json.dumps({k: SQURI(v[v.index('>') + 1:v.rindex('</svg>')]).replace('%23FFFFFF', '%23332921').replace('FFFFFF', '332921') for k, v in ACTIC.items()}) + ';\n' + r'''
    const v = {}, S = (o) => set(o);
    const page = st.page ?? null, cur = page || 'General', top = PARENT[cur] || cur;
    const signedIn = !st.out, prev = !!st.prev;
    // switches
    const tog = (k, def) => { const on = st[k] ?? def; v[k + 'On'] = on; v[k + 'OnBg'] = on ? '#44684A' : '#DAD1C8'; v[k + 'OnX'] = on ? 22 : 2; v[k + 'T'] = () => S({ [k]: !on }); return on; };
    ['prot', 'chord', 'hl', 'ckb', 'mout', 'mplay', 'show'].forEach((k) => tog(k, k === 'prot' || k === 'chord' || k === 'show' || k === 'mplay'));
    tog('pos', false); const minOn = tog('min', true); v.minOff = !minOn;
    v.prevOn = prev; v.prevOnBg = prev ? '#44684A' : '#DAD1C8'; v.prevOnX = prev ? 22 : 2; v.prevT = () => S({ prev: !prev });
    // ⓘ tips
    ['prev', 'sync', 'priv', 'store', 'offl', 'ckb', 'dev'].forEach((k) => { v['tipOn_' + k] = st.tip === k; v['tip_' + k] = () => S({ tip: st.tip === k ? null : k }); });
    // pages
    PAGES.forEach((p) => { const s = p.replace(/ /g, '_'); v['p_' + s] = page === p; v['l_' + s] = cur === p; v['go_' + s] = () => S({ page: p, tip: null }); });
    const rows = (hl) => GROUPS.map(([h, rs]) => ({ h, rs: rs.map(([l, val]) => ({ l, v: l === 'General' ? (st.theme ?? 'Match system') : l === 'MIDI devices' ? (minOn ? 'Roland FP-30X' : 'Off') : l === 'About' ? (st.upd === 'avail' ? 'Update available' : 'Up to date') : val, ic: ICONS[l].u, icc: ICONS[l].c, bg: hl && l === top ? '#E8E1D8' : 'transparent', fw: hl && l === top ? 600 : 400, open: () => S({ page: l, tip: null }) })) }));
    const theme = st.theme ?? 'Match system', lang = st.lang ?? 'English';
    const themes = ['Match system', 'Light', 'Dark'].map((t) => ({ t, on: t === theme, ring: t === theme ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', pick: () => S({ theme: t }), top: t === 'Dark' ? '#2A231E' : '#F7F3EE', bot: t === 'Light' ? '#F7F3EE' : '#2A231E', card: t === 'Dark' ? '#3A312A' : '#FEFDFB' }));
    const langs = ['English', 'Русский'].map((l) => ({ l, on: l === lang, ring: l === lang ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', fw: l === lang ? 700 : 500, pick: () => S({ lang: l }) }));
    // account and sync
    const pic = st.pic ?? -1;
    Object.assign(v, { signedIn, signedOut: !signedIn, editorial: !prev, admin: signedIn && !prev, name: 'Ana Popescu', avatar: pic >= 0 ? PICS[pic] : 'A', privV: (st.show ?? true) ? 'Profile shown' : 'Profile hidden',
      byName: (st.show ?? true) ? 'Ana Popescu' : 'Piano Trainer learner', byInit: (st.show ?? true) ? 'A' : '·', signInHref: 'SignIn.dc.html', createHref: 'SignIn.dc.html',
      syncT: st.syncing ? 'Syncing…' : 'Up to date', syncDot: st.syncing ? '#C9A227' : '#44684A', synced: st.synced ?? '2 min ago', pending: st.syncing ? '3' : '0', syncBtn: st.syncing ? 'Syncing…' : 'Sync now',
      syncNow: () => { if (st.syncing) return; S({ syncing: true }); setTimeout(() => S({ syncing: false, synced: 'just now' }), 1400); } });
    for (let i = 0; i < PICS.length; i++) { v['pickPic_' + i] = () => S({ pic: i }); v['picRing_' + i] = pic === i ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8'; }
    Object.assign(v, { openPhoto: () => S({ sheet: 'photo' }), photoOn: st.sheet === 'photo', removePhoto: () => S({ pic: -1, sheet: null }), newEmailOn: !!st.newEmail, toggleNewEmail: () => S({ newEmail: !st.newEmail }), linkSent: !!st.linkSent, sendLink: () => S({ linkSent: true }),
      saveT: st.saving ? 'Saving…' : 'Save changes', saveProfile: () => { S({ saving: true }); setTimeout(() => S({ saving: false, toast: 'Profile saved.' }), 700); },
      pw3V: st.pwBad ? 'a longer phrse' : 'a longer phrase', pwErr: !!st.pwErr, updatePw: () => st.pwBad ? S({ pwErr: true }) : S({ toast: 'Password updated.', page: 'Account' }) });
    ['pw1', 'pw2', 'pw3'].forEach((k) => { v[k + 'Type'] = st[k] ? 'text' : 'password'; v[k + 'EyeL'] = st[k] ? 'Hide password' : 'Show password'; v[k + 'Eye'] = () => S({ [k]: !st[k] }); });
    // dialogs
    Object.assign(v, { askSignOut: () => S({ sheet: 'signout' }), signoutOn: st.sheet === 'signout', doSignOut: () => S({ out: true, sheet: null, prev: false, page: page ? 'Account' : null }),
      askDelete: () => S({ sheet: 'delete', delTyped: '' }), deleteOn: st.sheet === 'delete', setDel: (e) => S({ delTyped: e.target.value }), delNot: (st.delTyped ?? '') !== 'DELETE',
      delBg: (st.delTyped ?? '') === 'DELETE' ? '#B3261E' : '#EEE9E2', delInk: (st.delTyped ?? '') === 'DELETE' ? '#FFFFFF' : '#9A9089', doDelete: () => { if ((st.delTyped ?? '') === 'DELETE') S({ sheet: null, out: true, toast: 'Your account will be deleted on 11 December 2026.' }); },
      askReset: () => S({ sheet: 'reset' }), resetOn: st.sheet === 'reset', doReset: () => S({ sheet: null, toast: 'Progress reset on this device.' }),
      askRemove: () => S({ sheet: 'remove' }), removeOn: st.sheet === 'remove', doRemove: () => S({ sheet: null, off: 0 }),
      askRestore: () => S({ sheet: 'restore' }), restoreOn: st.sheet === 'restore', doRestore: () => S({ sheet: null, toast: 'Restoring… the app will restart.' }),
      saveBackup: () => S({ toast: 'Backup saved: piano-trainer-2026-11-11.json' }) });
    // offline piano
    const off = st.off ?? 54, dl = st.dl ?? false;
    Object.assign(v, { offT: dl ? 'Downloading… ' + Math.round(off / 88 * 100) + '%' : off >= 88 ? 'Available offline' : off ? 'Partly downloaded' : 'Not downloaded', offN: off + ' of 88 downloaded', offW: Math.round(off / 88 * 100) + '%', offCan: off < 88 && !dl,
      download: () => { S({ dl: true, off: 62 }); setTimeout(() => S({ off: 76 }), 600); setTimeout(() => S({ dl: false, off: 88 }), 1300); } });
    // on-screen piano
    const nn = st.nn ?? 'On every C';
    Object.assign(v, { keySize: seg(['Fit to music', 'Large', 'All keys'], st.ks ?? 'Fit to music', (x) => S({ ks: x })), noteNames: seg(['On every C', 'On every key', 'Hidden'], nn, (x) => S({ nn: x })), nnC: nn === 'On every C', nnEvery: nn === 'On every key', nnHidden: nn === 'Hidden',
      pedals: seg(['Sustain only', 'All three'], st.ped ?? 'Sustain only', (x) => S({ ped: x })), swipeG: seg(['Scroll', 'Glissando'], st.sg ?? 'Scroll', (x) => S({ sg: x })), place: seg(['Bottom', 'Top'], st.pl ?? 'Bottom', (x) => S({ pl: x })),
      openShort: () => S({ sheet: 'short' }), shortOn: st.sheet === 'short' });
    // MIDI
    const oct = st.oct ?? 0, lat = st.lat ?? 18;
    Object.assign(v, { oct: (oct > 0 ? '+' : '') + oct, octDn: () => S({ oct: Math.max(-3, oct - 1) }), octUp: () => S({ oct: Math.min(3, oct + 1) }), touch: seg(['Light', 'Normal', 'Heavy'], st.touch ?? 'Normal', (x) => S({ touch: x })), pedal: seg(['Normal', 'Reversed'], st.pdl ?? 'Normal', (x) => S({ pdl: x })),
      latV: lat + ' ms', openBt: () => S({ sheet: 'bt' }), btOn: st.sheet === 'bt' });
    const LOG = [['14:02:11', 'Note on E4', 'Velocity 72 · Channel 1'], ['14:02:11', 'Note on C4', 'Velocity 68 · Channel 1'], ['14:02:11', 'Sustain down', 'Controller 64 · Channel 1'], ['14:02:12', 'Note off E4', 'Velocity 0 · Channel 1'], ['14:02:12', 'Note off C4', 'Velocity 0 · Channel 1'], ['14:02:12', 'Sustain up', 'Controller 64 · Channel 1'], ['14:02:13', 'Note on G4', 'Velocity 80 · Channel 1']];
    const cleared = !!st.cleared;
    Object.assign(v, { log: cleared ? [] : LOG.slice().reverse().map(([t, a, b]) => ({ t, a, b })), logAny: !cleared, logNone: cleared, logN: (cleared ? 0 : 214) + ' messages', logPaused: !!st.paused, pauseT: st.paused ? 'Resume' : 'Pause', pauseLog: () => S({ paused: !st.paused }), clearLog: () => S({ cleared: true }) });
    const cal = st.cal ?? 'idle', clk = st.clk ?? 0;
    Object.assign(v, { clicks: Array.from({ length: 8 }, (_, i) => ({ bg: cal === 'done' || i < clk ? '#44684A' : (cal === 'run' && i === clk ? '#F2B33D' : '#EEE9E2') })),
      calT: cal === 'run' ? (clk < 2 ? 'Count-in: ' + (clk + 1) : 'Click ' + (clk - 1) + ' of 6') : cal === 'done' ? 'Your piano is heard 21 ms late' : 'Play a key with each click',
      calS: cal === 'done' ? 'The app now hears your playing 21 ms earlier, so a note in time counts as in time.' : 'Press Start, then play any key on your MIDI keyboard each time you hear a click. Eight clicks, the first two a count-in.',
      calA: cal === 'run' ? 'Click ' + (clk + 1) + ' of 8' : 'Eight clicks', calBtn: cal === 'run' ? 'Stop' : cal === 'done' ? 'Measure again' : 'Start',
      calGo: () => { if (cal === 'run') { S({ cal: 'idle', clk: 0 }); return; } S({ cal: 'run', clk: 0 }); for (let i = 1; i <= 8; i++) setTimeout(() => S(i === 8 ? { cal: 'done', clk: 8, lat: 21 } : { clk: i }), i * 380); } });
    // selection toolbar
    const tb = st.tb ?? ['Favourite', 'Move', 'Archive', 'Delete'], full = tb.length >= 4;
    Object.assign(v, { tbOn: tb.map((l) => ({ l, ic: ACTIC[l], ink: '#332921', rm: () => S({ tb: tb.filter((x) => x !== l) }) })), tbOff: ACTS.filter((a) => !tb.includes(a)).map((l) => ({ l, full, op: full ? 0.4 : 1, ink: full ? '#9A9089' : '#332921', add: () => { if (!full) S({ tb: [...tb, l] }); } })),
      tbFull: full, tbReset: () => S({ tb: null }) });
    // swipe actions
    const kind = st.swk ?? 'Songs', SW = st.sw ?? { Songs: { R1: 'Favourite', R2: 'No action', L1: 'Archive', L2: 'Delete' }, Folders: { R1: 'Favourite', R2: 'No action', L1: 'Delete', L2: 'No action' } };
    const sw = SW[kind], CLR = { Favourite: '#C26A2E', Move: '#5B8DB8', Archive: '#8C7AB8', Delete: '#B3261E', Edit: '#44684A', Export: '#5B8DB8', 'No action': '#DAD1C8' };
    const slot = st.swSlot;
    Object.assign(v, { swKind: seg(['Songs', 'Folders'], kind, (x) => S({ swk: x })), swR1: sw.R1, swR2: sw.R2, swL1: sw.L1, swL2: sw.L2, swBg: CLR[sw.R1], swL: sw.R1 === 'No action' ? '' : sw.R1, swName: kind === 'Songs' ? 'Amazing Grace' : 'Hymns', swSub: kind === 'Songs' ? 'John Newton' : '12 songs',
      pickR1: () => S({ sheet: 'sw', swSlot: 'R1' }), pickR2: () => S({ sheet: 'sw', swSlot: 'R2' }), pickL1: () => S({ sheet: 'sw', swSlot: 'L1' }), pickL2: () => S({ sheet: 'sw', swSlot: 'L2' }), swOn: st.sheet === 'sw',
      swTitle: slot ? (slot[0] === 'R' ? 'Leading swipe' : 'Trailing swipe') : '',
      swOpts: ['No action', 'Favourite', 'Move', 'Edit', 'Export', 'Archive', 'Delete'].map((l) => ({ l, on: slot ? sw[slot] === l : false, pick: () => S({ sw: { ...SW, [kind]: { ...sw, [slot]: l } }, sheet: null }) })) });
    // guide
    for (let i = 0; i < 6; i++) { const o = (st.g ?? 0) === i; v['gOpen_' + i] = o; v['gRot_' + i] = o ? 'rotate(180deg)' : 'none'; v['gT_' + i] = () => S({ g: o ? -1 : i }); }
    // report
    const rep = st.rep ?? '';
    Object.assign(v, { setRep: (e) => S({ rep: e.target.value }), repEmpty: !rep.trim(), repBg: rep.trim() ? '#F2B33D' : '#EEE9E2', repInk: rep.trim() ? '#332921' : '#9A9089', sendRep: () => { if (rep.trim()) S({ rep: '', toast: 'Report sent. Thank you.' }); } });
    // about
    const upd = st.upd ?? 'ok';
    Object.assign(v, { updT: { ok: 'Up to date', check: 'Checking…', avail: 'Update available: 3.8.1', inst: 'Restarting…' }[upd], updDot: upd === 'avail' ? '#F2B33D' : upd === 'check' || upd === 'inst' ? '#C9A227' : '#44684A',
      updBtn: upd === 'avail' ? 'Install and restart' : upd === 'check' ? 'Checking…' : 'Check for updates', updGo: () => { if (upd === 'ok') { S({ upd: 'check' }); setTimeout(() => S({ upd: 'avail' }), 900); } else if (upd === 'avail') { S({ upd: 'inst' }); setTimeout(() => S({ upd: 'ok' }), 1200); } },
      privHref: 'Legal.dc.html', termsHref: 'Legal.dc.html' });
    // toast
    v.toastOn = !!st.toast; v.toastT = st.toast || ''; if (st.toast && this._tt !== st.toast) { this._tt = st.toast; const t = st.toast; setTimeout(() => { if ((this.state || {}).toast === t) S({ toast: null }); this._tt = null; }, 2600); }
    return { ...common(st, set), ...v, groups: rows(false), groupsL: rows(true), isList: !page, isPage: !!page, pageT: page || '', lapT: cur, lapBack: !!PARENT[cur], lapBackT: PARENT[cur] || '',
      back: () => S({ page: PARENT[page] || null, tip: null }), themes, langs, closeSheet: () => S({ sheet: null }), exitPrev: () => S({ prev: false }) };''')

# the account card at the top of the list: signed in, or a guest's Sign in
ACCT2 = (f'<sc-if value="{{{{signedIn}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{go_Account}}}}" style="width: 100%; border: 0; display: flex; align-items: center; gap: 16px; padding: 12px 12px 12px 16px; border-radius: 14px; background: {{{{acctBg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; text-align: left">{AVA(52, 24)}'
         f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">{{{{name}}}}</span><span style="font-size: 14px; color: {SOFT}">ana@example.com</span><span style="font-size: 13px; color: {GREEN}; display: flex; align-items: center; gap: 4px">{DOT("{{syncDot}}")}{{{{syncLine}}}}</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></button></sc-if>'
         f'<sc-if value="{{{{signedOut}}}}" hint-placeholder-val="{{{{false}}}}"><a href="SignIn.dc.html" style="display: flex; align-items: center; gap: 16px; padding: 12px 12px 12px 16px; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; text-decoration: none"><span style="flex: none; width: 52px; height: 52px; border-radius: 26px; background: {FILL}; display: flex; align-items: center; justify-content: center; color: {SOFT}">{CAM.replace("16", "22")}</span>'
         f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700; color: {LINK}">Sign in</span><span style="font-size: 14px; color: {SOFT}">Sync your library across your devices</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a></sc-if>')
ADMINGRP = lambda href: f'<sc-if value="{{{{admin}}}}" hint-placeholder-val="{{{{true}}}}">{SEC(CAPS("Administration"), GROUP(("link", "Administration", "2 reports", href), bg=SHEET))}</sc-if>'
PREVPILL = lambda pos: (f'<sc-if value="{{{{prevOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; {pos}; z-index: 55; height: 44px; padding: 0 4px 0 16px; border-radius: 22px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; box-shadow: {SHADOW}">'
                        f'Previewing as learner<button type="button" onClick="{{{{exitPrev}}}}" style="height: 36px; padding: 0 14px; border: 0; border-radius: 18px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 15px; font-weight: 700">Exit</button></div></sc-if>')
S9TOAST = f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; bottom: 40px; z-index: 56; min-height: 52px; border-radius: 14px; background: {INK}; color: {SHEET}; display: flex; align-items: center; padding: 4px 16px; font-size: 15px">{{{{toastT}}}}</div></sc-if>'
DELASK = (f'<sc-if value="{{{{deleteOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 70; background: rgba(51,41,33,.32)"></div><div role="alertdialog" aria-label="Delete your account?" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 71; width: 372px; max-width: calc(100% - 48px); box-sizing: border-box; border-radius: 20px; background: {PAGE}; padding: 20px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 10px">'
          f'<span style="font-size: 18px; font-weight: 700">Delete your account?</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}">Your account and everything it syncs are deleted after 30 days. Sign in before then to keep it. Songs on this device stay on it.</span>'
          f'<label style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 13px; font-weight: 600; color: {SOFT}">Type DELETE to confirm</span><input value="{{{{delTyped}}}}" onInput="{{{{setDel}}}}" aria-label="Type DELETE to confirm" autocomplete="off" style="height: 44px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font: inherit; font-size: 16px; letter-spacing: 0.06em; color: {INK}; outline: none"></label>'
          f'<div style="display: flex; gap: 8px; margin-top: 6px"><button type="button" onClick="{{{{closeSheet}}}}" style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Keep account</button>'
          f'<button type="button" onClick="{{{{doDelete}}}}" aria-disabled="{{{{delNot}}}}" style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: {{{{delBg}}}}; color: {{{{delInk}}}}; font: inherit; font-size: 16px; font-weight: 700">Delete</button></div></div></sc-if>')
S9ASKS = (ASK('signoutOn', 'Sign out?', 'Your songs and progress stay on this device and sync again when you sign in.', 'Sign out', 'doSignOut')
          + ASK('resetOn', 'Reset progress?', 'Learned steps, practised songs and quiz results on this device will be cleared.', 'Reset', 'doReset')
          + ASK('removeOn', 'Remove downloaded piano samples?', 'Offline, a lighter sampled piano plays until you download them again.', 'Remove', 'doRemove')
          + ASK('restoreOn', 'Restore this backup?', 'Everything on this device will be replaced with the backup from 8 November 2026. The app will then restart.', 'Restore', 'doRestore') + DELASK)
S9SHEETS = BSHEET('photoOn', 'Change photo', PHOTOBODY) + BSHEET('btOn', 'Connect a Bluetooth MIDI keyboard', BTBODY) + BSHEET('shortOn', 'Shortcuts', SHORTBODY) + BSHEET('swOn', '{{swTitle}}', SWPICK)
S9POPS = (POPOVER('photoOn', 'Change photo', PHOTOBODY, 'left: 760px; top: 160px', 420) + POPOVER('btOn', 'Connect a Bluetooth MIDI keyboard', BTBODY, 'left: 760px; top: 300px', 460)
          + POPOVER('shortOn', 'Shortcuts', SHORTBODY, 'left: 760px; top: 420px', 420) + POPOVER('swOn', '{{swTitle}}', SWPICK, 'left: 760px; top: 260px', 380))

s9ph = (f'<sc-if value="{{{{isList}}}}" hint-placeholder-val="{{{{true}}}}">{TOP("Profile.dc.html", "", "", "Profile")}{LARGE("Settings")}'
        f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 40px; display: flex; flex-direction: column; gap: 16px">{ACCT2}{SLIST("groups")}{ADMINGRP("Admin.dc.html")}</main></sc-if>'
        f'<sc-if value="{{{{isPage}}}}" hint-placeholder-val="{{{{false}}}}">{TOP("", "{{pageT}}", "", "Back", IB("Back", CHEV_L, "back"))}'
        f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 12px 16px 48px; display: flex; flex-direction: column; gap: 16px">{PAGEBODIES("p_")}</main></sc-if>'
        + PREVPILL('left: 50%; transform: translateX(-50%); bottom: 36px; white-space: nowrap') + S9TOAST + S9ASKS)
s9lm = (f'<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: 372px minmax(0, 1fr)"><nav aria-label="Settings" class="nos" style="min-height: 0; overflow-y: auto; padding: 24px 16px; box-shadow: 1px 0 0 {LINE}; display: flex; flex-direction: column; gap: 16px">'
        f'<h1 style="margin: 0 0 0 4px; font-size: 28px; font-weight: 700">Settings</h1>{ACCT2.replace("SignIn.dc.html", "SignInLaptop.dc.html")}{SLIST("groupsL")}{ADMINGRP("AdminLaptop.dc.html")}</nav>'
        f'<main class="nos" style="min-width: 0; min-height: 0; overflow-y: auto; padding: 24px 56px 48px; display: flex; justify-content: center"><div style="width: 704px; display: flex; flex-direction: column; gap: 16px">'
        f'<div style="display: flex; align-items: center; gap: 4px; min-height: 44px"><sc-if value="{{{{lapBack}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{back}}}}" style="height: 44px; margin-left: -12px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 2px">{CHEV_L}{{{{lapBackT}}}}</button></sc-if></div>'
        f'<h2 style="margin: -8px 0 6px; font-size: 26px; font-weight: 700">{{{{lapT}}}}</h2>{PAGEBODIES("l_", True)}</div></main></div>'
        + PREVPILL('left: 50%; transform: translateX(-50%); bottom: 28px; white-space: nowrap') + S9TOAST.replace('left: 16px; right: 16px; bottom: 40px', 'left: 50%; transform: translateX(-50%); width: 420px; bottom: 28px') + S9ASKS)
SETTINGS_JS = SETTINGS_JS.replace("return { ...common(st, set), ...v,", "v.acctBg = page === 'Account' || PARENT[cur] === 'Account' ? '#F2ECE4' : '#FEFDFB'; v.syncLine = st.syncing ? 'Syncing…' : 'Synced ' + (st.synced ?? '2 min ago');\n    return { ...common(st, set), ...v,")
detail('Settings', 'Settings', SETTINGS_JS, s9ph, s9lm, '', S9SHEETS, S9POPS, 'Profile')
print('r49 settings ok')
