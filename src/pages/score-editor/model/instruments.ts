import type { StaffName } from '@/entities/piece'
import { VOICE_IDS, VOICES, type VoiceId } from '@/features/edit-piece'
import type { Draft, EditorAction } from '@/features/score-editor'

/** The most single staves a score has over the piano, as New song allows. */
const MOST_STAVES = 8

/** An instrument the score's Settings list (round 28): the piano, a voice, or a staff of no voice. */
export type ScoreInstrument = 'piano' | VoiceId | 'staff'

/** The voice a staff is, by its printed name in either language; none for a staff named otherwise. */
export function voiceOf(name: StaffName | undefined): VoiceId | undefined {
  if (name === undefined) return undefined
  const names = typeof name === 'string' ? [name] : [name.en, name.ru]
  return VOICE_IDS.find((voice) =>
    names.some((each) => each === VOICES[voice].name.en || each === VOICES[voice].name.ru),
  )
}

/** How many of an instrument the score has, and the edit that makes one fewer or one more (none: it cannot). */
export interface InstrumentCount {
  readonly count: number
  readonly fewer: EditorAction | null
  readonly more: EditorAction | null
}

const instrumentOf = (name: StaffName | undefined): VoiceId | 'staff' => voiceOf(name) ?? 'staff'

/**
 * How many of an instrument the score has (round 28, New song's instruments on a score made): the
 * piano in sight or not (its music kept), each voice's staves, the staves of no voice. One more
 * stands with its own (a voice under the last of its kind, else over the next voice down, as a choir
 * is stacked; a staff of no voice over the piano), named and in its clef; one fewer takes the last of
 * them away with its notes (Undo brings them back). Never every staff out of sight, never more than
 * eight over the piano.
 */
export function instrumentCount(draft: Draft, instrument: ScoreInstrument): InstrumentCount {
  const { staves, leadSheet } = draft
  if (instrument === 'piano')
    return {
      count: leadSheet ? 0 : 1,
      fewer: !leadSheet && staves.length > 0 ? { type: 'piano', hidden: true } : null,
      more: leadSheet ? { type: 'piano', hidden: false } : null,
    }
  const kinds = staves.map((staff) => instrumentOf(staff.name))
  const last = kinds.lastIndexOf(instrument)
  const count = kinds.filter((kind) => kind === instrument).length
  // The last staff in sight stays: a lead sheet's only staff.
  const fewer: EditorAction | null =
    last >= 0 && !(leadSheet && staves.length === 1) ? { type: 'removeStaff', place: last } : null
  if (staves.length >= MOST_STAVES) return { count, fewer, more: null }
  if (instrument === 'staff')
    return { count, fewer, more: { type: 'addStaff', place: staves.length } }
  const order = VOICE_IDS.indexOf(instrument)
  const lower = kinds.findIndex((kind) => kind !== 'staff' && VOICE_IDS.indexOf(kind) > order)
  const place = last >= 0 ? last + 1 : lower >= 0 ? lower : staves.length
  return {
    count,
    fewer,
    more: { type: 'addStaff', place, name: VOICES[instrument].name, clef: VOICES[instrument].clef },
  }
}

/**
 * The single staves in a score's order (A40, Flat's Sort › Score order): the voices as a choir is
 * stacked, top down, then the staves of no voice, each kind in the order it stands; the place each
 * staff stood at.
 */
export function scoreOrder(staves: readonly { readonly name?: StaffName }[]): number[] {
  const rank = (name: StaffName | undefined) => {
    const voice = voiceOf(name)
    return voice ? VOICE_IDS.indexOf(voice) : VOICE_IDS.length
  }
  return staves
    .map((_, place) => place)
    .sort((a, b) => rank(staves[a]?.name) - rank(staves[b]?.name) || a - b)
}

/** The instruments New instrument offers (A40): the piano where it is hidden, each voice, a staff. */
export const NEW_INSTRUMENTS: readonly ScoreInstrument[] = ['piano', ...VOICE_IDS, 'staff']
