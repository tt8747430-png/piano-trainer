import { createMemoryHistory } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createAppRouter } from './router'
import { RouteError } from './RouteError'

describe('RouteError', () => {
  it('says something went wrong and offers a reload', async () => {
    const reload = vi.fn()
    const user = userEvent.setup()
    render(<RouteError reload={reload} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    await user.click(screen.getByRole('button', { name: 'Reload' }))
    expect(reload).toHaveBeenCalledOnce()
  })

  it('is the router’s default error screen', () => {
    const router = createAppRouter(createMemoryHistory())
    expect(router.options.defaultErrorComponent).toBe(RouteError)
  })
})
