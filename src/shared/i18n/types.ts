import type { en } from './locales/en'

/** The same keys as English, every leaf a string: a missing or extra Russian key fails tsc. */
export type DeepStrings<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>
}

export type LocaleResources = DeepStrings<typeof en>
