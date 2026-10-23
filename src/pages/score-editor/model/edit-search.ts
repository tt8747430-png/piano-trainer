/**
 * What the score editor's URL holds: whether its takes are open (New song's Record opens them), and the
 * bar as printed its caret opens on, the Player's where Edit came from it (ADR 0090).
 */
export interface EditSearch {
  readonly record: boolean
  readonly bar?: number
}
