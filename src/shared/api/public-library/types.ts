import type { NetResult } from '../network'

/** How the Public library is sorted: the newest first, or the most saved. */
export type PublicSort = 'new' | 'saved'

/** A song in the Public library, as its list shows it. */
export interface PublicEntry {
  readonly id: string
  readonly title: string
  readonly authorName: string
  readonly saves: number
  readonly publishedAt: string
  /** What the list says of it besides its title: its key and meter. */
  readonly meta: { readonly key?: string; readonly meter?: string }
}

/** A song as its author publishes it: their own song's id, its title and music, and how they are named. */
export interface Publication {
  readonly sourceId: string
  readonly title: string
  readonly authorName: string
  readonly meta: PublicEntry['meta']
  /** The song as a shared song is held: `{ title, music }`, read back by `readSharedSong`. */
  readonly body: unknown
  readonly version: string
}

/** What the learner has published: their own song's id, its public id and the version published. */
export interface Published {
  readonly sourceId: string
  readonly id: string
  readonly version: string
}

export type ReportReason = 'not-theirs' | 'offensive' | 'spam' | 'broken'

/**
 * The Public library (ADR 0116): learners' songs published for anyone to play and save a copy of.
 * Reading needs no account; publishing, saving and reporting do. Every call's result is a value.
 */
export interface PublicLibrary {
  browse(options: { sort: PublicSort; query: string }): Promise<NetResult<readonly PublicEntry[]>>
  /** One song: its entry and its body; null where it is gone or hidden. */
  item(id: string): Promise<NetResult<{ entry: PublicEntry; body: unknown } | null>>
  /** Publishes the song, or its newer version over the one published. */
  publish(publication: Publication): Promise<NetResult<Published>>
  unpublish(sourceId: string): Promise<NetResult<void>>
  /** The learner's published songs. */
  mine(): Promise<NetResult<readonly Published[]>>
  /** Counts a save of the song once per learner; returns its saves. */
  save(id: string): Promise<NetResult<number>>
  report(id: string, reason: ReportReason, note: string): Promise<NetResult<void>>
}
