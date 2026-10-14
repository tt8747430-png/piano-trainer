import { describe, expect, it } from 'vitest'
import { lessonsIn } from '@/entities/lesson'
import { lessonLearnedId } from '@/entities/progress'
import { lessonToContinue, openModules, withToggled } from './learn-view'

const learnedOn = (entries: readonly (readonly [string, string])[]) =>
  Object.fromEntries(entries.map(([id, date]) => [lessonLearnedId(id), date]))

describe('lessonToContinue', () => {
  it('is none in a tab where nothing is learned', () => {
    expect(lessonToContinue('courses', {})).toBeUndefined()
    expect(lessonToContinue('courses', learnedOn([['finding-home', '2026-10-01']]))).toBeUndefined()
  })

  it('is the first lesson not learned after the one learned last, along its track', () => {
    const learned = learnedOn([
      ['finding-home', '2026-10-01'],
      ['rhythm-and-meter', '2026-10-03'],
      ['reading-notes', '2026-10-02'],
    ])
    expect(lessonToContinue('subjects', learned)?.id).toBe('whole-and-half-steps')
  })

  it('stays in a course: past its last lesson there is none', () => {
    const [first, second] = lessonsIn('seven-types')
    const learned = learnedOn([
      [first?.id ?? '', '2026-10-01'],
      [second?.id ?? '', '2026-10-02'],
    ])
    expect(lessonToContinue('courses', learned)).toBeUndefined()
    expect(lessonToContinue('courses', learnedOn([[first?.id ?? '', '2026-10-01']]))?.id).toBe(
      second?.id,
    )
  })
})

describe('openModules', () => {
  it('opens the module of the lesson to continue with', () => {
    const learned = learnedOn([['finding-home', '2026-10-01']])
    expect([...openModules({ tab: 'subjects' }, learned)]).toEqual(['fundamentals'])
  })

  it('opens the first module not all learned when there is none to continue', () => {
    expect([...openModules({ tab: 'courses' }, {})]).toEqual(['called-to-play'])
    const allCalledToPlay = learnedOn(
      lessonsIn('called-to-play').map((each) => [each.id, '2026-10-01'] as const),
    )
    expect([...openModules({ tab: 'courses' }, allCalledToPlay)]).toEqual(['called-to-play-2'])
  })

  it('opens what the URL says, none when it says none, only the tab’s own', () => {
    expect([...openModules({ tab: 'courses', open: 'gorshkov.seven-types' }, {})]).toEqual([
      'seven-types',
      'gorshkov',
    ])
    expect([...openModules({ tab: 'courses', open: '' }, {})]).toEqual([])
    expect([...openModules({ tab: 'subjects', open: 'gorshkov' }, {})]).toEqual([])
  })
})

describe('withToggled', () => {
  it('writes the modules left open, in the order Learn lists them', () => {
    expect(withToggled(new Set(['gorshkov']), 'called-to-play')).toBe('called-to-play.gorshkov')
    expect(withToggled(new Set(['gorshkov', 'called-to-play']), 'gorshkov')).toBe('called-to-play')
    expect(withToggled(new Set(['gorshkov']), 'gorshkov')).toBe('')
  })
})
