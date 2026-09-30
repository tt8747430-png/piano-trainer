import { useRegisterSW } from 'virtual:pwa-register/react'
import { checkOnReturn } from './check-on-return'
import { UpdateBanner } from './UpdateBanner'

/**
 * Registers the service worker once the page has loaded, so its precache never competes with the
 * first screen, and looks for a new version whenever the app comes back to the screen. A waiting
 * version is offered where `offer` allows. Taking it reloads every open tab onto it: the old
 * version's files leave with the old worker, so no tab can stay on it.
 */
export function UpdatePrompt({ offer }: { offer: boolean }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: false,
    onRegisteredSW: (_url, registration) => {
      if (registration) checkOnReturn(registration)
    },
  })

  return needRefresh && offer ? (
    <UpdateBanner
      onUpdate={() => void updateServiceWorker(true)}
      onLater={() => setNeedRefresh(false)}
    />
  ) : null
}
