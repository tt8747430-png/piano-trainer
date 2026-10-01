import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayToggle, type ShownKeys } from '@/shared/ui'
import { placeExample } from '../model/chord-example'

/**
 * A row of chords a lesson names, each written as the lesson writes it (C2 and Cadd9 are one chord
 * to the kernel): a tap plays one and shows it on the keys, a second tap stops it.
 */
export function ChordExamples({
  symbols,
  onShow,
}: {
  symbols: readonly string[]
  onShow: (shown: ShownKeys) => void
}) {
  // By place: a row may write a chord twice (C F C), and each is its own button.
  const playback = usePlayback<number>()
  return (
    <div className="flex flex-wrap gap-2">
      {symbols.map((symbol, place) => {
        const example = placeExample(symbol)
        const playing = playback.playing === place
        return (
          <PlayToggle
            key={place}
            playing={playing}
            className="h-12 min-w-16 px-4"
            onClick={() => {
              onShow(example)
              playback.toggle(place, () => chordSounds(example.keys, { arpeggio: false }))
            }}
          >
            <span className="font-display text-xl font-semibold">{symbol}</span>
          </PlayToggle>
        )
      })}
    </div>
  )
}
