import { describe, expect, it } from 'vitest'
import type { Answer } from '@/entities/progress'
import { chordSkill, qualitiesIn, type SkillId } from '@/shared/lib/music'
import { checkPlan } from './check-plan'

describe('checkPlan', () => {
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
    })
  })

  it('has no plan for a lesson, which is read, or a song, which is played', () => {
    expect(checkPlan('piece:bz5')).toBeNull()
    expect(checkPlan('lesson:triads')).toBeNull()
    expect(checkPlan('course:rhythm-basics/note-values')).toBeNull()
  })
})
