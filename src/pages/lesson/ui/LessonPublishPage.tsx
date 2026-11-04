import { Link, useParams } from '@tanstack/react-router'
import { BookOpenText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LESSONS, lessonById, lessonPlace, type Lesson } from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, TileMark } from '@/shared/ui'
import { DraftPublishScreen } from '@/widgets/content-editor'

/** A level's lesson's Publish page (`/lessons/$lessonId/publish`, R29 B6), an editor's. */
export function LessonPublishPage() {
  const { lessonId } = useParams({ from: '/shell/lessons/$lessonId/publish' })
  const lesson = lessonById(lessonId)
  // The route finds no lesson that no level has.
  if (!lesson) return null
  return <LessonPublish key={lessonId} lesson={lesson} id={lessonId} />
}

function LessonPublish({ lesson, id }: { lesson: Lesson; id: string }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useLessonDraft(lesson, id)
  const written = draft.load.state === 'ready' ? draft.load.value : lesson
  const title = localText(written.title, locale)
  const place = lessonPlace(id)
  return (
    <DraftPublishScreen
      kind="lesson"
      id={id}
      draft={draft}
      title={title}
      path={`/lessons/${id}`}
      view={<Link to="/lessons/$lessonId" params={{ lessonId: id }} />}
      unreadable={t('edit.unreadable')}
      back={<BackButton />}
      removable={!LESSONS.some((each) => each.id === id)}
      preview={
        <div className="card flex min-h-16 items-center gap-3 p-2">
          <TileMark icon={BookOpenText} paint="sky" />
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold text-balance">{title}</span>
            {place ? (
              <span className="text-sm text-muted-foreground">
                {localText(place.journey.title, locale)} · {localText(place.chapter.title, locale)}
              </span>
            ) : null}
          </span>
        </div>
      }
    />
  )
}
