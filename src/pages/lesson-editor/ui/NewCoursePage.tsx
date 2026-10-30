import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSE_WEEKS, courseIds, SHELVES, type Shelf } from '@/entities/course'
import { STAGES, type Stage } from '@/entities/step'
import { useCreateCourse } from '@/features/edit-original'
import { editsContent, useAccount } from '@/shared/lib/account'
import { BackButton, Dropdown, Fab, FloatingActions, InfoTip, ScreenHeader } from '@/shared/ui'
import { DocTitleField, NotOpen, Properties, PropertyRow } from '@/widgets/content-editor'

/**
 * An editor's new course (ADR 0116), written as the course editor's document: its name as the
 * heading, its shelf, level and length as properties; Create floats, making it on the server
 * unpublished and opening the course editor on it.
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
  const formId = useId()
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader
        title={t('learn:edit.course.new')}
        back={<BackButton fallback={{ to: '/', search: { view: 'courses', journey: '' } }} />}
        actions={
          <InfoTip name={t('learn:edit.course.new')} bar>
            {t('learn:edit.course.newInfo')}
          </InfoTip>
        }
      />
      {editsContent(account) ? (
        <form id={formId} onSubmit={(event) => void submit(event)} className="flex flex-col gap-6">
          {/* Written as the course's page will read: its name as the heading, no box round it. */}
          <DocTitleField
            label={t('learn:edit.course.name')}
            value={name}
            placeholder={t('learn:edit.doc.courseTitle')}
            onChange={setName}
          />
          <Properties label={t('learn:edit.doc.properties')}>
            <PropertyRow name={t('learn:edit.course.shelf')}>
              <Dropdown
                bare
                className="max-w-full"
                label={t('learn:edit.course.shelf')}
                value={shelf}
                options={SHELVES.map((value) => ({ value, label: t(`learn:shelves.${value}`) }))}
                onChange={setShelf}
              />
            </PropertyRow>
            <PropertyRow name={t('learn:edit.course.stage')}>
              <Dropdown
                bare
                className="max-w-full"
                label={t('learn:edit.course.stage')}
                value={stage}
                options={STAGES.map((value) => ({ value, label: t(`common:stage.${value}`) }))}
                onChange={setStage}
              />
            </PropertyRow>
            <PropertyRow name={t('learn:edit.course.weeks')}>
              <Dropdown
                bare
                className="max-w-full"
                label={t('learn:edit.course.weeks')}
                value={weeks}
                options={COURSE_WEEKS.map((value) => ({
                  value,
                  label: t('learn:course.weekCount', { count: value }),
                }))}
                onChange={setWeeks}
              />
            </PropertyRow>
          </Properties>
          {failed ? (
            <p role="alert" className="text-sm text-destructive">
              {t('learn:edit.course.createFailed')}
            </p>
          ) : null}
          {/* Create, the page's one action, floats as every screen's does. */}
          <FloatingActions>
            <Fab
              extended
              type="submit"
              form={formId}
              label={creating ? t('learn:edit.course.creating') : t('learn:edit.course.create')}
              icon={Plus}
              disabled={name.trim() === '' || creating}
            />
          </FloatingActions>
        </form>
      ) : (
        <NotOpen line={t('learn:edit.course.editorsOnly')} />
      )}
    </div>
  )
}
