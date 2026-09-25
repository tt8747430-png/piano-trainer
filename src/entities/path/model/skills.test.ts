import { describe, expect, it } from 'vitest'
import { skillsOfStep, stepOfSkill } from './skills'

describe('skills of steps', () => {
  it('name every quality of a chord family', () => {
    expect(skillsOfStep({ kind: 'chords', family: 'sev' })).toEqual([
      'chord:maj7',
      'chord:m7',
      'chord:d7',
      'chord:hd',
      'chord:o7',
      'chord:mM7',
      'chord:sus7',
      'chord:M7s11',
      'chord:M7s5',
    ])
  })

  it('name a scale step’s one skill, and none for a piece', () => {
    expect(skillsOfStep({ kind: 'scale', scale: 'blues' })).toEqual(['scale:blues'])
    expect(skillsOfStep({ kind: 'piece', pieceId: 'bz5' })).toEqual([])
  })

  it('find the step a skill belongs to', () => {
    expect(stepOfSkill('chord:m9')).toEqual({ kind: 'chords', family: 'nin' })
    expect(stepOfSkill('scale:blues')).toEqual({ kind: 'scale', scale: 'blues' })
  })
})
