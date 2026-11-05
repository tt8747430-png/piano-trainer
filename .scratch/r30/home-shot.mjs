import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const [out, theme = 'light'] = process.argv.slice(2)
const v = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts','utf8'))?.[1])
const pv = Number(/PROGRESS_VERSION = (\d+)/.exec(readFileSync('src/entities/progress/model/store.ts','utf8'))?.[1])
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const c = await b.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, colorScheme: theme })
await c.addInitScript(([v, pv]) => {
  localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version: v }))
  localStorage.setItem('pt-progress', JSON.stringify({ state: { practised: { amazing: new Date().toISOString(), silent: new Date(Date.now() - 864e5).toISOString() } }, version: pv }))
}, [v, pv])
const p = await c.newPage(); await p.goto('http://localhost:5191/songs'); await p.waitForTimeout(2500)
await p.screenshot({ path: out, fullPage: true }); await b.close()
