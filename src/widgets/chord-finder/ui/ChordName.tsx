import { useTranslation } from 'react-i18next'
import { noteName, type FoundChord, type Midi } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ChordHeading, ToneChip } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { readingAt, toneOfKey, type Finding } from '../model/finding'
import { useChordAbout } from './use-chord-about'

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
 * what it is and leaves out, its notes from the bass up by degree, and every other reading to choose
 * from; else the note, the interval (a 5th as its power chord), or no chord.
 */
export function ChordName({
  finding,
  keys,
  source,
  reading,
  onReading,
}: {
  finding: Finding
  keys: readonly Midi[]
  source: ChordSource
  /** The reading chosen, by its place among the chord's readings. */
  reading: number
  onReading: (at: number) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  switch (finding.kind) {
    case 'empty':
      return (
        <p className="max-w-[20ch] font-display text-3xl text-balance text-muted-foreground">
          {t('practice:chordFinder.prompt')}
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
        />
      )
  }
}

/** A chord found: its symbol, what it is, its notes by degree, and its other readings. */
function Found({
  keys,
  readings,
  reading,
  source,
  onReading,
}: {
  keys: readonly Midi[]
  readings: readonly [FoundChord, ...FoundChord[]]
  reading: number
  source: ChordSource
  onReading: (at: number) => void
}) {
  const { t } = useTranslation('practice')
  const shown = readingAt(readings, reading)
  const about = useChordAbout()(shown)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <ChordHeading symbol={shown.symbol} />
        <SourceLine source={source}>{about.join(' · ')}</SourceLine>
      </div>
      <ol aria-label={t('chordFinder.tones')} className="flex flex-wrap gap-2">
        {keys.map((key) => {
          const tone = toneOfKey(shown, key)
          return tone ? (
            <li key={key}>
              <ToneChip face={tone.role} degree={tone.degree} note={noteName(tone.note)} />
            </li>
          ) : null
        })}
      </ol>
      {readings.length > 1 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">{t('chordFinder.readings')}</h3>
          <ul className="flex flex-wrap gap-2">
            {readings.map((each, at) => (
              <li key={each.symbol}>
                <Toggle
                  pressed={each === shown}
                  aria-label={t('chordFinder.reading', { symbol: each.symbol })}
                  onPressedChange={() => onReading(at)}
                  className="min-w-14 font-display text-lg font-semibold"
                >
                  {each.symbol}
                </Toggle>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
