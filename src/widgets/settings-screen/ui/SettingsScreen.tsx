import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { settingsPlaceOf } from '../model/sections'
import { SettingsNav } from './SettingsNav'

/**
 * A page of Settings (R32), as iOS's Settings and macOS's System Settings lay one out. On a phone,
 * one column under the page's bar with Back (to Settings, or to the page it is under). On a laptop,
 * the two panes of the libraries (Songs' tree and list): Settings' sidebar (17rem, under the bar,
 * scrolling on its own) beside the page (44rem), which scrolls with the window; Back only on a page
 * under a page (`sub`: Edit profile, a legal page, the MIDI log), the sidebar being the way between
 * Settings' own. A page Settings does not list (a Practice page's Settings, opened from its gear)
 * stands alone in one column with its Back on every screen.
 */
export function SettingsScreen({
  title,
  sub = false,
  actions,
  children,
}: {
  title: string
  sub?: boolean
  /** The bar's own actions (a page's ⓘ). */
  actions?: ReactNode
  children: ReactNode
}) {
  const wide = useMediaQuery(LAPTOP)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const place = settingsPlaceOf(path)
  const panes = wide && place !== null
  const page = <div className="flex min-w-0 flex-col gap-7 pb-8">{children}</div>
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={title}
        back={!panes || sub ? <BackButton /> : undefined}
        tools={actions}
      />
      {panes ? (
        <div className="grid grid-cols-[17rem_minmax(0,44rem)] items-start gap-10">
          <SettingsNav place={place} />
          {page}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-2xl">{page}</div>
      )}
    </div>
  )
}
