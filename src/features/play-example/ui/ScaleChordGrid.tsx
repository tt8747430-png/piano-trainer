import type { PlacedScaleChord } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton } from '@/shared/ui'

/** A chord's play is its own: after a size or an inversion changes, no chord of the new ones is pressed. */
const idOf = (placed: PlacedScaleChord) =>
  `${placed.chord.degree} ${placed.symbol} ${placed.tones.map((tone) => tone.midi).join('-')}`

/**
 * A scale's or a key's chords to tap in a grid, each its symbol over its numeral, pressed while it
 * sounds; those whose degree is in `holds` (they hold the note heard) ringed.
 */
export function ScaleChordGrid({
  chords,
  holds,
}: {
  chords: readonly PlacedScaleChord[]
  holds?: ReadonlySet<number>
}) {
  const playback = usePlayback<string>()
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
      {chords.map((placed) => (
        <ChordButton
          key={idOf(placed)}
          symbol={placed.symbol}
          numeral={placed.numeral}
          playing={playback.playing === idOf(placed)}
          holds={holds?.has(placed.chord.degree) ?? false}
          onClick={() =>
            playback.toggle(idOf(placed), () =>
              chordSounds(
                placed.tones.map((tone) => tone.midi),
                { arpeggio: false },
              ),
            )
          }
        />
      ))}
    </div>
  )
}
