import { barsOf, type Draft } from '@/features/score-editor'
import { schedule, type NoteSound } from '@/shared/lib/schedule'
import { arrangeDraft } from './arrange-draft'

/** The tune alone: no hand's notes. */
const TUNE_ONLY = { rh: false, lh: false, melody: true } as const

/**
 * The song's tune from its bar `from` (an index) at its tempo, its first note at 0 s: what plays
 * under a take from its downbeat (spec 2026-10-09 §4.2), so an accompaniment is recorded against
 * the song it accompanies.
 */
export function tuneOf(draft: Draft, from: number): NoteSound[] {
  const fromTick = barsOf(draft)[from]?.start ?? 0
  const { sounds } = schedule(arrangeDraft(draft), {
    tempo: draft.tempo,
    hands: TUNE_ONLY,
    fromTick,
  })
  return sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
}
