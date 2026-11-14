import type { StoreApi } from 'zustand/vanilla'
import { createSavedStore, isRecord, savedObject, type SavingOptions } from '@/shared/lib'
import { emptySheet, sheetToText, textToSheet } from '@/shared/lib/arrangement'
import {
  BAND_PARTS,
  DEFAULT_SHEET_SETTINGS,
  MOST_SHEETS,
  SHEET_PLAYS,
  SHEET_TEMPO,
  sheetName,
  TRANSPOSE_RANGE,
  type ChordSheetEntry,
  type ChordSheetSettings,
  type PartLevel,
  type SavedChordSheet,
} from './types'

export const CHORD_SHEETS_STORAGE_KEY = 'pt-chord-sheets'
export const CHORD_SHEETS_VERSION = 1
export { DEFAULT_SHEET_SETTINGS }

/** The style a sheet plays in when none it names is known: the Chord player's first, Pop 1. */
const DEFAULT_STYLE = 'pop-1'

/** The learner's chord sheets (R29 CP5): the one in hand, kept between visits, and My chord sheets. */
export interface ChordSheetsState {
  /** The sheet in hand when none of My chord sheets is open. */
  readonly scratch: ChordSheetEntry
  /** Newest first. */
  readonly mine: readonly SavedChordSheet[]
  /** The next sheet's number: a deleted id is never reused. */
  readonly nextId: number
}
export type ChordSheetsStore = StoreApi<ChordSheetsState>

/** A new sheet: one empty Verse in C major, 4/4, in Pop 1 at 100. */
export const NEW_ENTRY: ChordSheetEntry = {
  text: sheetToText(emptySheet()),
  draft: null,
  style: DEFAULT_STYLE,
  tempo: 100,
  settings: DEFAULT_SHEET_SETTINGS,
}

const INITIAL: ChordSheetsState = { scratch: NEW_ENTRY, mine: [], nextId: 1 }

export const createChordSheetsStore = (saving: SavingOptions = {}): ChordSheetsStore =>
  createSavedStore(
    {
      key: CHORD_SHEETS_STORAGE_KEY,
      version: CHORD_SHEETS_VERSION,
      initial: INITIAL,
      read: sanitize,
    },
    saving,
  )

const between = (value: unknown, min: number, max: number, otherwise: number): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : otherwise
const flag = (value: unknown, otherwise: boolean): boolean =>
  typeof value === 'boolean' ? value : otherwise

function partLevel(saved: unknown, otherwise: PartLevel): PartLevel {
  const part = isRecord(saved) ? saved : {}
  return { on: flag(part.on, otherwise.on), level: between(part.level, 0, 100, otherwise.level) }
}

/** Saved settings read field by field; at least one instrument stays on (the piano where none is). */
export function readSettings(saved: unknown): ChordSheetSettings {
  const settings = isRecord(saved) ? saved : {}
  const read: ChordSheetSettings = {
    piano: partLevel(settings.piano, DEFAULT_SHEET_SETTINGS.piano),
    bass: partLevel(settings.bass, DEFAULT_SHEET_SETTINGS.bass),
    drums: partLevel(settings.drums, DEFAULT_SHEET_SETTINGS.drums),
    countIn: flag(settings.countIn, DEFAULT_SHEET_SETTINGS.countIn),
    plays: between(settings.plays, 0, SHEET_PLAYS, DEFAULT_SHEET_SETTINGS.plays),
    volume: between(settings.volume, 0, 100, DEFAULT_SHEET_SETTINGS.volume),
    transpose: between(settings.transpose, TRANSPOSE_RANGE.min, TRANSPOSE_RANGE.max, 0),
  }
  return BAND_PARTS.some((part) => read[part].on)
    ? read
    : { ...read, piano: { ...read.piano, on: true } }
}

/** An entry that reads: its text a sheet; its style, tempo and settings read or their defaults. */
function readEntry(saved: unknown): ChordSheetEntry | null {
  if (!isRecord(saved) || typeof saved.text !== 'string') return null
  const sheet = textToSheet(saved.text)
  if (!sheet) return null
  const draft = typeof saved.draft === 'string' ? textToSheet(saved.draft) : null
  return {
    text: sheetToText(sheet),
    draft: draft ? sheetToText(draft) : null,
    style: typeof saved.style === 'string' && saved.style.length > 0 ? saved.style : DEFAULT_STYLE,
    tempo: between(saved.tempo, SHEET_TEMPO.min, SHEET_TEMPO.max, NEW_ENTRY.tempo),
    settings: readSettings(saved.settings),
  }
}

const SHEET_ID = /^sheet-(\d+)$/

/** Stored JSON is untrusted: what reads is kept, field by field. */
function sanitize(persisted: unknown): ChordSheetsState {
  const saved = savedObject<ChordSheetsState>(persisted)
  const seen = new Set<string>()
  const mine = (Array.isArray(saved.mine) ? saved.mine : []).flatMap(
    (value: unknown): SavedChordSheet[] => {
      if (!isRecord(value) || typeof value.id !== 'string' || !SHEET_ID.test(value.id)) return []
      const name = typeof value.name === 'string' ? sheetName(value.name) : null
      const entry = readEntry(value)
      if (!name || !entry || seen.has(value.id)) return []
      seen.add(value.id)
      return [{ id: value.id, name, ...entry }]
    },
  )
  const past = Math.max(0, ...mine.map(({ id }) => Number(SHEET_ID.exec(id)?.[1] ?? 0))) + 1
  return {
    scratch: readEntry(saved.scratch) ?? NEW_ENTRY,
    mine: mine.slice(0, MOST_SHEETS),
    nextId: Math.max(between(saved.nextId, 1, Number.MAX_SAFE_INTEGER, 1), past),
  }
}
