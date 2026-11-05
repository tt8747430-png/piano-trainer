/** How long a new version may take to say it has taken over before the app reloads anyway. */
const TAKE_OVER_WAIT = 8_000

/** The waiting version as the take-over reads it. */
interface Waiting {
  readonly state: ServiceWorkerState
  postMessage(message: { type: 'SKIP_WAITING' }): void
  addEventListener(type: 'statechange', listener: () => void): void
}

/** The page's service worker container, which says when a new version controls the page. */
interface Container {
  addEventListener(type: 'controllerchange', listener: () => void): void
}

/**
 * Asks the waiting version to take over and reloads onto it, once: when it controls the page, when
 * it is active (a page no version controlled), when another tab took it first, or after `wait`
 * where the browser says none of these (a phone's app resumed mid-way can miss the events). With
 * none waiting the active version is already the new one, and a reload takes it.
 */
export function takeOver(
  { waiting }: { readonly waiting: Waiting | null },
  container: Container,
  reload: () => void,
  wait = TAKE_OVER_WAIT,
): void {
  if (!waiting) return reload()
  let done = false
  const once = () => {
    if (done) return
    done = true
    clearTimeout(timer)
    reload()
  }
  const timer = setTimeout(once, wait)
  container.addEventListener('controllerchange', once)
  waiting.addEventListener('statechange', () => {
    if (waiting.state === 'activated' || waiting.state === 'redundant') once()
  })
  waiting.postMessage({ type: 'SKIP_WAITING' })
}
