import type { LocalText } from '@/shared/i18n'
import { sanitiseStyle } from '@/shared/lib/style'
import type { LessonBlock, LessonSection } from './types'

/**
 * A page's About (R29 B9): the lesson's document under a course's, the Courses' or a song's head,
 * sections of a heading and blocks, each block in a style of its own. Written in the lesson editor's
 * document; read by the lesson view's blocks.
 */
export type About = readonly LessonSection[]

const isText = (value: unknown): value is LocalText =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Partial<LocalText>).en === 'string' &&
  typeof (value as Partial<LocalText>).ru === 'string'

const isBlock = (value: unknown): value is LessonBlock =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { kind?: unknown }).kind === 'string'

/** A block with its style read through the one sanitiser; none where it has none. */
function styled<T extends { readonly style?: unknown }>(value: T): T {
  if (value.style === undefined) return value
  return { ...value, style: sanitiseStyle(value.style) }
}

/**
 * A saved or published About read: a list of sections, each a heading in both languages and a list
 * of blocks of a kind; every style through `sanitiseStyle`. Anything else reads as none.
 */
export function readAbout(value: unknown): About | undefined {
  if (!Array.isArray(value)) return undefined
  const sections: LessonSection[] = []
  for (const each of value as unknown[]) {
    if (typeof each !== 'object' || each === null) return undefined
    const section = each as Partial<Record<keyof LessonSection, unknown>>
    if (!isText(section.heading) || !Array.isArray(section.blocks)) return undefined
    if (!section.blocks.every(isBlock)) return undefined
    if (section.takeaway !== undefined && !isText(section.takeaway)) return undefined
    sections.push({
      heading: section.heading,
      blocks: section.blocks.map((block) => styled(block)),
      ...(section.takeaway ? { takeaway: section.takeaway } : {}),
      ...(section.style !== undefined ? { style: sanitiseStyle(section.style) } : {}),
      ...(section.takeawayStyle !== undefined
        ? { takeawayStyle: sanitiseStyle(section.takeawayStyle) }
        : {}),
    })
  }
  return sections
}

/** Whether an About has anything to show: a heading or a block. */
export const hasAbout = (about: About | undefined): about is About =>
  !!about?.some(
    (section) =>
      section.blocks.length > 0 ||
      section.heading.en.trim() !== '' ||
      section.heading.ru.trim() !== '',
  )

/** A picture's address as it is drawn: an `https://` URL, nothing else (no `data:`, no script). */
export function imageSource(src: string): string | null {
  if (!src.startsWith('https://')) return null
  try {
    const url = new URL(src)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
