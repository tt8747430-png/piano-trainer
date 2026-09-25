import { describe, expect, it } from 'vitest'
import { PATH } from '../content/path'
import { levelOf, pathSteps } from './selectors'
import { LEVELS, stepIdOf } from './types'

describe('path selectors', () => {
  it('read a step’s level', () => {
    expect(levelOf('piece:bz5')).toBe(1)
    expect(levelOf('piece:nope')).toBeUndefined()
  })

  it('walk the path level by level, in order', () => {
    const expected = LEVELS.flatMap((level) =>
      PATH[level].map((step) => ({ id: stepIdOf(step), level, step })),
    )
    expect(pathSteps()).toEqual(expected)
    expect(pathSteps()).toBe(pathSteps())
  })
})
