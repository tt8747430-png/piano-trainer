import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSE_WEEKS, courseIds, SHELVES, type Shelf } from '@/entities/course'
import { STAGES, type Stage } from '@/entities/step'
import { useCreateCourse } from '@/features/edit-original'
import { ChoiceChips, NewSheet, SheetPart, Stepper } from '@/shared/ui'

/**
 * An editor's New course (ADR 0116, round 25), the app's New sheet: its name; its shelf and its
 * level as chips; its length a step at a time; Create course makes it on the server unpublished and
 * opens the course editor on it.
 */
export function NewCourseSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const create = useCreateCourse()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [shelf, setShelf] = useState<Shelf>('beginner')
  const [stage, setStage] = useState<Stage>('beginner')
  const [weeks, setWeeks] = useState(4)
  const [creating, setCreating] = useState(false)
  const [failed, setFailed] = useState(false)
  const make = async () => {
    setCreating(true)
    setFailed(false)
    const made = await create({ name, shelf, stage, weeks }, [...courseIds(), 'new'])
    setCreating(false)
    if (!made.ok) return setFailed(true)
    onOpenChange(false)
    await navigate({ to: '/courses/$courseId/edit', params: { courseId: made.value } })
  }
  return (
    <NewSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('learn:edit.course.new')}
      nameLabel={t('learn:edit.course.name')}
      name={name}
      onName={setName}
      hint={t('learn:edit.course.newInfo')}
      createLabel={t('learn:edit.course.create')}
      creatingLabel={t('learn:edit.course.creating')}
      creating={creating}
      failed={failed ? t('learn:edit.course.createFailed') : null}
      onCreate={() => void make()}
    >
      <SheetPart title={t('learn:edit.course.shelf')}>
        <ChoiceChips
          label={t('learn:edit.course.shelf')}
          value={shelf}
          options={SHELVES.map((value) => ({ value, label: t(`learn:shelves.${value}`) }))}
          onChange={setShelf}
        />
      </SheetPart>
      <SheetPart title={t('learn:edit.course.stage')}>
        <ChoiceChips
          label={t('learn:edit.course.stage')}
          value={stage}
          options={STAGES.map((value) => ({ value, label: t(`common:stage.${value}`) }))}
          onChange={setStage}
        />
      </SheetPart>
      <SheetPart title={t('learn:edit.course.weeks')}>
        <Stepper
          label={t('learn:edit.course.weeks')}
          value={weeks}
          min={COURSE_WEEKS[0] ?? 1}
          max={COURSE_WEEKS.at(-1) ?? 24}
          format={(count) => t('learn:course.weekCount', { count })}
          decrease={t('learn:edit.course.fewerWeeks')}
          increase={t('learn:edit.course.moreWeeks')}
          onChange={setWeeks}
        />
      </SheetPart>
    </NewSheet>
  )
}
