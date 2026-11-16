import {
  ADDED_TONES,
  ALTERATIONS,
  fitParts,
  type AddedTone,
  type Alteration,
  type BuiltSize,
  type ChordParts,
  type Seventh,
  type Triad,
} from './chord-parts'

/**
 * Reading a chord symbol's suffix by the builder's grammar: a triad (`m`, `°`, `+`, `sus2`, `5`), a
 * 6th, a size and its 7th (`7`, `maj9`, `m(maj7)`), alterations (`♭9`, `(#5,#9)`), added tones
 * (`add9`, `(add11)`), a suspension (`sus4`), in the order and the many spellings charts write them.
 */

/** What a suffix says, word by word, before it is made into parts. */
interface Said {
  minor: boolean
  /** `dim`, `°`, `o`: a diminished triad, and a diminished 7th under a plain `7`. */
  diminished: boolean
  /** `ø`, `hdim`: a diminished triad under a minor 7th. */
  half: boolean
  augmented: boolean
  majorSeventh: boolean
  power: boolean
  sus?: 2 | 4
  readonly numbers: number[]
  /** Altered degrees as written: `b5`, `#5`, `b9`, `#9`, `#11`, `b13`. */
  readonly alterations: string[]
  readonly added: AddedTone[]
}

/** The typographic signs read as their ASCII: `♭9` is `b9`, `Δ` is `maj`, `ø` is `h`, `−` is `-`. */
const SIGNS: readonly (readonly [string, string])[] = [
  ['♭', 'b'],
  ['♯', '#'],
  ['−', '-'],
  ['Δ', 'maj'],
  ['△', 'maj'],
  ['ø', 'h'],
  ['º', '°'],
]

/** Brackets, commas and spaces only set words apart: `7(♭9,#9)`, `6(9)`. */
const APART = /[\s(),]/

/** A slash sets two numbers apart, or a number and an altered one: `6/9`, `7(−9/+5)`; any other is a bass's. */
const NUMBERS_APART = /(?<=\d)\/(?=[\db#+-])/g

/** An altered degree as written (a ♭6 is a ♭13, a #4 a #11), by its sign and number. */
const ALTERED_DEGREES: ReadonlyMap<string, string> = new Map([
  ['b5', 'b5'],
  ['#5', '#5'],
  ['b9', 'b9'],
  ['#9', '#9'],
  ['#11', '#11'],
  ['#4', '#11'],
  ['b13', 'b13'],
  ['b6', 'b13'],
])

/** An added tone by its number (an added 2nd and 9th, 4th and 11th, are the table's one chord). */
const ADDED_BY_NUMBER: ReadonlyMap<string, AddedTone> = new Map([
  ['2', 'add2'],
  ['4', 'add4'],
  ['6', 'add6'],
  ['9', 'add9'],
  ['11', 'add11'],
  ['#11', 'addS11'],
  ['13', 'add13'],
])

const ALTERATION_OF: ReadonlyMap<string, Alteration> = new Map([
  ['b5', 'b5'],
  ['b9', 'b9'],
  ['#9', 's9'],
  ['#11', 's11'],
  ['b13', 'b13'],
])

/** One word of a suffix, and what it says. */
interface Word {
  readonly pattern: RegExp
  readonly say: (said: Said, match: RegExpExecArray) => boolean
}

type Mark = 'minor' | 'diminished' | 'half' | 'augmented' | 'majorSeventh' | 'power'

/** A mark said once: one said twice (`Cmm`, `Cmaj7maj`) makes no chord. */
function marked(said: Said, mark: Mark): boolean {
  if (said[mark]) return false
  said[mark] = true
  return true
}

const flat = (sign: string) => (sign === '-' ? 'b' : sign === '+' ? '#' : sign)

/** The words a suffix is made of, each tried in turn where the last one ended. */
const WORDS: readonly Word[] = [
  {
    pattern: /add([b#+-]?)(\d+)/y,
    say: (said, [, sign = '', number = '']) => {
      const tone = ADDED_BY_NUMBER.get(flat(sign) + number)
      if (tone) said.added.push(tone)
      return tone !== undefined
    },
  },
  {
    pattern: /sus([24]?)|s([24])/y,
    say: (said, [, sus = '', short = '']) => {
      if (said.sus) return false
      said.sus = (sus || short) === '2' ? 2 : 4
      return true
    },
  },
  {
    pattern: /(?:no|omit)3/y,
    say: (said) => marked(said, 'power'),
  },
  {
    pattern: /maj|Maj|MAJ|ma(?=\d)|M|j(?=\d)/y,
    say: (said) => marked(said, 'majorSeventh'),
  },
  {
    pattern: /min|mi|m/y,
    say: (said) => marked(said, 'minor'),
  },
  {
    pattern: /hdim|h/y,
    say: (said) => marked(said, 'half'),
  },
  {
    pattern: /dim|°|o/y,
    say: (said) => marked(said, 'diminished'),
  },
  {
    pattern: /aug/y,
    say: (said) => marked(said, 'augmented'),
  },
  {
    // `♭9`, `#11`, `+5`, `−9`: an altered degree.
    pattern: /([b#+-])(\d+)/y,
    say: (said, [, sign = '', number = '']) => {
      const degree = ALTERED_DEGREES.get(flat(sign) + number)
      if (degree) said.alterations.push(degree)
      return degree !== undefined
    },
  },
  {
    // `+` alone: augmented before a number (`+7`, `+maj7`), a raised 5th after one (`7+`).
    pattern: /\+/y,
    say: (said) => {
      if (said.numbers.length === 0) return marked(said, 'augmented')
      said.alterations.push('#5')
      return true
    },
  },
  {
    // `−` before a number: the minor triad (`−7`, `−6`).
    pattern: /-/y,
    say: (said) => marked(said, 'minor'),
  },
  {
    // `69` is a 6/9.
    pattern: /69|\d+/y,
    say: (said, [number]) => {
      said.numbers.push(...(number === '69' ? [6, 9] : [Number(number)]))
      return true
    },
  },
]

/** Whether every bracket closes, none inside another: `7(♭9,#9)`, not `7(` or `7((♭9))`. */
const balanced = (text: string): boolean => !/[()]/.test(text.replace(/\([^()]*\)/g, ''))

/** What a suffix says, or null where a word of it is none of the grammar's. */
function wordsOf(suffix: string): Said | null {
  const text = SIGNS.reduce((each, [sign, ascii]) => each.replaceAll(sign, ascii), suffix).replace(
    NUMBERS_APART,
    ' ',
  )
  const said: Said = {
    minor: false,
    diminished: false,
    half: false,
    augmented: false,
    majorSeventh: false,
    power: false,
    numbers: [],
    alterations: [],
    added: [],
  }
  if (!balanced(text)) return null
  let at = 0
  while (at < text.length) {
    if (APART.test(text.charAt(at))) {
      at += 1
      continue
    }
    const read = WORDS.some(({ pattern, say }) => {
      pattern.lastIndex = at
      const match = pattern.exec(text)
      if (!match || !say(said, match)) return false
      at = pattern.lastIndex
      return true
    })
    if (!read) return null
  }
  return said
}

/** The natural tensions a 7th chord stacks to a size: a 13th over a major 3rd or a 4th leaves its 11th out. */
function stackOf(size: BuiltSize, triad: Triad): readonly number[] {
  const all = [9, 11, 13].filter((each) => each <= size)
  const leavesEleventh = size === 13 && (triad === 'maj' || triad === 'sus4')
  return leavesEleventh ? all.filter((each) => each !== 11) : all
}

const SIZES_DOWN: readonly BuiltSize[] = [13, 11, 9, 7]

/**
 * A 7th chord's size and the tones it adds, from the tensions it names: its number stacks the ones
 * under it (`13` is 9 and 13), and a number after it adds one (`9(13)` is the 13th, `7(13)` the
 * 7th with an added 13th, `m9(11)` the minor 11th). The largest stack the tensions hold is the size;
 * the rest are added.
 */
function sizeOf(
  first: number,
  more: readonly number[],
  triad: Triad,
): { size: BuiltSize; added: AddedTone[] } | null {
  const written = SIZES_DOWN.find((each) => each === first)
  if (!written || !more.every((each) => SIZES_DOWN.some((size) => size === each))) return null
  const tensions = new Set([...stackOf(written, triad), ...more])
  const size =
    SIZES_DOWN.find((each) => {
      const stack = stackOf(each, triad)
      return stack.length > 0 && stack.every((tension) => tensions.has(tension))
    }) ?? 7
  const stacked = new Set(stackOf(size, triad))
  const added = [...tensions]
    .filter((each) => !stacked.has(each))
    .map((each) => ADDED_BY_NUMBER.get(String(each)))
  if (added.some((each) => each === undefined || each === 'add9')) return null
  return { size, added: added.filter((each) => each !== undefined) }
}

/** The triad a suffix's words make: its 3rd's mark, a suspension, or none (the power chord). */
function triadOf(said: Said, alterations: Set<string>): Triad | null {
  const marks = [said.minor, said.diminished || said.half, said.augmented, said.sus, said.power]
  if (marks.filter(Boolean).length > 1) return null
  if (said.power) return 'power'
  if (said.sus) return said.sus === 2 ? 'sus2' : 'sus4'
  if (said.diminished || said.half) return 'dim'
  if (said.augmented) return 'aug'
  // A minor triad with its 5th lowered is the diminished triad: `m7♭5`, `m9♭5`.
  if (said.minor) return alterations.delete('b5') ? 'dim' : 'min'
  // A major triad with its 5th raised is the augmented triad: `7#5`, `maj7#5`, `(#5)`.
  return alterations.delete('#5') ? 'aug' : 'maj'
}

const sameParts = (a: ChordParts, b: ChordParts): boolean =>
  a.triad === b.triad &&
  a.size === b.size &&
  a.seventh === b.seventh &&
  a.added.join() === b.added.join() &&
  a.alterations.join() === b.alterations.join()

/**
 * The parts a chord symbol's suffix writes by the builder's grammar, in any of the spellings charts
 * use (`m7b5`, `minMaj7`, `7(#9,#5)`, `9(13)`, `6add9`, `hdim7`); null for a suffix the grammar cannot
 * read or a chord the builder does not make.
 */
export function readSuffixParts(suffix: string): ChordParts | null {
  const said = wordsOf(suffix)
  if (!said) return null
  const alterations = new Set(said.alterations)
  const [first, ...more] = said.numbers
  // `C5`: the power chord, its 5th alone.
  const fifthAlone = first === 5 && more.length === 0
  const marked = triadOf(said, alterations)
  const triad = fifthAlone ? (marked === 'maj' && alterations.size === 0 ? 'power' : null) : marked
  if (!triad) return null
  let size: BuiltSize = 5
  const added = [...said.added]
  if (first === 6 || first === 2 || first === 4) {
    // A 6th (`6`, `6/9`, `m6`), or an added 2nd or 4th written bare (`C2`, `C4`).
    const tones = [first, ...more].map((each) =>
      ADDED_BY_NUMBER.get(each === 2 ? '9' : each === 4 ? '11' : String(each)),
    )
    if (tones.some((each) => each === undefined)) return null
    added.push(...tones.filter((each) => each !== undefined))
  } else if (first !== undefined && !fifthAlone) {
    const stacked = sizeOf(first, more, triad)
    if (!stacked) return null
    size = stacked.size
    added.push(...stacked.added)
  } else if (said.half || (said.majorSeventh && triad !== 'maj')) {
    // `ø`, `mMaj`, `minMaj`: a 7th chord with no number.
    size = 7
  }
  // A triad's `maj` is the major triad's (`Cmaj`, `CMaj`), with no 7th.
  const seventh: Seventh =
    said.majorSeventh && size > 5 ? 'major' : said.diminished && size === 7 ? 'diminished' : 'minor'
  const parts: ChordParts = {
    triad,
    size,
    seventh,
    added: ADDED_TONES.filter((tone) => added.includes(tone)),
    alterations: ALTERATIONS.filter((each) =>
      [...alterations].some((written) => ALTERATION_OF.get(written) === each),
    ),
  }
  const readAll = [...alterations].every((written) => ALTERATION_OF.has(written))
  return readAll && sameParts(fitParts(parts), parts) ? parts : null
}
