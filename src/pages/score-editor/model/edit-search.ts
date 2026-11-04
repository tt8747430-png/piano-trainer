/**
 * What the score editor's URL holds: whether its takes' sheet is open (`takes`), whether Record is
 * pressed as it opens (`record`, New song's Record, forgotten once it is, ADR 0096), and the bar as
 * printed its caret opens on, the Player's where Edit came from it (ADR 0115).
 */
export interface EditSearch {
  readonly takes: boolean
  readonly record: boolean
  readonly bar?: number
  /** The panel's tab where it is not Notation (A40): Instruments or Layout. */
  readonly panel?: 'instruments' | 'layout'
  /** Which staves play and show (A40), as the Player writes them (`stavesParam`, A35). */
  readonly staves?: string
}

/** The editor's panel's tabs (A40, Flat's): Notation, Instruments, Layout. */
export const EDITOR_PANELS = ['notation', 'instruments', 'layout'] as const
export type EditorPanelTab = (typeof EDITOR_PANELS)[number]

/**
 * A lesson's example of notes on the score (round 27): its place among the lesson's examples of
 * notes (`n`), and the course whose lesson it is, where it is a course's (its draft and its editor
 * are the course's).
 */
export interface ExampleSearch {
  readonly n: number
  readonly course?: string
}
