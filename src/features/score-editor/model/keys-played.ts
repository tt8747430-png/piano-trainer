import { nameChords, readChordSymbol, type Chord, type Midi } from '@/shared/lib/music'
import { stepOf } from './caret-moves'
import { setChord } from './chords'
import { commit } from './history'
import { addToChord, writeNotes } from './notes'
import type { EditorState, Struck } from './state'
import { barAt } from './timeline'

/** Keys going down within this many milliseconds of the first are struck together. */
export const STRUCK_TOGETHER_MS = 80

/** The chord the keys make, as a chart writes it; none for fewer than three notes or no chord. */
function chordOfKeys(keys: readonly Midi[]): Chord | undefined {
  for (const found of nameChords([...keys].sort((a, b) => a - b))) {
    const chord = readChordSymbol(found.symbol)
    if (chord) return chord
  }
  return undefined
}

/**
 * A key played: written at the caret as a note (or joining the notes struck with it, or those at the
 * caret in Chord mode), or, in the chords, named with the keys struck with it as the chord there.
 */
export function keyPlayed(state: EditorState, key: Midi, time: number): EditorState {
  const { draft, layer, caret, struck } = state
  const joining =
    struck !== null &&
    struck.layer === layer &&
    time - struck.time <= STRUCK_TOGETHER_MS &&
    (layer === 'chords' ? struck.at === caret : true)
  if (layer === 'chords') {
    const keys = joining ? [...struck.keys, key] : [key]
    const chord = chordOfKeys(keys)
    const before = joining && struck.written
    const nextStruck: Struck = {
      at: caret,
      time: joining ? struck.time : time,
      keys,
      layer,
      written: before || chord !== undefined,
    }
    if (!chord) return { ...state, struck: nextStruck }
    const bar = barAt(draft, caret)
    return commit(
      state,
      setChord(draft, bar.index, caret - bar.start, chord),
      { struck: nextStruck },
      before,
    )
  }
  const ticks = stepOf(state)
  if (state.chord) {
    return commit(state, addToChord(draft, layer, caret, key, ticks), { struck: null })
  }
  if (joining) {
    return commit(
      state,
      addToChord(draft, layer, struck.at, key, ticks),
      { struck: { ...struck, keys: [...struck.keys, key] } },
      true,
    )
  }
  const result = writeNotes(draft, layer, caret, [key], ticks)
  return commit(state, result.draft, {
    caret: result.end,
    struck: { at: caret, time, keys: [key], layer, written: true },
  })
}
