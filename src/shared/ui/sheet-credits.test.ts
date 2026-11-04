import { describe, expect, it } from 'vitest'
import { CREDITS_GAP, creditsRoom, hasCredits, type SheetCreditLines } from './sheet-credits'

describe('a score’s credits under its title (A28)', () => {
  it('takes the subtitle’s and the tune’s rows, then the taller side', () => {
    expect(
      creditsRoom({ subtitle: 'Hymn', tune: 'NEW BRITAIN', lyricist: 'Newton', translator: 'X' }),
    ).toBe(CREDITS_GAP + 24 * 4)
    expect(creditsRoom({ composer: 'Bach', arranger: 'Me', lyricist: 'Luther' })).toBe(
      CREDITS_GAP + 24 * 2,
    )
  })

  it('prints nothing for a score with only its source, year or copyright', () => {
    // A score's header as kept: its source, year and copyright beside the lines it prints.
    const kept: SheetCreditLines & Record<'source' | 'year' | 'copyright', string> = {
      source: 'Hymnal',
      year: '1779',
      copyright: 'Public domain',
    }
    expect(hasCredits(kept)).toBe(false)
    expect(creditsRoom(kept)).toBe(0)
  })
})
