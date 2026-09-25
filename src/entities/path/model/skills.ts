import {
  chordFamily,
  chordSkill,
  qualitiesIn,
  scaleSkill,
  skillOf,
  type SkillId,
} from '@/shared/lib/music'
import type { PathStep } from './types'

/** The step a skill is learned on: a chord quality's family, or its scale. */
export function stepOfSkill(id: SkillId): PathStep {
  const skill = skillOf(id)
  return skill.kind === 'chord'
    ? { kind: 'chords', family: chordFamily(skill.quality) }
    : { kind: 'scale', scale: skill.scale }
}

/** What a step's check asks: every quality of a chord family, a scale's one skill, none for a piece. */
export function skillsOfStep(step: PathStep): SkillId[] {
  switch (step.kind) {
    case 'chords':
      return qualitiesIn(step.family).map(chordSkill)
    case 'scale':
      return [scaleSkill(step.scale)]
    case 'piece':
      return []
  }
}
