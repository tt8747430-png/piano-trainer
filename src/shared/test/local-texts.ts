import type { LocalText } from '@/shared/i18n'

const isLocalText = (value: unknown): value is LocalText =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Partial<Record<keyof LocalText, unknown>>).en === 'string' &&
  typeof (value as Partial<Record<keyof LocalText, unknown>>).ru === 'string'

/** Every LocalText inside a content value, with the path that reaches it, for the content tests. */
export function collectLocalTexts(value: unknown, path = ''): { path: string; text: LocalText }[] {
  if (isLocalText(value)) return [{ path, text: value }]
  if (typeof value !== 'object' || value === null) return []
  return Object.entries(value).flatMap(([key, child]) =>
    collectLocalTexts(child, path ? `${path}.${key}` : key),
  )
}
