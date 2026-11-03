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

/** The staff a note is written on: a hand's the piano's upper or lower, a single staff's its own. */
export const noteStaff = (note: { readonly hand: NoteHand; readonly staff?: number }): StaffId =>
  note.hand === 'rh' ? 'treble' : note.hand === 'lh' ? 'bass' : singleStaff(note.staff ?? 0)
