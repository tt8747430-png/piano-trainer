import { useTranslation } from 'react-i18next'
import { noteName, type FoundChord, type Midi } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ChordHeading } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { readingAt, type Finding } from '../model/finding'
import { chordLabel, useChordAbout } from './use-chord-about'

/** Where the chord shown comes from: keys held on the keyboard, the chord last played, keys tapped. */
export type ChordSource = 'held' | 'last' | 'tapped'

/** A small, quiet line naming where the chord comes from; a live dot while keys are held. */
function SourceLine({ source, children }: { source: ChordSource; children?: string }) {
  const { t } = useTranslation('practice')
  return (
    <p className="flex items-center gap-2 text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          'size-2 rounded-full',
          source === 'held' ? 'bg-learned motion-safe:animate-pulse' : 'bg-muted-foreground',
        )}
      />
      {[t(`chordFinder.state.${source}`), children].filter(Boolean).join(' · ')}
    </p>
  )
}

/**
 * What the keys make (ADR 0054), as large as the page allows: the chord's symbol in the reading chosen,
 * what it is and leaves out, and every other reading to choose from (its notes by degree are on the
 * keys); else the note, the interval (a 5th as its power chord), or no chord.
 */
export function ChordName({
  finding,
  keys,
  source,
  reading,
  onReading,
  slash,
  keysFolded,
}: {
  finding: Finding
  keys: readonly Midi[]
  source: ChordSource
  /** The reading chosen, by its place among the chord's readings. */
  reading: number
  onReading: (at: number) => void
  /** An inversion named over its bass; else by its root, its inversion said. */
  slash: boolean
  /** The page's keys are folded away: a chord comes from a MIDI keyboard, or the keys come back. */
  keysFolded: boolean
}) {
  const { t } = useTranslation(['practice', 'music'])
  switch (finding.kind) {
    case 'empty':
      return (
        <p className="max-w-[20ch] font-display text-3xl text-balance text-muted-foreground">
          {t(keysFolded ? 'practice:chordFinder.promptFolded' : 'practice:chordFinder.prompt')}
        </p>
      )
    case 'note':
      return (
        <div className="flex flex-col gap-1">
          <h2 className="text-7xl">{noteName(finding.note)}</h2>
          <SourceLine source={source}>{t('practice:chordFinder.note')}</SourceLine>
        </div>
      )
    case 'interval':
      return (
        <div className="flex flex-col gap-1">
          <h2 className={finding.power ? 'text-7xl' : 'text-5xl'}>
            {finding.power ?? t(`music:interval.${finding.interval}.name`)}
          </h2>
          <SourceLine source={source}>
            {finding.power
              ? `${t('practice:chordFinder.powerChord')} · ${t(`music:interval.${finding.interval}.name`)}`
              : undefined}
          </SourceLine>
        </div>
      )
    case 'none':
      return (
        <div className="flex flex-col gap-1">
          <p className="font-display text-3xl text-balance">{t('practice:chordFinder.none')}</p>
          <SourceLine source={source} />
        </div>
      )
    case 'chord':
      return (
        <Found
          keys={keys}
          readings={finding.readings}
          reading={reading}
          source={source}
          onReading={onReading}
          slash={slash}
        />
      )
  }
}

/** A chord found: its symbol, what it is, and its other readings (its notes are on the keys). */
function Found({
  keys,
  readings,
  reading,
  source,
  onReading,
  slash,
}: {
  keys: readonly Midi[]
  readings: readonly [FoundChord, ...FoundChord[]]
  reading: number
  source: ChordSource
  onReading: (at: number) => void
  slash: boolean
}) {
  const { t } = useTranslation('practice')
  const shown = readingAt(readings, reading)
  const about = useChordAbout()(shown, { keys, slash })
  // Each reading once by how it is written: by its root alone, two inversions may read alike.
  const listed = readings.flatMap((each, at) =>
    readings.findIndex((other) => chordLabel(other, slash) === chordLabel(each, slash)) === at
      ? [{ at, label: chordLabel(each, slash) }]
      : [],
  )
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <ChordHeading symbol={chordLabel(shown, slash)} />
        <SourceLine source={source}>{about.join(' · ')}</SourceLine>
      </div>
      {listed.length > 1 ? (
        <div className="flex flex-col gap-2">
          <h3 className="font-sans text-sm font-medium text-muted-foreground">
            {t('chordFinder.readings')}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {listed.map(({ at, label }) => (
              <li key={label}>
                <Toggle
                  pressed={label === chordLabel(shown, slash)}
                  aria-label={t('chordFinder.reading', { symbol: label })}
                  onPressedChange={() => onReading(at)}
                  className="min-w-14 font-display text-lg font-semibold"
                >
                  {label}
                </Toggle>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
