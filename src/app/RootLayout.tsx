import { Outlet, useRouterState } from '@tanstack/react-router'
import { type ReactNode, useLayoutEffect, useState } from 'react'
import { ReloadOnRestore } from '@/features/backup-data'
import { useFirstMidiSession } from '@/features/record-practised'
import { ShortcutsHelp } from '@/features/shortcuts-help'
import { useTrackAchievements } from '@/features/track-achievements'
import { startKeyboardReveal, startKeyboardViewport, useRootSize } from '@/shared/lib'
import { AppUpdateProvider, createAppUpdate } from '@/shared/lib/app-update'
import { DeletionGate } from './deletion-gate/DeletionGate'
import { LearnerViewNotice } from './learner-view/LearnerViewNotice'
import { Parents } from './providers/Parents'
import { StorageFullNotice } from './storage-full/StorageFullNotice'
import { UpdatePrompt } from './update-prompt/UpdatePrompt'

/** The notices' height with the 8 a toast keeps over them, none while no notice shows. */
const NOTICES = { block: '--notices', write: (px: number) => (px > 0 ? `${px + 8}px` : '0px') }

/**
 * The app's notices at the screen's foot, where a toast stands (`toast-foot`): the toast's width on a
 * phone, 460 on a laptop, stacked 8 apart, each rising from below as a toast does; their height
 * (`--notices`) lifts a toast said meanwhile.
 */
function Notices({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<HTMLDivElement | null>(null)
  useRootSize(notices, NOTICES)
  return (
    <div
      ref={setNotices}
      className="pointer-events-none fixed inset-x-0 toast-foot z-40 mx-auto flex w-[min(26rem,calc(100vw-2*var(--gutter)))] flex-col gap-2 print:hidden *:transition-[translate,opacity] *:duration-300 *:ease-out *:starting:translate-y-4 *:starting:opacity-0 motion-reduce:*:transition-none lg:left-sidebar lg:w-115"
    >
      {children}
    </div>
  )
}

export function RootLayout() {
  // The app's one update state: the banner, Settings' Version row and the Profile's dot read it.
  const [update] = useState(() => createAppUpdate())
  // Badges' tiers and milestones kept as they are reached, and their notifications (B1).
  useTrackAchievements()
  // The First MIDI session (B1): a minute played on a connected piano, wherever it is played.
  useFirstMidiSession()
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
    <AppUpdateProvider update={update}>
      <ShortcutsHelp>
        <Parents>
          <Outlet />
        </Parents>
        {/* The app's notices, stacked, never over each other, where the AppLayers board puts them: at the
            foot where a toast stands, on a phone as on a laptop (owner, 2026-11-28: "why do the
            notifications appear from the top and not from the bottom"); a toast said meanwhile stands
            8 over them (`--notices`). */}
        <Notices>
          <LearnerViewNotice />
          <StorageFullNotice />
          <UpdatePrompt offer={!fullScreen} />
        </Notices>
        <ReloadOnRestore />
        <DeletionGate />
      </ShortcutsHelp>
    </AppUpdateProvider>
  )
}
