import type { LocalText } from '@/shared/i18n'
import { isRecord } from '@/shared/lib'

const isLocalText = (value: unknown): value is LocalText =>
  isRecord(value) && typeof value.en === 'string' && typeof value.ru === 'string'

/** Every LocalText inside a content value, with the path that reaches it, for the content tests. */
export function collectLocalTexts(value: unknown, path = ''): { path: string; text: LocalText }[] {
  if (isLocalText(value)) return [{ path, text: value }]
  if (typeof value !== 'object' || value === null) return []
  return Object.entries(value).flatMap(([key, child]) =>
    collectLocalTexts(child, path ? `${path}.${key}` : key),
  )
}
