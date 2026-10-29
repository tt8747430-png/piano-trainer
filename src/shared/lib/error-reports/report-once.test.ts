import { describe, expect, it } from 'vitest'
import { createFakeErrorReporter } from '@/shared/api/errors'
import { REPORTS_A_RUN, reportOnce } from './report-once'

describe('reporting what went wrong', () => {
  it('reports an error once a run, with its stack and where it happened', () => {
    const port = createFakeErrorReporter()
    const report = reportOnce(port)
    const error = new Error('Boom')
    report(error, '/songs')
    report(new Error('Boom'), '/play/x')
    expect(port.sent).toEqual([{ message: 'Boom', stack: error.stack, path: '/songs' }])
  })

  it('reports what was thrown that is no Error by what it says', () => {
    const port = createFakeErrorReporter()
    reportOnce(port)('a string', '/')
    expect(port.sent).toEqual([{ message: 'a string', stack: '', path: '/' }])
  })

  it('reports no more than a few things a run', () => {
    const port = createFakeErrorReporter()
    const report = reportOnce(port)
    for (let i = 0; i < REPORTS_A_RUN + 5; i++) report(new Error(`E${i}`), '/')
    expect(port.sent).toHaveLength(REPORTS_A_RUN)
  })
})
