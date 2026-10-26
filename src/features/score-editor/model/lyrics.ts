import { gatherLyrics, readLyrics } from '@/entities/piece'
import type { NoteLyrics, Tick } from '@/shared/lib/music'
import {
  isHandLayer,
  lyricsLayer,
  singleStaffOf,
  tuneNotes,
  type Draft,
  type DraftNote,
  type Layer,
} from './draft'
import { notesOf, startNear, withNotes } from './notes'

/**
 * Whether the Lyrics tool works where the caret writes (ADR 0093, 0097): on the staff the words are
 * on, a single staff the score has, or the upper staff in sight.
 */
export const singsHere = (draft: Draft, layer: Layer): boolean =>
  layer === lyricsLayer(draft) &&
  (isHandLayer(layer) ? !draft.leadSheet : singleStaffOf(draft, layer) !== undefined)

/**
 * Where the Lyrics field opens from a tick (ADR 0096): the tune's note there, else the next one, else
 * the last before; none where the tune has no note.
 */
export function sungFrom(draft: Draft, tick: Tick): Tick | null {
  const tune = tuneNotes(draft)
  const from = tune.find((n) => n.startTick >= tick) ?? tune.at(-1)
  return from?.startTick ?? null
}

/** How many verses the song has: as many as any note of its tune sings. */
export const verseCount = (draft: Draft): number => gatherLyrics(tuneNotes(draft)).length

/** The tune's note singing at `tick`: none at a rest or an empty place. */
export const sungAt = (draft: Draft, tick: Tick): DraftNote | null =>
  tuneNotes(draft).find((n) => n.startTick === tick) ?? null

/** The tune's note after (1) or before (−1) `tick`, where the Lyrics field moves on: none past the ends. */
export const sungNear = (draft: Draft, tick: Tick, direction: -1 | 1): Tick | null =>
  startNear(tuneNotes(draft), tick, direction)

/** The notes a syllable at index `from` is held over: no more of the empty places after it than it holds. */
function heldOver(tune: readonly DraftNote[], from: number, verse: number, most: number): number {
  let held = 0
  while (
    held < most &&
    from + 1 + held < tune.length &&
    (tune[from + 1 + held]?.lyrics?.[verse] ?? null) === null
  )
    held++
  return held
}

/**
 * What the tune's note at `tick` sings in `verse`, as the Lyrics field shows it and the content
 * writes it: its text, `-` where its word goes on, `_` for each note it is held over; nothing where
 * it sings nothing.
 */
export function syllableAt(draft: Draft, tick: Tick, verse: number): string {
  const tune = tuneNotes(draft)
  const index = tune.findIndex((n) => n.startTick === tick)
  const sung = tune[index]?.lyrics?.[verse]
  if (!sung) return ''
  const held = heldOver(tune, index, verse, sung.held)
  return `${sung.text}${sung.hyphen ? '-' : ''}${'_'.repeat(held)}`
}

/** A note's verses with `verse` set to `sung`, trailing silence trimmed; none left where every verse is silent. */
function withVerse(
  lyrics: NoteLyrics | undefined,
  verse: number,
  sung: NoteLyrics[number],
): NoteLyrics | undefined {
  const next = Array.from({ length: Math.max(lyrics?.length ?? 0, verse + 1) }, (_, v) =>
    v === verse ? sung : (lyrics?.[v] ?? null),
  )
  while (next.length > 0 && next.at(-1) === null) next.pop()
  return next.length > 0 ? next : undefined
}

/** The note with its verses changed: the field left out where none is left. */
function singing(n: DraftNote, lyrics: NoteLyrics | undefined): DraftNote {
  const { lyrics: _was, ...silent } = n
  return lyrics ? { ...silent, lyrics } : silent
}

/**
 * The draft with `text` sung on the tune's note at `tick` in `verse`, as the Lyrics field writes it
 * (ADR 0093, Flat's): a syllable, `-` where its word goes on, `_` holding it over the next notes,
 * which then sing nothing there; `~` or nothing leaves the note silent in that verse. A tick with
 * no note of the tune changes nothing.
 */
export function setSyllable(draft: Draft, tick: Tick, verse: number, text: string): Draft {
  const layer = lyricsLayer(draft)
  const tune = tuneNotes(draft)
  const index = tune.findIndex((n) => n.startTick === tick)
  if (index < 0) return draft
  const [sung = null, ...held] = readLyrics(text)
  const changed = new Map<DraftNote, DraftNote>()
  tune.slice(index, index + 1 + held.length).forEach((n, i) => {
    changed.set(n, singing(n, withVerse(n.lyrics, verse, i === 0 ? sung : null)))
  })
  return withNotes(
    draft,
    layer,
    notesOf(draft, layer).map((n) => changed.get(n) ?? n),
  )
}
