import type { FreePlayView } from '@/pages/free-play'
import {
  diagramMarksParam,
  isOneOf,
  keyListParam,
  readDiagramMarks,
  readKeyList,
  valueOr,
  wholeIn,
} from '@/shared/lib'
import { keyParam } from '@/shared/lib/music'
import { METRONOME_BEATS, TEMPO_RANGE } from '@/shared/lib/schedule'
import { C_MAJOR_PARAM, readKey, routeSearch, type Raw } from './read-search'

// Practice's one page of its own beside its things (ADR 0052): Free play, the piano played, named and
// marked.

// Free play: Play, Find or Mark, the key the live score spells in, Find's keys and Mark's marks
// written back clean, and the metronome's tempo and beats.
export const FREE_PLAY_DEFAULTS: FreePlayView = {
  mode: 'play',
  key: C_MAJOR_PARAM,
  keys: '',
  marks: '',
  tempo: 80,
  beats: 4,
}
const isBeats = isOneOf(METRONOME_BEATS)
// Free play's modes, as its page names them: the router imports no page code.
const isFreePlayMode = isOneOf([
  'play',
  'find',
  'mark',
] as const satisfies readonly FreePlayView['mode'][])
export function readFreePlaySearch(raw: Raw): FreePlayView {
  const key = readKey(raw.key)
  return {
    mode: valueOr(isFreePlayMode, raw.mode, FREE_PLAY_DEFAULTS.mode),
    key: key ? keyParam(key) : FREE_PLAY_DEFAULTS.key,
    keys: keyListParam(readKeyList(raw.keys)),
    marks: typeof raw.marks === 'string' ? diagramMarksParam(readDiagramMarks(raw.marks)) : '',
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, FREE_PLAY_DEFAULTS.tempo),
    beats: valueOr(isBeats, raw.beats, FREE_PLAY_DEFAULTS.beats),
  }
}
export const freePlaySearch = routeSearch(readFreePlaySearch, FREE_PLAY_DEFAULTS)
