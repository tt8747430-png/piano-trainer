import { METHODS } from '../content/methods'
import { BUILT_IN_PATTERNS } from './book'
import { METHOD_CODES } from './types'

/** The chart's own plan, as `arrange` takes it: each method code's pattern. */
export const METHOD_PATTERNS = new Map(
  METHOD_CODES.map((code) => [code, BUILT_IN_PATTERNS.require(METHODS[code].pattern).pattern]),
)
