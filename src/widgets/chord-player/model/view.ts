import type { KeyParam } from '@/shared/lib/music'

/**
 * What the Chord player's URL holds (R29 CP1, CP5): one of My chord sheets open (`sheet`), else the
 * sheet in hand; on arrival, a progression to put in hand (`p` in `key`, as Progressions writes them)
 * or a shared sheet's text (`share`), each read once and dropped.
 */
export interface ChordPlayerView {
  readonly sheet?: string | undefined
  readonly p?: string | undefined
  readonly key?: KeyParam | undefined
  readonly share?: string | undefined
}

/** The Chord player's Settings: whose sheet it sets. */
export interface ChordPlayerSettingsView {
  readonly sheet?: string | undefined
}
