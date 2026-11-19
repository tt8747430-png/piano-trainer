import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  layoutOf,
  panelSpec,
  placeOn,
  placesFor,
  selectLayouts,
  usePageLayouts,
  usePageLayoutsStoreApi,
  type PanelLayout,
  type PanelOf,
  type Place,
} from '@/entities/page-layout'
import { resetPageLayout, restoreLayouts, setPanel } from '@/features/arrange-page-layout'
import { say } from '@/shared/ui'

/** The Chord player's page in the layouts. */
export const CHORD_PLAYER_PAGE = 'chord-player'
/** One of its panels: the keys, the controls (the dock), the Genos, a laptop's key chords. */
export type ChordPanel = PanelOf<typeof CHORD_PLAYER_PAGE>

/** The Chord player's layout as it stands at this size, and the acts that change it (R76). */
export interface ChordLayout {
  /** Each panel as saved. */
  readonly panels: Readonly<Record<ChordPanel, PanelLayout>>
  /** Whether the learner changed it. */
  readonly changed: boolean
  /** Where a panel stands at this size (one beside the chart floats on a phone). */
  place(panel: ChordPanel): Place
  /** Whether a panel shows. */
  shown(panel: ChordPanel): boolean
  /** The places a panel may go at this size. */
  places(panel: ChordPanel): readonly Place[]
  /** The sizes a panel has. */
  sizes(panel: ChordPanel): readonly string[]
  set(panel: ChordPanel, change: Partial<PanelLayout>): void
}

export function useChordLayout(laptop: boolean): ChordLayout {
  const store = usePageLayoutsStoreApi()
  const pages = usePageLayouts(selectLayouts)
  const panels = useMemo(() => layoutOf(pages, CHORD_PLAYER_PAGE), [pages])
  return {
    panels,
    changed: pages[CHORD_PLAYER_PAGE] !== undefined,
    place: (panel) => placeOn(panels[panel].place, laptop),
    shown: (panel) => !panels[panel].hidden,
    places: (panel) => placesFor(panelSpec(CHORD_PLAYER_PAGE, panel), laptop),
    sizes: (panel) => panelSpec(CHORD_PLAYER_PAGE, panel).sizes,
    set: (panel, change) => setPanel(store, CHORD_PLAYER_PAGE, panel, change),
  }
}

/**
 * Reset layout (the bar's Reset in Edit layout, and the Chord player's Settings): the panels back as
 * they came at once, Undo in its toast (a loss that can be undone, CLAUDE.md).
 */
export function useResetChordLayout(): () => void {
  const { t } = useTranslation('practice')
  const store = usePageLayoutsStoreApi()
  return () => {
    const before = resetPageLayout(store, CHORD_PLAYER_PAGE)
    say(t('chordPlayer.layout.wasReset'), {
      label: t('chordPlayer.undo'),
      onClick: () => restoreLayouts(store, before),
    })
  }
}
