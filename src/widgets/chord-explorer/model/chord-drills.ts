import {
  LETTERS,
  chordSymbol,
  keyParam,
  numeralOf,
  numeralsParam,
  pitchClass,
  pitchClassOf,
  printedNote,
  printedSymbol,
  qualityRootSpelling,
  sameNote,
  scaleChordAt,
  spellChord,
  type Chord,
  type ChordQuality,
  type Key,
  type KeyParam,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'

/** A drill the Player plays as a progression: its numerals in a key, and the line its row shows. */
export interface ChordDrill {
  readonly numerals: string
  readonly key: KeyParam
  readonly line: string
}

/**
 * The key a chord belongs to and its degree there, as the canvas's HOME: a major key's I ii vii° and
 * their sevenths, its V7; a °7 only in harmonic minor, on vii. A chord with no home (sus, added notes,
 * altered) has none, and no Diatonically row.
 */
const HOME: Partial<Record<ChordQuality, readonly [ScaleKind, number]>> = {
  maj: ['major', 0],
  min: ['major', 1],
  dim: ['major', 6],
  maj7: ['major', 0],
  m7: ['major', 1],
  d7: ['major', 4],
  hd: ['major', 6],
  o7: ['harmonic', 6],
}
/** Up from the chord's degree to its octave and back, a degree a bar (the canvas's steps, walked home). */
const UP_AND_BACK = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0]
/** The order Shuffle plays several chords in, as the canvas's `sh`. */
const SHUFFLE = [2, 0, 3, 1, 4, 6, 5, 7]
const ACCIDENTALS = [0, -1, 1] as const

const symbolOf = (chord: Chord): string => printedSymbol(chordSymbol(chord))
const inKey = (chords: readonly Chord[], key: Key): ChordDrill | null => {
  const numerals = chords.map((chord) => numeralOf(chord, key))
  if (numerals.some((numeral) => numeral === null)) return null
  return {
    numerals: numeralsParam(numerals.filter((numeral) => numeral !== null)),
    key: keyParam(key),
    line: '',
  }
}
const lined = (drill: ChordDrill | null, line: string): ChordDrill | null =>
  drill ? { ...drill, line } : null

/** The chord over its root: the left hand on the root, the right the whole chord (LH C · RH C E G B). */
export const overTheRoot = (chord: Chord): string => {
  const names = spellChord(chord.root, chord.quality).map((tone) => printedNote(tone.note))
  return `LH ${names[0] ?? ''} · RH ${names.join(' ')}`
}

/**
 * Diatonically: up the key the chord belongs to and back, each step the key's own chord, in triads
 * or sevenths as the chord is; the line its first four (Dm7 · Em7 · Fmaj7 · G7 …) and the key named.
 */
export function diatonically(chord: Chord): (ChordDrill & { readonly home: Key }) | null {
  const home = HOME[chord.quality]
  if (!home) return null
  const [kind, degree] = home
  const size = spellChord(chord.root, chord.quality).length > 3 ? 4 : 3
  const tonic = LETTERS.flatMap((letter) =>
    ACCIDENTALS.map((accidental): SpelledNote => ({ letter, accidental })),
  ).find((each) => {
    const own = scaleChordAt(each, kind, degree, size)
    return sameNote(own.root, chord.root) && own.quality === chord.quality
  })
  if (!tonic) return null
  const key: Key = { tonic, minor: kind !== 'major' }
  const chords = UP_AND_BACK.map((step) => scaleChordAt(tonic, kind, (degree + step) % 7, size))
  const drill = inKey(chords, key)
  if (!drill) return null
  return { ...drill, home: key, line: `${chords.slice(0, 4).map(symbolOf).join(' · ')} …` }
}

/** The chord as a progression of one, held over its root a bar at a time, in its own major key. */
export function overTheRootDrill(chords: readonly Chord[], key: Key): ChordDrill | null {
  const [first, second] = chords
  if (!first) return null
  const line = second
    ? `${overTheRoot(first)} · LH ${printedNote(second.root)} …`
    : overTheRoot(first)
  return lined(inKey(chords.length > 1 ? chords : [first, first, first, first], key), line)
}

/** Several chords, in the canvas's shuffled order, played as written. */
export function shuffled(chords: readonly Chord[], key: Key): ChordDrill | null {
  const order = SHUFFLE.filter((at) => at < chords.length).flatMap((at) => chords[at] ?? [])
  return lined(inKey(order, key), `${order.map(symbolOf).join(' · ')} …`)
}

/** The chords a half step (or a 4th) on, as the key walk takes them: the row's second group. */
export function walkedLine(chords: readonly Chord[], semitones: number): string {
  const moved = chords.map((chord) => ({
    root: qualityRootSpelling(pitchClass(pitchClassOf(chord.root) + semitones), chord.quality),
    quality: chord.quality,
  }))
  return `${chords.map(symbolOf).join(' ')} · ${moved.map(symbolOf).join(' ')} …`
}

/** Several chords' changes as written, round to the first again: Cmaj7 · Am7 · Dm7 · Cmaj7 …. */
export function chordChanges(chords: readonly Chord[], key: Key): ChordDrill | null {
  const [first] = chords
  if (!first) return null
  return lined(inKey(chords, key), `${[...chords, first].map(symbolOf).join(' · ')} …`)
}
