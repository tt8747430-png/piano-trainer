# R51: the account pages — Sign in, Create an account, Check your email, Forgotten password and
# its sent state, New password, the sign-in link (/auth/callback) working and failed — and Legal (Privacy Policy,
# Terms of Service), every string from src/shared/i18n/locales/en/account.ts and legal.ts. Exec'd by r41.py last.

GOOGLE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"></path><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"></path><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"></path><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"></path></svg>'
APPLE = f'<svg viewBox="0 0 24 24" width="20" height="20" fill="{INK}" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.6 4.6 0 0 0-3.6-2c-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.9a4.8 4.8 0 0 0-4 2.5c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4a10 10 0 0 0 1.3-2.7 4.2 4.2 0 0 1-2.3-3.9zM14 5.4A4.3 4.3 0 0 0 15 2.3a4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3 3.6 3.6 0 0 0 2.9-1.4z"></path></svg>'
SI_JS = js(r'''
    const S = (o) => set(o), v = st.view ?? 'in', email = st.email ?? 'ana@example.com', pw = st.pw ?? '', name = st.name ?? '';
    const okEmail = /.+@.+\..+/.test(email), okPw = pw.length >= 8;
    const err = st.err ?? '', fe = st.fe ?? '';
    const titles = { in: 'Sign in', create: 'Create an account', sent: 'Check your email', forgot: 'Forgotten password', forgotSent: 'Forgotten password', newpw: 'New password', saved: 'New password', working: 'Signing you in…', failed: 'Sign in' };
    const go = (view) => () => S({ view, err: '', fe: '', pw: '' });
    const submit = () => {
      if (!okEmail) return S({ fe: 'email', err: '' });
      if (!okPw) return S({ fe: 'pw', err: '' });
      if (pw === 'wrong password') return S({ fe: '', err: 'That email and password don’t match an account.' });
      S({ view: 'working', fe: '', err: '' }); setTimeout(() => S({ view: 'done' }), 1200);
    };
    const create = () => { if (!name.trim()) return S({ fe: 'name' }); if (!okEmail) return S({ fe: 'email' }); if (!okPw) return S({ fe: 'pw' }); S({ view: 'sent', fe: '' }); };
    const showPw = !!st.showPw;
    const states = [['Create an account', v === 'create', { view: 'create' }, { view: 'in' }], ['Check your email', v === 'sent', { view: 'sent' }, { view: 'in' }],
      ['Forgotten password', v === 'forgot', { view: 'forgot' }, { view: 'in' }], ['A reset link opened', v === 'newpw', { view: 'newpw' }, { view: 'in' }],
      ['A link that failed', v === 'failed', { view: 'failed' }, { view: 'in' }], ['Signing you in', v === 'working', { view: 'working' }, { view: 'in' }],
      ['A wrong password', !!err, { view: 'in', pw: 'wrong password', err: 'That email and password don’t match an account.' }, { err: '', pw: '' }], ['Offline', !!st.offline, { offline: true }, { offline: false }]]
      .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => S(on ? off : o) }));
    return { ...common(st, set), states, offline: !!st.offline,
      isIn: v === 'in', isCreate: v === 'create', isSent: v === 'sent', isForgot: v === 'forgot', isForgotSent: v === 'forgotSent', isNew: v === 'newpw', isSaved: v === 'saved', isWorking: v === 'working', isFailed: v === 'failed', isDone: v === 'done',
      isForm: ['in', 'create', 'forgot', 'newpw'].includes(v), title: titles[v] || 'Signed in', email, pw, name, pwType: showPw ? 'text' : 'password', eyeL: showPw ? 'Hide password' : 'Show password', eye: () => S({ showPw: !showPw }),
      setEmail: (e) => S({ email: e.target.value, fe: '' }), setPw: (e) => S({ pw: e.target.value, fe: '' }), setName: (e) => S({ name: e.target.value, fe: '' }),
      eEmail: fe === 'email', ePw: fe === 'pw', eName: fe === 'name', hasErr: !!err, err, emailRing: fe === 'email' ? '0 0 0 2px #B3261E' : '0 0 0 1px #DAD1C8', pwRing: fe === 'pw' ? '0 0 0 2px #B3261E' : '0 0 0 1px #DAD1C8', nameRing: fe === 'name' ? '0 0 0 2px #B3261E' : '0 0 0 1px #DAD1C8',
      submit: st.offline ? () => S({ err: 'You’re offline. Connect to the internet and try again.' }) : submit, create, goIn: go('in'), goCreate: go('create'), goForgot: go('forgot'), goNew: go('newpw'), goFailed: go('failed'),
      sendLink: () => okEmail ? S({ view: 'forgotSent', fe: '' }) : S({ fe: 'email' }), savePw: () => okPw ? S({ view: 'saved', fe: '' }) : S({ fe: 'pw' }),
      sentT: 'We sent a link to ' + email + '. Open it on this device to finish creating your account.', fsentT: 'If ' + email + ' has an account, a link to choose a new password is on its way.' };''')
INP = lambda label, val, on, ring, err_cond, err, typ='text', eye=False, note='': (
    f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{label}</span>'
    f'<span style="display: flex; align-items: center; border-radius: 12px; background: {SHEET}; box-shadow: {{{{{ring}}}}}; padding: 0 4px 0 16px"><input type="{typ}" value="{{{{{val}}}}}" onInput="{{{{{on}}}}}" aria-label="{label}" style="flex: 1; min-width: 0; height: 48px; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none">'
    + (f'<button type="button" aria-label="{{{{eyeL}}}}" onClick="{{{{eye}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{EYE}</button>' if eye else '') + '</span>'
    + (f'<span style="margin: 0 16px; font-size: 13px; color: {SOFT}">{note}</span>' if note else '')
    + f'<sc-if value="{{{{{err_cond}}}}}" hint-placeholder-val="{{{{false}}}}"><span role="alert" style="margin: 0 16px; font-size: 14px; color: {RED}">{err}</span></sc-if></label>')
EMAIL = INP('Email', 'email', 'setEmail', 'emailRing', 'eEmail', 'Enter an email address, like name@example.com.', 'email')
PW = INP('Password', 'pw', 'setPw', 'pwRing', 'ePw', 'Use at least 8 characters.', '{{pwType}}', True)
ERRBOX = f'<sc-if value="{{{{hasErr}}}}" hint-placeholder-val="{{{{false}}}}"><div role="alert" style="border-radius: 12px; background: #F6DEDA; color: #8C1D17; padding: 12px 16px; font-size: 15px; line-height: 1.4">{{{{err}}}}</div></sc-if>'
OFFBANNER = f'<sc-if value="{{{{offline}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="border-radius: 12px; background: {HONEY}; padding: 12px 16px; font-size: 15px">You’re offline. Signing in needs a connection.</div></sc-if>'
SSO = (f'<button type="button" style="height: 50px; border: 0; border-radius: 25px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px">{GOOGLE}Continue with Google</button>'
       f'<button type="button" aria-disabled="true" style="height: 50px; border: 0; border-radius: 25px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {SOFT}; font: inherit; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px; opacity: .6">{APPLE}Continue with Apple<span style="font-size: 13px; font-weight: 500">· Coming soon</span></button>'
       f'<div style="display: flex; align-items: center; gap: 12px; color: {SOFT}; font-size: 14px"><span style="flex: 1; height: 1px; background: {LINE}"></span>or<span style="flex: 1; height: 1px; background: {LINE}"></span></div>')
LINKB = lambda t, act: f'<button type="button" onClick="{{{{{act}}}}}" style="height: 44px; border: 0; background: transparent; padding: 0 4px; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">{t}</button>'
V_IN = (f'<sc-if value="{{{{isIn}}}}" hint-placeholder-val="{{{{true}}}}">{SSO}{EMAIL}{PW}<div style="display: flex; justify-content: flex-end; margin-top: -8px">{LINKB("Forgot password?", "goForgot")}</div>{ERRBOX}'
        f'<div style="display: flex">{BTN("Sign in", "submit", "", "primary", 50)}</div><div style="display: flex; align-items: center; justify-content: center; gap: 2px; font-size: 15px; color: {SOFT}">No account yet?{LINKB("Create an account", "goCreate")}</div></sc-if>')
V_CREATE = (f'<sc-if value="{{{{isCreate}}}}" hint-placeholder-val="{{{{false}}}}">{SSO}{INP("Your name", "name", "setName", "nameRing", "eName", "Enter your name.")}{EMAIL}'
            + INP('Password', 'pw', 'setPw', 'pwRing', 'ePw', 'Use at least 8 characters.', '{{pwType}}', True, 'At least 8 characters. A longer phrase is stronger than a short, clever one.') + ERRBOX
            + f'<div style="display: flex">{BTN("Create account", "create", "", "primary", 50)}</div><p style="margin: 0; text-align: center; font-size: 14px; line-height: 1.45; color: {SOFT}">Creating an account, you agree to the <a href="Legal.dc.html" style="color: {LINK}; font-weight: 600">Terms</a> and the <a href="Legal.dc.html" style="color: {LINK}; font-weight: 600">Privacy notice</a></p>'
            f'<div style="display: flex; align-items: center; justify-content: center; gap: 2px; font-size: 15px; color: {SOFT}">Already have an account?{LINKB("Sign in", "goIn")}</div></sc-if>')
MAILI = '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>'
DONEPAGE = lambda cond, icon, bg, head, body, btns: (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px 8px 8px; text-align: center"><span style="width: 76px; height: 76px; border-radius: 38px; background: {bg}; color: {INK}; display: flex; align-items: center; justify-content: center">{icon}</span>'
                                                      f'<span style="font-size: 22px; font-weight: 700">{head}</span><span style="font-size: 16px; line-height: 1.45; color: {SOFT}; max-width: 340px; text-wrap: pretty">{body}</span></div>{btns}</sc-if>')
V_SENT = DONEPAGE('isSent', MAILI, SKY, 'Check your email', '{{sentT}}', f'<div style="display: flex; justify-content: center">{LINKB("Back to sign in", "goIn")}</div>')
V_FORGOT = (f'<sc-if value="{{{{isForgot}}}}" hint-placeholder-val="{{{{false}}}}"><p style="margin: 0 4px; font-size: 16px; line-height: 1.45; color: {SOFT}">Enter your account’s email and we’ll send a link to choose a new password.</p>{EMAIL}'
            f'<div style="display: flex">{BTN("Send the link", "sendLink", "", "primary", 50)}</div><div style="display: flex; justify-content: center">{LINKB("Back to sign in", "goIn")}</div></sc-if>')
V_FSENT = DONEPAGE('isForgotSent', MAILI, SKY, 'Check your email', '{{fsentT}}', f'<div style="display: flex; justify-content: center">{LINKB("Back to sign in", "goIn")}</div>')
V_NEW = f'<sc-if value="{{{{isNew}}}}" hint-placeholder-val="{{{{false}}}}">{PW}<div style="display: flex">{BTN("Save password", "savePw", "", "primary", 50)}</div></sc-if>'
V_SAVED = DONEPAGE('isSaved', CHECKI.replace('20', '36'), SAGE, 'Your new password is saved.', 'You are signed in on this device.', f'<div style="display: flex">{BTN("Continue", "", "Settings.dc.html", "primary", 50)}</div>')
SPIN = f'<span style="width: 36px; height: 36px; border-radius: 18px; border: 4px solid {FILL}; border-top-color: {INK}; box-sizing: border-box; animation: spin 900ms linear infinite"></span><style>@keyframes spin {{ to {{ transform: rotate(360deg) }} }} @media (prefers-reduced-motion: reduce) {{ * {{ animation: none !important }} }}</style>'
V_WORK = DONEPAGE('isWorking', SPIN, FILL, 'Signing you in…', 'This takes a moment.', '')
V_FAIL = DONEPAGE('isFailed', '<span style="font-size: 34px; font-weight: 700">!</span>', '#F6DEDA', 'This link didn’t work', 'It may have expired or been used already. Sign in again, or ask for a new link.', f'<div style="display: flex">{BTN("Sign in again", "goIn", "", "primary", 50)}</div>')
V_DONE = DONEPAGE('isDone', CHECKI.replace('20', '36'), SAGE, 'You’re signed in', 'Your library syncs across your devices from now on.', f'<div style="display: flex">{BTN("Continue", "", "Settings.dc.html", "primary", 50)}</div>')
SIBODY = V_IN + V_CREATE + V_SENT + V_FORGOT + V_FSENT + V_NEW + V_SAVED + V_WORK + V_FAIL + V_DONE
# the demo's own switches, outside the drawn screen's flow: offline, and a failed sign-in link
# the phone's bar holds the page's name beside Close, as every page's (one bar shape; lines.mjs, an empty bar)
siph = (f'{TOP("", "{{title}}", "", "Close", CLOSEB("Settings.dc.html"))}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 48px; display: flex; flex-direction: column; gap: 16px">'
        f'{OFFBANNER}{SIBODY}</main>')
silm = (f'{LPAD(TOP("", "", "", "Close", CLOSEB("SettingsLaptop.dc.html")))}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; justify-content: center; padding: 8px 0 48px"><div style="width: 440px; display: flex; flex-direction: column; gap: 16px">'
        f'<span style="align-self: center; width: 64px; height: 64px; border-radius: 16px; background: {INK}; color: {ACCENT}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 36px">𝄞</span>'
        f'<sc-if value="{{{{isForm}}}}" hint-placeholder-val="{{{{true}}}}"><h1 style="margin: 0 0 -4px; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: -0.01em">{{{{title}}}}</h1></sc-if>{OFFBANNER}{SIBODY.replace("Settings.dc.html", "SettingsLaptop.dc.html").replace("Legal.dc.html", "LegalLaptop.dc.html")}</div></main>')
detail('SignIn', 'Sign in', SI_JS, SHOWSTATES() + siph, SHOWSTATES() + silm, '', '', '', 'Profile')

# ── Legal ──
_L = open('/home/user/piano-trainer/src/shared/i18n/locales/en/legal.ts').read()
import re as _re
def _secs(block):
    return [(h, t) for h, t in _re.findall(r"heading: '([^']*)',\s*text:\s*'([^']*)'", block)]
PRIV = _secs(_L[_L.index('\n  privacy: {'):_L.index('\n  terms: {')]); TERMS = _secs(_L[_L.index('\n  terms: {'):])
LEGAL_JS = js('const DOCS = ' + json.dumps({'Privacy Policy': PRIV, 'Terms of Service': TERMS}, ensure_ascii=False) + r''';
    const S = (o) => set(o), d = st.doc ?? 'Privacy Policy';
    return { ...common(st, set), docs: seg(['Privacy Policy', 'Terms of Service'], d, (x) => S({ doc: x })), docT: d, otherT: d === 'Privacy Policy' ? 'Terms of Service' : 'Privacy Policy', toOther: () => S({ doc: d === 'Privacy Policy' ? 'Terms of Service' : 'Privacy Policy' }), secs: DOCS[d].map(([h, t], i) => ({ h, t, id: 's' + i, href: '#s' + i, bg: i ? 'transparent' : 'var(--fill, #EEE9E2)', fw: i ? 400 : 600 })),
      states: [['Terms of Service', d === 'Terms of Service', { doc: 'Terms of Service' }, { doc: 'Privacy Policy' }]]
        .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => S(on ? off : o) })) };''')
SECS = (f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="8"><section id="{{{{s.id}}}}" style="display: flex; flex-direction: column; gap: 8px; scroll-margin-top: 16px"><h2 style="margin: 0; font-size: 20px; font-weight: 700">{{{{s.h}}}}</h2>'
        f'<p style="margin: 0; font-size: 16px; line-height: 1.55; max-width: 65ch; text-wrap: pretty">{{{{s.t}}}}</p></section></sc-for>')
LHEAD = f'<span style="font-size: 14px; color: {SOFT}">Last changed 4 November 2026</span>'
lgph = (f'{TOP("Settings.dc.html", "{{docT}}", "", "Settings")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 20px 48px; display: flex; flex-direction: column; gap: 20px">'
        f'{LHEAD}{SECS}{GROUP(("link", "{{otherT}}", "", "toOther"), bg=SHEET)}</main>')
# laptop (owner, 2026-11-17: "these empty spaces on the left under the sections should not be"): the bar's edge is the
# page's edge; the contents are a band of links at the top, and the text runs in two columns of a readable measure,
# as a printed policy, so no side column runs out and no band of the width is left bare
lglm = (f'{LTITLEBAR("{{docT}}", back="SettingsLaptop.dc.html")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 40px 56px 44px; display: flex; flex-direction: column; gap: 24px">'
        f'{LHEAD}'
        f'<nav aria-label="On this page" style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px"><span style="padding-right: 4px; font-size: 13px; font-weight: 600; color: {SOFT}">On this page</span>'
        f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="8"><a href="{{{{s.href}}}}" style="min-height: 40px; padding: 8px 12px; box-sizing: border-box; border-radius: 20px; background: {FILL}; color: {INK}; text-decoration: none; font-size: 14px; font-weight: 500; display: flex; align-items: center">{{{{s.h}}}}</a></sc-for></nav>'
        f'<div style="columns: 2; column-gap: 64px">{SECS.replace("scroll-margin-top: 16px", "scroll-margin-top: 16px; break-inside: avoid; margin-bottom: 24px")}</div><div style="width: 420px">{GROUP(("link", "{{otherT}}", "", "toOther"), bg=SHEET)}</div></main>')
detail('Legal', 'Legal', LEGAL_JS, SHOWSTATES() + lgph, SHOWSTATES() + lglm, '', '', '', 'Profile')
print('r51 account ok')
