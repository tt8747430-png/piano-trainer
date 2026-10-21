import type { RefObject } from 'react'
import { useElementSize } from './use-element-size'

/** The zoom that shrinks a drawing `drawn` wide into `room`, never growing it: 1 until laid out. */
export const fitZoom = (room: number, drawn: number) =>
  room > 0 && drawn > room ? room / drawn : 1

/**
 * The zoom that fits a drawing (an engraved staff) into the width it is given, so a line of music
 * reads whole on a phone rather than scrolling off its edge. Inside the zoom the drawing still
 * measures its own width, so the fit never feeds itself.
 */
export function useFitZoom(
  room: RefObject<HTMLElement | null>,
  drawn: RefObject<HTMLElement | null>,
): number {
  return fitZoom(useElementSize(room).width, useElementSize(drawn).width)
}
