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
    const silent = { rh: 'r/4 | r/4 | r/4 | r/4', lh: 'r/4 | r/4 | r/4 | r/4' }
    const [first, second] = sheetsOf(readDraft({ ...music, hands: silent }))
    const [firstAgain, secondAgain] = sheetsOf(
      readDraft({ ...music, hands: silent, melody: 'B4/4 | C5/4 | A4/4 | r/4' }),
    )
    expect(firstAgain).toBe(first)
    expect(secondAgain).not.toBe(second)
    expect(secondAgain?.music.notes.map((n) => n.midi)).toEqual([69])
  })

  it('keeps a line whose music is the same but stands later in the piece apart from it', () => {
    const sheetsOf = createLineSheets()
    // The first line's tempo sets it apart: the second and third are the same music.
    const [, second, third] = sheetsOf(
      readDraft({
        ...music,
        sections: [{ kind: 'verse', lines: ['G', 'G', 'G'] }],
        melody: undefined,
      }),
    )
    expect(third).not.toBe(second)
    expect(third?.line.bars[0]?.index).toBe(2)
    expect(third?.score).toBe(second?.score)
  })

  it('tells each line what the next starts in, so a key change is printed at the end of the line before', () => {
    const sheetsOf = createLineSheets()
    const [verse, chorus] = sheetsOf(
      readDraft({
        ...music,
        sections: [
          { kind: 'verse', lines: ['G C'] },
          { kind: 'chorus', key: 'D', lines: ['D G'] },
        ],
        melody: undefined,
      }),
    )
    expect(verse?.next?.key).toEqual(chorus?.score.measures[0]?.key)
    expect(verse?.next?.key?.tonic.letter).toBe('D')
    expect(chorus?.next).toBeUndefined()
  })
})
