import { cn } from '@/shared/lib'

/**
 * A list row's look, a link's or a button's alike (`RowLink`, `RowButton`): the whole card its target,
 * its hover filling the card to its line, never a box inside it, and beside a taller card in its row
 * centred in its own; a row without a tile keeps its text off the card's edge.
 */
export const rowClass = (tiled: boolean): string =>
  cn(
    'group/row flex h-full min-h-16 min-w-0 items-center gap-3 rounded-3xl py-2 pr-3 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3',
    tiled ? 'pl-2' : 'pl-4',
  )
