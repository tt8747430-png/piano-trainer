import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PASSING_CATEGORIES, passingChords, type Chord, type Key } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'
import { changesOf } from '../model/between'
import { SuggestionCard } from './SuggestionCard'

/**
 * Passing chords, a section of a progression's page (the board's BETWEEN62): the ways that lead from
 * the row's first change of chord into the next, one card of play rows in their category's order,
 * each played voice-led on the keys at the top.
 */
export function ProgressionBetween({
  chords,
  musicKey,
  onShow,
}: {
  chords: readonly Chord[]
  musicKey: Key
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  const [at] = changesOf(chords)
  const from = at === undefined ? undefined : chords[at]
  const to = at === undefined ? undefined : chords[at + 1]
  const ways = from && to ? passingChords(from, to, musicKey) : []
  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-2">
      <h3 id={`${id}-title`} className="font-sans text-sm font-semibold text-foreground">
        {t('progressions.between.title')}
      </h3>
      {from && to && ways.length > 0 ? (
        <ul className="card overflow-hidden">
          {PASSING_CATEGORIES.flatMap((category) =>
            ways.filter((way) => way.category === category),
          ).map((way) => (
            <SuggestionCard key={way.kind} way={way} from={from} to={to} onShow={onShow} />
          ))}
        </ul>
      ) : (
        <p className="text-[0.9375rem] text-muted-foreground">{t('progressions.between.none')}</p>
      )}
    </section>
  )
}
