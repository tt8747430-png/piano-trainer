/** A chord name's character, as a share of its size: the display face's semibold capitals. */
const CHAR = 0.65
/** The gap kept between one chord's name and the next, read as two names, not one. */
const GAP = 6
/** The least share of its size a name is drawn at: smaller, it is not read at a glance. */
const LEAST = 0.85

/** A chord name as it is drawn: where it starts and its size, CSS px. */
export interface ChordLabel {
  readonly x: number
  readonly size: number
}

/**
 * Where and how large each chord name over a staff is drawn: at its chord's onset and `size`, smaller
 * where it would run into the next (never under `LEAST` of it), and where even that runs into the one
 * before, moved on past it, as a notation app keeps its chord symbols apart; the last drawn back from
 * the line's `end` rather than past it. `chords` stand in order at their x.
 */
export function chordLabels(
  chords: readonly { readonly x: number; readonly symbol: string }[],
  end: number,
  size: number,
): ChordLabel[] {
  const width = (symbol: string, at: number) => symbol.length * CHAR * at
  const placed: ChordLabel[] = []
  chords.forEach((chord, index) => {
    const room = (chords[index + 1]?.x ?? end) - chord.x - GAP
    const sized = Math.max(size * LEAST, Math.min(size, room / (chord.symbol.length * CHAR)))
    const before = placed[index - 1]
    const previous = chords[index - 1]
    const clear =
      before && previous ? before.x + width(previous.symbol, before.size) + GAP : -Infinity
    placed.push({ x: Math.max(chord.x, clear), size: sized })
  })
  // The last name ends at the line's end at the latest, as far back as the one before allows.
  const last = placed.at(-1)
  const lastChord = chords.at(-1)
  if (last && lastChord) {
    const over = last.x + width(lastChord.symbol, last.size) - end
    if (over > 0) {
      const before = placed.at(-2)
      const previous = chords.at(-2)
      const floor = before && previous ? before.x + width(previous.symbol, before.size) + GAP : 0
      placed[placed.length - 1] = { ...last, x: Math.max(floor, last.x - over) }
    }
  }
  return placed
}
