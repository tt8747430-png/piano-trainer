/**
 * After a deploy, a tab opened on the build before asks for a screen's code by a file name the new build no
 * longer has, and the screen fails ("Failed to fetch dynamically imported module", the error reports of
 * 2026-11-05 and 11-25). Vite tells the page (`vite:preloadError`); the page loads itself again once, which
 * fetches the new build. A second failure within a minute is a real fault: it is left to throw and be reported.
 */
export const RELOADED_KEY = 'pt-reloaded-for-stale-code'
const ONCE_WITHIN_MS = 60_000

export interface StaleCodePage {
  addEventListener(type: 'vite:preloadError', listener: (event: Event) => void): void
  readonly sessionStorage: Pick<Storage, 'getItem' | 'setItem'>
  readonly location: Pick<Location, 'reload'>
}

export function reloadOnStaleCode(page: StaleCodePage, now: () => number = Date.now): void {
  page.addEventListener('vite:preloadError', (event) => {
    const last = Number(page.sessionStorage.getItem(RELOADED_KEY))
    if (Number.isFinite(last) && now() - last < ONCE_WITHIN_MS) return
    event.preventDefault()
    page.sessionStorage.setItem(RELOADED_KEY, String(now()))
    page.location.reload()
  })
}
