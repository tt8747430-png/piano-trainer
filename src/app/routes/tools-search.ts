import { PROGRESSION } from '@/features/practice'
import { keyListParam, readKeyList, readNote, readText, valueOr } from '@/shared/lib'
import { keyParam, noteParam, note, pitchClassOf, spellInKey } from '@/shared/lib/music'
import type { FinderView } from '@/widgets/chord-finder'
import type { PassingView } from '@/widgets/passing-chords'
import type { ProgressionsView } from '@/widgets/progressions'
import type { ReharmoniseView } from '@/widgets/reharmonise'
import {
  C_MAJOR,
  C_MAJOR_PARAM,
  isChordSize,
  readKey,
  readNumerals,
  routeSearch,
  type Input,
  type Raw,
} from './read-search'

// Learn's tools.

// Chord finder: the keys chosen, each once, lowest first.
export const FINDER_DEFAULTS: FinderView = { keys: '' }
function validateFinderSearch(input: Input<FinderView>): FinderView {
  const raw: Raw = input
  return { keys: keyListParam(readKeyList(raw.keys)) }
}
export const finderSearch = routeSearch(validateFinderSearch, FINDER_DEFAULTS)

// Reharmonise: a key, and a melody note spelled in it.
export const REHARMONISE_DEFAULTS: ReharmoniseView = {
  key: C_MAJOR_PARAM,
  note: noteParam(note('E')),
}
function validateReharmoniseSearch(input: Input<ReharmoniseView>): ReharmoniseView {
  const raw: Raw = input
  const key = readKey(raw.key) ?? C_MAJOR
  const melody = readNote(raw.note) ?? note('E')
  return { key: keyParam(key), note: noteParam(spellInKey(pitchClassOf(melody), key)) }
}
export const reharmoniseSearch = routeSearch(validateReharmoniseSearch, REHARMONISE_DEFAULTS)

// Passing chords: two chords kept as typed (a line says when one cannot be read), and a key.
/** The most of a chord symbol a field keeps: the longest the table writes, and some. */
const TYPED_CHORD = 16
export const PASSING_DEFAULTS: PassingView = { key: C_MAJOR_PARAM, from: 'C', to: 'F' }
function validatePassingSearch(input: Input<PassingView>): PassingView {
  const raw: Raw = input
  const key = readKey(raw.key)
  return {
    key: key ? keyParam(key) : PASSING_DEFAULTS.key,
    from: readText(raw.from, PASSING_DEFAULTS.from).slice(0, TYPED_CHORD),
    to: readText(raw.to, PASSING_DEFAULTS.to).slice(0, TYPED_CHORD),
  }
}
export const passingSearch = routeSearch(validatePassingSearch, PASSING_DEFAULTS)

// Progressions: numerals in a key at a chord size; an unread line is the Player's own.
export const PROGRESSIONS_DEFAULTS: ProgressionsView = {
  key: C_MAJOR_PARAM,
  p: PROGRESSION.numerals,
  size: 'triads',
}
function validateProgressionsSearch(input: Input<ProgressionsView>): ProgressionsView {
  const raw: Raw = input
  const key = readKey(raw.key)
  return {
    key: key ? keyParam(key) : PROGRESSIONS_DEFAULTS.key,
    p: readNumerals(raw.p, PROGRESSIONS_DEFAULTS.p),
    size: valueOr(isChordSize, raw.size, PROGRESSIONS_DEFAULTS.size),
  }
}
export const progressionsSearch = routeSearch(validateProgressionsSearch, PROGRESSIONS_DEFAULTS)
