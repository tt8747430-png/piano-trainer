import { useRegisterSW } from 'virtual:pwa-register/react'
import { UpdateBanner } from './UpdateBanner'

/** Registers the service worker; offers a waiting version, and never reloads on its own. */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  return needRefresh ? (
    <UpdateBanner
      onUpdate={() => void updateServiceWorker(true)}
      onLater={() => setNeedRefresh(false)}
    />
  ) : null
}
