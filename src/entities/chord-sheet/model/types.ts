import { TRANSPOSITION_RANGE } from '@/shared/lib/music'

/** The band's instruments, each turned on or off and up or down on a sheet (R29 CP6). */
export const BAND_PARTS = ['piano', 'bass', 'drums'] as const
export type BandPart = (typeof BAND_PARTS)[number]

export interface PartLevel {
  readonly on: boolean
  /** 0 to 100 %. */
  readonly level: number
}

/** How a sheet is played (R29 CP6): saved with it. */
export interface ChordSheetSettings {
  readonly piano: PartLevel
  readonly bass: PartLevel
  readonly drums: PartLevel
  /** A bar counted in before the music. */
  readonly countIn: boolean
  /** How many times the sheet plays through, 1 to 8; 0 again and again until Stop. */
  readonly plays: number
  /** 0 to 100 %. */
  readonly volume: number
  /** Semitones the sheet is heard and shown moved by, the short way: −5 to +6. */
  readonly transpose: number
}

export const DEFAULT_SHEET_SETTINGS: ChordSheetSettings = {
  piano: { on: true, level: 80 },
  bass: { on: true, level: 70 },
  drums: { on: true, level: 70 },
  countIn: false,
  plays: 0,
  volume: 80,
  transpose: 0,
}

/** The tempos a chord sheet plays at, in beats a minute. */
export const SHEET_TEMPO = { min: 40, max: 240 } as const
/** The most times a sheet plays through before it ends (0: until Stop). */
export const SHEET_PLAYS = 8
export const TRANSPOSE_RANGE = TRANSPOSITION_RANGE

/** A sheet as kept (R29 CP5): its text (`sheetToText`), its style, its tempo and how it plays. */
export interface ChordSheetEntry {
  readonly text: string
  /**
   * One of My chord sheets' edits since its last Save, as text, kept on the device and synced; the
   * sheet opens on it, and Save makes it the sheet's chords. None while nothing is changed.
   */
  readonly draft: string | null
  readonly style: string
  readonly tempo: number
  readonly settings: ChordSheetSettings
}

/** One of My chord sheets: an entry with its id and its name. */
export interface SavedChordSheet extends ChordSheetEntry {
  readonly id: string
  readonly name: string
}

/** At most this many of the learner's own sheets are kept. */
export const MOST_SHEETS = 100
/** A sheet's name: 1 to 60 characters. */
export const SHEET_NAME_MAX = 60

/** A name as kept: trimmed, 1 to 60 characters; null for none. */
export function sheetName(name: string): string | null {
  const trimmed = name.trim()
  return trimmed.length > 0 && trimmed.length <= SHEET_NAME_MAX ? trimmed : null
}
