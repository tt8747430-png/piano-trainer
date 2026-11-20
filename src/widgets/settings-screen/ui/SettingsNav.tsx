import { Link } from '@tanstack/react-router'
import { ChevronLeft, Search, ShieldUser } from 'lucide-react'
import { useState } from 'react'
import type { AdminCounts } from '../model/dialog-context'
import { useTranslation } from 'react-i18next'
import { useAccount } from '@/shared/lib/account'
import { useAppUpdate } from '@/shared/lib/app-update'
import { cn, matchesQuery } from '@/shared/lib'
import {
  ADMIN_PICTURES,
  ADMIN_SECTIONS,
  SETTINGS_GROUPS,
  type SettingsPlace,
} from '../model/sections'
import { AccountCard } from './AccountCard'

/** A place's row in the dialog's nav (LNAVROW): 40 tall, its glyph in Soft Ink, the open one washed. */
const ROW =
  'flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[0.9375rem] choice focus-visible:-outline-offset-3 data-active:font-semibold'

/** A group's small heading over its rows (LNAV's h3): 13 semibold in Soft Ink. */
const HEAD =
  'px-3 pb-1 font-sans text-[0.8125rem] leading-[normal] font-semibold text-muted-foreground'

/**
 * The laptop Settings dialog's nav (the board's LSEARCH, LACCT, LNAV, LADMIN; claude.ai's): a search
 * over the places, the account as a plain row, then each group's heading and its places, the open one
 * on the chosen wash; Administration last for an administrator. Inside Administration the same nav is
 * "‹ Settings" over its sections, one shell for both.
 */
export function SettingsNav({
  place,
  counts,
}: {
  place: SettingsPlace | null
  /** What waits in Administration's sections, carried at their rows' ends. */
  counts: AdminCounts
}) {
  const { t } = useTranslation(['settings', 'admin'])
  const { account } = useAccount()
  const { status } = useAppUpdate()
  const [query, setQuery] = useState('')
  if (place?.kind === 'admin')
    return (
      <>
        <Link to="/settings/general" className={ROW}>
          <ChevronLeft aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
          {t('settings:title')}
        </Link>
        <section className="flex flex-col gap-0.5">
          <h3 className={HEAD}>{t('admin:title')}</h3>
          {ADMIN_SECTIONS.map((section) => {
            const Icon = ADMIN_PICTURES[section].icon
            return (
              <Link
                key={section}
                to="/admin/$section"
                params={{ section }}
                data-active={place.section === section ? '' : undefined}
                className={ROW}
              >
                <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">{t(`admin:sections.${section}`)}</span>
                {counts[section] ? (
                  <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
                    {counts[section]}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </section>
      </>
    )
  const wanted = query.trim()
  const groups = SETTINGS_GROUPS.map((group) => ({
    ...group,
    pages: group.pages.filter((page) => matchesQuery([t(`settings:${page.title}`)], query)),
  })).filter((group) => group.pages.length > 0)
  return (
    <>
      <label className="flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-muted px-3 text-muted-foreground">
        <Search aria-hidden className="size-4.5 shrink-0" />
        <input
          type="search"
          inputMode="search"
          enterKeyHint="search"
          aria-label={t('settings:dialog.searchLabel')}
          placeholder={t('settings:dialog.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-foreground placeholder:text-muted-foreground"
        />
      </label>
      {wanted ? null : <AccountCard current={place?.kind === 'account'} plain />}
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-0.5">
          <h3 className={HEAD}>{t(`settings:${group.title}`)}</h3>
          {group.pages.map((page) => {
            const Icon = page.icon
            return (
              <Link
                key={page.to}
                to={page.to}
                data-active={place?.kind === 'page' && place.to === page.to ? '' : undefined}
                className={ROW}
              >
                <Icon aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{t(`settings:${page.title}`)}</span>
                {page.to === '/settings/general' && status === 'ready' ? (
                  <span className="text-[0.8125rem] text-muted-foreground">
                    {t('settings:about.update.ready')}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </section>
      ))}
      {wanted && groups.length === 0 ? (
        <p role="status" className="px-3 text-[0.9375rem] text-muted-foreground">
          {t('settings:dialog.none')}
        </p>
      ) : null}
      {account?.role === 'admin' && !wanted ? (
        <Link to="/admin" className={cn(ROW, 'mt-auto')}>
          <ShieldUser aria-hidden className="size-4.5 shrink-0 text-muted-foreground" />
          {t('admin:title')}
        </Link>
      ) : null}
    </>
  )
}
