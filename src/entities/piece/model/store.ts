import type { StoreApi } from 'zustand/vanilla'
import { isPatternId } from '@/entities/pattern'
import { createSavedStore, isOneOf, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import {
  CLEFS,
  isMeter,
  isTempoUnit,
  isWrittenKey,
  parseKey,
  TICKS_PER_BEAT,
  type Tick,
} from '@/shared/lib/music'
import { barTicksOf, chartOf, stavesOf } from './chart'
import { ContentError } from './content-error'
import { musicOf, type PieceMusic } from './music'
import {
  isOwnSongId,
  ownSongNumber,
  PIECE_TEMPO,
  songTitle,
  type OwnSong,
  type OwnSongId,
} from './own'
import {
  SECTION_KINDS,
  staffName,
  type ChartPiece,
  type Hands,
  type KeyText,
  type LyricsStaff,
  type PieceId,
  type PieceStaff,
  type Section,
} from './types'

export const PIECES_STORAGE_KEY = 'pt-pieces'
export const PIECES_VERSION = 8

/** The learner's pieces. */
export interface PiecesState {
  /** The learner's version of a catalog song, study or listing, by its id. */
  readonly versions: Readonly<Record<PieceId, PieceMusic>>
  /** In the order made. */
  readonly songs: readonly OwnSong[]
  /** The next own song's number: a deleted id is never given again. */
  readonly nextSong: number
}

export type PiecesStore = StoreApi<PiecesState>

const INITIAL: PiecesState = { versions: {}, songs: [], nextSong: 1 }

export const createPiecesStore = (saving: SavingOptions = {}): PiecesStore =>
  createSavedStore(
    { key: PIECES_STORAGE_KEY, version: PIECES_VERSION, initial: INITIAL, read: sanitize },
    saving,
  )

const KEY_TEXT = /^[A-G][#b]?m?$/
/** A key as a song's text names it, one a signature writes (no A# major, with its ten sharps). */
const isKeyText = (value: unknown): value is KeyText => {
  if (typeof value !== 'string' || !KEY_TEXT.test(value)) return false
  const key = parseKey(value)
  return key !== null && isWrittenKey(key)
}
const isSectionKind = isOneOf(SECTION_KINDS)
const isClef = isOneOf(CLEFS)
const isText = (value: unknown): value is string => typeof value === 'string'
/** A staff the lyrics are on, of `staves` single staves: one of them by its place, or the upper staff. */
const isLyricsStaff = (value: unknown, staves: number): value is LyricsStaff =>
  value === 'rh' ||
  (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < staves)
/** A tempo in the song's beats a minute: a mark in another unit's may be a part of one, a whole tick's. */
const isTempo = (value: unknown): value is number =>
  typeof value === 'number' &&
  Math.abs(value * TICKS_PER_BEAT - Math.round(value * TICKS_PER_BEAT)) < 1e-6 &&
  value >= PIECE_TEMPO.min &&
  value <= PIECE_TEMPO.max

/** A saved section whose fields read; its chart is read with the piece's, in its own meter. */
function sectionOf(saved: unknown): Section | null {
  if (!isRecord(saved)) return null
  const { kind, n, label, last, detail, key, meter, pattern, lines } = saved
  if (!isSectionKind(kind) || !Array.isArray(lines) || !lines.every(isText)) return null
  const number = typeof n === 'number' && Number.isInteger(n) && n > 0 ? n : undefined
  const en = isRecord(detail) ? detail.en : undefined
  const ru = isRecord(detail) ? detail.ru : undefined
  return {
    kind,
    ...(number === undefined ? {} : { n: number }),
    ...(isText(label) && label !== '' ? { label } : {}),
    ...(last === true ? { last } : {}),
    ...(isText(en) && isText(ru) ? { detail: { en, ru } } : {}),
    ...(isKeyText(key) ? { key } : {}),
    ...(isMeter(meter) ? { meter } : {}),
    ...(isPatternId(pattern) ? { pattern } : {}),
    lines,
  }
}

/**
 * A saved single staff whose fields read (ADR 0097): its notes, its clef, its name as typed (as the
 * editor keeps one: trimmed, at most its letters) or in both languages.
 */
function staffOf(saved: unknown): PieceStaff | null {
  if (!isRecord(saved) || !isText(saved.notes)) return null
  const { name, clef } = saved
  const typed = isText(name) ? staffName(name) : undefined
  const en = isRecord(name) ? name.en : undefined
  const ru = isRecord(name) ? name.ru : undefined
  return {
    ...(typed !== undefined
      ? { name: typed }
      : isText(en) && isText(ru)
        ? { name: { en, ru } }
        : {}),
    ...(isClef(clef) && clef !== 'treble' ? { clef } : {}),
    notes: saved.notes,
  }
}

function savedHands(saved: unknown): Hands | undefined {
  if (!isRecord(saved)) return undefined
  const hands = {
    ...(isText(saved.rh) ? { rh: saved.rh } : {}),
    ...(isText(saved.lh) ? { lh: saved.lh } : {}),
  }
  return hands.rh === undefined && hands.lh === undefined ? undefined : hands
}

/** The ticks a piece's chart lasts. */
const chartTicks = (piece: ChartPiece): Tick =>
  barTicksOf(piece).reduce((sum, ticks) => sum + ticks, 0)

/** Whether a piece's words read on the staff they are on (ADR 0097): a verse longer than its tune does not. */
function singsLyrics(piece: ChartPiece): boolean {
  try {
    stavesOf(piece)
    chartOf(piece)
    return true
  } catch (error) {
    if (error instanceof ContentError) return false
    throw error
  }
}

/**
 * Saved music that reads as a piece's: its fields, its chart, single staves and hands; null
 * otherwise. Its words are kept where they read on the staff they are on (ADR 0097), its own title
 * where it is one (ADR 0114), a lead sheet only where it has a single staff: a score never hides
 * every staff (ADR 0114, 0097).
 */
function musicOfSaved(saved: unknown): PieceMusic | null {
  if (!isRecord(saved)) return null
  const { key, meter, tempo, pattern, sections, staves, leadSheet, hands, lyrics, lyricsOn } = saved
  if (!isKeyText(key) || !isMeter(meter) || !isTempo(tempo) || !isPatternId(pattern)) return null
  if (!Array.isArray(sections) || sections.length === 0) return null
  const read = sections.map(sectionOf)
  if (!read.every((section) => section !== null)) return null
  const single = staves === undefined ? [] : Array.isArray(staves) ? staves.map(staffOf) : [null]
  if (!single.every((staff) => staff !== null)) return null
  const written = savedHands(hands)
  const piece: ChartPiece = {
    id: 'saved',
    kind: 'song',
    title: 'saved',
    key,
    meter,
    ...(saved.timeSymbol === true ? { timeSymbol: true } : {}),
    ...(isTempoUnit(saved.tempoUnit) ? { tempoUnit: saved.tempoUnit } : {}),
    tempo,
    pattern,
    sections: read,
    ...(single.length > 0 ? { staves: single } : {}),
    ...(single.length > 0 && leadSheet === true ? { leadSheet } : {}),
    ...(written ? { hands: written } : {}),
    ...(isLyricsStaff(lyricsOn, single.length) ? { lyricsOn } : {}),
  }
  try {
    const ends = stavesOf(piece).flatMap(({ notes }) =>
      notes.map((n) => n.startTick + n.durationTicks),
    )
    const fits = Math.max(0, ...ends) <= chartTicks(piece)
    if (!fits) return null
    const verses = Array.isArray(lyrics) && lyrics.every(isText) ? lyrics : undefined
    const sung = verses && singsLyrics({ ...piece, lyrics: verses }) ? { lyrics: verses } : {}
    const named = isText(saved.title) ? songTitle(saved.title) : null
    return { ...(named === null ? {} : { title: named }), ...musicOf({ ...piece, ...sung }) }
  } catch (error) {
    if (error instanceof ContentError) return null
    throw error
  }
}

/** A song as it travels without an id (a shared link): its title and its music. */
export interface SharedSong {
  readonly title: string
  readonly music: PieceMusic
}

/** A song from outside the app, read as a save is: a title and music that read, else null. */
export function readSharedSong(saved: unknown): SharedSong | null {
  if (!isRecord(saved) || !isText(saved.title)) return null
  const title = songTitle(saved.title)
  const read = musicOfSaved(saved)
  if (!title || !read) return null
  const { title: _title, ...music } = read
  return { title, music }
}

function songOf(saved: unknown): OwnSong | null {
  if (!isRecord(saved) || !isOwnSongId(saved.id)) return null
  const song = readSharedSong(saved)
  return song ? { id: saved.id, title: song.title, ...song.music } : null
}

/** The value already held where it has the same content: a screen's memos over it hold. */
const same = <T>(read: T, held: T | undefined): T =>
  held !== undefined && JSON.stringify(held) === JSON.stringify(read) ? held : read

/**
 * Stored JSON is untrusted: music is kept only where it reads as a piece's. Music as it was held
 * stays the object held, so another tab's save of one song leaves every other piece as it was (an
 * open Player of another goes on playing).
 */
function sanitize(persisted: unknown, current: PiecesState): PiecesState {
  const saved = savedObject<PiecesState>(persisted)
  const versions: Record<PieceId, PieceMusic> = {}
  if (isRecord(saved.versions)) {
    for (const [id, value] of Object.entries(saved.versions)) {
      const music = musicOfSaved(value)
      if (music && !isOwnSongId(id)) versions[id] = same(music, current.versions[id])
    }
  }
  const seen = new Set<OwnSongId>()
  const songs = (Array.isArray(saved.songs) ? saved.songs : []).flatMap((value) => {
    const song = songOf(value)
    if (!song || seen.has(song.id)) return []
    seen.add(song.id)
    return [
      same(
        song,
        current.songs.find((held) => held.id === song.id),
      ),
    ]
  })
  const past = Math.max(0, ...songs.map((song) => ownSongNumber(song.id))) + 1
  const next =
    typeof saved.nextSong === 'number' && Number.isSafeInteger(saved.nextSong) ? saved.nextSong : 1
  return { versions, songs, nextSong: Math.max(next, past, 1) }
}
