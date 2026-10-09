import type { KeyParam } from '@/shared/lib/music'

/** Free play's two ways with the keys: play them, or mark a teaching diagram on them. */
export const FREE_PLAY_MODES = ['play', 'mark'] as const
export type FreePlayMode = (typeof FREE_PLAY_MODES)[number]

/** What Free play shows, as its URL holds it. */
export interface FreePlayView {
  readonly mode: FreePlayMode
  /** The key the live score spells in. */
  readonly key: KeyParam
  /** Mark's marks (`diagramMarksParam`): a diagram is a link to send. */
  readonly marks: string
}
