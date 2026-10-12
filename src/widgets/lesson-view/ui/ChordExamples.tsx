import { useMemo } from 'react'
import { chordsMusic, TappableStaff } from '@/features/play-example'
import { parseChordSymbol, type SpelledNote } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayToggle, type ShownKeys } from '@/shared/ui'
import { placeExample, placeUnder } from '../model/chord-example'

/** Up to this many chords are also written on a staff: a grid of all twelve roots is buttons alone. */
const ON_A_STAFF = 8
/** A chord tapped on the staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/**
 * A row of chords a lesson names, each written as the lesson writes it (C2 and Cadd9 are one chord
 * to the kernel): a tap plays one and shows it on the keys, a second tap stops it. A short row is
 * written on the staff under its buttons too, each chord where its keys lie, tapped to play.
 */
export function ChordExamples({
  symbols,
  melody,
  onShow,
}: {
  symbols: readonly string[]
  /** A melody note each chord holds: each voiced close under it, the note on top. */
  melody?: SpelledNote | undefined
  onShow: (shown: ShownKeys) => void
}) {
  // By place: a row may write a chord twice (C F C), and each is its own button.
  const playback = usePlayback<number>()
  const examples = useMemo(
    () => symbols.map((symbol) => (melody ? placeUnder(symbol, melody) : placeExample(symbol))),
    [symbols, melody],
  )
  const staff = useMemo(() => {
    if (symbols.length > ON_A_STAFF) return null
    const music = chordsMusic(
      symbols.map((symbol, place) => ({
        chord: parseChordSymbol(symbol),
        symbol,
        keys: examples[place]?.keys ?? [],
      })),
    )
    return { music, score: notate(music) }
  }, [symbols, examples])
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol, place) => {
          const example = examples[place]
          if (!example) return null
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
      {staff ? (
        <div className="max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
          <TappableStaff
            music={staff.music}
            score={staff.score}
            tempo={STAFF_TEMPO}
            onShow={onShow}
          />
        </div>
      ) : null}
    </div>
  )
}
