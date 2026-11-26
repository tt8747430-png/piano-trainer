import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { FormField, GroupRow, say, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * Settings › Account › Email, its one home under Sign-in and security (owner, 2026-11-18, "refactor
 * all the settings"; Apple's Sign-In & Security › Email; the board's P_EMAIL): the current address as
 * a value row, New email, Send confirmation link; once sent, the line saying the new address takes
 * effect when confirmed. Offline, it waits.
 */
export function EmailPage() {
  const { t } = useTranslation(['settings', 'account'])
  const { account, auth } = useAccount()
  const online = useOnline()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const next = email.trim()
  const ready = account !== null && online && !busy && next.includes('@') && next !== account.email
  const send = async () => {
    setBusy(true)
    const result = await auth.updateEmail(next)
    setBusy(false)
    setSent(result.ok)
    if (!result.ok) say(t('account:editProfile.failed'))
  }
  return (
    <SettingsScreen title={t('accountPage.email')}>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) void send()
        }}
      >
        <SettingsGroup flush>
          <GroupRow label={t('accountPage.emailPage.current')}>
            <span className="min-w-0 truncate text-end text-muted-foreground">
              {account?.email}
            </span>
          </GroupRow>
        </SettingsGroup>
        <FormField
          label={t('account:editProfile.newEmail')}
          type="email"
          autoComplete="email"
          value={email}
          readOnly={!online}
          onChange={(event) => {
            setEmail(event.target.value)
            setSent(false)
          }}
        />
        {online ? null : (
          <p role="status" className="px-4 text-sm text-muted-foreground">
            {t('account:editProfile.offline')}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-2" disabled={!ready}>
          {t('accountPage.emailPage.send')}
        </Button>
        {sent ? (
          <p role="status" className="px-4 text-sm text-muted-foreground">
            {t('accountPage.emailPage.sent')}
          </p>
        ) : null}
      </form>
    </SettingsScreen>
  )
}
