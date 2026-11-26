import { isRecord } from '@/shared/lib'
import type { Json } from './database.types'

/** Whether a value is JSON as a request carries it: text, a number, true or false, null, or lists and records of them. */
export const isJson = (value: unknown): value is Json =>
  value === null ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean' ||
  (Array.isArray(value) && value.every(isJson)) ||
  (isRecord(value) && Object.values(value).every((field) => field === undefined || isJson(field)))

/**
 * A value as the JSON a request sends: what JSON.stringify keeps of it (an undefined field left out, a
 * date as its text, nothing at all as null), `replace` run on each value on the way as its replacer.
 */
export function toJson(value: unknown, replace?: (key: string, value: unknown) => unknown): Json {
  const parsed: unknown = JSON.parse(JSON.stringify(value, replace) ?? 'null')
  if (!isJson(parsed)) throw new TypeError('JSON.parse read a value JSON cannot hold')
  return parsed
}
