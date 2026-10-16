import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chordsMusic, TappableStaff } from '@/features/play-example'
import { parseChordSymbol, type SpelledNote } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { PlayToggle, SheetOption, type ShownKeys } from '@/shared/ui'
import { placeExample, placeUnder } from '../model/chord-example'

/** Up to this many chords are also written on a staff: a grid of all twelve roots is buttons alone. */
const ON_A_STAFF = 8
/** A chord tapped on the staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/**
 * A row of chords a lesson names, each written as the lesson writes it (C2 and Cadd9 are one chord
 * to the kernel): a short row on the grand staff, each chord a bar whose band names it and plays it
 * on the keys, with the staff's own options beside it (the chords' names, the notes'); a long one (a
 * grid of all twelve roots) as buttons, a tap playing one and a second stopping it.
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
  const { t } = useTranslation('music')
  // By place: a row may write a chord twice (C F C), and each is its own button.
  const playback = usePlayback<number>()
  const [chordNames, setChordNames] = useState(true)
  const [names, setNames] = useState(false)
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
  // Written on a staff, the chords are its bars: each bar's band names its chord and plays it.
  if (staff)
    return (
      <figure className="flex w-fit max-w-full items-start gap-2 card p-3 pl-4">
        <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-none">
          <TappableStaff
            music={staff.music}
            score={staff.score}
            tempo={STAFF_TEMPO}
            names={names}
            symbols={chordNames}
            barShown={(bar) => examples[bar]}
            onShow={onShow}
          />
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <SheetOption
            glyph="C7"
            label={t('sheet.chordNames')}
            pressed={chordNames}
            onPressedChange={setChordNames}
          />
          <SheetOption
            glyph="C E"
            label={t('sheet.noteNames')}
            pressed={names}
            onPressedChange={setNames}
          />
        </div>
      </figure>
    )
  return (
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
  )
}
