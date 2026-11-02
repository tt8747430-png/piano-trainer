import type { DragCancelEvent, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { createContext, use, type ReactNode } from 'react'

/** A row's body in the hand: what it carries is named by the row's key after this. */
export const CARRY = 'carry:'
/** A folder a carried row drops into, by the folder's id after this. */
export const INTO = 'into:'
/** A place on the bar a carried row drops on (Archive, Move out), by its name after this. */
export const ZONE = 'zone:'

/** Where a carried row was dropped: into a folder, or on one of the bar's places. */
export type CarryTarget = { readonly into: string } | { readonly zone: string }

/** One list sorted by its handles, as it joins the library's one drag: its handlers and its rows. */
export interface SortedList {
  readonly owns: (id: string) => boolean
  readonly onDragStart: (event: DragStartEvent) => void
  readonly onDragEnd: (event: DragEndEvent) => void
  readonly onDragCancel: (event: DragCancelEvent) => void
  readonly inHand: (id: string) => ReactNode
  readonly name: (id: string) => string
  readonly at: (id: string) => { place: number; count: number }
}

interface Dnd {
  /** Joins a sorted list to the drag; returns its leaving. */
  readonly join: (key: string, list: () => SortedList) => () => void
  /** The rows' keys in the hand, while a row's body is carried. */
  readonly carrying: ReadonlySet<string> | null
}

export const DndContextOf = createContext<Dnd | null>(null)

/** The library's one drag, as a row or a list in it joins it. */
export function useLibraryDnd(): Dnd {
  const dnd = use(DndContextOf)
  if (!dnd) throw new Error('useLibraryDnd is used inside LibraryDnd')
  return dnd
}

/** The rows' keys a row's face carries now; none where nothing is carried, or outside the drag. */
export function useCarrying(): ReadonlySet<string> | null {
  return use(DndContextOf)?.carrying ?? null
}
