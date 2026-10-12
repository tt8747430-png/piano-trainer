import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { lessonById, nextLesson } from '@/entities/lesson'
import { LEVEL_NAME } from '@/entities/path'
import { lessonLearnedId } from '@/entities/progress'
import { LearnedButton } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, PAGE_TILES, RowLink, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/**
 * A lesson: its title and summary and what its examples do, then the lesson itself, and at its end
 * Learned and the next lesson.
 */
export function LessonPage() {
  const { t } = useTranslation(['common', 'learn'])
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const lesson = lessonById(lessonId)
  if (!lesson) return null
  const next = nextLesson(lesson.id)
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<BackButton fallback={{ to: '/learn' }} />}
      />
      <p className="-mt-3 max-w-prose text-lg text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <p className="-mt-2 text-muted-foreground">
        {t(`common:levelName.${LEVEL_NAME[lesson.level]}`)} ·{' '}
        {t(`learn:category.${lesson.category}`)}
      </p>
      <p className="max-w-prose text-muted-foreground print:hidden">{t('learn:example.tapHint')}</p>
      <LessonView key={lesson.id} lesson={lesson} />
      {/* Read to its end, the lesson is marked learned here (Learn shows it), and the next one opens. */}
      <footer className="mt-6 flex max-w-prose flex-col gap-4 border-t border-border pt-8 print:hidden">
        <div className="self-start">
          <LearnedButton step={lessonLearnedId(lesson.id)} />
        </div>
        {next ? (
          <div className="card">
            <RowLink
              title={localText(next.title, locale)}
              detail={t('learn:example.next')}
              icon={PAGE_TILES.lesson.icon}
              paint={PAGE_TILES.lesson.paint}
              render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: next.id }} />}
            />
          </div>
        ) : null}
      </footer>
    </div>
  )
}
