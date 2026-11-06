/**
 * The bars a learner arranges (R29 B10, memory-palaces' select toolbar): per surface the acts it
 * has, how many it holds, and its defaults. Only acts each kind already has: a bar never offers an
 * act its screen cannot do (rule 16).
 */
export const BAR_SURFACES = [
  'select.songs',
  'swipe.songs.leading',
  'swipe.songs.trailing',
  'swipe.folders.leading',
  'swipe.folders.trailing',
] as const
export type BarSurface = (typeof BAR_SURFACES)[number]

/** Every act a bar may hold, across surfaces. */
export const BAR_ACTS = ['favourite', 'edit', 'move', 'export', 'archive', 'delete'] as const
export type BarAct = (typeof BAR_ACTS)[number]

/** Each surface's acts, in the order its page lists them. */
export const BAR_CATALOG: Readonly<Record<BarSurface, readonly BarAct[]>> = {
  'select.songs': ['favourite', 'move', 'export', 'archive', 'delete'],
  'swipe.songs.leading': ['favourite', 'move', 'archive', 'delete'],
  'swipe.songs.trailing': ['favourite', 'move', 'archive', 'delete'],
  'swipe.folders.leading': ['edit', 'move', 'archive', 'delete'],
  'swipe.folders.trailing': ['edit', 'move', 'archive', 'delete'],
}

/** How many acts each surface holds: Select 1–4, a swipe's side 0–2. */
export const BAR_LIMITS: Readonly<
  Record<BarSurface, { readonly min: number; readonly max: number }>
> = {
  'select.songs': { min: 1, max: 4 },
  'swipe.songs.leading': { min: 0, max: 2 },
  'swipe.songs.trailing': { min: 0, max: 2 },
  'swipe.folders.leading': { min: 0, max: 2 },
  'swipe.folders.trailing': { min: 0, max: 2 },
}

/** What each surface holds until the learner changes it: today's. */
export const DEFAULT_BARS: Readonly<Record<BarSurface, readonly BarAct[]>> = {
  'select.songs': ['favourite', 'move', 'archive', 'delete'],
  'swipe.songs.leading': ['favourite'],
  'swipe.songs.trailing': ['move', 'archive'],
  'swipe.folders.leading': ['edit'],
  'swipe.folders.trailing': ['move', 'archive'],
}

/** The learner's bars: a surface left out holds its default. */
export type Bars = Readonly<Partial<Record<BarSurface, readonly BarAct[]>>>

/**
 * A surface's bar as kept: only its own acts, each once, within its limits; anything else (unknown
 * ids, too few) is its default.
 */
export function normaliseBar(surface: BarSurface, saved: unknown): readonly BarAct[] {
  if (!Array.isArray(saved)) return DEFAULT_BARS[surface]
  const allowed: readonly string[] = BAR_CATALOG[surface]
  const clean = [...new Set(saved)].filter(
    (id): id is BarAct => typeof id === 'string' && allowed.includes(id),
  )
  const { min, max } = BAR_LIMITS[surface]
  return clean.length < min || clean.length > max ? DEFAULT_BARS[surface] : clean
}

/** One more act would fit. */
export const barHasRoom = (surface: BarSurface, bar: readonly BarAct[]): boolean =>
  bar.length < BAR_LIMITS[surface].max

/** An act may come off: the bar keeps its least (Select its last, the Player's bar four). */
export const barCanShrink = (surface: BarSurface, bar: readonly BarAct[]): boolean =>
  bar.length > BAR_LIMITS[surface].min

/** The surface's acts not on its bar, in the catalog's order: what a tap adds. */
export const barAvailable = (surface: BarSurface, bar: readonly BarAct[]): readonly BarAct[] =>
  BAR_CATALOG[surface].filter((act) => !bar.includes(act))

/** The learner's bar for a surface: theirs where they changed it, else its default. */
export const barOf = (bars: Bars, surface: BarSurface): readonly BarAct[] =>
  bars[surface] ?? DEFAULT_BARS[surface]

export const isBarSurface = (value: string): value is BarSurface =>
  (BAR_SURFACES as readonly string[]).includes(value)
