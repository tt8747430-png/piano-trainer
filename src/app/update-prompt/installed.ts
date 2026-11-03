/** How long a new version may take to download before a look gives up on it, in milliseconds. */
const INSTALL_WAIT = 30_000

/**
 * The version waiting to be taken, once it has downloaded: one still installing is waited for (a
 * look that finds it mid-download, an Update tapped meanwhile); null where none comes.
 */
export function installed(
  registration: ServiceWorkerRegistration,
  wait = INSTALL_WAIT,
): Promise<ServiceWorker | null> {
  if (registration.waiting) return Promise.resolve(registration.waiting)
  const installing = registration.installing
  if (!installing) return Promise.resolve(null)
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(registration.waiting), wait)
    const settle = () => {
      if (installing.state === 'installing') return
      clearTimeout(timer)
      installing.removeEventListener('statechange', settle)
      resolve(registration.waiting)
    }
    installing.addEventListener('statechange', settle)
  })
}
