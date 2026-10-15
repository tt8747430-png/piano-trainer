import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordInKey,
  chordSymbol,
  PASSING_CATEGORIES,
  passingChords,
  type Chord,
  type Key,
  type PassingChords,
} from '@/shared/lib/music'
import { Dropdown, Labelled, type ShownKeys } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { changesOf } from '../model/between'
import { SuggestionCard } from './SuggestionCard'

/**
 * Between (ADR 0052): the passing chords from one chord of the row to the next, the pair chosen from
 * the row's changes, by category, each way voice-led and played on the keys pinned above; with In the
 * key only, the ways whose chords are all the key's.
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
  if (chosen === undefined || !from || !to) return null
  const allInKey = (way: PassingChords) => way.chords.every((chord) => chordInKey(chord, musicKey))
  const ways = passingChords(from, to, musicKey).filter((way) => !inKey || allInKey(way))
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-2xl">
          {t('progressions.between.title')}
        </h2>
        <p className="max-w-prose text-muted-foreground">{t('progressions.between.about')}</p>
      </div>
      <div className="grid-fields gap-x-10 gap-y-5">
        <Labelled label={t('progressions.between.pair')}>
          <Dropdown
            label={t('progressions.between.pair')}
            bare
            value={chosen}
            options={changes.map((place) => ({
              value: place,
              label: `${chordSymbol(chords[place] ?? from)} → ${chordSymbol(chords[place + 1] ?? to)}`,
            }))}
            onChange={(between) => onChange({ between })}
          />
        </Labelled>
        <Toggle
          className="self-end justify-self-start"
          pressed={inKey}
          onPressedChange={(next) => onChange({ inKey: next || undefined })}
        >
          {t('passingChords.onlyInKey')}
        </Toggle>
      </div>
      {ways.length === 0 ? (
        <p className="text-muted-foreground">{t('passingChords.noneInKey')}</p>
      ) : null}
      {PASSING_CATEGORIES.map((category) => {
        const inCategory = ways.filter((way) => way.category === category)
        return inCategory.length > 0 ? (
          <section
            key={category}
            aria-labelledby={`${id}-${category}`}
            className="flex flex-col gap-3"
          >
            <h3 id={`${id}-${category}`} className="text-xl">
              {t(`passingChords.category.${category}`)}
            </h3>
            <div className="grid-fields gap-4">
              {inCategory.map((way) => (
                <SuggestionCard
                  key={way.kind}
                  way={way}
                  from={from}
                  to={to}
                  inKey={allInKey(way)}
                  onShow={onShow}
                />
              ))}
            </div>
          </section>
        ) : null
      })}
    </section>
  )
}
