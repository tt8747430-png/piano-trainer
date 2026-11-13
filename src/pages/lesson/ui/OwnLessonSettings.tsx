import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useOwnLessonsStoreApi, type OwnLesson } from '@/entities/own-lessons'
import { useProgressStoreApi } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import {
  deleteOwnLesson,
  duplicateOwnLesson,
  renameOwnLesson,
  restoreOwnLesson,
} from '@/features/manage-own-lessons'
import { ResetStepsRow, resetSteps, restoreSteps } from '@/features/reset-progress'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, say, ScreenHeader } from '@/shared/ui'
import { OwnDeleteGroup, OwnItemRows } from '@/widgets/curriculum'

/**
 * A lesson of the learner's own's Settings (R30-5), the same page as a level's lesson's: how lessons
 * read; The lesson, Rename and Duplicate (the copy opened); its Progress reset; and Delete last, at
 * once with Undo, its progress going with it. No Share link: the lesson lives on the learner's devices.
 */
export function OwnLessonSettings({
  lesson,
  reading,
}: {
  lesson: OwnLesson
  /** How lessons read: its home is every lesson's Settings. */
  reading: ReactNode
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const navigate = useNavigate()
  const store = useOwnLessonsStoreApi()
  const progress = useProgressStoreApi()
  const title = localText(lesson.title, locale)
  const step = lessonStepId(lesson.id)
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={<BackButton />} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="-mt-2 px-1 text-muted-foreground text-pretty">{title}</p>
        {reading}
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
        />
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
            void navigate({ to: '/', replace: true })
            const deleted = deleteOwnLesson(store, lesson.id)
            if (!deleted) return
            const forgotten = resetSteps(progress, [step])
            say(t('own.deleted', { title }), {
              label: t('settings.undo'),
              onClick: () => {
                restoreOwnLesson(store, deleted)
                restoreSteps(progress, forgotten)
              },
            })
          }}
        />
      </div>
    </div>
  )
}
