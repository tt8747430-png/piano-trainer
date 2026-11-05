// One pass over the size matrix (references/testing.md): every route at every size, in both themes
// and both languages, saved as PNGs, and a line for each page wider than its screen.
//
//   node .claude/skills/owner-way/scripts/shots.mjs <base-url> <out-dir> <route> [route…]
//
// A real Chrome is used where one is installed; PLAYWRIGHT_CHROMIUM names another browser.
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const SIZES = [
  { name: 'iphone-app', width: 393, height: 852, touch: true },
  { name: 'iphone-safari', width: 393, height: 695, touch: true },
  { name: 'iphone-side', width: 852, height: 393, touch: true },
  { name: 'iphone-402', width: 402, height: 874, touch: true },
  { name: 'macbook-safari', width: 1710, height: 904, touch: false },
  { name: 'macbook-app', width: 1710, height: 984, touch: false },
]
const THEMES = ['light', 'dark']
const LANGUAGES = [
  { name: 'en', locale: 'en-GB' },
  { name: 'ru', locale: 'ru-RU' },
]

const [base, out, ...routes] = process.argv.slice(2)
if (!base || !out || routes.length === 0) {
  console.error('usage: shots.mjs <base-url> <out-dir> <route> [route…]')
  process.exit(2)
}
mkdirSync(out, { recursive: true })

// The app as a returning learner opens it, or the Welcome covers every shot.
const settingsVersion = Number(
  /SETTINGS_VERSION = (\d+)/.exec(
    readFileSync('src/entities/settings/model/store.ts', 'utf8'),
  )?.[1],
)

const executablePath = process.env.PLAYWRIGHT_CHROMIUM
const browser = await chromium.launch(executablePath ? { executablePath } : { channel: 'chrome' })
const problems = []
let shots = 0

for (const size of SIZES) {
  for (const theme of THEMES) {
    for (const language of LANGUAGES) {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        deviceScaleFactor: 2,
        hasTouch: size.touch,
        isMobile: size.touch,
        colorScheme: theme,
        locale: language.locale,
      })
      await context.addInitScript((version) => {
        if (!localStorage.getItem('pt-settings'))
          localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version }))
      }, settingsVersion)
      const page = await context.newPage()
      page.on('pageerror', (error) => problems.push(`${page.url()}: ${error.message}`))
      for (const route of routes) {
        await page.goto(new URL(route, base).href, { waitUntil: 'load' })
        await page.waitForTimeout(800)
        const slug = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'
        const label = `${slug}-${size.name}-${theme}-${language.name}`
        await page.screenshot({ path: join(out, `${label}.png`) })
        shots += 1
        const over = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        if (over > 0) problems.push(`${label}: ${over}px wider than the screen`)
      }
      await context.close()
    }
  }
}
await browser.close()

console.log(`${shots} screenshots in ${out}`)
for (const problem of new Set(problems)) console.log(`PROBLEM ${problem}`)
process.exitCode = problems.length > 0 ? 1 : 0
