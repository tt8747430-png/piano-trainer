import type { FreePlayView } from '@/pages/free-play'
import {
  diagramMarksParam,
  isOneOf,
  keyListParam,
  readDiagramMarks,
  readKeyList,
  readNote,
  valueOr,
  wholeIn,
} from '@/shared/lib'
import { keyParam, note, noteParam, pitchClassOf, spellInKey } from '@/shared/lib/music'
import { METRONOME_BEATS, TEMPO_RANGE } from '@/shared/lib/schedule'
import type { FinderView } from '@/widgets/chord-finder'
import type { PassingView } from '@/widgets/passing-chords'
import type { ReharmoniseView } from '@/widgets/reharmonise'
import {
  C_MAJOR,
  C_MAJOR_PARAM,
  readKey,
  readTypedChord,
  routeSearch,
  type Raw,
} from './read-search'

// Practice's tools (ADR 0044), each a page that works something out from what the learner gives it:
// the chord of the keys played, the chords that hold a melody note, the ways between two chords, and
// the piano played freely.

// Chord finder: the keys chosen, each once, lowest first.
const FINDER_DEFAULTS: FinderView = { keys: '' }
export function readFinderSearch(raw: Raw): FinderView {
  return { keys: keyListParam(readKeyList(raw.keys)) }
}
export const finderSearch = routeSearch(readFinderSearch, FINDER_DEFAULTS)

// Reharmonise: a key, and a melody note spelled in it.
const REHARMONISE_DEFAULTS: ReharmoniseView = {
  key: C_MAJOR_PARAM,
  note: noteParam(note('E')),
  inKey: false,
}
export function readReharmoniseSearch(raw: Raw): ReharmoniseView {
  const key = readKey(raw.key) ?? C_MAJOR
  const melody = readNote(raw.note) ?? note('E')
  return {
    key: keyParam(key),
    note: noteParam(spellInKey(pitchClassOf(melody), key)),
    inKey: raw.inKey === true,
  }
}
export const reharmoniseSearch = routeSearch(readReharmoniseSearch, REHARMONISE_DEFAULTS)

// Passing chords: two chords as they were typed, each read (one that cannot be read is the default), and a key.
export const PASSING_DEFAULTS: PassingView = {
  key: C_MAJOR_PARAM,
  from: 'C',
  to: 'F',
  inKey: false,
}
export function readPassingSearch(raw: Raw): PassingView {
  const key = readKey(raw.key)
  return {
    key: key ? keyParam(key) : PASSING_DEFAULTS.key,
    from: readTypedChord(raw.from, PASSING_DEFAULTS.from),
    to: readTypedChord(raw.to, PASSING_DEFAULTS.to),
    inKey: raw.inKey === true,
  }
}
export const passingSearch = routeSearch(readPassingSearch, PASSING_DEFAULTS)

// Free play: Play or Mark, the key the live score spells in, Mark's marks written back clean, and
// the metronome's tempo and beats.
export const FREE_PLAY_DEFAULTS: FreePlayView = {
  mode: 'play',
  key: C_MAJOR_PARAM,
  marks: '',
  tempo: 80,
  beats: 4,
}
const isBeats = isOneOf(METRONOME_BEATS)
export function readFreePlaySearch(raw: Raw): FreePlayView {
  const key = readKey(raw.key)
  return {
    mode: raw.mode === 'mark' ? 'mark' : 'play',
    key: key ? keyParam(key) : FREE_PLAY_DEFAULTS.key,
    marks: typeof raw.marks === 'string' ? diagramMarksParam(readDiagramMarks(raw.marks)) : '',
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, FREE_PLAY_DEFAULTS.tempo),
    beats: valueOr(isBeats, raw.beats, FREE_PLAY_DEFAULTS.beats),
  }
}
export const freePlaySearch = routeSearch(readFreePlaySearch, FREE_PLAY_DEFAULTS)
