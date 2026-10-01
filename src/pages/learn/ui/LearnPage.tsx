import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useViewChange, OPEN_PLAINLY } from '@/shared/lib'
import { LEARN_TILES, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import type { LearnFilter } from '../model/learn-filter'
import { LessonsColumn } from './LessonsColumn'

/** Learn's references and tools, each a row with its page's title and tile. */
const REFERENCES = [
  { to: '/learn/chords', title: 'chords', tile: 'chords' },
  { to: '/learn/scales', title: 'scales', tile: 'scales' },
  { to: '/learn/keys', title: 'keys.title', tile: 'keys' },
  { to: '/learn/intervals', title: 'intervals.title', tile: 'intervals' },
  { to: '/learn/tensions', title: 'tensions.title', tile: 'tensions' },
  { to: '/learn/patterns', title: 'patterns.title', tile: 'patterns' },
] as const
const TOOLS = [
  { to: '/learn/chord-finder', title: 'finder.title', tile: 'chordFinder' },
  { to: '/learn/reharmonise', title: 'reharmonise.title', tile: 'reharmonise' },
  { to: '/learn/passing-chords', title: 'passing.title', tile: 'passingChords' },
  { to: '/learn/progressions', title: 'progressions.title', tile: 'progressions' },
] as const

/** Learn: the lessons by module, filtered by level and category; beside them the references and tools. */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const filter = useSearch({ from: '/shell/learn' })
  const onChange = useViewChange<LearnFilter>()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('learn:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <LessonsColumn filter={filter} onChange={onChange} />
        <div className="flex flex-col gap-8">
          <RowGroup title={t('learn:references')}>
            {REFERENCES.map((row) => (
              <li key={row.to}>
                <RowLink
                  title={t(`learn:${row.title}`)}
                  {...LEARN_TILES[row.tile]}
                  render={<Link to={row.to} state={OPEN_PLAINLY} />}
                />
              </li>
            ))}
          </RowGroup>
          <RowGroup title={t('learn:tools')}>
            {TOOLS.map((row) => (
              <li key={row.to}>
                <RowLink
                  title={t(`learn:${row.title}`)}
                  {...LEARN_TILES[row.tile]}
                  render={<Link to={row.to} state={OPEN_PLAINLY} />}
                />
              </li>
            ))}
          </RowGroup>
        </div>
      </div>
    </div>
  )
}
