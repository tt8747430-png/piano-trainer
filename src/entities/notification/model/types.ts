/** What a notification tells of (B1): a level reached, a badge's tier, a milestone, a streak, an accuracy. */
export const NOTICE_KINDS = ['level', 'tier', 'milestone', 'streak', 'accuracy'] as const
export type NoticeKind = (typeof NOTICE_KINDS)[number]

/**
 * One notification: its kind and what it names (`ref`: a level's number, a tier's `streak:2`, a
 * milestone's id, a streak's days, an accuracy's percent), when it came and whether it was opened.
 */
export interface Notice {
  /** `kind:ref`: a crossing has one notice, never two. */
  readonly id: string
  readonly kind: NoticeKind
  readonly ref: string
  /** An ISO date. */
  readonly at: string
  readonly read: boolean
}

/** The most notifications kept: the newest. */
export const NOTICES_KEPT = 100

/** A crossing's notice, unread. */
export const noticeOf = (kind: NoticeKind, ref: string, at: string): Notice => ({
  id: `${kind}:${ref}`,
  kind,
  ref,
  at,
  read: false,
})

/** The notices with `added` first, newest first: one a crossing (an id kept is never added again), at most `NOTICES_KEPT`. */
export function withNotices(notices: readonly Notice[], added: readonly Notice[]): Notice[] {
  const held = new Set(notices.map((notice) => notice.id))
  const fresh = added.filter((notice) => !held.has(notice.id) && (held.add(notice.id), true))
  return [...fresh.toReversed(), ...notices].slice(0, NOTICES_KEPT)
}
