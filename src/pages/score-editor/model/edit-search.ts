/**
 * What the score editor's URL holds: whether its takes' sheet is open (`takes`), whether Record is
 * pressed as it opens (`record`, New song's Record, forgotten once it is, ADR 0096), and the bar as
 * printed its caret opens on, the Player's where Edit came from it (ADR 0115); and whether an editor
 * edits the built-in song's original rather than their version (`original`, ADR 0116).
 */
export interface EditSearch {
  readonly takes: boolean
  readonly record: boolean
  readonly bar?: number
  readonly original: boolean
}
