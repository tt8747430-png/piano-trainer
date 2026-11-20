import { useRef, type ReactNode } from 'react'
import { useFitZoom } from '@/shared/lib'
import { fitStyle } from './fit-style'

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
      <div ref={drawn} className="w-max" style={fitStyle(zoom)}>
        {children}
      </div>
    </div>
  )
}
