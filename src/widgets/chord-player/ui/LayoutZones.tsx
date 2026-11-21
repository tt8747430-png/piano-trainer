import { use } from 'react'
import { useTranslation } from 'react-i18next'
import type { Place } from '@/entities/page-layout'
import { cn } from '@/shared/lib'
import type { ChordPanel } from '../model/use-chord-layout'
import { LayoutEditContext } from '../model/use-layout-edit'

/**
 * Where each place's zone lies on the screen (the board's ZONE): on a phone three bands across it,
 * under the bar, in the middle and over the keys; on a laptop the two columns beside the chart and
 * three bands over it, all inside the page beside the sidebar.
 */
const PHONE_ZONES: Readonly<Partial<Record<Place, string>>> = {
  top: 'inset-x-4 top-[calc(var(--screen-bar,0px)+0.5rem)] h-24',
  float: 'inset-x-4 top-[42%] h-24',
  bottom: 'inset-x-4 bottom-[calc(var(--nav-bar)+var(--docked,0px)+1.5rem)] h-24',
}
const LAPTOP_ZONES: Readonly<Record<Place, string>> = {
  left: 'left-14 top-30 bottom-65 w-75',
  right: 'right-10 top-30 bottom-65 w-75',
  top: 'left-100 right-95 top-27 h-25',
  float: 'left-100 right-95 bottom-[calc(var(--docked,0px)+7.5rem)] h-25',
  bottom: 'left-100 right-95 bottom-[calc(var(--docked,0px)+0.75rem)] h-25',
}

/**
 * While a panel is picked or in hand (R76), the places it may go lit as honey zones, each its words
 * ("At the top"), a tap on one putting it there; the hint over them ("Tap where Keys goes"), and the
 * panel's name under the finger while it is dragged.
 */
export function LayoutZones() {
  const { t } = useTranslation('practice')
  const edit = use(LayoutEditContext)
  const moving: ChordPanel | null | undefined = edit?.moving
  if (!edit?.on || !moving) return null
  const zones = edit.laptop ? LAPTOP_ZONES : PHONE_ZONES
  const name = t(`chordPlayer.layout.panels.${moving}`)
  return (
    <div className="pointer-events-none fixed inset-0 z-40 lg:left-sidebar lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed">
      {edit.layout.places(moving).map((place) => (
        <button
          key={place}
          type="button"
          data-zone={place}
          aria-label={t('chordPlayer.layout.putIt', {
            place: t(`chordPlayer.layout.zones.${place}`),
          })}
          onClick={() => edit.put(moving, place)}
          className={cn(
            'pointer-events-auto absolute rounded-card border-2 border-dashed border-layout-edge bg-layout-zone text-[15px] font-bold text-foreground transition-colors duration-150 ease-out hover:bg-chosen-honey',
            edit.drag?.over === place && 'bg-chosen-honey',
            zones[place],
          )}
        >
          {t(`chordPlayer.layout.zones.${place}`)}
        </button>
      ))}
      <div
        role="status"
        className="absolute top-[calc(var(--screen-bar,0px)-0.5rem)] left-1/2 flex h-9 -translate-x-1/2 items-center rounded-pill bg-foreground px-3.5 text-sm font-semibold whitespace-nowrap text-background"
      >
        {t('chordPlayer.layout.tapWhere', { name })}
      </div>
      {edit.drag ? (
        <div
          aria-hidden
          className="absolute flex h-11 -translate-x-1/2 -translate-y-1/2 items-center rounded-pill glass px-4 text-sm font-semibold"
          style={{ left: edit.drag.x, top: edit.drag.y }}
        >
          {name}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Edit layout's tray under the bar (the board's TRAY): "Hidden", then each hidden panel as a chip
 * that shows it again ("+ Keys"). Only the panels this screen draws: the Genos while it is followed,
 * the key's chords on a laptop.
 */
export function HiddenTray({ panels }: { panels: readonly ChordPanel[] }) {
  const { t } = useTranslation('practice')
  const edit = use(LayoutEditContext)
  if (!edit?.on || panels.length === 0) return null
  return (
    <div className="-mt-2 flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">{t('chordPlayer.layout.hidden')}</span>
      {panels.map((panel) => {
        const name = t(`chordPlayer.layout.panels.${panel}`)
        return (
          <button
            key={panel}
            type="button"
            aria-label={t('chordPlayer.layout.show', { name })}
            onClick={() => edit.layout.set(panel, { hidden: false })}
            className="h-11 rounded-pill border-y-4 border-transparent bg-muted bg-clip-padding px-3.5 text-sm font-semibold transition-colors duration-150 ease-out hover:bg-secondary"
          >
            + {name}
          </button>
        )
      })}
    </div>
  )
}
