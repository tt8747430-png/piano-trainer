import type { UpdateFound } from '@/shared/lib/app-update'

/** How long the browser may take to fetch the service worker's script before a look fails. */
const LOOK_WAIT = 15_000

/** A worker as a look watches it: its state and when it changes. */
interface Watched {
  readonly state: ServiceWorkerState
  addEventListener(type: 'statechange', listener: () => void): void
  removeEventListener(type: 'statechange', listener: () => void): void
}

/** The parts of a service worker's registration a look reads. */
export interface Registration {
  readonly waiting: Watched | null
  readonly installing: Watched | null
  update(): Promise<unknown>
}

/**
 * Asks the browser for a new version and answers as soon as it knows: one waits, one is still
 * downloading (its end said by `onInstalled` or `onLost`, never waited for: a phone on a slow line
 * would hang the look), or none. A browser that never answers fails the look after `wait`.
 */
export async function lookFor(
  registration: Registration,
  { onInstalled, onLost }: { onInstalled: () => void; onLost: () => void },
  wait = LOOK_WAIT,
): Promise<UpdateFound> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('The look for a new version timed out')), wait)
  })
  try {
    await Promise.race([registration.update(), timeout])
  } finally {
    clearTimeout(timer)
  }
  if (registration.waiting) return 'ready'
  const installing = registration.installing
  if (!installing) return 'none'
  const settle = () => {
    if (installing.state === 'installing') return
    installing.removeEventListener('statechange', settle)
    if (installing.state === 'redundant') onLost()
    else onInstalled()
  }
  installing.addEventListener('statechange', settle)
  return 'downloading'
}
