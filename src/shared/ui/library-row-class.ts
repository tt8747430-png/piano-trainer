// A row of a library (Songs', Practice's; ADR 0106), as the list draws it, as Select draws it and as the hand holds it
// (Mindscape's `row-style`: the drag's overlay is the row it came from, never a row of another size).

/**
 * The row's card. Under a mouse its fill follows its link alone (`has-[>a:hover]`), so More, beside
 * the link, shows its own hover and reads as a button of its own.
 */
export const ROW_CARD =
  'card flex h-full min-w-0 items-center gap-1 pr-1 transition-colors duration-200 ease-out'

/**
 * A row of a grouped list (canvas 133: a library's rows in one card, a hairline between them): the
 * card's own fill, its hover the link's, as `ROW_CARD`'s.
 */
export const ROW_FLAT =
  'flex h-full min-w-0 items-center gap-1 pr-1 transition-colors duration-200 ease-out'

/** A library row's title, heavier than a settings row's: the song or folder is what is hunted for. */
export const ROW_TITLE_STRONG = '**:data-[slot=row-title]:font-semibold'

/** What only a mouse reaches (More on a library row): a finger has the swipe and the long press. */
export const POINTER_ONLY = 'pointer-coarse:hidden'

/** A control at its end (More) or its start (the handle, the check): a 44px target, soft until pointed at. */
export const ROW_CONTROL =
  'grid size-11 shrink-0 place-items-center rounded-pill text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:-outline-offset-3 [&_svg]:size-5'

/** The row's own part: its link to its page, or Select's toggle, holding its face. */
export const ROW_BODY =
  'group/row flex min-h-[var(--row-min,4rem)] min-w-0 flex-1 items-center gap-3 self-stretch rounded-card py-2 pl-2 text-left focus-visible:-outline-offset-3'
