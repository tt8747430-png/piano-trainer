import { ChevronDown, GripVertical } from 'lucide-react'
import { use, useRef, useState, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { PLACES, type Place } from '@/entities/page-layout'
import { cn, isOneOf } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import type { ChordPanel } from '../model/use-chord-layout'
import { LayoutEditContext } from '../model/use-layout-edit'

/** How far a pointer moves on the grip before it is a drag, not a tap. */
const DRAG_FROM = 8
const isPlace = isOneOf(PLACES)

/** The honey zone under a point: where a panel dropped there goes. */
function zoneAt(x: number, y: number): Place | null {
  for (const element of document.elementsFromPoint(x, y)) {
    const zone = element instanceof HTMLElement ? element.dataset.zone : undefined
    if (isPlace(zone)) return zone
  }
  return null
}

/**
 * A panel in Edit layout (canvas R76's PTAG): its dashed honey outline and its tag, a glass pill of
 * its grip and its name. The grip drags it, by mouse or finger, to one of the honey zones its places
 * light; a tap on the grip lights them instead, and a tap on one puts it there (WCAG 2.2, 2.5.7).
 * Its name opens its menu at the tag: Place and Size, each a segmented choice, then Hide. Nothing
 * outside Edit layout. `className` places the tag on the panel.
 */
export function PanelTag({ panel, className }: { panel: ChordPanel; className: string }) {
  const { t } = useTranslation('practice')
  const edit = use(LayoutEditContext)
  const [menu, setMenu] = useState(false)
  const start = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  if (!edit?.on) return null
  const name = t(`chordPlayer.layout.panels.${panel}`)
  const layout = edit.layout.panels[panel]
  const place = edit.layout.place(panel)
  const sizes = edit.layout.sizes(panel)
  const down = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = { x: event.clientX, y: event.clientY, moved: false }
  }
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const from = start.current
    if (!from) return
    if (!from.moved && Math.hypot(event.clientX - from.x, event.clientY - from.y) < DRAG_FROM)
      return
    from.moved = true
    edit.setDrag({
      panel,
      x: event.clientX,
      y: event.clientY,
      over: zoneAt(event.clientX, event.clientY),
    })
  }
  const up = (event: PointerEvent<HTMLButtonElement>) => {
    const from = start.current
    start.current = null
    if (!from?.moved) return
    const zone = zoneAt(event.clientX, event.clientY)
    if (zone) edit.put(panel, zone)
    else edit.setDrag(null)
  }
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0.5 z-40 rounded-xl outline-2 -outline-offset-2 outline-layout-edge outline-dashed"
      />
      <div
        className={cn(
          'absolute z-40 flex h-11 items-center rounded-pill glass pr-1 text-foreground',
          className,
        )}
      >
        <button
          type="button"
          aria-label={t('chordPlayer.layout.move', { name })}
          title={t('chordPlayer.layout.moveTip')}
          aria-pressed={edit.picked === panel}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={() => {
            start.current = null
            edit.setDrag(null)
          }}
          onClick={(event) => {
            // A drag ends in a click on the grip: only a tap (or a key) picks it.
            if (event.detail > 0 && edit.drag) return
            edit.pick(panel)
          }}
          className={cn(
            'grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-muted active:cursor-grabbing [&_svg]:size-[18px]',
            edit.picked === panel && 'bg-chosen-honey',
          )}
        >
          <GripVertical aria-hidden />
        </button>
        <Popover open={menu} onOpenChange={setMenu}>
          <PopoverTrigger
            aria-label={t('chordPlayer.layout.menu', { name })}
            className="flex h-11 items-center gap-1 rounded-pill pr-2 text-sm font-semibold transition-colors duration-150 ease-out hover:bg-muted [&_svg]:size-4"
          >
            {name}
            <ChevronDown aria-hidden />
          </PopoverTrigger>
          <PopoverContent align="start" aria-label={name} className="w-[300px] gap-0 glass p-1.5">
            <div className="caps px-2 pt-1.5 pb-0.5">{t('chordPlayer.layout.place')}</div>
            <div className="grid px-1">
              <Segmented
                label={t('chordPlayer.layout.place')}
                value={place}
                options={edit.layout.places(panel).map((value) => ({
                  value,
                  label: t(`chordPlayer.layout.places.${value}`),
                }))}
                onChange={(value) => edit.layout.set(panel, { place: value })}
              />
            </div>
            <div className="caps px-2 pt-2.5 pb-0.5">{t('chordPlayer.layout.size')}</div>
            <div className="grid px-1 pb-1.5">
              <Segmented
                label={t('chordPlayer.layout.size')}
                value={layout.size}
                options={sizes.map((value) => ({
                  value,
                  label: t(`chordPlayer.layout.sizes.${value}`),
                }))}
                onChange={(value) => edit.layout.set(panel, { size: value })}
              />
            </div>
            <div role="separator" className="mx-3 my-1 h-px bg-border" />
            <button
              type="button"
              onClick={() => {
                setMenu(false)
                edit.hide(panel)
              }}
              className="flex h-11 w-full items-center rounded-thumb px-3 text-left text-base transition-colors duration-150 ease-out hover:bg-muted"
            >
              {t('chordPlayer.layout.hide')}
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
