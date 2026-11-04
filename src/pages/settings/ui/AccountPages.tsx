import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnline } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import { FormField, say, SettingsGroup as Group, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsScreen } from '@/widgets/settings-screen'

/** The shortest password an account takes (as Create an account asks). */
const PASSWORD_MIN = 8

/**
 * Change password (B1): the current one (checked by signing in with it), the new one twice, Update
 * password. Offline, it waits.
 */
export function ChangePasswordPage() {
  const { t } = useTranslation('account')
  const { account, auth } = useAccount()
  const online = useOnline()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [again, setAgain] = useState('')
  const [problem, setProblem] = useState<'wrong' | 'failed' | null>(null)
  const [busy, setBusy] = useState(false)
  const short = next !== '' && next.length < PASSWORD_MIN
  const mismatch = again !== '' && again !== next
  const ready =
    account !== null && online && !busy && current !== '' && !short && next !== '' && again === next
  const submit = async () => {
    if (!account) return
    setBusy(true)
    const checked = await auth.signIn(account.email, current)
    if (!checked.ok) {
      setBusy(false)
      return setProblem(checked.reason === 'refused' ? 'wrong' : 'failed')
    }
    const updated = await auth.updatePassword(next)
    setBusy(false)
    if (!updated.ok) return setProblem('failed')
    setProblem(null)
    setCurrent('')
    setNext('')
    setAgain('')
    say(t('changePassword.done'))
  }
  return (
    <SettingsScreen title={t('changePassword.title')} sub>
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) void submit()
        }}
      >
        <Group>
          <FormField
            label={t('changePassword.current')}
            type="password"
            autoComplete="current-password"
            value={current}
            error={problem === 'wrong' ? t('changePassword.wrong') : undefined}
            onChange={(event) => {
              setCurrent(event.target.value)
              setProblem(null)
            }}
          />
          <FormField
            label={t('changePassword.next')}
            type="password"
            autoComplete="new-password"
            value={next}
            error={short ? t('changePassword.short') : undefined}
            onChange={(event) => setNext(event.target.value)}
          />
          <FormField
            label={t('changePassword.confirm')}
            type="password"
            autoComplete="new-password"
            value={again}
            error={mismatch ? t('changePassword.mismatch') : undefined}
            onChange={(event) => setAgain(event.target.value)}
          />
        </Group>
        {problem === 'failed' ? (
          <p role="alert" className="text-sm text-destructive">
            {t('changePassword.failed')}
          </p>
        ) : null}
        {online ? null : (
          <p role="status" className="text-sm text-muted-foreground">
            {t('editProfile.offline')}
          </p>
        )}
        <Button type="submit" size="lg" disabled={!ready}>
          {t('changePassword.submit')}
        </Button>
      </form>
    </SettingsScreen>
  )
}

/**
 * Privacy (B1, D12): one switch, Show my profile, the server's `public`: on, the learner's name and
 * picture on what they publish and their profile in Explore; off, "Piano Trainer learner".
 */
export function ProfilePrivacyPage() {
  const { t } = useTranslation('account')
  const { state, save } = useLearnerProfile()
  const online = useOnline()
  const shown = state.kind === 'ready' && state.profile.public
  return (
    <SettingsScreen title={t('privacy.title')} sub>
      <Group>
        <SwitchRow
          label={t('privacy.show')}
          info={t('privacy.says')}
          checked={shown}
          disabled={state.kind !== 'ready' || !online}
          reason={online ? undefined : t('editProfile.offline')}
          onCheckedChange={(on) =>
            void save({ public: on }).then((result) => {
              if (!result.ok) say(t('editProfile.failed'))
            })
          }
        />
      </Group>
    </SettingsScreen>
  )
}
