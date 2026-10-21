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
import { cn, keyListParam } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { findChord, readingAt, type Finding } from '../model/finding'
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

/** The two staves' lines, top to bottom, and where each clef sits, in the drawing's units. */
const TREBLE_LINES = [20, 30, 40, 50, 60]
const BASS_LINES = [100, 110, 120, 130, 140]

/** A grand staff with nothing on it yet, faint: where the chords played will be written. */
function EmptyStaff({ label }: { label: string }) {
  return (
    <section aria-label={label} className="w-full max-w-sm text-muted-foreground/45">
      <svg aria-hidden viewBox="0 0 320 160" className="h-32 w-full" preserveAspectRatio="none">
        {[...TREBLE_LINES, ...BASS_LINES].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="currentColor" strokeWidth="1" />
        ))}
        <line x1="0.5" x2="0.5" y1="20" y2="140" stroke="currentColor" />
        <line x1="319.5" x2="319.5" y1="20" y2="140" stroke="currentColor" />
        <text x="6" y="58" fontFamily="Noto Music" fontSize="46" fill="currentColor">
          𝄞
        </text>
        <text x="6" y="122" fontFamily="Noto Music" fontSize="40" fill="currentColor">
          𝄢
        </text>
      </svg>
    </section>
  )
}

/**
 * The chords played (ADR 0054), oldest first, each a whole note in a bar of its own on a grand staff,
 * spelled in the key chosen and named over its bar, the newest last; for a screen reader, the names
 * in order, as wide as its bars. Where the chords are not remembered, it writes the one chord down
 * now; before a chord is played, an empty grand staff.
 */
export function ChordTrail({
  chords,
  musicKey,
  remember,
  slash,
  chosen,
}: {
  chords: readonly (readonly Midi[])[]
  musicKey: Key
  remember: boolean
  /** An inversion named over its bass; else by its root. */
  slash: boolean
  /** The reading chosen for the chord shown: the newest bar, where it holds those keys, is named so. */
  chosen?: { readonly keys: readonly Midi[]; readonly at: number }
}) {
  // By value: the keys shown are a new list on each render.
  const chosenKeys = chosen ? keyListParam(chosen.keys) : undefined
  const chosenAt = chosen?.at ?? 0
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  // Engraved after the key a tap put down is painted: a busy phone keeps its keys quick.
  const shown = useDeferredValue(chords)
  const names = useMemo(
    () =>
      shown.map((keys, i): Said => {
        const finding: Finding = findChord(keys, musicKey)
        switch (finding.kind) {
          case 'chord': {
            const newest = i === shown.length - 1 && keyListParam(keys) === chosenKeys
            const best = readingAt(finding.readings, newest ? chosenAt : 0)
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
    [shown, musicKey, t, about, slash, chosenKeys, chosenAt],
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
  const name = remember ? t('practice:chordFinder.played') : t('practice:chordFinder.staff')
  // Nothing played: the grand staff waits, its lines faint, for the first chord.
  if (chords.length === 0) return <EmptyStaff label={name} />
  return (
    <section aria-label={name} className="max-w-full">
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
