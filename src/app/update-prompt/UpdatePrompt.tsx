import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useAppUpdate } from '@/shared/lib/app-update'
import { checkOnReturn } from './check-on-return'
import { installed } from './installed'
import { UpdateBanner } from './UpdateBanner'

/**
 * Registers the service worker once the page has loaded, so its precache never competes with the
 * first screen, and looks for a new version whenever the app comes back to the screen. A waiting
 * version is offered where `offer` allows. Taking it reloads every open tab onto it (the old
 * version's files leave with the old worker, so no tab can stay on it), but a tab where `offer` is
 * off (the Player, the Check) reloads only once the learner leaves that screen: a practice in
 * another tab is never cut off.
 */
export function UpdatePrompt({
  offer,
  reload = () => window.location.reload(),
}: {
  offer: boolean
  reload?: () => void
}) {
  const [reloadDue, setReloadDue] = useState(false)
  // Later hides the banner until the app next comes back to the screen; the version still waits,
  // and Settings' Version row still offers it.
  const [later, setLater] = useState(false)
  const { status, update } = useAppUpdate()
  const {
    needRefresh: [needRefresh],
  } = useRegisterSW({
    immediate: false,
    onRegisteredSW: (_url, registration) => {
      if (!registration) return
      checkOnReturn(registration)
      update.connect({
        look: async () => {
          await registration.update()
          return (await installed(registration)) !== null
        },
        install: () => {
          void installed(registration).then((waiting) => {
            // None waits: it is active already (a page no version controlled), and a reload takes it.
            if (!waiting) return setReloadDue(true)
            // The page reloads once the new version has taken over: when it controls the page, or,
            // on a page no version controls yet (opened for the first time), once it is active.
            const reload = () => setReloadDue(true)
            navigator.serviceWorker?.addEventListener('controllerchange', reload, { once: true })
            waiting.addEventListener('statechange', () => {
              if (waiting.state === 'activated') reload()
            })
            waiting.postMessage({ type: 'SKIP_WAITING' })
          })
        },
      })
    },
    onNeedReload: () => setReloadDue(true),
  })

  useEffect(() => {
    if (needRefresh) update.found()
  }, [needRefresh, update])

  useEffect(() => {
    if (!later) return
    const back = () => {
      if (document.visibilityState === 'visible') setLater(false)
    }
    document.addEventListener('visibilitychange', back)
    return () => document.removeEventListener('visibilitychange', back)
  }, [later])

  useEffect(() => {
    if (reloadDue && offer) reload()
  }, [reloadDue, offer, reload])

  return status === 'ready' && offer && !later ? (
    <UpdateBanner onUpdate={() => update.install()} onLater={() => setLater(true)} />
  ) : null
}
