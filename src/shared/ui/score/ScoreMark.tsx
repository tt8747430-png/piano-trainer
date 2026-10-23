import type { Ref } from 'react'
import { cn } from '@/shared/lib'
import { MARK_CLASS, type MarkBox, type MarkKind } from './selection'

/**
 * A mark of the one selection behind the notes (ADR 0082), the editor's and the Player's in every
 * layout. It moves by `left`, never a transform: a transform would make the pages round it one
 * picture, which Safari scales blurry when they are zoomed.
 */
export function ScoreMark({
  kind,
  box,
  slot,
  ref,
}: {
  kind: MarkKind
  box: MarkBox
  slot?: string
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      aria-hidden
      data-slot={slot}
      data-mark={kind}
      className={cn(
        'pointer-events-none absolute z-0 transition-[left,width] duration-200 ease-out motion-reduce:transition-none',
        MARK_CLASS[kind],
      )}
      style={box}
    />
  )
}
