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
