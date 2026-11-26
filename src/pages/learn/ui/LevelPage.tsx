import { useParams, useSearch } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useCan } from '@/entities/library'
import { journeyById, type Journey } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { useSetSearch } from '@/shared/lib'
import { BackButton, ScreenHeader, PageName } from '@/shared/ui'
import { LevelEditor, LevelLessons, type LearnEdit } from '@/widgets/curriculum'

/**
 * A level's page (the LearnLevel boards), opened from Learn's Levels. On a phone the bar holds Back
 * and, for an editor, Edit; the level's name is the page's serif heading under it, as a lesson's and
 * a course's. On a laptop the 88 bar names it beside Back and the page starts on the title's edge:
 * its head as wide as a line of reading, then the chapters, each lesson row ending where its words
 * end, three across. One column with one focus: no side Continue or Levels (they repeated the path's
 * Next and Learn's Levels, one Back away). Edit becomes Done in its place (R29 B4, EDITR).
 */
export function LevelPage() {
  const { levelId } = useParams({ from: '/shell/levels/$levelId' })
  const journey = journeyById(levelId)
  // The route finds no level that is not there.
  return journey ? <Level key={journey.id} journey={journey} /> : null
}

function Level({ journey }: { journey: Journey }) {
  const locale = useLocale()
  const { edit } = useSearch({ from: '/shell/levels/$levelId' })
  const show = useSetSearch<LearnEdit>()
  const editable = useCan('reorder', { curriculum: 'level' })
  const editing = edit && editable
  const title = localText(journey.title, locale)
  const bar = (actions: ReactNode) => (
    <ScreenHeader
      title={title}
      large
      titleOnPage="phone"
      back={<BackButton />}
      // The level's Publish, the glass word just before Done while editing (EDITR).
      edit={
        editable
          ? {
              editing,
              onEdit: () => show({ edit: true }),
              onDone: () => show({ edit: false }),
              publish: actions,
            }
          : undefined
      }
    />
  )
  if (editing)
    return (
      <div className="flex flex-col pb-8">
        <LevelEditor journey={journey} bar={bar} />
      </div>
    )
  return (
    <div className="flex flex-col pb-8">
      {bar(null)}
      {/* On a laptop the column starts on the title's edge, 16 under the head, as the board's LearnLevel. */}
      <div className="mt-1 flex min-w-0 flex-col gap-4 lg:mt-6 lg:ps-10">
        <PageName className="lg:hidden">{title}</PageName>
        <LevelLessons journey={journey} />
      </div>
    </div>
  )
}
