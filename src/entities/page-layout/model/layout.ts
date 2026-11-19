import { isOneOf, isRecord } from '@/shared/lib'

/**
 * Where a panel stands round a page's content (canvas R76): under the bar, over the content above the
 * keys, at the foot, or, on a laptop, in a column beside the content.
 */
export const PLACES = ['top', 'float', 'bottom', 'left', 'right'] as const
export type Place = (typeof PLACES)[number]
const isPlace = isOneOf(PLACES)

/** The places a laptop alone has room for: a column beside the content. */
const SIDES: readonly Place[] = ['left', 'right']

/** One panel of a page: the places it may stand, its sizes, where and how large it comes. */
export interface PanelSpec {
  readonly places: readonly Place[]
  readonly sizes: readonly string[]
  readonly place: Place
  readonly size: string
  /** Only a laptop draws it (the key's Chords beside the chart). */
  readonly laptopOnly?: true
}

/**
 * Every page whose panels the learner arranges, and its panels in the order the page draws them
 * (R76): the Chord player's Keys, Controls, Genos and, on a laptop, the key's Chords. The content
 * itself (the chart) is the page and never moves, so it is no panel. Each comes as the board's
 * `LAY0`: the keys at the foot, medium; the controls floating, full; the Genos compact, in the right
 * column on a laptop (floating on a phone, which has none); the chords wide, on the right.
 */
export const PAGE_PANELS = {
  'chord-player': {
    keys: {
      places: ['top', 'bottom'],
      sizes: ['small', 'medium', 'large'],
      place: 'bottom',
      size: 'medium',
    },
    dock: { places: ['top', 'float'], sizes: ['full', 'play'], place: 'float', size: 'full' },
    genos: {
      places: ['top', 'float', 'bottom', 'left', 'right'],
      sizes: ['full', 'compact', 'minimized'],
      place: 'right',
      size: 'compact',
    },
    chords: {
      places: ['left', 'right'],
      sizes: ['narrow', 'wide'],
      place: 'right',
      size: 'wide',
      laptopOnly: true,
    },
  },
} as const satisfies Readonly<Record<string, Readonly<Record<string, PanelSpec>>>>

export type LayoutPage = keyof typeof PAGE_PANELS
export const LAYOUT_PAGES = Object.keys(PAGE_PANELS) as LayoutPage[]
export type PanelOf<P extends LayoutPage> = keyof (typeof PAGE_PANELS)[P] & string

/** A panel as the learner left it. */
export interface PanelLayout {
  readonly place: Place
  readonly size: string
  readonly hidden: boolean
}

/** A page's panels, each as it stands. */
export type PageLayout<P extends LayoutPage = LayoutPage> = Readonly<
  Record<PanelOf<P>, PanelLayout>
>

/** What the learner changed of each page: its panels that differ from how they came, and only those. */
export type ChangedLayouts = Readonly<
  Partial<Record<LayoutPage, Readonly<Record<string, PanelLayout>>>>
>

const specsOf = (page: LayoutPage): Readonly<Record<string, PanelSpec>> => PAGE_PANELS[page]

/** The panels a page draws, in its order. */
export const panelsOf = <P extends LayoutPage>(page: P): PanelOf<P>[] =>
  Object.keys(PAGE_PANELS[page]) as PanelOf<P>[]

/** A panel as it comes. */
const fresh = (spec: PanelSpec): PanelLayout => ({
  place: spec.place,
  size: spec.size,
  hidden: false,
})

const samePanel = (a: PanelLayout, b: PanelLayout): boolean =>
  a.place === b.place && a.size === b.size && a.hidden === b.hidden

/** A page's panels as they stand: the learner's changes over how each came. */
export function layoutOf<P extends LayoutPage>(changed: ChangedLayouts, page: P): PageLayout<P> {
  const own = changed[page] ?? {}
  const specs = specsOf(page)
  return Object.fromEntries(
    Object.entries(specs).map(([panel, spec]) => [panel, own[panel] ?? fresh(spec)]),
  ) as PageLayout<P>
}

/** The places a panel may go at this size: a phone has no column beside the content. */
export const placesFor = (spec: PanelSpec, laptop: boolean): readonly Place[] =>
  laptop ? spec.places : spec.places.filter((place) => !SIDES.includes(place))

/** A panel's place at this size: one beside the content floats on a phone. */
export const placeOn = (place: Place, laptop: boolean): Place =>
  laptop || !SIDES.includes(place) ? place : 'float'

/** A panel's spec, by page and name. */
export function panelSpec<P extends LayoutPage>(page: P, panel: PanelOf<P>): PanelSpec {
  const spec = specsOf(page)[panel]
  if (!spec) throw new Error(`No panel ${panel} on ${page}`)
  return spec
}

/**
 * The changes with one panel changed (its place, size or whether it is hidden), a value it cannot
 * take ignored: a panel back as it came is forgotten, and a page with nothing changed with it.
 */
export function withPanel<P extends LayoutPage>(
  changed: ChangedLayouts,
  page: P,
  panel: PanelOf<P>,
  change: Partial<PanelLayout>,
): ChangedLayouts {
  const spec = panelSpec(page, panel)
  const current = layoutOf(changed, page)[panel]
  const next: PanelLayout = {
    place:
      change.place !== undefined && spec.places.includes(change.place)
        ? change.place
        : current.place,
    size:
      change.size !== undefined && spec.sizes.includes(change.size) ? change.size : current.size,
    hidden: change.hidden ?? current.hidden,
  }
  const { [panel]: _old, ...others } = changed[page] ?? {}
  const own = samePanel(next, fresh(spec)) ? others : { ...others, [panel]: next }
  const { [page]: _page, ...pages } = changed
  return Object.keys(own).length === 0 ? pages : { ...pages, [page]: own }
}

/** The pages changed, in the registry's order. */
export const changedPages = (changed: ChangedLayouts): LayoutPage[] =>
  LAYOUT_PAGES.filter((page) => changed[page] !== undefined)

/** One change of a panel from how it came: moved, sized or hidden. */
export type PanelChange =
  | { readonly panel: string; readonly kind: 'hidden' }
  | { readonly panel: string; readonly kind: 'place'; readonly place: Place }
  | { readonly panel: string; readonly kind: 'size'; readonly size: string }

/** What the learner changed of a page, panel by panel in its order: a hidden panel says only that. */
export function changesOf(changed: ChangedLayouts, page: LayoutPage): PanelChange[] {
  const own = changed[page] ?? {}
  const specs = specsOf(page)
  return Object.entries(specs).flatMap(([panel, spec]): PanelChange[] => {
    const layout = own[panel]
    if (!layout) return []
    if (layout.hidden) return [{ panel, kind: 'hidden' }]
    return [
      ...(layout.place === spec.place
        ? []
        : [{ panel, kind: 'place', place: layout.place } as const]),
      ...(layout.size === spec.size ? [] : [{ panel, kind: 'size', size: layout.size } as const]),
    ]
  })
}

/** Saved changes read panel by panel: a page, panel, place or size that is none is dropped. */
export function readLayouts(saved: unknown): ChangedLayouts {
  if (!isRecord(saved)) return {}
  let changed: ChangedLayouts = {}
  for (const page of LAYOUT_PAGES) {
    const own = saved[page]
    if (!isRecord(own)) continue
    for (const panel of panelsOf(page)) {
      const layout = own[panel]
      if (!isRecord(layout)) continue
      changed = withPanel(changed, page, panel, {
        ...(isPlace(layout.place) ? { place: layout.place } : {}),
        ...(typeof layout.size === 'string' ? { size: layout.size } : {}),
        ...(typeof layout.hidden === 'boolean' ? { hidden: layout.hidden } : {}),
      })
    }
  }
  return changed
}
