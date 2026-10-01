import { describe, expect, it } from 'vitest'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
import type { Answer } from '@/entities/progress'
import { chordSkill, qualitiesIn, type SkillId } from '@/shared/lib/music'
import { checkPlan } from './check-plan'

describe('checkPlan', () => {
  it('checks each of a piece’s chords in turn on its own roots, six questions or one each', () => {
    const bz5 = pieceById('bz5')
    if (!bz5) throw new Error('bz5')
    const skills = skillsOfPiece(bz5)
    const plan = checkPlan('piece:bz5')
    const length = Math.max(6, skills.length)
    expect(plan?.length).toBe(length)
    expect(plan?.marks).toBeNull()
    expect(plan?.asks).toEqual({
      kind: 'skills',
      chords: 'build-chord',
      skills,
      roots: chordRootsOfPiece(bz5),
      ordered: true,
    })
  })

  it('asks every quality of a family in turn, as often as each still needs to be Known', () => {
    const qualities = qualitiesIn('tri').map(chordSkill)
    const plan = checkPlan('chords:tri')
    expect(plan?.skills).toEqual(qualities)
    expect(plan?.asks.kind === 'skills' && plan.asks.skills).toEqual([
      ...qualities,
      ...qualities,
      ...qualities,
      ...qualities,
    ])
    expect(plan?.length).toBe(qualities.length * 4)
    expect(plan?.asks.kind === 'skills' && plan.asks.ordered).toBe(true)
    expect(plan?.marks).toBe('chords:tri')
  })

  it('asks a quality already Known once, and one nearly Known as often as it lacks', () => {
    const [known, nearly, ...rest] = qualitiesIn('tri').map(chordSkill)
    if (!known || !nearly) throw new Error('a triad family')
    const right = (count: number) =>
      Array.from({ length: count }, () => ({ correct: true, at: '2026-09-30' }))
    const evidence: Partial<Record<SkillId, readonly Answer[]>> = {
      [known]: right(4),
      [nearly]: right(3),
    }
    const plan = checkPlan('chords:tri', (skill) => evidence[skill] ?? [])
    expect(plan?.asks.kind === 'skills' && plan.asks.skills).toEqual([
      known,
      nearly,
      ...rest,
      ...rest,
      ...rest,
      ...rest,
    ])
  })

  it('builds a scale as often as it still needs to be Known', () => {
    expect(checkPlan('scale:harmonic')).toMatchObject({
      length: 4,
      skills: ['scale:harmonic'],
      marks: 'scale:harmonic',
    })
  })

  it('has no plan for a piece that is not there', () => {
    expect(checkPlan('piece:gone')).toBeNull()
  })
})
