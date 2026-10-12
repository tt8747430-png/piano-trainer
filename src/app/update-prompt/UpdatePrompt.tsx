import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { checkOnReturn } from './check-on-return'
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
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: false,
    onRegisteredSW: (_url, registration) => {
      if (registration) checkOnReturn(registration)
    },
    onNeedReload: () => setReloadDue(true),
  })

  useEffect(() => {
    if (reloadDue && offer) reload()
  }, [reloadDue, offer, reload])

  return needRefresh && offer ? (
    <UpdateBanner
      onUpdate={() => void updateServiceWorker(true)}
      onLater={() => setNeedRefresh(false)}
    />
  ) : null
}
