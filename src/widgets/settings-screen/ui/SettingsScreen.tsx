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
 * laptop, as its board: Settings' own list (23.25rem, its hairline to the right, the full height,
 * scrolling on its own) under a 28px Settings, the page open lit, beside the page: Back only on a
 * page under a page (`sub`: Edit profile, a legal page, the MIDI log) and the page's own actions in
 * one row, then its 26px title over its 44rem column, which scrolls with the window. A page Settings does not list (a Practice page's Settings, opened from its gear) stands
 * alone in one column with its Back on every screen.
 */
export function SettingsScreen({
  title,
  sub = false,
  actions,
  lead,
  children,
}: {
  title: string
  sub?: boolean
  /**
   * What stands over the page's own title (Legal's Privacy Policy · Terms of Service): on a phone the
   * title then leaves the bar for the page, 30 bold under it, as the Legal board draws it.
   */
  lead?: ReactNode
  /** The bar's own actions (a page's ⓘ). */
  actions?: ReactNode
  children: ReactNode
}) {
  const { t } = useTranslation('settings')
  const wide = useMediaQuery(LAPTOP)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const place = settingsPlaceOf(path)
  const panes = wide && place !== null
  const page = <div className="flex min-w-0 flex-col gap-4 pb-8">{children}</div>
  if (!panes)
    return (
      <div className="flex flex-col gap-2">
        <ScreenHeader
          title={title}
          titleOnPage={lead !== undefined}
          back={<BackButton />}
          tools={actions}
        />
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
          {lead === undefined ? null : (
            <>
              {lead}
              <h1 className="font-sans text-[1.875rem]/tight font-bold tracking-[-0.01em] text-balance">
                {title}
              </h1>
            </>
          )}
          {page}
        </div>
      </div>
    )
  return (
    <div className="-mt-4 grid grid-cols-[23.25rem_minmax(0,1fr)] items-start gap-14">
      <aside
        aria-label={t('title')}
        data-slot="settings-nav"
        className="sticky top-0 flex h-dvh flex-col gap-4 overflow-y-auto overscroll-contain border-r border-border py-6 pr-4"
      >
        <h1 className="ml-1 font-sans text-[1.75rem]/tight font-bold">{t('title')}</h1>
        <SettingsList place={place} />
      </aside>
      <div className="mx-auto flex w-full max-w-176 min-w-0 flex-col gap-4 pt-6">
        <div className="flex min-h-11 items-center gap-1">
          {sub ? <BackButton /> : null}
          <span className="flex-1" />
          {actions}
        </div>
        {lead}
        <h2 className="-mt-2 font-sans text-[1.625rem]/tight font-bold text-balance">{title}</h2>
        {page}
      </div>
    </div>
  )
}
