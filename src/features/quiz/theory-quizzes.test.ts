import { describe, expect, it } from 'vitest'
import { DEFAULT_QUIZ_CHOICE } from '@/entities/settings'
import { chordSkill, qualitiesIn, scaleSkill } from '@/shared/lib/music'
import { theoryQuizConfig } from './theory-quizzes'

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
