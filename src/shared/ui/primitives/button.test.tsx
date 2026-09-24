import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders a button painted from the primary role by default', () => {
    render(<Button>Play</Button>)
    expect(screen.getByRole('button', { name: 'Play' }).className).toContain('bg-primary')
  })

  it('takes its look from a variant, not from ad-hoc classes', () => {
    render(<Button variant="ghost">Later</Button>)
    expect(screen.getByRole('button', { name: 'Later' }).className).not.toContain('bg-primary')
  })
})
