import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('lets a later utility win over a conflicting earlier one', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy inputs and flattens conditionals', () => {
    const active = false
    expect(
      cn('rounded-lg', active && 'bg-primary', { 'text-muted-foreground': !active }, undefined),
    ).toBe('rounded-lg text-muted-foreground')
  })

  it('treats the chord-role tokens as colours, not as sizes', () => {
    expect(cn('bg-role-root text-on-role', 'text-sm', 'bg-role-3rd')).toBe(
      'text-on-role text-sm bg-role-3rd',
    )
  })
})
