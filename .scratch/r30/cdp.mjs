import { chromium } from '@playwright/test'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const c = await b.newContext({ viewport: { width: 393, height: 852 } })
const p = await c.newPage()
const s = await c.newCDPSession(p)
console.log(await b.version())
try { await s.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 59, bottom: 34, left: 0, right: 0 } }); console.log('safe ok') } catch (e) { console.log('safe no', e.message) }
try { await s.send('Emulation.setEmulatedMedia', { features: [{ name: 'display-mode', value: 'standalone' }] }); console.log('dm ok') } catch (e) { console.log('dm no', e.message) }
await p.setContent('<style>div{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}</style><div id=d>x</div>')
console.log(await p.evaluate(() => [getComputedStyle(d).paddingTop, getComputedStyle(d).paddingBottom, matchMedia('(display-mode: standalone)').matches]))
await b.close()
