import { describe, expect, it } from 'vitest'
import { DEFAULT_QUIZ_CHOICE } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill } from '@/shared/lib/music'
import { chosenSkills, theoryQuizConfig } from './theory-quizzes'

describe('theoryQuizConfig', () => {
  it('builds or names the chosen families’ chords', () => {
    const chords = DEFAULT_QUIZ_CHOICE.families
      .flatMap((family) => qualitiesIn(family))
      .map(chordSkill)
    expect(theoryQuizConfig('build-chord', DEFAULT_QUIZ_CHOICE, [])).toEqual({
      chordMode: 'build-chord',
      scope: { skills: chords },
    })
    expect(theoryQuizConfig('name-chord', DEFAULT_QUIZ_CHOICE, []).chordMode).toBe('name-chord')
  })

  it('builds the chosen scales', () => {
    expect(theoryQuizConfig('build-scale', DEFAULT_QUIZ_CHOICE, []).scope.skills).toEqual(
      DEFAULT_QUIZ_CHOICE.scales.map(scaleSkill),
    )
  })

  it('asks My gaps in their order', () => {
    expect(
      theoryQuizConfig('gaps', DEFAULT_QUIZ_CHOICE, ['scale:blues', 'chord:m7']).scope,
    ).toEqual({
      skills: ['scale:blues', 'chord:m7'],
      ordered: true,
    })
  })
})

describe('chosenSkills', () => {
  it('asks a chord mode the chosen families’ chords, Build scale the chosen scales', () => {
    const choice = { families: ['tri' as const], scales: ['major' as const] }
    expect(chosenSkills('name-chord', choice)).toEqual(qualitiesIn('tri').map(chordSkill))
    expect(chosenSkills('build-scale', choice)).toEqual([scaleSkill('major')])
    expect(chosenSkills('build-scale', { ...choice, scales: [] })).toEqual([])
  })
})
