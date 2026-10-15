import { useDeferredValue, useEffect, useId, useMemo, useRef } from 'react'
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
import { LazyScoreView } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { findChord, type Finding } from '../model/finding'
import { BAR_TICKS, trailMusic } from '../model/trail-music'
import { useChordAbout } from './use-chord-about'

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
 * in order. Where the chords are not remembered, it writes the one chord down now.
 */
export function ChordTrail({
  chords,
  musicKey,
  remember,
}: {
  chords: readonly (readonly Midi[])[]
  musicKey: Key
  remember: boolean
}) {
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  const id = useId()
  // Engraved after the key a tap put down is painted: a busy phone keeps its keys quick.
  const shown = useDeferredValue(chords)
  const names = useMemo(
    () =>
      shown.map((keys): Said => {
        const finding: Finding = findChord(keys, musicKey)
        switch (finding.kind) {
          case 'chord': {
            const [best] = finding.readings
            const detail = about(best).join(' · ')
            return { symbol: best.symbol, detail, heard: `${best.symbol} ${detail}`.trim() }
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
    [shown, musicKey, t, about],
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
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 card p-4">
      <h2 id={id} className="text-2xl">
        {remember ? t('practice:chordFinder.played') : t('practice:chordFinder.staff')}
      </h2>
      <div
        ref={scroller}
        className="max-w-full overflow-x-auto overscroll-x-contain pt-14 scrollbar-none"
      >
        <LazyScoreView score={score} timeBefore={NO_TIME} scale={1.35}>
          {(layout) => <BarNames layout={layout} names={names} />}
        </LazyScoreView>
      </div>
      {chords.length === 0 ? (
        <p className="text-muted-foreground">
          {remember ? t('practice:chordFinder.playedEmpty') : t('practice:chordFinder.staffEmpty')}
        </p>
      ) : (
        <ol className="sr-only">
          {names.map((name, i) => (
            <li key={i}>{name.heard}</li>
          ))}
        </ol>
      )}
    </section>
  )
}
