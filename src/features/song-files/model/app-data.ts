import { isPatternId, type PatternId } from '@/entities/pattern'
import { SECTION_KINDS } from '@/entities/piece'
import type { Draft, DraftHeading } from '@/features/score-editor'
import { isOneOf, isRecord } from '@/shared/lib'
import { isMeter } from '@/shared/lib/music'

/** The version of the data a file keeps for the app: another version's is not read. */
const VERSION = 1

/**
 * What a song's MusicXML keeps for the app alone (ADR 0107), which the music cannot say: the
 * pattern it plays, each section's heading and its lines' bars, and each chord's method code.
 */
export interface SongFileData {
  readonly pattern: PatternId
  readonly sections: readonly {
    readonly heading: DraftHeading
    /** Each line's bars. */
    readonly lines: readonly number[]
  }[]
  /** A chord's method code, by its bar's index and its place in the bar. */
  readonly methods: readonly (readonly [number, number, string])[]
}

/** A draft's own data, as its file keeps it. */
export function songFileData(draft: Draft): SongFileData {
  let index = 0
  const methods: [number, number, string][] = []
  const sections = draft.sections.map((section) => ({
    heading: section.heading,
    lines: section.lines.map((line) => {
      for (const bar of line) {
        bar.chords.forEach((chord, place) => {
          if (chord.method) methods.push([index, place, chord.method])
        })
        index += 1
      }
      return line.length
    }),
  }))
  return { pattern: draft.pattern, sections, methods }
}

export const writeSongFileData = (data: SongFileData): string =>
  JSON.stringify({ version: VERSION, ...data })

const isSectionKind = isOneOf(SECTION_KINDS)
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0

function headingOf(saved: unknown): DraftHeading | null {
  if (!isRecord(saved) || !isSectionKind(saved.kind)) return null
  const { kind, n, label, last, detail, key, meter } = saved
  const en = isRecord(detail) ? detail.en : undefined
  const ru = isRecord(detail) ? detail.ru : undefined
  return {
    kind,
    ...(isCount(n) ? { n } : {}),
    ...(typeof label === 'string' && label !== '' ? { label } : {}),
    ...(last === true ? { last } : {}),
    ...(typeof en === 'string' && typeof ru === 'string' ? { detail: { en, ru } } : {}),
    // The key is read again where the music is: a key that is none is dropped there.
    ...(typeof key === 'string' ? { key: key as DraftHeading['key'] } : {}),
    ...(isMeter(meter) ? { meter } : {}),
  }
}

/** A file's data for the app, where it is this version's and reads; else none. */
export function readSongFileData(text: string | undefined): SongFileData | undefined {
  if (text === undefined) return undefined
  let saved: unknown
  try {
    saved = JSON.parse(text)
  } catch {
    return undefined
  }
  if (!isRecord(saved) || saved.version !== VERSION || !isPatternId(saved.pattern)) return undefined
  if (!Array.isArray(saved.sections) || !Array.isArray(saved.methods)) return undefined
  const sections = saved.sections.map((section: unknown) => {
    if (!isRecord(section) || !Array.isArray(section.lines) || !section.lines.every(isCount))
      return null
    const heading = headingOf(section.heading)
    return heading ? { heading, lines: section.lines as number[] } : null
  })
  if (sections.length === 0 || !sections.every((section) => section !== null)) return undefined
  const methods = saved.methods.filter(
    (method: unknown): method is [number, number, string] =>
      Array.isArray(method) &&
      Number.isInteger(method[0]) &&
      Number.isInteger(method[1]) &&
      typeof method[2] === 'string',
  )
  return { pattern: saved.pattern, sections, methods }
}
