import type { ReactNode } from 'react'

import type { AppUpdate } from './app-update'
import { AppUpdateContext } from './update-context'

/** The app's one update state (`app/RootLayout` makes it; the service worker feeds it). */
export function AppUpdateProvider({
  update,
  children,
}: {
  update: AppUpdate
  children: ReactNode
}) {
  return <AppUpdateContext value={update}>{children}</AppUpdateContext>
}
