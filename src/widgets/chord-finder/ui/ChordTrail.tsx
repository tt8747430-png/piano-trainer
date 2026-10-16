import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  noteName,
  pitchClass,
  spellInKey,
  type Key,
  type Midi,
  type TimeSignature,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { cn } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { findChord, type Finding } from '../model/finding'
import { BAR_TICKS, trailMusic } from '../model/trail-music'
import { chordLabel, useChordAbout } from './use-chord-about'

/** Four beats a bar, never printed: each chord is a whole note on its own. */
const NO_TIME: TimeSignature = { count: 4, unit: 4 }

/** A chord played in words: its symbol over its bar, a line under it, and all of it for a screen reader. */
interface Said {
  readonly symbol: string
  readonly detail: string
  readonly heard: string
}

/** Over each bar, its chord's name and the line under it; the newest in full ink, the rest quieter. */
function BarNames({ layout, names }: { layout: ScoreLayout; names: readonly Said[] }) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full h-12">
      {names.map((name, i) => (
        <span
          key={i}
          className={
            i === names.length - 1
              ? 'absolute bottom-0.5 flex flex-col whitespace-nowrap'
              : 'absolute bottom-0.5 flex flex-col whitespace-nowrap text-muted-foreground'
          }
          style={{ left: xAtTick(layout, i * BAR_TICKS) }}
        >
          <span className="font-display text-lg font-semibold">{name.symbol}</span>
          <span className="text-xs text-muted-foreground">{name.detail}</span>
        </span>
      ))}
    </div>
  )
}

/**
 * The chords played (ADR 0054), oldest first, each a whole note in a bar of its own on a grand staff,
 * spelled in the key chosen and named over its bar, the newest last; for a screen reader, the names
 * in order, as wide as its bars. Where the chords are not remembered, it writes the one chord down
 * now; nothing at all before a chord is played.
 */
export function ChordTrail({
  chords,
  musicKey,
  remember,
  slash,
}: {
  chords: readonly (readonly Midi[])[]
  musicKey: Key
  remember: boolean
  /** An inversion named over its bass; else by its root. */
  slash: boolean
}) {
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  // Engraved after the key a tap put down is painted: a busy phone keeps its keys quick.
  const shown = useDeferredValue(chords)
  const names = useMemo(
    () =>
      shown.map((keys): Said => {
        const finding: Finding = findChord(keys, musicKey)
        switch (finding.kind) {
          case 'chord': {
            const [best] = finding.readings
            // Under its bar, what the chord is; how the keys lay it out is the name's to say.
            const detail = about(best, { slash }).join(' · ')
            const symbol = chordLabel(best, slash)
            return { symbol, detail, heard: `${symbol} ${detail}`.trim() }
          }
          case 'interval':
            return {
              symbol: finding.power ?? t(`music:interval.${finding.interval}.short`),
              detail: '',
              heard: t(`music:interval.${finding.interval}.name`),
            }
          case 'note':
            return { symbol: noteName(finding.note), detail: '', heard: noteName(finding.note) }
          default:
            return {
              symbol: '',
              detail: '',
              heard: keys.map((each) => noteName(spellInKey(pitchClass(each), musicKey))).join(' '),
            }
        }
      }),
    [shown, musicKey, t, about, slash],
  )
  const score = useMemo(
    () =>
      notate(
        trailMusic(
          shown,
          musicKey,
          names.map((name) => name.symbol),
        ),
      ),
    [shown, musicKey, names],
  )
  // The newest chord stays in sight as the trail grows past the screen's width.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = scroller.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [shown.length])
  // Nothing played: no staff, the page's prompt says what to do.
  if (chords.length === 0) return null
  return (
    <section
      aria-label={remember ? t('practice:chordFinder.played') : t('practice:chordFinder.staff')}
      className="w-fit max-w-full self-start card px-3 pb-2"
    >
      <div
        ref={scroller}
        className={cn(
          'max-w-full overflow-x-auto overscroll-x-contain scrollbar-none',
          remember && 'pt-12',
        )}
      >
        {/* One chord alone is named over the page already: only a trail names its bars. */}
        <LazyScoreView score={score} timeBefore={NO_TIME} scale={1.1}>
          {remember ? (layout) => <BarNames layout={layout} names={names} /> : undefined}
        </LazyScoreView>
      </div>
      <ol className="sr-only">
        {names.map((name, i) => (
          <li key={i}>{name.heard}</li>
        ))}
      </ol>
    </section>
  )
}
