import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateProgression } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, Fab, FloatingActions, InfoTip, ScreenHeader } from '@/shared/ui'
import { DocTitleField, NotOpen } from '@/widgets/content-editor'

/**
 * An editor's new progression (content as data, ADR 0116): its name written as its page's heading;
 * Create floats, making it on the server unpublished and opening the progression editor on it.
 */
export function NewProgressionPage() {
  const { t } = useTranslation('practice')
  const { account } = useAccount()
  const create = useCreateProgression()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [failed, setFailed] = useState(false)
  const formId = useId()
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('progressions.edit.new')}
        back={<BackButton fallback={{ to: '/practice/progressions' }} />}
        actions={
          <InfoTip name={t('progressions.edit.new')} bar>
            {t('progressions.edit.newInfo')}
          </InfoTip>
        }
      />
      {editsContent(account) ? (
        <form id={formId} onSubmit={(event) => void submit(event)} className="flex flex-col gap-6">
          <DocTitleField
            label={t('progressions.edit.name')}
            value={name}
            placeholder={t('progressions.edit.name')}
            onChange={setName}
          />
          {failed ? (
            <p role="alert" className="text-sm text-destructive">
              {t('progressions.edit.createFailed')}
            </p>
          ) : null}
          {/* Create, the page's one action, floats as every screen's does. */}
          <FloatingActions>
            <Fab
              extended
              type="submit"
              form={formId}
              label={creating ? t('progressions.edit.creating') : t('progressions.edit.create')}
              icon={Plus}
              disabled={name.trim() === '' || creating}
            />
          </FloatingActions>
        </form>
      ) : (
        <NotOpen line={t('progressions.edit.editorsOnly')} />
      )}
    </div>
  )
}
