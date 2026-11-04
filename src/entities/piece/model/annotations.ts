import { isOneOf } from '@/shared/lib'
import { DYNAMICS, type Dynamic } from '@/shared/lib/music'
import { isStaffId, type StaffId } from '@/shared/lib/notation'

const isDynamic: (value: unknown) => value is Dynamic = isOneOf(DYNAMICS)

/** The marks a learner types onto a song (R29 B8, D7): typed, never drawn. */
export const ANNOTATION_KINDS = [
  'text',
  'fingering',
  'dynamic',
  'breath',
  'pause',
  'circle',
] as const
export type AnnotationKind = (typeof ANNOTATION_KINDS)[number]

/** The longest text a mark keeps. */
export const ANNOTATION_TEXT_MAX = 40

/** A learner's mark on a song: where (its tick, on a staff), what, and its value where it has one. */
export type Annotation = {
  readonly at: number
  readonly staff: StaffId
} & (
  | { readonly kind: 'text'; readonly value: string }
  | { readonly kind: 'fingering'; readonly value: 1 | 2 | 3 | 4 | 5 }
  | { readonly kind: 'dynamic'; readonly value: Dynamic }
  | { readonly kind: 'breath' | 'pause' | 'circle' }
)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** A saved mark where it reads whole; null otherwise (a save is untrusted). */
export function annotationOf(saved: unknown): Annotation | null {
  if (!isRecord(saved)) return null
  const { at, staff, kind, value } = saved
  if (typeof at !== 'number' || !Number.isSafeInteger(at) || at < 0 || !isStaffId(staff))
    return null
  switch (kind) {
    case 'text':
      return typeof value === 'string' && value.trim() !== '' && value.length <= ANNOTATION_TEXT_MAX
        ? { at, staff, kind, value }
        : null
    case 'fingering':
      return value === 1 || value === 2 || value === 3 || value === 4 || value === 5
        ? { at, staff, kind, value }
        : null
    case 'dynamic':
      return isDynamic(value) ? { at, staff, kind, value } : null
    case 'breath':
    case 'pause':
    case 'circle':
      return { at, staff, kind }
    default:
      return null
  }
}

/** The same place and kind: a mark there of that kind is replaced, never doubled. */
export const samePlace = (a: Annotation, b: Annotation): boolean =>
  a.at === b.at && a.staff === b.staff && a.kind === b.kind
