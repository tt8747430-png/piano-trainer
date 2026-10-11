import { describe, expect, it } from 'vitest'
import { pieceById, skillsOfPiece } from '@/entities/piece'
import { myGaps } from './my-gaps'

const wrong = [{ correct: false, at: '2026-09-01T10:00:00Z' }]

describe('myGaps', () => {
  it('puts gaps first, then unknown skills of pieces the learner has opened', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const gaps = myGaps({ 'scale:blues': wrong }, { bz5: '2026-09-02T10:00:00Z' })
    expect(gaps[0]).toBe('scale:blues')
    expect(gaps.slice(1)).toEqual(skillsOfPiece(bz5))
  })

  it('asks a Known skill again once its last answer is two weeks old, after the gaps', () => {
    const known = (at: string) => Array.from({ length: 5 }, () => ({ correct: true, at }))
    const answers = {
      'scale:blues': wrong,
      'chord:m7': known('2026-09-01T10:00:00Z'),
      'chord:maj7': known('2026-09-20T10:00:00Z'),
    }
    expect(myGaps(answers, {}, new Date('2026-09-25T10:00:00Z'))).toEqual([
      'scale:blues',
      'chord:m7',
    ])
    expect(myGaps(answers, {}, new Date('2026-09-10T10:00:00Z'))).toEqual(['scale:blues'])
  })

  it('skips a practised piece the app no longer has', () => {
    expect(myGaps({}, { gone: '2026-09-02T10:00:00Z' })).toEqual([])
  })
})
