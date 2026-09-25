import { describe, expect, it } from 'vitest'
import { SKILLS, chordSkill, isSkillId, scaleSkill, skillOf } from './skill'

describe('skills', () => {
  it('are one per chord quality, then one per scale kind', () => {
    expect(SKILLS).toHaveLength(40)
    expect(SKILLS[0]).toBe('chord:maj')
    expect(SKILLS[33]).toBe('scale:major')
    expect(new Set(SKILLS).size).toBe(40)
  })

  it('read back what they name', () => {
    expect(skillOf(chordSkill('m7'))).toEqual({ kind: 'chord', quality: 'm7' })
    expect(skillOf(scaleSkill('harmonic'))).toEqual({ kind: 'scale', scale: 'harmonic' })
  })

  it.each([
    ['chord:m7', true],
    ['scale:blues', true],
    ['chord:x', false],
    ['scale:', false],
    ['chord:constructor', false],
    [5, false],
    [null, false],
  ])('isSkillId(%j) is %s', (value, expected) => {
    expect(isSkillId(value)).toBe(expected)
  })
})
