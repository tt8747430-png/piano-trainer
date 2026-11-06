import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  differenceCiede2000,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
} from 'culori'
import { describe, expect, it } from 'vitest'

/** The light theme's primitives (`--p-*: #hex`), read from the tokens. */
const TOKENS = readFileSync(resolve(import.meta.dirname, 'tokens.css'), 'utf8')
const primitive = (name: string): string => {
  const found = new RegExp(`--p-${name}:\\s*(#[0-9a-f]{6})`).exec(TOKENS)?.[1]
  if (!found) throw new Error(`no --p-${name} in tokens.css`)
  return found
}

/** Under each kind of colour blindness, and as seen with full colour vision. */
const SIGHTS = {
  full: (colour: string) => colour,
  protanopia: filterDeficiencyProt(1),
  deuteranopia: filterDeficiencyDeuter(1),
  tritanopia: filterDeficiencyTrit(1),
} as const

/** Two colours a reader tells apart at a glance: CIEDE2000 above this. */
const APART = 10

const dE = differenceCiede2000()
const apart = (a: string, b: string) =>
  Object.values(SIGHTS).every((sight) => dE(sight(a), sight(b)) > APART)

/**
 * The colours that tell things apart (DESIGN.md, the Palette Law and the Second Cue Rule): the hands,
 * the harmonic roles, the verdicts. Each pair either reads apart to every eye, or is listed under
 * `SHAPED` with the second cue that tells it apart.
 */
const PAIRS: readonly (readonly [string, string, string])[] = [
  ['right hand, left hand', 'brick', 'lilac'],
  ['home, tension', 'grass', 'lilac'],
  ['away, tension', 'sand', 'lilac'],
  ['right, wrong', 'grass', 'crimson'],
  ['right, missed', 'grass', 'ink-soft'],
  ['wrong, early or late', 'crimson', 'yellow'],
  ['early or late, missed', 'yellow', 'ink-soft'],
]

/** Pairs that merge for some eyes, and the cue besides colour that parts them. */
const SHAPED: readonly (readonly [string, string, string, string])[] = [
  ['home, away', 'grass', 'sand', 'the numeral, and the legend that names each role'],
  ['right, early or late', 'grass', 'yellow', 'the verdict shapes ● ◂ ▸'],
  ['wrong, missed', 'crimson', 'ink-soft', 'the verdict shapes × ○'],
]

describe('the palette for colour-blind eyes', () => {
  it.each(PAIRS)('%s read apart to every eye', (_, a, b) => {
    expect(apart(primitive(a), primitive(b))).toBe(true)
  })

  it.each(SHAPED)('%s merge for some eyes, so they part by %s too', (_, a, b) => {
    expect(apart(primitive(a), primitive(b))).toBe(false)
  })
})
