import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { useSettingsDialog } from '../model/dialog-context'
import { settingsParentOf } from '../model/sections'

/** The name a sub-page's Back says in the dialog ("Back to Account"). */
const PARENT_TITLE = {
  '/settings/account': 'accountPage.title',
  '/settings/connect-piano': 'pages.connectPiano',
  '/settings/general': 'pages.general',
  '/admin/groups': 'pages.adminGroups',
} as const

/**
 * A page of Settings (iOS's Settings; on a laptop claude.ai's). On a phone, one column under the
 * page's bar with Back (to Settings, or to the page it is under). Inside the laptop's Settings
 * dialog, the place's pane (the board's): its title, 20 semibold, Back to its parent beside it on a
 * page under a page, its own acts at the row's end; then its sections 32 apart, each a sentence-case
 * heading over rows on the pane (`settings-pane`). A page Settings does not list (a Practice page's
 * Settings, opened from its gear) stands alone in one column with its Back on every screen.
 */
export function SettingsScreen({
  title,
  actions,
  lead,
  children,
}: {
  title: string
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
  const dialog = useSettingsDialog()
  if (dialog) {
    const parent = settingsParentOf(dialog.path)
    const back = parent ? t('dialog.back', { page: t(PARENT_TITLE[parent]) }) : null
    return (
      <div className="settings-pane flex flex-col gap-7">
        <div className="-mb-3 flex min-h-10 items-center gap-2">
          {parent && back ? (
            <Link
              {...(parent === '/admin/groups'
                ? { to: '/admin/$section', params: { section: 'groups' } }
                : { to: parent })}
              aria-label={back}
              title={back}
              className="-ml-3 grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-muted"
            >
              <ChevronLeft aria-hidden className="size-5.5" />
            </Link>
          ) : null}
          <h2 className="min-w-0 flex-1 font-sans text-xl leading-tight font-semibold text-balance">
            {title}
          </h2>
          {actions}
        </div>
        {lead}
        {children}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        column
        title={title}
        titleOnPage={lead !== undefined}
        back={<BackButton />}
        tools={actions}
      />
      <div className="page-column flex flex-col gap-4">
        {lead === undefined ? null : (
          <>
            {lead}
            <h1 className="font-sans text-place/tight font-bold tracking-title text-balance">
              {title}
            </h1>
          </>
        )}
        <div className="flex min-w-0 flex-col gap-4 pb-8">{children}</div>
      </div>
    </div>
  )
}
