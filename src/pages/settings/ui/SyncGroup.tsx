import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { cn, useOnline } from '@/shared/lib'
import { useSync } from '@/shared/lib/account'
import { syncLine } from '@/shared/lib/sync'
import { GroupRow, SettingsGroup } from '@/shared/ui'
import { SyncNowRow } from './SyncNowRow'

/** The state's dot, as Software update's: grass when current, ochre at work, crimson when it failed. */
const DOT = {
  idle: 'bg-learned',
  syncing: 'bg-paint-tile-yellow',
  failed: 'bg-destructive',
  offline: 'bg-muted-foreground',
} as const

/**
 * The Account's Sync (ADR 0116, A15), its one home, a plain group of 48 rows as the board's (owner,
 * 2026-11-18, "refactor all the settings"): where it stands beside its dot with when it last got
 * through at the row's end, Changes pending, Sync now; what syncs behind the heading's ⓘ.
 */
export function SyncGroup() {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const online = useOnline()
  const { status } = useSync()
  const state = online ? status.state : 'offline'
  // When it last synced, as the account card says it: "2 min ago", then hours, then days.
  const last = syncLine({ ...status, state: 'idle', waiting: 0 }, Date.now())
  const when =
    last.kind === 'synced'
      ? t('sync.last', {
          when: new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' }).format(
            last.ago.value,
            last.ago.unit,
          ),
        })
      : null
  return (
    <SettingsGroup flush title={t('sync.label')} info={t('sync.what')}>
      <p role="status" className="flex min-h-12 items-center gap-3 px-4 py-1.5">
        <span aria-hidden className={cn('size-2 shrink-0 rounded-pill', DOT[state])} />
        <span className="min-w-0 flex-1">{t(`sync.state.${state}`)}</span>
        {when && state === 'idle' ? (
          <span className="shrink-0 text-muted-foreground tabular-nums">{when}</span>
        ) : null}
      </p>
      <GroupRow label={t('sync.pending')}>
        <span className="text-muted-foreground tabular-nums">{status.waiting}</span>
      </GroupRow>
      <SyncNowRow />
    </SettingsGroup>
  )
}
