import { isRecord, plainText } from '@/shared/lib'

/**
 * The credits a score carries (Flat's, MuseScore's), in the order they are asked for: those printed
 * under its title, then the facts a publisher prints at its foot (A28).
 */
export const HEADER_FIELDS = [
  'subtitle',
  'composer',
  'lyricist',
  'arranger',
  'translator',
  'tune',
  'source',
  'year',
  'copyright',
] as const
export type HeaderField = (typeof HEADER_FIELDS)[number]

/** The credits asked for on every score; the others are added by role (Add credit). */
export const USUAL_HEADER_FIELDS: readonly HeaderField[] = [
  'subtitle',
  'composer',
  'lyricist',
  'arranger',
]

/**
 * What a score prints under its title (Flat's credits, ADR 0114): its subtitle centred under it with
 * its hymn tune's name, the composer and the arranger at the right, the lyricist and the translator
 * at the left; its source, year and copyright kept with it; each as the learner typed it.
 */
export type ScoreHeader = Readonly<Partial<Record<HeaderField, string>>>

/** The longest a header's line takes. */
export const HEADER_MAX = 80

/** A header's line as the score keeps it: plain, trimmed, 80 characters at most; none where none is left. */
export function headerLine(text: string): string | undefined {
  const line = plainText(text).slice(0, HEADER_MAX).trim()
  return line === '' ? undefined : line
}

/** A header with one line given anew: an empty one takes it away. */
export function withHeaderLine(header: ScoreHeader, field: HeaderField, text: string): ScoreHeader {
  const line = headerLine(text)
  const { [field]: _was, ...rest } = header
  return line === undefined ? rest : { ...rest, [field]: line }
}

/** A saved header, read line by line; none where none of its lines reads. */
export function savedHeader(saved: unknown): ScoreHeader | undefined {
  if (!isRecord(saved)) return undefined
  let header: ScoreHeader = {}
  for (const field of HEADER_FIELDS) {
    const text = saved[field]
    if (typeof text === 'string') header = withHeaderLine(header, field, text)
  }
  return Object.keys(header).length > 0 ? header : undefined
}
