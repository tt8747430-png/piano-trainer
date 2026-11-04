import type { NetResult } from '../network'

/** The longest description an author writes of what they publish. */
export const DESCRIPTION_MAX = 500

/** How Explore is sorted: the newest first, the most saved, or the top rated (then the newest). */
export type PublicSort = 'new' | 'saved' | 'rated'

/** What a published song is, chosen by its author (B3); a pattern has none. */
export const PUBLIC_CATEGORIES = ['classical', 'folk', 'pop', 'studies'] as const
export type PublicCategory = (typeof PUBLIC_CATEGORIES)[number]
export const isPublicCategory = (value: unknown): value is PublicCategory =>
  typeof value === 'string' && (PUBLIC_CATEGORIES as readonly string[]).includes(value)

/** The fewest ratings an average is shown for, and an item counts as top rated. */
export const RATED_MIN = 3

/** The stars learners gave an item: their average, to one decimal, and how many rated it. */
export interface PublicRating {
  readonly average: number
  readonly count: number
}

/** What the Public library holds: learners' songs, and their patterns. */
export type PublicKind = 'song' | 'pattern'

/** A song or pattern in the Public library, as its list shows it. */
export interface PublicEntry {
  readonly id: string
  readonly kind: PublicKind
  readonly title: string
  /**
   * Who published it, as their public profile names them (D12): empty where their profile is not
   * public, which the app says as "Piano Trainer learner".
   */
  readonly authorName: string
  /** A public profile's picture: a built-in avatar's id or an uploaded one's address; none if none. */
  readonly authorAvatar: string | null
  readonly saves: number
  readonly publishedAt: string
  readonly category: PublicCategory | null
  /** Its learners' stars; null before anyone rated it. */
  readonly rating: PublicRating | null
  /** A song's first line of its chart, as written (`C G Am F`), drawn small on its card. */
  readonly opening?: string
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
  /** A song's category; none for a pattern, or a song its author left uncategorised. */
  readonly category?: PublicCategory | null
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
    /** Only the songs of one category; every one where none. */
    category?: PublicCategory
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
  /** Rates the item 1 to 5 stars, once per learner (a new rating replaces theirs); its rating after. */
  rate(id: string, stars: number): Promise<NetResult<PublicRating>>
  /** The stars the learner gave the item; null where they gave none, or no one is signed in. */
  myRating(id: string): Promise<NetResult<number | null>>
}
