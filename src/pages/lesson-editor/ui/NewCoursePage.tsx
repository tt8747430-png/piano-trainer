import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSE_WEEKS, courseIds, SHELVES, type Shelf } from '@/entities/course'
import { STAGES, type Stage } from '@/entities/step'
import { useCreateCourse } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, Dropdown, InfoTip, NameField, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * An editor's new course (ADR 0116): its name, shelf, level and length, then Create, which makes it
 * on the server unpublished and opens the course editor on it.
 */
export function NewCoursePage() {
  const { t } = useTranslation(['learn', 'common'])
  const { account } = useAccount()
  const create = useCreateCourse()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [shelf, setShelf] = useState<Shelf>('beginner')
  const [stage, setStage] = useState<Stage>('beginner')
  const [weeks, setWeeks] = useState(4)
  const [creating, setCreating] = useState(false)
  const [failed, setFailed] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '' || creating) return
    setCreating(true)
    setFailed(false)
    const made = await create({ name, shelf, stage, weeks }, [...courseIds(), 'new'])
    setCreating(false)
    if (!made.ok) return setFailed(true)
    await navigate({ to: '/courses/$courseId/edit', params: { courseId: made.value } })
  }
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:edit.course.new')}
        back={<BackButton fallback={{ to: '/', search: { view: 'courses', journey: '' } }} />}
        actions={
          <InfoTip name={t('learn:edit.course.new')}>{t('learn:edit.course.newInfo')}</InfoTip>
        }
      />
      {editsContent(account) ? (
        <form onSubmit={(event) => void submit(event)} className="flex max-w-xl flex-col gap-5">
          <NameField
            label={t('learn:edit.course.name')}
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Dropdown
              label={t('learn:edit.course.shelf')}
              value={shelf}
              options={SHELVES.map((value) => ({ value, label: t(`learn:shelves.${value}`) }))}
              onChange={setShelf}
            />
            <Dropdown
              label={t('learn:edit.course.stage')}
              value={stage}
              options={STAGES.map((value) => ({ value, label: t(`common:stage.${value}`) }))}
              onChange={setStage}
            />
            <Dropdown
              label={t('learn:edit.course.weeks')}
              value={weeks}
              options={COURSE_WEEKS.map((value) => ({
                value,
                label: t('learn:course.weekCount', { count: value }),
              }))}
              onChange={setWeeks}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="self-start"
            disabled={name.trim() === '' || creating}
          >
            <Plus data-icon="inline-start" aria-hidden />
            {creating ? t('learn:edit.course.creating') : t('learn:edit.course.create')}
          </Button>
          {failed ? (
            <p role="alert" className="text-sm text-destructive">
              {t('learn:edit.course.createFailed')}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="text-muted-foreground">{t('learn:edit.course.editorsOnly')}</p>
      )}
    </div>
  )
}
