// A row of the library (ADR 0106), as the list draws it, as Select draws it and as the hand holds it
// (Mindscape's `row-style`: the drag's overlay is the row it came from, never a row of another size).

/**
 * The row's card. Under a mouse its fill follows its link alone (`has-[>a:hover]`), so More, beside
 * the link, shows its own hover and reads as a button of its own.
 */
export const ROW_CARD =
  'card flex h-full min-w-0 items-center gap-1 pr-1 transition-colors duration-200 ease-out'

/** A control at its end (More) or its start (the handle, the check): a 44px target, soft until pointed at. */
export const ROW_CONTROL =
  'grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:-outline-offset-3 [&_svg]:size-5'

/** The row's own part: its link to its page, or Select's toggle, holding its face. */
export const ROW_BODY =
  'group/row flex min-h-16 min-w-0 flex-1 items-center gap-3 self-stretch rounded-3xl py-2 pl-2 text-left focus-visible:-outline-offset-3'
