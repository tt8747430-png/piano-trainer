import { useNavigate } from '@tanstack/react-router'
import { Book } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOwnLessonsStoreApi, type OwnLesson } from '@/entities/own-lessons'
import { useProgressStoreApi } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { duplicateOwnLesson, renameOwnLesson } from '@/features/manage-own-lessons'
import { ResetStepsRow } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { type SettingsWindowState } from '@/shared/lib'
import { say, sayUndo, SettingsWindow, ThingHead } from '@/shared/ui'
import { deleteOwn, InCoursesRow, OwnDeleteGroup, OwnItemRows } from '@/widgets/curriculum'

/**
 * A lesson of the learner's own's Settings (R30-5), the same shape as a level's lesson's (the board's
 * THINGSET): the lesson at the head; The lesson, Rename, In courses and Duplicate (the copy opened); its Progress reset; and Delete last, at
 * once with Undo, its progress going with it. No Share link: the lesson lives on the learner's devices.
 */
export function OwnLessonSettings({
  lesson,
  open,
  onOpenChange,
}: { lesson: OwnLesson } & SettingsWindowState) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  const title = localText(lesson.title, locale)
  const step = lessonStepId(lesson.id)
  return (
    <SettingsWindow open={open} onOpenChange={onOpenChange} title={t('settings.title')}>
      <div className="flex flex-col gap-6">
        <ThingHead
          mark={
            <span className="grid size-16 shrink-0 place-items-center rounded-pill bg-card ring-1 ring-border ring-inset">
              <Book aria-hidden className="size-6" />
            </span>
          }
          name={title}
          line={t('own.lessonLine', { count: lesson.sections.length })}
        />
        <OwnItemRows
          title={title}
          words={{ group: t('settings.lesson'), rename: t('own.renameLesson') }}
          onRename={(name) => renameOwnLesson(store, lesson.id, name)}
          onDuplicate={() => {
            const copy = duplicateOwnLesson(store, lesson.id, t('own.copyName', { name: title }))
            if (!copy) return
            say(t('own.duplicated'))
            void navigate({ to: '/lessons/$lessonId', params: { lessonId: copy } })
          }}
        >
          <InCoursesRow lessonId={lesson.id} />
        </OwnItemRows>
        <ResetStepsRow
          steps={[step]}
          words={{
            row: t('settings.reset'),
            done: t('settings.resetDone'),
            undo: t('settings.undo'),
          }}
        />
        <OwnDeleteGroup
          words={{
            delete: t('own.deleteLesson'),
          }}
          onDelete={() => {
            void navigate({ to: '/your-lessons', replace: true })
            const deleted = deleteOwn(store, progress, { lessons: [lesson.id] })
            if (deleted) sayUndo(t('own.deleted', { title }), deleted.undo)
          }}
        />
      </div>
    </SettingsWindow>
  )
}
