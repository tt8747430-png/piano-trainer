import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminAccount } from '@/shared/api/admin'
import type { AccountRole } from '@/shared/api/auth'
import { useLocale } from '@/shared/i18n'
import { useAdmin } from '@/shared/lib/admin'
import { ChoiceChips, ConfirmDialog, SearchField, SettingsGroup } from '@/shared/ui'
import { useLoaded } from '../model/use-loaded'
import { useChangeProblem } from '../model/use-change-problem'
import { FailureLine, LoadedState } from './LoadedState'
import { daySaid, formatLocale } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { Face, nameOf } from './Face'

const ROLES = ['learner', 'editor', 'admin'] as const satisfies readonly AccountRole[]

/**
 * Administration › Accounts (the Admin board): found by name or email, one card of accounts, each its
 * face, name, email, when it joined and last signed in, and its role chosen in place among three
 * chips; a change that takes away an administrator's access asks first (R32).
 */
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
  const load = useCallback(() => admin.accounts(asked), [admin, asked])
  const { loaded, reload } = useLoaded(load)
  const { problem, after } = useChangeProblem(reload)
  const [demoting, setDemoting] = useState<{ account: AdminAccount; role: AccountRole } | null>(
    null,
  )
  const setRole = (account: AdminAccount, role: AccountRole) =>
    void admin.setRole(account.id, role).then(after)
  const choose = (account: AdminAccount, role: AccountRole) => {
    if (account.role === 'admin' && role !== 'admin') setDemoting({ account, role })
    else setRole(account, role)
  }
  const joined = (iso: string) =>
    new Intl.DateTimeFormat(formatLocale(locale), { dateStyle: 'long' }).format(new Date(iso))
  return (
    <div className="flex flex-col gap-3">
      <SearchField value={query} onChange={setQuery} label={t('accounts.search')} />
      {problem ? <FailureLine reason={problem} /> : null}
      <LoadedState loaded={loaded} reload={reload}>
        {(accounts) =>
          accounts.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>
                  {query.trim()
                    ? t('accounts.noneFor', { query: query.trim() })
                    : t('accounts.none')}
                </EmptyTitle>
                {query.trim() ? (
                  <EmptyDescription>{t('accounts.noneLine')}</EmptyDescription>
                ) : null}
              </EmptyHeader>
              {query.trim() ? (
                <EmptyContent>
                  <Button variant="quiet" onClick={() => setQuery('')}>
                    {t('accounts.clear')}
                  </Button>
                </EmptyContent>
              ) : null}
            </Empty>
          ) : (
            <SettingsGroup flush>
              {accounts.map((account) => (
                <div key={account.id} className="flex flex-col gap-3 py-3 ps-4 pe-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Face name={nameOf(account)} size="row" />
                    <div className="flex min-w-0 flex-col gap-0.5 leading-[normal]">
                      <span className="truncate font-semibold">{nameOf(account)}</span>
                      {account.name.trim() ? (
                        <span className="truncate text-sm leading-[normal] text-muted-foreground">
                          {account.email}
                        </span>
                      ) : null}
                      <span className="text-[0.8125rem] text-muted-foreground">
                        {t('accounts.joined', { date: joined(account.joinedAt) })} ·{' '}
                        {account.lastSignInAt
                          ? t('accounts.lastSeen', {
                              date: daySaid(account.lastSignInAt, locale, Date.now(), false),
                            })
                          : t('accounts.never')}
                      </span>
                    </div>
                  </div>
                  <ChoiceChips
                    label={t('accounts.role', { name: nameOf(account) })}
                    value={account.role}
                    options={ROLES.map((role) => ({
                      value: role,
                      label: t(`accounts.roles.${role}`),
                    }))}
                    onChange={(role) => choose(account, role)}
                  />
                </div>
              ))}
            </SettingsGroup>
          )
        }
      </LoadedState>
      <ConfirmDialog
        open={demoting !== null}
        onOpenChange={(open) => {
          if (!open) setDemoting(null)
        }}
        title={t('accounts.demoteTitle')}
        body={t('accounts.demoteBody', {
          name: demoting ? nameOf(demoting.account) : '',
          role: demoting ? t(`accounts.roles.${demoting.role}`) : '',
        })}
        action={t('accounts.demote')}
        onConfirm={() => {
          if (demoting) setRole(demoting.account, demoting.role)
          setDemoting(null)
        }}
      />
    </div>
  )
}
