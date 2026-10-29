import type { ContentKind } from '../content'
import type { NetResult } from '../network'

/** An editor's draft of a built-in item: its body and what lists show of it, unpublished. */
export interface ContentDraft {
  readonly body: unknown
  readonly meta: Readonly<Record<string, unknown>>
  readonly updatedAt: string
}

/** A draft as the list of drafts shows it: whose, its name as its meta has it, and whether it was ever published. */
export interface DraftListing {
  readonly kind: ContentKind
  readonly id: string
  /** Its name in both languages, or as typed (a song's); none where its meta has none. */
  readonly title: unknown
  readonly updatedAt: string
  /** False for an item made in the app and not yet published: learners have nothing of it. */
  readonly published: boolean
}

/** A version of an item that was published, kept to be published again. */
export interface KeptVersion {
  readonly version: string
  readonly publishedAt: string
}

/**
 * Editing the built-in content in the app (ADR 0116, round 6), an editor's alone: a draft per item,
 * published as the item's new version (learners receive it as a content update), and every version
 * published kept, to be restored. Every call's result is a value; anyone else is refused.
 */
export interface ContentEditingPort {
  /** The item's body as published now: what a new draft starts from (the device's copy may be older). */
  published(kind: ContentKind, id: string): Promise<NetResult<unknown>>
  /**
   * Creates a new item, unpublished (learners see nothing of it), with `draft` as its first draft;
   * refused where the item is there already.
   */
  create(
    kind: ContentKind,
    id: string,
    draft: Pick<ContentDraft, 'body' | 'meta'>,
  ): Promise<NetResult<void>>
  /** Every draft kept, the newest first: what an editor comes back to. */
  drafts(): Promise<NetResult<readonly DraftListing[]>>
  /** The item's draft, or null where it has none. */
  draft(kind: ContentKind, id: string): Promise<NetResult<ContentDraft | null>>
  saveDraft(
    kind: ContentKind,
    id: string,
    draft: Pick<ContentDraft, 'body' | 'meta'>,
  ): Promise<NetResult<void>>
  discardDraft(kind: ContentKind, id: string): Promise<NetResult<void>>
  /** Publishes the draft as the item's new version, then lets the draft go; resolves to the version. */
  publish(kind: ContentKind, id: string): Promise<NetResult<string>>
  /** The versions kept, the newest first. */
  versions(kind: ContentKind, id: string): Promise<NetResult<readonly KeptVersion[]>>
  /** Publishes a kept version again as the item's. */
  restore(kind: ContentKind, id: string, version: string): Promise<NetResult<void>>
}
