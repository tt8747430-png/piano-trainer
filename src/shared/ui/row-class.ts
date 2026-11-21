/** Every row's room, as the board's GROUP draws it: 48 tall at least, 6 above and below, 16 in at the start and 12 at the end, 12 between its parts. */
export const ROW_ROOM = 'flex min-h-12 items-center gap-3 py-1.5 ps-4 pe-3'

/**
 * A list row's look, a link's or a button's alike (`RowLink`, `RowButton`), as the board's GROUP rows:
 * 48 tall at least, 6 above and below, 16 in at the left and 12 at the right, the whole card its target, its hover filling the card to its
 * line, never a box inside it, and beside a taller card in its row centred in its own. The page open
 * beside a list (Settings on a laptop) is lit and its name heavier (`data-current`).
 */
export const ROW_CLASS = `group/row h-full min-w-0 text-start rounded-card ${ROW_ROOM} transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 data-current:bg-muted`
