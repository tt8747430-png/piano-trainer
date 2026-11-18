import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordInKey,
  PASSING_CATEGORIES,
  passingChords,
  printedChord,
  type Chord,
  type Key,
  type PassingChords,
} from '@/shared/lib/music'
import { Dropdown, type ShownKeys } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { changesOf } from '../model/between'
import { SuggestionCard } from './SuggestionCard'

/**
 * Passing chords, a section of a progression's page (canvas 177): the chords that lead from one chord
 * of the row to the next, the pair chosen from the row's changes, each way a card in its category's
 * order, played voice-led on the keys at the top; with In the key only, the ways all in the key.
 */
export function ProgressionBetween({
  chords,
  musicKey,
  at,
  inKey,
  onChange,
  onShow,
}: {
  chords: readonly Chord[]
  musicKey: Key
  /** The chord the ways lead from, by its place in the row; the row's first change when none is chosen. */
  at: number | undefined
  inKey: boolean
  onChange: (change: { between?: number; inKey?: boolean }) => void
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const id = useId()
  const changes = changesOf(chords)
  const chosen = at !== undefined && changes.includes(at) ? at : changes[0]
  const from = chosen === undefined ? undefined : chords[chosen]
  const to = chosen === undefined ? undefined : chords[chosen + 1]
  const heading = (
    <h3 id={`${id}-title`} className="font-sans text-sm font-semibold text-foreground">
      {t('progressions.between.title')}
    </h3>
  )
  if (chosen === undefined || !from || !to)
    return (
      <section aria-labelledby={`${id}-title`} className="flex flex-col gap-2">
        {heading}
        <p className="text-[0.9375rem] text-muted-foreground">{t('progressions.between.none')}</p>
      </section>
    )
  const allInKey = (way: PassingChords) => way.chords.every((chord) => chordInKey(chord, musicKey))
  const ways = passingChords(from, to, musicKey).filter((way) => !inKey || allInKey(way))
  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-2">
      {heading}
      <div className="flex flex-wrap items-center gap-3">
        <Dropdown
          label={t('progressions.between.pair')}
          value={chosen}
          options={changes.map((place) => ({
            value: place,
            label: `${printedChord(chords[place] ?? from)} → ${printedChord(chords[place + 1] ?? to)}`,
          }))}
          onChange={(between) => onChange({ between })}
        />
        <Toggle pressed={inKey} onPressedChange={(next) => onChange({ inKey: next || undefined })}>
          {t('passingChords.onlyInKey')}
        </Toggle>
      </div>
      {ways.length === 0 ? (
        <p className="text-[0.9375rem] text-muted-foreground">{t('passingChords.noneInKey')}</p>
      ) : null}
      {PASSING_CATEGORIES.flatMap((category) =>
        ways.filter((way) => way.category === category),
      ).map((way) => (
        <SuggestionCard
          key={way.kind}
          way={way}
          from={from}
          to={to}
          inKey={allInKey(way)}
          onShow={onShow}
        />
      ))}
    </section>
  )
}
