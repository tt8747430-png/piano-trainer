import type { CallbackSearch } from '@/pages/account'
import { readText } from '@/shared/lib'
import type { Input, Raw } from './read-search'

// The sign-in callback: what the server's link brought back, read once and never written.
const optionalText = (value: unknown) => readText(value, '') || undefined
const readCallbackSearch = (raw: Raw): CallbackSearch => ({
  code: optionalText(raw.code),
  next: raw.next === 'reset' ? 'reset' : undefined,
  error: optionalText(raw.error),
})
export const callbackSearch = {
  validateSearch: (input: Input<CallbackSearch>): CallbackSearch => readCallbackSearch(input),
}
