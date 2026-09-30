import { Square } from 'lucide-react'
import type { ShownKeys } from '@/features/play-example'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
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
          <Button
            key={place}
            variant="outline"
            aria-pressed={playing}
            className="relative h-12 min-w-16 px-4 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
            onClick={() => {
              onShow(example)
              playback.toggle(place, chordSounds(example.keys, { arpeggio: false }))
            }}
          >
            {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
            <span className="font-display text-xl font-semibold">{symbol}</span>
          </Button>
        )
      })}
    </div>
  )
}
