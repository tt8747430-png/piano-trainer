import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { clockSaid, daySaid, isOneOf, useLoaded, useNow } from '@/shared/lib'
import { useAdmin } from '@/shared/lib/admin'
import { LoadedState } from './LoadedState'
import { SettingsGroup } from '@/shared/ui'
import { nameOf } from '../model/name-of'

const ACTIONS = [
  'set-role',
  'create-group',
  'delete-group',
  'add-member',
  'remove-member',
  'save-switch',
  'delete-switch',
  'hide',
  'show',
  'block',
  'dismiss',
] as const
type Action = (typeof ACTIONS)[number]
const isAction = isOneOf<Action>(ACTIONS)

/** When an act was done, as the Admin board says it: "Today 09:14", "Yesterday", "7 Nov". */
function when(at: string, locale: string, now: number) {
  const day = daySaid(at, locale, now)
  return new Date(at).toDateString() === new Date(now).toDateString()
    ? `${day} ${clockSaid(at, locale)}`
    : day
}

/**
 * What the admins did, the latest first, one card as the Admin board's: each act, who did it and to
 * what, and when at its end.
 */
export function ActivityTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const now = useNow()
  const admin = useAdmin()
  const load = useCallback(async () => {
    const [entries, accounts] = await Promise.all([admin.activity(), admin.accounts('')])
    if (!entries.ok) return entries
    // Who did each is said by name where their account is still found; else the act stands alone.
    const names = new Map(accounts.ok ? accounts.value.map((each) => [each.id, nameOf(each)]) : [])
    return {
      ok: true as const,
      value: entries.value.map((entry) => ({
        ...entry,
        who: entry.adminId ? (names.get(entry.adminId) ?? null) : null,
      })),
    }
  }, [admin])
  const { loaded, reload } = useLoaded(load)
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(entries) =>
        entries.length === 0 ? (
          <p className="text-muted-foreground">{t('activity.none')}</p>
        ) : (
          <SettingsGroup flush>
            {entries.map((entry, i) => (
              <div key={i} className="flex min-h-15 items-center gap-3 px-4 py-2 leading-[normal]">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-semibold">
                    {isAction(entry.action) ? t(`activity.actions.${entry.action}`) : entry.action}
                  </span>
                  <span className="truncate text-sm leading-[normal] text-muted-foreground">
                    {[entry.who, entry.target].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="text-footnote whitespace-nowrap text-muted-foreground tabular-nums">
                  {when(entry.at, locale, now)}
                </span>
              </div>
            ))}
          </SettingsGroup>
        )
      }
    </LoadedState>
  )
}
