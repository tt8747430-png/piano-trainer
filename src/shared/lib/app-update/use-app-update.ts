import { use, useState, useSyncExternalStore } from 'react'

import { createAppUpdate, type AppUpdate, type UpdateStatus } from './app-update'
import { AppUpdateContext } from './update-context'

/** The app's update: its status, a look for a new version, and installing the one that waits. */
export function useAppUpdate(): {
  status: UpdateStatus
  check: () => void
  install: () => void
  update: AppUpdate
} {
  // Outside a provider (a screen alone in a test) the component keeps its own.
  const [own] = useState(() => createAppUpdate())
  const update = use(AppUpdateContext) ?? own
  const status = useSyncExternalStore(update.subscribe, update.status, update.status)
  return { status, check: () => void update.check(), install: () => update.install(), update }
}
