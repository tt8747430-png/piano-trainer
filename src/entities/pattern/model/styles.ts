import type { LocalText } from '@/shared/i18n'
import {
  bassLine,
  DRUM_VOICES,
  drumSteps,
  type DrumGrid,
  type SheetMeter,
  type StyleParts,
  type Variation,
} from '@/shared/lib/arrangement'
import { WRITTEN_STYLES } from '../content/styles'
import type { BookPattern, PatternBook } from './book'
import { figurePattern } from './figure-pattern'
import { PATTERN_IDS, type PatternGroup } from './types'
import {
  STYLE_FAMILIES,
  type StyleFamily,
  type WrittenGrid,
  type WrittenStyle,
  type WrittenVariation,
} from './style-types'

/** A style as the Chord player plays it (R29 CP3): its parts per variation, read from what is written. */
export interface Style {
  readonly id: string
  readonly family: StyleFamily
  readonly name: LocalText
  readonly tempo: number
  readonly meter: SheetMeter
  readonly swing: boolean
  readonly bass: 'bassElectric' | 'bassUpright'
  /** 1 to 4, variation 1 first. */
  readonly variations: readonly StyleParts[]
  /** Whether any variation has the part: a style with none draws no row for it (R30). */
  readonly hasBass: boolean
  readonly hasDrums: boolean
  /** A piano pattern's shelf: its book's group, or the learner's own. */
  readonly shelf?: PatternGroup | 'own'
}

/** The style a new sheet plays in. */
export const DEFAULT_STYLE_ID = 'pop-1'

const grid = (written: WrittenGrid | undefined): DrumGrid | null => {
  if (!written) return null
  const voices = DRUM_VOICES.flatMap((voice) => {
    const steps = written[voice]
    return steps === undefined ? [] : [[voice, drumSteps(steps)] as const]
  })
  return Object.fromEntries(voices)
}

function parts(id: string, written: WrittenVariation): StyleParts {
  const fillBass = written.fill?.bass
  const fillDrums = grid(written.fill?.drums)
  return {
    piano: figurePattern(`${id}:${written.rh}:${written.lh}`, written.rh, written.lh),
    bass: written.bass === undefined ? null : bassLine(written.bass),
    drums: grid(written.drums),
    ...(fillBass || fillDrums
      ? {
          fill: {
            ...(fillBass ? { bass: bassLine(fillBass) } : {}),
            ...(fillDrums ? { drums: fillDrums } : {}),
          },
        }
      : {}),
    ...(written.crash ? { crash: true } : {}),
  }
}

const readStyle = (written: WrittenStyle): Style => {
  const variations = written.variations.map((variation) => parts(written.id, variation))
  return {
    id: written.id,
    family: written.family,
    name: written.name,
    tempo: written.tempo,
    meter: written.meter ?? '4/4',
    swing: written.swing === true,
    bass: written.bass ?? 'bassElectric',
    variations,
    hasBass: variations.some((each) => each.bass !== null),
    hasDrums: variations.some((each) => each.drums !== null),
  }
}

/** The written styles, read once. */
export const BUILT_IN_STYLES: readonly Style[] = WRITTEN_STYLES.map(readStyle)

/** Accompaniment's pattern as a style: the piano alone, its pattern in every bar. */
const patternStyle = (pattern: BookPattern): Style => ({
  id: `pattern:${pattern.ref}`,
  family: 'patterns',
  name: pattern.name,
  tempo: 90,
  meter: '4/4',
  swing: false,
  bass: 'bassElectric',
  variations: [{ piano: pattern.pattern, bass: null, drums: null }],
  hasBass: false,
  hasDrums: false,
  shelf: pattern.group,
})

/** The styles over the learner's pattern book: the written ones, then every pattern of Accompaniment's. */
export interface StyleBook {
  readonly styles: readonly Style[]
  /** The style `id` names; Pop 1 for one the book does not hold (an own pattern since deleted). */
  get(id: string): Style
  /** The families in order, each with its styles; Piano patterns last. */
  readonly families: readonly { readonly family: StyleFamily; readonly styles: readonly Style[] }[]
}

export function styleBook(book: PatternBook): StyleBook {
  const patterns = [...PATTERN_IDS.map((id) => book.require(id)), ...book.own]
  const styles = [...BUILT_IN_STYLES, ...patterns.map(patternStyle)]
  const byId = new Map(styles.map((style) => [style.id, style]))
  const fallback = BUILT_IN_STYLES.find((style) => style.id === DEFAULT_STYLE_ID)
  if (!fallback) throw new Error(`styleBook: no ${DEFAULT_STYLE_ID}`)
  return {
    styles,
    get: (id) => byId.get(id) ?? fallback,
    families: STYLE_FAMILIES.map((family) => ({
      family,
      styles: styles.filter((style) => style.family === family),
    })).filter((group) => group.styles.length > 0),
  }
}

/** The variations a style has, 1 to its count: what a section may choose. */
export const styleVariations = (style: Style): readonly Variation[] =>
  ([1, 2, 3, 4] as const).slice(0, style.variations.length)

/** A section's parts in a style: its variation's, the last one's where the style has fewer. */
export const variationParts = (style: Style, variation: Variation): StyleParts => {
  const chosen =
    style.variations[Math.min(variation, style.variations.length) - 1] ?? style.variations[0]
  if (!chosen) throw new Error(`variationParts: ${style.id} has no variation`)
  return chosen
}
