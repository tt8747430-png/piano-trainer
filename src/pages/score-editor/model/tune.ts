import { barsOf, type Draft } from '@/features/score-editor'
import { schedule, type NoteSound } from '@/shared/lib/schedule'
import { arrangeDraft } from './arrange-draft'

/** The single staves alone: no hand's notes. */
const STAVES_ONLY = { rh: false, lh: false, staff: true } as const

/** Whether the song has a tune to play under a take: a note on one of its single staves (ADR 0097). */
export const hasTune = (draft: Pick<Draft, 'staves'>): boolean =>
  draft.staves.some(({ notes }) => notes.length > 0)

/**
 * The song's tune from its bar `from` (an index) at its tempo, its first note at 0 s: what plays
 * under a take from its downbeat, so an accompaniment is recorded against
 * the song it accompanies: its single staves over the piano (ADR 0097); in strict time, its tempo
 * marks left to the Player.
 */
export function tuneOf(draft: Draft, from: number): NoteSound[] {
  const fromTick = barsOf(draft)[from]?.start ?? 0
  const performance = arrangeDraft(draft)
  // In strict time, as the click and the take's bars keep it: a rit. would leave them behind.
  const timing = (performance.timing ?? []).filter(({ marks }) => marks.expression === undefined)
  const { sounds } = schedule(
    { ...performance, timing },
    {
      tempo: draft.tempo,
      hands: STAVES_ONLY,
      fromTick,
    },
  )
  return sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
}
