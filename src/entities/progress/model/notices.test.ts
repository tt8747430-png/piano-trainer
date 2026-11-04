import { describe, expect, it } from 'vitest'
import { NOTICES_KEPT, noticeOf, withNotices } from '@/entities/notification'
import type { ProfileFigures } from './milestones'
import { noticesOf } from './notices'

const AT = '2026-11-04T10:00:00.000Z'
const NONE: ProfileFigures = {
  bestStreak: 0,
  songsLearned: 0,
  lessonsDone: 0,
  keysPractised: 0,
  daysPractised: 0,
  libraryBuilt: 0,
  practiceSeconds: 0,
  recordings: 0,
  published: 0,
  midi: 0,
  bestAccuracy: 0,
}

describe('noticesOf', () => {
  it('one notice per crossing, none twice', () => {
    const after = {
      ...NONE,
      practiceSeconds: 40 * 60,
      songsLearned: 5,
      bestStreak: 3,
      bestAccuracy: 96,
    }
    expect(noticesOf(NONE, after, AT).map((notice) => notice.id)).toEqual([
      'level:2',
      'tier:streak:1',
      'tier:repertoire:1',
      'tier:repertoire:2',
      'milestone:first-song',
      'streak:3',
      'accuracy:96',
    ])
    // Nothing crossed: nothing said.
    expect(noticesOf(after, after, AT)).toEqual([])
    // The same crossing heard twice is kept once.
    const kept = withNotices(noticesOf(NONE, after, AT), noticesOf(NONE, after, AT))
    expect(kept).toHaveLength(7)
  })

  it('says no streak of a single day', () => {
    expect(noticesOf(NONE, { ...NONE, bestStreak: 1 }, AT)).toEqual([])
  })

  it('keeps at most 100', () => {
    const many = Array.from({ length: 120 }, (_, i) => noticeOf('accuracy', String(i), AT))
    const kept = withNotices([], many)
    expect(kept).toHaveLength(NOTICES_KEPT)
    // The newest first: the last heard leads.
    expect(kept[0]?.id).toBe('accuracy:119')
  })
})
