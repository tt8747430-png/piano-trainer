// A page is shot only once it has fully loaded (the owner, 2026-11-05: "don't make screenshots before the page
// is fully load anymore"). Every capture script, the app's and a reference site's, waits on this before a
// screenshot: the load event, the network quiet, the fonts ready, every image decoded, no busy region or
// spinner left, and the layout still for two frames running. A part that never settles is reported, never
// shot past in silence.

/** What still shows a page at work: a busy region, a spinner, a skeleton or a loading line. */
const BUSY =
  '[aria-busy="true"], [role="progressbar"]:not([aria-valuenow]), [data-slot="score-skeleton"], [class*="skeleton" i], [class*="spinner" i], [class*="loading" i]:not(html):not(body)'

/**
 * Waits until the page has fully loaded. Returns the parts that did not settle within `timeout` (empty when
 * all did), so the caller can report them instead of shooting a half-drawn page.
 */
export async function settle(page, { timeout = 30000 } = {}) {
  const late = []
  const step = (name, wait) => wait.catch(() => late.push(name))
  await step('load', page.waitForLoadState('load', { timeout }))
  await step('network', page.waitForLoadState('networkidle', { timeout }))
  await step('fonts', page.evaluate(() => document.fonts.ready.then(() => true)))
  await step(
    'images',
    page.waitForFunction(
      () => [...document.images].every((image) => image.complete && (image.naturalWidth > 0 || !image.src)),
      null,
      { timeout },
    ),
  )
  await step(
    'busy',
    page.waitForFunction(
      (selector) =>
        [...document.querySelectorAll(selector)].every((element) => {
          const box = element.getBoundingClientRect()
          return box.width === 0 || box.height === 0 || getComputedStyle(element).visibility === 'hidden'
        }),
      BUSY,
      { timeout },
    ),
  )
  // The layout still: the document's size and the first screenful unchanged across two frames.
  await step(
    'layout',
    page.waitForFunction(
      () =>
        new Promise((resolve) => {
          const size = () => `${document.documentElement.scrollWidth}x${document.documentElement.scrollHeight}`
          const before = size()
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(size() === before)))
        }),
      null,
      { timeout, polling: 250 },
    ),
  )
  return late
}

/**
 * What only greets or interrupts, never what a shot is of (the owner, 2026-11-05: "never make unintended images of
 * such things as this sign in popups or tours, only when you explicitly need this"): the app's welcome, a sign-in or
 * sign-up prompt, a product tour, a cookie or newsletter banner. Each is dismissed by its own way out, the gentlest
 * first (skip, not now, close), never by signing in or agreeing to more than the essentials.
 */
const WAYS_OUT = [
  /^skip( the)? tour$/i,
  /^skip$/i,
  /^not now$/i,
  /^maybe later$/i,
  /^no,? thanks$/i,
  /^start playing$/i,
  /^начать$/i,
  /^got it$/i,
  /^ok,? got it$/i,
  /^reject( all)?$/i,
  /^only (necessary|essential)( cookies)?$/i,
  /^accept( all)?( cookies)?$/i,
  /^close$/i,
  /^закрыть$/i,
  /^dismiss$/i,
]
/** Where such things sit: a dialog, a banner, a tour's popover, a fixed layer over the page. */
const INTERRUPTIONS =
  '[role="dialog"], [role="alertdialog"], [aria-modal="true"], [class*="tour" i], [class*="cookie" i], [class*="consent" i], [class*="banner" i], [class*="onboard" i], [id*="cookie" i], [id*="consent" i]'

/**
 * Clears every greeting and interruption on the page, unless `ONBOARDING=1` asks to keep them (a check of the
 * welcome or a tour itself). Returns what it dismissed, so the caller can say so; a layer it could not dismiss is
 * left for the caller to report.
 */
export async function clearOnboarding(page, { rounds = 6 } = {}) {
  if (process.env.ONBOARDING === '1') return []
  const dismissed = []
  for (let round = 0; round < rounds; round += 1) {
    const way = await page.evaluate(
      ([selector, patterns]) => {
        const regexes = patterns.map(([source, flags]) => new RegExp(source, flags))
        const visible = (element) => {
          const box = element.getBoundingClientRect()
          return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden'
        }
        const layers = [...document.querySelectorAll(selector)].filter(visible)
        for (const regex of regexes)
          for (const layer of layers)
            for (const control of layer.querySelectorAll('button, [role="button"], a')) {
              const name = (control.getAttribute('aria-label') || control.textContent || '').trim()
              if (visible(control) && regex.test(name)) {
                control.setAttribute('data-way-out', 'true')
                return name
              }
            }
        return null
      },
      [INTERRUPTIONS, WAYS_OUT.map((regex) => [regex.source, regex.flags])],
    )
    if (!way) break
    await page.locator('[data-way-out="true"]').first().click({ timeout: 3000 }).catch(() => {})
    await page.evaluate(() => document.querySelector('[data-way-out]')?.removeAttribute('data-way-out'))
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
    dismissed.push(way)
  }
  if (dismissed.length < rounds) await page.keyboard.press('Escape').catch(() => {})
  return dismissed
}
