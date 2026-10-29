import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateProgression } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, InfoTip, NameField, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * An editor's new progression (content as data, ADR 0116): its name, then Create, which makes it on
 * the server unpublished and opens the progression editor on it.
 */
export function NewProgressionPage() {
  const { t } = useTranslation('practice')
  const { account } = useAccount()
  const create = useCreateProgression()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [failed, setFailed] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '' || creating) return
    setCreating(true)
    setFailed(false)
    const made = await create(name)
    setCreating(false)
    if (!made.ok) return setFailed(true)
    await navigate({
      to: '/practice/progressions/$progressionId/edit',
      params: { progressionId: made.value },
    })
  }
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('progressions.edit.new')}
        back={<BackButton fallback={{ to: '/practice/progressions' }} />}
        actions={
          <InfoTip name={t('progressions.edit.new')}>{t('progressions.edit.newInfo')}</InfoTip>
        }
      />
      {editsContent(account) ? (
        <form onSubmit={(event) => void submit(event)} className="flex max-w-xl flex-col gap-5">
          <NameField
            label={t('progressions.edit.name')}
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            type="submit"
            size="lg"
            className="self-start"
            disabled={name.trim() === '' || creating}
          >
            <Plus data-icon="inline-start" aria-hidden />
            {creating ? t('progressions.edit.creating') : t('progressions.edit.create')}
          </Button>
          {failed ? (
            <p role="alert" className="text-sm text-destructive">
              {t('progressions.edit.createFailed')}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="text-muted-foreground">{t('progressions.edit.editorsOnly')}</p>
      )}
    </div>
  )
}
