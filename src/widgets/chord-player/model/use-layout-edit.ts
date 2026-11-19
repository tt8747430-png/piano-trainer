import { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Place } from '@/entities/page-layout'
import { say } from '@/shared/ui'
import type { ChordLayout, ChordPanel } from './use-chord-layout'

/** A panel in hand by its grip: where the finger or the pointer is, and the place under it. */
export interface PanelDrag {
  readonly panel: ChordPanel
  readonly x: number
  readonly y: number
  readonly over: Place | null
}

/**
 * Edit layout (R76) as the page's panels read it: on or off, the panel picked by a tap on its grip
 * (its places lit as honey zones, WCAG 2.2's 2.5.7: every drag has a single-tap way), the panel in
 * hand while dragged, and the acts that move or hide one, each said in a toast.
 */
export interface LayoutEdit {
  readonly on: boolean
  readonly laptop: boolean
  readonly layout: ChordLayout
  readonly picked: ChordPanel | null
  readonly drag: PanelDrag | null
  /** The panel a tap on its grip picks, or lets go of. */
  pick(panel: ChordPanel): void
  setDrag(drag: PanelDrag | null): void
  /** A panel put in a place, by a drop or a tap on its zone. */
  put(panel: ChordPanel, place: Place): void
  hide(panel: ChordPanel): void
  /** The panel the places now lit are for: the one in hand, else the one picked. */
  readonly moving: ChordPanel | null
}

export const LayoutEditContext = createContext<LayoutEdit | null>(null)

export function useLayoutEdit(on: boolean, laptop: boolean, layout: ChordLayout): LayoutEdit {
  const { t } = useTranslation('practice')
  const [picked, setPicked] = useState<ChordPanel | null>(null)
  const [drag, setDrag] = useState<PanelDrag | null>(null)
  // Leaving Edit layout lets go of what was picked.
  const [was, setWas] = useState(on)
  if (was !== on) {
    setWas(on)
    setPicked(null)
    setDrag(null)
  }
  const name = (panel: ChordPanel) => t(`chordPlayer.layout.panels.${panel}`)
  return {
    on,
    laptop,
    layout,
    picked,
    drag,
    moving: drag?.panel ?? picked,
    pick: (panel) => setPicked((current) => (current === panel ? null : panel)),
    setDrag,
    put(panel, place) {
      setPicked(null)
      setDrag(null)
      if (!layout.places(panel).includes(place)) return
      layout.set(panel, { place })
      say(t(`chordPlayer.layout.moved.${place}`, { name: name(panel) }))
    },
    hide(panel) {
      setPicked(null)
      layout.set(panel, { hidden: true })
      say(t('chordPlayer.layout.wasHidden', { name: name(panel) }))
    },
  }
}
