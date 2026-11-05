import { describe, expect, it } from 'vitest'
import { FEEDBACK_PREFIX, feedbackText } from './feedback'

describe('a learner’s own report among the error reports (R32)', () => {
  it('reads the text a report carries after its prefix', () => {
    expect(feedbackText(`${FEEDBACK_PREFIX}The keys are small`)).toBe('The keys are small')
  })

  it('tells an error from a report', () => {
    expect(feedbackText('TypeError: Report: x')).toBeNull()
  })
})
