import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

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
const isAction = (value: string): value is Action => (ACTIONS as readonly string[]).includes(value)

/** What the admins did, the latest first: when, what, to what. */
export function ActivityTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const admin = useAdmin()
  const load = useCallback(() => admin.activity(), [admin])
  const { loaded, reload } = useLoaded(load)
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(entries) =>
        entries.length === 0 ? (
          <p className="text-muted-foreground">{t('activity.none')}</p>
        ) : (
          <ol className="flex flex-col divide-y divide-border card">
            {entries.map((entry, i) => (
              <li key={i} className="flex flex-col gap-0.5 px-4 py-3">
                <span className="font-medium">
                  {isAction(entry.action) ? t(`activity.actions.${entry.action}`) : entry.action}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(entry.at))}{' '}
                  · {entry.target}
                </span>
              </li>
            ))}
          </ol>
        )
      }
    </LoadedState>
  )
}
