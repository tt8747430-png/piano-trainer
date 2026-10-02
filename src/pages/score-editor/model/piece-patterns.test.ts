import { describe, expect, it } from 'vitest'
import { draftFit, readDraft } from '@/features/score-editor'
import { piecePatterns } from './piece-patterns'

const fitOf = (melody?: string) =>
  draftFit(
    readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['C G'] }],
      ...(melody ? { melody } : {}),
    }),
  )
const ids = (groups: ReturnType<typeof piecePatterns>) =>
  groups.flatMap((group) => group.options.map((option) => option.value))

describe('piecePatterns', () => {
  it('lists the built-in patterns the music can play, by group', () => {
    const groups = piecePatterns(fitOf(), 'r1', 'en')
    expect(groups.map((group) => group.label)).toContain('7 types of accompaniment (Боброва)')
    expect(ids(groups)).toContain('r1')
    expect(ids(groups)).not.toContain('r7')
    expect(ids(piecePatterns(fitOf('E4/4'), 'r1', 'en'))).toContain('r7')
  })

  it('keeps the piece’s own pattern in the list though its music can no longer play it', () => {
    expect(ids(piecePatterns(fitOf(), 'r7', 'en'))).toContain('r7')
  })
})
