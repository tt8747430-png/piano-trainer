import type { ReactNode } from 'react'
import type { PlacedScaleChord } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton } from '@/shared/ui'

/** A chord's play is its own: after a size or an inversion changes, no chord of the new ones is pressed. */
const idOf = (placed: PlacedScaleChord) =>
  `${placed.chord.degree} ${placed.symbol} ${placed.tones.map((tone) => tone.midi).join('-')}`

/**
 * A scale's or a key's chords to tap, one column a degree (the seven-degree spine, A21), each its
 * symbol over its numeral and a line of its own (`detail`: its degree's name), pressed while it
 * sounds; those whose degree is in `holds` (they hold the note heard) ringed. Where a chord opens
 * elsewhere (`open`: Chords set to it), its link sits in the card's corner: one card, no second row.
 */
export function ScaleChordGrid({
  chords,
  holds,
  detail,
  open,
}: {
  chords: readonly PlacedScaleChord[]
  holds?: ReadonlySet<number>
  detail?: (placed: PlacedScaleChord) => string | undefined
  open?: (placed: PlacedScaleChord) => ReactNode
}) {
  const playback = usePlayback<string>()
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {chords.map((placed) => {
        const link = open?.(placed)
        return (
          <div key={idOf(placed)} className="relative flex flex-col">
            <ChordButton
              symbol={placed.symbol}
              numeral={placed.numeral}
              detail={detail?.(placed)}
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
            {link ? <div className="absolute top-0.5 left-0.5">{link}</div> : null}
          </div>
        )
      })}
    </div>
  )
}
