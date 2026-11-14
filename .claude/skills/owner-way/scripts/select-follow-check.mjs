// The chord Play started from lets go of its ring; the selection follows the sounding chord and stays on the last on Stop.
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { settle, clearOnboarding } from './settle.mjs'
const [base, seedFile, out] = process.argv.slice(2)
const seed = JSON.parse(readFileSync(seedFile, 'utf8'))
const version = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('/home/user/piano-trainer/src/entities/settings/model/store.ts', 'utf8'))[1])
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] })
const ctx = await browser.newContext({ viewport: { width: 402, height: 874 } })
await ctx.addInitScript(([s, v]) => { for (const [k, val] of Object.entries(s)) localStorage.setItem(k, val); localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version: v })) }, [seed, version])
const page = await ctx.newPage()
await page.goto(`${base}/practice/chord-player?sheet=sheet-1`)
await settle(page); await clearOnboarding(page)
const state = async () => page.evaluate(() => ({
  rings: [...document.querySelectorAll('[aria-pressed="true"]')].map((e) => e.textContent.trim()).filter((t) => t.length < 12),
  lit: [...document.querySelectorAll('[aria-current="true"]')].map((e) => e.textContent.trim()),
}))
await page.locator('[aria-pressed]').filter({ hasText: /^D/ }).first().click()
await page.waitForTimeout(400)
console.log('picked D7:', JSON.stringify(await state()))
await page.locator('button[aria-label="Play"]').last().click()
for (let i = 0; i < 5; i++) { await page.waitForTimeout(700); console.log('playing:', JSON.stringify(await state())) }
await page.screenshot({ path: `${out}/follow-playing.png` })
await page.locator('button[aria-label="Stop"]').last().click()
await page.waitForTimeout(500)
console.log('stopped:', JSON.stringify(await state()))
await page.screenshot({ path: `${out}/follow-stopped.png` })
await browser.close()
