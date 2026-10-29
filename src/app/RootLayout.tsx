import { Outlet, useRouterState } from '@tanstack/react-router'
import { useLayoutEffect } from 'react'
import { ReloadOnRestore } from '@/features/backup-data'
import { ShortcutsHelp } from '@/features/shortcuts-help'
import { startKeyboardReveal, startKeyboardViewport } from '@/shared/lib'
import { DeletionGate } from './deletion-gate/DeletionGate'
import { StorageFullNotice } from './storage-full/StorageFullNotice'
import { UpdatePrompt } from './update-prompt/UpdatePrompt'

export function RootLayout() {
  // An update waits while the Player or the Check has the screen: it would cut a practice off.
  const fullScreen = useRouterState({
    select: (state) => state.matches.some((match) => match.staticData.fullScreen === true),
  })
  // The phone's keyboard, measured once for the whole app: what floats at the foot steps aside, and
  // a field focused is lifted clear of it.
  useLayoutEffect(() => {
    const stopMeasuring = startKeyboardViewport()
    const stopRevealing = startKeyboardReveal()
    return () => {
      stopRevealing()
      stopMeasuring()
    }
  }, [])
  return (
    <ShortcutsHelp>
      <Outlet />
      {/* The app's notices, stacked above the tab bar, never over each other. */}
      <div className="pointer-events-none fixed inset-x-4 bottom-28 z-40 mx-auto flex max-w-md flex-col gap-2 landscape-phone:bottom-4 lg:bottom-4">
        <StorageFullNotice />
        <UpdatePrompt offer={!fullScreen} />
      </div>
      <ReloadOnRestore />
      <DeletionGate />
    </ShortcutsHelp>
  )
}
