// One pass over the size matrix (references/testing.md): every route at every size, in both themes
// and both languages, saved as PNGs; at the top, part way down and at the end of the page; with the
// phone's status bar and home indicator taken as the installed app has them; and checked by
// inspect.js for text cut off, things on top of each other, a layer over text, a band a dialog's
// backdrop leaves bare, and small targets.
//
//   node .claude/skills/owner-way/scripts/shots.mjs <base-url> <out-dir> <step> [step…]
//
// A step is a route, then any acts after " >> ": `click=<name>` taps the button, link, tab or
// option of that name; `scroll` shoots the page part way and at its end; `wait=<ms>`.
//   "/play/hot-cross-buns >> click=Original"   "/songs/folders/f1/settings >> click=Card style >> scroll"
// SIZES=iphone-app,macbook-safari THEMES=light LANGUAGES=en narrow the matrix while iterating;
// the whole matrix is the pass.
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const ALL_SIZES = [
  // The installed app on an iPhone: the status bar (59) and the home indicator (34) are the page's.
  { name: 'iphone-app', width: 393, height: 852, touch: true, insets: { top: 59, bottom: 34 }, standalone: true },
  { name: 'iphone-safari', width: 393, height: 695, touch: true },
  { name: 'iphone-side', width: 852, height: 393, touch: true, insets: { left: 59, right: 59, bottom: 21 }, standalone: true },
  { name: 'iphone-402', width: 402, height: 874, touch: true, insets: { top: 62, bottom: 34 }, standalone: true },
  { name: 'macbook-safari', width: 1710, height: 904, touch: false },
  { name: 'macbook-app', width: 1710, height: 984, touch: false },
]
const pick = (all, env) => (env ? all.filter((each) => env.split(',').includes(each.name ?? each)) : all)
const SIZES = pick(ALL_SIZES, process.env.SIZES)
const THEMES = pick(['light', 'dark'], process.env.THEMES)
const LANGUAGES = pick(
  [
    { name: 'en', locale: 'en-GB' },
    { name: 'ru', locale: 'ru-RU' },
  ],
  process.env.LANGUAGES,
)

const [base, out, ...steps] = process.argv.slice(2)
if (!base || !out || steps.length === 0) {
  console.error('usage: shots.mjs <base-url> <out-dir> <route [>> act …]> […]')
  process.exit(2)
}
mkdirSync(out, { recursive: true })
const inspect = readFileSync(new URL('./inspect.js', import.meta.url), 'utf8')

// The app as a returning learner opens it, or the Welcome covers every shot.
const settingsVersion = Number(
  /SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts', 'utf8'))?.[1],
)

const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium'
const browser = await chromium.launch({ executablePath })
const problems = []
let shots = 0

/** The element that scrolls the page: the document, or the tallest scroller in it. */
const scroller = () => {
  const all = [document.scrollingElement, ...document.querySelectorAll('*')].filter(
    (el) => el && el.scrollHeight > el.clientHeight + 40 && /(auto|scroll)/.test(getComputedStyle(el).overflowY + (el === document.scrollingElement ? 'auto' : '')),
  )
  return all.sort((a, b) => b.clientHeight - a.clientHeight)[0] ?? null
}

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
      await context.addInitScript(
        ([version, standalone]) => {
          if (!localStorage.getItem('pt-settings'))
            localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version }))
          if (standalone) Object.defineProperty(navigator, 'standalone', { get: () => true })
        },
        [settingsVersion, Boolean(size.standalone)],
      )
      const page = await context.newPage()
      if (size.insets) {
        const cdp = await context.newCDPSession(page)
        await cdp.send('Emulation.setSafeAreaInsetsOverride', {
          insets: { top: 0, bottom: 0, left: 0, right: 0, ...size.insets },
        })
      }
      page.on('pageerror', (error) => problems.push(`${page.url()}: ${error.message}`))
      for (const step of steps) {
        const [route, ...acts] = step.split(' >> ')
        await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' })
        // A score is engraved after the page loads: wait for its notes, as the learner does.
        await page
          .waitForFunction(() => !document.querySelector('[data-slot="score-skeleton"]') && (!document.querySelector('[data-slot="score"]') || document.querySelector('[data-slot="score"] svg g.note')), null, { timeout: 15000 })
          .catch(() => problems.push(`${route}: the score was not drawn within 15 s`))
        await page.waitForTimeout(900)
        const slug =
          step.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80) || 'home'
        const label = `${slug}-${size.name}-${theme}-${language.name}`
        const check = async (at) => {
          await page.screenshot({ path: join(out, `${label}${at}.png`) })
          shots += 1
          for (const line of await page.evaluate(`(${inspect})(${JSON.stringify(at === '-mid' ? 'mid' : at === '-end' ? 'end' : scrolls ? 'top' : 'only')})`)) problems.push(`${label}${at}: ${line}`)
        }
        let scrolls = false
        for (const act of acts) {
          const [kind, value] = act.split('=')
          if (kind === 'click') {
            const target = page
              .getByRole('button', { name: value, exact: true })
              .or(page.getByRole('link', { name: value, exact: true }))
              .or(page.getByRole('tab', { name: value, exact: true }))
              .or(page.getByRole('radio', { name: value, exact: true }))
              .or(page.getByRole('menuitem', { name: value, exact: true }))
              .first()
            await target.click({ timeout: 5000 }).catch((error) => problems.push(`${label}: no “${value}” to tap (${error.message.split('\n')[0]})`))
            await page.waitForTimeout(600)
          } else if (kind === 'wait') await page.waitForTimeout(Number(value))
          else if (kind === 'scroll') scrolls = true
        }
        await check('')
        if (scrolls) {
          for (const [at, part] of [['-mid', 0.5], ['-end', 1]]) {
            await page.evaluate(
              ([find, part]) => {
                const el = eval(`(${find})`)()
                if (el) el.scrollTop = (el.scrollHeight - el.clientHeight) * part
              },
              [scroller.toString(), part],
            )
            await page.waitForTimeout(400)
            await check(at)
          }
        }
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
