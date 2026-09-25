import { describe, expect, it } from 'vitest'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
import { qualitiesIn } from '@/shared/lib/music'
import { checkPlan } from './check-plan'

describe('checkPlan', () => {
  it('checks a piece’s chords on its own roots, six questions, building them', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const plan = checkPlan('piece:bz5')
    expect(plan?.length).toBe(6)
    expect(plan?.marks).toBeNull()
    expect(plan?.config).toEqual({
      chordMode: 'build-chord',
      scope: { skills: skillsOfPiece(bz5), roots: chordRootsOfPiece(bz5), length: 6 },
    })
  })

  it('asks every quality of a family in turn, twice each', () => {
    const plan = checkPlan('chords:sev')
    const count = qualitiesIn('sev').length
    expect(plan?.length).toBe(Math.max(6, count * 2))
    expect(plan?.config.scope.ordered).toBe(true)
    expect(plan?.marks).toBe('chords:sev')
  })

  it('builds a scale six times', () => {
    expect(checkPlan('scale:harmonic')).toMatchObject({
      length: 6,
      skills: ['scale:harmonic'],
      marks: 'scale:harmonic',
    })
  })

  it('has no plan for a piece that is not there', () => {
    expect(checkPlan('piece:gone')).toBeNull()
  })
})
