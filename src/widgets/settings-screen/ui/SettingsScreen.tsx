import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { settingsPlaceOf } from '../model/sections'
import { SettingsList } from './SettingsList'

/**
 * A page of Settings (canvas 128), as iOS's Settings and macOS's System Settings lay one out. On a
 * phone, one column under the page's bar with Back (to Settings, or to the page it is under). On a
 * laptop, the bar says Settings, with Back only on a page under a page (`sub`: Edit profile, a legal
 * page, the MIDI log); under it Settings' own list (23.25rem, under the bar, scrolling on its own),
 * the page open lit, beside the page with its title over its 44rem column, which scrolls with the
 * window. A page Settings does not list (a Practice page's Settings, opened from its gear) stands
 * alone in one column with its Back on every screen.
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
  const { t } = useTranslation('settings')
  const wide = useMediaQuery(LAPTOP)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const place = settingsPlaceOf(path)
  const panes = wide && place !== null
  const page = <div className="flex min-w-0 flex-col gap-6 pb-8">{children}</div>
  if (!panes)
    return (
      <div className="flex flex-col gap-6">
        <ScreenHeader title={title} back={<BackButton />} tools={actions} />
        <div className="mx-auto w-full max-w-2xl">{page}</div>
      </div>
    )
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={sub ? <BackButton /> : undefined} tools={actions} />
      <div className="grid grid-cols-[23.25rem_minmax(0,1fr)] items-start gap-14">
        <aside
          aria-label={t('title')}
          data-slot="settings-nav"
          className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain pb-4"
        >
          <SettingsList place={place} />
        </aside>
        <div className="mx-auto flex w-full max-w-176 min-w-0 flex-col gap-4">
          <h2 className="text-balance font-sans text-2xl font-bold">{title}</h2>
          {page}
        </div>
      </div>
    </div>
  )
}
