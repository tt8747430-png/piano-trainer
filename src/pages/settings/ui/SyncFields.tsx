import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useOnline } from '@/shared/lib'
import { useAccount, useSync } from '@/shared/lib/account'
import { ButtonLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The sync (ADR 0116): signed in, where it stands (up to date, the changes waiting, when it last got
 * through) and Sync now; signed out, Sign in.
 */
export function SyncFields() {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const online = useOnline()
  const { account } = useAccount()
  const { status, syncNow } = useSync()
  if (!account)
    return (
      <div className="flex flex-col gap-3">
        <p>{t('sync.signedOut')}</p>
        <ButtonLink className="self-start" render={<Link to="/account/sign-in" />}>
          {t('account.signIn')}
        </ButtonLink>
      </div>
    )
  const when =
    status.lastSynced === null
      ? null
      : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(status.lastSynced),
        )
  return (
    <div className="flex flex-col gap-3">
      <div role="status" className="flex flex-col gap-0.5">
        <p className="font-medium">{t(`sync.state.${status.state}`)}</p>
        {status.waiting > 0 && status.state !== 'syncing' ? (
          <p className="text-sm text-muted-foreground">
            {t('sync.waiting', { count: status.waiting })}
          </p>
        ) : null}
        {when === null ? null : (
          <p className="text-sm text-muted-foreground">{t('sync.last', { when })}</p>
        )}
      </div>
      <Button
        variant="outline"
        className="self-start"
        disabled={!online || status.state === 'syncing'}
        onClick={() => void syncNow()}
      >
        {t('sync.now')}
      </Button>
    </div>
  )
}
