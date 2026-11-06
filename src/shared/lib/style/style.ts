/**
 * A block's or a card's style (R29 B9, D4): roundness, border, shadow, its colours, its padding and
 * its layout, every value from a short list. One sanitiser reads any saved or published style: an
 * unknown key goes, a value out of range takes the default, and no free string ever reaches CSS
 * (a colour is a paint's name or `#rrggbb`, nothing else; no `url()`). Components read only the
 * custom properties `styleVars` sets.
 */
export const STYLE_PAINTS = ['plain', 'sand', 'sky', 'grass', 'yellow', 'lilac'] as const
export type StylePaint = (typeof STYLE_PAINTS)[number]
export const STYLE_PADDINGS = ['compact', 'normal', 'roomy'] as const
export const STYLE_LAYOUTS = ['list', 'card', 'grid'] as const

export interface BlockStyle {
  /** The shape scale's step, 0 (square) to 4 (the roundest). */
  readonly radius: 0 | 1 | 2 | 3 | 4
  /** Its border: none, thin (1px) or thick (2px). */
  readonly border: 0 | 1 | 2
  /** Its elevation: none, low or high. */
  readonly shadow: 0 | 1 | 2
  /** Its fill: a paint's name, or `#rrggbb`. */
  readonly surface: StylePaint | `#${string}`
  /** Its text: a paint's name, or `#rrggbb`. */
  readonly text: StylePaint | `#${string}`
  readonly padding: (typeof STYLE_PADDINGS)[number]
  readonly layout: (typeof STYLE_LAYOUTS)[number]
}

export const DEFAULT_STYLE: BlockStyle = {
  radius: 2,
  border: 1,
  shadow: 0,
  surface: 'plain',
  text: 'plain',
  padding: 'normal',
  // A list: a phone's one column, a laptop's table (R32-C).
  layout: 'list',
}

/**
 * The presets (Plain, Soft, Bold, Paper, Night), each a whole style. Every one but Night is made of
 * the theme's paints, so it is redrawn for the dark theme (memory-palaces' rule: a slab of white paper
 * is a lamp in a dark room); Night is a dark card in either theme.
 */
export const BLOCK_PRESETS = {
  plain: DEFAULT_STYLE,
  soft: { ...DEFAULT_STYLE, radius: 4, border: 0, shadow: 1, surface: 'sky', padding: 'roomy' },
  bold: { ...DEFAULT_STYLE, radius: 1, border: 2, shadow: 2, surface: 'yellow', text: 'plain' },
  paper: { ...DEFAULT_STYLE, radius: 0, border: 1, shadow: 1, surface: 'sand', text: 'plain' },
  night: { ...DEFAULT_STYLE, radius: 3, border: 0, shadow: 2, surface: '#1d2130', text: '#f2efe6' },
} as const satisfies Record<string, BlockStyle>

/** The preset a style is, if it is one: what the presets' strip marks chosen. */
export function presetOf(style: BlockStyle): BlockPreset | null {
  const found = (Object.keys(BLOCK_PRESETS) as BlockPreset[]).find((preset) =>
    sameStyle(BLOCK_PRESETS[preset], style),
  )
  return found ?? null
}

/** Whether two styles draw the same. */
export const sameStyle = (a: BlockStyle, b: BlockStyle): boolean =>
  (Object.keys(a) as (keyof BlockStyle)[]).every((key) => a[key] === b[key])
export type BlockPreset = keyof typeof BLOCK_PRESETS

const HEX = /^#[0-9a-f]{6}$/i

const step = <N extends number>(value: unknown, most: N, fallback: N): N =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= most
    ? (value as N)
    : fallback

const colour = (value: unknown, fallback: BlockStyle['surface']): BlockStyle['surface'] => {
  if (typeof value !== 'string') return fallback
  if ((STYLE_PAINTS as readonly string[]).includes(value)) return value as StylePaint
  return HEX.test(value) ? (value.toLowerCase() as `#${string}`) : fallback
}

const oneOf = <T extends string>(values: readonly T[], value: unknown, fallback: T): T =>
  typeof value === 'string' && (values as readonly string[]).includes(value)
    ? (value as T)
    : fallback

/** Any value read as a style: what it says that is valid, the default for the rest. */
export function sanitiseStyle(value: unknown): BlockStyle {
  const saved =
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
  return {
    radius: step(saved.radius, 4, DEFAULT_STYLE.radius),
    border: step(saved.border, 2, DEFAULT_STYLE.border),
    shadow: step(saved.shadow, 2, DEFAULT_STYLE.shadow),
    surface: colour(saved.surface, DEFAULT_STYLE.surface),
    text: colour(saved.text, DEFAULT_STYLE.text),
    padding: oneOf(STYLE_PADDINGS, saved.padding, DEFAULT_STYLE.padding),
    layout: oneOf(STYLE_LAYOUTS, saved.layout, DEFAULT_STYLE.layout),
  }
}

const paintVar = (paint: BlockStyle['surface'], plain: string) =>
  paint === 'plain' ? plain : paint.startsWith('#') ? paint : `var(--paint-${paint})`

/** A paint as text: its ink, which reads on its wash and on the card (R31-S). */
const inkVar = (paint: BlockStyle['text']) =>
  paint === 'plain'
    ? 'var(--foreground)'
    : paint.startsWith('#')
      ? paint
      : `var(--on-paint-${paint})`

/** A style as the custom properties a block reads (`--block-*`), and nothing else. */
export function styleVars(style: BlockStyle): Readonly<Record<`--block-${string}`, string>> {
  return {
    '--block-radius': `var(--block-radius-${style.radius})`,
    '--block-border': `${style.border}px`,
    '--block-shadow': `var(--block-shadow-${style.shadow})`,
    '--block-surface': paintVar(style.surface, 'var(--card)'),
    '--block-text': inkVar(style.text),
    '--block-padding': `var(--block-padding-${style.padding})`,
  }
}
