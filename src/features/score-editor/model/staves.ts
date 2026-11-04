import { defaultLyricsStaff, staffName, type StaffName } from '@/entities/piece'
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
export function addStaff(
  draft: Draft,
  place: number,
  instrument: { readonly name?: StaffName; readonly clef?: Clef } = {},
): Draft {
  const at = Math.max(0, Math.min(place, draft.staves.length))
  // An instrument's staff (round 28, the score's Settings): its name and its clef.
  const added: DraftStaff = {
    ...(instrument.name === undefined ? {} : { name: instrument.name }),
    clef: instrument.clef ?? 'treble',
    notes: [],
  }
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
 * only staff in sight (ADR 0114). The words go with the notes they are on, the top single staff
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

/** Where a staff at `at` stands once the staff at `from` has moved to `to` (the others close up). */
export function placeAfterMove(at: number, from: number, to: number): number {
  if (at === from) return to
  if (from < at && at <= to) return at - 1
  if (to <= at && at < from) return at + 1
  return at
}

/**
 * The single staff at `from` moved to `to`, top down (A40, Flat's instruments dragged by their
 * handles): its notes, name and clef with it, the words kept on the staff they are on. The piano's
 * grand staff stays under the single staves.
 */
export function moveStaff(draft: Draft, from: number, to: number): Draft {
  const moved = draft.staves[from]
  const at = Math.max(0, Math.min(to, draft.staves.length - 1))
  if (!moved || at === from) return draft
  const others = draft.staves.filter((_, i) => i !== from)
  const { lyricsOn } = draft
  return {
    ...draft,
    staves: [...others.slice(0, at), moved, ...others.slice(at)],
    lyricsOn: typeof lyricsOn === 'number' ? placeAfterMove(lyricsOn, from, at) : lyricsOn,
  }
}

/**
 * The single staves put in a new order (A40, Flat's Sort › Score order): `order` names, top down,
 * the place each staff stood at; the words kept on their staff. An order that is not the staves'
 * own places, each once, changes nothing.
 */
export function orderStaves(draft: Draft, order: readonly number[]): Draft {
  const count = draft.staves.length
  const each = new Set(order)
  if (order.length !== count || each.size !== count || order.some((at) => !draft.staves[at]))
    return draft
  if (order.every((at, i) => at === i)) return draft
  const { lyricsOn } = draft
  return {
    ...draft,
    staves: order.map((at) => draft.staves[at] as DraftStaff),
    lyricsOn: typeof lyricsOn === 'number' ? order.indexOf(lyricsOn) : lyricsOn,
  }
}

/**
 * A single staff changed to another instrument (A40, Flat's Change instrument): its name and its
 * clef, its notes as they are; a staff of no instrument's name loses its name.
 */
export function setStaffInstrument(
  draft: Draft,
  place: number,
  instrument: { readonly name?: StaffName; readonly clef: Clef },
): Draft {
  return withStaff(draft, place, (staff) => {
    const { name: _was, ...nameless } = staff
    const changed: DraftStaff = {
      ...nameless,
      ...(instrument.name === undefined ? {} : { name: instrument.name }),
      clef: instrument.clef,
    }
    return changed.clef === staff.clef && changed.name === staff.name ? staff : changed
  })
}
