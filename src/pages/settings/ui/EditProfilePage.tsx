import { Camera, ImageUp, Mail, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BIO_MAX, HANDLE, NAME_MAX, type LearnerProfile } from '@/shared/api/profile'
import { avatarOf, cn, useOnline } from '@/shared/lib'
import { useAccount, useLearnerProfile } from '@/shared/lib/account'
import {
  Avatar,
  BUILT_IN_AVATARS,
  FormField,
  RowButton,
  say,
  SettingsGroup as Group,
  Sheet,
  SheetContent,
  type BuiltInAvatar,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { SettingsScreen } from '@/widgets/settings-screen'

/** How long typing rests before a handle is checked. */
const SETTLE_MS = 400

type HandleCheck = 'same' | 'invalid' | 'checking' | 'available' | 'taken'

/**
 * Edit profile (B1, memory-palaces'): the picture large with Change photo (Upload photo, the
 * built-in pictures, Remove photo); Name, Username (checked as it is typed), Bio; Email, changed
 * by a link to the new address; Save changes in the bar once something changed. Offline, every
 * field reads only.
 */
export function EditProfilePage() {
  const { t } = useTranslation('account')
  const { state } = useLearnerProfile()
  const online = useOnline()
  if (state.kind === 'ready')
    return <ProfileForm key={state.profile.joined} profile={state.profile} />
  return (
    <SettingsScreen title={t('editProfile.title')} sub>
      {state.kind === 'loading' && online ? (
        <p role="status" className="text-muted-foreground">
          {t('editProfile.loading')}
        </p>
      ) : (
        <p className="text-muted-foreground">{t('editProfile.offline')}</p>
      )}
    </SettingsScreen>
  )
}

const FORM = 'edit-profile'

function ProfileForm({ profile }: { profile: LearnerProfile }) {
  const { t } = useTranslation('account')
  const online = useOnline()
  const { save, port } = useLearnerProfile()
  const { auth } = useAccount()
  const [name, setName] = useState(profile.name)
  const [handle, setHandle] = useState(profile.handle ?? '')
  const [bio, setBio] = useState(profile.bio)
  const [saving, setSaving] = useState(false)
  const [photo, setPhoto] = useState(false)
  const check = useHandleCheck(handle, profile.handle, port.handleAvailable)
  const changed =
    name.trim() !== profile.name || bio.trim() !== profile.bio || handle !== (profile.handle ?? '')
  const ready =
    changed &&
    online &&
    !saving &&
    (check === 'same' || check === 'available') &&
    name.trim() !== ''
  const submit = async () => {
    setSaving(true)
    const result = await save({
      name: name.trim(),
      bio: bio.trim(),
      ...(handle !== (profile.handle ?? '') ? { handle: handle || null } : {}),
    })
    // The account's name follows the profile's: one name, shown alike everywhere.
    if (result.ok && name.trim() !== profile.name) await auth.updateName(name.trim())
    setSaving(false)
    say(result.ok ? t('editProfile.saved') : t('editProfile.failed'))
  }
  const readOnly = !online
  return (
    <SettingsScreen
      title={t('editProfile.title')}
      sub
      actions={
        <Button type="submit" form={FORM} variant="soft" disabled={!ready}>
          {saving ? t('editProfile.saving') : t('editProfile.save')}
        </Button>
      }
    >
      <form
        id={FORM}
        noValidate
        className="flex flex-col gap-7"
        onSubmit={(event) => {
          event.preventDefault()
          if (ready) void submit()
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Avatar name={name || null} picture={profile.avatar} size="hero" />
          <Button type="button" variant="soft" disabled={readOnly} onClick={() => setPhoto(true)}>
            <Camera data-icon="inline-start" aria-hidden />
            {t('editProfile.changePhoto')}
          </Button>
          {readOnly ? (
            <p role="status" className="text-sm text-muted-foreground">
              {t('editProfile.offline')}
            </p>
          ) : null}
        </div>
        <Group>
          <FormField
            label={t('editProfile.name')}
            autoComplete="name"
            value={name}
            maxLength={NAME_MAX}
            readOnly={readOnly}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="flex flex-col gap-1">
            <FormField
              label={t('editProfile.username')}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={handle}
              maxLength={24}
              readOnly={readOnly}
              error={
                check === 'invalid' || check === 'taken' ? t(`editProfile.${check}`) : undefined
              }
              onChange={(event) => setHandle(event.target.value.toLowerCase().replace(/^@/, ''))}
            />
            {check === 'available' || check === 'checking' ? (
              <p
                role="status"
                className={cn(
                  'text-sm',
                  check === 'available' ? 'text-link' : 'text-muted-foreground',
                )}
              >
                {t(`editProfile.${check}`)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <FormField
              label={t('editProfile.bio')}
              value={bio}
              maxLength={BIO_MAX}
              readOnly={readOnly}
              onChange={(event) => setBio(event.target.value)}
            />
            <p className="self-end text-sm text-muted-foreground tabular-nums">
              {t('editProfile.count', { count: bio.length, max: BIO_MAX })}
            </p>
          </div>
        </Group>
      </form>
      <EmailRow readOnly={readOnly} />
      <PhotoSheet open={photo} onOpenChange={setPhoto} hasPhoto={profile.avatar !== null} />
    </SettingsScreen>
  )
}

/** Where the handle typed stands: the one held, not one, being checked, free or taken. */
function useHandleCheck(
  handle: string,
  held: string | null,
  available: (handle: string) => Promise<{ ok: true; value: boolean } | { ok: false }>,
): HandleCheck {
  const [answer, setAnswer] = useState<{ handle: string; free: boolean } | null>(null)
  const same = handle === (held ?? '')
  const valid = handle === '' || HANDLE.test(handle)
  useEffect(() => {
    if (same || !valid || handle === '') return
    let current = true
    const timer = setTimeout(() => {
      void available(handle).then((result) => {
        if (current && result.ok) setAnswer({ handle, free: result.value })
      })
    }, SETTLE_MS)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [handle, same, valid, available])
  if (same || handle === '') return 'same'
  if (!valid) return 'invalid'
  if (answer?.handle !== handle) return 'checking'
  return answer.free ? 'available' : 'taken'
}

/** The account's email; a new one is confirmed by the link sent to it. */
function EmailRow({ readOnly }: { readOnly: boolean }) {
  const { t } = useTranslation('account')
  const { account, auth } = useAccount()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  if (!account) return null
  return (
    <Group title={t('editProfile.email')}>
      <p className="flex items-center gap-2 px-1 wrap-anywhere text-muted-foreground">
        <Mail aria-hidden className="size-4 shrink-0" />
        {account.email}
      </p>
      <div className="flex items-end gap-2">
        <FormField
          className="min-w-0 flex-1"
          label={t('editProfile.newEmail')}
          type="email"
          autoComplete="email"
          value={email}
          readOnly={readOnly}
          onChange={(event) => {
            setEmail(event.target.value)
            setSent(false)
          }}
        />
        <Button
          type="button"
          size="lg"
          className="h-12"
          disabled={readOnly || !email.includes('@') || email === account.email}
          onClick={() =>
            void auth.updateEmail(email.trim()).then((result) => {
              setSent(result.ok)
              if (!result.ok) say(t('editProfile.failed'))
            })
          }
        >
          {t('editProfile.sendLink')}
        </Button>
      </div>
      {sent ? (
        <p role="status" className="text-sm text-link">
          {t('editProfile.emailSent')}
        </p>
      ) : null}
    </Group>
  )
}

/** Change photo: Upload photo, the twelve built-in pictures, Remove photo. */
function PhotoSheet({
  open,
  onOpenChange,
  hasPhoto,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  hasPhoto: boolean
}) {
  const { t } = useTranslation('account')
  const { save, uploadAvatar, removeAvatar } = useLearnerProfile()
  const file = useRef<HTMLInputElement>(null)
  const done = (ok: boolean) => {
    if (!ok) return say(t('editProfile.photoFailed'))
    say(t('editProfile.saved'))
    onOpenChange(false)
  }
  const choose = async (picture: Blob) => {
    const made = await avatarOf(picture)
    if (!made) return done(false)
    done((await uploadAvatar(made)).ok)
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('editProfile.changePhoto')}>
        <div className="flex flex-col gap-5 pb-2">
          <input
            ref={file}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const picked = event.target.files?.[0]
              event.target.value = ''
              if (picked) void choose(picked)
            }}
          />
          <Group flush>
            <RowButton
              title={t('editProfile.upload')}
              icon={ImageUp}
              paint="sky"
              onClick={() => file.current?.click()}
            />
          </Group>
          <Group title={t('editProfile.pictures')}>
            <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {(Object.keys(BUILT_IN_AVATARS) as BuiltInAvatar[]).map((id) => (
                <li key={id} className="grid place-items-center">
                  <button
                    type="button"
                    aria-label={t(`editProfile.avatars.${id}`)}
                    className="rounded-pill focus-visible:outline-offset-2"
                    onClick={() => void save({ avatar: id }).then((result) => done(result.ok))}
                  >
                    <Avatar name={null} picture={id} size="row" />
                  </button>
                </li>
              ))}
            </ul>
          </Group>
          {hasPhoto ? (
            <Group flush>
              <RowButton
                title={t('editProfile.removePhoto')}
                icon={Trash2}
                paint="sand"
                onClick={() => void removeAvatar().then((result) => done(result.ok))}
              />
            </Group>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
