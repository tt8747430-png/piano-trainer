import { describe, expect, it } from 'vitest'
import { emailProblem, MIN_PASSWORD, passwordProblem } from './fields'

describe('the account fields', () => {
  it('takes an address with a name, an @ and a domain', () => {
    expect(emailProblem(' ana@example.com ')).toBeUndefined()
    expect(emailProblem('')).toBe('email')
    expect(emailProblem('ana@example')).toBe('email')
    expect(emailProblem('ana example.com')).toBe('email')
  })

  it('takes a password of at least eight characters', () => {
    expect(MIN_PASSWORD).toBe(8)
    expect(passwordProblem('12345678')).toBeUndefined()
    expect(passwordProblem('1234567')).toBe('password')
  })
})
