import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useFitZoom } from '@/shared/lib'

/**
 * A row of music drawn whole within its room, shrunk where it is wider: a card's line of
 * notes. Its zoom is `--fit` too, so a reach drawn inside it (a bar's band) holds 44px
 * on screen.
 */
export function FittedRow({ children }: { children: ReactNode }) {
  const room = useRef<HTMLDivElement>(null)
  const drawn = useRef<HTMLDivElement>(null)
  const zoom = useFitZoom(room, drawn)
  return (
    <div ref={room} className="min-w-0">
      <div
        ref={drawn}
        className="w-max"
        style={zoom < 1 ? ({ zoom, '--fit': zoom } as CSSProperties) : undefined}
      >
        {children}
      </div>
    </div>
  )
}
