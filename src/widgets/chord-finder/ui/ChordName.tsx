import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { printedNote, printedSymbol, type FoundChord, type Midi } from '@/shared/lib/music'
import { GroupChips } from '@/shared/ui'
import { readingAt, toneOfKey, type Finding } from '../model/finding'
import { chordLabel, useChordAbout } from './use-chord-about'

/** Where the chord shown comes from: keys held on the keyboard, the chord last played, keys tapped. */
export type ChordSource = 'held' | 'last' | 'tapped'

/** The page's name and the line under it, as the canvas's Chord finder sets them: large, bold, at the left. */
function Named({ name, line, quiet = false }: { name: ReactNode; line?: string; quiet?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <h2
        className={cn(
          'font-sans text-[2.75rem] leading-[1.05] font-bold tracking-[-0.02em] text-balance lg:text-[4rem]',
          quiet && 'text-[2.25rem] lg:text-[3rem]',
        )}
      >
        {name}
      </h2>
      {line ? (
        <p className="ms-0.5 text-[0.9375rem] text-pretty text-muted-foreground">{line}</p>
      ) : null}
    </div>
  )
}

/**
 * What the keys make (ADR 0052; canvas 181), large at the page's left: the chord's symbol in the
 * reading chosen and what it is in words; else the note, the interval (a 5th as its power chord), or
 * no chord; empty, what to do. A name is printed as the sheets print a chord (`C♯m7`, `F♯`).
 */
export function ChordName({
  finding,
  keys,
  reading,
  slash,
  keysFolded,
}: {
  finding: Finding
  keys: readonly Midi[]
  /** The reading chosen, by its place among the chord's readings. */
  reading: number
  /** An inversion named over its bass; else by its root, its inversion said. */
  slash: boolean
  /** The page's keys are folded away: a chord comes from a MIDI keyboard, or the keys come back. */
  keysFolded: boolean
}) {
  const { t } = useTranslation(['practice', 'music'])
  const about = useChordAbout()
  switch (finding.kind) {
    case 'empty':
      return (
        <Named
          name={t('practice:chordFinder.promptTitle')}
          line={t(keysFolded ? 'practice:chordFinder.promptFolded' : 'practice:chordFinder.prompt')}
        />
      )
    case 'note':
      return <Named name={printedNote(finding.note)} line={t('practice:chordFinder.note')} />
    case 'interval':
      return finding.power ? (
        <Named
          name={printedSymbol(finding.power)}
          line={`${t('practice:chordFinder.powerChord')} · ${t(`music:interval.${finding.interval}.name`)}`}
        />
      ) : (
        <Named name={t(`music:interval.${finding.interval}.name`)} />
      )
    case 'none':
      return <Named name={t('practice:chordFinder.none')} quiet />
    case 'chord': {
      const shown = readingAt(finding.readings, reading)
      return (
        <Named
          name={printedSymbol(chordLabel(shown, slash))}
          line={about(shown, { keys, slash }).join(' · ')}
        />
      )
    }
  }
}

/**
 * The chord's notes as tiles, lowest first, as the canvas draws them: each its note large and its
 * degree under it, the bass said so.
 */
export function ChordNotes({ found, keys }: { found: FoundChord; keys: readonly Midi[] }) {
  const { t } = useTranslation('practice')
  const seen = new Set<string>()
  const tiles = [...keys]
    .sort((a, b) => a - b)
    .flatMap((key, place) => {
      const tone = toneOfKey(found, key)
      if (!tone || seen.has(tone.degree)) return []
      seen.add(tone.degree)
      return [{ note: printedNote(tone.note), degree: tone.degree, bass: place === 0 }]
    })
  return (
    <ul
      aria-label={t('chordFinder.notes')}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${Math.min(tiles.length, 6)}, minmax(0, 1fr))` }}
    >
      {tiles.map((tile) => (
        <li
          key={tile.degree}
          className="flex h-18 flex-col items-center justify-center rounded-xl bg-card ring-1 ring-border"
        >
          <span className="text-2xl font-bold">{tile.note}</span>
          <span className="text-xs text-muted-foreground">
            {tile.bass ? t('chordFinder.bassDegree', { degree: tile.degree }) : tile.degree}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The chord's other readings (Also read as), each a chip that makes it the one shown, the chosen in ink. */
export function ChordReadings({
  readings,
  reading,
  slash,
  onReading,
}: {
  readings: readonly [FoundChord, ...FoundChord[]]
  reading: number
  slash: boolean
  onReading: (at: number) => void
}) {
  const { t } = useTranslation('practice')
  const shown = chordLabel(readingAt(readings, reading), slash)
  // Each reading once by how it is written: by its root alone, two inversions may read alike.
  const listed = readings.flatMap((each, at) =>
    readings.findIndex((other) => chordLabel(other, slash) === chordLabel(each, slash)) === at
      ? [{ at, label: chordLabel(each, slash) }]
      : [],
  )
  if (listed.length < 2) return null
  return (
    <GroupChips label={t('chordFinder.readings')}>
      {listed.map(({ at, label }) => (
        <button
          key={label}
          type="button"
          aria-pressed={label === shown}
          aria-label={t('chordFinder.reading', { symbol: printedSymbol(label) })}
          onClick={() => onReading(at)}
          className="flex h-11 items-center rounded-pill px-3 text-[0.9375rem] font-semibold transition-colors hover:bg-foreground/[0.06] aria-pressed:bg-foreground aria-pressed:text-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {printedSymbol(label)}
        </button>
      ))}
    </GroupChips>
  )
}
