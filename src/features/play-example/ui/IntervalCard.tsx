import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  consonanceOf,
  INTERVALS,
  noteFromParam,
  type NoteParam,
  type ReferenceInterval,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { INTERVAL_WAYS, intervalSounds, type IntervalWay } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView, PlayLabel, type ShownKeys } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { intervalExample, tonesText } from '../model/interval-example'

/** A card's staff, a little smaller than an explorer's own. */
const CARD_STAFF = 0.8

/**
 * One interval over a root, as Clefs' reference writes it: its name and short name, its size and how
 * it sounds, the two notes on a staff, and Up, Down and Together, each shown on the page's keys.
 */
export function IntervalCard({
  root,
  name,
  onShow,
}: {
  root: NoteParam
  name: ReferenceInterval
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const titleId = useId()
  const playback = usePlayback<IntervalWay>()
  const example = useMemo(() => intervalExample(noteFromParam(root), name), [root, name])
  const score = useMemo(() => notate(example.music), [example])
  const interval = INTERVALS[name]
  const size = [
    t('learn:intervals.semitones', { n: interval.semitones }),
    t('learn:intervals.tones', { n: tonesText(interval.semitones) }),
  ]
  return (
    <article aria-labelledby={titleId} className="flex h-full flex-col gap-3 card p-4">
      <header className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-xl">
          {t(`music:interval.${name}.name`)}
        </h3>
        <span className="shrink-0 font-semibold text-muted-foreground">
          {t(`music:interval.${name}.short`)}
        </span>
      </header>
      {/* A line each, so the cards of a row keep their staves level. */}
      <div className="text-sm text-muted-foreground">
        <p>{size.join(' · ')}</p>
        <p>{t(`music:consonance.${consonanceOf(interval)}`)}</p>
        {interval.semitones > 12 ? (
          <p>{t('learn:intervals.inChords', { degree: interval.degree })}</p>
        ) : null}
      </div>
      <LazyScoreView score={score} scale={CARD_STAFF} staff="treble" />
      <div className="mt-auto flex gap-2">
        {INTERVAL_WAYS.map((way) => (
          <Button
            key={way}
            variant="soft"
            className="flex-1 px-2"
            onClick={() => {
              onShow(example.shown)
              playback.toggle(way, () => intervalSounds(example.low, example.high, way))
            }}
          >
            <PlayLabel playing={playback.playing === way}>{t(`learn:intervals.${way}`)}</PlayLabel>
          </Button>
        ))}
      </div>
    </article>
  )
}
