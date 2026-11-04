/**
 * The Profile's badges (B1, as Quizlet's and memory-palaces'): six, each in four tiers, earned from
 * the learner's figures; one table of thresholds, so a badge's page, its row and the next milestone
 * read the same numbers.
 */

/** What the badges are earned by: the learner's record and library, gathered by the Profile. */
export interface BadgeFigures {
  /** The most days practised in a row. */
  readonly bestStreak: number
  readonly songsLearned: number
  readonly lessonsDone: number
  /** The keys practised, of 24: a scale or a key's chords played in it. */
  readonly keysPractised: number
  readonly daysPractised: number
  /** The learner's own songs and folders. */
  readonly libraryBuilt: number
}

export const TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const
export type Tier = (typeof TIERS)[number]

export interface BadgeDef {
  readonly id: 'streak' | 'repertoire' | 'lessons' | 'scales' | 'devotion' | 'library'
  readonly figure: keyof BadgeFigures
  /** Each tier's goal, bronze to platinum. */
  readonly tiers: readonly [number, number, number, number]
}

export type BadgeId = BadgeDef['id']

/** The thresholds, one table (`.scratch/r29/profile/spec.md`). */
export const BADGES: readonly BadgeDef[] = [
  { id: 'streak', figure: 'bestStreak', tiers: [3, 7, 30, 100] },
  { id: 'repertoire', figure: 'songsLearned', tiers: [1, 5, 15, 40] },
  { id: 'lessons', figure: 'lessonsDone', tiers: [1, 10, 30, 75] },
  { id: 'scales', figure: 'keysPractised', tiers: [3, 8, 15, 24] },
  { id: 'devotion', figure: 'daysPractised', tiers: [7, 30, 100, 365] },
  { id: 'library', figure: 'libraryBuilt', tiers: [1, 5, 15, 40] },
]

/** A badge as the learner stands: tiers earned, the highest one's name, the figure and the next goal. */
export interface Badge {
  readonly id: BadgeId
  readonly figure: keyof BadgeFigures
  readonly earned: number
  readonly tier: Tier | null
  readonly have: number
  /** The next tier's goal; null with all four earned. */
  readonly next: number | null
  readonly tiers: BadgeDef['tiers']
}

export function badgesOf(figures: BadgeFigures): Badge[] {
  return BADGES.map(({ id, figure, tiers }) => {
    const have = figures[figure]
    const earned = tiers.filter((goal) => have >= goal).length
    return {
      id,
      figure,
      earned,
      tier: earned === 0 ? null : (TIERS[earned - 1] ?? null),
      have,
      next: tiers[earned] ?? null,
      tiers,
    }
  })
}

/**
 * The closest unearned tier, for the Profile's "Almost there" card: the one the learner is the
 * greatest share of the way to (from the tier before it), ties to the fewest left.
 */
export function nextMilestone(figures: BadgeFigures): {
  readonly id: BadgeId
  readonly tier: Tier
  readonly goal: number
  readonly left: number
} | null {
  const candidates = badgesOf(figures).flatMap((badge) => {
    if (badge.next === null) return []
    const from = badge.tiers[badge.earned - 1] ?? 0
    const share = (badge.have - from) / (badge.next - from)
    const tier = TIERS[badge.earned]
    return tier
      ? [{ id: badge.id, tier, goal: badge.next, left: badge.next - badge.have, share }]
      : []
  })
  const best = candidates.toSorted((a, b) => b.share - a.share || a.left - b.left)[0]
  if (!best) return null
  const { share: _share, ...milestone } = best
  return milestone
}

export const isBadgeId = (value: unknown): value is BadgeId =>
  BADGES.some((badge) => badge.id === value)
