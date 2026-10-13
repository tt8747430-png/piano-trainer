import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  lessonById,
  lessonsIn,
  nextLesson,
  previousLesson,
  tabOf,
  useModuleName,
  type Lesson,
} from '@/entities/lesson'
import { LEVEL_NAME } from '@/entities/path'
import { lessonLearnedId } from '@/entities/progress'
import { LearnedButton } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, PAGE_TILES, RowLink, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** Learn as it shows a lesson's module: its tab, the module open. */
const moduleOnLearn = (lesson: Lesson) =>
  ({ to: '/learn', search: { tab: tabOf(lesson.module), open: lesson.module } }) as const

/**
 * A lesson: where it is (its module, a link to it on Learn, and its number in it), its title and
 * summary and what its examples do, then the lesson itself, and at its end Learned and the lessons
 * either side of it along its track (ADR 0042); a course's last leads back to the course's list.
 */
export function LessonPage() {
  const { t } = useTranslation(['common', 'learn'])
  const locale = useLocale()
  const moduleName = useModuleName()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const lesson = lessonById(lessonId)
  if (!lesson) return null
  const inModule = lessonsIn(lesson.module)
  const previous = previousLesson(lesson.id)
  const next = nextLesson(lesson.id)
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<BackButton fallback={moduleOnLearn(lesson)} />}
      />
      <nav aria-label={t('learn:placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        <Link
          {...moduleOnLearn(lesson)}
          className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {moduleName(lesson.module)}
        </Link>{' '}
        ·{' '}
        {t('learn:place', {
          n: inModule.indexOf(lesson) + 1,
          total: inModule.length,
        })}
      </nav>
      <p className="max-w-prose text-lg text-muted-foreground">
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
        <ul className="flex flex-col gap-2 *:card">
          {next ? (
            <li>
              <RowLink
                title={localText(next.title, locale)}
                detail={t('learn:example.next')}
                icon={ArrowRight}
                paint={PAGE_TILES.lesson.paint}
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: next.id }} />}
              />
            </li>
          ) : (
            <li>
              <RowLink
                title={t('learn:example.allLessons', { module: moduleName(lesson.module) })}
                icon={List}
                paint={PAGE_TILES.lesson.paint}
                render={<Link {...moduleOnLearn(lesson)} />}
              />
            </li>
          )}
          {previous ? (
            <li>
              <RowLink
                title={localText(previous.title, locale)}
                detail={t('learn:example.previous')}
                icon={ArrowLeft}
                paint={PAGE_TILES.lesson.paint}
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: previous.id }} />}
              />
            </li>
          ) : null}
        </ul>
      </footer>
    </div>
  )
}
