import { Link } from '@tanstack/react-router'
import { Check, Library } from 'lucide-react'
import { useRender } from '@base-ui/react/use-render'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ownCourseLessons,
  selectOwnCourses,
  selectOwnLessons,
  useOwnLessons,
} from '@/entities/own-lessons'
import { selectLearned, useProgress } from '@/entities/progress'
import { lessonStepId } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { useFold } from '@/features/fold-section'
import { FoldSection, LessonIcon, OpensMark, PAINT, SeeAll } from '@/shared/ui'

/** How many of the learner's own Learn shows; the rest are on their page. */
const SHOWN = 3

/** The canvas's OWNROW tile: a course on sage, 11 round, its books; a lesson a 40 ringed circle; a learned one sage with a check. */
function OwnTile({ kind }: { kind: 'course' | 'lesson' | 'learned' }) {
  return (
    <span aria-hidden className="grid size-11 shrink-0 place-items-center">
      <span
        className={cn(
          'grid place-items-center [&_svg]:size-5',
          kind === 'course'
            ? cn('size-11 rounded-[11px] text-foreground', PAINT.grass.fill)
            : kind === 'learned'
              ? cn('size-10 rounded-pill', PAINT.grass.fill, PAINT.grass.ink)
              : 'size-10 rounded-pill bg-card text-foreground ring-1 ring-border ring-inset',
        )}
      >
        {kind === 'course' ? (
          <Library />
        ) : kind === 'learned' ? (
          <Check strokeWidth={2.6} />
        ) : (
          <LessonIcon />
        )}
      </span>
    </span>
  )
}

/** One of the learner's own as Learn lists it: a 64 row on a phone, a card on a laptop, the whole of it the link. */
function OwnLink({ link, children }: { link: ReactElement; children: ReactNode }) {
  return useRender({
    render: link,
    props: {
      className:
        'group flex min-h-16 items-center gap-3 px-3 py-2 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 lg:card lg:py-2.5',
      children,
    },
  })
}

/**
 * Made by you (the canvas's OWNGROUP), Learn's last group: the newest of the learner's own, courses
 * first, each its tile, its name and what it holds ("Course · 4 lessons · 1 learned", "Lesson · 2
 * sections"); See all opens their page. On a phone one card of 64 rows with chevrons; on a laptop as
 * many cards across as fit at 240, each ending where its words end. New is the page's floating +
 * (one way to each act). Nothing shows while the learner has made nothing.
 */
export function OwnItems() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const fold = useFold('learn.own')
  const lessons = useOwnLessons(selectOwnLessons)
  const courses = useOwnLessons(selectOwnCourses)
  const learned = useProgress(selectLearned)
  if (lessons.length + courses.length === 0) return null
  const shownCourses = courses.toReversed().slice(0, SHOWN)
  const shownLessons = lessons.toReversed().slice(0, SHOWN - shownCourses.length)
  const rows = [
    ...shownCourses.map((course) => {
      const listed = ownCourseLessons(course, lessons)
      const done = listed.filter(
        ({ lesson }) => learned[lessonStepId(lesson.id)] !== undefined,
      ).length
      const facts = [
        t('own.course'),
        t('course.lessonCount', { count: listed.length }),
        ...(done > 0 ? [t('own.learnedCount', { count: done })] : []),
      ]
      return {
        key: course.id,
        link: <Link to="/courses/$courseId" params={{ courseId: course.id }} />,
        kind: 'course' as const,
        title: course.title,
        detail: facts.join(' · '),
      }
    }),
    ...shownLessons.map((lesson) => ({
      key: lesson.id,
      link: <Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} />,
      kind:
        learned[lessonStepId(lesson.id)] === undefined ? ('lesson' as const) : ('learned' as const),
      title: localText(lesson.title, locale),
      detail: `${t('kind.lesson')} · ${t('own.sectionCount', { count: lesson.sections.length })}`,
    })),
  ]
  return (
    <FoldSection
      title={t('own.title')}
      fold={fold}
      className="min-w-0"
      action={<SeeAll label={t('seeAll')} render={<Link to="/your-lessons" />} />}
    >
      <ul className="flex flex-col rows-hairline overflow-hidden card lg:grid lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] lg:gap-4 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:[&>li]:after:hidden">
        {rows.map((row) => (
          <li key={row.key}>
            <OwnLink link={row.link}>
              <OwnTile kind={row.kind} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-semibold text-pretty">{row.title}</span>
                <span className="text-sm text-muted-foreground">{row.detail}</span>
              </span>
              <span className="lg:hidden">
                <OpensMark />
              </span>
            </OwnLink>
          </li>
        ))}
      </ul>
    </FoldSection>
  )
}
