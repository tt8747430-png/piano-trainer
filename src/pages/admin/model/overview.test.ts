import { describe, expect, it } from 'vitest'
import { overviewOf } from './overview'

const NOW = new Date('2026-10-30T12:00:00Z')
const account = (joinedAt: string, lastSignInAt: string | null) => ({
  id: joinedAt,
  email: '',
  name: '',
  role: 'learner' as const,
  joinedAt,
  lastSignInAt,
})

describe('overviewOf', () => {
  it('counts accounts, the week’s new and active ones, its errors, open reports and drafts', () => {
    const overview = overviewOf(
      {
        accounts: [
          account('2026-10-29T10:00:00Z', '2026-10-30T09:00:00Z'),
          account('2026-09-01T10:00:00Z', '2026-10-25T09:00:00Z'),
          account('2026-09-01T10:00:00Z', null),
        ],
        errors: [
          { at: '2026-10-29T10:00:00Z', message: 'a', stack: '', path: '/', build: '1' },
          { at: '2026-10-01T10:00:00Z', message: 'b', stack: '', path: '/', build: '1' },
        ],
        reports: 4,
        drafts: [{ published: true }, { published: false }, { published: false }],
      },
      NOW,
    )
    expect(overview).toEqual({
      accounts: '3',
      newThisWeek: 1,
      activeThisWeek: 2,
      errorsThisWeek: 1,
      reports: 4,
      drafts: 3,
      unpublished: 2,
    })
  })

  it('says a full first page of accounts is more', () => {
    const accounts = Array.from({ length: 50 }, () => account('2026-01-01T00:00:00Z', null))
    expect(overviewOf({ accounts, errors: [], reports: 0, drafts: [] }, NOW, 50).accounts).toBe(
      '50+',
    )
  })
})
