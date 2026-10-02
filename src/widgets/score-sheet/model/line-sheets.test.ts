import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { createLineSheets } from './line-sheets'

const music = {
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C', 'D G'] }],
  melody: 'B4/4 | C5/4 | r/4 | r/4',
} as const

describe('the sheet’s lines as written', () => {
  it('keeps a line that did not change, and writes again only the one that did', () => {
    const sheetsOf = createLineSheets()
    const [first, second] = sheetsOf(readDraft(music))
    const [firstAgain, secondAgain] = sheetsOf(
      readDraft({ ...music, melody: 'B4/4 | C5/4 | A4/4 | r/4' }),
    )
    expect(firstAgain).toBe(first)
    expect(secondAgain).not.toBe(second)
    expect(secondAgain?.music.notes.map((n) => n.midi)).toEqual([69])
  })

  it('keeps a line whose music is the same but stands later in the piece apart from it', () => {
    const sheetsOf = createLineSheets()
    const [first, second] = sheetsOf(
      readDraft({ ...music, sections: [{ kind: 'verse', lines: ['G', 'G'] }], melody: undefined }),
    )
    expect(second).not.toBe(first)
    expect(second?.line.bars[0]?.index).toBe(1)
    expect(second?.score).toBe(first?.score)
  })
})
