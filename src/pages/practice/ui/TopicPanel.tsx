import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PROGRESSIONS, STUDIES } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { OPEN_PLAINLY } from '@/shared/lib'
import { PAGE_TILES, RowGroup, RowLink } from '@/shared/ui'
import { ExerciseList } from '@/widgets/exercise-list'
import { PieceList } from '@/widgets/piece-list'
import { TrainerList } from '@/widgets/trainer-list'
import { TOPICS, type Explorer, type PracticeTopic } from '../model/topics'

/** Each explorer's page, named by its own title and wearing its own tile. */
const EXPLORER = {
  chords: { to: '/practice/chords', title: 'chords', tile: PAGE_TILES.chords },
  chordFinder: {
    to: '/practice/chord-finder',
    title: 'finder.title',
    tile: PAGE_TILES.chordFinder,
  },
  tensions: { to: '/practice/tensions', title: 'tensions.title', tile: PAGE_TILES.tensions },
  scales: { to: '/practice/scales', title: 'scales', tile: PAGE_TILES.scales },
  intervals: { to: '/practice/intervals', title: 'intervals.title', tile: PAGE_TILES.intervals },
  progressions: {
    to: '/practice/progressions',
    title: 'progressions.title',
    tile: PAGE_TILES.progressions,
  },
  passingChords: {
    to: '/practice/passing-chords',
    title: 'passing.title',
    tile: PAGE_TILES.passingChords,
  },
  reharmonise: {
    to: '/practice/reharmonise',
    title: 'reharmonise.title',
    tile: PAGE_TILES.reharmonise,
  },
  patterns: { to: '/practice/patterns', title: 'patterns.title', tile: PAGE_TILES.patterns },
} as const satisfies Record<Explorer, object>

const PIECES = { studies: STUDIES, progressions: PROGRESSIONS } as const

/** A topic: its pages to explore, its trainers, then what it plays in the Player, exercises before pieces. */
export function TopicPanel({ topic }: { topic: PracticeTopic }) {
  const { t } = useTranslation(['practice', 'learn'])
  const locale = useLocale()
  const { explore, quiz, play, pieces } = TOPICS[topic]
  const collection = pieces ? PIECES[pieces] : null
  return (
    <div className="flex flex-col gap-8">
      {explore.length > 0 ? (
        <RowGroup title={t('practice:explore')}>
          {explore.map((id) => {
            const { to, title, tile } = EXPLORER[id]
            return (
              <li key={id}>
                <RowLink
                  title={t(`learn:${title}`)}
                  {...tile}
                  render={<Link to={to} state={OPEN_PLAINLY} />}
                />
              </li>
            )
          })}
        </RowGroup>
      ) : null}
      {quiz.length > 0 ? <TrainerList trainers={quiz} /> : null}
      <ExerciseList groups={play} />
      {collection ? (
        <PieceList
          groups={[
            {
              id: collection.id,
              heading: localText(collection.name, locale),
              entries: collection.entries,
            },
          ]}
        />
      ) : null}
    </div>
  )
}
