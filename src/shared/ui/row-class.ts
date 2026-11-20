/**
 * A list row's look, a link's or a button's alike (`RowLink`, `RowButton`), as the board's GROUP rows:
 * 48 tall at least, 6 above and below, 16 in at the left and 12 at the right, the whole card its target, its hover filling the card to its
 * line, never a box inside it, and beside a taller card in its row centred in its own. The page open
 * beside a list (Settings on a laptop) is lit and its name heavier (`data-current`).
 */
export const ROW_CLASS =
  'group/row flex h-full min-h-12 min-w-0 items-center gap-3 rounded-card py-1.5 pr-3 pl-4 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 data-current:bg-muted'
