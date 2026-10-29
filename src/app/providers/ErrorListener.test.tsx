import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeErrorReporter } from '@/shared/api/errors'
import { ErrorReportsProvider } from '@/shared/lib/error-reports'
import { ErrorListener } from './ErrorListener'

describe('ErrorListener', () => {
  it('reports an error never caught and a promise rejected unheard, until it is gone', () => {
    const errors = createFakeErrorReporter()
    const view = render(
      <ErrorReportsProvider reporter={errors}>
        <ErrorListener />
      </ErrorReportsProvider>,
    )
    window.dispatchEvent(
      new ErrorEvent('error', { error: new Error('Uncaught'), message: 'Uncaught' }),
    )
    const rejected = new Event('unhandledrejection')
    Object.assign(rejected, { reason: new Error('Unheard') })
    window.dispatchEvent(rejected)
    expect(errors.sent.map((report) => report.message)).toEqual(['Uncaught', 'Unheard'])
    view.unmount()
    window.dispatchEvent(new ErrorEvent('error', { error: new Error('Later') }))
    expect(errors.sent).toHaveLength(2)
  })
})
