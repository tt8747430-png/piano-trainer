import type { StoreApi } from 'zustand/vanilla'
import { isPatternId } from '@/entities/pattern'
import { createSavedStore, isOneOf, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { isMeter, parseKey, type Tick } from '@/shared/lib/music'
import { barTicksOf } from './chart'
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
import { parseMelody } from './parse-melody'
import {
  SECTION_KINDS,
  type ChartPiece,
  type Hands,
  type KeyText,
  type PieceId,
  type Section,
} from './types'

export const PIECES_STORAGE_KEY = 'pt-pieces'
export const PIECES_VERSION = 1

/** The learner's pieces (spec 2026-10-01-score-editor §4). */
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
const isKeyText = (value: unknown): value is KeyText =>
  typeof value === 'string' && KEY_TEXT.test(value) && parseKey(value) !== null
const isSectionKind = isOneOf(SECTION_KINDS)
const isText = (value: unknown): value is string => typeof value === 'string'
const isTempo = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= PIECE_TEMPO.min &&
  value <= PIECE_TEMPO.max

/** A saved section whose fields read; its chart is read with the piece's. */
function sectionOf(saved: unknown): Section | null {
  if (!isRecord(saved)) return null
  const { kind, n, label, last, detail, lines } = saved
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
    lines,
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

/** Saved music that reads as a piece's: its fields, its chart, melody and hands; null otherwise. */
function musicOfSaved(saved: unknown): PieceMusic | null {
  if (!isRecord(saved)) return null
  const { key, meter, tempo, pattern, sections, melody, hands } = saved
  if (!isKeyText(key) || !isMeter(meter) || !isTempo(tempo) || !isPatternId(pattern)) return null
  if (!Array.isArray(sections) || sections.length === 0) return null
  const read = sections.map(sectionOf)
  if (!read.every((section) => section !== null)) return null
  const written = savedHands(hands)
  const piece: ChartPiece = {
    id: 'saved',
    kind: 'song',
    title: 'saved',
    key,
    meter,
    tempo,
    pattern,
    sections: read,
    ...(isText(melody) ? { melody } : {}),
    ...(written ? { hands: written } : {}),
  }
  try {
    const tune = parseMelody(piece) ?? []
    const end = Math.max(0, ...tune.map((n) => n.startTick + n.durationTicks))
    return end <= chartTicks(piece) ? musicOf(piece) : null
  } catch (error) {
    if (error instanceof ContentError) return null
    throw error
  }
}

function songOf(saved: unknown): OwnSong | null {
  if (!isRecord(saved) || !isOwnSongId(saved.id) || !isText(saved.title)) return null
  const title = songTitle(saved.title)
  const music = musicOfSaved(saved)
  return title && music ? { id: saved.id, title, ...music } : null
}

/** Stored JSON is untrusted: music is kept only where it reads as a piece's. */
function sanitize(persisted: unknown): PiecesState {
  const saved = savedObject<PiecesState>(persisted)
  const versions: Record<PieceId, PieceMusic> = {}
  if (isRecord(saved.versions)) {
    for (const [id, value] of Object.entries(saved.versions)) {
      const music = musicOfSaved(value)
      if (music && !isOwnSongId(id)) versions[id] = music
    }
  }
  const seen = new Set<OwnSongId>()
  const songs = (Array.isArray(saved.songs) ? saved.songs : []).flatMap((value) => {
    const song = songOf(value)
    if (!song || seen.has(song.id)) return []
    seen.add(song.id)
    return [song]
  })
  const past = Math.max(0, ...songs.map((song) => ownSongNumber(song.id))) + 1
  const next =
    typeof saved.nextSong === 'number' && Number.isInteger(saved.nextSong) ? saved.nextSong : 1
  return { versions, songs, nextSong: Math.max(next, past, 1) }
}
