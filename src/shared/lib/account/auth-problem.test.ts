import { describe, expect, it } from 'vitest'
import { authProblem } from './auth-problem'

describe('authProblem', () => {
  it('reads the server’s refusals as what the learner can put right', () => {
    const refused = (detail: string) => authProblem({ ok: false, reason: 'refused', detail })
    expect(refused('Invalid login credentials')).toBe('wrongCredentials')
    expect(refused('User already registered')).toBe('emailTaken')
    expect(refused('Password should be at least 6 characters.')).toBe('weakPassword')
    expect(refused('Email rate limit exceeded')).toBe('tooManyTries')
    expect(refused('For security purposes, you can only request this after 42 seconds.')).toBe(
      'tooManyTries',
    )
    expect(refused('Email not confirmed')).toBe('unconfirmed')
    expect(refused('Something else entirely')).toBe('refused')
  })

  it('says offline and failed as they are', () => {
    expect(authProblem({ ok: false, reason: 'offline' })).toBe('offline')
    expect(authProblem({ ok: false, reason: 'failed', detail: 'fetch failed' })).toBe('failed')
  })
})
