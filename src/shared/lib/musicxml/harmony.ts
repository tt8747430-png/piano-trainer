// A chord symbol as MusicXML's <harmony>: its root, its kind and the degrees added to it, altered or
// taken from it, and its bass.

import {
  CHORD_QUALITIES,
  chordBass,
  qualityIntervals,
  qualitySuffix,
  type Accidental,
  type Chord,
  type ChordQuality,
  type Letter,
  type SpelledNote,
  readChordSymbol,
} from '@/shared/lib/music'
import { childOf, childrenOf, numberAt, tag, text, textAt, textOf, type XmlElement } from './xml'

/** A chord tone: its degree (1 the root, 9 the ninth) and its semitones above the root. */
interface Degree {
  readonly degree: number
  readonly semitones: number
}

/** The tones each of MusicXML's kinds holds (its `kind` values a chord symbol may name). */
const KINDS: Readonly<Record<string, readonly (readonly [number, number])[]>> = {
  major: [
    [1, 0],
    [3, 4],
    [5, 7],
  ],
  minor: [
    [1, 0],
    [3, 3],
    [5, 7],
  ],
  augmented: [
    [1, 0],
    [3, 4],
    [5, 8],
  ],
  diminished: [
    [1, 0],
    [3, 3],
    [5, 6],
  ],
  dominant: [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 10],
  ],
  'major-seventh': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 11],
  ],
  'minor-seventh': [
    [1, 0],
    [3, 3],
    [5, 7],
    [7, 10],
  ],
  'diminished-seventh': [
    [1, 0],
    [3, 3],
    [5, 6],
    [7, 9],
  ],
  'augmented-seventh': [
    [1, 0],
    [3, 4],
    [5, 8],
    [7, 10],
  ],
  'half-diminished': [
    [1, 0],
    [3, 3],
    [5, 6],
    [7, 10],
  ],
  'major-minor': [
    [1, 0],
    [3, 3],
    [5, 7],
    [7, 11],
  ],
  'major-sixth': [
    [1, 0],
    [3, 4],
    [5, 7],
    [6, 9],
  ],
  'minor-sixth': [
    [1, 0],
    [3, 3],
    [5, 7],
    [6, 9],
  ],
  'dominant-ninth': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 10],
    [9, 14],
  ],
  'major-ninth': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 11],
    [9, 14],
  ],
  'minor-ninth': [
    [1, 0],
    [3, 3],
    [5, 7],
    [7, 10],
    [9, 14],
  ],
  'dominant-11th': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 10],
    [9, 14],
    [11, 17],
  ],
  'major-11th': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 11],
    [9, 14],
    [11, 17],
  ],
  'minor-11th': [
    [1, 0],
    [3, 3],
    [5, 7],
    [7, 10],
    [9, 14],
    [11, 17],
  ],
  'dominant-13th': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 10],
    [9, 14],
    [11, 17],
    [13, 21],
  ],
  'major-13th': [
    [1, 0],
    [3, 4],
    [5, 7],
    [7, 11],
    [9, 14],
    [11, 17],
    [13, 21],
  ],
  'minor-13th': [
    [1, 0],
    [3, 3],
    [5, 7],
    [7, 10],
    [9, 14],
    [11, 17],
    [13, 21],
  ],
  'suspended-second': [
    [1, 0],
    [2, 2],
    [5, 7],
  ],
  'suspended-fourth': [
    [1, 0],
    [4, 5],
    [5, 7],
  ],
  power: [
    [1, 0],
    [5, 7],
  ],
}

/** A degree added is counted from a dominant chord's: major and perfect, the 7th minor. */
const ADDED_FROM: Readonly<Record<number, number>> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 10,
  9: 14,
  11: 17,
  13: 21,
}

const kindTones = (kind: string): Degree[] | undefined =>
  KINDS[kind]?.map(([degree, semitones]) => ({ degree, semitones }))

const qualityTones = (quality: ChordQuality): Degree[] =>
  qualityIntervals(quality).map((interval) => ({
    degree: Number(interval.degree.replace(/\D/g, '')),
    semitones: interval.semitones,
  }))

const sameSemitones = (a: readonly Degree[], b: readonly Degree[]) => {
  const sorted = (tones: readonly Degree[]) =>
    tones.map((tone) => tone.semitones).toSorted((x, y) => x - y)
  const [x, y] = [sorted(a), sorted(b)]
  return x.length === y.length && x.every((semitones, i) => semitones === y[i])
}

/** What a degree element says. */
type DegreeChange = { readonly type: 'add' | 'alter' | 'subtract' } & Degree

/** The kind closest to a quality, and the degrees that make it the quality. */
function kindOf(quality: ChordQuality): { kind: string; changes: DegreeChange[] } {
  const tones = qualityTones(quality)
  let best: { kind: string; changes: DegreeChange[] } | undefined
  for (const kind of Object.keys(KINDS)) {
    const base = kindTones(kind) ?? []
    const changes: DegreeChange[] = []
    const kept = new Set<Degree>()
    for (const tone of tones) {
      const same = base.find((each) => each.semitones === tone.semitones && !kept.has(each))
      if (same && same.degree === tone.degree) {
        kept.add(same)
        continue
      }
      const onDegree = base.find((each) => each.degree === tone.degree && !kept.has(each))
      if (onDegree && !tones.some((other) => other.semitones === onDegree.semitones)) {
        kept.add(onDegree)
        changes.push({
          type: 'alter',
          degree: tone.degree,
          semitones: tone.semitones - onDegree.semitones,
        })
      } else {
        changes.push({
          type: 'add',
          degree: tone.degree,
          semitones: tone.semitones - (ADDED_FROM[tone.degree] ?? 0),
        })
      }
    }
    for (const tone of base)
      if (!kept.has(tone)) changes.push({ type: 'subtract', degree: tone.degree, semitones: 0 })
    if (!best || changes.length < best.changes.length) best = { kind, changes }
  }
  return best ?? { kind: 'major', changes: [] }
}

const ALTER: Readonly<Record<number, Accidental>> = { [-2]: -2, [-1]: -1, 0: 0, 1: 1, 2: 2 }

const stepAndAlter = (prefix: 'root' | 'bass', note: SpelledNote) =>
  text(`${prefix}-step`, note.letter) +
  (note.accidental === 0 ? '' : text(`${prefix}-alter`, note.accidental))

/**
 * A chord as `<harmony>`: its root, the kind nearest its quality with the degrees that make it the
 * quality, its suffix as the kind's text (what is printed), and its bass; `offset` in divisions from
 * where it stands in the measure's notes.
 */
export function harmonyXml(chord: Chord, offset = 0): string {
  const { kind, changes } = kindOf(chord.quality)
  return tag(
    'harmony',
    {},
    tag('root', {}, stepAndAlter('root', chord.root)),
    tag('kind', { text: qualitySuffix(chord.quality) }, kind),
    chord.bass ? tag('bass', {}, stepAndAlter('bass', chord.bass)) : '',
    ...changes.map((change) =>
      tag(
        'degree',
        {},
        text('degree-value', change.degree),
        text('degree-alter', change.semitones),
        text('degree-type', change.type),
      ),
    ),
    offset === 0 ? '' : text('offset', offset),
  )
}

const LETTERS = new Set<string>(['C', 'D', 'E', 'F', 'G', 'A', 'B'])

function spelledAt(element: XmlElement, prefix: 'root' | 'bass'): SpelledNote | undefined {
  const step = textAt(element, `${prefix}-step`)?.toUpperCase()
  if (!step || !LETTERS.has(step)) return undefined
  const accidental = ALTER[Math.round(numberAt(element, `${prefix}-alter`) ?? 0)]
  return accidental === undefined ? undefined : { letter: step as Letter, accidental }
}

/**
 * The chord a `<harmony>` names: its kind with its degrees, matched to the quality holding the same
 * tones; else the kind's printed text read as a suffix. None where neither names a chord we know
 * (or it is none: `kind` none, a function, a Roman numeral).
 */
export function readHarmony(harmony: XmlElement): Chord | undefined {
  const rootElement = childOf(harmony, 'root')
  const root = rootElement && spelledAt(rootElement, 'root')
  const kindElement = childOf(harmony, 'kind')
  const kind = textOf(kindElement)
  if (!root || !kindElement || kind === 'none') return undefined
  let tones = kindTones(kind)
  for (const degree of childrenOf(harmony, 'degree')) {
    if (!tones) break
    const value = numberAt(degree, 'degree-value') ?? 0
    const alter = numberAt(degree, 'degree-alter') ?? 0
    const type = textAt(degree, 'degree-type')
    const at = tones.findIndex((tone) => tone.degree === value)
    if (type === 'add')
      tones = [...tones, { degree: value, semitones: (ADDED_FROM[value] ?? 0) + alter }]
    else if (type === 'subtract') tones = tones.filter((_, i) => i !== at)
    else if (at >= 0) {
      tones = tones.map((tone, i) =>
        i === at ? { ...tone, semitones: tone.semitones + alter } : tone,
      )
    } else tones = undefined
  }
  const quality =
    (tones && CHORD_QUALITIES.find((each) => sameSemitones(qualityTones(each), tones ?? []))) ??
    (kindElement.attrs.text === undefined
      ? undefined
      : readChordSymbol(`C${kindElement.attrs.text}`)?.quality)
  if (!quality) return undefined
  const bassElement = childOf(harmony, 'bass')
  const bass = bassElement && spelledAt(bassElement, 'bass')
  return bass ? { root, quality, bass: chordBass(root, quality, bass) } : { root, quality }
}
