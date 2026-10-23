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
import { PlayButton, type ShownKeys } from '@/shared/ui'
import { ArrowDown, ArrowUp, Layers, type LucideIcon } from 'lucide-react'
import { intervalExample, tonesText } from '../model/interval-example'
import { TappableStaff } from './TappableStaff'

/** A card's staff, a little smaller than an explorer's own. */
const CARD_STAFF = 0.8
/** Each way to hear an interval as its picture: the high note after the low, before it, or with it. */
const WAY_ICON: Readonly<Record<IntervalWay, LucideIcon>> = {
  up: ArrowUp,
  down: ArrowDown,
  together: Layers,
}

/** A note tapped on the card's staff sounds at this tempo's half note. */
const NOTE_TEMPO = 72

/**
 * One interval over a root, as Clefs' reference writes it: its name and short name, its size and how
 * it sounds in a line, the two notes on a staff and beside them Up, Down and Together as pictures,
 * each shown on the page's keys.
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
  const { t } = useTranslation('music')
  const titleId = useId()
  const playback = usePlayback<IntervalWay>()
  const example = useMemo(() => intervalExample(noteFromParam(root), name), [root, name])
  const score = useMemo(() => notate(example.music), [example])
  const interval = INTERVALS[name]
  const size = [
    t('intervalCard.semitones', { n: interval.semitones }),
    interval.semitones === 1
      ? t('intervalCard.semitone')
      : t('intervalCard.tones', {
          count: interval.semitones / 2,
          n: tonesText(interval.semitones),
        }),
  ]
  return (
    <article aria-labelledby={titleId} className="flex h-full flex-col gap-3 card p-4">
      <header className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-xl">
          {t(`interval.${name}.name`)}
        </h3>
        <span className="shrink-0 font-semibold text-muted-foreground">
          {t(`interval.${name}.short`)}
        </span>
      </header>
      <p className="-mt-2 text-sm text-pretty text-muted-foreground">
        {[
          ...size,
          t(`consonance.${consonanceOf(interval)}`),
          ...(interval.semitones > 12
            ? [t('intervalCard.inChords', { degree: interval.degree })]
            : []),
        ].join(' · ')}
      </p>
      {/* The two notes, and the three ways to hear them beside them, each its picture. */}
      <div className="mt-auto flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <TappableStaff
            music={example.music}
            score={score}
            staff="treble"
            scale={CARD_STAFF}
            tempo={NOTE_TEMPO}
            onShow={onShow}
          />
        </div>
        <div className="flex shrink-0 gap-1.5 pb-2">
          {INTERVAL_WAYS.map((way) => (
            <PlayButton
              key={way}
              label={t(`intervalCard.${way}`)}
              icon={WAY_ICON[way]}
              playing={playback.playing === way}
              onClick={() => {
                onShow(example.shown)
                playback.toggle(way, () => intervalSounds(example.low, example.high, way))
              }}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
