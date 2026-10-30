import type { NetResult } from '../network'

/** The longest description an author writes of what they publish. */
export const DESCRIPTION_MAX = 500

/** How the Public library is sorted: the newest first, or the most saved. */
export type PublicSort = 'new' | 'saved'

/** What the Public library holds: learners' songs, and their patterns. */
export type PublicKind = 'song' | 'pattern'

/** A song or pattern in the Public library, as its list shows it. */
export interface PublicEntry {
  readonly id: string
  readonly kind: PublicKind
  readonly title: string
  readonly authorName: string
  readonly saves: number
  readonly publishedAt: string
  /**
   * What the list says of it besides its title: a song's key and meter, a pattern's figures; and
   * what its author wrote of it (`description`, at most `DESCRIPTION_MAX` long).
   */
  readonly meta: {
    readonly key?: string
    readonly meter?: string
    readonly rh?: string
    readonly lh?: string
    readonly description?: string
  }
}

/** A song as its author publishes it: their own song's id, its title and music, and how they are named. */
export interface Publication {
  readonly kind: PublicKind
  /** The author's own item's id, unique among theirs: a pattern's prefixed `pattern/`. */
  readonly sourceId: string
  readonly title: string
  readonly authorName: string
  readonly meta: PublicEntry['meta']
  /** The song as a save holds an own song, its title beside its music: read back by `readSharedSong`. */
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
  browse(options: {
    kind: PublicKind
    sort: PublicSort
    query: string
  }): Promise<NetResult<readonly PublicEntry[]>>
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
