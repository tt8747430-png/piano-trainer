import { defaultLyricsStaff, staffName } from '@/entities/piece'
import type { Clef } from '@/shared/lib/music'
import type { Draft, DraftStaff } from './draft'
import { verseCount } from './lyrics'

/** The draft with the single staff at `place` changed; the draft itself where it has none there or nothing changed. */
function withStaff(draft: Draft, place: number, change: (staff: DraftStaff) => DraftStaff): Draft {
  const staff = draft.staves[place]
  const changed = staff && change(staff)
  if (!changed || changed === staff) return draft
  return { ...draft, staves: draft.staves.map((each, i) => (i === place ? changed : each)) }
}

/**
 * A single staff added at `place` top down (ADR 0097, Flat's Add instrument): over the staff there,
 * or after the last, over the piano; a treble staff with nothing on it yet. The words stay on their
 * staff; a song with none yet takes them on its top single staff.
 */
export function addStaff(draft: Draft, place: number): Draft {
  const at = Math.max(0, Math.min(place, draft.staves.length))
  const added: DraftStaff = { clef: 'treble', notes: [] }
  const { lyricsOn } = draft
  return {
    ...draft,
    staves: [...draft.staves.slice(0, at), added, ...draft.staves.slice(at)],
    lyricsOn:
      verseCount(draft) === 0
        ? 0
        : typeof lyricsOn === 'number' && lyricsOn >= at
          ? lyricsOn + 1
          : lyricsOn,
  }
}

/**
 * The single staff at `place` taken away with its notes (ADR 0097): never a lead sheet's last, the
 * only staff in sight (ADR 0083). The words go with the notes they are on, the top single staff
 * (else the upper staff) left to take them next; another staff's keep theirs.
 */
export function removeStaff(draft: Draft, place: number): Draft {
  if (!draft.staves[place] || (draft.leadSheet && draft.staves.length === 1)) return draft
  const staves = draft.staves.filter((_, i) => i !== place)
  const { lyricsOn } = draft
  return {
    ...draft,
    staves,
    lyricsOn:
      lyricsOn === place
        ? defaultLyricsStaff({ staves })
        : typeof lyricsOn === 'number' && lyricsOn > place
          ? lyricsOn - 1
          : lyricsOn,
  }
}

/** A single staff's printed name, as typed (ADR 0097): trimmed; an empty one takes it away. */
export function renameStaff(draft: Draft, place: number, text: string): Draft {
  const name = staffName(text)
  return withStaff(draft, place, (staff) => {
    if (name === staff.name) return staff
    const { name: _was, ...nameless } = staff
    return name === undefined ? nameless : { ...nameless, name }
  })
}

/** A single staff written in another clef, its notes as they are (ADR 0097). */
export const setStaffClef = (draft: Draft, place: number, clef: Clef): Draft =>
  withStaff(draft, place, (staff) => (staff.clef === clef ? staff : { ...staff, clef }))
