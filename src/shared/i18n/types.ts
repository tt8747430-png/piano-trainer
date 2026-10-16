import type { en } from './locales/en'

/** The plural forms a language may have beyond English's `_one` and `_other` (Russian's few, many). */
type MorePlurals<K> = K extends `${infer Base}_other`
  ? `${Base}_${'zero' | 'two' | 'few' | 'many'}`
  : never

/**
 * The same keys as English, every leaf a string: a missing or extra Russian key fails tsc, but for
 * the plural forms English has no word for, beside a key English counts with `_one` and `_other`.
 */
export type DeepStrings<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>
} & { readonly [K in MorePlurals<keyof T>]?: string }

export type LocaleResources = DeepStrings<typeof en>
