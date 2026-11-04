import type { NoteHand } from '@/shared/lib/arrangement'
import { isSingleStaff, singleStaff, type StaffId } from '@/shared/lib/notation'

/** What the Player plays and shows (A35): each staff of the score, and a song's recording. */
export type TrackId = StaffId | 'recording'

/** A track heard or not, a staff in sight or not. */
export interface TrackChoice {
  readonly play: boolean
  readonly show: boolean
}

/** The tracks the learner changed, by id; every other plays and shows (ADR 0105). */
export type PlayerStaves = Readonly<Partial<Record<TrackId, TrackChoice>>>

const ALL_ON: TrackChoice = { play: true, show: true }

export const trackOf = (staves: PlayerStaves, id: TrackId): TrackChoice => staves[id] ?? ALL_ON

/** The staves with one track changed; a track back to all on leaves the list. */
export function withTrack(
  staves: PlayerStaves,
  id: TrackId,
  change: Partial<TrackChoice>,
): PlayerStaves {
  const next = { ...trackOf(staves, id), ...change }
  const { [id]: _left, ...others } = staves
  return next.play && next.show ? others : { ...others, [id]: next }
}

/** A track's letter in the URL: the upper and lower staves, the recording, a single staff by place. */
const CODES: Readonly<Record<'treble' | 'bass' | 'recording', string>> = {
  treble: 'u',
  bass: 'l',
  recording: 'r',
}
const TOKEN = /^(u|l|r|t\d+)([01])s([01])$/

const idOf = (code: string): TrackId =>
  code === 'u'
    ? 'treble'
    : code === 'l'
      ? 'bass'
      : code === 'r'
        ? 'recording'
        : singleStaff(Number(code.slice(1)))
const codeOf = (id: TrackId): string => (isSingleStaff(id) ? `t${id.slice(5)}` : CODES[id])

/** Where a track stands in the score: the single staves top down, the piano's, then the recording. */
const rank = (id: TrackId): number =>
  isSingleStaff(id) ? Number(id.slice(5)) : 100 + ['treble', 'bass', 'recording'].indexOf(id)

const tokens = (param: string): string[] => param.split(',')

/** Whether a URL's `staves` reads: tracks it knows, each once (`u1s0,l0s1`). */
export function isStavesParam(value: unknown): value is string {
  if (typeof value !== 'string' || value === '') return false
  const codes = tokens(value).map((token) => TOKEN.exec(token)?.[1])
  return codes.every((code) => code !== undefined) && new Set(codes).size === codes.length
}

/** The staves a URL's `staves` writes; one it cannot read is all on. */
export function readStaves(param: string | undefined): PlayerStaves {
  if (!isStavesParam(param)) return {}
  return Object.fromEntries(
    tokens(param).map((token) => {
      const [, code = '', play, show] = TOKEN.exec(token) ?? []
      return [idOf(code), { play: play === '1', show: show === '1' }]
    }),
  )
}

/** The staves as a URL writes them, in the score's order; none where every track is all on. */
export function stavesParam(staves: PlayerStaves): string | undefined {
  const written = (Object.keys(staves) as TrackId[])
    .sort((a, b) => rank(a) - rank(b))
    .map((id) => {
      const { play, show } = trackOf(staves, id)
      return `${codeOf(id)}${play ? 1 : 0}s${show ? 1 : 0}`
    })
  return written.length > 0 ? written.join(',') : undefined
}

/** The staves out of sight, in the score's order: the recording is never one. */
export const hiddenStaves = (staves: PlayerStaves): StaffId[] =>
  (Object.keys(staves) as TrackId[])
    .filter((id): id is StaffId => id !== 'recording' && !trackOf(staves, id).show)
    .sort((a, b) => rank(a) - rank(b))

/** The tracks changed at once: each of `ids` given `change`. */
const withTracks = (
  staves: PlayerStaves,
  ids: readonly TrackId[],
  change: (id: TrackId) => Partial<TrackChoice>,
): PlayerStaves => ids.reduce((kept, id) => withTrack(kept, id, change(id)), staves)

/** Whether every one of `tracks` plays (the editor's All switch, A40). */
export const allPlay = (staves: PlayerStaves, tracks: readonly TrackId[]): boolean =>
  tracks.every((id) => trackOf(staves, id).play)

/** Every one of `tracks` heard, or none (A40, Flat's All). */
export const withAllPlaying = (
  staves: PlayerStaves,
  tracks: readonly TrackId[],
  play: boolean,
): PlayerStaves => withTracks(staves, tracks, () => ({ play }))

/** Whether `soloed` alone of `tracks` plays (Flat's S). */
export const isSolo = (
  staves: PlayerStaves,
  soloed: readonly TrackId[],
  tracks: readonly TrackId[],
): boolean => tracks.every((id) => trackOf(staves, id).play === soloed.includes(id))

/**
 * Solo (A40, Flat's S): `soloed` alone heard, every other track silent; pressed again on the one
 * soloed, every track heard again.
 */
export function withSolo(
  staves: PlayerStaves,
  soloed: readonly TrackId[],
  tracks: readonly TrackId[],
): PlayerStaves {
  if (isSolo(staves, soloed, tracks)) return withAllPlaying(staves, tracks, true)
  return withTracks(staves, tracks, (id) => ({ play: soloed.includes(id) }))
}

/**
 * Some staves shown or hidden (A40, the eye): never every staff of `tracks` out of sight, as the
 * sheets never hide every staff (ADR 0114); such a change leaves the staves as they were.
 */
export function withShown(
  staves: PlayerStaves,
  ids: readonly TrackId[],
  show: boolean,
  tracks: readonly TrackId[],
): PlayerStaves {
  const next = withTracks(staves, ids, () => ({ show }))
  return tracks.some((id) => trackOf(next, id).show) ? next : staves
}

/**
 * The single staves' choices after the staff at `from` moved to `to` (A40), or was taken away (`to`
 * null): each choice follows its staff.
 */
export function movedStaves(staves: PlayerStaves, from: number, to: number | null): PlayerStaves {
  const placeOf = (at: number): number | null => {
    if (to === null) return at === from ? null : at > from ? at - 1 : at
    if (at === from) return to
    if (from < at && at <= to) return at - 1
    if (to <= at && at < from) return at + 1
    return at
  }
  return Object.fromEntries(
    (Object.keys(staves) as TrackId[]).flatMap((id): [TrackId, TrackChoice | undefined][] => {
      if (!isSingleStaff(id)) return [[id, staves[id]]]
      const place = placeOf(Number(id.slice(5)))
      return place === null ? [] : [[singleStaff(place), staves[id]]]
    }),
  )
}

/** The single staves' choices once the staves stand in `order` (each the place it stood at). */
export const orderedStaves = (staves: PlayerStaves, order: readonly number[]): PlayerStaves =>
  Object.fromEntries(
    (Object.keys(staves) as TrackId[]).map((id): [TrackId, TrackChoice | undefined] => [
      isSingleStaff(id) ? singleStaff(order.indexOf(Number(id.slice(5)))) : id,
      staves[id],
    ]),
  )

/** The staff a note is written on: a hand's the piano's upper or lower, a single staff's its own. */
export const noteStaff = (note: { readonly hand: NoteHand; readonly staff?: number }): StaffId =>
  note.hand === 'rh' ? 'treble' : note.hand === 'lh' ? 'bass' : singleStaff(note.staff ?? 0)
