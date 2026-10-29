import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AccountRole } from '@/shared/api/auth'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { ChoiceChips, SearchField } from '@/shared/ui'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

const ROLES = ['learner', 'editor', 'admin'] as const satisfies readonly AccountRole[]

/** Accounts: found by name or email, each with when it joined and last signed in, and its role. */
export function AccountsTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const admin = useAdmin()
  const [query, setQuery] = useState('')
  // Asked once typing rests: the accounts come from a function, one call a word, not a letter.
  const [asked, setAsked] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setAsked(query), 300)
    return () => clearTimeout(timer)
  }, [query])
  const [problem, setProblem] = useState(false)
  const load = useCallback(() => admin.accounts(asked), [admin, asked])
  const { loaded, reload } = useLoaded(load)
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso))
  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} label={t('accounts.search')} />
      {problem ? <p role="alert">{t('refused')}</p> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {(accounts) =>
          accounts.length === 0 ? (
            <p className="text-muted-foreground">{t('accounts.none')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {accounts.map((account) => (
                <li key={account.id} className="flex flex-col gap-3 card p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{account.name || account.email}</p>
                    <p className="truncate text-sm text-muted-foreground">{account.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('accounts.joined', { date: date(account.joinedAt) })} ·{' '}
                      {account.lastSignInAt
                        ? t('accounts.lastSeen', { date: date(account.lastSignInAt) })
                        : t('accounts.never')}
                    </p>
                  </div>
                  <ChoiceChips
                    label={t('accounts.role', { name: account.name || account.email })}
                    value={account.role}
                    options={ROLES.map((role) => ({
                      value: role,
                      label: t(`accounts.roles.${role}`),
                    }))}
                    onChange={(role) =>
                      void admin.setRole(account.id, role).then((result) => {
                        setProblem(!result.ok)
                        reload()
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          )
        }
      </LoadedState>
    </div>
  )
}
