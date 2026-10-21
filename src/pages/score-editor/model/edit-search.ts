import type { SheetView } from '@/shared/lib'

/** What the score editor's URL holds: whether its takes are open (New song's Record opens them), and how its score is laid out. */
export interface EditSearch {
  readonly record: boolean
  readonly layout: SheetView
}
