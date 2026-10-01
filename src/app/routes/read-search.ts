import { stripSearchParams, type SearchSchemaInput } from '@tanstack/react-router'
import { LEVELS, type Level } from '@/entities/path'
import { isOneOf } from '@/shared/lib'
import {
  CHORD_SIZES,
  INVERSIONS,
  KEY_WALKS,
  keyParam,
  note,
  numeralsParam,
  parseKey,
  parseNumerals,
  pitchClassOf,
  SCALE_KINDS,
  tonicSpelling,
  type Key,
} from '@/shared/lib/music'
import { HANDS } from '@/shared/lib/schedule'

// What every route's validator reads with. Validators run as the app opens, so this file and the
// validators import only what a URL is made of: never a chart's arrangement or a screen.

/**
 * What the router hands a validator. Links may pass any subset of the params; each validator reads
 * the input as `Record<string, unknown>`, because a URL can hold anything in any of them.
 *
 * Every validator writes each of its params, an invalid optional one as `undefined`: the router lays
 * a route's search over the raw one from the URL, so a param left out would let the raw value through.
 */
export type Input<S> = Partial<S> & SearchSchemaInput
export type Raw = Readonly<Record<string, unknown>>

/** A route's search options: its validator, and its defaults left out of the URL. */
export function routeSearch<S extends object>(validateSearch: (input: Input<S>) => S, defaults: S) {
  return {
    validateSearch,
    search: { middlewares: [stripSearchParams<S>(defaults)] },
  }
}

export const isHands = isOneOf(HANDS)
export const isScaleKind = isOneOf(SCALE_KINDS)
export const isChordSize = isOneOf(CHORD_SIZES)
export const isInversion = isOneOf(INVERSIONS)
export const isKeyWalk = isOneOf(KEY_WALKS)
export const isLevel = isOneOf<Level | 'any'>([...LEVELS, 'any'])

/** The key a tool or a progression opens in. */
export const C_MAJOR: Key = { tonic: note('C'), minor: false }
export const C_MAJOR_PARAM = keyParam(C_MAJOR)

/** A key from the URL, its tonic spelled by the key's one rule (`tonicSpelling`); null if none reads. */
export function readKey(raw: unknown): Key | null {
  const read = typeof raw === 'string' ? parseKey(raw) : null
  return read
    ? { tonic: tonicSpelling(pitchClassOf(read.tonic), read.minor), minor: read.minor }
    : null
}

/** Numerals from the URL, written one way; the fallback for a line that cannot be read. */
export function readNumerals(raw: unknown, fallback: string): string {
  const numerals = typeof raw === 'string' ? parseNumerals(raw) : null
  return numerals ? numeralsParam(numerals) : fallback
}
