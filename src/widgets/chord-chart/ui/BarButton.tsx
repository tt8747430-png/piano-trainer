import { Square } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useBarName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { BAR, barWords } from '../model/bar-look'
import type { BarWords, BeatWords } from '../model/bar-words'
import { BarCells } from './BarCells'

/** No words under a bar. */
const NO_WORDS: BarWords = []

/** A verse's words as said: a word's syllables joined, words parted by a space. */
const said = (verse: readonly BeatWords[]): string =>
  verse
    .map(({ text }) => text)
    .join(' ')
    .replaceAll('- ', '')

/**
 * What a tap on a chart's bar does: plays it, a toggle pressed while it sounds (a song's chart); or
 * takes the Player there, to the beat tapped, its bar current while the cursor is in it (ADR 0098,
 * 0099).
 */
export type BarTap = 'play' | 'go'

/** The beat of a bar a tap landed on: its cell's, else its first (a key pressed on the bar). */
const beatTapped = (target: EventTarget): number => {
  const cell = target instanceof Element ? target.closest('[data-beat]') : null
  return Number(cell?.getAttribute('data-beat') ?? 0)
}

/**
 * One bar of a chart's line in its beats (ADR 0099): a cell a beat, the chords starting in each, its
 * number small in its first cell's corner, a barline before it, and under its cells its method labels
 * or short length; a bar of no chord its number alone (ADR 0094). `marked` while it plays: the bar
 * sounding, with a square to stop it, or the bar the Player is in, a pointer's target only, as the
 * sheet's bars are (the arrows move the cursor), its beat sounding filled (`sounding`). The loop's
 * bars (`looped`) lie on its band. Its words under its cells (`words`, ADR 0108).
 */
export function BarButton({
  tap,
  number,
  symbols,
  cells,
  notes,
  words = NO_WORDS,
  marked,
  sounding,
  looped,
  onTap,
  style,
}: {
  tap: BarTap
  number: number
  /** Its chords, for its name. */
  symbols: readonly string[]
  /** Each beat's chords, those starting in it. */
  cells: readonly (readonly string[])[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  /** Its words, verse by verse, under the beats they are sung on. */
  words?: BarWords
  marked: boolean
  /** The beat sounding, filled: the Player's, in the bar it is in. */
  sounding: number | null
  looped: boolean
  /** A tap, on the beat it landed on. */
  onTap: (beat: number) => void
  style?: CSSProperties
}) {
  const barName = useBarName()
  const playing = marked && tap === 'play'
  return (
    <button
      type="button"
      // Named by all it prints, as it prints it: its number, its chords, its words (verse 1) and the
      // notes under them.
      aria-label={barName(number, barWords(symbols, [said(words[0] ?? []), ...notes]))}
      {...(tap === 'play'
        ? { 'aria-pressed': marked }
        : { 'aria-current': marked ? ('step' as const) : undefined, tabIndex: -1 })}
      onClick={(event) => onTap(beatTapped(event.target))}
      className={cn(
        BAR,
        'group/bar text-left transition-colors duration-200 ease-out focus-visible:-outline-offset-3',
      )}
      style={{ ...style, gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
    >
      <BarCells
        number={number}
        cells={cells}
        notes={notes}
        words={words}
        sounding={sounding}
        playing={playing}
        looped={looped}
      />
      {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
    </button>
  )
}
