// A setlist's song's row, as the list draws it and as the hand holds it (Mindscape's CODE_STYLE §10:
// the drag's overlay is the row it came from, never a row of another size).

/** The row's card: its hover fills it whole, under a mouse. */
export const SONG_CARD =
  'card flex min-w-0 items-center gap-1 px-1 transition-colors duration-200 ease-out hover:bg-muted'

/** Its handle's and its Remove's 44px target, soft until pointed at. */
export const SONG_CONTROL =
  'grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground focus-visible:-outline-offset-3 [&_svg]:size-5'

/** The song's own part between them: its link to its page, holding the row's face. */
export const SONG_BODY = 'flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-3xl py-2'
