import { useRef, type ReactNode } from 'react'
import { useElementSize } from '@/shared/lib'

/**
 * Content drawn at its own width (an engraved staff), shrunk to the width it is given where it is
 * wider, never grown: a line of music reads whole on a phone rather than scrolling off its edge. Its
 * taps shrink with it, as `zoom` lays them out.
 */
export function FitWidth({ children }: { children: ReactNode }) {
  const room = useRef<HTMLDivElement>(null)
  const drawn = useRef<HTMLDivElement>(null)
  // Inside the zoom, the drawing still measures its own width: the fit never feeds itself.
  const { width: roomWidth } = useElementSize(room)
  const { width: drawnWidth } = useElementSize(drawn)
  const zoom = roomWidth > 0 && drawnWidth > roomWidth ? roomWidth / drawnWidth : 1
  return (
    <div ref={room} className="max-w-full">
      <div ref={drawn} className="w-max max-w-none" style={zoom < 1 ? { zoom } : undefined}>
        {children}
      </div>
    </div>
  )
}
