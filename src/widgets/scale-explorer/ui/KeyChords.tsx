import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { chordSymbol, type Midi, type PlacedScaleChord, type Tone } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are outlined and named.
 */
export function KeyChords({
  chords,
  tones,
  listening,
  note,
  holding,
}: {
  chords: readonly PlacedScaleChord[]
  tones: readonly Tone[]
  listening: boolean
  note: Midi | null
  holding: readonly PlacedScaleChord[]
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const playback = usePlayback<string>()
  const holds = new Set(holding.map((placed) => placed.roman))
  const said =
    note === null
      ? ''
      : holding.length === 0
        ? t('holdsNone', { note: heardName(note, tones) })
        : t('holds', {
            note: heardName(note, tones),
            chords: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
              holding.map((placed) => chordSymbol(placed.chord)),
            ),
          })
  return (
    <section aria-label={t('chordsIn')} className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
        {chords.map(({ roman, chord, tones: placed }) => (
          <Button
            key={roman}
            variant="outline"
            aria-pressed={playback.playing === roman}
            data-holds={holds.has(roman) ? '' : undefined}
            className="relative h-auto min-h-16 flex-col gap-0 px-1 py-2 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground data-holds:ring-3 data-holds:ring-ring data-holds:ring-inset"
            onClick={() =>
              playback.toggle(
                roman,
                chordSounds(
                  placed.map((tone) => tone.midi),
                  { arpeggio: false },
                ),
              )
            }
          >
            {playback.playing === roman ? (
              <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" />
            ) : null}
            <span className="max-w-full font-display text-xl leading-tight font-semibold wrap-anywhere">
              {chordSymbol(chord)}
            </span>
            <span className="text-sm text-muted-foreground">{roman}</span>
          </Button>
        ))}
      </div>
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
