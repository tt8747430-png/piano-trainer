import { Link } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { BOOK_IDS, EXERCISE_BOOKS, exercisesIn } from '@/entities/exercise'
import { selectMetronome, selectTuner, useSettings } from '@/entities/settings'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowLink, ScreenHeader, SettingsGroup, type Tile } from '@/shared/ui'
import { PlaceActions } from '@/widgets/app-nav'
import {
  PRACTICE_GROUPS,
  PRACTICE_PAGES,
  usePageWords,
  type PracticePageId,
} from '@/widgets/practice-pages'
import { PageCard } from './PageCard'

/** One place Practice lists: a page, or a book of exercises opening the library at its place. */
interface Place {
  key: string
  title: string
  detail: string
  tile: Tile
  link: ReactElement
}

/** Practice's groups, each its places in order: Theory, Exercises by book, the Tools last. */
function useGroups(): readonly {
  id: 'theory' | 'exercises' | 'tools'
  places: readonly Place[]
}[] {
  const { t } = useTranslation('practice')
  const words = usePageWords()
  const metronome = useSettings(selectMetronome)
  const { a4 } = useSettings(selectTuner)
  const page = (id: PracticePageId): Place => {
    const { to, tile } = PRACTICE_PAGES[id]
    const detail =
      id === 'metronome'
        ? t('toolValue.metronome', { bpm: metronome.bpm, meter: metronome.meter })
        : id === 'tuner'
          ? t('toolValue.tuner', { hz: a4 })
          : words(id).about
    return {
      key: id,
      title: words(id).title,
      detail,
      tile,
      link: <Link to={to} state={OPEN_PLAINLY} />,
    }
  }
  const pagesOf = (id: 'theory' | 'tools'): readonly Place[] =>
    (PRACTICE_GROUPS.find((group) => group.id === id)?.pages ?? []).map(page)
  return [
    { id: 'theory', places: pagesOf('theory') },
    {
      id: 'exercises',
      places: BOOK_IDS.map((book) => ({
        key: book,
        title: t(`exercises.groups.${book}`),
        detail: t('exercises.count', { count: exercisesIn(book).length }),
        tile: EXERCISE_BOOKS[book],
        link: <Link to="/practice/exercises" search={{ place: book }} state={OPEN_PLAINLY} />,
      })),
    },
    { id: 'tools', places: pagesOf('tools') },
  ]
}

/**
 * Practice (canvas 160): Theory, the pages that explain a thing and practise it there; Exercises, by
 * book; the Tools last. Each group is one card of rows on a phone and cards five across on a laptop,
 * each with its picture, name and line.
 */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const groups = useGroups()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} large tools={<PlaceActions />} />
      {groups.map(({ id, places }) => (
        <SettingsGroup key={id} title={t(`groups.${id}`)} bare>
          <ul className="flex flex-col overflow-hidden card lg:hidden [&>li]:flex [&>li>*]:flex-1 [&>li:not(:first-child)>*]:rounded-t-none [&>li:not(:last-child)>*]:rounded-b-none">
            {places.map(({ key, title, detail, tile, link }) => (
              <li key={key}>
                <RowLink title={title} detail={detail} {...tile} render={link} />
              </li>
            ))}
          </ul>
          <ul className="hidden grid-cols-5 gap-3 lg:grid">
            {places.map(({ key, ...place }) => (
              <li key={key} className="flex [&>a]:flex-1">
                <PageCard {...place} />
              </li>
            ))}
          </ul>
        </SettingsGroup>
      ))}
    </div>
  )
}
